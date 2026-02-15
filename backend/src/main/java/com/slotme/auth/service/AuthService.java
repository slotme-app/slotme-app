package com.slotme.auth.service;

import com.slotme.auth.dto.AuthResponse;
import com.slotme.auth.dto.LoginRequest;
import com.slotme.auth.dto.PasswordResetConfirmDto;
import com.slotme.auth.dto.PasswordResetRequestDto;
import com.slotme.auth.dto.RegisterRequest;
import com.slotme.auth.dto.UserProfileResponse;
import com.slotme.auth.entity.PasswordResetToken;
import com.slotme.auth.entity.RefreshToken;
import com.slotme.auth.entity.User;
import com.slotme.auth.entity.UserRole;
import com.slotme.auth.repository.PasswordResetTokenRepository;
import com.slotme.auth.repository.RefreshTokenRepository;
import com.slotme.auth.repository.UserRepository;
import com.slotme.common.exception.ConflictException;
import com.slotme.common.exception.ResourceNotFoundException;
import com.slotme.config.JwtProperties;
import com.slotme.salon.entity.Salon;
import com.slotme.salon.repository.SalonRepository;
import com.slotme.security.JwtService;
import com.slotme.tenant.entity.Tenant;
import com.slotme.tenant.repository.TenantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final int PASSWORD_RESET_EXPIRY_HOURS = 1;

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final SalonRepository salonRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       TenantRepository tenantRepository,
                       SalonRepository salonRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       JwtService jwtService,
                       JwtProperties jwtProperties,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.salonRepository = salonRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check email uniqueness globally before creating tenant/salon
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ConflictException("User with this email already exists");
        }

        String tenantName = request.resolvedTenantName();
        String slug = generateSlug(tenantName);

        if (tenantRepository.existsBySlug(slug)) {
            throw new ConflictException("Tenant with this name already exists");
        }

        // Create tenant
        Tenant tenant = new Tenant();
        tenant.setName(tenantName);
        tenant.setSlug(slug);
        tenant = tenantRepository.save(tenant);

        // Create salon
        Salon salon = new Salon();
        salon.setTenantId(tenant.getId());
        salon.setName(request.salonName());
        salon.setSlug(generateSlug(request.salonName()));
        salon.setTimezone(request.timezone() != null ? request.timezone() : "UTC");
        salon = salonRepository.save(salon);

        // Check email uniqueness
        if (userRepository.existsByTenantIdAndEmail(tenant.getId(), request.email())) {
            throw new ConflictException("User with this email already exists");
        }

        // Create admin user
        User user = new User();
        user.setTenantId(tenant.getId());
        user.setSalonId(salon.getId());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.resolvedFirstName());
        user.setLastName(request.resolvedLastName());
        user.setPhone(request.phone());
        user.setRole(UserRole.SALON_ADMIN);
        user = userRepository.save(user);

        return buildAuthResponse(user, tenant.getId(), salon.getId());
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        return buildAuthResponse(user, user.getTenantId(), user.getSalonId());
    }

    @Transactional
    public AuthResponse refresh(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new BadCredentialsException("Refresh token expired");
        }

        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", refreshToken.getUserId()));

        // Rotate refresh token
        refreshTokenRepository.delete(refreshToken);

        return buildAuthResponse(user, user.getTenantId(), user.getSalonId());
    }

    public UserProfileResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        return new UserProfileResponse(
                user.getId().toString(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getRole().name(),
                user.getTenantId().toString(),
                user.getSalonId() != null ? user.getSalonId().toString() : null
        );
    }

    @Transactional
    public void requestPasswordReset(PasswordResetRequestDto request) {
        // Always return success to prevent email enumeration
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            // Delete any existing reset tokens for this user
            passwordResetTokenRepository.deleteByUserId(user.getId());

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUserId(user.getId());
            resetToken.setToken(UUID.randomUUID().toString());
            resetToken.setExpiresAt(Instant.now().plus(PASSWORD_RESET_EXPIRY_HOURS, ChronoUnit.HOURS));
            passwordResetTokenRepository.save(resetToken);

            // TODO: Send password reset email with token
            log.info("Password reset token generated for user: {}", user.getEmail());
        });
    }

    @Transactional
    public void confirmPasswordReset(PasswordResetConfirmDto request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new BadCredentialsException("Invalid or expired reset token"));

        if (resetToken.getExpiresAt().isBefore(Instant.now())) {
            passwordResetTokenRepository.delete(resetToken);
            throw new BadCredentialsException("Password reset token has expired");
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", resetToken.getUserId()));

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        // Clean up the used token
        passwordResetTokenRepository.delete(resetToken);

        log.info("Password reset completed for user: {}", user.getEmail());
    }

    private AuthResponse buildAuthResponse(User user, UUID tenantId, UUID salonId) {
        String accessToken = jwtService.generateAccessToken(
                user.getId(), tenantId, salonId, user.getRole().name(), user.getEmail());

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiresAt(Instant.now().plusMillis(jwtProperties.refreshTokenExpirationMs()));
        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                jwtProperties.accessTokenExpirationMs() / 1000,
                new AuthResponse.UserInfo(
                        user.getId().toString(),
                        user.getEmail(),
                        user.getRole().name(),
                        tenantId.toString(),
                        salonId != null ? salonId.toString() : null,
                        user.getFirstName(),
                        user.getLastName()
                )
        );
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}

package com.slotme.security;

import com.slotme.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final JwtProperties jwtProperties;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.signingKey = Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(UUID userId, UUID tenantId, UUID salonId, String role, String email) {
        return Jwts.builder()
                .subject(userId.toString())
                .claims(Map.of(
                        "tenant_id", tenantId.toString(),
                        "salon_id", salonId != null ? salonId.toString() : "",
                        "role", role,
                        "email", email
                ))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtProperties.accessTokenExpirationMs()))
                .signWith(signingKey)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = parseToken(token);
            return !claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public UUID getUserIdFromToken(String token) {
        return UUID.fromString(parseToken(token).getSubject());
    }

    public UUID getTenantIdFromToken(String token) {
        String tenantId = parseToken(token).get("tenant_id", String.class);
        return UUID.fromString(tenantId);
    }

    public UUID getSalonIdFromToken(String token) {
        String salonId = parseToken(token).get("salon_id", String.class);
        return (salonId != null && !salonId.isBlank()) ? UUID.fromString(salonId) : null;
    }

    public String getRoleFromToken(String token) {
        return parseToken(token).get("role", String.class);
    }
}

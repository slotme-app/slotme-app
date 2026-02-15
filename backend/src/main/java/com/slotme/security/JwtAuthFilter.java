package com.slotme.security;

import com.slotme.tenant.TenantAwareAuthDetails;
import com.slotme.tenant.TenantContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
@Order(1)
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain chain) throws ServletException, IOException {
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);

        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            String token = authHeader.substring(BEARER_PREFIX.length());

            if (jwtService.isTokenValid(token)) {
                UUID userId = jwtService.getUserIdFromToken(token);
                UUID tenantId = jwtService.getTenantIdFromToken(token);
                UUID salonId = jwtService.getSalonIdFromToken(token);
                String role = jwtService.getRoleFromToken(token);

                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
                var authentication = new UsernamePasswordAuthenticationToken(
                        userId.toString(), null, authorities);
                authentication.setDetails(new TenantAwareAuthDetails(tenantId, salonId));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                TenantContext.setCurrentTenant(tenantId);

                log.debug("Authenticated user {} with role {} for tenant {}", userId, role, tenantId);
            }
        }

        chain.doFilter(request, response);
    }
}

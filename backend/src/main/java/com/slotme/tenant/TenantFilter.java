package com.slotme.tenant;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@Component
@Order(2)
public class TenantFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(TenantFilter.class);
    private static final String TENANT_HEADER = "X-Tenant-ID";

    private static final Set<String> PUBLIC_PATHS = Set.of(
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/refresh",
            "/api/v1/auth/forgot-password",
            "/api/v1/auth/reset-password",
            "/api/v1/webhooks/",
            "/actuator/",
            "/swagger-ui",
            "/api-docs"
    );

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain chain) throws ServletException, IOException {
        try {
            UUID tenantId = resolveTenantId(request);
            if (tenantId != null) {
                TenantContext.setCurrentTenant(tenantId);
                log.debug("Tenant context set: {}", tenantId);
            }
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    private UUID resolveTenantId(HttpServletRequest request) {
        // Priority 1: Extract from JWT claims (set by JwtAuthFilter)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getDetails() instanceof TenantAwareAuthDetails details) {
            return details.tenantId();
        }

        // Priority 2: X-Tenant-ID header (service-to-service calls)
        String headerValue = request.getHeader(TENANT_HEADER);
        if (headerValue != null && !headerValue.isBlank()) {
            try {
                return UUID.fromString(headerValue);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid X-Tenant-ID header value: {}", headerValue);
            }
        }

        return null;
    }
}

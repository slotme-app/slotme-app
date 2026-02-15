package com.slotme.security;

import com.slotme.tenant.TenantAwareAuthDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new IllegalStateException("No authenticated user");
        }
        return UUID.fromString(auth.getName());
    }

    public static UUID getCurrentTenantId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof TenantAwareAuthDetails details) {
            return details.tenantId();
        }
        throw new IllegalStateException("No tenant context in authentication");
    }

    public static UUID getCurrentSalonId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof TenantAwareAuthDetails details) {
            return details.salonId();
        }
        return null;
    }

    public static boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    public static boolean isSalonAdmin() {
        return hasRole("SALON_ADMIN");
    }

    public static boolean isMaster() {
        return hasRole("MASTER");
    }

    public static boolean isSuperAdmin() {
        return hasRole("SUPER_ADMIN");
    }
}

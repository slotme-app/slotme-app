package com.slotme.tenant;

import java.util.UUID;

public final class TenantContext {

    private static final InheritableThreadLocal<UUID> CURRENT_TENANT = new InheritableThreadLocal<>();

    private TenantContext() {}

    public static UUID getCurrentTenantId() {
        return CURRENT_TENANT.get();
    }

    public static void setCurrentTenant(UUID tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }

    public static UUID requireCurrentTenantId() {
        UUID tenantId = CURRENT_TENANT.get();
        if (tenantId == null) {
            throw new IllegalStateException("No tenant context set for current request");
        }
        return tenantId;
    }
}

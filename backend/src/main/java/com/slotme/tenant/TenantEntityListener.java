package com.slotme.tenant;

import com.slotme.common.entity.TenantAwareEntity;
import jakarta.persistence.PrePersist;

import java.util.UUID;

public class TenantEntityListener {

    @PrePersist
    public void setTenantId(Object entity) {
        if (entity instanceof TenantAwareEntity tenantAware) {
            if (tenantAware.getTenantId() == null) {
                UUID currentTenantId = TenantContext.getCurrentTenantId();
                if (currentTenantId != null) {
                    tenantAware.setTenantId(currentTenantId);
                }
            }
        }
    }
}

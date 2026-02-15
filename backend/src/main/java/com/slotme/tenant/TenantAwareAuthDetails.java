package com.slotme.tenant;

import java.util.UUID;

public record TenantAwareAuthDetails(
        UUID tenantId,
        UUID salonId
) {}

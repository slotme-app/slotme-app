package com.slotme.client.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ClientProfileResponse(
        String id,
        String salonId,
        String firstName,
        String lastName,
        String phone,
        String email,
        String notes,
        List<String> tags,
        String source,
        Instant lastVisitAt,
        int totalVisits,
        BigDecimal totalSpent,
        String preferredMasterId,
        Instant createdAt
) {}

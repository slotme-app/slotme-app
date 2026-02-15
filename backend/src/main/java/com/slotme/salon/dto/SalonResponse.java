package com.slotme.salon.dto;

import java.time.Instant;
import java.util.Map;

public record SalonResponse(
        String id,
        String tenantId,
        String name,
        String slug,
        String description,
        String phone,
        String email,
        String address,
        String city,
        String country,
        String timezone,
        String currency,
        String logoUrl,
        Map<String, Object> settings,
        String status,
        Instant createdAt,
        Instant updatedAt,
        Object workingHours,
        Object bookingRules
) {}

package com.slotme.client.dto;

import java.time.Instant;
import java.util.List;

public record ClientResponse(
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
        Instant createdAt
) {}

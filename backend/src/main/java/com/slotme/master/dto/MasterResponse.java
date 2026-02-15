package com.slotme.master.dto;

import java.time.Instant;
import java.util.List;

public record MasterResponse(
        String id,
        String salonId,
        String userId,
        String displayName,
        String name,
        String email,
        String phone,
        String bio,
        String specialization,
        String avatarUrl,
        boolean active,
        String status,
        int sortOrder,
        List<String> serviceIds,
        List<String> services,
        Instant createdAt
) {}

package com.slotme.auth.dto;

public record UserProfileResponse(
        String id,
        String email,
        String firstName,
        String lastName,
        String phone,
        String avatarUrl,
        String role,
        String tenantId,
        String salonId
) {}

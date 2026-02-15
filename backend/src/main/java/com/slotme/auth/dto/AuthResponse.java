package com.slotme.auth.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        long expiresIn,
        UserInfo user
) {
    public record UserInfo(
            String id,
            String email,
            String role,
            String tenantId,
            String salonId,
            String firstName,
            String lastName
    ) {}
}

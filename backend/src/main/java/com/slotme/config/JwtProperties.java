package com.slotme.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "slotme.jwt")
public record JwtProperties(
        String secret,
        long accessTokenExpirationMs,
        long refreshTokenExpirationMs
) {
    public JwtProperties {
        if (secret == null || secret.isBlank()) {
            secret = "default-dev-secret-key-must-be-at-least-256-bits-long-for-hs256";
        }
        if (accessTokenExpirationMs <= 0) {
            accessTokenExpirationMs = 3600000; // 1 hour
        }
        if (refreshTokenExpirationMs <= 0) {
            refreshTokenExpirationMs = 2592000000L; // 30 days
        }
    }
}

package com.slotme.messaging.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "slotme.whatsapp")
public record WhatsAppProperties(
        String apiUrl,
        String accessToken,
        String verifyToken,
        String phoneNumberId,
        String appSecret
) {
    public WhatsAppProperties {
        if (apiUrl == null) apiUrl = "https://graph.facebook.com/v21.0";
    }
}

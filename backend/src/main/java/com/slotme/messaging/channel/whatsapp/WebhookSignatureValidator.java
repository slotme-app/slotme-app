package com.slotme.messaging.channel.whatsapp;

import com.slotme.messaging.config.WhatsAppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

@Component
public class WebhookSignatureValidator {

    private static final Logger log = LoggerFactory.getLogger(WebhookSignatureValidator.class);

    private final WhatsAppProperties properties;

    public WebhookSignatureValidator(WhatsAppProperties properties) {
        this.properties = properties;
    }

    public boolean isValid(String payload, String signatureHeader) {
        if (signatureHeader == null || !signatureHeader.startsWith("sha256=")) {
            log.warn("Missing or malformed X-Hub-Signature-256 header");
            return false;
        }

        if (properties.appSecret() == null || properties.appSecret().isBlank()) {
            log.warn("WhatsApp app secret not configured, skipping signature validation");
            return true;
        }

        try {
            String expectedSignature = signatureHeader.substring("sha256=".length());
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(
                    properties.appSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computedSignature = HexFormat.of().formatHex(hash);

            return MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    computedSignature.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("Failed to verify webhook signature", e);
            return false;
        }
    }
}

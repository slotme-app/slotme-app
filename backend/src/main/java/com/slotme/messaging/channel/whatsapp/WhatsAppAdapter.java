package com.slotme.messaging.channel.whatsapp;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.slotme.messaging.channel.ChannelAdapter;
import com.slotme.messaging.channel.ChannelType;
import com.slotme.messaging.channel.InboundMessage;
import com.slotme.messaging.channel.SendResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Component
public class WhatsAppAdapter implements ChannelAdapter {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppAdapter.class);

    private final WhatsAppClient whatsAppClient;
    private final WebhookSignatureValidator signatureValidator;
    private final ObjectMapper objectMapper;

    public WhatsAppAdapter(WhatsAppClient whatsAppClient,
                           WebhookSignatureValidator signatureValidator,
                           ObjectMapper objectMapper) {
        this.whatsAppClient = whatsAppClient;
        this.signatureValidator = signatureValidator;
        this.objectMapper = objectMapper;
    }

    @Override
    public SendResult sendTextMessage(String recipientId, String text) {
        return whatsAppClient.sendTextMessage(recipientId, text);
    }

    @Override
    public SendResult sendTemplateMessage(String recipientId, String templateName,
                                           Map<String, String> params) {
        return whatsAppClient.sendTemplateMessage(recipientId, templateName, "en", params);
    }

    @Override
    public InboundMessage parseWebhook(String rawPayload, Map<String, String> headers) {
        try {
            Map<String, Object> payload = objectMapper.readValue(rawPayload,
                    new TypeReference<>() {});

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> entries = (List<Map<String, Object>>) payload.get("entry");
            if (entries == null || entries.isEmpty()) return null;

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> changes = (List<Map<String, Object>>) entries.getFirst().get("changes");
            if (changes == null || changes.isEmpty()) return null;

            @SuppressWarnings("unchecked")
            Map<String, Object> value = (Map<String, Object>) changes.getFirst().get("value");
            if (value == null) return null;

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> messages = (List<Map<String, Object>>) value.get("messages");
            if (messages == null || messages.isEmpty()) return null;

            Map<String, Object> message = messages.getFirst();
            String from = (String) message.get("from");
            String type = (String) message.get("type");
            String timestamp = (String) message.get("timestamp");

            @SuppressWarnings("unchecked")
            Map<String, Object> metadata = (Map<String, Object>) value.get("metadata");
            String phoneNumberId = metadata != null ? (String) metadata.get("phone_number_id") : null;

            String textContent = extractTextContent(message, type);

            return new InboundMessage(
                    (String) message.get("id"),
                    from,
                    phoneNumberId,
                    ChannelType.WHATSAPP,
                    type,
                    textContent,
                    Map.of("raw_type", type, "phone_number_id", phoneNumberId != null ? phoneNumberId : ""),
                    Instant.ofEpochSecond(Long.parseLong(timestamp))
            );
        } catch (Exception e) {
            log.error("Failed to parse WhatsApp webhook payload", e);
            return null;
        }
    }

    @Override
    public boolean verifyWebhook(String rawPayload, Map<String, String> headers) {
        String signature = headers.get("x-hub-signature-256");
        return signatureValidator.isValid(rawPayload, signature);
    }

    @Override
    public ChannelType getChannelType() {
        return ChannelType.WHATSAPP;
    }

    private String extractTextContent(Map<String, Object> message, String type) {
        return switch (type) {
            case "text" -> {
                @SuppressWarnings("unchecked")
                Map<String, String> text = (Map<String, String>) message.get("text");
                yield text != null ? text.get("body") : "";
            }
            case "interactive" -> {
                @SuppressWarnings("unchecked")
                Map<String, Object> interactive = (Map<String, Object>) message.get("interactive");
                if (interactive != null) {
                    String interactiveType = (String) interactive.get("type");
                    if ("button_reply".equals(interactiveType)) {
                        @SuppressWarnings("unchecked")
                        Map<String, String> buttonReply = (Map<String, String>) interactive.get("button_reply");
                        yield buttonReply != null ? buttonReply.get("title") : "";
                    } else if ("list_reply".equals(interactiveType)) {
                        @SuppressWarnings("unchecked")
                        Map<String, String> listReply = (Map<String, String>) interactive.get("list_reply");
                        yield listReply != null ? listReply.get("title") : "";
                    }
                }
                yield "";
            }
            default -> "";
        };
    }
}

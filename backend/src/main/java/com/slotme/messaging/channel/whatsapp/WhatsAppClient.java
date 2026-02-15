package com.slotme.messaging.channel.whatsapp;

import com.slotme.messaging.channel.SendResult;
import com.slotme.messaging.config.WhatsAppProperties;
import io.micrometer.core.instrument.Counter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
public class WhatsAppClient {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppClient.class);

    private final RestClient restClient;
    private final WhatsAppProperties properties;
    private final Counter whatsappMessageSentCounter;

    public WhatsAppClient(WhatsAppProperties properties,
                           Counter whatsappMessageSentCounter) {
        this.properties = properties;
        this.whatsappMessageSentCounter = whatsappMessageSentCounter;
        this.restClient = RestClient.builder()
                .baseUrl(properties.apiUrl())
                .defaultHeader("Authorization", "Bearer " + properties.accessToken())
                .build();
    }

    public SendResult sendTextMessage(String recipientPhone, String text) {
        try {
            Map<String, Object> body = Map.of(
                    "messaging_product", "whatsapp",
                    "to", recipientPhone,
                    "type", "text",
                    "text", Map.of("body", text)
            );

            Map<?, ?> response = restClient.post()
                    .uri("/{phoneNumberId}/messages", properties.phoneNumberId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("messages")) {
                @SuppressWarnings("unchecked")
                List<Map<String, String>> messages = (List<Map<String, String>>) response.get("messages");
                String messageId = messages.getFirst().get("id");
                whatsappMessageSentCounter.increment();
                return SendResult.success(messageId);
            }
            return SendResult.failure("No message ID in response");
        } catch (Exception e) {
            log.error("Failed to send WhatsApp text message to {}", recipientPhone, e);
            return SendResult.failure(e.getMessage());
        }
    }

    public SendResult sendTemplateMessage(String recipientPhone, String templateName,
                                           String languageCode, Map<String, String> params) {
        try {
            var components = params.entrySet().stream()
                    .map(e -> Map.of("type", "text", "text", e.getValue()))
                    .toList();

            Map<String, Object> body = Map.of(
                    "messaging_product", "whatsapp",
                    "to", recipientPhone,
                    "type", "template",
                    "template", Map.of(
                            "name", templateName,
                            "language", Map.of("code", languageCode),
                            "components", List.of(
                                    Map.of("type", "body", "parameters", components)
                            )
                    )
            );

            Map<?, ?> response = restClient.post()
                    .uri("/{phoneNumberId}/messages", properties.phoneNumberId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("messages")) {
                @SuppressWarnings("unchecked")
                List<Map<String, String>> messages = (List<Map<String, String>>) response.get("messages");
                String messageId = messages.getFirst().get("id");
                whatsappMessageSentCounter.increment();
                return SendResult.success(messageId);
            }
            return SendResult.failure("No message ID in response");
        } catch (Exception e) {
            log.error("Failed to send WhatsApp template message to {}", recipientPhone, e);
            return SendResult.failure(e.getMessage());
        }
    }
}

package com.slotme.messaging.controller;

import com.slotme.messaging.channel.InboundMessage;
import com.slotme.messaging.channel.whatsapp.WhatsAppAdapter;
import com.slotme.messaging.config.WhatsAppProperties;
import com.slotme.messaging.service.MessageRouter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/webhooks/whatsapp")
public class WhatsAppWebhookController {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppWebhookController.class);

    private final WhatsAppAdapter whatsAppAdapter;
    private final WhatsAppProperties properties;
    private final MessageRouter messageRouter;

    public WhatsAppWebhookController(WhatsAppAdapter whatsAppAdapter,
                                      WhatsAppProperties properties,
                                      MessageRouter messageRouter) {
        this.whatsAppAdapter = whatsAppAdapter;
        this.properties = properties;
        this.messageRouter = messageRouter;
    }

    @GetMapping
    public ResponseEntity<String> verify(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.verify_token") String token,
            @RequestParam("hub.challenge") String challenge) {
        if ("subscribe".equals(mode) && properties.verifyToken().equals(token)) {
            log.info("WhatsApp webhook verification successful");
            return ResponseEntity.ok(challenge);
        }
        log.warn("WhatsApp webhook verification failed: mode={}, token mismatch", mode);
        return ResponseEntity.status(403).build();
    }

    @PostMapping
    public ResponseEntity<Void> receive(
            @RequestBody String payload,
            @RequestHeader Map<String, String> headers) {
        // 1. Verify signature
        if (!whatsAppAdapter.verifyWebhook(payload, headers)) {
            log.warn("WhatsApp webhook signature verification failed");
            return ResponseEntity.status(401).build();
        }

        // 2. Parse payload
        InboundMessage message = whatsAppAdapter.parseWebhook(payload, headers);
        if (message == null) {
            // Possibly a status update or non-message event - acknowledge
            return ResponseEntity.ok().build();
        }

        // 3. Route message asynchronously (respond quickly to Meta)
        try {
            messageRouter.routeInboundMessage(message);
        } catch (Exception e) {
            log.error("Error routing inbound WhatsApp message", e);
            // Still return 200 to prevent Meta from retrying
        }

        return ResponseEntity.ok().build();
    }
}

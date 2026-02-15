package com.slotme.messaging.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/salons/{salonId}/conversations")
public class ConversationController {

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN')")
    public ResponseEntity<List<Object>> listConversations(
            @PathVariable UUID salonId) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{conversationId}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN')")
    public ResponseEntity<Map<String, Object>> getConversation(
            @PathVariable UUID salonId,
            @PathVariable UUID conversationId) {
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{conversationId}/messages")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN')")
    public ResponseEntity<List<Object>> getMessages(
            @PathVariable UUID salonId,
            @PathVariable UUID conversationId) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/{conversationId}/messages")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN')")
    public ResponseEntity<Map<String, Object>> sendMessage(
            @PathVariable UUID salonId,
            @PathVariable UUID conversationId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of(
                "id", UUID.randomUUID().toString(),
                "conversationId", conversationId.toString(),
                "content", body.getOrDefault("content", ""),
                "sender", "ADMIN",
                "timestamp", java.time.Instant.now().toString()
        ));
    }

    @PostMapping("/{conversationId}/handoff")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN')")
    public ResponseEntity<Void> handoff(
            @PathVariable UUID salonId,
            @PathVariable UUID conversationId) {
        return ResponseEntity.ok().build();
    }
}

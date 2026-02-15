package com.slotme.messaging.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/salons/{salonId}/channels")
public class ChannelConfigController {

    @GetMapping("/whatsapp")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN')")
    public ResponseEntity<Map<String, Object>> getWhatsAppConfig(@PathVariable UUID salonId) {
        return ResponseEntity.ok(Map.of(
                "phoneNumberId", "",
                "accessToken", "",
                "verifyToken", "",
                "webhookUrl", "",
                "isConnected", false
        ));
    }

    @PutMapping("/whatsapp")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN')")
    public ResponseEntity<Map<String, Object>> updateWhatsAppConfig(
            @PathVariable UUID salonId,
            @RequestBody Map<String, String> config) {
        return ResponseEntity.ok(Map.of(
                "phoneNumberId", config.getOrDefault("phoneNumberId", ""),
                "accessToken", config.getOrDefault("accessToken", ""),
                "verifyToken", config.getOrDefault("verifyToken", ""),
                "webhookUrl", "",
                "isConnected", false
        ));
    }

    @PostMapping("/whatsapp/test")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN')")
    public ResponseEntity<Map<String, Object>> testWhatsAppConnection(@PathVariable UUID salonId) {
        return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "WhatsApp integration not configured yet"
        ));
    }
}

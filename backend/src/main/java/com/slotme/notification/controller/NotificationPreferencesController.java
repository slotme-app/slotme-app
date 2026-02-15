package com.slotme.notification.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/salons/{salonId}/notification-preferences")
public class NotificationPreferencesController {

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Map<String, Boolean>> getPreferences(@PathVariable UUID salonId) {
        return ResponseEntity.ok(defaultPreferences());
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN')")
    public ResponseEntity<Map<String, Boolean>> updatePreferences(
            @PathVariable UUID salonId,
            @RequestBody Map<String, Boolean> preferences) {
        // Stub: return what was sent (no persistence yet)
        Map<String, Boolean> merged = defaultPreferences();
        if (preferences != null) {
            merged.putAll(preferences);
        }
        return ResponseEntity.ok(merged);
    }

    private Map<String, Boolean> defaultPreferences() {
        return new java.util.HashMap<>(Map.of(
                "confirmations", true,
                "reminders", true,
                "cancellations", true,
                "noShows", true,
                "newBookings", true,
                "systemUpdates", true
        ));
    }
}

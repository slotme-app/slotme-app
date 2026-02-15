package com.slotme.notification.controller;

import com.slotme.notification.entity.Notification;
import com.slotme.notification.repository.NotificationRepository;
import com.slotme.notification.repository.NotificationTemplateRepository;
import com.slotme.tenant.TenantContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/salons/{salonId}/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final NotificationTemplateRepository templateRepository;

    public NotificationController(NotificationRepository notificationRepository,
                                  NotificationTemplateRepository templateRepository) {
        this.notificationRepository = notificationRepository;
        this.templateRepository = templateRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Map<String, Object>> listNotifications(
            @PathVariable UUID salonId, Pageable pageable) {
        UUID tenantId = TenantContext.getCurrentTenantId();
        Page<Notification> page = notificationRepository.findByTenantIdOrderByCreatedAtDesc(tenantId, pageable);

        List<Map<String, Object>> content = page.getContent().stream()
                .map(this::toFrontendNotification)
                .toList();

        long totalUnread = notificationRepository.countByTenantIdAndStatus(tenantId, "sent");

        return ResponseEntity.ok(Map.of(
                "content", content,
                "totalUnread", totalUnread
        ));
    }

    @PatchMapping("/{notificationId}/read")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Void> markAsRead(
            @PathVariable UUID salonId,
            @PathVariable UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setStatus("read");
            notificationRepository.save(notification);
        });
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Void> markAllAsRead(@PathVariable UUID salonId) {
        UUID tenantId = TenantContext.getCurrentTenantId();
        List<Notification> unread = notificationRepository.findByTenantIdAndStatus(tenantId, "sent");
        unread.forEach(n -> n.setStatus("read"));
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/templates")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> listTemplates(@PathVariable UUID salonId) {
        var templates = templateRepository.findBySalonId(salonId).stream()
                .map(t -> Map.<String, Object>of(
                        "id", t.getId(),
                        "triggerEvent", t.getTriggerEvent(),
                        "channel", t.getChannel(),
                        "language", t.getLanguage(),
                        "subject", t.getSubject() != null ? t.getSubject() : "",
                        "bodyTemplate", t.getBodyTemplate(),
                        "active", t.isActive()
                ))
                .toList();
        return ResponseEntity.ok(templates);
    }

    @PutMapping("/templates/{id}/toggle")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN', 'SALON_ADMIN')")
    public ResponseEntity<Map<String, Object>> toggleTemplate(
            @PathVariable UUID salonId, @PathVariable UUID id) {
        var template = templateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Template not found: " + id));
        template.setActive(!template.isActive());
        templateRepository.save(template);
        return ResponseEntity.ok(Map.of(
                "id", template.getId(),
                "triggerEvent", template.getTriggerEvent(),
                "channel", template.getChannel(),
                "active", template.isActive()
        ));
    }

    private Map<String, Object> toFrontendNotification(Notification n) {
        return Map.ofEntries(
                Map.entry("id", n.getId().toString()),
                Map.entry("type", n.getChannel() != null ? n.getChannel() : "system"),
                Map.entry("title", "Notification"),
                Map.entry("message", n.getContent() != null ? n.getContent() : ""),
                Map.entry("read", !"sent".equals(n.getStatus()) && !"pending".equals(n.getStatus())),
                Map.entry("createdAt", n.getCreatedAt() != null ? n.getCreatedAt().toString() : Instant.now().toString()),
                Map.entry("resourceType", n.getAppointmentId() != null ? "appointment" : ""),
                Map.entry("resourceId", n.getAppointmentId() != null ? n.getAppointmentId().toString() : "")
        );
    }
}

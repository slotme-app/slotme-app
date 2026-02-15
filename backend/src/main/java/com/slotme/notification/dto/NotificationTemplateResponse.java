package com.slotme.notification.dto;

import com.slotme.notification.entity.NotificationTemplate;

import java.time.Instant;
import java.util.UUID;

public record NotificationTemplateResponse(
        UUID id,
        UUID tenantId,
        UUID salonId,
        String triggerEvent,
        String channel,
        String language,
        String subject,
        String bodyTemplate,
        String whatsappTemplateName,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
    public static NotificationTemplateResponse from(NotificationTemplate t) {
        return new NotificationTemplateResponse(
                t.getId(), t.getTenantId(), t.getSalonId(), t.getTriggerEvent(),
                t.getChannel(), t.getLanguage(), t.getSubject(), t.getBodyTemplate(),
                t.getWhatsappTemplateName(), t.isActive(), t.getCreatedAt(), t.getUpdatedAt()
        );
    }
}

package com.slotme.notification.dto;

import com.slotme.notification.entity.Notification;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        UUID tenantId,
        UUID templateId,
        UUID clientId,
        UUID appointmentId,
        String channel,
        String recipient,
        String content,
        String status,
        String externalId,
        Instant scheduledAt,
        Instant sentAt,
        Instant deliveredAt,
        String failureReason,
        int retryCount,
        Instant createdAt
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
                n.getId(), n.getTenantId(), n.getTemplateId(), n.getClientId(),
                n.getAppointmentId(), n.getChannel(), n.getRecipient(), n.getContent(),
                n.getStatus(), n.getExternalId(), n.getScheduledAt(), n.getSentAt(),
                n.getDeliveredAt(), n.getFailureReason(), n.getRetryCount(), n.getCreatedAt()
        );
    }
}

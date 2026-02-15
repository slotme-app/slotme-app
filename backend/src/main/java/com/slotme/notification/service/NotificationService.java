package com.slotme.notification.service;

import com.slotme.messaging.channel.ChannelAdapter;
import com.slotme.messaging.channel.ChannelType;
import com.slotme.messaging.channel.SendResult;
import com.slotme.notification.entity.Notification;
import com.slotme.notification.entity.NotificationTemplate;
import com.slotme.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private static final int MAX_RETRIES = 3;

    private final NotificationRepository notificationRepository;
    private final NotificationTemplateEngine templateEngine;
    private final List<ChannelAdapter> channelAdapters;

    public NotificationService(NotificationRepository notificationRepository,
                               NotificationTemplateEngine templateEngine,
                               List<ChannelAdapter> channelAdapters) {
        this.notificationRepository = notificationRepository;
        this.templateEngine = templateEngine;
        this.channelAdapters = channelAdapters;
    }

    @Transactional
    public void sendNotification(UUID tenantId, UUID salonId, UUID clientId,
                                 UUID appointmentId, String triggerEvent,
                                 String recipient, Map<String, String> variables) {
        List<NotificationTemplate> templates =
                templateEngine.resolveTemplates(tenantId, salonId, triggerEvent);

        for (NotificationTemplate template : templates) {
            String content = templateEngine.render(template.getBodyTemplate(), variables);

            Notification notification = new Notification();
            notification.setTenantId(tenantId);
            notification.setTemplateId(template.getId());
            notification.setClientId(clientId);
            notification.setAppointmentId(appointmentId);
            notification.setChannel(template.getChannel());
            notification.setRecipient(recipient);
            notification.setContent(content);
            notification.setStatus("pending");
            notificationRepository.save(notification);

            dispatchAsync(notification, template);
        }
    }

    @Transactional
    public void scheduleNotification(UUID tenantId, UUID salonId, UUID clientId,
                                     UUID appointmentId, String triggerEvent,
                                     String recipient, Map<String, String> variables,
                                     Instant scheduledAt) {
        List<NotificationTemplate> templates =
                templateEngine.resolveTemplates(tenantId, salonId, triggerEvent);

        for (NotificationTemplate template : templates) {
            // Avoid duplicate scheduled reminders
            if (notificationRepository.existsByAppointmentAndChannelAndTemplate(
                    appointmentId, template.getChannel(), template.getId())) {
                log.debug("Skipping duplicate notification for appointment={}, channel={}, template={}",
                        appointmentId, template.getChannel(), template.getId());
                continue;
            }

            String content = templateEngine.render(template.getBodyTemplate(), variables);

            Notification notification = new Notification();
            notification.setTenantId(tenantId);
            notification.setTemplateId(template.getId());
            notification.setClientId(clientId);
            notification.setAppointmentId(appointmentId);
            notification.setChannel(template.getChannel());
            notification.setRecipient(recipient);
            notification.setContent(content);
            notification.setStatus("pending");
            notification.setScheduledAt(scheduledAt);
            notificationRepository.save(notification);
        }
    }

    @Async
    public void dispatchAsync(Notification notification, NotificationTemplate template) {
        try {
            dispatch(notification, template);
        } catch (Exception e) {
            log.error("Failed to dispatch notification {}", notification.getId(), e);
        }
    }

    @Transactional
    public void dispatch(Notification notification, NotificationTemplate template) {
        ChannelAdapter adapter = findAdapter(notification.getChannel());
        if (adapter == null) {
            log.warn("No adapter for channel: {}", notification.getChannel());
            notification.setStatus("failed");
            notification.setFailureReason("No adapter for channel: " + notification.getChannel());
            notificationRepository.save(notification);
            return;
        }

        SendResult result;
        if (template != null && template.getWhatsappTemplateName() != null
                && "whatsapp".equals(notification.getChannel())) {
            result = adapter.sendTemplateMessage(
                    notification.getRecipient(),
                    template.getWhatsappTemplateName(),
                    Map.of());
        } else {
            result = adapter.sendTextMessage(notification.getRecipient(), notification.getContent());
        }

        if (result.success()) {
            notification.setStatus("sent");
            notification.setExternalId(result.externalMessageId());
            notification.setSentAt(Instant.now());
        } else {
            notification.setRetryCount(notification.getRetryCount() + 1);
            if (notification.getRetryCount() >= MAX_RETRIES) {
                notification.setStatus("failed");
            }
            notification.setFailureReason(result.errorMessage());
        }
        notificationRepository.save(notification);
    }

    @Scheduled(fixedDelay = 60_000)
    @Transactional
    public void processScheduledNotifications() {
        List<Notification> ready = notificationRepository.findScheduledReady(Instant.now());
        for (Notification notification : ready) {
            NotificationTemplate template = null;
            if (notification.getTemplateId() != null) {
                template = templateEngine.resolveTemplates(
                        notification.getTenantId(), null, "").stream()
                        .filter(t -> t.getId().equals(notification.getTemplateId()))
                        .findFirst().orElse(null);
            }
            dispatch(notification, template);
        }
    }

    @Scheduled(fixedDelay = 300_000)
    @Transactional
    public void retryFailedNotifications() {
        List<Notification> retryable = notificationRepository.findRetryable(MAX_RETRIES);
        for (Notification notification : retryable) {
            log.info("Retrying notification {} (attempt {})", notification.getId(), notification.getRetryCount() + 1);
            dispatch(notification, null);
        }
    }

    private ChannelAdapter findAdapter(String channel) {
        ChannelType type;
        try {
            type = ChannelType.valueOf(channel.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
        return channelAdapters.stream()
                .filter(a -> a.getChannelType() == type)
                .findFirst()
                .orElse(null);
    }
}

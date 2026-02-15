package com.slotme.notification.entity;

import com.slotme.common.entity.TenantAwareEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "notification_templates")
@Getter
@Setter
@NoArgsConstructor
public class NotificationTemplate extends TenantAwareEntity {

    @Column(name = "salon_id")
    private UUID salonId;

    @Column(name = "trigger_event", nullable = false, length = 50)
    private String triggerEvent;

    @Column(nullable = false, length = 20)
    private String channel;

    @Column(nullable = false, length = 10)
    private String language = "en";

    private String subject;

    @Column(name = "body_template", nullable = false, columnDefinition = "text")
    private String bodyTemplate;

    @Column(name = "whatsapp_template_name")
    private String whatsappTemplateName;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}

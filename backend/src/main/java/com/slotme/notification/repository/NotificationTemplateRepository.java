package com.slotme.notification.repository;

import com.slotme.notification.entity.NotificationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, UUID> {

    List<NotificationTemplate> findByTriggerEventAndActiveTrue(String triggerEvent);

    List<NotificationTemplate> findBySalonIdAndTriggerEventAndActiveTrue(UUID salonId, String triggerEvent);

    List<NotificationTemplate> findByTenantIdAndSalonIdIsNullAndTriggerEventAndActiveTrue(
            UUID tenantId, String triggerEvent);

    List<NotificationTemplate> findBySalonId(UUID salonId);
}

package com.slotme.notification.repository;

import com.slotme.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    Page<Notification> findByClientIdOrderByCreatedAtDesc(UUID clientId, Pageable pageable);

    Page<Notification> findByTenantIdOrderByCreatedAtDesc(UUID tenantId, Pageable pageable);

    long countByTenantIdAndStatus(UUID tenantId, String status);

    List<Notification> findByTenantIdAndStatus(UUID tenantId, String status);

    @Query("SELECT n FROM Notification n WHERE n.status = 'failed' AND n.retryCount < :maxRetries")
    List<Notification> findRetryable(@Param("maxRetries") int maxRetries);

    @Query("""
        SELECT n FROM Notification n
        WHERE n.status = 'pending'
          AND n.scheduledAt IS NOT NULL
          AND n.scheduledAt <= :now
        """)
    List<Notification> findScheduledReady(@Param("now") Instant now);

    @Query("""
        SELECT CASE WHEN COUNT(n) > 0 THEN true ELSE false END
        FROM Notification n
        WHERE n.appointmentId = :appointmentId
          AND n.channel = :channel
          AND n.status IN ('pending', 'sent', 'delivered')
          AND n.templateId = :templateId
        """)
    boolean existsByAppointmentAndChannelAndTemplate(
            @Param("appointmentId") UUID appointmentId,
            @Param("channel") String channel,
            @Param("templateId") UUID templateId);
}

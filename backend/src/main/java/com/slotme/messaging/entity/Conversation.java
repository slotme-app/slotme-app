package com.slotme.messaging.entity;

import com.slotme.common.entity.TenantAwareEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@NoArgsConstructor
public class Conversation extends TenantAwareEntity {

    @Column(name = "salon_id", nullable = false)
    private UUID salonId;

    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    @Column(nullable = false, length = 20)
    private String channel;

    @Column(name = "channel_conversation_id")
    private String channelConversationId;

    @Column(nullable = false, length = 20)
    private String status = "active";

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> context = Map.of();

    @Column(name = "assigned_to")
    private UUID assignedTo;

    @Column(name = "last_message_at")
    private Instant lastMessageAt;
}

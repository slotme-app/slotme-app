package com.slotme.messaging.entity;

import com.slotme.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
public class Message extends BaseEntity {

    @Column(name = "conversation_id", nullable = false)
    private UUID conversationId;

    @Column(nullable = false, length = 10)
    private String direction;

    @Column(name = "sender_type", nullable = false, length = 10)
    private String senderType;

    @Column(name = "sender_id")
    private UUID senderId;

    @Column(name = "content_type", nullable = false, length = 20)
    private String contentType = "text";

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> metadata = Map.of();

    @Column(name = "external_id")
    private String externalId;

    @Column(nullable = false, length = 20)
    private String status = "sent";
}

package com.slotme.messaging.event;

import com.slotme.messaging.channel.InboundMessage;
import org.springframework.context.ApplicationEvent;

import java.util.UUID;

public class InboundMessageEvent extends ApplicationEvent {

    private final InboundMessage message;
    private final UUID tenantId;
    private final UUID salonId;
    private final UUID conversationId;

    public InboundMessageEvent(Object source, InboundMessage message,
                               UUID tenantId, UUID salonId, UUID conversationId) {
        super(source);
        this.message = message;
        this.tenantId = tenantId;
        this.salonId = salonId;
        this.conversationId = conversationId;
    }

    public InboundMessage getMessage() {
        return message;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public UUID getSalonId() {
        return salonId;
    }

    public UUID getConversationId() {
        return conversationId;
    }
}

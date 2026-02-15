package com.slotme.messaging.channel;

import java.time.Instant;
import java.util.Map;

public record InboundMessage(
        String externalMessageId,
        String senderIdentifier,
        String recipientIdentifier,
        ChannelType channel,
        String contentType,
        String textContent,
        Map<String, Object> metadata,
        Instant timestamp
) {}

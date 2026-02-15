package com.slotme.messaging.channel;

import java.util.Map;

public interface ChannelAdapter {

    SendResult sendTextMessage(String recipientId, String text);

    SendResult sendTemplateMessage(String recipientId, String templateName, Map<String, String> params);

    InboundMessage parseWebhook(String rawPayload, Map<String, String> headers);

    boolean verifyWebhook(String rawPayload, Map<String, String> headers);

    ChannelType getChannelType();
}

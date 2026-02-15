package com.slotme.conversation.listener;

import com.slotme.conversation.service.ConversationEngine;
import com.slotme.messaging.channel.ChannelAdapter;
import com.slotme.messaging.channel.ChannelType;
import com.slotme.messaging.event.InboundMessageEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class InboundMessageListener {

    private static final Logger log = LoggerFactory.getLogger(InboundMessageListener.class);

    private final ConversationEngine conversationEngine;
    private final Map<ChannelType, ChannelAdapter> adapters;

    public InboundMessageListener(ConversationEngine conversationEngine,
                                   List<ChannelAdapter> adapterList) {
        this.conversationEngine = conversationEngine;
        this.adapters = adapterList.stream()
                .collect(Collectors.toMap(ChannelAdapter::getChannelType, Function.identity()));
    }

    @Async
    @EventListener
    public void onInboundMessage(InboundMessageEvent event) {
        try {
            String response = conversationEngine.processMessage(
                    event.getConversationId(),
                    event.getMessage().textContent());

            // Send response back via the same channel
            ChannelAdapter adapter = adapters.get(event.getMessage().channel());
            if (adapter != null && response != null && !response.isBlank()) {
                adapter.sendTextMessage(event.getMessage().senderIdentifier(), response);
            }
        } catch (Exception e) {
            log.error("Failed to process inbound message for conversation {}",
                    event.getConversationId(), e);
        }
    }
}

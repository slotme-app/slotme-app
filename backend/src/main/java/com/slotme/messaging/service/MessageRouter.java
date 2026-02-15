package com.slotme.messaging.service;

import com.slotme.client.entity.Client;
import com.slotme.client.repository.ClientRepository;
import com.slotme.messaging.channel.InboundMessage;
import com.slotme.messaging.entity.Conversation;
import com.slotme.messaging.entity.Message;
import com.slotme.messaging.event.InboundMessageEvent;
import com.slotme.messaging.repository.ConversationRepository;
import com.slotme.messaging.repository.MessageRepository;
import com.slotme.salon.entity.Salon;
import com.slotme.salon.repository.SalonRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@Service
public class MessageRouter {

    private static final Logger log = LoggerFactory.getLogger(MessageRouter.class);

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ClientRepository clientRepository;
    private final SalonRepository salonRepository;
    private final ApplicationEventPublisher eventPublisher;

    public MessageRouter(ConversationRepository conversationRepository,
                         MessageRepository messageRepository,
                         ClientRepository clientRepository,
                         SalonRepository salonRepository,
                         ApplicationEventPublisher eventPublisher) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.clientRepository = clientRepository;
        this.salonRepository = salonRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public void routeInboundMessage(InboundMessage inbound) {
        // Resolve salon from phone number ID metadata
        // In production, there would be a phone_number_id -> salon mapping table.
        // For now, we look up the first salon in the system as a fallback.
        Optional<Salon> salonOpt = salonRepository.findAll().stream().findFirst();
        if (salonOpt.isEmpty()) {
            log.warn("No salon found for inbound message from {}", inbound.senderIdentifier());
            return;
        }
        Salon salon = salonOpt.get();

        // Find or create client by phone
        Client client = clientRepository.findBySalonIdAndPhone(salon.getId(), inbound.senderIdentifier())
                .orElseGet(() -> {
                    Client newClient = new Client();
                    newClient.setTenantId(salon.getTenantId());
                    newClient.setSalonId(salon.getId());
                    newClient.setPhone(inbound.senderIdentifier());
                    newClient.setSource(inbound.channel().name().toLowerCase());
                    return clientRepository.save(newClient);
                });

        // Find or create active conversation
        Conversation conversation = conversationRepository
                .findByClientIdAndChannelAndStatus(
                        client.getId(),
                        inbound.channel().name().toLowerCase(),
                        "active")
                .orElseGet(() -> {
                    Conversation newConv = new Conversation();
                    newConv.setTenantId(salon.getTenantId());
                    newConv.setSalonId(salon.getId());
                    newConv.setClientId(client.getId());
                    newConv.setChannel(inbound.channel().name().toLowerCase());
                    newConv.setChannelConversationId(inbound.senderIdentifier());
                    newConv.setContext(Map.of());
                    return conversationRepository.save(newConv);
                });

        conversation.setLastMessageAt(Instant.now());
        conversationRepository.save(conversation);

        // Persist message
        Message message = new Message();
        message.setConversationId(conversation.getId());
        message.setDirection("inbound");
        message.setSenderType("client");
        message.setContentType(inbound.contentType());
        message.setContent(inbound.textContent() != null ? inbound.textContent() : "");
        message.setExternalId(inbound.externalMessageId());
        message.setMetadata(inbound.metadata() != null ? inbound.metadata() : Map.of());
        message.setStatus("received");
        messageRepository.save(message);

        // Publish event for AI conversation engine to process
        eventPublisher.publishEvent(new InboundMessageEvent(
                this, inbound, salon.getTenantId(), salon.getId(), conversation.getId()));
    }
}

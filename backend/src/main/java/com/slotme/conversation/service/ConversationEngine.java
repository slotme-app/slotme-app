package com.slotme.conversation.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.slotme.appointment.repository.AppointmentRepository;
import com.slotme.appointment.service.AppointmentService;
import com.slotme.calendar.service.AvailabilityService;
import com.slotme.master.repository.MasterRepository;
import com.slotme.messaging.entity.Conversation;
import com.slotme.messaging.entity.Message;
import com.slotme.messaging.repository.ConversationRepository;
import com.slotme.messaging.repository.MessageRepository;
import com.slotme.service.repository.SalonServiceRepository;
import io.micrometer.core.instrument.Timer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ConversationEngine {

    private static final Logger log = LoggerFactory.getLogger(ConversationEngine.class);

    private final ChatModel chatModel;
    private final ConversationContextBuilder contextBuilder;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final AvailabilityService availabilityService;
    private final AppointmentService appointmentService;
    private final AppointmentRepository appointmentRepository;
    private final SalonServiceRepository salonServiceRepository;
    private final MasterRepository masterRepository;
    private final ObjectMapper objectMapper;
    private final Timer aiConversationTimer;

    public ConversationEngine(ChatModel chatModel,
                              ConversationContextBuilder contextBuilder,
                              ConversationRepository conversationRepository,
                              MessageRepository messageRepository,
                              AvailabilityService availabilityService,
                              AppointmentService appointmentService,
                              AppointmentRepository appointmentRepository,
                              SalonServiceRepository salonServiceRepository,
                              MasterRepository masterRepository,
                              ObjectMapper objectMapper,
                              Timer aiConversationTimer) {
        this.chatModel = chatModel;
        this.contextBuilder = contextBuilder;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.availabilityService = availabilityService;
        this.appointmentService = appointmentService;
        this.appointmentRepository = appointmentRepository;
        this.salonServiceRepository = salonServiceRepository;
        this.masterRepository = masterRepository;
        this.objectMapper = objectMapper;
        this.aiConversationTimer = aiConversationTimer;
    }

    @Transactional
    public String processMessage(UUID conversationId, String userMessage) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found: " + conversationId));

        UUID salonId = conversation.getSalonId();
        UUID clientId = conversation.getClientId();

        // Build conversation context
        String contextJson;
        try {
            contextJson = objectMapper.writeValueAsString(conversation.getContext());
        } catch (Exception e) {
            contextJson = "{}";
        }

        // Build system prompt
        String systemPrompt = contextBuilder.buildSystemPrompt(salonId, contextJson);

        // Load recent message history for context
        List<Message> recentMessages = messageRepository
                .findByConversationIdOrderByCreatedAtAsc(conversationId);
        StringBuilder conversationHistory = new StringBuilder();
        int historyLimit = Math.max(0, recentMessages.size() - 10);
        for (int i = historyLimit; i < recentMessages.size(); i++) {
            Message msg = recentMessages.get(i);
            String role = "inbound".equals(msg.getDirection()) ? "Client" : "Assistant";
            conversationHistory.append(role).append(": ").append(msg.getContent()).append("\n");
        }

        // Create tool provider with salon/client context
        BookingToolProvider toolProvider = new BookingToolProvider(
                salonId, clientId, availabilityService, appointmentService,
                appointmentRepository, salonServiceRepository, masterRepository);

        // Call LLM with tools
        String aiResponse;
        try {
            String fullUserMessage = conversationHistory.isEmpty()
                    ? userMessage
                    : conversationHistory + "Client: " + userMessage;

            aiResponse = aiConversationTimer.record(() ->
                    ChatClient.create(chatModel)
                            .prompt()
                            .system(systemPrompt)
                            .user(fullUserMessage)
                            .functions(toolProvider.buildCallbacks())
                            .call()
                            .content()
            );
        } catch (Exception e) {
            log.error("AI conversation engine error for conversation {}", conversationId, e);
            aiResponse = "I'm sorry, I'm having trouble processing your request. " +
                         "Would you like me to connect you with a staff member?";
        }

        // Check for escalation
        if (aiResponse != null && aiResponse.contains("ESCALATE:")) {
            conversation.setStatus("escalated");
            conversationRepository.save(conversation);
            aiResponse = "I'll connect you with a team member who can help. Please hold on!";
        }

        // Save outbound message
        Message outbound = new Message();
        outbound.setConversationId(conversationId);
        outbound.setDirection("outbound");
        outbound.setSenderType("ai");
        outbound.setContentType("text");
        outbound.setContent(aiResponse != null ? aiResponse : "");
        outbound.setStatus("sent");
        outbound.setMetadata(Map.of());
        messageRepository.save(outbound);

        // Update conversation timestamp
        conversation.setLastMessageAt(Instant.now());
        conversationRepository.save(conversation);

        return aiResponse;
    }
}

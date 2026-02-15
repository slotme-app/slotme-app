package com.slotme.conversation.service;

import com.slotme.master.entity.Master;
import com.slotme.master.repository.MasterRepository;
import com.slotme.salon.entity.Salon;
import com.slotme.salon.repository.SalonRepository;
import com.slotme.service.entity.SalonService;
import com.slotme.service.repository.SalonServiceRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ConversationContextBuilder {

    private final SalonRepository salonRepository;
    private final SalonServiceRepository salonServiceRepository;
    private final MasterRepository masterRepository;

    public ConversationContextBuilder(SalonRepository salonRepository,
                                       SalonServiceRepository salonServiceRepository,
                                       MasterRepository masterRepository) {
        this.salonRepository = salonRepository;
        this.salonServiceRepository = salonServiceRepository;
        this.masterRepository = masterRepository;
    }

    public String buildSystemPrompt(UUID salonId, String conversationContext) {
        Salon salon = salonRepository.findById(salonId).orElse(null);
        if (salon == null) {
            return buildDefaultPrompt(conversationContext);
        }

        List<SalonService> services = salonServiceRepository.findBySalonIdAndActiveTrue(salonId);
        List<Master> masters = masterRepository.findBySalonIdAndActiveTrue(salonId);

        String serviceSummary = services.stream()
                .map(s -> s.getName() + " (" + s.getDurationMinutes() + " min, " +
                         s.getPrice() + " " + s.getCurrency() + ") [id: " + s.getId() + "]")
                .collect(Collectors.joining("\n  - ", "  - ", ""));

        String masterSummary = masters.stream()
                .map(m -> m.getDisplayName() +
                         (m.getSpecialization() != null ? " - " + m.getSpecialization() : "") +
                         " [id: " + m.getId() + "]")
                .collect(Collectors.joining("\n  - ", "  - ", ""));

        return """
                You are a virtual receptionist for %s, a beauty salon.
                Your job is to help clients book, reschedule, or cancel appointments.

                SALON INFO:
                - Name: %s
                - Address: %s
                - Phone: %s
                - Services offered:
                  %s
                - Masters/Stylists:
                  %s

                RULES:
                - Always be polite and professional
                - If the client wants to book, collect: service, preferred date/time, preferred master (optional)
                - Use the tools provided to check availability and make bookings
                - If no slots are available for the requested time, suggest alternatives
                - If you cannot help, offer to connect them with a salon staff member
                - Respond in the same language the client uses
                - Keep responses concise (2-3 sentences max for messaging)
                - When calling book_appointment, use the service_id and master_id from the availability check
                - Always confirm details with the client before booking

                CURRENT CONVERSATION STATE:
                %s
                """.formatted(
                salon.getName(),
                salon.getName(),
                salon.getAddress() != null ? salon.getAddress() : "Not provided",
                salon.getPhone() != null ? salon.getPhone() : "Not provided",
                serviceSummary,
                masterSummary,
                conversationContext != null ? conversationContext : "{}"
        );
    }

    private String buildDefaultPrompt(String conversationContext) {
        return """
                You are a virtual receptionist for a beauty salon.
                Your job is to help clients book, reschedule, or cancel appointments.
                Use the tools provided to check availability and make bookings.
                Respond in the same language the client uses.
                Keep responses concise (2-3 sentences max for messaging).

                CURRENT CONVERSATION STATE:
                %s
                """.formatted(conversationContext != null ? conversationContext : "{}");
    }
}

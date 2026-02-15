package com.slotme.client.service;

import com.slotme.appointment.entity.Appointment;
import com.slotme.appointment.repository.AppointmentRepository;
import com.slotme.client.dto.ClientProfileResponse;
import com.slotme.client.entity.Client;
import com.slotme.client.repository.ClientRepository;
import com.slotme.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClientEnrichmentService {

    private final ClientRepository clientRepository;
    private final AppointmentRepository appointmentRepository;

    public ClientEnrichmentService(ClientRepository clientRepository,
                                   AppointmentRepository appointmentRepository) {
        this.clientRepository = clientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public ClientProfileResponse getEnrichedProfile(UUID clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));
        return toProfileResponse(client);
    }

    @Transactional
    public void refreshStats(UUID clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));

        List<Appointment> appointments = appointmentRepository.findByClientIdOrderByStartAtDesc(clientId);

        int totalVisits = 0;
        BigDecimal totalSpent = BigDecimal.ZERO;
        Instant lastVisit = null;
        UUID preferredMasterId = null;

        Map<UUID, Long> masterCounts = appointments.stream()
                .filter(a -> "completed".equals(a.getStatus()))
                .collect(Collectors.groupingBy(Appointment::getMasterId, Collectors.counting()));

        for (Appointment appt : appointments) {
            if ("completed".equals(appt.getStatus())) {
                totalVisits++;
                if (appt.getPrice() != null) {
                    totalSpent = totalSpent.add(appt.getPrice());
                }
                if (lastVisit == null || appt.getStartAt().isAfter(lastVisit)) {
                    lastVisit = appt.getStartAt();
                }
            }
        }

        if (!masterCounts.isEmpty()) {
            preferredMasterId = masterCounts.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(null);
        }

        client.setTotalVisits(totalVisits);
        client.setTotalSpent(totalSpent);
        client.setLastVisitAt(lastVisit);
        client.setPreferredMasterId(preferredMasterId);
        clientRepository.save(client);
    }

    private ClientProfileResponse toProfileResponse(Client client) {
        return new ClientProfileResponse(
                client.getId().toString(),
                client.getSalonId().toString(),
                client.getFirstName(),
                client.getLastName(),
                client.getPhone(),
                client.getEmail(),
                client.getNotes(),
                client.getTags() != null ? Arrays.asList(client.getTags()) : null,
                client.getSource(),
                client.getLastVisitAt(),
                client.getTotalVisits(),
                client.getTotalSpent(),
                client.getPreferredMasterId() != null ? client.getPreferredMasterId().toString() : null,
                client.getCreatedAt()
        );
    }
}

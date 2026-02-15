package com.slotme.client.service;

import com.slotme.appointment.entity.Appointment;
import com.slotme.appointment.repository.AppointmentRepository;
import com.slotme.client.entity.Client;
import com.slotme.client.entity.ClientNote;
import com.slotme.client.repository.ClientNoteRepository;
import com.slotme.client.repository.ClientRepository;
import com.slotme.common.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ClientMergeService {

    private static final Logger log = LoggerFactory.getLogger(ClientMergeService.class);

    private final ClientRepository clientRepository;
    private final ClientNoteRepository noteRepository;
    private final AppointmentRepository appointmentRepository;
    private final ClientEnrichmentService enrichmentService;

    public ClientMergeService(ClientRepository clientRepository,
                              ClientNoteRepository noteRepository,
                              AppointmentRepository appointmentRepository,
                              ClientEnrichmentService enrichmentService) {
        this.clientRepository = clientRepository;
        this.noteRepository = noteRepository;
        this.appointmentRepository = appointmentRepository;
        this.enrichmentService = enrichmentService;
    }

    @Transactional
    public Client mergeClients(UUID primaryId, UUID secondaryId) {
        Client primary = clientRepository.findById(primaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", primaryId));
        Client secondary = clientRepository.findById(secondaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", secondaryId));

        if (!primary.getSalonId().equals(secondary.getSalonId())) {
            throw new IllegalArgumentException("Cannot merge clients from different salons");
        }

        log.info("Merging client {} into {}", secondaryId, primaryId);

        // Move appointments from secondary to primary
        List<Appointment> secondaryAppointments =
                appointmentRepository.findByClientIdOrderByStartAtDesc(secondaryId);
        for (Appointment appt : secondaryAppointments) {
            appt.setClientId(primaryId);
        }
        appointmentRepository.saveAll(secondaryAppointments);

        // Move notes from secondary to primary
        List<ClientNote> secondaryNotes =
                noteRepository.findByClientIdOrderByCreatedAtDesc(secondaryId);
        for (ClientNote note : secondaryNotes) {
            note.setClientId(primaryId);
        }
        noteRepository.saveAll(secondaryNotes);

        // Fill in missing data on primary from secondary
        if (primary.getFirstName() == null && secondary.getFirstName() != null) {
            primary.setFirstName(secondary.getFirstName());
        }
        if (primary.getLastName() == null && secondary.getLastName() != null) {
            primary.setLastName(secondary.getLastName());
        }
        if (primary.getEmail() == null && secondary.getEmail() != null) {
            primary.setEmail(secondary.getEmail());
        }

        // Merge tags
        if (secondary.getTags() != null && secondary.getTags().length > 0) {
            if (primary.getTags() == null) {
                primary.setTags(secondary.getTags());
            } else {
                List<String> merged = new java.util.ArrayList<>(java.util.Arrays.asList(primary.getTags()));
                for (String tag : secondary.getTags()) {
                    if (!merged.contains(tag)) {
                        merged.add(tag);
                    }
                }
                primary.setTags(merged.toArray(new String[0]));
            }
        }

        clientRepository.save(primary);

        // Delete secondary client
        clientRepository.delete(secondary);

        // Refresh stats on primary
        enrichmentService.refreshStats(primaryId);

        log.info("Client merge complete: {} absorbed into {}", secondaryId, primaryId);
        return clientRepository.findById(primaryId).orElseThrow();
    }
}

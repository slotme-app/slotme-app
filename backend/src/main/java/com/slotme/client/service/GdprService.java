package com.slotme.client.service;

import com.slotme.appointment.entity.Appointment;
import com.slotme.appointment.repository.AppointmentRepository;
import com.slotme.client.entity.Client;
import com.slotme.client.entity.ClientNote;
import com.slotme.client.repository.ClientNoteRepository;
import com.slotme.client.repository.ClientRepository;
import com.slotme.common.exception.ResourceNotFoundException;
import com.slotme.notification.entity.Notification;
import com.slotme.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class GdprService {

    private static final Logger log = LoggerFactory.getLogger(GdprService.class);

    private final ClientRepository clientRepository;
    private final ClientNoteRepository noteRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationRepository notificationRepository;

    public GdprService(ClientRepository clientRepository,
                       ClientNoteRepository noteRepository,
                       AppointmentRepository appointmentRepository,
                       NotificationRepository notificationRepository) {
        this.clientRepository = clientRepository;
        this.noteRepository = noteRepository;
        this.appointmentRepository = appointmentRepository;
        this.notificationRepository = notificationRepository;
    }

    public Map<String, Object> exportClientData(UUID clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));

        Map<String, Object> export = new LinkedHashMap<>();

        // Personal data
        Map<String, Object> personalData = new LinkedHashMap<>();
        personalData.put("id", client.getId().toString());
        personalData.put("first_name", client.getFirstName());
        personalData.put("last_name", client.getLastName());
        personalData.put("phone", client.getPhone());
        personalData.put("email", client.getEmail());
        personalData.put("notes", client.getNotes());
        personalData.put("tags", client.getTags());
        personalData.put("source", client.getSource());
        personalData.put("total_visits", client.getTotalVisits());
        personalData.put("total_spent", client.getTotalSpent());
        personalData.put("last_visit_at", client.getLastVisitAt());
        personalData.put("created_at", client.getCreatedAt());
        export.put("personal_data", personalData);

        // Appointments
        List<Appointment> appointments = appointmentRepository.findByClientIdOrderByStartAtDesc(clientId);
        List<Map<String, Object>> apptExport = appointments.stream().map(a -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", a.getId().toString());
            m.put("service_id", a.getServiceId().toString());
            m.put("master_id", a.getMasterId().toString());
            m.put("status", a.getStatus());
            m.put("start_at", a.getStartAt());
            m.put("end_at", a.getEndAt());
            m.put("price", a.getPrice());
            m.put("currency", a.getCurrency());
            m.put("notes", a.getNotes());
            m.put("created_at", a.getCreatedAt());
            return m;
        }).toList();
        export.put("appointments", apptExport);

        // Notes
        List<ClientNote> notes = noteRepository.findByClientIdOrderByCreatedAtDesc(clientId);
        List<Map<String, Object>> notesExport = notes.stream().map(n -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", n.getId().toString());
            m.put("content", n.getContent());
            m.put("author_id", n.getAuthorId().toString());
            m.put("created_at", n.getCreatedAt());
            return m;
        }).toList();
        export.put("notes", notesExport);

        // Notifications
        List<Notification> notifications = notificationRepository
                .findByClientIdOrderByCreatedAtDesc(clientId, Pageable.unpaged()).getContent();
        List<Map<String, Object>> notifsExport = notifications.stream().map(n -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", n.getId().toString());
            m.put("channel", n.getChannel());
            m.put("content", n.getContent());
            m.put("status", n.getStatus());
            m.put("sent_at", n.getSentAt());
            m.put("created_at", n.getCreatedAt());
            return m;
        }).toList();
        export.put("notifications", notifsExport);

        export.put("export_date", Instant.now());
        return export;
    }

    @Transactional
    public void anonymizeClient(UUID clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));

        log.info("GDPR anonymization requested for client {}", clientId);

        // Anonymize PII
        client.setFirstName("DELETED");
        client.setLastName("USER");
        client.setPhone("0000000000");
        client.setEmail(null);
        client.setNotes(null);
        client.setTags(null);
        client.setDeletedAt(Instant.now());
        clientRepository.save(client);

        // Delete notes (they may contain PII)
        noteRepository.deleteByClientId(clientId);

        // Anonymize appointment notes
        List<Appointment> appointments = appointmentRepository.findByClientIdOrderByStartAtDesc(clientId);
        for (Appointment appt : appointments) {
            appt.setNotes(null);
            appt.setInternalNotes(null);
        }
        appointmentRepository.saveAll(appointments);

        log.info("GDPR anonymization completed for client {}", clientId);
    }
}

package com.slotme.client.controller;

import com.slotme.appointment.dto.AppointmentResponse;
import com.slotme.appointment.service.AppointmentService;
import com.slotme.client.dto.*;
import com.slotme.client.service.ClientEnrichmentService;
import com.slotme.client.service.ClientMergeService;
import com.slotme.client.service.ClientNoteService;
import com.slotme.client.service.ClientService;
import com.slotme.client.service.GdprService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/salons/{salonId}/clients")
public class ClientController {

    private final ClientService clientService;
    private final ClientEnrichmentService enrichmentService;
    private final ClientNoteService noteService;
    private final GdprService gdprService;
    private final ClientMergeService mergeService;
    private final AppointmentService appointmentService;

    public ClientController(ClientService clientService,
                            ClientEnrichmentService enrichmentService,
                            ClientNoteService noteService,
                            GdprService gdprService,
                            ClientMergeService mergeService,
                            AppointmentService appointmentService) {
        this.clientService = clientService;
        this.enrichmentService = enrichmentService;
        this.noteService = noteService;
        this.gdprService = gdprService;
        this.mergeService = mergeService;
        this.appointmentService = appointmentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Page<ClientResponse>> listClients(
            @PathVariable UUID salonId,
            @RequestParam(required = false) String query,
            Pageable pageable) {
        return ResponseEntity.ok(clientService.listClients(salonId, query, pageable));
    }

    @GetMapping("/{clientId}")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<ClientResponse> getClient(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId) {
        return ResponseEntity.ok(clientService.getClient(clientId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<ClientResponse> createClient(
            @PathVariable UUID salonId,
            @Valid @RequestBody CreateClientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clientService.createClient(salonId, request));
    }

    @PutMapping("/{clientId}")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<ClientResponse> updateClient(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId,
            @Valid @RequestBody UpdateClientRequest request) {
        return ResponseEntity.ok(clientService.updateClient(clientId, request));
    }

    // --- Enriched profile ---

    @GetMapping("/{clientId}/profile")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<ClientProfileResponse> getEnrichedProfile(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId) {
        return ResponseEntity.ok(enrichmentService.getEnrichedProfile(clientId));
    }

    @PostMapping("/{clientId}/refresh-stats")
    @PreAuthorize("hasAnyRole('SALON_ADMIN')")
    public ResponseEntity<Void> refreshStats(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId) {
        enrichmentService.refreshStats(clientId);
        return ResponseEntity.noContent().build();
    }

    // --- Notes ---

    @GetMapping("/{clientId}/notes")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<List<ClientNoteResponse>> getNotes(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId) {
        return ResponseEntity.ok(noteService.getNotes(clientId));
    }

    @PostMapping("/{clientId}/notes")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<ClientNoteResponse> addNote(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId,
            @Valid @RequestBody CreateNoteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(noteService.addNote(clientId, request));
    }

    @PutMapping("/{clientId}/notes/{noteId}")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<ClientNoteResponse> updateNote(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId,
            @PathVariable UUID noteId,
            @Valid @RequestBody CreateNoteRequest request) {
        return ResponseEntity.ok(noteService.updateNote(noteId, request));
    }

    @DeleteMapping("/{clientId}/notes/{noteId}")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Void> deleteNote(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId,
            @PathVariable UUID noteId) {
        noteService.deleteNote(noteId);
        return ResponseEntity.noContent().build();
    }

    // --- Appointments ---

    @GetMapping("/{clientId}/appointments")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Page<AppointmentResponse>> getClientAppointments(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId,
            Pageable pageable) {
        return ResponseEntity.ok(appointmentService.listAppointments(
                salonId, null, clientId, null, null, null, pageable));
    }

    // --- Tags ---

    @PostMapping("/{clientId}/tags")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Void> addTag(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId,
            @RequestBody Map<String, String> request) {
        String tag = request.get("tag");
        if (tag == null || tag.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        var client = clientService.getClientEntity(clientId);
        String[] existing = client.getTags();
        List<String> tags = existing != null ? new java.util.ArrayList<>(Arrays.asList(existing)) : new java.util.ArrayList<>();
        if (!tags.contains(tag)) {
            tags.add(tag);
            clientService.updateTags(clientId, tags.toArray(new String[0]));
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{clientId}/tags/{tag}")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Void> removeTag(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId,
            @PathVariable String tag) {
        var client = clientService.getClientEntity(clientId);
        String[] existing = client.getTags();
        if (existing != null) {
            List<String> tags = new java.util.ArrayList<>(Arrays.asList(existing));
            tags.remove(tag);
            clientService.updateTags(clientId, tags.toArray(new String[0]));
        }
        return ResponseEntity.noContent().build();
    }

    // --- GDPR / Data Export ---

    @GetMapping("/{clientId}/data-export")
    @PreAuthorize("hasAnyRole('SALON_ADMIN')")
    public ResponseEntity<Map<String, Object>> exportData(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId) {
        return ResponseEntity.ok(gdprService.exportClientData(clientId));
    }

    @GetMapping("/{clientId}/export")
    @PreAuthorize("hasAnyRole('SALON_ADMIN')")
    public ResponseEntity<Map<String, Object>> exportDataAlias(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId) {
        return ResponseEntity.ok(gdprService.exportClientData(clientId));
    }

    @DeleteMapping("/{clientId}/gdpr-delete")
    @PreAuthorize("hasAnyRole('SALON_ADMIN')")
    public ResponseEntity<Void> gdprDelete(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId) {
        gdprService.anonymizeClient(clientId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{clientId}/data")
    @PreAuthorize("hasAnyRole('SALON_ADMIN')")
    public ResponseEntity<Void> deleteData(
            @PathVariable UUID salonId,
            @PathVariable UUID clientId) {
        gdprService.anonymizeClient(clientId);
        return ResponseEntity.noContent().build();
    }

    // --- Merge ---

    @PostMapping("/merge")
    @PreAuthorize("hasAnyRole('SALON_ADMIN')")
    public ResponseEntity<ClientProfileResponse> mergeClients(
            @PathVariable UUID salonId,
            @Valid @RequestBody MergeClientsRequest request) {
        var merged = mergeService.mergeClients(request.primaryId(), request.secondaryId());
        return ResponseEntity.ok(enrichmentService.getEnrichedProfile(merged.getId()));
    }
}

package com.slotme.appointment.controller;

import com.slotme.appointment.dto.*;
import com.slotme.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/salons/{salonId}/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<AppointmentResponse> bookAppointment(
            @PathVariable UUID salonId,
            @Valid @RequestBody CreateAppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(appointmentService.bookAppointment(salonId, request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Page<AppointmentResponse>> listAppointments(
            @PathVariable UUID salonId,
            @RequestParam(required = false) UUID masterId,
            @RequestParam(required = false) UUID clientId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Instant dateFrom,
            @RequestParam(required = false) Instant dateTo,
            Pageable pageable) {
        return ResponseEntity.ok(appointmentService.listAppointments(
                salonId, masterId, clientId, status, dateFrom, dateTo, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<AppointmentResponse> getAppointment(@PathVariable UUID id) {
        return ResponseEntity.ok(appointmentService.getAppointment(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<AppointmentResponse> reschedule(
            @PathVariable UUID id,
            @Valid @RequestBody RescheduleRequest request) {
        return ResponseEntity.ok(appointmentService.reschedule(id, request));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<AppointmentResponse> cancel(
            @PathVariable UUID id,
            @Valid @RequestBody(required = false) CancelRequest request) {
        return ResponseEntity.ok(appointmentService.cancel(id, request));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<AppointmentResponse> cancelPatch(
            @PathVariable UUID id) {
        return ResponseEntity.ok(appointmentService.cancel(id, null));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<AppointmentResponse> complete(@PathVariable UUID id) {
        return ResponseEntity.ok(appointmentService.complete(id));
    }

    @PostMapping("/{id}/no-show")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<AppointmentResponse> markNoShow(@PathVariable UUID id) {
        return ResponseEntity.ok(appointmentService.markNoShow(id));
    }

    @GetMapping("/{id}/history")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<List<AppointmentHistoryResponse>> getHistory(@PathVariable UUID id) {
        return ResponseEntity.ok(appointmentService.getHistory(id));
    }
}

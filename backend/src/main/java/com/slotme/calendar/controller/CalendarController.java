package com.slotme.calendar.controller;

import com.slotme.calendar.dto.*;
import com.slotme.calendar.service.AvailabilityService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class CalendarController {

    private final AvailabilityService availabilityService;

    public CalendarController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    // --- Availability Rules ---

    @GetMapping("/masters/{masterId}/availability")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<List<AvailabilityRuleDto>> getAvailability(@PathVariable UUID masterId) {
        return ResponseEntity.ok(availabilityService.getAvailabilityRules(masterId));
    }

    @PutMapping("/masters/{masterId}/availability")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<List<AvailabilityRuleDto>> setAvailability(
            @PathVariable UUID masterId,
            @Valid @RequestBody SetAvailabilityRequest request) {
        return ResponseEntity.ok(availabilityService.setAvailabilityRules(masterId, request));
    }

    // --- Time Blocks ---

    @GetMapping("/masters/{masterId}/time-blocks")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<List<TimeBlockDto>> getTimeBlocks(
            @PathVariable UUID masterId,
            @RequestParam Instant from,
            @RequestParam Instant to) {
        return ResponseEntity.ok(availabilityService.getTimeBlocks(masterId, from, to));
    }

    @PostMapping("/masters/{masterId}/time-blocks")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<TimeBlockDto> createTimeBlock(
            @PathVariable UUID masterId,
            @Valid @RequestBody CreateTimeBlockRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(availabilityService.createTimeBlock(masterId, request));
    }

    @DeleteMapping("/masters/{masterId}/time-blocks/{blockId}")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Void> deleteTimeBlock(
            @PathVariable UUID masterId,
            @PathVariable UUID blockId) {
        availabilityService.deleteTimeBlock(blockId);
        return ResponseEntity.noContent().build();
    }

    // --- Available Slots ---

    @GetMapping("/salons/{salonId}/available-slots")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AvailableSlotResponse> getAvailableSlots(
            @PathVariable UUID salonId,
            @RequestParam UUID serviceId,
            @RequestParam(required = false) UUID masterId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
        LocalDate from = dateFrom != null ? dateFrom : (date != null ? date : LocalDate.now());
        LocalDate to = dateTo != null ? dateTo : from;
        return ResponseEntity.ok(
                availabilityService.getAvailableSlots(salonId, serviceId, masterId, from, to));
    }
}

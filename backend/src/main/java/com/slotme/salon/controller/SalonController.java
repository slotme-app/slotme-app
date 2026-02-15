package com.slotme.salon.controller;

import com.slotme.salon.dto.SalonResponse;
import com.slotme.salon.dto.UpdateSalonRequest;
import com.slotme.salon.service.SalonService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/salons")
public class SalonController {

    private final SalonService salonService;

    public SalonController(SalonService salonService) {
        this.salonService = salonService;
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<SalonResponse>> listSalons() {
        return ResponseEntity.ok(salonService.listSalons());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<SalonResponse> getSalon(@PathVariable UUID id) {
        return ResponseEntity.ok(salonService.getSalon(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<SalonResponse> updateSalon(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSalonRequest request) {
        return ResponseEntity.ok(salonService.updateSalon(id, request));
    }

    @PutMapping("/{id}/working-hours")
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<Map<String, Object>> updateWorkingHours(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> request) {
        salonService.updateSettingsKey(id, "workingHours", request.get("workingHours"));
        return ResponseEntity.ok(request);
    }

    @PutMapping("/{id}/booking-rules")
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<Map<String, Object>> updateBookingRules(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> request) {
        salonService.updateSettingsKey(id, "bookingRules", request);
        return ResponseEntity.ok(request);
    }
}

package com.slotme.master.controller;

import com.slotme.master.dto.CreateMasterRequest;
import com.slotme.master.dto.MasterResponse;
import com.slotme.master.dto.UpdateMasterRequest;
import com.slotme.master.service.MasterManagementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/salons/{salonId}/masters")
public class MasterController {

    private final MasterManagementService masterService;

    public MasterController(MasterManagementService masterService) {
        this.masterService = masterService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Map<String, Object>> listMasters(@PathVariable UUID salonId) {
        List<MasterResponse> masters = masterService.listMasters(salonId);
        return ResponseEntity.ok(Map.of(
                "content", masters,
                "totalElements", masters.size(),
                "totalPages", 1,
                "page", 0,
                "size", masters.size()
        ));
    }

    @GetMapping("/{masterId}")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<MasterResponse> getMaster(
            @PathVariable UUID salonId,
            @PathVariable UUID masterId) {
        return ResponseEntity.ok(masterService.getMaster(masterId));
    }

    @PostMapping
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<MasterResponse> createMaster(
            @PathVariable UUID salonId,
            @Valid @RequestBody CreateMasterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(masterService.createMaster(salonId, request));
    }

    @PostMapping("/invite")
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<Map<String, Object>> inviteMaster(
            @PathVariable UUID salonId,
            @Valid @RequestBody CreateMasterRequest request) {
        MasterResponse master = masterService.createMaster(salonId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Invitation sent successfully",
                "masterId", master.id()
        ));
    }

    @PutMapping("/{masterId}")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<MasterResponse> updateMaster(
            @PathVariable UUID salonId,
            @PathVariable UUID masterId,
            @Valid @RequestBody UpdateMasterRequest request) {
        return ResponseEntity.ok(masterService.updateMaster(masterId, request));
    }

    @PatchMapping("/{masterId}/deactivate")
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<Void> deactivateMaster(
            @PathVariable UUID salonId,
            @PathVariable UUID masterId) {
        masterService.deactivateMaster(masterId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{masterId}/activate")
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<Void> activateMaster(
            @PathVariable UUID salonId,
            @PathVariable UUID masterId) {
        masterService.activateMaster(masterId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{masterId}")
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<Void> deleteMaster(
            @PathVariable UUID salonId,
            @PathVariable UUID masterId) {
        masterService.deactivateMaster(masterId);
        return ResponseEntity.noContent().build();
    }
}

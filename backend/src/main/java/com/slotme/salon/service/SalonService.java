package com.slotme.salon.service;

import com.slotme.common.exception.ResourceNotFoundException;
import com.slotme.salon.dto.SalonResponse;
import com.slotme.salon.dto.UpdateSalonRequest;
import com.slotme.salon.entity.Salon;
import com.slotme.salon.repository.SalonRepository;
import com.slotme.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class SalonService {

    private final SalonRepository salonRepository;

    public SalonService(SalonRepository salonRepository) {
        this.salonRepository = salonRepository;
    }

    public List<SalonResponse> listSalons() {
        UUID tenantId = SecurityUtils.getCurrentTenantId();
        return salonRepository.findByTenantId(tenantId).stream()
                .map(this::toResponse)
                .toList();
    }

    public SalonResponse getSalon(UUID salonId) {
        Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new ResourceNotFoundException("Salon", salonId));
        return toResponse(salon);
    }

    @Transactional
    public SalonResponse updateSalon(UUID salonId, UpdateSalonRequest request) {
        Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new ResourceNotFoundException("Salon", salonId));

        if (request.name() != null) salon.setName(request.name());
        if (request.description() != null) salon.setDescription(request.description());
        if (request.phone() != null) salon.setPhone(request.phone());
        if (request.email() != null) salon.setEmail(request.email());
        if (request.address() != null) salon.setAddress(request.address());
        if (request.city() != null) salon.setCity(request.city());
        if (request.country() != null) salon.setCountry(request.country());
        if (request.timezone() != null) salon.setTimezone(request.timezone());
        if (request.currency() != null) salon.setCurrency(request.currency());
        if (request.logoUrl() != null) salon.setLogoUrl(request.logoUrl());
        if (request.settings() != null) salon.setSettings(request.settings());

        salon = salonRepository.save(salon);
        return toResponse(salon);
    }

    @Transactional
    public void updateSettingsKey(UUID salonId, String key, Object value) {
        Salon salon = salonRepository.findById(salonId)
                .orElseThrow(() -> new ResourceNotFoundException("Salon", salonId));
        Map<String, Object> settings = new HashMap<>(
                salon.getSettings() != null ? salon.getSettings() : Map.of());
        settings.put(key, value);
        salon.setSettings(settings);
        salonRepository.save(salon);
    }

    private SalonResponse toResponse(Salon salon) {
        Map<String, Object> settings = salon.getSettings() != null ? salon.getSettings() : Map.of();
        return new SalonResponse(
                salon.getId().toString(),
                salon.getTenantId().toString(),
                salon.getName(),
                salon.getSlug(),
                salon.getDescription(),
                salon.getPhone(),
                salon.getEmail(),
                salon.getAddress(),
                salon.getCity(),
                salon.getCountry(),
                salon.getTimezone(),
                salon.getCurrency(),
                salon.getLogoUrl(),
                settings,
                salon.getStatus(),
                salon.getCreatedAt(),
                salon.getUpdatedAt(),
                settings.get("workingHours"),
                settings.get("bookingRules")
        );
    }
}

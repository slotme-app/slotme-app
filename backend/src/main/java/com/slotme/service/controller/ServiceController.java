package com.slotme.service.controller;

import com.slotme.service.dto.*;
import com.slotme.service.service.ServiceCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/salons/{salonId}")
public class ServiceController {

    private final ServiceCatalogService serviceCatalogService;

    public ServiceController(ServiceCatalogService serviceCatalogService) {
        this.serviceCatalogService = serviceCatalogService;
    }

    // --- Service Categories ---

    @GetMapping("/service-categories")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<List<ServiceCategoryResponse>> listCategories(@PathVariable UUID salonId) {
        return ResponseEntity.ok(serviceCatalogService.listCategories(salonId));
    }

    @PostMapping("/service-categories")
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<ServiceCategoryResponse> createCategory(
            @PathVariable UUID salonId,
            @Valid @RequestBody CreateServiceCategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(serviceCatalogService.createCategory(salonId, request));
    }

    @PutMapping("/service-categories/{categoryId}")
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<ServiceCategoryResponse> updateCategory(
            @PathVariable UUID salonId,
            @PathVariable UUID categoryId,
            @Valid @RequestBody CreateServiceCategoryRequest request) {
        return ResponseEntity.ok(serviceCatalogService.updateCategory(categoryId, request));
    }

    // --- Services ---

    @GetMapping("/services")
    @PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
    public ResponseEntity<Map<String, Object>> listServices(@PathVariable UUID salonId) {
        List<ServiceResponse> allServices = serviceCatalogService.listServices(salonId);
        List<ServiceCategoryResponse> allCategories = serviceCatalogService.listCategories(salonId);

        // Group services by categoryId
        Map<String, List<ServiceResponse>> byCategoryId = new LinkedHashMap<>();
        List<ServiceResponse> uncategorized = new ArrayList<>();
        for (ServiceResponse svc : allServices) {
            if (svc.categoryId() != null) {
                byCategoryId.computeIfAbsent(svc.categoryId(), k -> new ArrayList<>()).add(svc);
            } else {
                uncategorized.add(svc);
            }
        }

        List<Map<String, Object>> categories = new ArrayList<>();
        for (ServiceCategoryResponse cat : allCategories) {
            List<ServiceResponse> catServices = byCategoryId.getOrDefault(cat.id(), List.of());
            // Add active field to each service in the category
            List<Map<String, Object>> servicesWithActive = catServices.stream()
                    .map(s -> {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("id", s.id());
                        m.put("salonId", s.salonId());
                        m.put("categoryId", s.categoryId());
                        m.put("categoryName", s.categoryName());
                        m.put("name", s.name());
                        m.put("description", s.description());
                        m.put("duration", s.duration());
                        m.put("durationMinutes", s.durationMinutes());
                        m.put("bufferTime", s.bufferTime());
                        m.put("bufferMinutes", s.bufferMinutes());
                        m.put("price", s.price());
                        m.put("currency", s.currency());
                        m.put("active", s.active());
                        m.put("sortOrder", s.sortOrder());
                        m.put("masterCount", s.masterCount());
                        return (Map<String, Object>) m;
                    }).toList();
            categories.add(Map.of("category", cat, "services", servicesWithActive));
        }

        return ResponseEntity.ok(Map.of(
                "categories", categories,
                "uncategorized", uncategorized
        ));
    }

    @PostMapping("/services")
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<ServiceResponse> createService(
            @PathVariable UUID salonId,
            @Valid @RequestBody CreateServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(serviceCatalogService.createService(salonId, request));
    }

    @PutMapping("/services/{serviceId}")
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<ServiceResponse> updateService(
            @PathVariable UUID salonId,
            @PathVariable UUID serviceId,
            @Valid @RequestBody UpdateServiceRequest request) {
        return ResponseEntity.ok(serviceCatalogService.updateService(serviceId, request));
    }

    @DeleteMapping("/services/{serviceId}")
    @PreAuthorize("hasRole('SALON_ADMIN')")
    public ResponseEntity<Void> deleteService(
            @PathVariable UUID salonId,
            @PathVariable UUID serviceId) {
        serviceCatalogService.deactivateService(serviceId);
        return ResponseEntity.noContent().build();
    }
}

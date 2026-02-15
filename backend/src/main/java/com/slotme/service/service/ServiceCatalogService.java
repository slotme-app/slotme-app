package com.slotme.service.service;

import com.slotme.common.exception.ResourceNotFoundException;
import com.slotme.security.SecurityUtils;
import com.slotme.service.dto.*;
import com.slotme.service.entity.SalonService;
import com.slotme.service.entity.ServiceCategory;
import com.slotme.service.repository.SalonServiceRepository;
import com.slotme.service.repository.ServiceCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ServiceCatalogService {

    private final SalonServiceRepository serviceRepository;
    private final ServiceCategoryRepository categoryRepository;

    public ServiceCatalogService(SalonServiceRepository serviceRepository,
                                  ServiceCategoryRepository categoryRepository) {
        this.serviceRepository = serviceRepository;
        this.categoryRepository = categoryRepository;
    }

    // --- Categories ---

    public List<ServiceCategoryResponse> listCategories(UUID salonId) {
        return categoryRepository.findBySalonIdOrderBySortOrder(salonId).stream()
                .map(this::toCategoryResponse)
                .toList();
    }

    @Transactional
    public ServiceCategoryResponse createCategory(UUID salonId, CreateServiceCategoryRequest request) {
        ServiceCategory category = new ServiceCategory();
        category.setTenantId(SecurityUtils.getCurrentTenantId());
        category.setSalonId(salonId);
        category.setName(request.name());
        category.setSortOrder(request.sortOrder() != null ? request.sortOrder() : 0);
        category = categoryRepository.save(category);
        return toCategoryResponse(category);
    }

    @Transactional
    public ServiceCategoryResponse updateCategory(UUID categoryId, CreateServiceCategoryRequest request) {
        ServiceCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceCategory", categoryId));
        if (request.name() != null) category.setName(request.name());
        if (request.sortOrder() != null) category.setSortOrder(request.sortOrder());
        category = categoryRepository.save(category);
        return toCategoryResponse(category);
    }

    // --- Services ---

    public List<ServiceResponse> listServices(UUID salonId) {
        return serviceRepository.findBySalonIdOrderBySortOrder(salonId).stream()
                .map(this::toServiceResponse)
                .toList();
    }

    @Transactional
    public ServiceResponse createService(UUID salonId, CreateServiceRequest request) {
        SalonService service = new SalonService();
        service.setTenantId(SecurityUtils.getCurrentTenantId());
        service.setSalonId(salonId);
        service.setName(request.name());
        service.setDescription(request.description());
        service.setDurationMinutes(request.resolvedDurationMinutes());
        service.setBufferMinutes(request.resolvedBufferMinutes());
        service.setPrice(request.price());
        service.setCurrency(request.currency() != null ? request.currency() : "USD");
        service.setSortOrder(request.sortOrder() != null ? request.sortOrder() : 0);
        if (request.categoryId() != null) {
            service.setCategoryId(UUID.fromString(request.categoryId()));
        }
        service = serviceRepository.save(service);
        return toServiceResponse(service);
    }

    @Transactional
    public ServiceResponse updateService(UUID serviceId, UpdateServiceRequest request) {
        SalonService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service", serviceId));

        if (request.name() != null) service.setName(request.name());
        if (request.description() != null) service.setDescription(request.description());
        if (request.resolvedDurationMinutes() != null) service.setDurationMinutes(request.resolvedDurationMinutes());
        if (request.resolvedBufferMinutes() != null) service.setBufferMinutes(request.resolvedBufferMinutes());
        if (request.price() != null) service.setPrice(request.price());
        if (request.currency() != null) service.setCurrency(request.currency());
        if (request.active() != null) service.setActive(request.active());
        if (request.sortOrder() != null) service.setSortOrder(request.sortOrder());
        if (request.categoryId() != null) {
            service.setCategoryId(UUID.fromString(request.categoryId()));
        }

        service = serviceRepository.save(service);
        return toServiceResponse(service);
    }

    @Transactional
    public void deactivateService(UUID serviceId) {
        SalonService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service", serviceId));
        service.setActive(false);
        serviceRepository.save(service);
    }

    private ServiceCategoryResponse toCategoryResponse(ServiceCategory cat) {
        return new ServiceCategoryResponse(
                cat.getId().toString(),
                cat.getSalonId().toString(),
                cat.getName(),
                cat.getSortOrder()
        );
    }

    private ServiceResponse toServiceResponse(SalonService svc) {
        String categoryName = null;
        if (svc.getCategoryId() != null) {
            categoryName = categoryRepository.findById(svc.getCategoryId())
                    .map(ServiceCategory::getName)
                    .orElse(null);
        }
        return new ServiceResponse(
                svc.getId().toString(),
                svc.getSalonId().toString(),
                svc.getCategoryId() != null ? svc.getCategoryId().toString() : null,
                categoryName,
                svc.getName(),
                svc.getDescription(),
                svc.getDurationMinutes(),
                svc.getDurationMinutes(),
                svc.getBufferMinutes(),
                svc.getBufferMinutes(),
                svc.getPrice(),
                svc.getCurrency(),
                svc.isActive(),
                svc.getSortOrder(),
                0
        );
    }
}

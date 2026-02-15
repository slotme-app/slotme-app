package com.slotme.service.dto;

public record ServiceCategoryResponse(
        String id,
        String salonId,
        String name,
        int sortOrder
) {}

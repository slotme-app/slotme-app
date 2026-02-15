package com.slotme.service.dto;

import java.math.BigDecimal;

public record ServiceResponse(
        String id,
        String salonId,
        String categoryId,
        String categoryName,
        String name,
        String description,
        int duration,
        int durationMinutes,
        int bufferTime,
        int bufferMinutes,
        BigDecimal price,
        String currency,
        boolean active,
        int sortOrder,
        int masterCount
) {}

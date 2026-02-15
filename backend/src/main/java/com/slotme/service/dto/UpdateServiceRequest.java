package com.slotme.service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateServiceRequest(
        String categoryId,
        @Size(max = 255) String name,
        @Size(max = 2000) String description,
        Integer duration,
        @Min(1) Integer durationMinutes,
        Integer bufferTime,
        @Min(0) Integer bufferMinutes,
        BigDecimal price,
        @Size(max = 3) String currency,
        Boolean active,
        Integer sortOrder
) {
    public Integer resolvedDurationMinutes() {
        if (duration != null) return duration;
        return durationMinutes;
    }

    public Integer resolvedBufferMinutes() {
        if (bufferTime != null) return bufferTime;
        return bufferMinutes;
    }
}

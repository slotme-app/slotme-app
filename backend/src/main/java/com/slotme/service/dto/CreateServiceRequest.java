package com.slotme.service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateServiceRequest(
        String categoryId,
        @NotBlank @Size(max = 255) String name,
        @Size(max = 2000) String description,
        Integer duration,
        Integer durationMinutes,
        Integer bufferTime,
        Integer bufferMinutes,
        @NotNull BigDecimal price,
        @Size(max = 3) String currency,
        Integer sortOrder,
        java.util.List<String> masterIds
) {
    public int resolvedDurationMinutes() {
        if (duration != null) return duration;
        if (durationMinutes != null) return durationMinutes;
        return 0;
    }

    public int resolvedBufferMinutes() {
        if (bufferTime != null) return bufferTime;
        if (bufferMinutes != null) return bufferMinutes;
        return 0;
    }
}

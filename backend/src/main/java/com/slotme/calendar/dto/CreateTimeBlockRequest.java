package com.slotme.calendar.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record CreateTimeBlockRequest(
        @NotBlank @Size(max = 50) String blockType,
        @Size(max = 255) String title,
        @NotNull Instant startAt,
        @NotNull Instant endAt,
        boolean recurring,
        @Size(max = 500) String recurrenceRule
) {}

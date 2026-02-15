package com.slotme.calendar.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;
import java.util.List;

public record SetAvailabilityRequest(
        @Valid @NotNull List<DayRule> rules
) {
    public record DayRule(
            int dayOfWeek,
            @NotNull LocalTime startTime,
            @NotNull LocalTime endTime,
            boolean available
    ) {}
}

package com.slotme.calendar.dto;

import java.time.LocalTime;

public record AvailabilityRuleDto(
        String id,
        int dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        boolean available
) {}

package com.slotme.calendar.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record AvailableSlotResponse(
        List<DaySlots> slots
) {
    public record DaySlots(
            LocalDate date,
            String masterId,
            String masterName,
            List<TimeSlot> availableTimes
    ) {}

    public record TimeSlot(
            LocalTime start,
            LocalTime end
    ) {}
}

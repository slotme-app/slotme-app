package com.slotme.calendar.dto;

import java.time.Instant;

public record TimeBlockDto(
        String id,
        String blockType,
        String title,
        Instant startAt,
        Instant endAt,
        boolean recurring,
        String recurrenceRule
) {}

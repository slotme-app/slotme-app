package com.slotme.appointment.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record AppointmentResponse(
        String id,
        String salonId,
        String masterId,
        String masterName,
        String clientId,
        String clientName,
        String serviceId,
        String serviceName,
        String status,
        Instant startAt,
        Instant endAt,
        int durationMinutes,
        BigDecimal price,
        String currency,
        String notes,
        String internalNotes,
        String source,
        Instant cancelledAt,
        String cancellationReason,
        Instant createdAt,
        Instant updatedAt
) {}

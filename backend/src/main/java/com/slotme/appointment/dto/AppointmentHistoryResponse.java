package com.slotme.appointment.dto;

import java.time.Instant;

public record AppointmentHistoryResponse(
        String id,
        String appointmentId,
        String action,
        String oldStatus,
        String newStatus,
        Instant oldStartAt,
        Instant newStartAt,
        String changedBy,
        String changeSource,
        String notes,
        Instant createdAt
) {}

package com.slotme.appointment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public record CreateAppointmentRequest(
        UUID salonId,
        @NotNull UUID masterId,
        @NotNull UUID serviceId,
        UUID clientId,
        String clientPhone,
        String clientName,
        Instant startAt,
        String startTime,
        @Size(max = 2000) String notes,
        @Size(max = 50) String source
) {
    public Instant resolvedStartAt() {
        if (startAt != null) return startAt;
        if (startTime != null) return Instant.parse(startTime);
        return null;
    }
}

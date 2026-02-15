package com.slotme.appointment.dto;

import jakarta.validation.constraints.Size;

public record CancelRequest(
        @Size(max = 1000) String reason
) {}

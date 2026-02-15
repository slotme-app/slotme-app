package com.slotme.salon.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import java.util.Map;

public record UpdateSalonRequest(
        @Size(max = 255) String name,
        @Size(max = 2000) String description,
        @Size(max = 20) String phone,
        @Email @Size(max = 255) String email,
        @Size(max = 500) String address,
        @Size(max = 100) String city,
        @Size(max = 2) String country,
        @Size(max = 50) String timezone,
        @Size(max = 3) String currency,
        @Size(max = 500) String logoUrl,
        Map<String, Object> settings
) {}

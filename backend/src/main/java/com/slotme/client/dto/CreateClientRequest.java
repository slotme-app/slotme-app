package com.slotme.client.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateClientRequest(
        @Size(max = 100) String firstName,
        @Size(max = 100) String lastName,
        @NotBlank @Size(max = 20) String phone,
        @Email @Size(max = 255) String email,
        @Size(max = 2000) String notes,
        List<String> tags,
        @Size(max = 50) String source
) {}

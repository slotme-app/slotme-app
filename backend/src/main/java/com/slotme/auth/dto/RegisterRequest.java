package com.slotme.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Size(max = 255) String tenantName,
        @NotBlank @Email @Size(max = 255) String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        @Size(max = 100) String firstName,
        @Size(max = 100) String lastName,
        @Size(max = 200) String name,
        @Size(max = 20) String phone,
        @NotBlank @Size(max = 255) String salonName,
        @Size(max = 50) String timezone
) {
    public String resolvedFirstName() {
        if (firstName != null && !firstName.isBlank()) return firstName;
        if (name != null && !name.isBlank()) {
            String[] parts = name.trim().split("\\s+", 2);
            return parts[0];
        }
        return "";
    }

    public String resolvedLastName() {
        if (lastName != null && !lastName.isBlank()) return lastName;
        if (name != null && !name.isBlank()) {
            String[] parts = name.trim().split("\\s+", 2);
            return parts.length > 1 ? parts[1] : "";
        }
        return "";
    }

    public String resolvedTenantName() {
        if (tenantName != null && !tenantName.isBlank()) return tenantName;
        return salonName;
    }
}

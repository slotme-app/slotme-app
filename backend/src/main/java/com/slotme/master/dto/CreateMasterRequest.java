package com.slotme.master.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateMasterRequest(
        @NotBlank @Email @Size(max = 255) String email,
        @Size(max = 100) String firstName,
        @Size(max = 100) String lastName,
        @Size(max = 20) String phone,
        @Size(max = 255) String displayName,
        @Size(max = 255) String name,
        @Size(max = 2000) String bio,
        @Size(max = 255) String specialization,
        List<String> serviceIds
) {
    public String resolvedFirstName() {
        if (firstName != null && !firstName.isBlank()) return firstName;
        if (name != null && !name.isBlank()) return name.split("\\s+")[0];
        if (displayName != null && !displayName.isBlank()) return displayName.split("\\s+")[0];
        return "";
    }

    public String resolvedLastName() {
        if (lastName != null && !lastName.isBlank()) return lastName;
        if (name != null && name.contains(" ")) return name.substring(name.indexOf(' ') + 1);
        if (displayName != null && displayName.contains(" ")) return displayName.substring(displayName.indexOf(' ') + 1);
        return "";
    }

    public String resolvedDisplayName() {
        if (displayName != null && !displayName.isBlank()) return displayName;
        if (name != null && !name.isBlank()) return name;
        return (resolvedFirstName() + " " + resolvedLastName()).trim();
    }
}

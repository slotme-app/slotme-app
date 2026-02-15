package com.slotme.master.dto;

import jakarta.validation.constraints.Size;

import java.util.List;

public record UpdateMasterRequest(
        @Size(max = 255) String displayName,
        @Size(max = 2000) String bio,
        @Size(max = 255) String specialization,
        @Size(max = 500) String avatarUrl,
        Boolean active,
        List<String> serviceIds
) {}

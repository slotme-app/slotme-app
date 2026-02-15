package com.slotme.service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateServiceCategoryRequest(
        @NotBlank @Size(max = 100) String name,
        Integer sortOrder
) {}

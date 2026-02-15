package com.slotme.client.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record MergeClientsRequest(
        @NotNull UUID primaryId,
        @NotNull UUID secondaryId
) {}

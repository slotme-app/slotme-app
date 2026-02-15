package com.slotme.common.dto;

import java.util.Map;

public record ErrorResponse(
        String code,
        String message,
        Map<String, ?> details
) {}

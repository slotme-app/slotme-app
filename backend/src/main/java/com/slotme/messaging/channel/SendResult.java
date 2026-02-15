package com.slotme.messaging.channel;

public record SendResult(
        boolean success,
        String externalMessageId,
        String errorMessage
) {
    public static SendResult success(String externalMessageId) {
        return new SendResult(true, externalMessageId, null);
    }

    public static SendResult failure(String errorMessage) {
        return new SendResult(false, null, errorMessage);
    }
}

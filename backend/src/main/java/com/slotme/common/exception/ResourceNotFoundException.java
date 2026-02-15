package com.slotme.common.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceType, Object id) {
        super("%s not found with id: %s".formatted(resourceType, id));
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

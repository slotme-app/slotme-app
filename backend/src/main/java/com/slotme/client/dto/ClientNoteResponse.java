package com.slotme.client.dto;

import com.slotme.client.entity.ClientNote;

import java.time.Instant;

public record ClientNoteResponse(
        String id,
        String clientId,
        String authorId,
        String content,
        Instant createdAt,
        Instant updatedAt
) {
    public static ClientNoteResponse from(ClientNote note) {
        return new ClientNoteResponse(
                note.getId().toString(),
                note.getClientId().toString(),
                note.getAuthorId().toString(),
                note.getContent(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}

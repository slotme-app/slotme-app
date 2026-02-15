package com.slotme.client.service;

import com.slotme.client.dto.ClientNoteResponse;
import com.slotme.client.dto.CreateNoteRequest;
import com.slotme.client.entity.ClientNote;
import com.slotme.client.repository.ClientNoteRepository;
import com.slotme.client.repository.ClientRepository;
import com.slotme.common.exception.ResourceNotFoundException;
import com.slotme.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ClientNoteService {

    private final ClientNoteRepository noteRepository;
    private final ClientRepository clientRepository;

    public ClientNoteService(ClientNoteRepository noteRepository,
                             ClientRepository clientRepository) {
        this.noteRepository = noteRepository;
        this.clientRepository = clientRepository;
    }

    public List<ClientNoteResponse> getNotes(UUID clientId) {
        clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));
        return noteRepository.findByClientIdOrderByCreatedAtDesc(clientId).stream()
                .map(ClientNoteResponse::from)
                .toList();
    }

    @Transactional
    public ClientNoteResponse addNote(UUID clientId, CreateNoteRequest request) {
        clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", clientId));

        ClientNote note = new ClientNote();
        note.setClientId(clientId);
        note.setAuthorId(SecurityUtils.getCurrentUserId());
        note.setContent(request.content());
        note = noteRepository.save(note);
        return ClientNoteResponse.from(note);
    }

    @Transactional
    public ClientNoteResponse updateNote(UUID noteId, CreateNoteRequest request) {
        ClientNote note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("ClientNote", noteId));
        note.setContent(request.content());
        note = noteRepository.save(note);
        return ClientNoteResponse.from(note);
    }

    @Transactional
    public void deleteNote(UUID noteId) {
        if (!noteRepository.existsById(noteId)) {
            throw new ResourceNotFoundException("ClientNote", noteId);
        }
        noteRepository.deleteById(noteId);
    }
}

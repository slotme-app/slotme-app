package com.slotme.client.repository;

import com.slotme.client.entity.ClientNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClientNoteRepository extends JpaRepository<ClientNote, UUID> {

    List<ClientNote> findByClientIdOrderByCreatedAtDesc(UUID clientId);

    void deleteByClientId(UUID clientId);
}

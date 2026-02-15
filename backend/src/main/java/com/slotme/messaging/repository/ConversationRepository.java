package com.slotme.messaging.repository;

import com.slotme.messaging.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    Optional<Conversation> findByClientIdAndChannelAndStatus(UUID clientId, String channel, String status);

    Optional<Conversation> findByChannelAndChannelConversationId(String channel, String channelConversationId);
}

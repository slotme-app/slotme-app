-- V009: Create conversations and messages tables

CREATE TABLE conversations (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id                   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id                    UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    client_id                   UUID NOT NULL REFERENCES clients(id),
    channel                     VARCHAR(20) NOT NULL,
    channel_conversation_id     VARCHAR(255),
    status                      VARCHAR(20) NOT NULL DEFAULT 'active',
    context                     JSONB NOT NULL DEFAULT '{}',
    assigned_to                 UUID REFERENCES users(id),
    last_message_at             TIMESTAMPTZ,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_client ON conversations(client_id);
CREATE INDEX idx_conversations_channel ON conversations(channel, channel_conversation_id);
CREATE INDEX idx_conversations_salon ON conversations(salon_id);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations FORCE ROW LEVEL SECURITY;

CREATE TABLE messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    direction           VARCHAR(10) NOT NULL,
    sender_type         VARCHAR(10) NOT NULL,
    sender_id           UUID,
    content_type        VARCHAR(20) NOT NULL DEFAULT 'text',
    content             TEXT NOT NULL,
    metadata            JSONB DEFAULT '{}',
    external_id         VARCHAR(255),
    status              VARCHAR(20) NOT NULL DEFAULT 'sent',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_external ON messages(external_id);

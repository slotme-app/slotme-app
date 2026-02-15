-- V007: Create clients and client_preferences tables
CREATE TABLE clients (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id        UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    phone           VARCHAR(20) NOT NULL,
    email           VARCHAR(255),
    notes           TEXT,
    tags            TEXT[],
    source          VARCHAR(30) NOT NULL DEFAULT 'manual',
    last_visit_at   TIMESTAMPTZ,
    total_visits    INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(salon_id, phone)
);

CREATE INDEX idx_clients_salon ON clients(salon_id);
CREATE INDEX idx_clients_phone ON clients(phone);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients FORCE ROW LEVEL SECURITY;

CREATE TABLE client_preferences (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id           UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    preferred_master_id UUID REFERENCES masters(id),
    preferred_day       SMALLINT,
    preferred_time      TIME,
    preferred_channel   VARCHAR(20),
    language            VARCHAR(10) DEFAULT 'en',
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(client_id)
);

ALTER TABLE client_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_preferences FORCE ROW LEVEL SECURITY;

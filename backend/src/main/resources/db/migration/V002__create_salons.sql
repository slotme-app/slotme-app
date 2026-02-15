-- V002: Create salons table
CREATE TABLE salons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    description     TEXT,
    phone           VARCHAR(20),
    email           VARCHAR(255),
    address         TEXT,
    city            VARCHAR(100),
    country         VARCHAR(2),
    timezone        VARCHAR(50) NOT NULL DEFAULT 'UTC',
    currency        VARCHAR(3) NOT NULL DEFAULT 'USD',
    logo_url        VARCHAR(500),
    settings        JSONB NOT NULL DEFAULT '{}',
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, slug)
);

CREATE INDEX idx_salons_tenant ON salons(tenant_id);

ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE salons FORCE ROW LEVEL SECURITY;

-- V005: Create masters and master_services tables
CREATE TABLE masters (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id        UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name    VARCHAR(255) NOT NULL,
    bio             TEXT,
    specialization  VARCHAR(255),
    avatar_url      VARCHAR(500),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_masters_salon ON masters(salon_id);
CREATE INDEX idx_masters_user ON masters(user_id);

ALTER TABLE masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE masters FORCE ROW LEVEL SECURITY;

CREATE TABLE master_services (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_id       UUID NOT NULL REFERENCES masters(id) ON DELETE CASCADE,
    service_id      UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    custom_duration INT,
    custom_price    DECIMAL(10,2),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(master_id, service_id)
);

CREATE INDEX idx_master_services_master ON master_services(master_id);
CREATE INDEX idx_master_services_service ON master_services(service_id);

ALTER TABLE master_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_services FORCE ROW LEVEL SECURITY;

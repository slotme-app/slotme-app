-- V008: Create appointments and appointment_history tables

CREATE TABLE appointments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id            UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    master_id           UUID NOT NULL REFERENCES masters(id),
    client_id           UUID NOT NULL REFERENCES clients(id),
    service_id          UUID NOT NULL REFERENCES services(id),
    status              VARCHAR(30) NOT NULL DEFAULT 'confirmed',
    start_at            TIMESTAMPTZ NOT NULL,
    end_at              TIMESTAMPTZ NOT NULL,
    duration_minutes    INT NOT NULL,
    price               DECIMAL(10,2) NOT NULL,
    currency            VARCHAR(3) NOT NULL DEFAULT 'USD',
    notes               TEXT,
    internal_notes      TEXT,
    source              VARCHAR(30) NOT NULL DEFAULT 'manual',
    cancelled_at        TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (start_at < end_at)
);

CREATE INDEX idx_appointments_master_date ON appointments(master_id, start_at);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_salon_date ON appointments(salon_id, start_at);
CREATE INDEX idx_appointments_status ON appointments(status);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments FORCE ROW LEVEL SECURITY;

CREATE TABLE appointment_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id  UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    action          VARCHAR(50) NOT NULL,
    old_status      VARCHAR(30),
    new_status      VARCHAR(30) NOT NULL,
    old_start_at    TIMESTAMPTZ,
    new_start_at    TIMESTAMPTZ,
    changed_by      UUID REFERENCES users(id),
    change_source   VARCHAR(30) NOT NULL,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_appointment_history_appt ON appointment_history(appointment_id);

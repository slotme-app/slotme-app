-- V006: Create calendars, availability_rules, and time_blocks tables
CREATE TABLE calendars (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    master_id       UUID NOT NULL REFERENCES masters(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL DEFAULT 'Primary',
    timezone        VARCHAR(50) NOT NULL DEFAULT 'UTC',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(master_id)
);

CREATE INDEX idx_calendars_master ON calendars(master_id);

ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendars FORCE ROW LEVEL SECURITY;

CREATE TABLE availability_rules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id     UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
    day_of_week     SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    is_available    BOOLEAN NOT NULL DEFAULT true,
    valid_from      DATE,
    valid_until     DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (start_time < end_time)
);

CREATE INDEX idx_availability_rules_calendar ON availability_rules(calendar_id);
CREATE INDEX idx_availability_rules_day ON availability_rules(day_of_week);

ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules FORCE ROW LEVEL SECURITY;

CREATE TABLE time_blocks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id     UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
    block_type      VARCHAR(30) NOT NULL,
    title           VARCHAR(255),
    start_at        TIMESTAMPTZ NOT NULL,
    end_at          TIMESTAMPTZ NOT NULL,
    is_recurring    BOOLEAN NOT NULL DEFAULT false,
    recurrence_rule VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (start_at < end_at)
);

CREATE INDEX idx_time_blocks_calendar ON time_blocks(calendar_id);
CREATE INDEX idx_time_blocks_range ON time_blocks(start_at, end_at);

ALTER TABLE time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_blocks FORCE ROW LEVEL SECURITY;

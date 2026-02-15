# SlotMe Backend Technical Specification

> **Version:** 1.0
> **Date:** 2026-02-07
> **Status:** Draft

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Multi-Tenancy Architecture](#2-multi-tenancy-architecture)
3. [Database Schema Design](#3-database-schema-design)
4. [API Design (RESTful)](#4-api-design-restful)
5. [Service Layer Architecture](#5-service-layer-architecture)
6. [Scheduling Engine](#6-scheduling-engine)
7. [Communication Channel Integration](#7-communication-channel-integration)
8. [AI Conversation Engine](#8-ai-conversation-engine)
9. [Notification Service](#9-notification-service)
10. [Security](#10-security)
11. [Error Handling](#11-error-handling)
12. [Testing Strategy](#12-testing-strategy)
13. [Deployment](#13-deployment)

---

## 1. Technology Stack

### Language & Framework

| Component | Technology | Version | Justification |
|-----------|-----------|---------|---------------|
| **Language** | Java 21 | LTS | Long-term support, virtual threads (Project Loom), pattern matching, records |
| **Framework** | Spring Boot 3.4 | Latest stable | Mature ecosystem, multi-tenancy support via Hibernate 6, native compilation ready |
| **Build Tool** | Gradle (Kotlin DSL) | 8.x | Faster builds, better dependency management than Maven |

**Why Java/Spring Boot over Node.js:**
- Type safety reduces runtime errors in a complex domain (scheduling, multi-tenancy)
- Hibernate 6 has first-class multi-tenancy support (schema-per-tenant, discriminator)
- Spring Security provides enterprise-grade auth with minimal boilerplate
- Virtual threads (Java 21) eliminate the async/callback complexity that was Node.js's main advantage
- Mature scheduling libraries (Quartz) for cron-based notification jobs
- Superior tooling for large codebases as the project scales

### Database

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Primary DB** | PostgreSQL 16 | Row-Level Security, JSONB for flexible config, excellent concurrency |
| **Migrations** | Flyway | SQL-based migrations, integrates with Spring Boot |
| **Connection Pool** | HikariCP | Default in Spring Boot, highest performance |

### Message Queue

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Message Broker** | Redis Streams | Lightweight, already using Redis for cache, sufficient for event volumes |
| **Fallback** | RabbitMQ | If message durability/routing requirements exceed Redis Streams capabilities |

Redis Streams is chosen over Kafka because the expected message volume (notifications, webhook events) does not warrant Kafka's operational complexity. Redis Streams provides consumer groups, message acknowledgment, and persistence while being simpler to operate.

### Cache

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Cache** | Redis 7 | Session storage, rate limiting, availability slot caching, pub/sub |

### AI/LLM Integration

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **LLM Provider** | OpenAI API (GPT-4.1) | Best function-calling support for structured booking flows |
| **LLM Framework** | Spring AI | Native Spring integration, supports tool calling, prompt templates |
| **Voice Agent** | ElevenLabs Conversational AI | Voice channel for phone-based booking |
| **Embeddings** | OpenAI text-embedding-3-small | For FAQ/knowledge base retrieval |
| **Vector Store** | pgvector (PostgreSQL extension) | Keeps everything in one database, avoids additional infrastructure |

### Supporting Libraries

| Library | Purpose |
|---------|---------|
| MapStruct | DTO-entity mapping |
| Spring Validation | Request validation (jakarta.validation) |
| SpringDoc OpenAPI | API documentation (Swagger UI) |
| Resilience4j | Circuit breaker for external API calls |
| Micrometer + Prometheus | Metrics collection |
| Logback + Structured Logging (JSON) | Centralized logging |

---

## 2. Multi-Tenancy Architecture

### Tenant Isolation Strategy

**Recommended: Shared Database with Row-Level Security (RLS)**

This project uses a single PostgreSQL database with a `tenant_id` column on every tenant-scoped table, enforced by PostgreSQL Row-Level Security policies.

| Strategy | Pros | Cons |
|----------|------|------|
| **RLS (Chosen)** | Simple operations, easy cross-tenant analytics, single migration path, lowest cost | Requires discipline with `tenant_id`, RLS policy overhead on queries |
| Schema-per-tenant | Good isolation, independent migrations | Complex tenant provisioning, harder to do cross-tenant queries |
| Database-per-tenant | Maximum isolation, per-tenant backup/restore | Expensive, connection pool per tenant, complex operations |

**Why RLS for SlotMe:**
- Beauty salons are small tenants (5-20 users each). No single tenant needs schema-level isolation.
- Shared tables make cross-tenant analytics straightforward (platform-level dashboards).
- Simpler deployment: one database, one migration path, one connection pool.
- PostgreSQL RLS is battle-tested and enforced at the database engine level.

### Row-Level Security Implementation

```sql
-- Enable RLS on tenant-scoped tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their tenant's data
CREATE POLICY tenant_isolation ON salons
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Force RLS even for table owners
ALTER TABLE salons FORCE ROW LEVEL SECURITY;
```

### Tenant Resolution Flow

```
Request → TenantFilter → Extract tenant_id from JWT claim
        → Set PostgreSQL session variable: SET app.current_tenant_id = '<uuid>'
        → Request proceeds with RLS active
        → Response → Clear tenant context
```

**Tenant identification sources (in priority order):**
1. **JWT `tenant_id` claim** (primary) - Extracted from authenticated requests
2. **X-Tenant-ID header** - For service-to-service calls
3. **Subdomain** - `salon-name.slotme.app` maps to tenant (future, for white-label)

### Spring Boot Implementation

```java
@Component
public class TenantFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain chain) {
        String tenantId = extractTenantFromJwt(request);
        TenantContext.setCurrentTenant(tenantId);
        try {
            // Set PostgreSQL session variable for RLS
            entityManager.createNativeQuery(
                "SET app.current_tenant_id = :tenantId")
                .setParameter("tenantId", tenantId)
                .executeUpdate();
            chain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
```

### Data Migration Strategy

- All migrations are applied globally (single schema, single Flyway migration path)
- New tenant provisioning: INSERT into `tenants` table + seed default data (roles, notification templates)
- Tenant data export: Query with `WHERE tenant_id = ?` (RLS bypassed by superuser role)
- Tenant deletion: Cascade delete via `tenant_id` FK or soft-delete with `deleted_at`

---

## 3. Database Schema Design

### Entity Relationship Overview

```
tenants
  └── salons
        ├── users (salon admins, masters)
        ├── services → service_categories
        ├── masters → master_services (junction)
        │     ├── calendars → availability_rules, time_blocks
        │     └── appointments → appointment_history
        ├── clients → client_preferences
        │     ├── conversations → messages
        │     └── waitlist_entries
        ├── notifications → notification_templates
        └── communication_channels → channel_configs
```

### Table Definitions

#### tenants

```sql
CREATE TABLE tenants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,       -- URL-safe identifier
    plan            VARCHAR(50) NOT NULL DEFAULT 'free', -- free, starter, pro, enterprise
    status          VARCHAR(20) NOT NULL DEFAULT 'active', -- active, suspended, cancelled
    settings        JSONB NOT NULL DEFAULT '{}',         -- timezone, locale, currency
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### salons

```sql
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
    country         VARCHAR(2),                          -- ISO 3166-1 alpha-2
    timezone        VARCHAR(50) NOT NULL DEFAULT 'UTC',  -- e.g. 'Europe/London'
    currency        VARCHAR(3) NOT NULL DEFAULT 'USD',   -- ISO 4217
    logo_url        VARCHAR(500),
    settings        JSONB NOT NULL DEFAULT '{}',          -- booking rules, cancellation policy
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, slug)
);
CREATE INDEX idx_salons_tenant ON salons(tenant_id);
```

#### users

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id        UUID REFERENCES salons(id) ON DELETE SET NULL,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    avatar_url      VARCHAR(500),
    role            VARCHAR(30) NOT NULL,                -- SUPER_ADMIN, SALON_ADMIN, MASTER
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, email)
);
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_salon ON users(salon_id);
```

#### roles (RBAC)

```sql
CREATE TABLE roles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(50) NOT NULL,                -- SUPER_ADMIN, SALON_ADMIN, MASTER
    permissions     JSONB NOT NULL DEFAULT '[]',          -- ["salon:read","appointment:write",...]
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, name)
);
```

#### service_categories

```sql
CREATE TABLE service_categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id        UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_service_categories_salon ON service_categories(salon_id);
```

#### services

```sql
CREATE TABLE services (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id        UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    category_id     UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    duration_minutes INT NOT NULL,                       -- e.g. 60
    buffer_minutes  INT NOT NULL DEFAULT 0,              -- gap after appointment
    price           DECIMAL(10,2) NOT NULL,
    currency        VARCHAR(3) NOT NULL DEFAULT 'USD',
    is_active       BOOLEAN NOT NULL DEFAULT true,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_services_salon ON services(salon_id);
CREATE INDEX idx_services_category ON services(category_id);
```

#### masters

```sql
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
```

#### master_services

```sql
CREATE TABLE master_services (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_id       UUID NOT NULL REFERENCES masters(id) ON DELETE CASCADE,
    service_id      UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    custom_duration INT,                                  -- override service default
    custom_price    DECIMAL(10,2),                        -- override service default price
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(master_id, service_id)
);
CREATE INDEX idx_master_services_master ON master_services(master_id);
CREATE INDEX idx_master_services_service ON master_services(service_id);
```

#### calendars

```sql
CREATE TABLE calendars (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    master_id       UUID NOT NULL REFERENCES masters(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL DEFAULT 'Primary',
    timezone        VARCHAR(50) NOT NULL DEFAULT 'UTC',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(master_id)  -- one calendar per master
);
CREATE INDEX idx_calendars_master ON calendars(master_id);
```

#### availability_rules

```sql
CREATE TABLE availability_rules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id     UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
    day_of_week     SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Mon
    start_time      TIME NOT NULL,                       -- e.g. '09:00'
    end_time        TIME NOT NULL,                       -- e.g. '18:00'
    is_available     BOOLEAN NOT NULL DEFAULT true,       -- false = explicitly unavailable
    valid_from      DATE,                                -- NULL = always valid
    valid_until     DATE,                                -- NULL = no end date
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (start_time < end_time)
);
CREATE INDEX idx_availability_rules_calendar ON availability_rules(calendar_id);
CREATE INDEX idx_availability_rules_day ON availability_rules(day_of_week);
```

#### time_blocks

```sql
CREATE TABLE time_blocks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id     UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
    block_type      VARCHAR(30) NOT NULL,                -- BREAK, LUNCH, VACATION, BLOCKED, CUSTOM
    title           VARCHAR(255),
    start_at        TIMESTAMPTZ NOT NULL,
    end_at          TIMESTAMPTZ NOT NULL,
    is_recurring    BOOLEAN NOT NULL DEFAULT false,
    recurrence_rule VARCHAR(255),                         -- iCal RRULE format
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (start_at < end_at)
);
CREATE INDEX idx_time_blocks_calendar ON time_blocks(calendar_id);
CREATE INDEX idx_time_blocks_range ON time_blocks(start_at, end_at);
```

#### appointments

```sql
CREATE TABLE appointments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id        UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    master_id       UUID NOT NULL REFERENCES masters(id),
    client_id       UUID NOT NULL REFERENCES clients(id),
    service_id      UUID NOT NULL REFERENCES services(id),
    status          VARCHAR(30) NOT NULL DEFAULT 'confirmed',
                    -- confirmed, completed, cancelled_by_client,
                    -- cancelled_by_master, no_show, rescheduled
    start_at        TIMESTAMPTZ NOT NULL,
    end_at          TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL,
    price           DECIMAL(10,2) NOT NULL,
    currency        VARCHAR(3) NOT NULL DEFAULT 'USD',
    notes           TEXT,                                 -- client notes
    internal_notes  TEXT,                                 -- staff-only notes
    source          VARCHAR(30) NOT NULL DEFAULT 'manual',
                    -- manual, whatsapp, facebook, sms, voice, web
    cancelled_at    TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (start_at < end_at)
);
CREATE INDEX idx_appointments_master_date ON appointments(master_id, start_at);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_salon_date ON appointments(salon_id, start_at);
CREATE INDEX idx_appointments_status ON appointments(status);
```

#### appointment_history

```sql
CREATE TABLE appointment_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id  UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    action          VARCHAR(50) NOT NULL,                -- created, rescheduled, cancelled, completed
    old_status      VARCHAR(30),
    new_status      VARCHAR(30) NOT NULL,
    old_start_at    TIMESTAMPTZ,
    new_start_at    TIMESTAMPTZ,
    changed_by      UUID REFERENCES users(id),           -- NULL = system/AI
    change_source   VARCHAR(30) NOT NULL,                 -- manual, whatsapp, facebook, sms, voice, system
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_appointment_history_appt ON appointment_history(appointment_id);
```

#### clients

```sql
CREATE TABLE clients (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id        UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    phone           VARCHAR(20) NOT NULL,                 -- primary identifier for messaging
    email           VARCHAR(255),
    notes           TEXT,
    tags            TEXT[],                                -- e.g. {'vip', 'regular'}
    source          VARCHAR(30) NOT NULL DEFAULT 'manual', -- how client was acquired
    last_visit_at   TIMESTAMPTZ,
    total_visits    INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(salon_id, phone)
);
CREATE INDEX idx_clients_salon ON clients(salon_id);
CREATE INDEX idx_clients_phone ON clients(phone);
```

#### client_preferences

```sql
CREATE TABLE client_preferences (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    preferred_master_id UUID REFERENCES masters(id),
    preferred_day   SMALLINT,                             -- 0=Mon
    preferred_time  TIME,
    preferred_channel VARCHAR(20),                        -- whatsapp, facebook, sms, voice
    language        VARCHAR(10) DEFAULT 'en',
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(client_id)
);
```

#### conversations

```sql
CREATE TABLE conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id        UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    client_id       UUID NOT NULL REFERENCES clients(id),
    channel         VARCHAR(20) NOT NULL,                 -- whatsapp, facebook, sms, voice
    channel_conversation_id VARCHAR(255),                  -- external platform conversation ID
    status          VARCHAR(20) NOT NULL DEFAULT 'active', -- active, resolved, escalated
    context         JSONB NOT NULL DEFAULT '{}',           -- current conversation state (slot filling)
    assigned_to     UUID REFERENCES users(id),             -- NULL = AI handling
    last_message_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_conversations_client ON conversations(client_id);
CREATE INDEX idx_conversations_channel ON conversations(channel, channel_conversation_id);
CREATE INDEX idx_conversations_salon ON conversations(salon_id);
```

#### messages

```sql
CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    direction       VARCHAR(10) NOT NULL,                 -- inbound, outbound
    sender_type     VARCHAR(10) NOT NULL,                 -- client, ai, staff
    sender_id       UUID,                                 -- user_id if staff, NULL if AI
    content_type    VARCHAR(20) NOT NULL DEFAULT 'text',  -- text, image, audio, template, interactive
    content         TEXT NOT NULL,
    metadata        JSONB DEFAULT '{}',                    -- channel-specific data (media URLs, template params)
    external_id     VARCHAR(255),                          -- WhatsApp/FB message ID
    status          VARCHAR(20) NOT NULL DEFAULT 'sent',  -- sent, delivered, read, failed
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_external ON messages(external_id);
```

#### notification_templates

```sql
CREATE TABLE notification_templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id        UUID REFERENCES salons(id) ON DELETE CASCADE, -- NULL = tenant-level default
    trigger_event   VARCHAR(50) NOT NULL,                 -- appointment_confirmed, reminder_24h,
                                                          -- reminder_1h, cancelled, rescheduled,
                                                          -- waitlist_available, follow_up
    channel         VARCHAR(20) NOT NULL,                 -- whatsapp, facebook, sms, email
    language        VARCHAR(10) NOT NULL DEFAULT 'en',
    subject         VARCHAR(255),                          -- for email
    body_template   TEXT NOT NULL,                         -- template with {{variables}}
    whatsapp_template_name VARCHAR(255),                   -- approved WA template name
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notification_templates_trigger ON notification_templates(trigger_event);
```

#### notifications

```sql
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    template_id     UUID REFERENCES notification_templates(id),
    client_id       UUID REFERENCES clients(id),
    appointment_id  UUID REFERENCES appointments(id),
    channel         VARCHAR(20) NOT NULL,
    recipient       VARCHAR(255) NOT NULL,                -- phone/email
    content         TEXT NOT NULL,                         -- rendered template
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
                    -- pending, sent, delivered, read, failed
    external_id     VARCHAR(255),                          -- provider message ID
    scheduled_at    TIMESTAMPTZ,                           -- for future delivery
    sent_at         TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    failure_reason  TEXT,
    retry_count     INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_at) WHERE status = 'pending';
CREATE INDEX idx_notifications_client ON notifications(client_id);
```

#### waitlist_entries

```sql
CREATE TABLE waitlist_entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id        UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    client_id       UUID NOT NULL REFERENCES clients(id),
    service_id      UUID NOT NULL REFERENCES services(id),
    master_id       UUID REFERENCES masters(id),          -- NULL = any master
    preferred_date_from DATE,
    preferred_date_until DATE,
    preferred_time_from TIME,
    preferred_time_until TIME,
    status          VARCHAR(20) NOT NULL DEFAULT 'active', -- active, notified, booked, expired
    notified_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_waitlist_salon ON waitlist_entries(salon_id, status);
CREATE INDEX idx_waitlist_master ON waitlist_entries(master_id, status);
```

#### communication_channels

```sql
CREATE TABLE communication_channels (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    salon_id        UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
    channel_type    VARCHAR(20) NOT NULL,                 -- whatsapp, facebook, sms, voice
    is_active       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(salon_id, channel_type)
);
```

#### channel_configs

```sql
CREATE TABLE channel_configs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id      UUID NOT NULL REFERENCES communication_channels(id) ON DELETE CASCADE,
    config_key      VARCHAR(100) NOT NULL,                -- e.g. 'whatsapp_phone_number_id',
                                                          -- 'whatsapp_business_account_id',
                                                          -- 'fb_page_id', 'twilio_sid'
    config_value    TEXT NOT NULL,                         -- encrypted at rest for secrets
    is_secret       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(channel_id, config_key)
);
```

---

## 4. API Design (RESTful)

**Base URL:** `/api/v1`
**Content-Type:** `application/json`
**Authentication:** Bearer JWT token (except public webhook endpoints)
**Tenant Resolution:** JWT `tenant_id` claim

### 4.1 Auth & Tenancy

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new tenant + admin user | Public |
| POST | `/auth/login` | Authenticate, return JWT + refresh token | Public |
| POST | `/auth/refresh` | Refresh access token | Refresh Token |
| POST | `/auth/forgot-password` | Send password reset email | Public |
| POST | `/auth/reset-password` | Reset password with token | Public |
| GET | `/auth/me` | Get current user profile | Authenticated |
| PUT | `/auth/me` | Update current user profile | Authenticated |

**Register Request:**
```json
{
  "tenant_name": "Bella Salon",
  "email": "owner@bellasalon.com",
  "password": "SecurePassword123!",
  "first_name": "Maria",
  "last_name": "Garcia",
  "phone": "+1234567890",
  "salon_name": "Bella Salon",
  "timezone": "America/New_York"
}
```

**Login Response:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "owner@bellasalon.com",
    "role": "SALON_ADMIN",
    "tenant_id": "uuid",
    "salon_id": "uuid"
  }
}
```

### 4.2 Salon Management

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/salons` | List salons for tenant | SUPER_ADMIN |
| GET | `/salons/{id}` | Get salon details | SALON_ADMIN, MASTER |
| PUT | `/salons/{id}` | Update salon | SALON_ADMIN |
| POST | `/salons/{id}/masters` | Add master to salon | SALON_ADMIN |
| GET | `/salons/{id}/masters` | List masters in salon | SALON_ADMIN, MASTER |
| GET | `/salons/{id}/masters/{masterId}` | Get master details | SALON_ADMIN, MASTER |
| PUT | `/salons/{id}/masters/{masterId}` | Update master profile | SALON_ADMIN, MASTER (own) |
| DELETE | `/salons/{id}/masters/{masterId}` | Deactivate master | SALON_ADMIN |
| POST | `/salons/{id}/services` | Create service | SALON_ADMIN |
| GET | `/salons/{id}/services` | List services (with categories) | SALON_ADMIN, MASTER |
| PUT | `/salons/{id}/services/{serviceId}` | Update service | SALON_ADMIN |
| DELETE | `/salons/{id}/services/{serviceId}` | Deactivate service | SALON_ADMIN |
| POST | `/salons/{id}/service-categories` | Create category | SALON_ADMIN |
| GET | `/salons/{id}/service-categories` | List categories | SALON_ADMIN, MASTER |
| PUT | `/salons/{id}/service-categories/{catId}` | Update category | SALON_ADMIN |

### 4.3 Calendar & Availability

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/masters/{masterId}/availability` | Get weekly availability rules | SALON_ADMIN, MASTER |
| PUT | `/masters/{masterId}/availability` | Set weekly availability rules | SALON_ADMIN, MASTER |
| GET | `/masters/{masterId}/time-blocks?from=&to=` | Get time blocks in range | SALON_ADMIN, MASTER |
| POST | `/masters/{masterId}/time-blocks` | Create time block (break, vacation) | SALON_ADMIN, MASTER |
| PUT | `/masters/{masterId}/time-blocks/{blockId}` | Update time block | SALON_ADMIN, MASTER |
| DELETE | `/masters/{masterId}/time-blocks/{blockId}` | Delete time block | SALON_ADMIN, MASTER |
| GET | `/salons/{id}/available-slots` | **Get available slots** | Any authenticated |

**Available Slots Request (query params):**
```
GET /salons/{id}/available-slots?service_id=uuid&master_id=uuid&date_from=2026-02-10&date_to=2026-02-14
```

**Available Slots Response:**
```json
{
  "slots": [
    {
      "date": "2026-02-10",
      "master_id": "uuid",
      "master_name": "Anna K.",
      "available_times": [
        {"start": "09:00", "end": "10:00"},
        {"start": "10:30", "end": "11:30"},
        {"start": "14:00", "end": "15:00"}
      ]
    }
  ]
}
```

### 4.4 Appointments

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/appointments` | Book new appointment | SALON_ADMIN, MASTER, System |
| GET | `/appointments` | List appointments (paginated, filterable) | SALON_ADMIN, MASTER |
| GET | `/appointments/{id}` | Get appointment details | SALON_ADMIN, MASTER |
| PUT | `/appointments/{id}` | Update appointment (reschedule) | SALON_ADMIN, MASTER |
| POST | `/appointments/{id}/cancel` | Cancel appointment | SALON_ADMIN, MASTER |
| POST | `/appointments/{id}/complete` | Mark as completed | SALON_ADMIN, MASTER |
| POST | `/appointments/{id}/no-show` | Mark as no-show | SALON_ADMIN, MASTER |
| POST | `/appointments/rearrange` | Trigger slot rearrangement after cancellation | System |

**Book Appointment Request:**
```json
{
  "salon_id": "uuid",
  "master_id": "uuid",
  "service_id": "uuid",
  "client_id": "uuid",
  "start_at": "2026-02-10T09:00:00Z",
  "notes": "First visit, sensitive skin",
  "source": "whatsapp"
}
```

**Filter params for GET /appointments:**
```
?salon_id=uuid&master_id=uuid&client_id=uuid&status=confirmed
&date_from=2026-02-01&date_to=2026-02-28&page=0&size=20&sort=start_at,asc
```

### 4.5 Clients

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/salons/{id}/clients` | Create client | SALON_ADMIN, MASTER |
| GET | `/salons/{id}/clients` | List clients (paginated, searchable) | SALON_ADMIN, MASTER |
| GET | `/salons/{id}/clients/{clientId}` | Get client details + history | SALON_ADMIN, MASTER |
| PUT | `/salons/{id}/clients/{clientId}` | Update client | SALON_ADMIN, MASTER |
| GET | `/salons/{id}/clients/{clientId}/appointments` | Client appointment history | SALON_ADMIN, MASTER |
| GET | `/salons/{id}/clients/{clientId}/conversations` | Client conversation history | SALON_ADMIN |

### 4.6 Messaging & Webhooks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/webhooks/whatsapp` | WhatsApp Cloud API webhook | Webhook verification |
| GET | `/webhooks/whatsapp` | WhatsApp webhook verification (hub.challenge) | Public |
| POST | `/webhooks/facebook` | Facebook Messenger webhook | Webhook verification |
| GET | `/webhooks/facebook` | Facebook webhook verification | Public |
| POST | `/webhooks/twilio/sms` | Twilio SMS incoming webhook | Twilio signature |
| POST | `/webhooks/twilio/status` | Twilio delivery status callback | Twilio signature |
| POST | `/webhooks/elevenlabs` | ElevenLabs post-call webhook | Webhook secret |
| GET | `/conversations` | List conversations (filterable) | SALON_ADMIN |
| GET | `/conversations/{id}` | Get conversation with messages | SALON_ADMIN |
| POST | `/conversations/{id}/messages` | Send manual message via channel | SALON_ADMIN |

**WhatsApp Webhook Payload (inbound message):**
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": { "phone_number_id": "...", "display_phone_number": "..." },
        "messages": [{
          "from": "15551234567",
          "type": "text",
          "text": { "body": "I want to book a haircut" },
          "timestamp": "1706889600"
        }]
      },
      "field": "messages"
    }]
  }]
}
```

### 4.7 Notifications

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/salons/{id}/notification-templates` | List templates | SALON_ADMIN |
| POST | `/salons/{id}/notification-templates` | Create template | SALON_ADMIN |
| PUT | `/salons/{id}/notification-templates/{tplId}` | Update template | SALON_ADMIN |
| DELETE | `/salons/{id}/notification-templates/{tplId}` | Delete template | SALON_ADMIN |
| GET | `/salons/{id}/notifications` | Notification log (paginated) | SALON_ADMIN |

### 4.8 Waitlist

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/salons/{id}/waitlist` | Add client to waitlist | SALON_ADMIN, System |
| GET | `/salons/{id}/waitlist` | List waitlist entries | SALON_ADMIN |
| DELETE | `/salons/{id}/waitlist/{entryId}` | Remove from waitlist | SALON_ADMIN |

### 4.9 Analytics

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/salons/{id}/analytics/dashboard` | Dashboard summary metrics | SALON_ADMIN |
| GET | `/salons/{id}/analytics/bookings` | Booking trends (daily/weekly/monthly) | SALON_ADMIN |
| GET | `/salons/{id}/analytics/masters` | Master utilization rates | SALON_ADMIN |
| GET | `/salons/{id}/analytics/services` | Popular services ranking | SALON_ADMIN |
| GET | `/salons/{id}/analytics/clients` | Client retention metrics | SALON_ADMIN |
| GET | `/salons/{id}/analytics/channels` | Bookings per communication channel | SALON_ADMIN |

**Dashboard Response:**
```json
{
  "period": "2026-02",
  "total_appointments": 342,
  "completed": 298,
  "cancelled": 28,
  "no_shows": 16,
  "revenue": 15420.00,
  "new_clients": 45,
  "returning_clients": 187,
  "avg_master_utilization_pct": 72.5,
  "top_service": { "name": "Haircut & Style", "count": 89 },
  "top_channel": { "name": "whatsapp", "count": 156 }
}
```

---

## 5. Service Layer Architecture

### Domain-Driven Design Boundaries

```
com.slotme.app
├── common/                     # Cross-cutting concerns
│   ├── config/                 # Spring configuration classes
│   ├── security/               # JWT, filters, RBAC
│   ├── tenant/                 # TenantContext, TenantFilter
│   ├── exception/              # Global error handler, custom exceptions
│   └── event/                  # Base event classes, event publisher
│
├── auth/                       # Authentication bounded context
│   ├── controller/
│   ├── service/
│   ├── dto/
│   └── repository/
│
├── salon/                      # Salon management bounded context
│   ├── controller/
│   ├── service/                # SalonService, MasterService, ServiceService
│   ├── dto/
│   ├── entity/
│   └── repository/
│
├── scheduling/                 # Scheduling engine bounded context
│   ├── controller/
│   ├── service/                # AvailabilityService, SlotService, AppointmentService
│   ├── engine/                 # SlotGenerator, ConflictDetector, RearrangementEngine
│   ├── dto/
│   ├── entity/
│   └── repository/
│
├── client/                     # Client management bounded context
│   ├── controller/
│   ├── service/
│   ├── dto/
│   ├── entity/
│   └── repository/
│
├── messaging/                  # Communication bounded context
│   ├── controller/             # Webhook controllers
│   ├── service/                # UnifiedMessagingService
│   ├── channel/                # WhatsApp, Facebook, Twilio, ElevenLabs adapters
│   ├── dto/
│   ├── entity/
│   └── repository/
│
├── conversation/               # AI conversation bounded context
│   ├── service/                # ConversationService, IntentClassifier
│   ├── engine/                 # ConversationEngine, SlotFiller, ContextManager
│   ├── prompt/                 # Prompt templates
│   ├── dto/
│   ├── entity/
│   └── repository/
│
├── notification/               # Notification bounded context
│   ├── service/                # NotificationService, TemplateRenderer
│   ├── scheduler/              # Reminder scheduler (Quartz jobs)
│   ├── dto/
│   ├── entity/
│   └── repository/
│
├── waitlist/                   # Waitlist bounded context
│   ├── service/
│   ├── dto/
│   ├── entity/
│   └── repository/
│
└── analytics/                  # Analytics bounded context
    ├── controller/
    ├── service/
    └── dto/
```

### Service Responsibilities

| Service | Responsibility |
|---------|----------------|
| `AuthService` | User registration, login, JWT generation, password management |
| `TenantService` | Tenant CRUD, provisioning (seed default data), plan management |
| `SalonService` | Salon CRUD, settings management |
| `MasterService` | Master CRUD, service assignments |
| `ServiceService` | Service and category CRUD |
| `AvailabilityService` | Weekly rules, time blocks, availability calculation |
| `SlotGenerator` | Compute available slots from rules minus bookings minus blocks |
| `AppointmentService` | Booking, rescheduling, cancellation, status transitions |
| `RearrangementEngine` | After cancellation, find waitlist matches to fill the gap |
| `ConflictDetector` | Check if a proposed time conflicts with existing bookings |
| `ClientService` | Client CRUD, search, history aggregation |
| `UnifiedMessagingService` | Route outbound messages to correct channel adapter |
| `WhatsAppAdapter` | WhatsApp Cloud API integration (send/receive) |
| `FacebookAdapter` | FB Messenger Platform integration (send/receive) |
| `TwilioSmsAdapter` | Twilio SMS integration (send/receive) |
| `ElevenLabsAdapter` | ElevenLabs voice agent integration |
| `ConversationEngine` | Process inbound messages through AI, manage context |
| `IntentClassifier` | Determine user intent from message (book, cancel, reschedule, inquire) |
| `SlotFiller` | Extract structured data from conversation (service, date, time, master) |
| `NotificationService` | Render templates, dispatch via correct channel |
| `ReminderScheduler` | Quartz-based job to trigger reminders at scheduled times |
| `WaitlistService` | Add/remove waitlist entries, match with cancelled slots |
| `AnalyticsService` | Aggregate booking data for dashboards |

### Event-Driven Patterns

Events are published via Spring Application Events (in-process) and optionally to Redis Streams for cross-service consumption.

| Event | Triggered By | Consumers |
|-------|-------------|-----------|
| `AppointmentCreatedEvent` | `AppointmentService.book()` | `NotificationService` (send confirmation), `AnalyticsService` |
| `AppointmentCancelledEvent` | `AppointmentService.cancel()` | `NotificationService` (send cancellation notice), `RearrangementEngine` (check waitlist), `AnalyticsService` |
| `AppointmentRescheduledEvent` | `AppointmentService.reschedule()` | `NotificationService` (send update) |
| `AppointmentCompletedEvent` | `AppointmentService.complete()` | `NotificationService` (send follow-up/review request) |
| `ReminderDueEvent` | `ReminderScheduler` (cron job) | `NotificationService` (send reminder) |
| `InboundMessageEvent` | Webhook controllers | `ConversationEngine` (process through AI) |
| `SlotAvailableEvent` | `RearrangementEngine` | `WaitlistService` (notify matching clients) |
| `ClientCreatedEvent` | `ClientService` | `AnalyticsService` |
| `TenantProvisionedEvent` | `TenantService` | Seed default data, create sample templates |

---

## 6. Scheduling Engine

### 6.1 Availability Calculation Algorithm

The availability engine computes available time slots for a given master, service, and date range.

**Inputs:**
- Master ID
- Service ID (to know duration + buffer)
- Date range (from, to)

**Algorithm:**

```
FUNCTION getAvailableSlots(masterId, serviceId, dateFrom, dateTo):
  service = getService(serviceId)
  slotDuration = service.duration_minutes + service.buffer_minutes
  calendar = getCalendar(masterId)

  FOR each date IN dateRange(dateFrom, dateTo):
    dayOfWeek = date.dayOfWeek()

    // Step 1: Get base availability for this day
    rules = getAvailabilityRules(calendar.id, dayOfWeek, date)
    IF rules is empty OR all rules.is_available == false:
      CONTINUE  // master doesn't work this day

    availableWindows = rules
      .filter(r -> r.is_available)
      .map(r -> TimeWindow(date + r.start_time, date + r.end_time))

    // Step 2: Subtract time blocks (breaks, lunch, vacation, blocked)
    timeBlocks = getTimeBlocks(calendar.id, date.startOfDay(), date.endOfDay())
    FOR each block IN timeBlocks:
      availableWindows = subtractBlock(availableWindows, block)

    // Step 3: Subtract existing appointments
    appointments = getAppointments(masterId, date, statuses=[confirmed])
    FOR each appt IN appointments:
      bookedWindow = TimeWindow(appt.start_at, appt.end_at + appt.service.buffer)
      availableWindows = subtractBlock(availableWindows, bookedWindow)

    // Step 4: Generate discrete slots from remaining windows
    slots = []
    FOR each window IN availableWindows:
      cursor = window.start
      WHILE cursor + slotDuration <= window.end:
        slots.add(TimeSlot(cursor, cursor + service.duration_minutes))
        cursor = cursor + SLOT_INCREMENT  // e.g. 15-minute increments

    YIELD DaySlots(date, masterId, slots)
```

**Key parameters in salon settings (JSONB):**
- `slot_increment_minutes`: 15 (slots start every 15 min) or 30
- `min_booking_notice_hours`: 2 (can't book less than 2h in advance)
- `max_booking_advance_days`: 60 (can book up to 60 days ahead)

### 6.2 Conflict Detection

```
FUNCTION hasConflict(masterId, proposedStart, proposedEnd):
  existingAppointments = query(
    "SELECT 1 FROM appointments
     WHERE master_id = :masterId
       AND status IN ('confirmed')
       AND start_at < :proposedEnd
       AND end_at > :proposedStart
     LIMIT 1"
  )

  timeBlocks = query(
    "SELECT 1 FROM time_blocks tb
     JOIN calendars c ON c.id = tb.calendar_id
     WHERE c.master_id = :masterId
       AND tb.start_at < :proposedEnd
       AND tb.end_at > :proposedStart
     LIMIT 1"
  )

  RETURN existingAppointments.isPresent() OR timeBlocks.isPresent()
```

### 6.3 Rearrangement Algorithm

When a cancellation creates a gap in a master's schedule, the system checks if any waitlisted clients could fill it.

```
FUNCTION handleCancellation(cancelledAppointment):
  gap = TimeWindow(cancelledAppointment.start_at, cancelledAppointment.end_at)
  masterId = cancelledAppointment.master_id
  salonId = cancelledAppointment.salon_id

  // Find waitlist entries that could fit in the gap
  candidates = query(
    "SELECT w.*, s.duration_minutes, s.buffer_minutes
     FROM waitlist_entries w
     JOIN services s ON s.id = w.service_id
     WHERE w.salon_id = :salonId
       AND w.status = 'active'
       AND (w.master_id = :masterId OR w.master_id IS NULL)
       AND (w.preferred_date_from IS NULL OR w.preferred_date_from <= :gapDate)
       AND (w.preferred_date_until IS NULL OR w.preferred_date_until >= :gapDate)
       AND (s.duration_minutes + s.buffer_minutes) <= :gapDurationMinutes
     ORDER BY w.created_at ASC"  // first-come-first-served
  )

  FOR each candidate IN candidates:
    // Check if the service fits in the gap
    IF candidate.duration + candidate.buffer <= gap.durationMinutes():
      // Check time preference
      IF candidate.preferred_time_from IS NOT NULL:
        IF gap.start.time() < candidate.preferred_time_from:
          CONTINUE

      // Notify client about available slot
      publishEvent(SlotAvailableEvent(candidate, gap))

      // Mark waitlist entry as notified (client has X hours to confirm)
      candidate.status = 'notified'
      candidate.notified_at = now()
      save(candidate)

      BREAK  // only notify one candidate at a time; if they don't respond, a scheduled job notifies the next
```

### 6.4 Waitlist Management

- Entries expire after `waitlist_expiry_days` (default: 30 days) from creation
- Notified entries expire after `waitlist_response_hours` (default: 2 hours) if no booking
- A scheduled job runs every 15 minutes to check notified-but-expired entries and notify the next candidate
- When a client books from waitlist notification, the entry status transitions to `booked`

---

## 7. Communication Channel Integration

### 7.1 Unified Messaging Abstraction

```java
public interface ChannelAdapter {
    /** Send a text message to a recipient */
    SendResult sendTextMessage(String recipientId, String text, ChannelConfig config);

    /** Send a template/structured message */
    SendResult sendTemplateMessage(String recipientId, String templateName,
                                    Map<String, String> params, ChannelConfig config);

    /** Send interactive message (buttons, lists) */
    SendResult sendInteractiveMessage(String recipientId, InteractiveMessage message,
                                       ChannelConfig config);

    /** Parse an incoming webhook payload into a normalized InboundMessage */
    InboundMessage parseWebhook(String rawPayload, Map<String, String> headers);

    /** Verify webhook signature */
    boolean verifyWebhook(String rawPayload, Map<String, String> headers, ChannelConfig config);

    /** Get channel type */
    ChannelType getChannelType();
}
```

**Normalized InboundMessage:**
```java
public record InboundMessage(
    String externalMessageId,
    String senderIdentifier,   // phone number or platform user ID
    String recipientIdentifier,
    ChannelType channel,
    MessageContentType contentType, // TEXT, IMAGE, AUDIO, INTERACTIVE, LOCATION
    String textContent,
    Map<String, Object> metadata,  // channel-specific data
    Instant timestamp
) {}
```

### 7.2 WhatsApp Business Cloud API

**Setup:**
- Register app in Meta Business Manager
- Configure webhook URL: `POST /api/v1/webhooks/whatsapp`
- Verification endpoint: `GET /api/v1/webhooks/whatsapp` responds with `hub.challenge`
- Message templates must be pre-approved via Meta Business Manager

**Integration details:**
- **Send messages:** `POST https://graph.facebook.com/v21.0/{phone_number_id}/messages`
- **Message types:** text, template, interactive (buttons, list), image, document, audio, location
- **Rate limits:** Standard tier: 250 conversations/day; scaling tiers available
- **24-hour window:** After client sends a message, business can reply freely for 24 hours. After that, only approved templates can be sent.
- **Per-message pricing:** As of July 2025, Meta charges per message by category (marketing, utility, authentication, service)

**Webhook handling:**
```java
@RestController
@RequestMapping("/api/v1/webhooks/whatsapp")
public class WhatsAppWebhookController {

    @GetMapping
    public ResponseEntity<String> verify(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.verify_token") String token,
            @RequestParam("hub.challenge") String challenge) {
        if ("subscribe".equals(mode) && verifyToken.equals(token)) {
            return ResponseEntity.ok(challenge);
        }
        return ResponseEntity.status(403).build();
    }

    @PostMapping
    public ResponseEntity<Void> receive(@RequestBody String payload,
                                         @RequestHeader Map<String, String> headers) {
        // 1. Verify X-Hub-Signature-256
        // 2. Parse payload → InboundMessage
        // 3. Resolve tenant from phone_number_id → salon mapping
        // 4. Publish InboundMessageEvent
        return ResponseEntity.ok().build(); // Must return 200 quickly
    }
}
```

### 7.3 Facebook Messenger Platform

**Setup:**
- Create Facebook App, add Messenger product
- Configure webhook URL: `POST /api/v1/webhooks/facebook`
- Subscribe to `messages` and `messaging_postbacks` events
- Page Access Token required for sending messages

**Integration details:**
- **Send messages:** `POST https://graph.facebook.com/v21.0/me/messages`
- **Message types:** text, templates (generic, button, receipt), quick replies, persistent menu
- **Webhook events:** `messages`, `messaging_postbacks`, `messaging_referrals`
- **SSL required:** Webhook URL must be HTTPS with valid certificate

**Webhook verification:**
```java
@GetMapping("/api/v1/webhooks/facebook")
public ResponseEntity<String> verify(
        @RequestParam("hub.mode") String mode,
        @RequestParam("hub.verify_token") String token,
        @RequestParam("hub.challenge") String challenge) {
    if ("subscribe".equals(mode) && verifyToken.equals(token)) {
        return ResponseEntity.ok(challenge);
    }
    return ResponseEntity.status(403).build();
}
```

### 7.4 Twilio SMS

**Setup:**
- Twilio account with phone number
- Configure webhook URL in Twilio Console: `POST /api/v1/webhooks/twilio/sms`
- Status callback URL: `POST /api/v1/webhooks/twilio/status`

**Integration details:**
- **Send SMS:** Twilio REST API `POST /2010-04-01/Accounts/{AccountSid}/Messages.json`
- **Receive SMS:** Twilio sends webhook with `From`, `To`, `Body` parameters
- **Delivery status:** status callback with `MessageSid`, `MessageStatus` (queued, sent, delivered, failed)
- **Security:** Validate `X-Twilio-Signature` header using auth token
- **Response:** Return TwiML (can be empty `<Response/>` if no auto-reply needed)

**Rate limiting:** Twilio limits to 1 message/second per phone number by default. Use Messaging Service for higher throughput.

### 7.5 ElevenLabs Voice Agent

**Setup:**
- Create agent in ElevenLabs dashboard with knowledge base and tools
- Connect Twilio phone number to ElevenLabs Agent
- Configure post-call webhook URL: `POST /api/v1/webhooks/elevenlabs`

**Integration details:**
- **Agent configuration:** Define system prompt, tools (check availability, book appointment), knowledge base (salon FAQ, services list)
- **Phone integration:** ElevenLabs handles Twilio voice webhook directly; our backend receives post-call summaries
- **Tool calling:** Agent can call backend API endpoints as tools during conversation:
  - `check_availability(service, date, master)` - calls our available-slots API
  - `book_appointment(service, master, date, time, client_phone)` - calls our booking API
  - `cancel_appointment(appointment_id)` - calls our cancel API
- **Post-call webhook:** Receives conversation transcript, extracted data, and call metadata
- **SIP trunking:** Alternative to Twilio for enterprise PBX systems

**Webhook payload (post-call):**
```json
{
  "agent_id": "...",
  "conversation_id": "...",
  "call_duration_seconds": 180,
  "transcript": [...],
  "extracted_data": {
    "intent": "book_appointment",
    "service": "Haircut",
    "preferred_date": "2026-02-10",
    "client_phone": "+15551234567"
  },
  "call_successful": true
}
```

### 7.6 Rate Limiting per Channel

| Channel | Limit | Strategy |
|---------|-------|----------|
| WhatsApp | 250 conversations/day (standard) | Token bucket in Redis, per salon |
| Facebook | 250 messages/second (platform limit) | Unlikely to hit; monitor only |
| SMS (Twilio) | 1 msg/sec per number | Queue with delay, use Messaging Service for scale |
| Voice (ElevenLabs) | Based on plan (concurrent calls) | Semaphore per salon |

---

## 8. AI Conversation Engine

### 8.1 Message Processing Pipeline

```
Inbound Message (from any channel)
  │
  ├─ 1. Channel Adapter: Parse & normalize → InboundMessage
  │
  ├─ 2. Tenant Resolution: phone_number_id / page_id → salon_id → tenant_id
  │
  ├─ 3. Client Resolution: sender phone/ID → find or create Client
  │
  ├─ 4. Conversation Resolution: find active conversation or create new
  │
  ├─ 5. Conversation Engine:
  │     ├─ Load conversation context (JSONB)
  │     ├─ Build LLM prompt (system + context + history + user message)
  │     ├─ Call LLM with tool definitions
  │     ├─ Process LLM response:
  │     │   ├─ If tool_call → execute tool → feed result back to LLM → get final response
  │     │   └─ If text → use as response
  │     ├─ Update conversation context
  │     └─ Return response text
  │
  ├─ 6. Send Response: via UnifiedMessagingService → correct channel adapter
  │
  └─ 7. Persist: Save inbound message + outbound response to messages table
```

### 8.2 Intent Recognition

The LLM handles intent recognition natively through the system prompt and tool definitions. No separate classifier is needed.

**Recognized intents (via LLM tool calling):**

| Intent | LLM Tool | Parameters |
|--------|----------|------------|
| Book appointment | `check_availability`, `book_appointment` | service, master, date, time |
| Cancel appointment | `get_client_appointments`, `cancel_appointment` | appointment reference |
| Reschedule | `get_client_appointments`, `check_availability`, `reschedule_appointment` | appointment ref, new date/time |
| Check availability | `check_availability` | service, master, date range |
| Ask about services | `list_services` | category (optional) |
| Ask about prices | `list_services` | service name |
| General inquiry | (no tool, LLM responds from knowledge base) | - |

### 8.3 Slot Filling for Booking

The conversation context tracks which booking parameters have been collected:

```json
{
  "intent": "book_appointment",
  "slots": {
    "service_id": "uuid",
    "service_name": "Haircut",
    "master_id": null,
    "master_name": null,
    "date": "2026-02-10",
    "time": null
  },
  "missing_slots": ["master_id", "time"],
  "offered_options": [
    {"master": "Anna K.", "times": ["09:00", "10:30", "14:00"]},
    {"master": "Maria S.", "times": ["11:00", "15:00"]}
  ]
}
```

**Flow example:**
1. Client: "I want a haircut" → intent=book, service=Haircut. Missing: master, date, time.
2. AI: "Which day works for you?" → client provides date
3. AI calls `check_availability(service=Haircut, date=2026-02-10)` → gets available masters/times
4. AI: "Anna has slots at 9am and 10:30am. Maria is free at 11am. Which do you prefer?"
5. Client: "Anna at 10:30" → master=Anna, time=10:30
6. AI calls `book_appointment(...)` → confirmed
7. AI: "Your haircut with Anna is booked for Feb 10 at 10:30am."

### 8.4 Context Management

- Conversation context stored in `conversations.context` (JSONB column)
- Context includes: current intent, collected slots, last N messages summary, offered options
- Context is loaded at start of each message processing and saved after
- Conversations auto-resolve after 30 minutes of inactivity (configurable)
- New message to a resolved conversation creates a fresh context

### 8.5 LLM Prompt Design

**System prompt structure:**
```
You are a virtual receptionist for {salon_name}, a beauty salon.
Your job is to help clients book, reschedule, or cancel appointments.

SALON INFO:
- Name: {salon_name}
- Address: {address}
- Working hours: {hours}
- Services offered: {service_summary}
- Masters/Stylists: {master_summary}

RULES:
- Always be polite and professional
- If the client wants to book, collect: service, preferred date/time, preferred master (optional)
- Use the tools provided to check availability and make bookings
- If no slots are available for the requested time, suggest alternatives
- If you cannot help, offer to connect them with a salon staff member
- Respond in the same language the client uses
- Keep responses concise (2-3 sentences max for messaging)

CURRENT CONVERSATION STATE:
{context_json}
```

**Tool definitions passed to LLM:**
```json
[
  {
    "name": "check_availability",
    "description": "Check available time slots for a service and optional master on given dates",
    "parameters": {
      "service_name": "string (required)",
      "master_name": "string (optional)",
      "date_from": "string YYYY-MM-DD (required)",
      "date_to": "string YYYY-MM-DD (optional, defaults to date_from)"
    }
  },
  {
    "name": "book_appointment",
    "description": "Book an appointment for the client",
    "parameters": {
      "service_id": "string UUID (required)",
      "master_id": "string UUID (required)",
      "start_time": "string ISO datetime (required)"
    }
  },
  {
    "name": "get_client_appointments",
    "description": "Get the client's upcoming appointments",
    "parameters": {}
  },
  {
    "name": "cancel_appointment",
    "description": "Cancel an existing appointment",
    "parameters": {
      "appointment_id": "string UUID (required)"
    }
  },
  {
    "name": "reschedule_appointment",
    "description": "Reschedule an existing appointment to a new time",
    "parameters": {
      "appointment_id": "string UUID (required)",
      "new_start_time": "string ISO datetime (required)"
    }
  },
  {
    "name": "list_services",
    "description": "List available services and prices",
    "parameters": {
      "category": "string (optional)"
    }
  },
  {
    "name": "escalate_to_staff",
    "description": "Hand conversation to a human staff member",
    "parameters": {
      "reason": "string (required)"
    }
  }
]
```

### 8.6 Fallback to Human Handling

Escalation triggers:
- Client explicitly asks to talk to a person
- LLM determines it cannot handle the request (calls `escalate_to_staff` tool)
- Conversation exceeds 10 turns without resolution
- Sentiment detection: client appears frustrated (detected by LLM in system prompt)

When escalated:
1. Conversation status set to `escalated`
2. `assigned_to` set to salon admin user
3. Notification sent to salon admin via their preferred channel
4. AI adds context summary for the human agent

---

## 9. Notification Service

### 9.1 Event-Driven Triggers

| Event | Notification | Timing | Channel |
|-------|-------------|--------|---------|
| `AppointmentCreatedEvent` | Booking confirmation | Immediate | Same channel as booking |
| (Scheduled) | 24-hour reminder | 24h before appointment | Client's preferred channel |
| (Scheduled) | 1-hour reminder | 1h before appointment | Client's preferred channel |
| `AppointmentCancelledEvent` | Cancellation notice | Immediate | Same channel as booking |
| `AppointmentRescheduledEvent` | Reschedule confirmation | Immediate | Same channel |
| `AppointmentCompletedEvent` | Follow-up / feedback | 2h after appointment | Client's preferred channel |
| `SlotAvailableEvent` | Waitlist availability | Immediate | Client's preferred channel |

### 9.2 Template System

Templates use double-brace variable syntax: `{{variable_name}}`

**Available variables:**
```
{{client_name}}       - Client's first name
{{salon_name}}        - Salon name
{{service_name}}      - Booked service name
{{master_name}}       - Master/stylist name
{{appointment_date}}  - Formatted date (e.g., "Monday, February 10")
{{appointment_time}}  - Formatted time (e.g., "10:30 AM")
{{salon_address}}     - Salon address
{{salon_phone}}       - Salon phone number
```

**Example template (appointment_confirmed, WhatsApp):**
```
Hi {{client_name}}! Your {{service_name}} with {{master_name}} is confirmed for {{appointment_date}} at {{appointment_time}}.

See you at {{salon_name}}!

Need to reschedule? Just reply to this message.
```

### 9.3 Multi-Channel Delivery

```
FUNCTION sendNotification(trigger, appointment, client):
  // Determine channel: use same channel as booking, or client's preferred
  channel = appointment.source OR client.preferences.preferred_channel OR 'sms'

  // Find matching template
  template = findTemplate(salon_id, trigger, channel, client.language)
  IF template is null:
    template = findTemplate(salon_id, trigger, channel, 'en')  // fallback to English

  // Render template
  content = renderTemplate(template, buildVariableMap(appointment, client))

  // For WhatsApp: use pre-approved template name if outside 24h window
  IF channel == 'whatsapp' AND isOutsideConversationWindow(client):
    sendViaTemplate(template.whatsapp_template_name, params)
  ELSE:
    sendTextMessage(channel, client.phone, content)

  // Log notification
  saveNotification(template, client, appointment, channel, content)
```

### 9.4 Retry Logic

- **Max retries:** 3
- **Backoff strategy:** Exponential (1 min, 5 min, 30 min)
- **Retry on:** Network errors, rate limit (429), server errors (5xx)
- **No retry on:** Invalid recipient (400), blocked by user
- **Dead letter:** After max retries, status set to `failed` with reason logged
- **Implementation:** Redis Streams delayed message or Quartz scheduled retry job

### 9.5 Reminder Scheduler

```java
@Component
public class ReminderScheduler {

    // Runs every 5 minutes
    @Scheduled(cron = "0 */5 * * * *")
    public void processReminders() {
        Instant now = Instant.now();

        // Find appointments needing 24h reminder
        List<Appointment> upcoming24h = appointmentRepository
            .findConfirmedBetween(
                now.plus(23, HOURS).plus(55, MINUTES),  // window: 23h55m to 24h5m
                now.plus(24, HOURS).plus(5, MINUTES)
            )
            .filter(a -> !alreadyNotified(a.getId(), "reminder_24h"));

        upcoming24h.forEach(a -> publishEvent(new ReminderDueEvent(a, "reminder_24h")));

        // Find appointments needing 1h reminder
        List<Appointment> upcoming1h = appointmentRepository
            .findConfirmedBetween(
                now.plus(55, MINUTES),
                now.plus(65, MINUTES)
            )
            .filter(a -> !alreadyNotified(a.getId(), "reminder_1h"));

        upcoming1h.forEach(a -> publishEvent(new ReminderDueEvent(a, "reminder_1h")));
    }
}
```

---

## 10. Security

### 10.1 JWT Authentication Flow

```
Login Request → AuthService.authenticate()
  ├─ Validate credentials (bcrypt hash comparison)
  ├─ Generate Access Token (JWT, 1 hour expiry)
  │   Claims: { sub: userId, tenant_id, salon_id, role, exp }
  ├─ Generate Refresh Token (opaque, 30 day expiry, stored in DB)
  └─ Return both tokens

Protected Request → JwtAuthFilter
  ├─ Extract Bearer token from Authorization header
  ├─ Validate JWT signature (HS256 or RS256)
  ├─ Check expiry
  ├─ Extract claims → set SecurityContext
  └─ Set TenantContext from tenant_id claim

Token Refresh → POST /auth/refresh
  ├─ Validate refresh token exists in DB and not expired
  ├─ Generate new Access Token
  ├─ Optionally rotate refresh token
  └─ Return new tokens
```

**Token configuration:**
- Access token: JWT, 1 hour TTL, signed with RS256 (asymmetric) in production
- Refresh token: Opaque UUID, 30 days TTL, stored in `refresh_tokens` table
- Refresh token rotation: New refresh token issued on each refresh, old one invalidated

### 10.2 Role-Based Access Control (RBAC)

| Role | Scope | Permissions |
|------|-------|-------------|
| **SUPER_ADMIN** | Platform | Manage all tenants, view platform analytics, manage billing |
| **SALON_ADMIN** | Tenant/Salon | Full salon management, staff management, all bookings, analytics, channel config |
| **MASTER** | Own data | View own calendar, manage own availability, view own appointments, view clients they serve |

**Implementation:**
```java
@PreAuthorize("hasRole('SALON_ADMIN')")
@PostMapping("/salons/{id}/services")
public ServiceDto createService(...) { ... }

@PreAuthorize("hasAnyRole('SALON_ADMIN', 'MASTER')")
@GetMapping("/appointments")
public Page<AppointmentDto> listAppointments(...) {
    // MASTER role: filter to own appointments only
    // SALON_ADMIN role: can see all salon appointments
}
```

### 10.3 API Rate Limiting

| Endpoint Group | Rate Limit | Window |
|---------------|-----------|--------|
| Auth endpoints (`/auth/*`) | 10 req | 1 minute per IP |
| Webhook endpoints (`/webhooks/*`) | 100 req | 1 second (per platform) |
| General API | 100 req | 1 minute per user |
| Slot checking | 30 req | 1 minute per user |
| Analytics | 10 req | 1 minute per user |

**Implementation:** Resilience4j RateLimiter with Redis backend for distributed environments.

### 10.4 Input Validation

- All request DTOs validated with Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Size`, `@Email`, `@Pattern`)
- Phone numbers validated with libphonenumber
- Date/time inputs validated for reasonable ranges
- UUIDs validated for format
- Text inputs sanitized (no HTML) - OWASP Java HTML Sanitizer if needed
- SQL injection prevented by parameterized queries (JPA/Hibernate)
- JSON injection prevented by Jackson serialization defaults
- File upload validation (if applicable): type whitelist, size limit

### 10.5 Webhook Security

| Channel | Verification Method |
|---------|-------------------|
| WhatsApp | `X-Hub-Signature-256` header - HMAC SHA256 of payload with app secret |
| Facebook | `X-Hub-Signature-256` header - same as WhatsApp (Meta platform) |
| Twilio | `X-Twilio-Signature` header - HMAC SHA1 of URL + sorted params with auth token |
| ElevenLabs | Webhook secret in custom header or signed payload |

### 10.6 GDPR / Data Privacy

- **Right to erasure:** API endpoint to delete all client data (`DELETE /clients/{id}/data`)
- **Right to export:** API endpoint to export client data as JSON (`GET /clients/{id}/data-export`)
- **Consent tracking:** Record client consent for messaging in `clients` table
- **Data retention:** Configurable per tenant; default 2 years for conversations, 5 years for appointments
- **Encryption at rest:** Channel config secrets encrypted with AES-256 (application-level or PostgreSQL pgcrypto)
- **Encryption in transit:** TLS 1.3 everywhere
- **Audit log:** All data access/modification logged with user ID, timestamp, action

---

## 11. Error Handling

### 11.1 Global Error Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(
            new ErrorResponse("RESOURCE_NOT_FOUND", ex.getMessage(), null));
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponse> handleConflict(ConflictException ex) {
        return ResponseEntity.status(409).body(
            new ErrorResponse("CONFLICT", ex.getMessage(), null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
            .collect(toMap(FieldError::getField, FieldError::getDefaultMessage));
        return ResponseEntity.status(400).body(
            new ErrorResponse("VALIDATION_ERROR", "Invalid request", fieldErrors));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(403).body(
            new ErrorResponse("FORBIDDEN", "Access denied", null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.error("Unhandled exception", ex);
        return ResponseEntity.status(500).body(
            new ErrorResponse("INTERNAL_ERROR", "An unexpected error occurred", null));
    }
}
```

**ErrorResponse structure:**
```json
{
  "code": "SLOT_CONFLICT",
  "message": "The requested time slot is no longer available",
  "details": {
    "master_id": "uuid",
    "requested_start": "2026-02-10T10:30:00Z",
    "next_available": "2026-02-10T14:00:00Z"
  }
}
```

### 11.2 Error Codes Catalog

| Code | HTTP Status | Description |
|------|------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `TOKEN_EXPIRED` | 401 | JWT access token expired |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Entity not found |
| `SLOT_CONFLICT` | 409 | Time slot already booked |
| `APPOINTMENT_ALREADY_CANCELLED` | 409 | Attempt to cancel an already cancelled appointment |
| `OUTSIDE_BOOKING_WINDOW` | 422 | Booking too far in advance or too close to start |
| `SERVICE_NOT_AVAILABLE` | 422 | Master doesn't offer the requested service |
| `MASTER_UNAVAILABLE` | 422 | Master not working on requested day |
| `RATE_LIMITED` | 429 | Too many requests |
| `CHANNEL_ERROR` | 502 | External channel API returned error |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### 11.3 Logging Strategy

**Structured JSON logging (Logback + Logstash encoder):**

```json
{
  "timestamp": "2026-02-10T10:30:00.123Z",
  "level": "INFO",
  "logger": "com.slotme.scheduling.AppointmentService",
  "message": "Appointment booked",
  "tenant_id": "uuid",
  "salon_id": "uuid",
  "user_id": "uuid",
  "appointment_id": "uuid",
  "trace_id": "abc123",
  "span_id": "def456"
}
```

**Log levels:**
- `ERROR` - Unhandled exceptions, external API failures after retries, data integrity issues
- `WARN` - Rate limiting triggered, webhook signature mismatch, retry attempts
- `INFO` - Business events (appointment booked/cancelled, message sent, user login)
- `DEBUG` - Request/response details, LLM prompts/responses, SQL queries (dev only)

**MDC (Mapped Diagnostic Context) fields set by TenantFilter:**
- `tenant_id`, `salon_id`, `user_id`, `request_id` (UUID per request), `trace_id`

---

## 12. Testing Strategy

### 12.1 Test Pyramid

| Level | Tool | Coverage Target | Focus |
|-------|------|----------------|-------|
| **Unit Tests** | JUnit 5 + Mockito | 80%+ of service layer | Business logic, slot generation, conflict detection |
| **Integration Tests** | Spring Boot Test + Testcontainers | All repositories, key services | Database queries, RLS policies, transaction boundaries |
| **API Tests** | MockMvc + REST Assured | All endpoints | Request validation, auth, response format |
| **Contract Tests** | Spring Cloud Contract | Webhook handlers | Verify webhook parsing matches provider contracts |

### 12.2 Multi-Tenant Test Data Management

```java
@TestConfiguration
public class TestTenantConfig {

    // Each test gets isolated tenant data
    @Bean
    public TenantTestHelper tenantTestHelper(EntityManager em) {
        return new TenantTestHelper(em);
    }
}

public class TenantTestHelper {
    public TenantFixture createTenant(String name) {
        // Creates: tenant, salon, admin user, 2 masters, 5 services
        // Returns fixture with all IDs for assertions
    }

    public void setCurrentTenant(UUID tenantId) {
        // Set PostgreSQL session variable for RLS
        em.createNativeQuery("SET app.current_tenant_id = :id")
          .setParameter("id", tenantId.toString())
          .executeUpdate();
    }
}
```

**Key test scenarios:**
- Tenant A cannot see Tenant B's data (RLS enforcement)
- Booking conflicts are correctly detected
- Slot generation handles edge cases (DST transitions, midnight boundaries)
- Webhook payloads from each channel are correctly parsed
- LLM tool calls produce correct API calls
- Notification templates render correctly with all variable combinations
- Waitlist rearrangement correctly matches candidates to gaps

### 12.3 Testcontainers Setup

```java
@SpringBootTest
@Testcontainers
class AppointmentServiceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
        .withDatabaseName("slotme_test")
        .withInitScript("init-rls.sql");

    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7")
        .withExposedPorts(6379);
}
```

---

## 13. Deployment

### 13.1 Docker Containerization

**Dockerfile (multi-stage build):**
```dockerfile
# Build stage
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY gradle gradle
COPY gradlew build.gradle.kts settings.gradle.kts ./
RUN ./gradlew dependencies --no-daemon
COPY src ./src
RUN ./gradlew bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**docker-compose.yml (development):**
```yaml
version: "3.9"
services:
  app:
    build: .
    ports:
      - "8083:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/slotme
      - SPRING_DATASOURCE_USERNAME=slotme
      - SPRING_DATASOURCE_PASSWORD=slotme_dev
      - SPRING_DATA_REDIS_HOST=redis
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: slotme
      POSTGRES_USER: slotme
      POSTGRES_PASSWORD: slotme_dev
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U slotme"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

### 13.2 Environment Configuration

**Spring profiles:**
- `dev` - Local development, verbose logging, relaxed security
- `staging` - Staging environment, production-like config
- `prod` - Production, strict security, optimized settings

**Required environment variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL | `jdbc:postgresql://host:5432/slotme` |
| `SPRING_DATASOURCE_USERNAME` | DB user | `slotme` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | (secret) |
| `SPRING_DATA_REDIS_HOST` | Redis host | `redis` |
| `JWT_SECRET_KEY` | JWT signing key (RS256 private key path) | `/keys/jwt-private.pem` |
| `OPENAI_API_KEY` | OpenAI API key for LLM | (secret) |
| `WHATSAPP_APP_SECRET` | Meta app secret for webhook verification | (secret) |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp Cloud API token | (secret) |
| `FB_PAGE_ACCESS_TOKEN` | Facebook page access token | (secret) |
| `FB_VERIFY_TOKEN` | Facebook webhook verify token | (secret) |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | `ACxxxx` |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | (secret) |
| `ELEVENLABS_API_KEY` | ElevenLabs API key | (secret) |
| `ELEVENLABS_WEBHOOK_SECRET` | ElevenLabs webhook verification secret | (secret) |
| `ENCRYPTION_KEY` | AES-256 key for encrypting channel secrets | (secret) |

### 13.3 Database Migrations

**Flyway configuration:**
- Migrations directory: `src/main/resources/db/migration/`
- Naming convention: `V{version}__{description}.sql` (e.g., `V001__create_tenants.sql`)
- Repeatable migrations for RLS policies: `R__rls_policies.sql`
- Baseline on first run for existing databases

**Migration order:**
1. `V001__create_tenants.sql` - tenants table
2. `V002__create_salons.sql` - salons table
3. `V003__create_users_roles.sql` - users, roles tables
4. `V004__create_services.sql` - service_categories, services tables
5. `V005__create_masters.sql` - masters, master_services tables
6. `V006__create_calendars.sql` - calendars, availability_rules, time_blocks tables
7. `V007__create_clients.sql` - clients, client_preferences tables
8. `V008__create_appointments.sql` - appointments, appointment_history tables
9. `V009__create_conversations.sql` - conversations, messages tables
10. `V010__create_notifications.sql` - notification_templates, notifications tables
11. `V011__create_waitlist.sql` - waitlist_entries table
12. `V012__create_channels.sql` - communication_channels, channel_configs tables
13. `R__rls_policies.sql` - All RLS policies (repeatable, re-applied on change)

### 13.4 Health Checks

**Spring Boot Actuator endpoints:**

| Endpoint | Purpose |
|----------|---------|
| `/actuator/health` | Overall health (DB, Redis, disk) |
| `/actuator/health/db` | PostgreSQL connectivity |
| `/actuator/health/redis` | Redis connectivity |
| `/actuator/health/readiness` | Ready to serve traffic |
| `/actuator/health/liveness` | Application alive |
| `/actuator/prometheus` | Prometheus metrics scrape endpoint |

**Custom health indicators:**
```java
@Component
public class WhatsAppHealthIndicator implements HealthIndicator {
    @Override
    public Health health() {
        // Verify WhatsApp API is reachable
        // Return UP/DOWN with details
    }
}
```

**Docker health check:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health/liveness"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 60s
```

---

## Appendix: Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Language | Java 21 | Type safety, virtual threads, mature ecosystem |
| Framework | Spring Boot 3.4 | Best multi-tenancy support, Spring AI for LLM |
| Multi-tenancy | RLS (shared tables) | Simplest operations, sufficient isolation for beauty salons |
| Message queue | Redis Streams | Already using Redis; avoids Kafka operational overhead |
| LLM integration | Spring AI + OpenAI | Native tool calling, structured outputs |
| Scheduling | Custom engine | Domain-specific; no off-the-shelf solution handles salon-specific rules |
| Voice agent | ElevenLabs | Low-latency voice AI with phone integration and tool calling |
| SMS | Twilio | Industry standard, reliable delivery, good webhooks |
| Database | PostgreSQL 16 | RLS, JSONB, pgvector for embeddings, rock solid |

---

*End of Backend Technical Specification*

# SlotMe - Project Plan

**Version:** 1.0
**Date:** 2026-02-07
**Author:** Project Management
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Document Review & Gap Analysis](#2-document-review--gap-analysis)
3. [Technology Alignment](#3-technology-alignment)
4. [Development Phases & Sprints](#4-development-phases--sprints)
5. [Team Structure](#5-team-structure)
6. [Dependencies Between Workstreams](#6-dependencies-between-workstreams)
7. [Risk Register](#7-risk-register)
8. [MVP Definition](#8-mvp-definition)
9. [Timeline & Milestones](#9-timeline--milestones)
10. [Definition of Done](#10-definition-of-done)

---

## 1. Executive Summary

### Project Overview

SlotMe is a multitenant AI-powered virtual administrator for beauty salons. It automates appointment booking, calendar management, client communication, and schedule optimization across WhatsApp, Facebook Messenger, voice (ElevenLabs), and SMS channels.

### Document Suite Summary

Five foundational documents have been produced:

| Document | Author | Key Content |
|----------|--------|-------------|
| **PRD.md** | Product Manager | 87 functional requirements (FR-001 to FR-168), 38 user stories, 25 NFRs, 3-phase delivery plan, KPIs |
| **ARCHITECTURE.md** | Architect | C4 diagrams, Quarkus 3.x microservices architecture, PostgreSQL with RLS, Kafka event bus, Keycloak auth, Redis caching, AI tool-use approach |
| **UX_FLOWS.md** | UX Designer | 24 detailed user flows (F1-F24), screen wireframe descriptions, conversation design patterns, edge case handling |
| **FRONTEND_SPEC.md** | Frontend Dev | React 19 + Vite 6 SPA, shadcn/ui + Tailwind CSS 4, TanStack Query/Router, FullCalendar, WebSocket real-time updates |
| **BACKEND_SPEC.md** | Backend Dev | Spring Boot 3.4, Gradle, Flyway migrations, Redis Streams (not Kafka), Spring AI + OpenAI GPT-4.1, Quartz scheduler, 20 DB table definitions, full REST API spec |

### Overall Assessment

The documentation suite is **comprehensive and well-structured**. All five documents align on the core product vision and cover the necessary ground for development. However, there are several **critical misalignments** that must be resolved before development begins, particularly around the backend framework choice and event bus technology. The remainder of this document details these issues and provides a unified plan.

---

## 2. Document Review & Gap Analysis

### 2.1 Critical Misalignments

#### CRITICAL-1: Backend Framework -- Quarkus vs Spring Boot

| Document | Choice | Build Tool |
|----------|--------|------------|
| ARCHITECTURE.md | Quarkus 3.x | Maven |
| BACKEND_SPEC.md | Spring Boot 3.4 | Gradle (Kotlin DSL) |
| FRONTEND_SPEC.md | References "Quarkus backend" in section 7 (WebSocket STOMP comment) but API endpoints are framework-agnostic |

**Impact:** This is the most significant misalignment. The two specs cannot be implemented simultaneously. Every line of code, dependency, configuration pattern, and deployment artifact differs between these frameworks.

**Resolution:** See [Section 3 - Technology Alignment](#3-technology-alignment) for detailed recommendation.

#### CRITICAL-2: Event Bus -- Kafka vs Redis Streams

| Document | Choice | Rationale |
|----------|--------|-----------|
| ARCHITECTURE.md | Apache Kafka | Durable event log, replay capability, audit trail, high throughput |
| BACKEND_SPEC.md | Redis Streams | Simpler operations, lower overhead, already using Redis |

**Impact:** Affects notification delivery, appointment event processing, and service communication patterns. Kafka requires 3 brokers + ZooKeeper/KRaft. Redis Streams runs on existing Redis infrastructure.

**Resolution:** See [Section 3](#3-technology-alignment).

#### CRITICAL-3: LLM Provider -- Claude vs OpenAI GPT-4.1

| Document | Primary LLM | Framework |
|----------|-------------|-----------|
| ARCHITECTURE.md | Claude (Anthropic) with GPT-4o fallback | Custom LlmClient abstraction |
| BACKEND_SPEC.md | OpenAI GPT-4.1 | Spring AI |

**Impact:** Different API formats, pricing models, tool-calling conventions, and SDK dependencies.

**Resolution:** See [Section 3](#3-technology-alignment).

#### CRITICAL-4: Authentication -- Keycloak vs Custom JWT

| Document | Choice |
|----------|--------|
| ARCHITECTURE.md | Keycloak (self-hosted IdP) with OIDC/OAuth2 |
| BACKEND_SPEC.md | Custom JWT implementation with Spring Security |

**Impact:** Keycloak adds operational complexity (another service to deploy/maintain) but provides SSO, user management UI, and social login out-of-the-box. Custom JWT is simpler but requires building user management from scratch.

**Resolution:** See [Section 3](#3-technology-alignment).

### 2.2 Minor Misalignments

#### MINOR-1: API Style -- REST + GraphQL vs REST Only

| Document | API Style |
|----------|-----------|
| ARCHITECTURE.md | REST (JAX-RS) + GraphQL (SmallRye GraphQL) |
| BACKEND_SPEC.md | REST only (Spring MVC) |
| FRONTEND_SPEC.md | REST only (expects REST endpoints) |

**Resolution:** Start with REST only for MVP. GraphQL adds complexity without clear benefit when the frontend team has already specified REST endpoints. Revisit in Phase 2 if dashboard query patterns warrant it.

#### MINOR-2: UI Component Library

| Document | Choice |
|----------|--------|
| ARCHITECTURE.md | Ant Design or Shadcn/UI + Tailwind CSS |
| FRONTEND_SPEC.md | shadcn/ui + Radix UI + Tailwind CSS 4 (definitive) |

**Resolution:** Use shadcn/ui + Tailwind CSS 4 as specified in the frontend spec. The frontend dev has made a well-justified final decision.

#### MINOR-3: Reminder Timing -- 2h vs 1h

| Document | Reminder Timing |
|----------|----------------|
| PRD.md | 24h and 2h before appointment (FR-131, FR-132) |
| UX_FLOWS.md | 24h and 1h before appointment (F16, F17) |
| BACKEND_SPEC.md | 24h and 1h before appointment |

**Resolution:** Use 1h as the default short-notice reminder (matches UX and backend). Make this configurable per salon in settings. Update PRD to reflect 1h.

#### MINOR-4: Database Schema Differences

The Architecture and Backend specs both define entity models but with slightly different structures:

- Architecture uses `WORKING_PLAN` / `WORKING_DAY` / `BREAK` tables
- Backend uses `calendars` / `availability_rules` / `time_blocks` tables

**Resolution:** Use the Backend spec's schema as canonical -- it's more detailed, uses proper SQL DDL, and handles edge cases better (recurring blocks, iCal RRULE format). The Architecture entity model should be updated to match.

#### MINOR-5: Frontend Port Configuration

The CLAUDE.md instructions specify the frontend should run on port 3033 and backend on port 8083 for slotme-app. The Frontend spec references `VITE_API_BASE_URL=http://localhost:8083/api`. The Backend spec's docker-compose maps 8083:8080.

**Resolution:** Consistent. Vite dev server should be configured for port 3033 in `vite.config.ts`. Backend runs on 8083. No change needed.

### 2.3 Coverage Gap Analysis

#### PRD Requirements vs Other Documents

| PRD Module | Architecture | UX Flows | Frontend | Backend | Gaps |
|------------|-------------|----------|----------|---------|------|
| Multi-tenancy (FR-001 to FR-007) | Covered (RLS, tenant resolution) | F1 (registration) | Register page, settings | Full schema + RLS | None |
| Master Management (FR-010 to FR-016) | Covered | F2, F8-F10 | Masters pages | Masters API + schema | FR-016 (performance metrics): No UX flow for master-specific analytics. Add to admin analytics page. |
| Service Catalog (FR-020 to FR-025) | Covered | F3 | Services page | Services API + schema | FR-025 (combo services): Not addressed in any spec. Deferred to Phase 3 per PRD. |
| Calendar (FR-030 to FR-036) | Covered (scheduling engine) | F8, F10, F11 | FullCalendar integration | Availability engine | FR-036 (concurrent services): Not in backend spec. Complex feature, correctly deferred. |
| Booking Engine (FR-040 to FR-050) | Covered | F4-F7, F12-F15 | Calendar + appointment dialogs | Full appointment API | FR-048 (recurring appointments): No backend or frontend spec. Deferred to Phase 3. |
| Waitlist (FR-060 to FR-064) | Covered | F13 | Not explicitly covered | Waitlist schema + API | GAP: Frontend needs a waitlist management view for admins. Add to Phase 2. |
| Client Management (FR-070 to FR-077) | Covered | F23 | Client pages | Client API + schema | FR-077 (GDPR): Backend has data export/deletion endpoints. Frontend needs GDPR section in settings. |
| WhatsApp (FR-080 to FR-084) | Covered | F4, F24 | Channel setup page | WhatsApp webhook + adapter | None |
| Facebook (FR-090 to FR-092) | Covered | F5, F24 | Channel setup page | Facebook webhook + adapter | None |
| Voice (FR-100 to FR-103) | Covered | F6, F24 | Channel setup page | ElevenLabs integration | None (Phase 3) |
| SMS (FR-110 to FR-112) | Covered | F7, F24 | Channel setup page | Twilio SMS adapter | None |
| AI Engine (FR-120 to FR-129) | Covered (tool-use approach) | F4-F7 conversation patterns | Conversation viewer | LLM pipeline + tools | FR-125 (multi-language): Architecture mentions it, backend system prompt supports it, but no i18n configuration in salon settings UI. Add to frontend settings. |
| Notifications (FR-130 to FR-140) | Covered (Kafka/event-driven) | F16-F20 | Notification components | Event-driven + scheduler | FR-140 (channel preference): Backend handles it. Frontend needs client preference display in profile. |
| Analytics (FR-150 to FR-156) | Not detailed | F22 | Analytics page with recharts | Analytics API endpoints | GAP: Architecture doc lacks analytics service detail. Backend and frontend specs cover it adequately. |
| Admin Dashboard (FR-160 to FR-168) | Covered (high-level) | F11, F21-F24 | All admin pages detailed | API endpoints match | None |

#### UX Flows vs Frontend Spec

| UX Flow | Frontend Page | Status |
|---------|--------------|--------|
| F1: Salon Registration | `/register` | Covered (multi-step form) |
| F2: Master Onboarding | `/invite/:token` | Covered |
| F3: Service Configuration | `/admin/services` | Covered |
| F4: WhatsApp Booking | N/A (channel-side) | Handled by AI, not frontend |
| F5: Messenger Booking | N/A (channel-side) | Handled by AI, not frontend |
| F6: Voice Booking | N/A (channel-side) | Handled by AI + ElevenLabs |
| F7: SMS Booking | N/A (channel-side) | Handled by AI, not frontend |
| F8: Master Daily Schedule | `/master` (My Calendar) | Covered |
| F9: Block Time Off | Calendar interaction | Covered (block time button) |
| F10: Recurring Availability | `/master/availability` | Covered |
| F11: Admin Calendar | `/admin/calendar` | Covered (FullCalendar) |
| F12: Client Cancels | N/A (channel-side) | AI handles via conversation |
| F13: AI Rearrangement | N/A (backend automation) | Backend event-driven |
| F14: Master Reschedules | Calendar drag-and-drop | Covered |
| F15: Client Reschedules | N/A (channel-side) | AI handles via conversation |
| F16-F20: Notifications | Notification components | Covered |
| F21: Settings | `/admin/settings` | Covered |
| F22: Analytics | `/admin/analytics` | Covered |
| F23: Client Database | `/admin/clients` | Covered |
| F24: Channel Setup | `/admin/channels` | Covered |

**Assessment:** Excellent alignment. All UX flows have corresponding frontend implementations or are correctly identified as backend/AI-only concerns.

#### Frontend API Expectations vs Backend API

The Frontend spec (Section 6) defines expected API endpoints. The Backend spec (Section 4) defines actual API endpoints. Key differences:

| Frontend Expects | Backend Provides | Status |
|-----------------|-----------------|--------|
| `GET /api/dashboard/overview` | `GET /salons/{id}/analytics/dashboard` | MISMATCH: Different URL pattern. Backend nests under salon. Frontend should adapt to use salon-scoped URL. |
| `GET /api/masters` | `GET /salons/{id}/masters` | MISMATCH: Backend nests under salon (correct for multi-tenancy). Frontend needs to include `salonId` in all master API calls. |
| `GET /api/services` | `GET /salons/{id}/services` | Same issue. Frontend should use salon-scoped paths. |
| `GET /api/clients` | `GET /salons/{id}/clients` | Same issue. |
| `GET /api/appointments` | `GET /appointments` (with salon_id filter) | Compatible (query param vs path). |
| `PUT /api/appointments/:id/reschedule` | `PUT /appointments/{id}` (reschedule via update) | Compatible. Backend uses status in body. |
| `GET /api/channels` | Not explicitly defined in backend | GAP: Backend needs a channel status summary endpoint. |
| `GET /api/master/*` (master-specific) | Not explicitly defined as separate prefix | GAP: Backend should add `/api/v1/me/appointments`, `/api/v1/me/availability` etc. for master-role endpoints. |
| All paths use `/api/` | Backend uses `/api/v1/` | MISMATCH: Frontend should include version prefix. |

**Resolution:** Align on `/api/v1/salons/{salonId}/...` as the canonical URL pattern. The frontend's API client should be configured to automatically include the current salon ID from the tenant store. Add missing master-specific endpoints to the backend.

### 2.4 Summary of Required Actions

| ID | Action | Priority | Assigned To |
|----|--------|----------|-------------|
| A-01 | Resolve framework choice (Quarkus vs Spring Boot) | CRITICAL | Tech Lead |
| A-02 | Resolve event bus choice (Kafka vs Redis Streams) | CRITICAL | Tech Lead |
| A-03 | Resolve LLM provider strategy | HIGH | Tech Lead |
| A-04 | Resolve auth approach (Keycloak vs custom) | HIGH | Tech Lead |
| A-05 | Align frontend API paths with backend URL patterns | HIGH | Frontend + Backend |
| A-06 | Add waitlist management UI to frontend spec | MEDIUM | Frontend Dev |
| A-07 | Add GDPR settings section to frontend | MEDIUM | Frontend Dev |
| A-08 | Add master-specific API endpoints to backend | MEDIUM | Backend Dev |
| A-09 | Add channel status summary endpoint to backend | MEDIUM | Backend Dev |
| A-10 | Update PRD FR-132 reminder timing to 1h | LOW | Product Manager |
| A-11 | Add multi-language config to salon settings UI | LOW | Frontend Dev |

---

## 3. Technology Alignment

### 3.1 Framework Decision: Spring Boot 3.4 (Recommended)

After reviewing both proposals, **Spring Boot 3.4** is the recommended framework for the following reasons:

| Factor | Quarkus 3.x | Spring Boot 3.4 | Winner |
|--------|-------------|-----------------|--------|
| **Ecosystem maturity** | Growing but smaller | Largest Java ecosystem | Spring Boot |
| **Multi-tenancy support** | Manual implementation needed | Hibernate 6 built-in multi-tenancy + Spring's TenantFilter pattern | Spring Boot |
| **AI/LLM integration** | No first-party LLM framework | Spring AI (native tool calling, prompt templates, structured output) | Spring Boot |
| **Team availability** | Smaller talent pool | Larger talent pool, easier hiring | Spring Boot |
| **Documentation quality** | Good but less extensive | Extremely comprehensive | Spring Boot |
| **Startup time** | Faster (~0.5s vs ~3s) | Slower but adequate for long-running services | Quarkus |
| **Memory footprint** | Lower | Higher but manageable with virtual threads | Quarkus |
| **Native compilation** | Better GraalVM support | Supported but less mature | Quarkus |
| **Testing ecosystem** | Good (JUnit 5 + Testcontainers) | Best-in-class (Spring Boot Test, MockMvc, @DataJpaTest) | Spring Boot |
| **Security framework** | SmallRye JWT + custom RBAC | Spring Security (enterprise-grade) | Spring Boot |

**Decision rationale:** For a multi-tenant SaaS platform with complex scheduling logic, AI conversation engine, and multiple external integrations, Spring Boot's maturity, ecosystem breadth, and Spring AI integration outweigh Quarkus's performance advantages. The startup time difference is irrelevant for a long-running server. Memory savings from Quarkus are marginal when considering the overall infrastructure cost.

**Mitigation for Quarkus advantages:** Use Java 21 virtual threads to match Quarkus's concurrency efficiency. Use JLink/CDS for faster startup if needed.

### 3.2 Event Bus Decision: Redis Streams for MVP, Kafka Migration Path

**Phase 1 (MVP): Redis Streams**
- Already part of the Redis infrastructure (no new service to operate)
- Provides consumer groups, acknowledgment, and persistence
- Sufficient for expected MVP message volumes (~100 messages/minute)
- Simpler local development (no Kafka broker setup)

**Phase 2+: Evaluate Kafka Migration**
- If message volume exceeds 1,000/minute sustained
- If audit trail/replay requirements become critical
- If we need cross-service event streaming with complex routing

**Implementation:** Use an abstraction layer (Spring's ApplicationEventPublisher for in-process events, a thin wrapper over Redis Streams for cross-service events) so the underlying transport can be swapped with minimal code changes.

### 3.3 LLM Provider Decision: Abstraction with OpenAI GPT-4.1 as Primary

**Primary:** OpenAI GPT-4.1 via Spring AI
- Spring AI provides native integration with function/tool calling
- GPT-4.1 has excellent structured output and function calling
- Best multilingual support for salon markets

**Fallback:** Claude (Anthropic) via Spring AI
- Spring AI supports multiple providers
- Implement a `ChatModelProvider` interface that can switch between providers
- Automatic fallback on primary provider failure

**Decision rationale:** Spring AI provides the cleanest integration. Starting with OpenAI aligns with the backend spec and leverages Spring AI's most mature provider support. The LLM provider abstraction ensures we can switch or add providers without refactoring.

### 3.4 Authentication Decision: Custom JWT with Spring Security (MVP), Keycloak (Phase 2)

**Phase 1 (MVP): Custom JWT**
- Simpler to implement and deploy
- Fewer moving parts in the infrastructure
- Sufficient for admin + master authentication
- Spring Security provides robust JWT validation, RBAC, and method-level security

**Phase 2: Migrate to Keycloak**
- When social login (Google, Apple) is needed
- When SSO across multiple salon admin tools is required
- When user self-service (password reset, 2FA) needs a dedicated UI
- The JWT format and claims remain compatible, minimizing frontend changes

### 3.5 Unified Technology Stack (Final)

| Component | Technology | Notes |
|-----------|-----------|-------|
| **Backend Language** | Java 21 | Virtual threads enabled |
| **Backend Framework** | Spring Boot 3.4 | With Spring AI, Spring Security, Spring Data JPA |
| **Build Tool** | Gradle (Kotlin DSL) | Faster than Maven, better dependency management |
| **Database** | PostgreSQL 16 | RLS for tenant isolation, pgvector for embeddings |
| **Migrations** | Flyway | SQL-based, repeatable for RLS policies |
| **Cache** | Redis 7 | Session, conversation context, rate limiting |
| **Event Bus (MVP)** | Redis Streams | Upgrade path to Kafka |
| **Event Bus (Future)** | Apache Kafka | When scale demands it |
| **Primary LLM** | OpenAI GPT-4.1 via Spring AI | Function calling for booking |
| **Fallback LLM** | Claude (Anthropic) via Spring AI | Auto-failover |
| **Voice AI** | ElevenLabs Conversational AI 2.0 | Phase 3 |
| **SMS** | Twilio Programmable Messaging | Phase 2 |
| **Auth (MVP)** | Spring Security + Custom JWT | RS256 signing |
| **Auth (Future)** | Keycloak | When SSO/social login needed |
| **Frontend Framework** | React 19 + TypeScript | SPA architecture |
| **Frontend Build** | Vite 6 | HMR, code splitting |
| **UI Components** | shadcn/ui + Tailwind CSS 4 | Accessible, customizable |
| **State Management** | TanStack Query + Zustand | Server + client state |
| **Calendar UI** | FullCalendar 6 | Scheduling views |
| **Routing** | TanStack Router | Type-safe file-based |
| **Testing (Backend)** | JUnit 5 + Testcontainers + MockMvc | Unit + integration + API |
| **Testing (Frontend)** | Vitest + React Testing Library + Playwright | Unit + component + E2E |
| **CI/CD** | GitHub Actions | Build, test, deploy |
| **Monitoring** | Grafana + Prometheus + Loki | Metrics, alerting, logs |
| **Deployment** | Docker + Kubernetes | Container orchestration |
| **CDN** | CloudFlare | Static assets, DDoS protection |

---

## 4. Development Phases & Sprints

### Phase 1: MVP (12 Weeks / 6 Sprints)

**Goal:** Launch a working single-channel (WhatsApp) booking system for pilot salons.

#### Sprint 1 (Weeks 1-2): Foundation

**Backend:**
- Project scaffolding: Spring Boot 3.4 + Gradle + PostgreSQL + Redis + Docker Compose
- Multi-tenancy infrastructure: TenantFilter, RLS policies, tenant context propagation
- Database migrations V001-V005: tenants, salons, users, roles, services, masters, master_services
- Auth module: registration, login, JWT generation/validation, refresh tokens
- Basic RBAC: SALON_ADMIN and MASTER roles with @PreAuthorize

**Frontend:**
- Project scaffolding: Vite 6 + React 19 + TypeScript + pnpm
- shadcn/ui setup + Tailwind CSS 4 configuration
- TanStack Router setup with route structure
- Auth pages: Login, Register (multi-step), Password Reset
- API client setup: Axios instance with JWT interceptor
- Auth store (Zustand) + protected route guards

**Definition of Done:**
- [ ] Admin can register a salon and log in
- [ ] JWT authentication works end-to-end
- [ ] Multi-tenant RLS verified with integration tests (tenant A cannot see tenant B data)
- [ ] Docker Compose runs full stack locally

#### Sprint 2 (Weeks 3-4): Salon Setup & Service Catalog

**Backend:**
- Salon management API: GET/PUT salon profile, settings, working hours
- Service CRUD API: services, categories, with salon-scope
- Master CRUD API: add/invite, update, assign services, set working hours
- Database migrations V006-V007: calendars, availability_rules, time_blocks, clients
- Master invitation flow: generate invite token, accept endpoint

**Frontend:**
- Dashboard layout: sidebar, header, navigation
- Admin home page: placeholder with today's date and quick stats skeleton
- Masters management: list, add/invite, edit profile, assign services, set hours
- Services management: category-grouped list, add/edit service, category management
- Settings page: salon profile, working hours, timezone
- Master invite acceptance page

**Definition of Done:**
- [ ] Admin can add masters with working hours and assigned services
- [ ] Admin can create/edit services with categories
- [ ] Master can accept invite and set up their profile
- [ ] Salon settings (hours, timezone) are persisted and used in availability

#### Sprint 3 (Weeks 5-6): Calendar & Booking Engine

**Backend:**
- Availability calculation engine: slot generation from rules minus bookings minus blocks
- Conflict detection with database-level locking
- Appointment CRUD API: create, cancel, reschedule, status transitions
- Appointment history tracking (audit log)
- Client auto-creation (from phone number on first contact)
- Database migration V008: appointments, appointment_history

**Frontend:**
- FullCalendar integration: admin calendar (all masters, day/week/month views)
- FullCalendar: master calendar (personal day/week views)
- Appointment creation dialog: select client, master, service, available slot
- Appointment detail panel: view, reschedule, cancel, status update
- Master block time off flow
- Client list page: search, view profile, visit history

**Definition of Done:**
- [ ] Available slots are correctly calculated (working hours - existing bookings - breaks)
- [ ] Admin can create appointments via the calendar UI
- [ ] Double-booking is prevented at the database level
- [ ] Master can view their daily schedule and block time off
- [ ] Client profiles are auto-created and searchable

#### Sprint 4 (Weeks 7-8): WhatsApp Integration & AI Engine

**Backend:**
- WhatsApp Cloud API adapter: send/receive messages, webhook handling, signature verification
- Unified messaging abstraction layer (ChannelAdapter interface)
- AI conversation engine: Spring AI + OpenAI integration
- LLM tool definitions: check_availability, book_appointment, cancel_appointment, list_services
- Conversation context management (Redis-backed)
- Client resolution by phone number
- Database migration V009: conversations, messages

**Frontend:**
- Channel setup page: WhatsApp configuration with test button
- Conversation viewer: list of AI conversations, message thread view
- Channel status display (connected/disconnected indicator)

**Definition of Done:**
- [ ] Client can send WhatsApp message and receive AI response
- [ ] AI can guide a client through full booking flow (service -> master -> time -> confirm)
- [ ] AI handles cancellation and rescheduling via conversation
- [ ] AI falls back to human handoff when it cannot handle a request
- [ ] Admin can view all AI conversations in the dashboard
- [ ] Booking made via WhatsApp appears on the calendar

#### Sprint 5 (Weeks 9-10): Notifications & Client Profiles

**Backend:**
- Notification service: event-driven (AppointmentCreated -> confirmation, etc.)
- Notification template engine: variable substitution ({{client_name}}, etc.)
- Reminder scheduler: 24h and 1h reminders via Spring @Scheduled
- WhatsApp template message support (for notifications outside 24h window)
- Client profile enrichment: preferences, visit history aggregation
- GDPR endpoints: data export, data deletion request
- Database migration V010-V012: notification_templates, notifications, waitlist_entries, channels

**Frontend:**
- Notification bell + panel (real-time via WebSocket or polling)
- Client profile detail page: visit history, preferences, notes, communication history
- Notification settings (admin configures which notifications are sent)
- Notification template management
- Master "My Day" view with next client card

**Definition of Done:**
- [ ] Clients receive WhatsApp confirmation after booking
- [ ] Clients receive 24h and 1h reminders
- [ ] Master receives notification of new bookings and cancellations
- [ ] Admin can configure notification templates
- [ ] Client profiles show full visit history and preferences
- [ ] GDPR data export endpoint returns client data as JSON

#### Sprint 6 (Weeks 11-12): Integration Testing, Polish & Pilot Launch

**Backend:**
- End-to-end integration test suite (full booking flow via API)
- Performance testing: availability calculation under load
- Security audit: RLS enforcement, JWT validation, webhook signature verification
- Bug fixes from internal testing
- Production deployment setup: Docker images, K8s manifests, health checks
- Monitoring setup: Prometheus metrics, Grafana dashboards, structured logging

**Frontend:**
- E2E tests with Playwright (critical flows: login, create appointment, view calendar)
- Responsive design polish for admin dashboard (tablet + mobile)
- Master mobile view optimization
- Error states and empty states for all pages
- Loading skeletons
- Performance optimization: code splitting verification, bundle size check
- Bug fixes from internal testing

**Definition of Done:**
- [ ] Full booking cycle works end-to-end (WhatsApp message -> AI -> booking -> confirmation -> reminder -> visit)
- [ ] Admin dashboard is functional on desktop and tablet
- [ ] Master dashboard works well on mobile
- [ ] All critical flows have E2E test coverage
- [ ] System deployed to staging environment
- [ ] 3 pilot salons onboarded and testing
- [ ] No P0 or P1 bugs open

---

### Phase 2: Multi-Channel & Intelligence (12 Weeks / 6 Sprints)

**Goal:** Add Facebook Messenger, SMS channels, waitlist/rearrangement, analytics, and mobile optimization.

#### Sprint 7 (Weeks 13-14): Facebook Messenger Integration

- Facebook Messenger adapter (send/receive, webhooks, quick replies)
- Messenger-specific message formatting (cards, buttons, persistent menu)
- Channel setup UI for Facebook (OAuth flow, page connection)
- Multi-channel conversation threading (same client via different channels)
- Client merge functionality (deduplicate cross-channel contacts)

#### Sprint 8 (Weeks 15-16): SMS & Multi-Language

- Twilio SMS adapter (send/receive, delivery tracking)
- SMS booking flow (number-based replies)
- SMS notification delivery for clients without messaging apps
- Multi-language support: i18n framework in AI prompts, language auto-detection
- Salon language configuration in settings
- Frontend i18n setup (i18next with initial en/ru/he locales)

#### Sprint 9 (Weeks 17-18): Waitlist & Slot Rearrangement

- Waitlist management: add/remove entries, match on cancellation
- Cancellation slot recovery: automatic notification to waitlisted clients
- Proactive slot offering to recent inquiries
- Admin waitlist management UI
- Multi-service appointments (sequential booking in one flow)
- Buffer time and break management improvements

#### Sprint 10 (Weeks 19-20): Analytics & Reporting

- Analytics API: booking trends, revenue, master utilization, cancellation rates
- Analytics dashboard UI: recharts integration, date range filtering
- Revenue reporting by service and master
- Channel performance comparison
- Peak hours heatmap
- CSV export functionality
- Cancellation policy enforcement in AI conversations

#### Sprint 11 (Weeks 21-22): Mobile Optimization & Conversation Enhancements

- Mobile-responsive admin dashboard (bottom nav, card layouts)
- Master mobile-first view (My Day, quick actions, swipe gestures)
- WhatsApp interactive messages (buttons, lists)
- AI personality/tone configuration per salon
- FAQ handling (salon-configured knowledge base)
- Daily schedule summary notification for masters
- Conversation viewer: admin takeover (manual reply via channel)
- Client preferences auto-detection from booking patterns

#### Sprint 12 (Weeks 23-24): Phase 2 Stabilization

- End-to-end testing across all channels
- Performance optimization (caching, query tuning)
- Security review for new channels
- Bug fixes and UX refinements
- Documentation updates
- Production deployment of Phase 2 features

---

### Phase 3: Advanced Features (12 Weeks / 6 Sprints)

**Goal:** Voice agent, advanced AI scheduling, recurring appointments, and business growth tools.

#### Sprints 13-14 (Weeks 25-28): Voice Agent & Advanced Scheduling

- ElevenLabs voice agent integration (phone call handling)
- Voice-to-booking flow with tool calling
- Smart rearrangement suggestions after cancellation
- Gap analysis for master schedules
- Recurring appointment support

#### Sprints 15-16 (Weeks 29-32): Business Features

- Combo/package services
- Service-master custom pricing
- Service duration variants
- Client tags and segmentation
- Post-visit follow-up (feedback request, rebooking)
- No-show follow-up automation
- Walk-in appointment support

#### Sprints 17-18 (Weeks 33-36): Platform Maturity

- Tenant subscription management (Free/Basic/Pro tiers)
- Salon branding customization (AI name, tone, greeting)
- Keycloak migration for authentication (SSO readiness)
- AI conversation analytics (success rate, handoff rate, conversation metrics)
- Report export (PDF/CSV)
- Master performance metrics dashboard
- WhatsApp media support (photos for style references)
- Platform admin panel (tenant management, system health)

---

## 5. Team Structure

### Recommended Team Composition

| Role | Count | Responsibility | Phase |
|------|-------|---------------|-------|
| **Tech Lead / Architect** | 1 | Technical decisions, code review, architecture guidance, unblocking | All phases |
| **Backend Developer (Senior)** | 1 | Core domain logic: scheduling engine, multi-tenancy, AI integration | All phases |
| **Backend Developer (Mid)** | 1 | Channel integrations, notifications, API endpoints | All phases |
| **Frontend Developer (Senior)** | 1 | Calendar component, dashboard architecture, real-time features | All phases |
| **Frontend Developer (Mid)** | 1 | Page implementations, forms, mobile optimization | Phases 1-3 |
| **Product Manager** | 1 (part-time) | Requirements refinement, pilot salon coordination, feedback loop | All phases |
| **UX Designer** | 1 (part-time) | Wireframe refinement, usability testing, conversation design | All phases |
| **QA Engineer** | 1 | Test strategy, E2E testing, integration testing, pilot support | From Sprint 4 |
| **DevOps / SRE** | 1 (part-time) | CI/CD pipeline, Kubernetes setup, monitoring, production support | From Sprint 5 |

### Team RACI Matrix (Key Decisions)

| Decision | Tech Lead | Senior BE | Senior FE | PM | UX |
|----------|-----------|-----------|-----------|-----|-----|
| Framework/library choices | A/R | C | C | I | I |
| API contract design | A | R | C | I | I |
| Database schema design | A | R | I | I | I |
| UX flow changes | C | I | C | A | R |
| Sprint prioritization | C | I | I | A/R | C |
| Deployment decisions | A/R | C | I | I | I |

*R = Responsible, A = Accountable, C = Consulted, I = Informed*

---

## 6. Dependencies Between Workstreams

### Critical Path

```
Project Scaffolding + Multi-tenancy + Auth (Sprint 1)
    |
    +--> Salon Setup + Service Catalog + Master Mgmt (Sprint 2)
    |       |
    |       +--> Calendar + Booking Engine (Sprint 3)
    |               |
    |               +--> WhatsApp + AI Engine (Sprint 4)
    |               |       |
    |               |       +--> Notifications + Client Profiles (Sprint 5)
    |               |               |
    |               |               +--> Integration Testing + Launch (Sprint 6)
    |               |
    |               +--> [Phase 2: Additional Channels, Analytics, Waitlist]
    |                       |
    |                       +--> [Phase 3: Voice, Advanced Features]
    |
    [Frontend Development runs in parallel but depends on API availability]
```

### Backend-Frontend Dependencies

| Backend Deliverable | Sprint | Frontend Depends On It In | Notes |
|---------------------|--------|--------------------------|-------|
| Auth API (login, register, JWT) | Sprint 1 | Sprint 1 | Frontend can mock initially |
| Master/Service CRUD APIs | Sprint 2 | Sprint 2 | MSW mocks available from day 1 |
| Availability + Appointment APIs | Sprint 3 | Sprint 3 | Core calendar integration |
| WhatsApp webhook + AI responses | Sprint 4 | Sprint 4 | Conversation viewer |
| Notification APIs + WebSocket | Sprint 5 | Sprint 5 | Real-time notification bell |
| Analytics APIs | Sprint 10 | Sprint 10 | Charts and dashboards |

**Mitigation:** Frontend team uses MSW (Mock Service Worker) to mock all API endpoints from Sprint 1. This allows frontend and backend to develop in parallel. API contracts are agreed upon before each sprint begins.

### External Dependencies

| Dependency | Required By | Lead Time | Owner |
|------------|------------|-----------|-------|
| WhatsApp Business API access | Sprint 4 | 1-2 weeks for Cloud API, 2-4 weeks for template approval | Backend Dev + PM |
| OpenAI API key | Sprint 4 | Immediate (self-service) | Tech Lead |
| Domain + SSL certificate | Sprint 6 (staging) | 1-2 days | DevOps |
| Kubernetes cluster (staging) | Sprint 5 | 1 week setup | DevOps |
| Pilot salon agreements | Sprint 6 | 2-4 weeks negotiation | PM |
| Facebook App review | Sprint 7 | 2-6 weeks | Backend Dev + PM |
| Twilio account + phone number | Sprint 8 | 1-2 days (self-service) | Backend Dev |
| ElevenLabs API access | Sprint 13 | 1 week | Backend Dev |

---

## 7. Risk Register

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|----|------|-----------|--------|------------|-------|
| R-01 | WhatsApp Business API approval delayed | Medium | High | Apply early (Sprint 2). Use WhatsApp sandbox/test numbers during development. Have Telegram as contingency channel. | PM |
| R-02 | AI conversation quality insufficient for production | Medium | High | Extensive prompt engineering and testing in Sprint 4. A/B test different prompts. Implement easy human handoff. Monitor handoff rate as KPI. | Tech Lead |
| R-03 | LLM API costs exceed budget | Medium | Medium | Implement per-tenant rate limiting. Cache common queries. Use smaller models for simple intents (service listing). Monitor cost per conversation. | Backend Dev |
| R-04 | Double-booking race conditions in high-concurrency | Low | High | Database-level advisory locks (already in backend spec). Integration tests with concurrent booking attempts. Load testing in Sprint 6. | Senior BE |
| R-05 | Pilot salon users find system difficult to set up | Medium | Medium | Provide white-glove onboarding for first 3 salons. PM conducts setup alongside salon owner. Collect feedback for UX improvements. | PM + UX |
| R-06 | WhatsApp 24h messaging window limits proactive outreach | High | Medium | Pre-approve template messages for all notification types early. Design notification content within template constraints. Use SMS as fallback for time-sensitive messages. | Backend Dev |
| R-07 | Calendar performance degrades with many masters/appointments | Low | Medium | Availability calculation uses indexed queries. Cache hot slots in Redis (1-min TTL). Lazy-load calendar data by visible range. Load test in Sprint 6. | Senior BE |
| R-08 | Facebook App review rejection | Medium | Low (Phase 2) | Submit well-documented app with clear use case. Have appeal ready. Facebook is Phase 2 -- not on critical path. | PM |
| R-09 | Team member leaves mid-project | Low | High | Document all architectural decisions. Pair programming on critical modules. No single point of failure per area. | Tech Lead |
| R-10 | Scope creep from pilot salon feedback | High | Medium | Maintain strict MVP scope. Document feedback for Phase 2 backlog. PM gates all scope changes through sprint planning. | PM |
| R-11 | Multi-language AI quality varies by language | Medium | Medium | Start with English only in MVP. Add languages incrementally with quality testing per language. Use native speakers for prompt testing. | PM + Tech Lead |
| R-12 | GDPR compliance gaps discovered late | Low | High | GDPR requirements included in MVP (FR-077). Data export/deletion endpoints built in Sprint 5. Privacy by design from day 1. | Tech Lead |

---

## 8. MVP Definition

### What Ships in MVP

The MVP is the output of Phase 1 (Sprints 1-6, 12 weeks). It is a fully functional appointment booking system with AI-powered WhatsApp integration for a single salon.

**Core Features:**

1. **Salon Registration & Setup**
   - Salon owner registers, creates salon profile
   - Configures working hours, timezone, basic settings
   - Adds masters with working hours and service assignments
   - Creates service catalog with categories, durations, and prices

2. **Calendar & Booking**
   - Real-time availability calculation per master
   - Appointment CRUD (create, view, cancel, reschedule)
   - Conflict detection (no double-booking)
   - Admin calendar: all masters, day/week/month views
   - Master calendar: personal day/week views
   - Time blocking (breaks, time off)

3. **WhatsApp AI Booking**
   - Client messages salon WhatsApp number
   - AI guides booking conversation (service -> master -> time -> confirm)
   - AI handles cancellation and rescheduling
   - AI answers service/price inquiries
   - AI falls back to human when unable to help
   - Admin can view all AI conversations

4. **Client Management**
   - Auto-creation of client profiles from phone numbers
   - Client search and profile viewing
   - Visit history tracking

5. **Notifications**
   - Booking confirmation (WhatsApp)
   - 24h appointment reminder
   - 1h appointment reminder
   - Cancellation notification to client and master
   - New booking notification to master

6. **Admin Dashboard**
   - Overview with today's appointments and basic stats
   - Masters management
   - Services management
   - Client database
   - Settings configuration
   - Conversation viewer

### What Does NOT Ship in MVP

- Facebook Messenger, SMS, and Voice channels
- Waitlist and slot rearrangement
- Analytics and reporting dashboards
- Multi-language support (English only)
- Recurring appointments
- Combo/package services
- Client tags and segmentation
- Mobile-optimized responsive design (basic responsive is fine)
- Walk-in support
- Cancellation policy enforcement
- Subscription/billing management

### MVP Success Criteria

| Criteria | Target | Measurement |
|----------|--------|-------------|
| Pilot salons onboarded | 3 | Active salons with real bookings |
| Bookings via AI | 50+ | Total WhatsApp-initiated bookings across pilots |
| AI booking success rate | 70%+ | Bookings completed without human handoff |
| Average booking time | Under 3 min | Time from first message to confirmation |
| No-show rate with reminders | Under 15% | Appointments with no-show status / total |
| System uptime | 99%+ | Excluding planned maintenance |
| Critical bugs | 0 open P0s | No data loss, no double-bookings |

---

## 9. Timeline & Milestones

### Phase 1: MVP (Weeks 1-12)

| Week | Sprint | Milestone |
|------|--------|-----------|
| 2 | Sprint 1 End | M1: Foundation Complete -- Auth, multi-tenancy, basic CRUD working |
| 4 | Sprint 2 End | M2: Salon Setup Complete -- Masters, services, settings configurable |
| 6 | Sprint 3 End | M3: Booking Engine Complete -- Calendar works, appointments bookable, no conflicts |
| 8 | Sprint 4 End | M4: AI Booking Live -- Full WhatsApp booking flow working end-to-end |
| 10 | Sprint 5 End | M5: Notifications Live -- Reminders and confirmations sent automatically |
| 12 | Sprint 6 End | **M6: MVP LAUNCH** -- Pilot salons onboarded, production deployment |

### Phase 2: Multi-Channel & Intelligence (Weeks 13-24)

| Week | Sprint | Milestone |
|------|--------|-----------|
| 14 | Sprint 7 End | M7: Facebook Messenger channel live |
| 16 | Sprint 8 End | M8: SMS channel live, multi-language support |
| 18 | Sprint 9 End | M9: Waitlist and slot rearrangement operational |
| 20 | Sprint 10 End | M10: Analytics dashboard available |
| 22 | Sprint 11 End | M11: Mobile-optimized dashboards |
| 24 | Sprint 12 End | **M12: Phase 2 Complete** -- All channels, analytics, waitlist |

### Phase 3: Advanced Features (Weeks 25-36)

| Week | Sprint | Milestone |
|------|--------|-----------|
| 28 | Sprints 13-14 End | M13: Voice agent operational |
| 32 | Sprints 15-16 End | M14: Business features (combos, tags, follow-ups) |
| 36 | Sprints 17-18 End | **M15: Platform Mature** -- Subscription tiers, full analytics, platform admin |

### Key Dates (Estimated)

| Date | Event |
|------|-------|
| Week 1 | Project kickoff |
| Week 2 | Apply for WhatsApp Business API access |
| Week 6 | Internal demo: booking engine |
| Week 8 | Internal demo: AI booking via WhatsApp |
| Week 10 | Pilot salon recruitment begins |
| Week 12 | MVP launch with 3 pilot salons |
| Week 14 | Submit Facebook App for review |
| Week 16 | First paying customers (if pricing validated) |
| Week 24 | Phase 2 complete, general availability |
| Week 36 | Phase 3 complete, full platform |

---

## 10. Definition of Done

### Sprint Level

A sprint is considered "done" when:
- [ ] All committed stories are implemented and tested
- [ ] Code is reviewed and merged to main branch
- [ ] Unit test coverage meets minimum threshold (80% for new code)
- [ ] Integration tests pass on CI
- [ ] No P0 or P1 bugs introduced
- [ ] API documentation (OpenAPI/Swagger) is updated
- [ ] Sprint demo completed with stakeholders

### Feature Level

A feature is considered "done" when:
- [ ] Functional requirements from PRD are met with acceptance criteria satisfied
- [ ] Unit tests cover business logic (80%+)
- [ ] Integration tests cover API endpoints and database interactions
- [ ] Frontend components have at least happy-path tests
- [ ] Error states are handled (validation errors, network errors, empty states)
- [ ] Loading states are implemented (skeletons or spinners)
- [ ] Responsive design works on target breakpoints
- [ ] Accessibility: keyboard navigation works, ARIA labels present
- [ ] Code review approved by at least one peer
- [ ] No security vulnerabilities (checked by static analysis)
- [ ] Feature documented in API spec

### Phase Level

A phase is considered "done" when:
- [ ] All sprints in the phase are complete
- [ ] E2E tests cover all critical user flows
- [ ] Performance testing shows acceptable response times (per NFRs)
- [ ] Security review completed (OWASP checklist)
- [ ] Monitoring and alerting configured for new services/endpoints
- [ ] Production deployment successful with zero-downtime
- [ ] Pilot users (or broader users) are using the features
- [ ] Known issues documented and triaged for next phase
- [ ] Retrospective conducted and improvements identified

### MVP-Specific Definition of Done

The MVP is "done" when all of the following are true:
- [ ] 3 pilot salons have completed onboarding (salon profile, masters, services configured)
- [ ] At least 1 real client has booked via WhatsApp AI
- [ ] Booking -> confirmation -> reminder -> visit cycle works end-to-end
- [ ] No double-bookings have occurred in production
- [ ] Admin can manage all aspects via the dashboard
- [ ] Master can view their schedule on mobile
- [ ] System has been running for 48+ hours without critical failures
- [ ] Rollback plan is documented and tested
- [ ] On-call rotation is established for production support

---

## Appendix A: Decision Log

| Date | Decision | Rationale | Decided By |
|------|----------|-----------|------------|
| 2026-02-07 | Use Spring Boot 3.4 over Quarkus 3.x | Ecosystem maturity, Spring AI integration, multi-tenancy support, larger talent pool | Project Plan Review |
| 2026-02-07 | Use Redis Streams for MVP, Kafka migration path | Simpler operations for MVP volumes, same Redis infrastructure | Project Plan Review |
| 2026-02-07 | Use OpenAI GPT-4.1 as primary LLM with Claude fallback | Spring AI native support, function calling quality | Project Plan Review |
| 2026-02-07 | Use custom JWT auth for MVP, migrate to Keycloak in Phase 2+ | Reduce initial infrastructure complexity | Project Plan Review |
| 2026-02-07 | REST-only API (no GraphQL) for MVP | Frontend spec expects REST, simplicity for initial development | Project Plan Review |
| 2026-02-07 | Use shadcn/ui + Tailwind CSS 4 for frontend | Frontend dev's justified decision, full customization control | Frontend Spec |
| 2026-02-07 | Default reminder at 1h (not 2h) before appointment | UX and backend specs agree, more practical for clients | Project Plan Review |

## Appendix B: Open Questions

| ID | Question | Status | Owner |
|----|----------|--------|-------|
| Q-01 | Which WhatsApp BSP or direct Cloud API integration? | Resolved: Direct Cloud API (Architecture doc recommendation) | Backend Dev |
| Q-02 | Per-salon or shared WhatsApp number architecture? | Open: Need to decide if each salon gets their own WhatsApp number or we use a shared platform number with routing | PM + Tech Lead |
| Q-03 | Pricing model for SlotMe (per-salon subscription tiers)? | Open: Deferred to Phase 3 but needs market research earlier | PM |
| Q-04 | Data residency requirements for target markets? | Open: Determines cloud region selection | Tech Lead + PM |
| Q-05 | Will pilot salons use production or sandbox WhatsApp? | Open: Sandbox for development, production for pilot? | PM + Backend Dev |

---

*End of Project Plan*

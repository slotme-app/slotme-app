# SlotMe - User Stories & Implementation Tasks

**Version:** 1.0
**Date:** 2026-02-07
**Author:** Scrum Master / Product Owner
**Status:** Active

---

## Sprint 1: Foundation (Weeks 1-2)

### US-001: Tenant & Salon Registration
**As a** salon owner, **I want to** register my salon on SlotMe, **so that** I can start managing appointments digitally.

**Acceptance Criteria:**
- Given a new user visits the registration page, When they fill in admin details (name, email, password) and salon details (name, address, timezone), Then a tenant and salon are created with a unique tenant ID
- Given registration is complete, When the system provisions the tenant, Then default roles (SALON_ADMIN, MASTER) and default notification templates are seeded
- Given a tenant is created, When any database query runs, Then RLS policies ensure data is isolated per tenant

**Priority:** Must
**Sprint:** 1
**Dependencies:** None

**Frontend Subtasks:**
- FE-001: Scaffold Vite + React 19 + TypeScript project with pnpm
- FE-002: Set up shadcn/ui + Tailwind CSS 4 configuration
- FE-003: Set up TanStack Router with route structure (auth, admin, master layouts)
- FE-004: Build multi-step registration page (/register)
- FE-005: Build API client (Axios instance with JWT interceptor)

**Backend Subtasks:**
- BE-001: Scaffold Spring Boot 3.4 + Gradle project with Docker Compose
- BE-002: Create Flyway migrations V001-V003 (tenants, salons, users, roles)
- BE-003: Implement multi-tenancy infrastructure (TenantFilter, RLS policies, TenantContext)
- BE-004: Implement POST /api/v1/auth/register endpoint
- BE-005: Implement tenant provisioning (seed default roles, notification templates)

---

### US-002: User Authentication
**As a** salon owner or master, **I want to** log in securely with my credentials, **so that** I can access my dashboard.

**Acceptance Criteria:**
- Given valid credentials, When the user submits login, Then a JWT access token (1h) and refresh token (30d) are returned
- Given an expired access token, When the frontend calls refresh, Then a new access token is issued transparently
- Given an invalid token, When any API call is made, Then a 401 response is returned and the user is redirected to login
- Given a logged-in user, When they access /auth/me, Then their profile with role and tenant info is returned

**Priority:** Must
**Sprint:** 1
**Dependencies:** US-001

**Frontend Subtasks:**
- FE-006: Build login page (/login)
- FE-007: Build password reset page (/password-reset)
- FE-008: Implement auth store (Zustand) with login/logout/refresh
- FE-009: Implement protected route guards (role-based redirects)

**Backend Subtasks:**
- BE-006: Implement JWT generation/validation with RS256 signing
- BE-007: Implement POST /api/v1/auth/login endpoint
- BE-008: Implement POST /api/v1/auth/refresh endpoint
- BE-009: Implement POST /api/v1/auth/forgot-password and reset-password endpoints
- BE-010: Implement GET /api/v1/auth/me endpoint
- BE-011: Implement RBAC with @PreAuthorize for SALON_ADMIN and MASTER roles

---

## Sprint 2: Salon Setup & Service Catalog (Weeks 3-4)

### US-003: Salon Profile Management
**As a** salon owner, **I want to** configure my salon profile and working hours, **so that** the system knows my business details and operating schedule.

**Acceptance Criteria:**
- Given a logged-in admin, When they update salon name, address, phone, timezone, and logo, Then changes are persisted and reflected in the dashboard
- Given salon working hours are set, When availability is calculated, Then salon hours serve as the outer boundary for all bookings
- Given a salon closure date is added, When a client tries to book on that date, Then no slots are available

**Priority:** Must
**Sprint:** 2
**Dependencies:** US-001, US-002

**Frontend Subtasks:**
- FE-010: Build dashboard layout (sidebar, header, navigation)
- FE-011: Build admin home page with placeholder metrics
- FE-012: Build settings page (/admin/settings) with salon profile and working hours

**Backend Subtasks:**
- BE-012: Implement GET/PUT /api/v1/salons/{id} endpoints
- BE-013: Implement salon settings management (working hours, holidays, timezone)

---

### US-004: Master/Staff Management
**As a** salon owner, **I want to** add and manage my staff (masters), **so that** clients can book with specific stylists.

**Acceptance Criteria:**
- Given an admin, When they add a master with name, phone, email, and specialization, Then the master is created and linked to the salon
- Given an admin sends an invite, When the master clicks the invite link, Then they can set up their password and profile
- Given a master is added, When the admin assigns services and working hours, Then the master's availability reflects these settings
- Given a master is deactivated, When a client tries to book, Then the master does not appear as an option

**Priority:** Must
**Sprint:** 2
**Dependencies:** US-001, US-002

**Frontend Subtasks:**
- FE-013: Build masters list page (/admin/masters) with search and filter
- FE-014: Build add/invite master form (/admin/masters/new)
- FE-015: Build master detail/edit page (/admin/masters/:id) with service assignment and hours
- FE-016: Build invite acceptance page (/invite/:token)

**Backend Subtasks:**
- BE-014: Create Flyway migrations V004-V005 (services, service_categories, masters, master_services)
- BE-015: Implement master CRUD API (POST/GET/PUT/DELETE /api/v1/salons/{id}/masters)
- BE-016: Implement master invitation flow (generate token, send invite, accept endpoint)
- BE-017: Implement master service assignment (POST/PUT /api/v1/salons/{id}/masters/{id}/services)

---

### US-005: Service Catalog Management
**As a** salon owner, **I want to** define my salon's service catalog, **so that** clients know what can be booked and the system calculates correct durations and prices.

**Acceptance Criteria:**
- Given an admin, When they create a service with name, duration, price, and category, Then the service is available for booking
- Given services exist, When they are grouped by category, Then the admin sees an organized list
- Given a service is deactivated, When the AI or calendar shows options, Then the deactivated service is excluded
- Given a master is assigned to a service, When availability is checked, Then only assigned masters appear for that service

**Priority:** Must
**Sprint:** 2
**Dependencies:** US-001, US-002

**Frontend Subtasks:**
- FE-017: Build services management page (/admin/services) with category grouping
- FE-018: Build add/edit service dialog with category selection and master assignment

**Backend Subtasks:**
- BE-018: Implement service CRUD API (POST/GET/PUT/DELETE /api/v1/salons/{id}/services)
- BE-019: Implement service category CRUD API (/api/v1/salons/{id}/service-categories)

---

## Sprint 3: Calendar & Booking Engine (Weeks 5-6)

### US-006: Availability Calculation
**As a** system, **I want to** calculate real-time availability for each master, **so that** only valid, conflict-free slots are offered to clients.

**Acceptance Criteria:**
- Given a master with working hours 9-18 and a 13-14 lunch break, When availability is requested, Then slots are generated within working hours minus breaks
- Given existing confirmed appointments, When availability is calculated, Then booked time is excluded
- Given a service of 120 minutes and 15-minute slot granularity, When slots are generated, Then each slot has the correct duration and start times are in 15-minute increments
- Given buffer_minutes is set on a service, When slots are generated, Then buffer time is accounted for after each appointment

**Priority:** Must
**Sprint:** 3
**Dependencies:** US-003, US-004, US-005

**Frontend Subtasks:**
- (availability is consumed by calendar components in US-007)

**Backend Subtasks:**
- BE-020: Create Flyway migrations V006-V007 (calendars, availability_rules, time_blocks, clients, client_preferences)
- BE-021: Implement availability calculation engine (SlotGenerator)
- BE-022: Implement GET /api/v1/salons/{id}/available-slots endpoint
- BE-023: Implement master availability rules CRUD (GET/PUT /api/v1/masters/{id}/availability)
- BE-024: Implement time blocks CRUD (POST/GET/PUT/DELETE /api/v1/masters/{id}/time-blocks)

---

### US-007: Admin Calendar View
**As a** salon owner, **I want to** see a combined calendar for all masters, **so that** I can oversee the entire salon's schedule at a glance.

**Acceptance Criteria:**
- Given the admin navigates to the calendar, When the page loads, Then a day view with master columns shows all appointments
- Given appointments exist, When displayed on the calendar, Then they are color-coded by status (confirmed, cancelled, completed)
- Given the admin clicks an empty slot, When the dialog opens, Then they can create a new appointment
- Given day/week/month view options, When the admin switches views, Then the calendar updates correctly

**Priority:** Must
**Sprint:** 3
**Dependencies:** US-006

**Frontend Subtasks:**
- FE-019: Integrate FullCalendar with admin calendar page (/admin/calendar)
- FE-020: Build day view with master columns, week view, and month view
- FE-021: Build appointment creation dialog (select client, master, service, available slot)
- FE-022: Build appointment detail panel (view, reschedule, cancel, status update)

**Backend Subtasks:**
- (uses availability and appointment APIs from US-006 and US-008)

---

### US-008: Appointment Booking Engine
**As a** salon owner or system, **I want to** create, cancel, and reschedule appointments with conflict detection, **so that** no double-bookings occur and the calendar stays accurate.

**Acceptance Criteria:**
- Given a valid booking request, When the appointment is created, Then the calendar is updated, status is set to "confirmed", and the slot is marked as occupied
- Given two simultaneous booking requests for the same slot, When conflict detection runs, Then only one succeeds and the other receives a SLOT_CONFLICT error
- Given an appointment is cancelled, When the status changes, Then the slot is freed for rebooking
- Given an appointment is rescheduled, When the new time is confirmed, Then the old slot is freed and the new slot is booked
- Given appointment history tracking, When any status change occurs, Then an audit record is created in appointment_history

**Priority:** Must
**Sprint:** 3
**Dependencies:** US-006

**Frontend Subtasks:**
- FE-023: Implement drag-and-drop reschedule on calendar
- FE-024: Build master calendar view (/master) with personal day/week views
- FE-025: Build master block time off flow

**Backend Subtasks:**
- BE-025: Create Flyway migration V008 (appointments, appointment_history)
- BE-026: Implement appointment CRUD API (POST/GET/PUT /api/v1/appointments)
- BE-027: Implement conflict detection with database-level advisory locks
- BE-028: Implement POST /api/v1/appointments/{id}/cancel endpoint
- BE-029: Implement appointment status transitions (confirmed, completed, cancelled, no-show)
- BE-030: Implement appointment history tracking

---

### US-009: Client Management (Basic)
**As a** salon owner, **I want to** view and search clients with their visit history, **so that** I can understand my customer base.

**Acceptance Criteria:**
- Given a client contacts the salon for the first time, When their phone number is captured, Then a profile is auto-created
- Given the admin searches for a client, When they type a name or phone number, Then matching results appear within 2 seconds
- Given a client profile, When the admin views it, Then visit history, contact info, and notes are displayed

**Priority:** Must
**Sprint:** 3
**Dependencies:** US-001

**Frontend Subtasks:**
- FE-026: Build client list page (/admin/clients) with search and filter
- FE-027: Build client detail page (/admin/clients/:id) with visit history

**Backend Subtasks:**
- BE-031: Implement client CRUD API (POST/GET/PUT /api/v1/salons/{id}/clients)
- BE-032: Implement client search by name and phone
- BE-033: Implement client appointment history endpoint

---

## Sprint 4: WhatsApp Integration & AI Engine (Weeks 7-8)

### US-010: WhatsApp Channel Integration
**As a** salon owner, **I want to** connect my salon's WhatsApp Business number, **so that** clients can book via WhatsApp.

**Acceptance Criteria:**
- Given the admin enters WhatsApp Business API credentials, When they test the connection, Then a test message is sent and received successfully
- Given WhatsApp is connected, When a client sends a message to the salon number, Then the webhook receives and processes the message
- Given webhook security, When a request arrives, Then the X-Hub-Signature-256 header is verified before processing

**Priority:** Must
**Sprint:** 4
**Dependencies:** US-008, US-009

**Frontend Subtasks:**
- FE-028: Build channel setup page (/admin/channels) with WhatsApp configuration
- FE-029: Build channel status display (connected/disconnected indicator)

**Backend Subtasks:**
- BE-034: Create Flyway migration V009 (conversations, messages)
- BE-035: Implement WhatsApp Cloud API adapter (WhatsAppAdapter) with send/receive
- BE-036: Implement WhatsApp webhook controller (GET for verification, POST for messages)
- BE-037: Implement unified messaging abstraction (ChannelAdapter interface, UnifiedMessagingService)
- BE-038: Implement tenant resolution from phone_number_id to salon mapping
- BE-039: Create Flyway migration V012 (communication_channels, channel_configs)

---

### US-011: AI Conversation Engine
**As a** client, **I want to** send a WhatsApp message and have an AI guide me through booking, **so that** I can book an appointment conversationally without calling the salon.

**Acceptance Criteria:**
- Given a client sends "I want to book a haircut", When the AI processes the message, Then it asks for preferred master and date
- Given the AI calls check_availability tool, When results return, Then the AI presents 3-5 available slots in a user-friendly format
- Given all booking details are collected, When the AI calls book_appointment tool, Then the appointment is created and a confirmation message is sent
- Given the AI cannot handle a request, When escalation is triggered, Then the conversation is marked as "escalated" and the admin is notified
- Given conversation context, When a multi-turn conversation occurs, Then the AI remembers previously discussed service/master/date

**Priority:** Must
**Sprint:** 4
**Dependencies:** US-010, US-008

**Frontend Subtasks:**
- FE-030: Build conversation viewer (list of conversations, message thread view)
- FE-031: Build conversation detail with message bubbles (AI vs client styling)

**Backend Subtasks:**
- BE-040: Implement AI conversation engine with Spring AI + OpenAI integration
- BE-041: Implement LLM tool definitions (check_availability, book_appointment, cancel_appointment, list_services, reschedule_appointment, escalate_to_staff, get_client_appointments)
- BE-042: Implement conversation context management (Redis-backed JSONB)
- BE-043: Implement conversation processing pipeline (inbound message -> tenant resolution -> client resolution -> conversation resolution -> AI -> response)
- BE-044: Implement client auto-creation from phone number on first contact

---

## Sprint 5: Notifications & Client Profiles (Weeks 9-10)

### US-012: Booking Confirmation Notifications
**As a** client, **I want to** receive an instant confirmation message after booking, **so that** I know my appointment is secured.

**Acceptance Criteria:**
- Given an appointment is created, When the event fires, Then a confirmation message is sent within 30 seconds via the booking channel
- Given the confirmation template, When rendered, Then it includes date, time, master name, service, salon address, and cancellation instructions
- Given a master, When a new booking is made, Then the master receives a notification with client name, service, date, and time

**Priority:** Must
**Sprint:** 5
**Dependencies:** US-010, US-011

**Frontend Subtasks:**
- FE-032: Build notification template management page

**Backend Subtasks:**
- BE-045: Create Flyway migration V010-V011 (notification_templates, notifications, waitlist_entries)
- BE-046: Implement event-driven notification service (AppointmentCreatedEvent -> send confirmation)
- BE-047: Implement notification template engine with variable substitution
- BE-048: Implement WhatsApp template message support for outside-24h-window notifications

---

### US-013: Appointment Reminders
**As a** client, **I want to** receive reminders before my appointment, **so that** I don't forget.

**Acceptance Criteria:**
- Given an appointment in 24 hours, When the scheduler runs, Then a 24h reminder is sent to the client
- Given an appointment in 1 hour, When the scheduler runs, Then a 1h reminder is sent to the client
- Given a reminder is sent, When the client receives it, Then it includes appointment details and cancel/reschedule option
- Given an appointment is cancelled before reminder time, When the scheduler runs, Then no reminder is sent

**Priority:** Must
**Sprint:** 5
**Dependencies:** US-012

**Frontend Subtasks:**
- FE-033: Build notification settings page (admin configures which notifications are sent)

**Backend Subtasks:**
- BE-049: Implement reminder scheduler (Spring @Scheduled every 5 minutes)
- BE-050: Implement 24h and 1h reminder logic with deduplication
- BE-051: Implement cancellation and reschedule notification dispatch

---

### US-014: Cancellation & Reschedule Notifications
**As a** client or master, **I want to** be notified when an appointment is cancelled or rescheduled, **so that** I know my schedule has changed.

**Acceptance Criteria:**
- Given an appointment is cancelled by the client, When the event fires, Then the master receives a notification immediately
- Given an appointment is cancelled by the master, When the event fires, Then the client receives a notification immediately
- Given an appointment is rescheduled, When the event fires, Then both client and master receive updated details

**Priority:** Must
**Sprint:** 5
**Dependencies:** US-012

**Frontend Subtasks:**
- FE-034: Build notification bell + panel (real-time via polling)

**Backend Subtasks:**
- BE-052: Implement AppointmentCancelledEvent and AppointmentRescheduledEvent handlers
- BE-053: Implement notification delivery to masters (push notification via WebSocket or polling endpoint)

---

### US-015: Enhanced Client Profiles
**As a** salon owner, **I want to** see detailed client profiles with visit history and preferences, **so that** I can provide personalized service.

**Acceptance Criteria:**
- Given a client profile, When viewed, Then it shows name, phone, visit history, preferred master, and notes
- Given a client has visited multiple times, When the profile is viewed, Then all past appointments are listed chronologically
- Given GDPR requirements, When a data export is requested, Then the client's data is returned as JSON
- Given GDPR requirements, When a deletion is requested, Then the client's PII is removed

**Priority:** Must
**Sprint:** 5
**Dependencies:** US-009

**Frontend Subtasks:**
- FE-035: Enhance client detail page with visit history timeline, preferences, and notes
- FE-036: Build master "My Day" view with next client card

**Backend Subtasks:**
- BE-054: Implement client profile enrichment (preferences, visit history aggregation)
- BE-055: Implement GDPR endpoints (GET /clients/{id}/data-export, DELETE /clients/{id}/data)

---

## Sprint 6: Integration Testing, Polish & Pilot Launch (Weeks 11-12)

### US-016: End-to-End Booking Flow Verification
**As a** QA engineer, **I want to** verify the complete booking cycle works end-to-end, **so that** pilot salons have a reliable experience.

**Acceptance Criteria:**
- Given a client sends a WhatsApp message, When the full flow completes (AI -> booking -> confirmation -> reminder), Then all steps succeed without manual intervention
- Given 3 pilot salons, When they are onboarded with real data, Then each salon can complete bookings via WhatsApp
- Given concurrent bookings, When multiple clients book simultaneously, Then no double-bookings occur

**Priority:** Must
**Sprint:** 6
**Dependencies:** All previous sprints

**Frontend Subtasks:**
- FE-037: Write E2E tests with Playwright (login, create appointment, view calendar)
- FE-038: Implement error states and empty states for all pages
- FE-039: Implement loading skeletons across all pages
- FE-040: Responsive design polish for admin dashboard (tablet + mobile)

**Backend Subtasks:**
- BE-056: Write end-to-end integration test suite (full booking flow via API)
- BE-057: Performance test availability calculation under load
- BE-058: Security audit (RLS enforcement, JWT validation, webhook signature verification)
- BE-059: Production deployment setup (Docker images, health checks, structured logging)

---

### US-017: Master Mobile Experience
**As a** master, **I want to** view my schedule on my phone, **so that** I can check appointments between clients.

**Acceptance Criteria:**
- Given the master opens the app on mobile, When the page loads, Then the "My Day" view shows today's appointments in a timeline
- Given a mobile screen, When viewing the calendar, Then it defaults to day view with large touch targets
- Given a new booking or cancellation, When it occurs, Then the master's view updates (via polling or page refresh)

**Priority:** Should
**Sprint:** 6
**Dependencies:** US-007, US-008

**Frontend Subtasks:**
- FE-041: Optimize master mobile view (bottom tab bar, card layouts)
- FE-042: Performance optimization (code splitting verification, bundle size check)

**Backend Subtasks:**
- (uses existing APIs)

---

### US-018: Monitoring & Production Readiness
**As a** platform operator, **I want to** monitor the system health and performance, **so that** I can ensure reliability for pilot salons.

**Acceptance Criteria:**
- Given the application is running, When /actuator/health is called, Then it reports status of PostgreSQL, Redis, and application
- Given structured logging is enabled, When any request is processed, Then logs include tenant_id, user_id, request_id, and trace_id
- Given Prometheus metrics are exposed, When scraped, Then key metrics (request latency, error rate, booking count) are available

**Priority:** Must
**Sprint:** 6
**Dependencies:** None

**Frontend Subtasks:**
- (no frontend tasks)

**Backend Subtasks:**
- BE-060: Configure Spring Boot Actuator health endpoints
- BE-061: Set up structured JSON logging with MDC (tenant_id, request_id)
- BE-062: Configure Micrometer + Prometheus metrics
- BE-063: Create docker-compose.yml for full local stack
- BE-064: Bug fixes from internal testing

---

## Story Summary Matrix

| Story ID | Title | Sprint | Priority | FE Tasks | BE Tasks |
|----------|-------|--------|----------|----------|----------|
| US-001 | Tenant & Salon Registration | 1 | Must | 5 | 5 |
| US-002 | User Authentication | 1 | Must | 4 | 6 |
| US-003 | Salon Profile Management | 2 | Must | 3 | 2 |
| US-004 | Master/Staff Management | 2 | Must | 4 | 4 |
| US-005 | Service Catalog Management | 2 | Must | 2 | 2 |
| US-006 | Availability Calculation | 3 | Must | 0 | 5 |
| US-007 | Admin Calendar View | 3 | Must | 4 | 0 |
| US-008 | Appointment Booking Engine | 3 | Must | 3 | 6 |
| US-009 | Client Management (Basic) | 3 | Must | 2 | 3 |
| US-010 | WhatsApp Channel Integration | 4 | Must | 2 | 6 |
| US-011 | AI Conversation Engine | 4 | Must | 2 | 5 |
| US-012 | Booking Confirmation Notifications | 5 | Must | 1 | 4 |
| US-013 | Appointment Reminders | 5 | Must | 1 | 3 |
| US-014 | Cancellation & Reschedule Notifications | 5 | Must | 1 | 2 |
| US-015 | Enhanced Client Profiles | 5 | Must | 2 | 2 |
| US-016 | E2E Testing & Polish | 6 | Must | 4 | 4 |
| US-017 | Master Mobile Experience | 6 | Should | 2 | 0 |
| US-018 | Monitoring & Production Readiness | 6 | Must | 0 | 5 |
| **TOTAL** | | | | **42** | **64** |

---

*End of User Stories Document*

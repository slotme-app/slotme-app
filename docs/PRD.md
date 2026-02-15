# SlotMe - Product Requirements Document

**Version:** 1.0
**Date:** 2026-02-07
**Author:** Product Management
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [Target Users & Personas](#4-target-users--personas)
5. [User Stories](#5-user-stories)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [MVP Scope vs Future Phases](#8-mvp-scope-vs-future-phases)
9. [Success Metrics / KPIs](#9-success-metrics--kpis)
10. [Assumptions & Constraints](#10-assumptions--constraints)
11. [Glossary](#11-glossary)

---

## 1. Executive Summary

**SlotMe** is a multitenant AI-powered virtual administrator platform designed for beauty salons. It replaces the need for a dedicated human receptionist by automating appointment booking, calendar management, client communication, and slot optimization across multiple communication channels including WhatsApp, Facebook Messenger, voice calls (via ElevenLabs), and SMS.

Each beauty salon operates as an independent tenant with its own staff (masters/stylists), service catalog, client base, and scheduling rules. SlotMe's AI conversation engine handles natural-language interactions with clients, understands intent, manages bookings, sends reminders, and intelligently helps masters fill gaps in their schedules when cancellations occur.

The platform targets small-to-medium beauty salons that cannot afford a full-time receptionist but need professional, always-available appointment management. By eliminating missed calls, double bookings, and manual schedule juggling, SlotMe enables salons to increase revenue, reduce no-shows, and improve client satisfaction.

---

## 2. Problem Statement

### 2.1 Industry Context

The beauty salon industry is highly fragmented, with most salons being small businesses (1-10 stylists). These businesses face persistent operational challenges that directly impact revenue and customer retention.

### 2.2 Pain Points

| Pain Point | Description | Impact |
|---|---|---|
| **Missed Appointments & Revenue Loss** | Clients who cancel late or no-show leave empty slots that are rarely filled. Masters lose billable hours with no compensation. | Revenue loss of 10-30% due to unfilled slots |
| **Manual Booking Overhead** | Salon owners or masters spend significant time answering calls, replying to messages, and managing schedules instead of serving clients. | 2-4 hours/day per salon spent on administrative tasks |
| **Double Bookings & Scheduling Conflicts** | Without a centralized system, overlapping appointments occur when multiple channels (phone, walk-in, social media) are not synchronized. | Client frustration, lost trust, and negative reviews |
| **After-Hours Inaccessibility** | Most salons cannot take bookings outside working hours. Clients attempting to book in the evening or on weekends are lost to competitors. | 30-40% of booking attempts happen outside business hours |
| **Fragmented Communication** | Clients reach out via WhatsApp, phone calls, Instagram DMs, and Facebook. Tracking conversations across channels is chaotic. | Missed messages, delayed responses, inconsistent service |
| **No Cancellation Recovery** | When a client cancels, the slot typically goes unfilled. There is no systematic way to notify waitlisted clients or offer the freed slot. | Wasted capacity with no recovery mechanism |
| **Client Retention Challenges** | Without automated reminders and follow-ups, clients forget appointments or drift to competitors. | Higher no-show rates and lower repeat visit rates |
| **Lack of Business Insights** | Salon owners make decisions based on gut feeling rather than data about peak hours, popular services, and staff performance. | Suboptimal staffing and pricing decisions |

### 2.3 Current Alternatives & Their Limitations

- **Paper calendars / spreadsheets**: No automation, high error rate, no multi-channel support
- **Generic booking tools (Calendly, Acuity)**: Not designed for multi-staff salons, no AI conversation, limited channel integration
- **Industry-specific tools (Fresha, Booksy)**: Expensive per-seat pricing, limited AI capabilities, no true virtual administrator experience
- **Hiring a receptionist**: Cost-prohibitive for small salons ($1,500-3,000/month), limited to business hours

---

## 3. Solution Overview

### 3.1 What SlotMe Does

SlotMe is an **AI-powered virtual administrator** that acts as the salon's receptionist across all communication channels. It:

1. **Receives client messages** via WhatsApp, Facebook Messenger, voice calls, and SMS
2. **Understands client intent** using AI (booking, rescheduling, cancellation, inquiry)
3. **Manages appointments** by checking master availability, service durations, and salon rules
4. **Sends notifications** for confirmations, reminders, and follow-ups
5. **Optimizes schedules** by filling cancelled slots through waitlist management and proactive outreach
6. **Provides insights** via dashboards showing booking trends, staff utilization, and revenue analytics

### 3.2 Key Differentiators

- **True AI Conversation**: Natural language understanding, not rigid menu-driven bots
- **Omnichannel**: Single unified experience across WhatsApp, Facebook, voice, and SMS
- **Slot Rearrangement Intelligence**: Proactive cancellation recovery that maximizes chair utilization
- **Multitenant by Design**: Each salon is fully isolated with its own configuration, branding, and data
- **Master-Centric**: Designed around the workflow of individual stylists/masters within a salon

### 3.3 High-Level Architecture

```
Clients <--> Communication Channels (WhatsApp/FB/Voice/SMS)
                        |
                  SlotMe Platform
                  ├── AI Conversation Engine
                  ├── Booking Engine
                  ├── Calendar Manager
                  ├── Notification Service
                  ├── Slot Optimizer
                  └── Admin Dashboard
                        |
                  Salon Tenants (isolated data per salon)
```

---

## 4. Target Users & Personas

### 4.1 Persona: Salon Owner (Anna)

| Attribute | Detail |
|---|---|
| **Role** | Owner/manager of a beauty salon with 3-8 masters |
| **Age** | 30-50 |
| **Tech Savvy** | Moderate; comfortable with smartphone apps and social media |
| **Goals** | Maximize salon revenue, reduce no-shows, minimize admin overhead, retain clients |
| **Frustrations** | Spending evenings answering booking messages, dealing with scheduling conflicts, losing revenue to empty slots |
| **Key Needs** | Dashboard to see all bookings, ability to configure salon services and staff, analytics on business performance |
| **Success Criteria** | Spends less than 30 min/day on scheduling; no-show rate drops below 10%; all channels respond within 1 minute |

### 4.2 Persona: Master/Stylist (Maria)

| Attribute | Detail |
|---|---|
| **Role** | Hairdresser, nail technician, or other beauty professional working at the salon |
| **Age** | 22-45 |
| **Tech Savvy** | Moderate to high; heavy smartphone user |
| **Goals** | Fill her schedule, avoid gaps between appointments, maintain loyal clients, control her own availability |
| **Frustrations** | Clients cancelling last minute with no replacement, double bookings, being called during services to handle scheduling |
| **Key Needs** | Personal calendar view, ability to set availability/time off, notification when slots are freed or filled |
| **Success Criteria** | Calendar utilization above 80%; cancelled slots are refilled within 2 hours; zero double bookings |

### 4.3 Persona: Client (Elena)

| Attribute | Detail |
|---|---|
| **Role** | Regular or potential client of the beauty salon |
| **Age** | 18-60 |
| **Tech Savvy** | Varies; uses WhatsApp or Facebook daily |
| **Goals** | Book appointments quickly at convenient times, with preferred master, minimal back-and-forth |
| **Frustrations** | Calling salons and getting no answer, having to wait for a reply, forgetting appointment times |
| **Key Needs** | Book via her preferred messaging channel, get instant confirmation, receive reminders, easy rescheduling |
| **Success Criteria** | Booking completed in under 2 minutes; receives confirmation within 30 seconds; reminder 24h and 2h before appointment |

---

## 5. User Stories

### 5.1 Salon Owner Stories

| ID | Story | Priority |
|---|---|---|
| US-O01 | As a salon owner, I want to register my salon on SlotMe so that I can start managing appointments digitally. | Must |
| US-O02 | As a salon owner, I want to add and manage my staff (masters) so that clients can book with specific stylists. | Must |
| US-O03 | As a salon owner, I want to define my salon's service catalog (name, duration, price, which masters offer it) so that the system knows what can be booked. | Must |
| US-O04 | As a salon owner, I want to set salon-wide working hours and holidays so that the system does not offer unavailable times. | Must |
| US-O05 | As a salon owner, I want to connect my salon's WhatsApp Business number so that clients can book via WhatsApp. | Must |
| US-O06 | As a salon owner, I want to see a dashboard with today's appointments across all masters so I can oversee operations. | Must |
| US-O07 | As a salon owner, I want to see analytics (bookings, revenue, no-shows, popular services) so I can make informed decisions. | Should |
| US-O08 | As a salon owner, I want to configure notification templates (confirmations, reminders) so that messages match my salon's brand voice. | Should |
| US-O09 | As a salon owner, I want to connect my Facebook page so that clients can book via Messenger. | Should |
| US-O10 | As a salon owner, I want to set cancellation policies (e.g., minimum notice period) so that the system enforces them. | Should |
| US-O11 | As a salon owner, I want to view client history and profiles so I can understand my customer base. | Should |
| US-O12 | As a salon owner, I want to enable SMS notifications for clients who don't use messaging apps. | Could |
| US-O13 | As a salon owner, I want to set up a voice agent (phone number) so that clients can call to book. | Could |
| US-O14 | As a salon owner, I want to manage pricing and promotions for services so I can run specials. | Could |

### 5.2 Master/Stylist Stories

| ID | Story | Priority |
|---|---|---|
| US-M01 | As a master, I want to view my personal calendar so I can see my upcoming appointments. | Must |
| US-M02 | As a master, I want to set my working hours and days off so that the system only books me when I'm available. | Must |
| US-M03 | As a master, I want to be notified when a new appointment is booked for me so I can prepare. | Must |
| US-M04 | As a master, I want to be notified when an appointment is cancelled so I know my schedule changed. | Must |
| US-M05 | As a master, I want to manually block time slots (e.g., personal break, training) so no bookings are made during those times. | Must |
| US-M06 | As a master, I want the system to automatically offer my freed slots to waitlisted clients when a cancellation occurs. | Should |
| US-M07 | As a master, I want to see client history (previous visits, preferred services) when they book with me. | Should |
| US-M08 | As a master, I want to confirm or reject appointment requests if I prefer manual control. | Should |
| US-M09 | As a master, I want to receive a daily summary of my next day's appointments. | Should |
| US-M10 | As a master, I want to view my performance statistics (bookings, cancellations, revenue). | Could |

### 5.3 Client Stories

| ID | Story | Priority |
|---|---|---|
| US-C01 | As a client, I want to send a WhatsApp message to book an appointment so I can book the way I normally communicate. | Must |
| US-C02 | As a client, I want to choose a specific master/stylist when booking so I can see my preferred professional. | Must |
| US-C03 | As a client, I want to see available time slots for my chosen service and master so I can pick a convenient time. | Must |
| US-C04 | As a client, I want to receive an instant booking confirmation so I know my appointment is secured. | Must |
| US-C05 | As a client, I want to receive a reminder before my appointment so I don't forget. | Must |
| US-C06 | As a client, I want to cancel or reschedule my appointment via the same channel I booked on. | Must |
| US-C07 | As a client, I want to ask about available services and prices before booking. | Must |
| US-C08 | As a client, I want to book via Facebook Messenger as an alternative to WhatsApp. | Should |
| US-C09 | As a client, I want to be offered alternative times or masters if my first choice is unavailable. | Should |
| US-C10 | As a client, I want to be added to a waitlist if my preferred slot is taken, and be notified if it opens up. | Should |
| US-C11 | As a client, I want to call the salon and book via a voice conversation with the AI. | Could |
| US-C12 | As a client, I want to receive follow-up messages after my visit (e.g., feedback request, rebooking suggestion). | Could |
| US-C13 | As a client, I want to book multiple services in one appointment (e.g., haircut + coloring). | Should |
| US-C14 | As a client, I want to book recurring appointments (e.g., every 4 weeks) so I don't have to rebook each time. | Could |

---

## 6. Functional Requirements

### 6.1 Multi-tenancy & Salon Management

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-001 | Tenant Registration | Must | Allow a new salon to register as a tenant with basic information (name, address, phone, timezone, locale). | Salon can complete registration; a unique tenant ID is generated; salon data is isolated from other tenants. |
| FR-002 | Tenant Isolation | Must | All data (clients, appointments, staff, settings) must be strictly isolated per tenant. | No cross-tenant data leakage; queries are always scoped to the authenticated tenant. |
| FR-003 | Salon Profile Management | Must | Salon owner can update salon name, address, logo, description, and contact information. | Changes are persisted and reflected across the admin dashboard and client-facing channels. |
| FR-004 | Salon Working Hours | Must | Salon owner can define default opening and closing hours for each day of the week. | Working hours are used as the outer boundary for all booking availability calculations. |
| FR-005 | Salon Holidays & Closures | Must | Salon owner can define specific dates when the salon is closed (holidays, renovations). | No appointments can be booked on closure dates; existing appointments on those dates generate alerts. |
| FR-006 | Tenant Subscription Management | Should | System supports subscription tiers (Free/Basic/Pro) with feature gating per tier. | Feature access is controlled by subscription level; upgrade/downgrade flows work correctly. |
| FR-007 | Tenant Branding | Should | Salon owner can customize the AI assistant's name, greeting message, and tone for their salon. | Custom branding is used in all client-facing communications for that tenant. |

### 6.2 Master/Staff Management

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-010 | Add Master | Must | Salon owner can add a new master with name, phone, email, photo, and specialization. | Master is created and linked to the tenant; master can log in with their credentials. |
| FR-011 | Master Roles & Permissions | Must | System supports at least two roles: Salon Owner (full access) and Master (limited to own schedule and clients). | Role-based access control is enforced; masters cannot view or modify other masters' data unless authorized. |
| FR-012 | Master Service Assignment | Must | Salon owner can assign which services each master offers. | Only assigned services appear as bookable for that master. |
| FR-013 | Master Working Hours | Must | Each master can define their own working hours, potentially different from the salon's default hours. | Master availability is the intersection of salon hours and master's personal hours. |
| FR-014 | Master Time Off | Must | Masters can request and manage time off (vacation, sick days). | Time-off periods are blocked from booking; salon owner can approve/reject time-off requests. |
| FR-015 | Master Status | Should | Masters can be set to active or inactive (e.g., on leave, no longer at salon). | Inactive masters do not appear in booking options; their existing future appointments are flagged for reassignment. |
| FR-016 | Master Performance Metrics | Could | System tracks per-master metrics: bookings, cancellations, utilization rate, revenue generated. | Metrics are viewable by salon owner on the dashboard with date range filtering. |

### 6.3 Service Catalog Management

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-020 | Create Service | Must | Salon owner can create services with name, description, duration (minutes), and price. | Service is created and available for booking assignment. |
| FR-021 | Service Categories | Should | Services can be organized into categories (e.g., Hair, Nails, Skincare). | Categories are used in AI conversation to help clients navigate available services. |
| FR-022 | Service-Master Pricing | Should | Allow different pricing per master for the same service (e.g., senior vs junior stylist). | Correct price is displayed and recorded based on the selected master. |
| FR-023 | Service Duration Variants | Should | A service can have multiple duration/price options (e.g., Short Hair Cut 30min vs Long Hair Cut 60min). | AI conversation engine can guide client through variant selection. |
| FR-024 | Service Activation/Deactivation | Must | Salon owner can activate or deactivate services without deleting them. | Deactivated services are not offered in new bookings; historical records are preserved. |
| FR-025 | Combo Services | Could | Allow defining combo/package services (e.g., "Bridal Package" = hair + makeup + nails) with bundled pricing and total duration. | Combo books consecutive slots for component services; total price may differ from sum of parts. |

### 6.4 Calendar & Availability Management

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-030 | Availability Calculation | Must | System calculates real-time availability for each master based on: salon hours, master hours, existing bookings, blocked slots, and time-off. | Available slots returned by the API match expected availability given all constraints. |
| FR-031 | Calendar View (Master) | Must | Each master sees their own calendar with appointments, blocked time, and available slots. | Calendar displays daily/weekly views with accurate appointment data. |
| FR-032 | Calendar View (Salon Owner) | Must | Salon owner sees a combined calendar for all masters with color-coded appointments. | Owner can filter by master, service, and date range; all appointments are visible. |
| FR-033 | Buffer Time | Should | System supports configurable buffer time between appointments (e.g., 15 min for cleanup). | Buffer time is automatically added after each appointment in availability calculations. |
| FR-034 | Slot Granularity | Must | Time slots are configurable in granularity (e.g., 15-minute, 30-minute intervals). | Availability is presented in the configured slot intervals. |
| FR-035 | Break Time Management | Should | Masters can define recurring break times (e.g., lunch 13:00-14:00 daily). | Break times are excluded from availability; recurring pattern is applied automatically. |
| FR-036 | Concurrent Services | Could | Support for masters who can handle overlapping services (e.g., hair coloring processing time while starting another client). | System allows configurable overlap rules per service type. |

### 6.5 Appointment Booking Engine

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-040 | Create Appointment | Must | System can create an appointment given: client, master, service, date, start time. | Appointment is created; calendar is updated; confirmation is sent; slot is marked as occupied. |
| FR-041 | Conflict Detection | Must | System prevents double-booking by checking for time conflicts before confirming. | Overlapping appointment attempts are rejected with a clear message; alternative slots are suggested. |
| FR-042 | Appointment Confirmation | Must | Client receives an immediate confirmation message via the channel they booked on. | Confirmation includes: date, time, master name, service, salon address, and cancellation instructions. |
| FR-043 | Cancel Appointment | Must | Client or master can cancel an appointment with a reason. | Appointment status changes to cancelled; master and client are notified; slot is freed for rebooking. |
| FR-044 | Reschedule Appointment | Must | Client can reschedule to a different date/time within the same booking flow. | Old slot is freed; new slot is booked; updated confirmation is sent. |
| FR-045 | Appointment Status Tracking | Must | Appointments have statuses: Pending, Confirmed, In Progress, Completed, Cancelled, No-Show. | Status transitions are tracked with timestamps; no-show is flagged after a configurable grace period. |
| FR-046 | Multi-Service Appointment | Should | Client can book multiple services in a single appointment (sequential slots with the same or different masters). | Total duration and price reflect all services; time is blocked correctly for each segment. |
| FR-047 | Walk-in Support | Should | Salon owner or master can manually create an appointment for a walk-in client. | Walk-in appointments are created immediately; they appear on the calendar and in reporting. |
| FR-048 | Recurring Appointments | Could | Client can set up recurring appointments (e.g., every 4 weeks). | System auto-creates future appointments based on recurrence rules; client is notified of each. |
| FR-049 | Booking Preferences | Should | System learns and remembers client preferences (preferred master, usual service, preferred day/time). | AI uses preferences to suggest defaults in booking conversations, reducing steps for repeat clients. |
| FR-050 | Cancellation Policy Enforcement | Should | System enforces configurable cancellation policies (e.g., no free cancellation within 24h of appointment). | Policy is communicated to client; late cancellations are flagged; penalties can be tracked. |

### 6.6 Slot Rearrangement & Waitlist

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-060 | Waitlist Management | Should | Clients can join a waitlist for a specific master, service, and preferred time window. | Waitlist entries are stored with priority (FIFO); client is notified when a matching slot opens. |
| FR-061 | Cancellation Slot Recovery | Should | When an appointment is cancelled, the system automatically identifies waitlisted clients who could fill the slot. | Matching waitlist clients are contacted in priority order; first to confirm gets the slot. |
| FR-062 | Proactive Slot Offering | Should | System proactively messages clients who have shown interest in a time slot that just opened. | Message is sent within 5 minutes of cancellation; includes slot details and one-tap booking option. |
| FR-063 | Smart Rearrangement Suggestions | Could | When a cancellation creates a gap between appointments, system suggests rearranging adjacent appointments to consolidate free time. | Suggestions are sent to the master for approval; affected clients are contacted only after master confirms. |
| FR-064 | Gap Analysis | Could | System identifies inefficient gaps in a master's schedule (e.g., 30-min gap that can't fit any service) and suggests optimizations. | Gap analysis runs daily; suggestions are shown in the master's dashboard. |

### 6.7 Client Management & Profiles

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-070 | Auto Client Profile Creation | Must | When a client contacts the salon for the first time, a profile is automatically created from their channel info (phone number, name). | Profile is created with available info; linked to the communication channel; no duplicate profiles for the same phone number. |
| FR-071 | Client Profile Fields | Must | Client profiles include: name, phone, email (optional), preferred master, visit history, notes. | All fields are stored and editable by salon owner; history is auto-populated from appointments. |
| FR-072 | Client Visit History | Must | System maintains a full history of client visits (date, service, master, price, notes). | History is viewable by salon owner and relevant master; sorted chronologically. |
| FR-073 | Client Merge | Should | Salon owner can merge duplicate client profiles (e.g., same person contacted via WhatsApp and Facebook). | Merged profile retains all history and communication threads; duplicate is archived. |
| FR-074 | Client Tags & Segmentation | Could | Salon owner can tag clients (e.g., VIP, New, Frequent) for segmentation and targeted messaging. | Tags are assignable and filterable; can be used in notification rules. |
| FR-075 | Client Communication History | Should | Full conversation history with each client is stored and viewable per channel. | Salon owner can review all past messages between the AI and a specific client. |
| FR-076 | Client Preferences | Should | System stores and uses client preferences (preferred master, typical service, preferred time). | Preferences are auto-detected from booking patterns and used by AI in future conversations. |
| FR-077 | GDPR/Data Privacy Compliance | Must | Client data handling complies with GDPR: data export, deletion requests, consent management. | Client can request data export or deletion; salon owner can process these via dashboard. |

### 6.8 Communication Channels

#### 6.8.1 WhatsApp Integration

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-080 | WhatsApp Business API Integration | Must | System integrates with WhatsApp Business API to send and receive messages on behalf of the salon. | Messages sent by clients to the salon's WhatsApp number are received by the system; system can send replies. |
| FR-081 | WhatsApp Message Templates | Must | System uses approved WhatsApp message templates for notifications (confirmations, reminders). | Templates are pre-approved by Meta; template messages are delivered reliably. |
| FR-082 | WhatsApp Session Messages | Must | System handles free-form session messages within the 24-hour window. | AI can conduct full conversations within the session window; proactive messages use templates. |
| FR-083 | WhatsApp Interactive Messages | Should | System uses interactive message types (buttons, lists) for quick actions (e.g., "Confirm" / "Cancel" buttons). | Interactive elements render correctly on client's WhatsApp; selections are processed. |
| FR-084 | WhatsApp Media Support | Could | System can receive and send images (e.g., client sends reference photo for desired hairstyle). | Images are stored in client profile; master can view them before the appointment. |

#### 6.8.2 Facebook Messenger Integration

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-090 | Facebook Page Integration | Should | System connects to the salon's Facebook page to handle Messenger conversations. | Messages to the page's Messenger are received by the system; system responds on behalf of the salon. |
| FR-091 | Messenger Bot Configuration | Should | AI conversation engine works identically on Messenger as on WhatsApp. | Booking flow, cancellation, and inquiry handling are consistent across channels. |
| FR-092 | Messenger Quick Replies | Should | System uses Messenger quick reply buttons for structured interactions. | Quick replies are displayed and functional in the Messenger client. |

#### 6.8.3 Voice Agent (ElevenLabs)

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-100 | Voice Agent Setup | Could | System supports an AI voice agent powered by ElevenLabs for handling phone calls. | Incoming calls to the salon's number are answered by the AI voice agent. |
| FR-101 | Voice-to-Intent Processing | Could | Voice agent transcribes speech and maps it to booking intents (same as text channels). | Booking, cancellation, and inquiry intents are correctly identified from voice input. |
| FR-102 | Voice Conversation Flow | Could | Voice agent conducts a natural conversation to complete a booking (asks for service, master, time). | Full booking can be completed via voice; confirmation is sent via SMS or WhatsApp after the call. |
| FR-103 | Call Handoff | Could | If the voice agent cannot handle a request, it offers to transfer the call to the salon owner or a master. | Handoff is smooth; caller is informed of the transfer; salon staff receives context. |

#### 6.8.4 SMS Integration

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-110 | SMS Notification Sending | Should | System can send SMS messages for confirmations, reminders, and slot offers. | SMS is delivered to client's phone number; delivery status is tracked. |
| FR-111 | SMS Booking Flow | Could | Clients can book by replying to SMS messages (limited interaction flow). | Simple reply-based booking (e.g., "Reply 1 to confirm") works correctly. |
| FR-112 | SMS Provider Integration | Should | System integrates with an SMS gateway (e.g., Twilio) for sending and receiving SMS. | SMS delivery rates are above 95%; cost per message is tracked per tenant. |

### 6.9 AI Conversation Engine

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-120 | Intent Recognition | Must | AI recognizes client intents: book appointment, cancel, reschedule, inquire about services/prices, ask about availability, general inquiry. | Intent is correctly identified in 95%+ of clear messages; ambiguous messages trigger clarification. |
| FR-121 | Contextual Conversation | Must | AI maintains conversation context within a session (remembers what service/master was discussed). | Multi-turn conversations flow naturally; AI does not ask for information already provided. |
| FR-122 | Slot Proposal | Must | AI proposes available time slots based on the client's requested service, master, and date. | Proposed slots are actually available; AI presents 3-5 options in a user-friendly format. |
| FR-123 | Booking Confirmation Flow | Must | AI guides client through the full booking flow: service selection, master selection, date/time selection, confirmation. | Complete booking is created with all required fields; confirmation message is sent. |
| FR-124 | Fallback to Human | Must | When AI cannot handle a request, it gracefully hands off to the salon owner with full conversation context. | Salon owner is notified; conversation context is forwarded; client is informed of the handoff. |
| FR-125 | Multi-language Support | Should | AI can converse in multiple languages based on salon configuration (at minimum: English, Russian, Hebrew). | Language is auto-detected or configured per tenant; responses are in the correct language. |
| FR-126 | Personality & Tone Configuration | Should | Salon owner can configure the AI's tone (formal, friendly, casual) and name. | AI responses match the configured tone; configured name is used in greetings. |
| FR-127 | FAQ Handling | Should | AI can answer common questions (parking, location, payment methods) based on salon-configured FAQ entries. | FAQ answers are accurate; salon owner can add/edit FAQ entries via dashboard. |
| FR-128 | Disambiguation | Must | When a client's message is ambiguous, AI asks clarifying questions rather than making assumptions. | Ambiguous inputs result in clear, concise clarification questions; AI does not book without sufficient information. |
| FR-129 | Conversation Analytics | Should | System logs and categorizes all conversations for quality analysis. | Conversations are searchable; intent distribution and handoff rates are tracked. |

### 6.10 Notification System

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-130 | Booking Confirmation Notification | Must | Client receives a confirmation message immediately after booking. | Notification is sent within 30 seconds of booking; includes all appointment details. |
| FR-131 | Appointment Reminder (24h) | Must | Client receives a reminder 24 hours before the appointment. | Reminder is sent at the correct time; includes appointment details and cancel/reschedule option. |
| FR-132 | Appointment Reminder (2h) | Should | Client receives a reminder 2 hours before the appointment. | Reminder is sent at the correct time; is concise. |
| FR-133 | Cancellation Notification | Must | Both client and master are notified when an appointment is cancelled (by either party). | Notifications are sent to both parties within 1 minute of cancellation. |
| FR-134 | Reschedule Notification | Must | Client and master receive updated details when an appointment is rescheduled. | Notification includes both old and new times; calendar is updated. |
| FR-135 | New Booking Notification (Master) | Must | Master receives a notification when a new appointment is booked in their calendar. | Notification includes client name, service, date, and time. |
| FR-136 | Daily Schedule Summary | Should | Masters receive a summary of their next day's appointments each evening. | Summary is sent at a configurable time (default: 20:00); includes all next-day appointments. |
| FR-137 | Waitlist Slot Notification | Should | Waitlisted clients receive a message when a matching slot becomes available. | Notification is sent within 5 minutes of slot opening; includes booking option. |
| FR-138 | No-Show Follow-Up | Could | Client receives a follow-up message if marked as no-show, offering to rebook. | Message is sent within 1 hour of no-show marking; tone is professional and non-accusatory. |
| FR-139 | Post-Visit Follow-Up | Could | Client receives a follow-up message after their visit (feedback request, rebooking prompt). | Message is sent 24-48 hours after the completed appointment. |
| FR-140 | Notification Channel Preference | Should | Notifications are sent via the client's preferred or most recent channel. | System tracks which channel the client used most recently and defaults to it. |

### 6.11 Analytics & Reporting

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-150 | Booking Analytics Dashboard | Should | Dashboard showing booking trends: total bookings, bookings by service, bookings by master, bookings by channel. | Data is accurate; date range filtering works; charts are clear and exportable. |
| FR-151 | Revenue Reporting | Should | Reports showing revenue by period, by master, by service. | Revenue calculations are accurate; supports daily/weekly/monthly/custom periods. |
| FR-152 | Utilization Report | Should | Shows each master's calendar utilization (booked hours / available hours). | Utilization percentage is accurately calculated; displayed per master with trend over time. |
| FR-153 | Cancellation & No-Show Report | Should | Tracks cancellation rates and no-show rates over time, by master, by client. | Rates are accurate; repeat offenders are identifiable; trends are visualized. |
| FR-154 | Client Acquisition Report | Could | Shows new vs returning client ratios, client acquisition by channel. | First-visit clients are correctly identified; channel attribution is accurate. |
| FR-155 | AI Conversation Metrics | Could | Tracks AI performance: successful bookings, handoffs to human, average conversation length, satisfaction. | Metrics are calculated from conversation logs; anomalies are highlighted. |
| FR-156 | Export Functionality | Could | All reports can be exported as CSV or PDF. | Export produces well-formatted files with all visible data. |

### 6.12 Admin Dashboard

| ID | Requirement | Priority | Description | Acceptance Criteria |
|---|---|---|---|---|
| FR-160 | Salon Owner Dashboard Home | Must | Landing page showing today's overview: upcoming appointments, active masters, recent messages, quick stats. | Dashboard loads in under 3 seconds; data is real-time; layout is clear and actionable. |
| FR-161 | Appointment Management View | Must | Salon owner can view, create, edit, and cancel appointments from the dashboard. | CRUD operations work correctly; changes are reflected in real-time on all views. |
| FR-162 | Staff Management View | Must | Interface to add, edit, activate/deactivate masters and their settings. | All master CRUD operations are functional; changes take effect immediately. |
| FR-163 | Service Catalog Management View | Must | Interface to manage services, categories, pricing, and duration. | Service CRUD is functional; changes are reflected in the AI booking engine immediately. |
| FR-164 | Client List & Search | Must | Searchable, filterable list of all salon clients with access to individual profiles. | Search works on name and phone; results load in under 2 seconds; profile links work. |
| FR-165 | Conversation Viewer | Should | Read-only view of AI conversations with clients, with ability to take over (respond manually). | Conversations are displayed in chat format; manual responses are sent via the same channel. |
| FR-166 | Settings & Configuration | Must | Centralized settings page for salon hours, notification preferences, channel connections, cancellation policies. | All settings are persisted; changes take effect within 1 minute. |
| FR-167 | Mobile-Responsive Design | Should | Admin dashboard is fully functional on mobile devices (phone and tablet). | All features are accessible and usable on screens 375px and wider. |
| FR-168 | Master Mobile View | Should | Masters have a simplified mobile-first view focused on their calendar and notifications. | Master can view their schedule, block time, and see notifications on mobile. |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| ID | Requirement | Target |
|---|---|---|
| NFR-001 | API Response Time | 95th percentile response time under 500ms for read operations, under 1000ms for write operations. |
| NFR-002 | AI Response Time | AI-generated replies are sent within 3 seconds of receiving a client message. |
| NFR-003 | Notification Delivery | Notifications (confirmations, reminders) are sent within 30 seconds of trigger. |
| NFR-004 | Dashboard Load Time | Admin dashboard pages load within 3 seconds on a standard broadband connection. |
| NFR-005 | Concurrent Users | System supports at least 100 concurrent salon operators and 1,000 concurrent client conversations. |

### 7.2 Scalability

| ID | Requirement | Target |
|---|---|---|
| NFR-010 | Tenant Scalability | System supports up to 10,000 active tenants without architecture changes. |
| NFR-011 | Message Throughput | System handles at least 10,000 messages per minute across all tenants. |
| NFR-012 | Horizontal Scaling | All stateless services support horizontal scaling via containerization. |
| NFR-013 | Database Scalability | Database supports sharding by tenant for future growth. |

### 7.3 Security

| ID | Requirement | Target |
|---|---|---|
| NFR-020 | Authentication | All users authenticate via secure methods (OAuth 2.0, JWT tokens). Session timeout after 30 min of inactivity. |
| NFR-021 | Authorization | Role-based access control (RBAC) enforced at API level. Tenant isolation enforced at database query level. |
| NFR-022 | Data Encryption | All data encrypted in transit (TLS 1.2+) and at rest (AES-256). |
| NFR-023 | PII Protection | Personally identifiable information (names, phone numbers, emails) is encrypted at the field level in the database. |
| NFR-024 | API Security | Rate limiting, input validation, and protection against OWASP Top 10 vulnerabilities. |
| NFR-025 | Audit Logging | All administrative actions are logged with user, action, timestamp, and affected resource. |

### 7.4 Availability & Reliability

| ID | Requirement | Target |
|---|---|---|
| NFR-030 | Uptime | 99.9% uptime SLA (less than 8.7 hours downtime per year). |
| NFR-031 | Disaster Recovery | Recovery Point Objective (RPO): 1 hour. Recovery Time Objective (RTO): 4 hours. |
| NFR-032 | Backup | Automated daily backups with 30-day retention. Point-in-time recovery supported. |
| NFR-033 | Graceful Degradation | If the AI engine is unavailable, messages are queued and a fallback response informs clients of the delay. |
| NFR-034 | Message Delivery Guarantee | At-least-once delivery for all notifications. Deduplication for idempotent operations. |

### 7.5 Maintainability

| ID | Requirement | Target |
|---|---|---|
| NFR-040 | Code Quality | Minimum 80% unit test coverage for core business logic. |
| NFR-041 | API Documentation | All APIs documented with OpenAPI/Swagger specification. |
| NFR-042 | Monitoring | Application metrics, error rates, and business KPIs are monitored with alerting. |
| NFR-043 | Logging | Structured logging with correlation IDs for request tracing across services. |

---

## 8. MVP Scope vs Future Phases

### Phase 1: MVP (Months 1-3)

**Goal:** Launch a functional single-channel booking system for one salon.

**In Scope:**
- Tenant registration and basic setup (FR-001 to FR-005)
- Master management with working hours (FR-010 to FR-014)
- Service catalog (FR-020, FR-024)
- Calendar and availability calculation (FR-030 to FR-032, FR-034)
- Core booking engine: create, cancel, reschedule (FR-040 to FR-045)
- WhatsApp integration as primary channel (FR-080 to FR-082)
- AI conversation engine: intent recognition, booking flow, confirmation (FR-120 to FR-124, FR-128)
- Basic notifications: confirmation, reminders, cancellation (FR-130 to FR-135)
- Client auto-profile creation and history (FR-070 to FR-072)
- Essential admin dashboard: calendar view, appointment management, staff management, services, settings (FR-160 to FR-164, FR-166)
- GDPR compliance basics (FR-077)

**Out of Scope for MVP:**
- Facebook Messenger, Voice, SMS channels
- Waitlist and slot rearrangement
- Analytics and reporting
- Recurring appointments
- Multi-language (single language in MVP)
- Combo services
- Client tags and segmentation
- Mobile-responsive admin (basic responsive is fine, not optimized)

### Phase 2: Multi-Channel & Intelligence (Months 4-6)

**Goal:** Add channels and smart scheduling features.

**In Scope:**
- Facebook Messenger integration (FR-090 to FR-092)
- SMS notifications (FR-110, FR-112)
- Waitlist management (FR-060 to FR-062)
- Multi-service appointments (FR-046)
- Buffer time between appointments (FR-033)
- Break time management (FR-035)
- Cancellation policy enforcement (FR-050)
- WhatsApp interactive messages (FR-083)
- Multi-language support (FR-125)
- AI tone configuration (FR-126)
- FAQ handling (FR-127)
- Daily schedule summary (FR-136)
- Basic analytics dashboard (FR-150 to FR-153)
- Client communication history (FR-075)
- Client preferences (FR-076)
- Client merge (FR-073)
- Conversation viewer (FR-165)
- Mobile-responsive dashboard (FR-167)
- Master mobile view (FR-168)
- Notification channel preferences (FR-140)

### Phase 3: Advanced Features (Months 7-9)

**Goal:** Voice, advanced AI, and growth tools.

**In Scope:**
- Voice agent via ElevenLabs (FR-100 to FR-103)
- SMS booking flow (FR-111)
- Smart rearrangement suggestions (FR-063)
- Gap analysis (FR-064)
- Recurring appointments (FR-048)
- Combo/package services (FR-025)
- Client tags & segmentation (FR-074)
- Post-visit follow-up (FR-139)
- No-show follow-up (FR-138)
- Service duration variants (FR-023)
- Service-master pricing (FR-022)
- Concurrent service support (FR-036)
- Client acquisition report (FR-154)
- AI conversation metrics (FR-155)
- Report export (FR-156)
- Master performance metrics (FR-016)
- WhatsApp media support (FR-084)
- Subscription tiers (FR-006)
- Salon branding customization (FR-007)
- Walk-in support (FR-047)
- Booking preferences learning (FR-049)
- Conversation analytics (FR-129)
- Master confirmation flow (FR-008)

### Future Considerations (Post Phase 3)

- Online payment integration (deposits, prepayment)
- Client loyalty programs and rewards
- Inventory management (products used per service)
- Staff payroll calculations based on bookings
- Multi-location salon support (chain management)
- Public booking page/website widget
- Integration with Instagram DMs
- Client review and rating system
- Promotional campaigns and marketing automation
- Integration with Google Calendar/Apple Calendar for masters
- Waitlist priority based on client value (VIP handling)

---

## 9. Success Metrics / KPIs

### 9.1 Business KPIs

| Metric | Target (6 months post-launch) | Measurement |
|---|---|---|
| Active Tenants (Salons) | 50+ salons onboarded | Count of salons with at least 1 booking in the last 30 days |
| Monthly Bookings per Salon | 200+ bookings/month average | Total bookings / active tenants |
| No-Show Rate Reduction | 50% reduction from salon's baseline | (No-shows / Total appointments) compared to pre-SlotMe period |
| After-Hours Bookings | 30%+ of all bookings made outside business hours | Bookings timestamped outside salon working hours |
| Slot Recovery Rate | 40%+ of cancelled slots refilled | Cancelled slots that were rebooked within 24 hours |
| Tenant Retention | 85%+ monthly retention | Salons active in month N that are still active in month N+1 |

### 9.2 Product KPIs

| Metric | Target | Measurement |
|---|---|---|
| AI Booking Success Rate | 80%+ of conversations result in a booking without human handoff | Successful bookings / total booking intent conversations |
| Average Booking Time | Under 2 minutes from first message to confirmation | Timestamp difference between first message and confirmation |
| Message Response Time | Under 3 seconds for AI replies | Average time from message receipt to response sent |
| Notification Delivery Rate | 98%+ for WhatsApp, 95%+ for SMS | Delivered notifications / sent notifications |
| Client Satisfaction (CSAT) | 4.0+ out of 5.0 | Post-visit survey ratings |
| System Uptime | 99.9%+ | Total uptime / total time |
| Conversation Handoff Rate | Under 15% of conversations require human intervention | Human handoff events / total conversations |

### 9.3 Technical KPIs

| Metric | Target | Measurement |
|---|---|---|
| API P95 Latency | Under 500ms | Application performance monitoring |
| Error Rate | Under 0.1% of API calls | Error count / total API calls |
| Database Query Time | P95 under 100ms | Database monitoring |
| Deployment Frequency | Weekly releases minimum | Release count per month |
| Test Coverage | 80%+ for core modules | Code coverage reports |

---

## 10. Assumptions & Constraints

### 10.1 Assumptions

| ID | Assumption |
|---|---|
| A-01 | Salon owners have access to a smartphone and stable internet connection. |
| A-02 | Salons have or can obtain a WhatsApp Business API account (via a BSP like Twilio or 360dialog). |
| A-03 | Clients primarily use WhatsApp or Facebook Messenger for daily communication. |
| A-04 | Service durations are predictable enough to schedule accurately (e.g., a haircut is consistently ~45 min). |
| A-05 | Salon owners are willing to invest time in initial setup (adding services, staff, working hours). |
| A-06 | The AI model (LLM) can handle the required languages with sufficient quality for booking conversations. |
| A-07 | Salons currently manage bookings manually or with basic tools, so even partial automation provides value. |
| A-08 | Clients are comfortable interacting with an AI assistant for booking purposes. |

### 10.2 Constraints

| ID | Constraint | Impact |
|---|---|---|
| C-01 | WhatsApp Business API has a 24-hour messaging window for free-form messages; outside this window, only approved template messages can be sent. | Proactive outreach (e.g., slot offers) must use templates, which require Meta approval and are limited in format. |
| C-02 | WhatsApp Business API costs per conversation (approximately $0.02-0.08 per conversation depending on region). | Per-tenant messaging costs must be factored into pricing model. |
| C-03 | ElevenLabs voice agent has per-minute costs and latency considerations. | Voice feature may be limited to higher-tier subscriptions. |
| C-04 | AI model (LLM) inference has per-token costs. | Conversation length affects operational costs; cost optimization strategies are needed. |
| C-05 | GDPR and local data protection laws govern how client data is stored and processed. | Data must be stored in compliant regions; deletion and export workflows are required from MVP. |
| C-06 | Salons operate in specific timezones; the system must handle timezone-aware scheduling. | All datetime operations must be timezone-aware; DST transitions must be handled correctly. |
| C-07 | Multi-language support requires high-quality translations and culturally appropriate AI responses. | AI quality may vary by language; initial launch may be limited to 2-3 languages. |
| C-08 | WhatsApp and Facebook APIs may change their policies, pricing, or capabilities. | Channel integrations must be abstracted to allow adaptation to API changes. |

### 10.3 Dependencies

| ID | Dependency | Risk Level |
|---|---|---|
| D-01 | WhatsApp Business API access (via BSP) | Medium - BSP onboarding can take 1-2 weeks |
| D-02 | LLM Provider (e.g., OpenAI, Anthropic) for AI conversation engine | Low - multiple providers available |
| D-03 | ElevenLabs API for voice agent | Low - only needed in Phase 3 |
| D-04 | SMS Gateway (e.g., Twilio) | Low - commodity service |
| D-05 | Cloud hosting provider (e.g., AWS, GCP) | Low - commodity service |
| D-06 | PostgreSQL database | Low - proven, widely available |
| D-07 | Facebook Graph API for Messenger integration | Medium - requires app review process |

---

## 11. Glossary

| Term | Definition |
|---|---|
| **Tenant** | A single beauty salon registered on the SlotMe platform. Each tenant has isolated data and configuration. |
| **Master** | A beauty professional (stylist, hairdresser, nail technician, etc.) who provides services at a salon. Also referred to as "stylist" or "staff member." |
| **Salon Owner** | The person who manages the salon's SlotMe account, configures settings, and oversees operations. May also be a master. |
| **Client** | An end customer who books and receives beauty services at a salon. |
| **Service** | A specific beauty treatment offered by the salon (e.g., Women's Haircut, Gel Manicure, Balayage). |
| **Slot** | A specific time period on a master's calendar that can be booked for a service. |
| **Appointment** | A confirmed booking of a specific service with a specific master at a specific date and time. |
| **Waitlist** | A queue of clients who want to be notified when a specific type of slot becomes available. |
| **Slot Rearrangement** | The process of reorganizing a master's appointments to optimize schedule efficiency after a cancellation. |
| **Session (WhatsApp)** | A 24-hour messaging window that opens when a client sends a message, during which free-form messages can be sent. |
| **Template Message** | A pre-approved WhatsApp message format used for proactive outbound communication outside the session window. |
| **BSP** | Business Solution Provider - a Meta-approved partner that provides access to the WhatsApp Business API. |
| **Intent** | The purpose behind a client's message (e.g., book, cancel, inquire), as identified by the AI engine. |
| **Handoff** | The transfer of a conversation from the AI to a human operator when the AI cannot handle the request. |
| **Buffer Time** | A configurable gap between consecutive appointments to allow for cleanup, preparation, or transition. |
| **Utilization Rate** | The percentage of a master's available working hours that are booked with appointments. |
| **No-Show** | When a client fails to arrive for a confirmed appointment without prior cancellation. |
| **Channel** | A communication medium through which clients interact with the salon (WhatsApp, Facebook Messenger, Voice, SMS). |
| **RBAC** | Role-Based Access Control - a method of restricting system access based on the roles of users within the organization. |
| **RPO** | Recovery Point Objective - the maximum acceptable amount of data loss measured in time. |
| **RTO** | Recovery Time Objective - the maximum acceptable time to restore the system after a failure. |

---

*End of Product Requirements Document*

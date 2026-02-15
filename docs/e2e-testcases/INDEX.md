# SlotMe E2E Test Cases - Quick Reference Index

**Generated:** 2026-02-15
**Total Test Cases:** 162
**Status:** Ready for Testing

---

## Quick Navigation

### Start Here
- **[README-Test-Cases-Summary.md](README-Test-Cases-Summary.md)** - Complete overview, execution guidelines, and test strategy

---

## Test Case Files by Feature

### 1. Authentication & User Management
**File:** [US001-US002-Authentication-TestCases.md](US001-US002-Authentication-TestCases.md)
- **Test Cases:** 16
- **User Stories:** US-001 (Tenant & Salon Registration), US-002 (User Authentication)
- **Key Scenarios:**
  - Salon registration and onboarding
  - Login/logout with JWT tokens
  - Password reset flow
  - Multi-tenant isolation
  - Security validations

**Critical Test Cases:**
- TC-AUTH-001: Successful Salon Registration
- TC-AUTH-003: Successful Login
- TC-AUTH-005: Token Refresh Flow
- TC-AUTH-011: Multi-Tenant Isolation

---

### 2. Salon, Master & Service Management
**File:** [US003-US004-US005-Salon-Management-TestCases.md](US003-US004-US005-Salon-Management-TestCases.md)
- **Test Cases:** 25
- **User Stories:** US-003 (Salon Profile), US-004 (Master Management), US-005 (Service Catalog)
- **Key Scenarios:**
  - Salon profile and working hours configuration
  - Master invitation and onboarding
  - Service catalog CRUD operations
  - Master-specific pricing
  - Search and filtering

**Critical Test Cases:**
- TC-SALON-002: Configure Salon Working Hours
- TC-MASTER-001: Add New Master
- TC-MASTER-002: Master Accepts Invitation
- TC-SERVICE-001: Add New Service

---

### 3. Calendar Views & Appointment Booking
**File:** [US006-US007-US008-Calendar-Booking-TestCases.md](US006-US007-US008-Calendar-Booking-TestCases.md)
- **Test Cases:** 28
- **User Stories:** US-006 (Availability Calculation), US-007 (Admin Calendar), US-008 (Booking Engine)
- **Key Scenarios:**
  - Real-time availability calculation
  - Multi-master calendar views (day/week/month)
  - Appointment creation with conflict detection
  - Concurrent booking prevention
  - Appointment cancellation and rescheduling
  - Multi-service bookings

**Critical Test Cases:**
- TC-AVAIL-001: Calculate Basic Availability
- TC-AVAIL-003: Availability with Existing Appointments
- TC-BOOK-001: Create Appointment Successfully
- TC-BOOK-002: Conflict Detection
- TC-BOOK-003: Concurrent Booking Prevention

---

### 4. Client Management
**File:** [US009-Client-Management-TestCases.md](US009-Client-Management-TestCases.md)
- **Test Cases:** 21
- **User Stories:** US-009 (Client Management), US-015 (Enhanced Client Profiles)
- **Key Scenarios:**
  - Auto-create client profiles on first contact
  - Client search by name and phone
  - Visit history and preferences tracking
  - Communication history across channels
  - GDPR compliance (data export and deletion)
  - Client merge for duplicates

**Critical Test Cases:**
- TC-CLIENT-001: Auto-Create Client on First Contact
- TC-CLIENT-005: View Client Profile Details
- TC-CLIENT-013: Export Client Data (GDPR)
- TC-CLIENT-014: Delete Client Data (GDPR)

---

### 5. WhatsApp Integration & AI Conversation
**File:** [US010-US011-WhatsApp-AI-Conversation-TestCases.md](US010-US011-WhatsApp-AI-Conversation-TestCases.md)
- **Test Cases:** 25
- **User Stories:** US-010 (WhatsApp Integration), US-011 (AI Conversation Engine)
- **Key Scenarios:**
  - WhatsApp Business API setup and webhook verification
  - Receive and send WhatsApp messages
  - AI greeting and intent recognition
  - Complete end-to-end booking via AI
  - AI tool calls (check_availability, book_appointment, cancel, reschedule)
  - Conversation context management
  - AI escalation to human
  - Multi-language support

**Critical Test Cases:**
- TC-WA-001: Configure WhatsApp Business API
- TC-WA-003: Receive Incoming WhatsApp Message
- TC-WA-006: Tenant Resolution from Phone Number ID
- TC-AI-001: AI Greeting for New Client
- TC-AI-003: Complete Booking Flow via AI
- TC-AI-006: AI Tool Call - check_availability
- TC-AI-007: AI Tool Call - book_appointment

---

### 6. Notifications & Reminders
**File:** [US012-US013-US014-Notifications-TestCases.md](US012-US013-US014-Notifications-TestCases.md)
- **Test Cases:** 24
- **User Stories:** US-012 (Booking Confirmations), US-013 (Reminders), US-014 (Cancellation Notifications)
- **Key Scenarios:**
  - Booking confirmation to client and master
  - 24-hour and 1-hour appointment reminders
  - Reminder deduplication
  - Cancellation and reschedule notifications
  - Master daily schedule summary
  - Notification preferences and customization
  - WhatsApp template message compliance

**Critical Test Cases:**
- TC-NOTIF-001: Send Booking Confirmation to Client
- TC-REMIND-001: Send 24-Hour Reminder
- TC-CANCEL-001: Notify Client When Master Cancels
- TC-RESCHEDULE-001: Notify Both Parties on Reschedule

---

### 7. Analytics & Dashboards
**File:** [Analytics-Dashboard-TestCases.md](Analytics-Dashboard-TestCases.md)
- **Test Cases:** 23
- **User Stories:** Analytics, Dashboard, Reporting
- **Key Scenarios:**
  - Analytics dashboard with charts and metrics
  - Bookings over time trends
  - Revenue by service breakdown
  - Master utilization tracking
  - Bookings by channel analysis
  - Popular booking times heatmap
  - Client retention metrics
  - Admin and master dashboards
  - Mobile responsiveness
  - Performance with large datasets

**Critical Test Cases:**
- TC-ANALYTICS-001: View Analytics Dashboard
- TC-ANALYTICS-004: Master Utilization Report
- TC-DASH-001: Admin Home Dashboard
- TC-DASH-002: Master Dashboard - My Day View

---

## Test Execution Checklist

### Pre-Testing Setup
- [ ] Backend running on port 8080
- [ ] Frontend running on port 3033
- [ ] PostgreSQL database initialized
- [ ] Redis cache available
- [ ] WhatsApp Business API configured (for integration tests)
- [ ] OpenAI API key configured (for AI tests)
- [ ] Test data seeded

### Phase-by-Phase Execution
- [ ] **Phase 1:** Authentication & Salon Setup (16 + 25 tests) - ~4 hours
- [ ] **Phase 2:** Calendar & Booking (28 + 21 tests) - ~5 hours
- [ ] **Phase 3:** AI & Communication (25 tests) - ~5 hours
- [ ] **Phase 4:** Notifications (24 tests) - ~3 hours
- [ ] **Phase 5:** Analytics & Dashboard (23 tests) - ~3 hours

**Total Estimated Time:** 20-25 hours

---

## Priority-Based Execution

### Critical Priority (47 tests) - Run First
Essential for MVP launch, blocking issues

### High Priority (54 tests) - Run Second
Important workflows, user-facing features

### Medium Priority (52 tests) - Run Third
Enhancements, configuration, nice-to-have

### Low Priority (9 tests) - Run Last
Edge cases, optimizations

---

## Test Result Summary Template

| Test Suite | Total | Pass | Fail | Blocked | Coverage % |
|------------|-------|------|------|---------|------------|
| Authentication | 16 | - | - | - | - |
| Salon Management | 25 | - | - | - | - |
| Calendar & Booking | 28 | - | - | - | - |
| Client Management | 21 | - | - | - | - |
| WhatsApp & AI | 25 | - | - | - | - |
| Notifications | 24 | - | - | - | - |
| Analytics | 23 | - | - | - | - |
| **TOTAL** | **162** | **-** | **-** | **-** | **-%** |

---

## File Sizes & Details

| File | Size | Lines | Test Cases |
|------|------|-------|------------|
| README-Test-Cases-Summary.md | 12 KB | ~350 | Summary & Guide |
| US001-US002-Authentication-TestCases.md | 14 KB | ~450 | 16 |
| US003-US004-US005-Salon-Management-TestCases.md | 17 KB | ~550 | 25 |
| US006-US007-US008-Calendar-Booking-TestCases.md | 21 KB | ~700 | 28 |
| US009-Client-Management-TestCases.md | 16 KB | ~550 | 21 |
| US010-US011-WhatsApp-AI-Conversation-TestCases.md | 21 KB | ~700 | 25 |
| US012-US013-US014-Notifications-TestCases.md | 17 KB | ~600 | 24 |
| Analytics-Dashboard-TestCases.md | 13 KB | ~450 | 23 |

**Total Documentation:** ~120 KB, ~4,350 lines

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-15 | Claude Sonnet 4.5 (QA Engineer) | Initial comprehensive test case documentation |

---

## Quick Search

**By Test ID:**
- Authentication: TC-AUTH-001 to TC-AUTH-016
- Salon: TC-SALON-001 to TC-SALON-005
- Master: TC-MASTER-001 to TC-MASTER-006
- Service: TC-SERVICE-001 to TC-SERVICE-010
- Availability: TC-AVAIL-001 to TC-AVAIL-008
- Calendar: TC-CAL-001 to TC-CAL-008
- Booking: TC-BOOK-001 to TC-BOOK-012
- Client: TC-CLIENT-001 to TC-CLIENT-021
- WhatsApp: TC-WA-001 to TC-WA-009
- AI: TC-AI-001 to TC-AI-016
- Notifications: TC-NOTIF-001 to TC-NOTIF-012
- Reminders: TC-REMIND-001 to TC-REMIND-007
- Cancellations: TC-CANCEL-001 to TC-CANCEL-003
- Reschedule: TC-RESCHEDULE-001 to TC-RESCHEDULE-002
- Analytics: TC-ANALYTICS-001 to TC-ANALYTICS-010
- Dashboard: TC-DASH-001 to TC-DASH-005
- Mobile: TC-MOBILE-001 to TC-MOBILE-002
- Performance: TC-PERF-001 to TC-PERF-002

---

**For detailed test cases, open the respective .md file above.**
**For execution guidelines and strategy, see README-Test-Cases-Summary.md**

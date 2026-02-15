# SlotMe E2E Test Cases - Summary

**Project:** SlotMe - AI-Powered Salon Booking Platform
**Version:** 1.0
**Last Updated:** 2026-02-15
**QA Engineer:** Claude Sonnet 4.5
**Status:** Ready for Testing

---

## Overview

This document provides a comprehensive summary of all E2E test cases for the SlotMe application. Test cases are organized by user story and feature area, covering all critical functionality from authentication to AI-powered booking.

---

## Test Case Files

| File | Feature Area | User Stories | Test Cases | Priority Breakdown |
|------|--------------|--------------|------------|-------------------|
| `US001-US002-Authentication-TestCases.md` | Authentication & User Management | US-001, US-002 | 16 | Critical: 6, High: 6, Medium: 3, Low: 1 |
| `US003-US004-US005-Salon-Management-TestCases.md` | Salon, Master & Service Management | US-003, US-004, US-005 | 25 | Critical: 6, High: 9, Medium: 9, Low: 1 |
| `US006-US007-US008-Calendar-Booking-TestCases.md` | Calendar & Appointment Booking | US-006, US-007, US-008 | 28 | Critical: 11, High: 10, Medium: 7, Low: 0 |
| `US009-Client-Management-TestCases.md` | Client Management | US-009, US-015 | 21 | Critical: 4, High: 9, Medium: 7, Low: 1 |
| `US010-US011-WhatsApp-AI-Conversation-TestCases.md` | WhatsApp & AI Engine | US-010, US-011 | 25 | Critical: 11, High: 8, Medium: 6, Low: 1 |
| `US012-US013-US014-Notifications-TestCases.md` | Notifications & Reminders | US-012, US-013, US-014 | 24 | Critical: 7, High: 7, Medium: 8, Low: 2 |
| `Analytics-Dashboard-TestCases.md` | Analytics & Dashboards | Analytics, Dashboard | 23 | Critical: 2, High: 5, Medium: 13, Low: 3 |

**Total Test Cases:** 162
**Total Estimated Testing Time:** 20-25 hours for complete manual execution

---

## Test Coverage by Priority

| Priority | Count | Percentage | Purpose |
|----------|-------|------------|---------|
| **Critical** | 47 | 29% | Core functionality, blocking issues, security, data integrity |
| **High** | 54 | 33% | Important features, user workflows, error handling |
| **Medium** | 52 | 32% | Enhancement features, configuration, reporting |
| **Low** | 9 | 6% | Nice-to-have features, edge cases, optimization |

---

## Feature Coverage Summary

### 1. Authentication & User Management (16 test cases)
- [x] Salon registration and onboarding
- [x] User login/logout
- [x] Password reset flow
- [x] JWT token management and refresh
- [x] Multi-tenant isolation
- [x] Session management
- [x] Mobile login
- [x] Security (SQL injection, rate limiting)

**Critical Paths:**
- TC-AUTH-001: Successful salon registration
- TC-AUTH-003: Successful login
- TC-AUTH-005: Token refresh flow
- TC-AUTH-011: Multi-tenant isolation

---

### 2. Salon, Master & Service Management (25 test cases)
- [x] Salon profile configuration
- [x] Working hours and holidays
- [x] Master/staff CRUD operations
- [x] Master invitation and onboarding
- [x] Service catalog management
- [x] Service categories and pricing
- [x] Master-specific pricing
- [x] Search and filtering

**Critical Paths:**
- TC-MASTER-001: Add new master
- TC-MASTER-002: Master accepts invitation
- TC-SERVICE-001: Add new service
- TC-SALON-002: Configure working hours

---

### 3. Calendar Views & Appointment Booking (28 test cases)
- [x] Availability calculation engine
- [x] Working hours and break time handling
- [x] Buffer time between appointments
- [x] Admin calendar (day/week/month views)
- [x] Master personal calendar
- [x] Appointment creation and booking
- [x] Conflict detection and prevention
- [x] Concurrent booking prevention
- [x] Appointment cancellation
- [x] Appointment rescheduling
- [x] Multi-service bookings
- [x] Walk-in appointments

**Critical Paths:**
- TC-AVAIL-001: Calculate basic availability
- TC-AVAIL-003: Availability with existing appointments
- TC-CAL-001: View day calendar
- TC-BOOK-001: Create appointment successfully
- TC-BOOK-002: Conflict detection
- TC-BOOK-003: Concurrent booking prevention

---

### 4. Client Management (21 test cases)
- [x] Auto-create client profiles
- [x] Client search (name, phone)
- [x] Client profile details
- [x] Visit history tracking
- [x] Client preferences and notes
- [x] Communication history
- [x] Manual client creation
- [x] Client data edit
- [x] Client merge (duplicates)
- [x] GDPR compliance (export, delete)
- [x] CSV import

**Critical Paths:**
- TC-CLIENT-001: Auto-create client on first contact
- TC-CLIENT-005: View client profile details
- TC-CLIENT-013: Export client data (GDPR)
- TC-CLIENT-014: Delete client data (GDPR)

---

### 5. WhatsApp Integration & AI Conversation (25 test cases)
- [x] WhatsApp Business API setup
- [x] Webhook verification and security
- [x] Receive incoming messages
- [x] Send outgoing messages
- [x] Tenant resolution from phone number
- [x] Template message support
- [x] AI greeting and intent recognition
- [x] Complete booking flow via AI
- [x] AI tool calls (check_availability, book_appointment, cancel, reschedule)
- [x] AI conversation context management
- [x] AI escalation to human
- [x] Multi-language support
- [x] FAQ handling

**Critical Paths:**
- TC-WA-001: Configure WhatsApp API
- TC-WA-003: Receive incoming message
- TC-AI-001: AI greeting
- TC-AI-002: AI recognizes booking intent
- TC-AI-003: Complete booking flow
- TC-AI-006: AI tool call - check_availability
- TC-AI-007: AI tool call - book_appointment

---

### 6. Notifications & Reminders (24 test cases)
- [x] Booking confirmations (client & master)
- [x] 24-hour reminders
- [x] 1-hour reminders
- [x] Reminder deduplication
- [x] Skip reminders for cancelled appointments
- [x] Client confirmation via reminder
- [x] Cancellation notifications
- [x] Reschedule notifications
- [x] Master daily schedule summary
- [x] Notification preferences
- [x] Template customization
- [x] Delivery failure handling
- [x] WhatsApp template compliance

**Critical Paths:**
- TC-NOTIF-001: Send booking confirmation
- TC-REMIND-001: Send 24-hour reminder
- TC-CANCEL-001: Notify client when master cancels
- TC-RESCHEDULE-001: Notify both parties on reschedule

---

### 7. Analytics & Dashboards (23 test cases)
- [x] Analytics dashboard overview
- [x] Bookings over time chart
- [x] Revenue by service
- [x] Master utilization report
- [x] Bookings by channel
- [x] Popular booking times heatmap
- [x] Client retention metrics
- [x] Date range filtering
- [x] Report export (PDF/CSV)
- [x] Admin home dashboard
- [x] Master personal dashboard
- [x] Real-time updates
- [x] Mobile responsiveness
- [x] Performance with large datasets

**Critical Paths:**
- TC-ANALYTICS-001: View analytics dashboard
- TC-ANALYTICS-004: Master utilization report
- TC-DASH-001: Admin home dashboard
- TC-DASH-002: Master dashboard

---

## Test Execution Guidelines

### Prerequisites
1. **Environment Setup:**
   - Backend running on port 8080
   - Frontend running on port 3033
   - PostgreSQL database configured
   - Redis cache available
   - WhatsApp Business API credentials (for integration tests)
   - OpenAI API key (for AI conversation tests)

2. **Test Data:**
   - Clean database for each test suite
   - Seed data scripts available in `/backend/src/test/resources/`
   - Test users:
     - Salon Admin: `testsalon@example.com` / `SecurePass123!`
     - Master: `alina@example.com` / `MasterPass123!`

3. **Tools:**
   - Manual testing: Web browser (Chrome recommended), mobile device/emulator
   - Automated testing: Playwright (for E2E automation)
   - API testing: Postman/Insomnia for direct API calls
   - Message testing: WhatsApp Business sandbox or test account

### Test Execution Order

**Phase 1: Foundation (Critical Priority)**
1. Authentication tests (TC-AUTH-001 to TC-AUTH-016)
2. Salon setup (TC-SALON-001 to TC-SALON-004)
3. Master management (TC-MASTER-001 to TC-MASTER-006)
4. Service management (TC-SERVICE-001 to TC-SERVICE-010)

**Phase 2: Core Booking Flow (Critical Priority)**
1. Availability calculation (TC-AVAIL-001 to TC-AVAIL-008)
2. Calendar views (TC-CAL-001 to TC-CAL-008)
3. Appointment booking (TC-BOOK-001 to TC-BOOK-012)
4. Client management (TC-CLIENT-001 to TC-CLIENT-021)

**Phase 3: AI & Communication (Critical Priority)**
1. WhatsApp integration (TC-WA-001 to TC-WA-009)
2. AI conversation engine (TC-AI-001 to TC-AI-016)
3. End-to-end booking via AI

**Phase 4: Notifications (High Priority)**
1. Booking confirmations (TC-NOTIF-001 to TC-NOTIF-007)
2. Appointment reminders (TC-REMIND-001 to TC-REMIND-007)
3. Cancellation/reschedule notifications (TC-CANCEL-001 to TC-RESCHEDULE-002)

**Phase 5: Analytics & Polish (Medium/Low Priority)**
1. Analytics dashboard (TC-ANALYTICS-001 to TC-ANALYTICS-010)
2. Dashboard views (TC-DASH-001 to TC-DASH-005)
3. Mobile responsiveness (TC-MOBILE-001 to TC-MOBILE-002)
4. Performance tests (TC-PERF-001 to TC-PERF-002)

### Test Result Tracking

Use the following template for tracking results:

| Test Case ID | Description | Status | Tester | Date | Notes |
|--------------|-------------|--------|--------|------|-------|
| TC-AUTH-001 | Successful Registration | PASS | Name | 2026-02-15 | - |
| TC-AUTH-002 | Registration Validation | FAIL | Name | 2026-02-15 | Email validation not working |

**Status Values:**
- PASS: Test passed, all expected results met
- FAIL: Test failed, issue found
- BLOCKED: Cannot execute due to dependency
- SKIP: Not applicable or deferred
- IN PROGRESS: Currently being tested

---

## Known Limitations & Test Exclusions

### Out of Scope for E2E Manual Testing
1. **Performance testing** under extreme load (>1000 concurrent users)
2. **Security penetration testing** (requires specialized tools)
3. **Database integrity testing** at low level (unit test responsibility)
4. **Third-party API reliability** (WhatsApp/OpenAI API downtime scenarios)
5. **Payment processing** (not yet implemented in MVP)

### Requires Mocking for Automated Tests
1. WhatsApp webhook delivery
2. OpenAI API responses
3. Time-dependent scheduler jobs
4. Email delivery

### Browser Compatibility
- **Primary:** Chrome (latest)
- **Secondary:** Safari (iOS), Firefox
- **Mobile:** Chrome on Android, Safari on iOS

---

## Bug Reporting Template

When bugs are found during testing, use this template:

```markdown
### Bug Report: [Brief Description]

**Test Case ID:** TC-XXX-XXX
**Severity:** Critical / High / Medium / Low
**Environment:** Production / Staging / Local
**Browser/Device:** Chrome 120 / iPhone 14 Safari

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach screenshots if applicable]

**Logs:**
[Backend logs, browser console errors]

**Additional Notes:**
[Any other relevant information]
```

---

## Regression Testing

After any code changes, run the **Regression Test Suite** (all Critical priority tests):
- Total: 47 critical test cases
- Estimated time: 6-8 hours
- Focus areas: Authentication, booking flow, AI conversation, multi-tenancy

---

## Automated Test Coverage

The following test cases are good candidates for Playwright automation:

**High-Priority Automation:**
- Authentication flow (login, logout, token refresh)
- Complete booking flow (create, view, cancel, reschedule)
- Calendar navigation and filtering
- Client search and profile viewing
- Salon/master/service CRUD operations

**Medium-Priority Automation:**
- Analytics dashboard rendering
- Notification delivery verification
- Multi-tenant isolation checks

**Not Suitable for Automation:**
- WhatsApp message delivery (requires live API)
- AI conversation quality (requires human judgment)
- Mobile responsiveness (manual testing preferred)

---

## Contact & Support

**QA Engineer:** Claude Sonnet 4.5
**Project Lead:** [Team Lead Name]
**Repository:** [GitHub/GitLab URL]

For questions about test cases or to report issues:
- Create GitHub issue with label `qa` or `test-case`
- Slack channel: #slotme-qa
- Email: qa-team@slotme.com

---

## Appendix: Test Data Requirements

### Minimum Test Data for Full Suite
- **Tenants:** 2 (for multi-tenant isolation tests)
- **Masters per tenant:** 3-5
- **Services per tenant:** 10-15 across 3-4 categories
- **Clients per tenant:** 20-30
- **Appointments per tenant:** 50-100 (mix of past, today, future)
- **Conversations:** 10-15 (various stages)

### Data Seeding Scripts
Location: `/backend/src/test/resources/test-data/`
- `seed-tenants.sql`
- `seed-masters.sql`
- `seed-services.sql`
- `seed-clients.sql`
- `seed-appointments.sql`

Run: `npm run seed:test-data` (from backend directory)

---

**End of Test Cases Summary**
**Version 1.0 - Ready for Testing Phase**

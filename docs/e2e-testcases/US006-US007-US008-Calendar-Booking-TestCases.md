# E2E Test Cases: Calendar Views & Appointment Booking

**Feature:** US-006 Availability Calculation, US-007 Admin Calendar View, US-008 Appointment Booking Engine
**Version:** 1.0
**Last Updated:** 2026-02-15
**Status:** Ready for Testing

---

## AVAILABILITY CALCULATION (US-006)

### Test Case TC-AVAIL-001: Calculate Basic Availability

**Priority:** Critical
**User Story:** US-006

**Description:** Verify that system correctly calculates available time slots based on working hours

**Preconditions:**
- Salon working hours: Mon-Fri 09:00-18:00
- Master "Alina" working hours: Mon-Fri 09:00-18:00
- Service "Haircut" duration: 60 minutes
- No existing appointments
- Slot granularity: 15 minutes

**Test Steps:**
1. Make API request: `GET /api/v1/salons/{salonId}/available-slots`
   - Parameters: `masterId={alinaId}`, `serviceId={haircutId}`, `date=2026-03-01`
2. Review returned time slots

**Expected Results:**
- Available slots are returned from 09:00 to 17:00 (last slot for 60-min service)
- Slots are in 15-minute increments: 09:00, 09:15, 09:30, 09:45, 10:00, etc.
- Each slot shows duration: 60 minutes
- No slots outside working hours
- API response time < 500ms

---

### Test Case TC-AVAIL-002: Availability with Lunch Break

**Priority:** High
**User Story:** US-006

**Description:** Verify that lunch breaks are excluded from availability

**Preconditions:**
- Master "Alina" working hours: 09:00-18:00
- Lunch break: 13:00-14:00
- Service "Haircut": 60 minutes

**Test Steps:**
1. Request available slots for a specific date
2. Check slots around lunch time

**Expected Results:**
- No slots from 13:00-14:00
- Slot at 12:00 is available (finishes at 13:00, before lunch)
- Slot at 14:00 is available (starts after lunch)
- No slot at 12:30 or 13:30 (would overlap with lunch)

---

### Test Case TC-AVAIL-003: Availability with Existing Appointments

**Priority:** Critical
**User Story:** US-006

**Description:** Verify that booked time slots are excluded from availability

**Preconditions:**
- Master "Alina" has appointment: 10:00-11:00 (Haircut)
- Master "Alina" has appointment: 14:00-16:00 (Hair Coloring)

**Test Steps:**
1. Request available slots for the same date
2. Review returned slots

**Expected Results:**
- Slot 10:00 is NOT available
- Slots 09:00, 09:15, 09:30, 09:45 ARE available
- Slots 11:00, 11:15, 11:30 ARE available
- Slots 14:00, 14:15, 14:30, 15:00 are NOT available
- Slot 16:00 and after ARE available
- Booked times are completely excluded

---

### Test Case TC-AVAIL-004: Availability with Buffer Time

**Priority:** High
**User Story:** US-006

**Description:** Verify that buffer time after appointments is accounted for

**Preconditions:**
- Service "Hair Coloring" has buffer_minutes: 15
- Existing appointment: 10:00-12:00 (Hair Coloring)

**Test Steps:**
1. Request available slots
2. Check slots after the 12:00 appointment

**Expected Results:**
- Slot 12:00 is NOT available (still in appointment)
- Slot 12:15 is NOT available (buffer time)
- Slot 12:30 IS available (after buffer)
- Buffer time is added after appointment end

---

### Test Case TC-AVAIL-005: Multi-Master Availability

**Priority:** Medium
**User Story:** US-006

**Description:** Verify availability calculation across multiple masters

**Preconditions:**
- Service "Haircut" offered by: Alina, Dasha
- Alina fully booked on 2026-03-01
- Dasha has availability on 2026-03-01

**Test Steps:**
1. Request available slots for "Haircut" without specifying master
   OR request with multiple masters
2. Review results

**Expected Results:**
- Available slots from Dasha are returned
- Each slot indicates which master is available
- Client can choose from available masters
- If filtering by specific master (Alina), no slots returned
- Response indicates "No availability with Alina, but Dasha is available"

---

### Test Case TC-AVAIL-006: Availability on Salon Closure Day

**Priority:** High
**User Story:** US-006

**Description:** Verify that no slots are available on salon closure/holiday

**Preconditions:**
- Salon has closure date: 2026-12-25 (Christmas)
- Masters have normal working hours configured

**Test Steps:**
1. Request available slots for 2026-12-25

**Expected Results:**
- No slots are returned
- API response message: "Salon is closed on this date"
- Status code: 200 with empty array OR specific error code

---

### Test Case TC-AVAIL-007: Long Service Fitting in Working Hours

**Priority:** High
**User Story:** US-006

**Description:** Verify that long-duration services only show slots where they completely fit

**Preconditions:**
- Master working hours: 09:00-18:00
- Service "Full Day Spa Package": 480 minutes (8 hours)
- No lunch break configured

**Test Steps:**
1. Request available slots for this service

**Expected Results:**
- Only slot at 09:00 is available (finishes at 17:00, within working hours)
- No slots after 09:00 are offered (would exceed 18:00 end time)
- Slot 10:00 is NOT available (would finish at 18:00, exactly at boundary or exceed)

---

## ADMIN CALENDAR VIEW (US-007)

### Test Case TC-CAL-001: View Day Calendar for All Masters

**Priority:** Critical
**User Story:** US-007

**Description:** Verify that admin can view combined day calendar for all masters

**Preconditions:**
- User is logged in as SALON_ADMIN
- At least 3 masters exist (Alina, Dasha, Maria)
- Multiple appointments exist across masters

**Test Steps:**
1. Navigate to Calendar page (`/admin/calendar`)
2. Select "Day View"
3. Select date: Today
4. Observe the calendar layout

**Expected Results:**
- Calendar displays with master columns (horizontal layout)
- Time slots on vertical axis (09:00 - 18:00)
- Each master's column shows their appointments as colored blocks
- Appointments display: Client name, Service, Time
- Color coding by status (confirmed=green, pending=yellow, cancelled=red)
- Empty slots are visibly available
- Current time indicator shows (if viewing today)
- Layout is clean and readable

---

### Test Case TC-CAL-002: View Week Calendar

**Priority:** High
**User Story:** US-007

**Description:** Verify week view displays appointments across multiple days

**Preconditions:**
- User is logged in as SALON_ADMIN
- Appointments exist across the week

**Test Steps:**
1. Navigate to Calendar
2. Select "Week View"
3. Observe the layout

**Expected Results:**
- Calendar shows Mon-Sun columns
- Each day shows appointments for all masters (grouped or color-coded)
- Appointment count per day is visible
- Utilization percentage per day is shown
- User can click a day to drill down to day view
- Week navigation (previous/next) works

---

### Test Case TC-CAL-003: View Month Calendar Heatmap

**Priority:** Medium
**User Story:** US-007

**Description:** Verify month view shows overall salon utilization

**Preconditions:**
- User is logged in as SALON_ADMIN
- Appointments exist across the month

**Test Steps:**
1. Navigate to Calendar
2. Select "Month View"
3. Observe the heatmap

**Expected Results:**
- Calendar grid shows full month
- Each day is color-coded by utilization:
  - Dark green: >80% booked
  - Light green: 50-80% booked
  - Yellow: 30-50% booked
  - Red/Light: <30% booked
- Hover over a day shows appointment count
- Click a day to drill down to day view

---

### Test Case TC-CAL-004: Filter Calendar by Master

**Priority:** High
**User Story:** US-007

**Description:** Verify that admin can filter calendar to show specific master(s)

**Preconditions:**
- Multiple masters exist
- Calendar is in Day View

**Test Steps:**
1. At Calendar page, use master filter
2. Select "Alina Petrova" only
3. Observe calendar
4. Select multiple masters: "Alina" and "Dasha"
5. Observe calendar
6. Deselect all, observe

**Expected Results:**
- When "Alina" selected: Only Alina's column/appointments shown
- When "Alina" and "Dasha" selected: Only these two are shown
- When none selected: All masters shown (default)
- Filter selection persists when switching views (day/week)
- Filter updates immediately without page reload

---

### Test Case TC-CAL-005: Create Appointment from Calendar (Admin)

**Priority:** Critical
**User Story:** US-007

**Description:** Verify that admin can create appointment by clicking empty slot

**Preconditions:**
- User is logged in as SALON_ADMIN
- Calendar is in Day View
- Client "Katya Ivanova" exists in database

**Test Steps:**
1. Navigate to Calendar
2. Click on an empty slot in Alina's column at 10:00
3. Appointment creation dialog opens
4. Pre-filled data:
   - Master: Alina Petrova
   - Date: Selected date
   - Time: 10:00
5. Fill in remaining fields:
   - Client: Search and select "Katya Ivanova"
   - Service: "Haircut & Styling"
6. Click "Create Appointment"

**Expected Results:**
- Dialog opens instantly
- Pre-filled data is correct
- Client search works (autocomplete)
- Service dropdown shows only services Alina offers
- Available time slots respect conflicts
- Appointment is created successfully
- Calendar updates immediately showing new appointment
- Confirmation notification shown
- Client receives booking confirmation (if notifications enabled)
- Master receives notification

---

### Test Case TC-CAL-006: View Appointment Details from Calendar

**Priority:** High
**User Story:** US-007

**Description:** Verify that admin can click appointment to view details

**Preconditions:**
- Appointment exists: "Katya Ivanova - Haircut with Alina at 10:00"

**Test Steps:**
1. Navigate to Calendar (Day View)
2. Click on the appointment block for Katya at 10:00
3. Appointment detail panel/modal opens

**Expected Results:**
- Detail panel displays:
  - Client name and profile photo (if available)
  - Client phone number (click to call)
  - Service name and duration
  - Master name
  - Date and time
  - Price
  - Status (Confirmed/Pending/Cancelled)
  - Client notes or visit history
  - Actions: Reschedule, Cancel, Mark as Completed, Add Note
- All information is accurate
- Panel/modal is responsive

---

### Test Case TC-CAL-007: Reschedule Appointment via Drag-and-Drop (Desktop)

**Priority:** Medium
**User Story:** US-007

**Description:** Verify that admin can reschedule by dragging appointment to new slot

**Preconditions:**
- User is on desktop browser
- Appointment exists at 10:00

**Test Steps:**
1. Navigate to Calendar (Day View)
2. Click and hold on appointment block
3. Drag to new slot (e.g., 14:00)
4. Release mouse
5. Confirmation dialog appears
6. Confirm reschedule

**Expected Results:**
- Drag-and-drop is smooth
- Visual feedback during drag (ghost element)
- Drop zones are highlighted
- Confirmation dialog shows old and new times
- Appointment is rescheduled
- Client receives notification of time change
- Master receives notification
- Calendar updates immediately

---

### Test Case TC-CAL-008: Calendar Real-Time Updates

**Priority:** Medium
**User Story:** US-007

**Description:** Verify that calendar updates when new appointments are created

**Preconditions:**
- Admin has calendar open
- Second admin or client creates new appointment

**Test Steps:**
1. Admin A has calendar open in Day View
2. Admin B (or client via AI) creates a new appointment for today at 15:00
3. Admin A observes calendar

**Expected Results:**
- Calendar auto-refreshes (polling every 30 sec or WebSocket)
- New appointment appears on Admin A's calendar
- No page reload required
- Toast notification (optional): "New appointment added"

---

## APPOINTMENT BOOKING ENGINE (US-008)

### Test Case TC-BOOK-001: Create Appointment Successfully

**Priority:** Critical
**User Story:** US-008

**Description:** Verify that a complete appointment can be created through the booking engine

**Preconditions:**
- User is logged in (admin or master)
- Client "Katya Ivanova" exists
- Master "Alina" is available at 10:00 on 2026-03-15
- Service "Haircut" exists

**Test Steps:**
1. Navigate to Calendar or use "New Appointment" button
2. Click "Create Appointment"
3. Fill in booking form:
   - Client: "Katya Ivanova"
   - Master: "Alina Petrova"
   - Service: "Haircut & Styling"
   - Date: "2026-03-15"
   - Time: "10:00"
4. Click "Book Appointment"

**Expected Results:**
- Appointment is created with status "Confirmed"
- Database record created with:
  - tenant_id (correct isolation)
  - client_id, master_id, service_id
  - start_time, end_time (10:00 - 11:00)
  - price from service
  - status: CONFIRMED
- Calendar is updated immediately
- Confirmation sent to client via their preferred channel
- Master receives notification
- Appointment history record created
- Success message: "Appointment booked successfully"

---

### Test Case TC-BOOK-002: Conflict Detection - Same Master, Overlapping Time

**Priority:** Critical
**User Story:** US-008

**Description:** Verify that system prevents double-booking of the same master

**Preconditions:**
- Master "Alina" has appointment: 10:00-11:00
- User attempts to book another appointment for Alina

**Test Steps:**
1. Attempt to create appointment:
   - Master: "Alina"
   - Date: Same as existing appointment
   - Time: "10:30" (overlaps with 10:00-11:00)
   - Service: "Manicure" (45 min, ends at 11:15)
2. Click "Book Appointment"

**Expected Results:**
- Booking FAILS
- Error message: "SLOT_CONFLICT: This time is already booked"
- Alternative slots are suggested:
  - "Alina is available at 11:00, 11:15, 11:30..."
  - OR "Dasha is available at 10:30 for Manicure"
- Database is NOT updated (no appointment created)
- Calendar shows conflict visually (if attempted via calendar)

---

### Test Case TC-BOOK-003: Concurrent Booking Prevention

**Priority:** Critical
**User Story:** US-008

**Description:** Verify that two users cannot book the same slot simultaneously

**Preconditions:**
- Master "Alina" has one free slot at 14:00
- Two users (Admin A and Client B) attempt to book simultaneously

**Test Steps:**
1. Admin A starts booking process:
   - Selects Alina, 2026-03-15, 14:00
   - Keeps form open (not yet submitted)
2. Client B (via AI) completes booking:
   - Requests Alina, same date, 14:00
   - AI confirms booking
3. Admin A submits form

**Expected Results:**
- Client B's booking succeeds (first to submit)
- Admin A's booking fails with conflict error
- Database-level advisory lock prevents race condition
- Only ONE appointment is created
- Admin A sees error: "This slot was just booked. Please select another time."
- Alternative slots are offered to Admin A

---

### Test Case TC-BOOK-004: Cancel Appointment

**Priority:** Critical
**User Story:** US-008

**Description:** Verify that appointment can be cancelled and slot is freed

**Preconditions:**
- Appointment exists: "Katya - Haircut with Alina at 10:00 on 2026-03-15"
- Appointment status is CONFIRMED

**Test Steps:**
1. Navigate to appointment details (via calendar or appointments list)
2. Click "Cancel Appointment"
3. Enter cancellation reason (optional): "Client requested"
4. Confirm cancellation

**Expected Results:**
- Appointment status changes to "CANCELLED"
- Slot at 10:00 becomes available again for booking
- Client receives cancellation notification
- Master receives cancellation notification
- Admin activity feed shows cancellation
- Appointment history record created:
  - Action: "Cancelled"
  - Timestamp
  - Cancelled by: Admin/Client/Master
  - Reason: "Client requested"
- Cancellation appears in analytics

---

### Test Case TC-BOOK-005: Reschedule Appointment

**Priority:** Critical
**User Story:** US-008

**Description:** Verify that appointment can be rescheduled to a new time

**Preconditions:**
- Appointment exists: "Katya - Haircut with Alina at 10:00 on 2026-03-15"
- New slot is available: 14:00 on same date

**Test Steps:**
1. Open appointment details
2. Click "Reschedule"
3. Select new date/time:
   - Keep same master: Alina
   - Keep same service: Haircut
   - New time: 14:00
4. Confirm reschedule

**Expected Results:**
- OLD slot (10:00) is freed and becomes available
- NEW slot (14:00) is booked
- Appointment is updated (not deleted and recreated):
  - start_time: 14:00
  - end_time: 15:00
- Client receives reschedule notification with new time
- Master receives notification
- Appointment history shows:
  - Action: "Rescheduled"
  - Old time: 10:00
  - New time: 14:00
- Calendar updates immediately

---

### Test Case TC-BOOK-006: Appointment Status Transitions

**Priority:** High
**User Story:** US-008

**Description:** Verify all appointment status transitions work correctly

**Preconditions:**
- Appointment exists with status CONFIRMED

**Test Steps:**
1. Test status transitions:
   - CONFIRMED → IN_PROGRESS (when appointment starts)
   - IN_PROGRESS → COMPLETED (when service is finished)
   - CONFIRMED → CANCELLED (client cancels)
   - CONFIRMED → NO_SHOW (client doesn't arrive)
2. Test invalid transitions:
   - COMPLETED → CONFIRMED (should fail)
   - CANCELLED → IN_PROGRESS (should fail)

**Expected Results:**
- Valid transitions succeed
- Invalid transitions are rejected with error
- Each transition creates history record
- Status is properly reflected in calendar
- Analytics track each status
- Notifications sent on relevant transitions

---

### Test Case TC-BOOK-007: Create Walk-In Appointment

**Priority:** Medium
**User Story:** US-008

**Description:** Verify that admin/master can create immediate walk-in appointment

**Preconditions:**
- User is logged in (admin or master)
- Current time is 10:15
- Master "Alina" is available now

**Test Steps:**
1. Click "Add Walk-In" or "Quick Book"
2. Select:
   - Client: Create new or select existing
   - Master: Alina
   - Service: Haircut
   - Time: NOW (auto-filled with current time)
3. Confirm

**Expected Results:**
- Appointment is created immediately
- Start time is current time (e.g., 10:15)
- Status is "IN_PROGRESS" or "CONFIRMED"
- Walk-in appointments are marked with indicator
- Analytics track walk-in vs. booked appointments
- Client record is created/updated

---

### Test Case TC-BOOK-008: Book Multi-Service Appointment

**Priority:** Medium
**User Story:** US-008

**Description:** Verify that client can book multiple services in one appointment

**Preconditions:**
- Services exist: "Haircut" (60 min), "Hair Coloring" (120 min)
- Master "Alina" offers both services
- Consecutive slots are available

**Test Steps:**
1. Create new appointment
2. Select client, master, date
3. Add multiple services:
   - Service 1: Haircut (10:00 - 11:00)
   - Service 2: Hair Coloring (11:00 - 13:00)
4. Confirm booking

**Expected Results:**
- Single appointment created with multiple services
- Total duration: 180 minutes (3 hours)
- Time block: 10:00 - 13:00
- Total price: $40 + $80 = $120
- Calendar shows one continuous block labeled with both services
- Confirmation includes both services
- Buffer time (if configured) is added after last service

---

## Edge Cases and Error Scenarios

### TC-BOOK-009: Book Outside Working Hours

**Priority:** High
**Description:** Verify that booking outside working hours is prevented

**Test Steps:**
1. Attempt to create appointment at 20:00 (after salon closes at 18:00)

**Expected Results:**
- Error: "Selected time is outside working hours"
- Booking is not allowed

---

### TC-BOOK-010: Book on Master's Day Off

**Priority:** High
**Description:** Verify that master's day off is respected

**Test Steps:**
1. Master "Alina" has Sunday off
2. Attempt to book Alina for Sunday

**Expected Results:**
- Error: "Master is not available on this day"
- Alternative masters suggested

---

### TC-BOOK-011: Minimum Advance Booking Time

**Priority:** Medium
**Description:** Verify minimum advance booking rule is enforced

**Test Steps:**
1. Salon requires minimum 2 hours advance booking
2. Current time is 10:00
3. Attempt to book appointment at 11:00 (1 hour from now)

**Expected Results:**
- Error: "Bookings must be made at least 2 hours in advance"
- Earliest available slot shown is 12:00

---

### TC-BOOK-012: Maximum Future Booking Window

**Priority:** Medium
**Description:** Verify that booking too far in future is prevented

**Test Steps:**
1. Salon allows booking maximum 60 days in advance
2. Attempt to book appointment 90 days from today

**Expected Results:**
- Error: "Bookings can only be made up to 60 days in advance"
- Date picker limits selectable dates

---

### TC-AVAIL-008: Performance Test - Large Availability Query

**Priority:** Medium
**Description:** Verify performance with large date ranges

**Test Steps:**
1. Request available slots for 30-day range
2. Multiple masters (10+)
3. Multiple services (20+)

**Expected Results:**
- Response time < 2 seconds
- Results are paginated or limited to reasonable size
- No performance degradation

---

## Summary

**Total Test Cases:** 28
- Critical Priority: 11
- High Priority: 10
- Medium Priority: 7
- Low Priority: 0

**Coverage:**
- Availability Calculation: 8 test cases
- Admin Calendar View: 8 test cases
- Appointment Booking: 8 test cases
- Edge Cases: 4 test cases

**Estimated Testing Time:** 4-5 hours for full manual execution

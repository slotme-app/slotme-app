# US-008: Appointment Booking Engine - E2E Test Cases

## Story Summary
As a salon owner or system, I want to create, cancel, and reschedule appointments with conflict detection, so that no double-bookings occur and the calendar stays accurate. This includes appointment creation, drag-and-drop reschedule, cancellation, and master calendar view.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- At least one master, service, and client exist
- Availability engine is functional

## Test Cases

### TC-008-01: Create Appointment via Calendar
**Priority:** High
**Description:** Verify an appointment can be created from the admin calendar.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads
2. Click "New Appointment" button -> **Expected:** Booking dialog opens
3. Select a client from the dropdown/search -> **Expected:** Client is selected
4. Select a master -> **Expected:** Master is selected
5. Select a service -> **Expected:** Service is selected, duration is set
6. Select an available date and time -> **Expected:** Slot is selected
7. Click book/create button -> **Expected:** Appointment is created successfully
8. Verify appointment appears on calendar -> **Expected:** New appointment block is visible at the booked time

### TC-008-02: Appointment Status - Confirmed
**Priority:** High
**Description:** Verify a newly created appointment has "confirmed" status.

**Steps:**
1. Create a new appointment via the booking dialog -> **Expected:** Appointment is created
2. Click on the created appointment block -> **Expected:** Detail panel opens
3. Check the status field -> **Expected:** Status shows "confirmed"

### TC-008-03: Cancel Appointment
**Priority:** High
**Description:** Verify an appointment can be cancelled from the detail view.

**Steps:**
1. Navigate to `/admin/calendar` with an existing appointment -> **Expected:** Calendar shows the appointment
2. Click on the appointment block -> **Expected:** Detail panel opens
3. Click "Cancel" button -> **Expected:** Confirmation prompt or status change
4. Confirm cancellation -> **Expected:** Appointment status changes to "cancelled"
5. Verify the slot is freed -> **Expected:** Calendar shows the slot as available or appointment block changes color

### TC-008-04: Reschedule Appointment via Detail Panel
**Priority:** High
**Description:** Verify an appointment can be rescheduled to a new time.

**Steps:**
1. Navigate to `/admin/calendar` with an existing appointment -> **Expected:** Calendar shows the appointment
2. Click on the appointment block -> **Expected:** Detail panel opens
3. Click "Reschedule" button -> **Expected:** Reschedule UI appears with available slots
4. Select a new date/time -> **Expected:** New slot is selected
5. Confirm the reschedule -> **Expected:** Appointment moves to new time
6. Verify old slot is freed -> **Expected:** Old time slot is now available
7. Verify new slot is booked -> **Expected:** Appointment block appears at new time

### TC-008-05: Drag-and-Drop Reschedule (Desktop)
**Priority:** Medium
**Description:** Verify an appointment can be rescheduled by dragging it on the calendar.

**Steps:**
1. Navigate to `/admin/calendar` in day view with an existing appointment -> **Expected:** Calendar renders with draggable appointment blocks
2. Drag an appointment block to a different time slot -> **Expected:** Appointment is visually moved
3. Confirm the reschedule if prompted -> **Expected:** Appointment time is updated
4. Reload the page -> **Expected:** Appointment is at the new time

### TC-008-06: Appointment Color Coding by Status
**Priority:** Medium
**Description:** Verify appointments are color-coded by status.

**Steps:**
1. Navigate to `/admin/calendar` with appointments of different statuses -> **Expected:** Calendar renders
2. Check confirmed appointment -> **Expected:** Displayed in one color (e.g., blue or green)
3. Check cancelled appointment (if visible) -> **Expected:** Displayed in a different color (e.g., gray or red)
4. Check completed appointment -> **Expected:** Displayed in another distinct color

### TC-008-07: Master Calendar View
**Priority:** High
**Description:** Verify the master's personal calendar view at `/master` route.

**Steps:**
1. Log in as a master user -> **Expected:** Master dashboard loads
2. Navigate to the calendar section -> **Expected:** Personal day/week view is visible
3. Check for today's appointments -> **Expected:** Master's own appointments are displayed
4. Check that other masters' appointments are NOT shown -> **Expected:** Only personal appointments visible

### TC-008-08: Master Block Time Off
**Priority:** Medium
**Description:** Verify a master can block time off from their calendar.

**Steps:**
1. Log in as a master user -> **Expected:** Master dashboard loads
2. Navigate to calendar -> **Expected:** Calendar view loads
3. Find "Block Time" or time-off action -> **Expected:** Block time option is available
4. Select a time range to block -> **Expected:** Time range selector works
5. Confirm the block -> **Expected:** Time block is created and shown on calendar
6. Verify blocked time is not bookable -> **Expected:** Blocked time slots are excluded from availability

### TC-008-09: Appointment Detail Panel Information
**Priority:** High
**Description:** Verify the appointment detail panel shows all relevant information.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar loads with appointments
2. Click on an appointment block -> **Expected:** Detail panel/dialog opens
3. Check for client name -> **Expected:** Client name is displayed
4. Check for service name and duration -> **Expected:** Service details are visible
5. Check for master name -> **Expected:** Master name is displayed
6. Check for date and time -> **Expected:** Appointment date and time are shown
7. Check for status -> **Expected:** Current status is displayed
8. Check for action buttons -> **Expected:** Cancel, Reschedule, and status update options are available

## Edge Cases

### EC-008-01: Conflict Detection - Double Booking Prevention
**Description:** Verify the system prevents booking the same slot twice.

**Steps:**
1. Create an appointment for a master at 10:00 AM -> **Expected:** Appointment created successfully
2. Attempt to create another appointment for the same master at 10:00 AM -> **Expected:** Error or the slot is not available in the booking dialog
3. Verify only one appointment exists at that time -> **Expected:** No double booking

### EC-008-02: Reschedule to Conflicting Time
**Description:** Verify rescheduling fails if the new time conflicts with another appointment.

**Steps:**
1. Have two appointments: Master A at 10:00 and 14:00 -> **Expected:** Both exist on calendar
2. Try to reschedule the 14:00 appointment to 10:00 -> **Expected:** Conflict detected, error message shown

### EC-008-03: Cancel and Rebook Same Slot
**Description:** Verify a cancelled appointment's slot becomes available for rebooking.

**Steps:**
1. Cancel an appointment at 10:00 AM -> **Expected:** Appointment is cancelled
2. Open booking dialog -> **Expected:** Dialog opens
3. Check availability for the same master at 10:00 AM -> **Expected:** Slot is now available
4. Book a new appointment at 10:00 AM -> **Expected:** New appointment is created successfully

### EC-008-04: Appointment Status Transitions
**Description:** Verify appointments can transition through valid statuses.

**Steps:**
1. Create a new appointment (status: confirmed) -> **Expected:** Status is "confirmed"
2. Mark as completed -> **Expected:** Status changes to "completed"
3. Verify completed appointments cannot be cancelled -> **Expected:** Cancel button is disabled or hidden for completed appointments

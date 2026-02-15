# US-006: Availability Calculation - E2E Test Cases

## Story Summary
As a system, I want to calculate real-time availability for each master, so that only valid, conflict-free slots are offered to clients. While the core engine is backend, the frontend consumes availability data in the calendar and booking flows.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- At least one master with working hours and services configured
- Availability API is functional

## Test Cases

### TC-006-01: Display Master Availability on Calendar
**Priority:** High
**Description:** Verify the admin calendar shows available and booked time slots for masters.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads
2. Check the calendar renders with time slots -> **Expected:** FullCalendar component (`.fc`) is visible
3. Verify master columns or rows are present -> **Expected:** Master names appear as column headers or filter options
4. Check for time slot display -> **Expected:** Working hours are shown as available, outside hours are grayed out or hidden

### TC-006-02: Available Slots in Booking Dialog
**Priority:** High
**Description:** Verify the booking dialog shows only valid available slots.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads
2. Click "New Appointment" button -> **Expected:** Booking dialog opens
3. Select a master -> **Expected:** Available time slots update for selected master
4. Select a service -> **Expected:** Available slots reflect the service duration requirements
5. Check slot options -> **Expected:** Only non-conflicting slots within working hours are offered

### TC-006-03: Availability Reflects Working Hours
**Priority:** High
**Description:** Verify that availability respects master working hours boundaries.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads
2. Check day view for a master with known working hours (e.g., 9:00-18:00) -> **Expected:** Slots before 9:00 and after 18:00 are not bookable
3. Check for lunch break time -> **Expected:** Break periods are shown as unavailable

### TC-006-04: Availability Excludes Booked Slots
**Priority:** High
**Description:** Verify that already-booked time slots are excluded from availability.

**Steps:**
1. Create a booking for a master at a specific time -> **Expected:** Booking is created
2. Navigate to `/admin/calendar` -> **Expected:** Calendar shows the booked slot
3. Open "New Appointment" for the same master -> **Expected:** The booked time slot is not available for selection
4. Check the calendar view -> **Expected:** Booked slot is shown as occupied (colored block)

### TC-006-05: Master Availability Page
**Priority:** Medium
**Description:** Verify the master availability/schedule page under admin settings.

**Steps:**
1. Navigate to `/admin/availability` or the availability section in master detail -> **Expected:** Availability configuration page loads
2. Check for weekly schedule view -> **Expected:** Days of the week with time ranges are shown
3. Check for ability to edit availability rules -> **Expected:** Time inputs or schedule editor is interactive

## Edge Cases

### EC-006-01: No Available Slots
**Description:** Verify the UI handles a fully booked day gracefully.

**Steps:**
1. Navigate to booking dialog for a date where master is fully booked -> **Expected:** Dialog shows "No available slots" or similar message
2. User is offered alternative dates or masters -> **Expected:** Helpful suggestions are provided

### EC-006-02: Service Duration Longer Than Remaining Availability
**Description:** Verify a service that requires 120 minutes is not offered when only 60 minutes remain.

**Steps:**
1. Open booking dialog -> **Expected:** Dialog opens
2. Select a 120-minute service -> **Expected:** Slots that don't have 120 contiguous minutes are excluded
3. Verify only valid start times are shown -> **Expected:** Each offered slot has enough time for the full service duration

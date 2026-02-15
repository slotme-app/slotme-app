# US-007: Admin Calendar View - E2E Test Cases

## Story Summary
As a salon owner, I want to see a combined calendar for all masters, so that I can oversee the entire salon's schedule at a glance. This includes day/week/month views, appointment creation from the calendar, and appointment detail panels.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- At least one master and service exist
- FullCalendar library is integrated

## Test Cases

### TC-007-01: Display Calendar Page with Heading
**Priority:** High
**Description:** Verify the calendar page loads with the heading and core elements.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads
2. Check for "Calendar" heading -> **Expected:** Heading is visible
3. Check for "New Appointment" button -> **Expected:** Button is visible

### TC-007-02: Render FullCalendar Component
**Priority:** High
**Description:** Verify the FullCalendar component renders on the page.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads
2. Check for FullCalendar container (`.fc` class) -> **Expected:** Calendar component is visible and rendered

### TC-007-03: Display Calendar Navigation Controls
**Priority:** High
**Description:** Verify the calendar toolbar has navigation buttons.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads
2. Check for toolbar (`.fc-toolbar`) -> **Expected:** Toolbar is visible
3. Check for "Today" button -> **Expected:** Today button is visible
4. Check for previous/next navigation buttons -> **Expected:** Previous and next buttons are visible
5. Check for current date/period display -> **Expected:** Current date or date range is shown

### TC-007-04: Switch Between Day and Week Views
**Priority:** High
**Description:** Verify the calendar can switch between day view and week view.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads
2. Find and click the day view button (`.fc-timeGridDay-button`) -> **Expected:** Calendar switches to day view with time grid
3. Verify time grid is visible -> **Expected:** `.fc-timegrid` element is present
4. Find and click the week view button (`.fc-timeGridWeek-button`) -> **Expected:** Calendar switches to week view
5. Verify time grid shows multiple days -> **Expected:** Multiple day columns are visible

### TC-007-05: Switch to Month View
**Priority:** Medium
**Description:** Verify the calendar can switch to month view.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads
2. Find and click the month view button (`.fc-dayGridMonth-button`) -> **Expected:** Calendar switches to month view
3. Verify month grid is displayed -> **Expected:** Calendar shows days in a month grid layout

### TC-007-06: Navigate Between Dates
**Priority:** High
**Description:** Verify navigating forward and backward through dates.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads with today's date
2. Click the "next" navigation button -> **Expected:** Calendar moves to the next day/week/month
3. Click the "previous" navigation button -> **Expected:** Calendar moves back to the current day/week/month
4. Click the "Today" button -> **Expected:** Calendar returns to today's date

### TC-007-07: Open New Appointment Booking Dialog
**Priority:** High
**Description:** Verify the booking dialog opens when clicking "New Appointment".

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads
2. Click "New Appointment" button -> **Expected:** Dialog/modal opens
3. Check for dialog visibility -> **Expected:** Dialog is visible with booking form fields

### TC-007-08: Booking Dialog Fields
**Priority:** High
**Description:** Verify the booking dialog contains all necessary fields.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads
2. Click "New Appointment" button -> **Expected:** Booking dialog opens
3. Check for client selection field -> **Expected:** Client selector/input is visible
4. Check for master selection field -> **Expected:** Master selector is visible
5. Check for service selection field -> **Expected:** Service selector is visible
6. Check for date/time selection -> **Expected:** Date and time inputs are visible
7. Check for submit/book button -> **Expected:** Book/Create button is visible

### TC-007-09: Create Appointment from Dialog
**Priority:** High
**Description:** Verify a new appointment can be created through the booking dialog.

**Steps:**
1. Navigate to `/admin/calendar` -> **Expected:** Calendar page loads
2. Click "New Appointment" -> **Expected:** Dialog opens
3. Select or enter a client -> **Expected:** Client is selected
4. Select a master -> **Expected:** Master is selected
5. Select a service -> **Expected:** Service is selected
6. Select date and available time slot -> **Expected:** Date and time are set
7. Click the book/create button -> **Expected:** Appointment is created, dialog closes
8. Verify appointment appears on calendar -> **Expected:** New appointment block is visible on the calendar

### TC-007-10: Display Appointments on Calendar
**Priority:** High
**Description:** Verify existing appointments are displayed as blocks on the calendar.

**Steps:**
1. Navigate to `/admin/calendar` (with existing appointments) -> **Expected:** Calendar page loads
2. Check for appointment blocks in the calendar -> **Expected:** Colored blocks representing appointments are visible
3. Verify appointment blocks show relevant info -> **Expected:** Service name, client name, or time are displayed on the block

### TC-007-11: View Appointment Details
**Priority:** High
**Description:** Verify clicking an appointment opens a detail view.

**Steps:**
1. Navigate to `/admin/calendar` with existing appointments -> **Expected:** Calendar page loads
2. Click on an appointment block -> **Expected:** Appointment detail panel or popup opens
3. Check for client name -> **Expected:** Client name is visible
4. Check for service and master info -> **Expected:** Service name and master name are visible
5. Check for reschedule and cancel actions -> **Expected:** Reschedule and Cancel buttons/links are visible

## Edge Cases

### EC-007-01: Calendar with No Appointments
**Description:** Verify the calendar handles a day with no appointments.

**Steps:**
1. Navigate to `/admin/calendar` for a date with no bookings -> **Expected:** Calendar shows empty time slots
2. All slots appear as available -> **Expected:** No appointment blocks, just the time grid

### EC-007-02: Calendar Click on Empty Slot
**Description:** Verify clicking an empty time slot on the calendar opens a booking dialog.

**Steps:**
1. Navigate to `/admin/calendar` in day view -> **Expected:** Calendar shows time grid
2. Click on an empty time slot -> **Expected:** Booking dialog opens with the clicked time pre-filled

### EC-007-03: Calendar Responsive Behavior
**Description:** Verify the calendar adapts to different viewport sizes.

**Steps:**
1. Navigate to `/admin/calendar` on mobile viewport -> **Expected:** Calendar renders in a mobile-friendly format
2. Check that "New Appointment" button is visible on mobile -> **Expected:** Button is accessible
3. Check that calendar content is scrollable -> **Expected:** Calendar content can be scrolled vertically

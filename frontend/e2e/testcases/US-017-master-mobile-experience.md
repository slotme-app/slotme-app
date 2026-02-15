# US-017: Master Mobile Experience - E2E Test Cases

## Story Summary
As a master, I want to view my schedule on my phone, so that I can check appointments between clients. This includes optimizing the master mobile view with bottom tab bar, card layouts, and performance optimization.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as a master user (or admin viewing master view)
- Viewport set to mobile size (e.g., iPhone 14: 390x844)
- At least one appointment exists for the master

## Test Cases

### TC-017-01: Master Dashboard Loads on Mobile
**Priority:** High
**Description:** Verify the master dashboard loads correctly on a mobile viewport.

**Steps:**
1. Set viewport to mobile size (390x844) -> **Expected:** Mobile layout active
2. Log in as a master user -> **Expected:** Master dashboard loads
3. Check for "My Day" or default view -> **Expected:** Today's schedule is prominently displayed
4. Check for today's date header -> **Expected:** Current date is shown at the top

### TC-017-02: Mobile Day View - Timeline
**Priority:** High
**Description:** Verify the mobile day view shows appointments in a timeline format.

**Steps:**
1. Navigate to master dashboard on mobile -> **Expected:** My Day view loads
2. Check for vertical timeline -> **Expected:** Timeline view is displayed from work start to work end
3. Check appointment blocks -> **Expected:** Each appointment shows as a block with:
   - Client name
   - Service name
   - Time slot (e.g., "10:00 - 11:00")
4. Check for available slot indicators -> **Expected:** Empty/available time slots are distinguishable from booked ones
5. Verify scrollability -> **Expected:** Timeline is vertically scrollable

### TC-017-03: Next Client Card on Mobile
**Priority:** High
**Description:** Verify the "Next Up" client card is prominently displayed on mobile.

**Steps:**
1. Navigate to master dashboard on mobile with upcoming appointments -> **Expected:** Dashboard loads
2. Check for next client card at the top -> **Expected:** Prominent card with upcoming client info
3. Card shows client name -> **Expected:** Name is visible and readable
4. Card shows service and time -> **Expected:** Service name and appointment time are visible
5. Card shows client notes (if any) -> **Expected:** Notes like "Prefers warm tones" are visible

### TC-017-04: Bottom Tab Bar Navigation
**Priority:** High
**Description:** Verify the mobile bottom tab bar is displayed and functional.

**Steps:**
1. Navigate to master dashboard on mobile -> **Expected:** Dashboard loads
2. Check for bottom tab bar -> **Expected:** Tab bar is visible at the bottom of the screen
3. Check for tab items -> **Expected:** Tabs like My Day, Calendar, Clients, Notifications, Profile are visible
4. Tap "Calendar" tab -> **Expected:** Calendar view loads
5. Tap "Notifications" tab -> **Expected:** Notifications view loads
6. Tap back to first tab -> **Expected:** Returns to My Day view

### TC-017-05: Mobile Calendar - Default Day View
**Priority:** High
**Description:** Verify the mobile calendar defaults to day view.

**Steps:**
1. Navigate to master calendar on mobile -> **Expected:** Calendar loads
2. Check default view -> **Expected:** Day view is shown (not week or month)
3. Check for large touch targets -> **Expected:** Buttons and interactive elements are adequately sized for touch

### TC-017-06: Navigate Between Days on Mobile
**Priority:** Medium
**Description:** Verify day-to-day navigation works on mobile.

**Steps:**
1. Navigate to master calendar on mobile -> **Expected:** Day view loads
2. Swipe left or tap next button -> **Expected:** Calendar moves to next day
3. Swipe right or tap previous button -> **Expected:** Calendar moves to previous day
4. Tap "Today" button -> **Expected:** Calendar returns to today

### TC-017-07: Appointment Detail on Mobile
**Priority:** High
**Description:** Verify tapping an appointment on mobile shows details.

**Steps:**
1. Navigate to master day view with appointments on mobile -> **Expected:** Appointments visible
2. Tap on an appointment block -> **Expected:** Appointment detail view opens
3. Check for client name and phone -> **Expected:** Client info is displayed
4. Check for service details -> **Expected:** Service name, duration, and price are shown
5. Check for action buttons -> **Expected:** Actions like Call, Message are available with adequate touch targets

### TC-017-08: Mobile Performance - Page Load
**Priority:** Medium
**Description:** Verify pages load performantly on mobile.

**Steps:**
1. Navigate to master dashboard on mobile -> **Expected:** Page loads within 3 seconds
2. Navigate to calendar on mobile -> **Expected:** Calendar renders within 3 seconds
3. Navigate between tabs -> **Expected:** Tab switches are smooth and responsive

### TC-017-09: Responsive Layout - No Horizontal Scroll
**Priority:** High
**Description:** Verify there is no horizontal scrolling on mobile viewport.

**Steps:**
1. Navigate to master dashboard on mobile -> **Expected:** Content fits within viewport width
2. Navigate to calendar on mobile -> **Expected:** No horizontal scrollbar
3. Navigate to clients view on mobile -> **Expected:** No horizontal scrollbar

### TC-017-10: Mobile - New Booking Notification Display
**Priority:** Medium
**Description:** Verify new booking/cancellation notifications display correctly on mobile.

**Steps:**
1. Navigate to master dashboard on mobile -> **Expected:** Dashboard loads
2. Trigger a new booking or cancellation -> **Expected:** Notification appears
3. Check notification display -> **Expected:** Notification is readable and does not overflow the mobile viewport

## Edge Cases

### EC-017-01: Mobile Landscape Orientation
**Description:** Verify the master view works in landscape orientation.

**Steps:**
1. Set viewport to landscape mobile (844x390) -> **Expected:** Layout adjusts
2. Navigate to master dashboard -> **Expected:** Content renders without breaking
3. Check for usability -> **Expected:** Main features are accessible, no overlapping elements

### EC-017-02: Very Small Screen (320px width)
**Description:** Verify the app is usable on very small screens.

**Steps:**
1. Set viewport to 320x568 (iPhone SE) -> **Expected:** Layout adjusts
2. Navigate to master dashboard -> **Expected:** Content fits within viewport
3. Check text readability -> **Expected:** Text is readable, not truncated in a way that loses meaning
4. Check button sizes -> **Expected:** Buttons are still tappable

### EC-017-03: Master Day View with Many Appointments
**Description:** Verify the mobile view handles a fully booked day.

**Steps:**
1. Navigate to master day view with 10+ appointments -> **Expected:** All appointments render
2. Scroll through the timeline -> **Expected:** Smooth scrolling, all appointments visible
3. Verify no layout breaking -> **Expected:** Appointment blocks don't overlap or clip incorrectly

### EC-017-04: Pull to Refresh
**Description:** Verify the mobile view supports pull-to-refresh or has a refresh mechanism.

**Steps:**
1. Navigate to master day view on mobile -> **Expected:** Day view loads
2. Pull down or tap refresh -> **Expected:** Data is refreshed, appointments are re-fetched
3. New or changed appointments reflect immediately -> **Expected:** Updated data is displayed

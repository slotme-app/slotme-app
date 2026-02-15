# US-016: End-to-End Booking Flow Verification - E2E Test Cases

## Story Summary
As a QA engineer, I want to verify the complete booking cycle works end-to-end, so that pilot salons have a reliable experience. This includes E2E tests, error states, empty states, loading skeletons, and responsive design polish.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- Full system is operational (backend, database, channels)
- At least one master, service, and client exist

## Test Cases

### TC-016-01: Complete Booking Flow - Login to Appointment
**Priority:** High
**Description:** Verify the full admin flow: login, navigate to calendar, create appointment.

**Steps:**
1. Navigate to `/login` -> **Expected:** Login page loads
2. Log in with valid credentials -> **Expected:** Redirected to `/admin` dashboard
3. Navigate to "Calendar" via sidebar -> **Expected:** Calendar page loads at `/admin/calendar`
4. Click "New Appointment" -> **Expected:** Booking dialog opens
5. Select a client -> **Expected:** Client selected
6. Select a master -> **Expected:** Master selected
7. Select a service -> **Expected:** Service selected
8. Select an available time slot -> **Expected:** Slot selected
9. Click book/create -> **Expected:** Appointment created successfully
10. Verify appointment on calendar -> **Expected:** Appointment block is visible

### TC-016-02: Complete Flow - Create Master, Service, Then Book
**Priority:** High
**Description:** Verify the setup-to-booking flow works end-to-end.

**Steps:**
1. Log in as admin -> **Expected:** Dashboard loads
2. Navigate to `/admin/masters` -> **Expected:** Masters page loads
3. Add a new master with name, email, phone -> **Expected:** Master created
4. Navigate to `/admin/services` -> **Expected:** Services page loads
5. Add a new service with name, duration, price -> **Expected:** Service created
6. Navigate to `/admin/calendar` -> **Expected:** Calendar loads
7. Create an appointment using the new master and service -> **Expected:** Appointment created
8. Verify on calendar -> **Expected:** Appointment is visible

### TC-016-03: Error States on All Pages
**Priority:** High
**Description:** Verify error states display correctly when API calls fail.

**Steps:**
1. Navigate to `/admin/masters` with backend unavailable -> **Expected:** Error state or error message is shown (not blank page)
2. Navigate to `/admin/services` with backend unavailable -> **Expected:** Error state is shown
3. Navigate to `/admin/clients` with backend unavailable -> **Expected:** Error state is shown
4. Navigate to `/admin/calendar` with backend unavailable -> **Expected:** Error state is shown

### TC-016-04: Empty States on All Pages
**Priority:** High
**Description:** Verify empty states are displayed when no data exists.

**Steps:**
1. Navigate to `/admin/masters` (with no masters) -> **Expected:** "No masters yet" or similar empty state with call-to-action
2. Navigate to `/admin/services` (with no services) -> **Expected:** "No services yet" empty state
3. Navigate to `/admin/clients` (with no clients) -> **Expected:** "No clients yet" empty state
4. Navigate to `/admin/channels/conversations` (with no conversations) -> **Expected:** "No conversations yet" empty state

### TC-016-05: Loading Skeletons
**Priority:** Medium
**Description:** Verify loading skeletons appear while data is being fetched.

**Steps:**
1. Navigate to `/admin/masters` -> **Expected:** Loading skeleton or spinner appears briefly before data loads
2. Navigate to `/admin/services` -> **Expected:** Loading state is shown during data fetch
3. Navigate to `/admin/clients` -> **Expected:** Loading state is shown during data fetch
4. Navigate to `/admin/calendar` -> **Expected:** Loading state is shown during data fetch

### TC-016-06: Responsive Design - Admin Dashboard on Tablet
**Priority:** Medium
**Description:** Verify the admin dashboard is usable on tablet-sized viewports.

**Steps:**
1. Set viewport to tablet size (768x1024) -> **Expected:** Layout adjusts
2. Navigate to `/admin` -> **Expected:** Dashboard renders properly
3. Check sidebar behavior -> **Expected:** Sidebar may collapse or become a drawer
4. Navigate through all pages -> **Expected:** All pages are usable and readable

### TC-016-07: Responsive Design - Admin Dashboard on Mobile
**Priority:** High
**Description:** Verify the admin dashboard is usable on mobile-sized viewports.

**Steps:**
1. Set viewport to mobile size (375x667) -> **Expected:** Layout adjusts
2. Navigate to `/admin` -> **Expected:** Dashboard renders in mobile layout
3. Check sidebar is hidden -> **Expected:** Sidebar (aside) is hidden on mobile
4. Check mobile menu toggle -> **Expected:** Toggle menu button is visible
5. Click toggle menu -> **Expected:** Mobile sidebar sheet opens
6. Navigate via mobile sidebar -> **Expected:** Navigation works correctly

### TC-016-08: Mobile Card Layouts
**Priority:** Medium
**Description:** Verify list pages use card layouts on mobile instead of tables.

**Steps:**
1. Set viewport to mobile size -> **Expected:** Mobile layout active
2. Navigate to `/admin/masters` -> **Expected:** Masters heading visible, card layout instead of table
3. Navigate to `/admin/clients` -> **Expected:** Clients heading visible, card layout instead of table

### TC-016-09: Touch-Friendly Button Sizes
**Priority:** Medium
**Description:** Verify buttons are large enough for touch interaction on mobile.

**Steps:**
1. Set viewport to mobile size -> **Expected:** Mobile layout active
2. Navigate to `/admin/services` -> **Expected:** Page loads
3. Check "Add Service" button size -> **Expected:** Button height is at least 36px for adequate touch target

### TC-016-10: Responsive Calendar on Mobile
**Priority:** Medium
**Description:** Verify the calendar page is usable on mobile.

**Steps:**
1. Set viewport to mobile size -> **Expected:** Mobile layout active
2. Navigate to `/admin/calendar` -> **Expected:** Calendar heading visible
3. Check "New Appointment" button -> **Expected:** Button is visible and accessible on mobile
4. Check calendar controls -> **Expected:** Navigation and view buttons are accessible

## Edge Cases

### EC-016-01: Concurrent Booking Attempt
**Description:** Verify no double-bookings when booking the same slot simultaneously.

**Steps:**
1. Open two browser tabs -> **Expected:** Both logged in as admin
2. Both navigate to `/admin/calendar` -> **Expected:** Calendar visible in both tabs
3. Both open "New Appointment" for the same master at the same time -> **Expected:** Both dialogs open
4. Both attempt to book the same slot -> **Expected:** One succeeds, the other gets a conflict error

### EC-016-02: Session Expiry
**Description:** Verify the app handles session expiry gracefully.

**Steps:**
1. Log in and navigate to `/admin` -> **Expected:** Dashboard loads
2. Clear auth tokens manually (or wait for expiry) -> **Expected:** Session expires
3. Try navigating to another page -> **Expected:** Redirected to `/login` with appropriate message

### EC-016-03: Network Error During Booking
**Description:** Verify the app handles network errors during appointment creation.

**Steps:**
1. Open booking dialog on `/admin/calendar` -> **Expected:** Dialog opens
2. Fill in all fields -> **Expected:** Fields populated
3. Disable network/simulate error and click submit -> **Expected:** Clear error message is shown, no partial state

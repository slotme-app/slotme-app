# US-014: Cancellation & Reschedule Notifications - E2E Test Cases

## Story Summary
As a client or master, I want to be notified when an appointment is cancelled or rescheduled, so that I know my schedule has changed. The frontend component is the notification bell and notification panel with real-time polling.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- At least one appointment exists that can be cancelled or rescheduled

## Test Cases

### TC-014-01: Display Notification Bell
**Priority:** High
**Description:** Verify the notification bell icon is displayed in the header.

**Steps:**
1. Navigate to `/admin` -> **Expected:** Dashboard loads
2. Find the notification bell (labeled "Notifications") -> **Expected:** Bell icon is visible in the header area

### TC-014-02: Open Notification Panel
**Priority:** High
**Description:** Verify clicking the notification bell opens a dropdown/panel.

**Steps:**
1. Navigate to `/admin` -> **Expected:** Dashboard loads
2. Click the notification bell -> **Expected:** Notification panel/dropdown opens
3. Check for "Notifications" title -> **Expected:** Panel heading "Notifications" is visible

### TC-014-03: Notification After Appointment Cancellation
**Priority:** High
**Description:** Verify a notification appears after an appointment is cancelled.

**Steps:**
1. Navigate to `/admin/calendar` with an existing appointment -> **Expected:** Calendar loads
2. Click on an appointment -> **Expected:** Detail panel opens
3. Cancel the appointment -> **Expected:** Appointment is cancelled
4. Click the notification bell -> **Expected:** Notification panel opens
5. Check for cancellation notification -> **Expected:** A notification about the cancellation is visible

### TC-014-04: Notification After Appointment Reschedule
**Priority:** High
**Description:** Verify a notification appears after an appointment is rescheduled.

**Steps:**
1. Navigate to `/admin/calendar` with an existing appointment -> **Expected:** Calendar loads
2. Reschedule an appointment to a new time -> **Expected:** Appointment is rescheduled
3. Click the notification bell -> **Expected:** Notification panel opens
4. Check for reschedule notification -> **Expected:** A notification about the reschedule is visible

### TC-014-05: Notification Panel Content
**Priority:** Medium
**Description:** Verify notification entries contain relevant information.

**Steps:**
1. Click the notification bell -> **Expected:** Panel opens with notifications
2. Check a notification entry -> **Expected:** Notification shows event type (new booking, cancellation, etc.)
3. Check for timestamp -> **Expected:** Each notification has a time indicator (e.g., "2 min ago")
4. Check for actionable link -> **Expected:** Clicking the notification navigates to relevant page or appointment

### TC-014-06: Notification Badge/Count
**Priority:** Medium
**Description:** Verify the notification bell shows an unread count badge.

**Steps:**
1. Navigate to `/admin` with new unread notifications -> **Expected:** Dashboard loads
2. Check the notification bell -> **Expected:** A badge with unread count is displayed on the bell icon
3. Open the notification panel -> **Expected:** Panel opens
4. Close the panel -> **Expected:** Badge count may decrease after viewing

### TC-014-07: Empty Notifications State
**Priority:** Low
**Description:** Verify the notification panel handles no notifications gracefully.

**Steps:**
1. Navigate to `/admin` with no notifications -> **Expected:** Dashboard loads
2. Click the notification bell -> **Expected:** Panel opens
3. Check for empty state -> **Expected:** "No notifications" or empty state message is shown

## Edge Cases

### EC-014-01: Multiple Rapid Notifications
**Description:** Verify the notification panel handles multiple notifications arriving quickly.

**Steps:**
1. Trigger multiple events (cancel and create appointments rapidly) -> **Expected:** Actions complete
2. Open the notification panel -> **Expected:** All notifications are listed without duplicates or missing entries

### EC-014-02: Notification Polling
**Description:** Verify notifications update periodically without page refresh.

**Steps:**
1. Have the admin dashboard open -> **Expected:** Dashboard is displayed
2. Trigger an event (e.g., cancel an appointment via API or another browser tab) -> **Expected:** Event occurs
3. Wait for polling interval -> **Expected:** New notification appears on the bell badge without manual page refresh

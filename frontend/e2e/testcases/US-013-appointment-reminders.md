# US-013: Appointment Reminders - E2E Test Cases

## Story Summary
As a client, I want to receive reminders before my appointment, so that I don't forget. The frontend component is the notification settings page where the admin configures which notifications are sent.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- Notification system is configured

## Test Cases

### TC-013-01: Display Notification Settings Page
**Priority:** High
**Description:** Verify the notification settings page loads and shows reminder configuration.

**Steps:**
1. Navigate to the notification settings page (within Settings section) -> **Expected:** Page loads
2. Check for notification preferences section -> **Expected:** Notification configuration options are visible
3. Check for reminder settings -> **Expected:** Options for 24h and 1h reminders are shown

### TC-013-02: Toggle 24-Hour Reminder
**Priority:** High
**Description:** Verify the 24-hour reminder can be enabled or disabled.

**Steps:**
1. Navigate to notification settings -> **Expected:** Settings page loads
2. Find the 24-hour reminder toggle/checkbox -> **Expected:** Toggle is visible
3. Toggle the setting on -> **Expected:** Reminder is enabled
4. Save settings -> **Expected:** Changes are persisted
5. Toggle the setting off -> **Expected:** Reminder is disabled
6. Save settings -> **Expected:** Changes are persisted

### TC-013-03: Toggle 1-Hour Reminder
**Priority:** High
**Description:** Verify the 1-hour reminder can be enabled or disabled.

**Steps:**
1. Navigate to notification settings -> **Expected:** Settings page loads
2. Find the 1-hour reminder toggle/checkbox -> **Expected:** Toggle is visible
3. Toggle the setting on/off -> **Expected:** Reminder state changes
4. Save settings -> **Expected:** Changes are persisted

### TC-013-04: Admin Notification Preferences
**Priority:** Medium
**Description:** Verify the admin can configure their own notification preferences.

**Steps:**
1. Navigate to notification settings -> **Expected:** Settings page loads
2. Check for admin notification options -> **Expected:** Options for new bookings, cancellations, and alerts are visible
3. Check for delivery method options -> **Expected:** Options like push, email, SMS are shown
4. Toggle notification types -> **Expected:** Settings can be changed
5. Save preferences -> **Expected:** Changes are persisted

### TC-013-05: Daily Summary Email Setting
**Priority:** Low
**Description:** Verify the daily summary email can be enabled and configured.

**Steps:**
1. Navigate to notification settings -> **Expected:** Settings page loads
2. Find daily summary setting -> **Expected:** Daily summary toggle is visible
3. Enable daily summary -> **Expected:** Setting is enabled
4. Configure delivery time (if available) -> **Expected:** Time can be set
5. Save settings -> **Expected:** Changes are persisted

## Edge Cases

### EC-013-01: Save Settings Without Changes
**Description:** Verify saving notification settings without changes.

**Steps:**
1. Navigate to notification settings -> **Expected:** Settings page loads
2. Click save without modifying anything -> **Expected:** No error, settings remain unchanged

### EC-013-02: All Notifications Disabled
**Description:** Verify the system handles a state where all notifications are disabled.

**Steps:**
1. Navigate to notification settings -> **Expected:** Settings page loads
2. Disable all reminder and notification options -> **Expected:** All toggles are off
3. Save settings -> **Expected:** Settings saved, possibly with a warning that no notifications will be sent

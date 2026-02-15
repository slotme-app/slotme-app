# US-003: Salon Profile Management - E2E Test Cases

## Story Summary
As a salon owner, I want to configure my salon profile and working hours, so that the system knows my business details and operating schedule. This includes the dashboard layout, admin home page, and settings page.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- Salon already exists in the system

## Test Cases

### TC-003-01: Display Dashboard Layout
**Priority:** High
**Description:** Verify the admin dashboard layout renders with sidebar and header.

**Steps:**
1. Navigate to `/admin` -> **Expected:** Dashboard page loads
2. Check for sidebar (`aside` element) -> **Expected:** Sidebar is visible on desktop
3. Check for header element -> **Expected:** Header is visible with salon name/logo area
4. Check sidebar navigation links -> **Expected:** Links for Home, Calendar, Masters, Services, Clients are visible

### TC-003-02: Dashboard Navigation Items
**Priority:** High
**Description:** Verify all expected navigation items are present in the sidebar.

**Steps:**
1. Navigate to `/admin` -> **Expected:** Dashboard loads
2. Check for "Home" link -> **Expected:** Visible in sidebar
3. Check for "Calendar" link -> **Expected:** Visible in sidebar
4. Check for "Masters" link -> **Expected:** Visible in sidebar
5. Check for "Services" link -> **Expected:** Visible in sidebar
6. Check for "Clients" link -> **Expected:** Visible in sidebar

### TC-003-03: Navigate Between Admin Pages via Sidebar
**Priority:** High
**Description:** Verify clicking sidebar links navigates to the correct pages.

**Steps:**
1. Navigate to `/admin` -> **Expected:** Dashboard loads
2. Click "Masters" link -> **Expected:** URL changes to `/admin/masters`, Masters heading visible
3. Click "Services" link -> **Expected:** URL changes to `/admin/services`, Services heading visible
4. Click "Clients" link -> **Expected:** URL changes to `/admin/clients`, Clients heading visible
5. Click "Calendar" link -> **Expected:** URL changes to `/admin/calendar`, Calendar heading visible
6. Click "Home" link -> **Expected:** URL changes to `/admin`, Home/Dashboard content visible

### TC-003-04: Display Notification Bell
**Priority:** Medium
**Description:** Verify the notification bell is displayed and opens a dropdown.

**Steps:**
1. Navigate to `/admin` -> **Expected:** Dashboard loads
2. Find the notification bell (labeled "Notifications") -> **Expected:** Bell icon is visible
3. Click the notification bell -> **Expected:** Notification dropdown/panel appears with "Notifications" text

### TC-003-05: Display Profile Menu with Logout
**Priority:** High
**Description:** Verify the profile/user menu is accessible and contains logout option.

**Steps:**
1. Navigate to `/admin` -> **Expected:** Dashboard loads
2. Find the user menu (labeled "User menu") -> **Expected:** Profile avatar/menu button is visible
3. Click the user menu -> **Expected:** Dropdown menu opens
4. Check for "Sign out" option -> **Expected:** "Sign out" menu item is visible

### TC-003-06: Display Settings Page
**Priority:** High
**Description:** Verify the settings page loads with salon profile configuration options.

**Steps:**
1. Navigate to `/admin/settings` -> **Expected:** Settings page loads
2. Check for salon name field -> **Expected:** Input with salon name is visible
3. Check for address field -> **Expected:** Address input is visible
4. Check for timezone selector -> **Expected:** Timezone configuration is visible
5. Check for working hours configuration -> **Expected:** Working hours section is visible

### TC-003-07: Update Salon Profile
**Priority:** High
**Description:** Verify salon profile details can be updated.

**Steps:**
1. Navigate to `/admin/settings` -> **Expected:** Settings page loads
2. Modify the salon name field -> **Expected:** Field accepts new input
3. Modify the address field -> **Expected:** Field accepts new input
4. Click save/update button -> **Expected:** Changes are saved, success message appears
5. Reload the page -> **Expected:** Updated values persist

### TC-003-08: Configure Working Hours
**Priority:** High
**Description:** Verify salon working hours can be configured.

**Steps:**
1. Navigate to `/admin/settings` -> **Expected:** Settings page loads
2. Find working hours section -> **Expected:** Days of the week with start/end times are visible
3. Modify a day's working hours -> **Expected:** Time inputs accept new values
4. Save changes -> **Expected:** Working hours are persisted

## Edge Cases

### EC-003-01: Settings Page with Empty Salon Profile
**Description:** Verify the settings page handles missing/empty profile data gracefully.

**Steps:**
1. Navigate to `/admin/settings` -> **Expected:** Page loads without errors
2. Check that form fields are present even if empty -> **Expected:** All form inputs render correctly with placeholders or empty values

### EC-003-02: Save Settings Without Changes
**Description:** Verify saving settings without making changes behaves correctly.

**Steps:**
1. Navigate to `/admin/settings` -> **Expected:** Settings page loads
2. Click save without modifying anything -> **Expected:** Either no-op with info message or saves successfully without error

# US-004: Master/Staff Management - E2E Test Cases

## Story Summary
As a salon owner, I want to add and manage my staff (masters), so that clients can book with specific stylists. This includes the masters list page, add/invite master form, master detail/edit page, and invite acceptance page.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- Salon exists with at least one configured service (for assignment)

## Test Cases

### TC-004-01: Display Masters List Page
**Priority:** High
**Description:** Verify the masters list page renders with all expected elements.

**Steps:**
1. Navigate to `/admin/masters` -> **Expected:** Masters page loads
2. Check for "Masters" heading -> **Expected:** Heading is visible
3. Check for "Add Master" button/link -> **Expected:** Add Master button is visible
4. Check for search input -> **Expected:** Search input with placeholder "Search masters..." is visible

### TC-004-02: Show Empty State or Masters List
**Priority:** High
**Description:** Verify the page shows either a list of masters or an empty state message.

**Steps:**
1. Navigate to `/admin/masters` -> **Expected:** Masters page loads
2. Check for masters data -> **Expected:** Either table/cards with master data are visible, or "No masters yet" empty state message is shown

### TC-004-03: Navigate to Add Master Form
**Priority:** High
**Description:** Verify clicking "Add Master" navigates to the add master form.

**Steps:**
1. Navigate to `/admin/masters` -> **Expected:** Masters page loads
2. Click "Add Master" button -> **Expected:** URL changes to `/admin/masters/new`
3. Check for Name input -> **Expected:** Name field is visible
4. Check for Email input -> **Expected:** Email field is visible
5. Check for Phone input -> **Expected:** Phone field is visible

### TC-004-04: Add New Master with Valid Data
**Priority:** High
**Description:** Verify a new master can be added with all required information.

**Steps:**
1. Navigate to `/admin/masters/new` -> **Expected:** Add master form loads
2. Fill name: "Test Master" -> **Expected:** Field accepts input
3. Fill email: "testmaster@example.com" -> **Expected:** Field accepts input
4. Fill phone: "+1234567890" -> **Expected:** Field accepts input
5. Fill specialization if available -> **Expected:** Field accepts input
6. Click submit/save/invite button -> **Expected:** Master is created, redirected to masters list or master detail page
7. Navigate to `/admin/masters` -> **Expected:** New master appears in the list

### TC-004-05: Add Master Form Validation
**Priority:** High
**Description:** Verify form validation prevents submission with invalid data.

**Steps:**
1. Navigate to `/admin/masters/new` -> **Expected:** Add master form loads
2. Leave all fields empty and click submit -> **Expected:** Validation errors for required fields
3. Fill only name and click submit -> **Expected:** Validation error for email or other required fields
4. Fill name and an invalid email "not-email" and click submit -> **Expected:** Validation error for email format

### TC-004-06: Search Masters
**Priority:** Medium
**Description:** Verify the search/filter functionality on the masters list.

**Steps:**
1. Navigate to `/admin/masters` -> **Expected:** Masters page loads
2. Type "nonexistent-master-xyz" in search input -> **Expected:** No masters match; empty or no-results state shown
3. Clear search and type a known master name -> **Expected:** Matching masters are displayed

### TC-004-07: Navigate to Master Detail Page
**Priority:** High
**Description:** Verify clicking a master navigates to their detail/edit page.

**Steps:**
1. Navigate to `/admin/masters` -> **Expected:** Masters page loads with at least one master
2. Click on a master entry (name or row) -> **Expected:** URL changes to `/admin/masters/:id`
3. Check for master details -> **Expected:** Master name, email, services assigned, and working hours are visible

### TC-004-08: Edit Master Details
**Priority:** High
**Description:** Verify master details can be edited and saved.

**Steps:**
1. Navigate to a master detail page `/admin/masters/:id` -> **Expected:** Detail page loads
2. Modify the master's name -> **Expected:** Field accepts new input
3. Click save/update button -> **Expected:** Changes are saved, success message appears
4. Reload the page -> **Expected:** Updated name persists

### TC-004-09: Assign Services to Master
**Priority:** High
**Description:** Verify services can be assigned to a master.

**Steps:**
1. Navigate to a master detail page `/admin/masters/:id` -> **Expected:** Detail page loads
2. Find the services assignment section -> **Expected:** Available services are listed
3. Toggle or select a service to assign -> **Expected:** Service is assigned
4. Save changes -> **Expected:** Assignment is persisted

### TC-004-10: Configure Master Working Hours
**Priority:** High
**Description:** Verify working hours can be set for a master.

**Steps:**
1. Navigate to a master detail page `/admin/masters/:id` -> **Expected:** Detail page loads
2. Find the working hours section -> **Expected:** Weekly schedule with days and time slots is visible
3. Modify working hours for a day -> **Expected:** Time inputs accept new values
4. Save changes -> **Expected:** Working hours are persisted

### TC-004-11: Display Invite Acceptance Page
**Priority:** Medium
**Description:** Verify the invite acceptance page renders for an invitation token.

**Steps:**
1. Navigate to `/invite/:token` (with a sample token) -> **Expected:** Invite page loads
2. Check for password setup form -> **Expected:** Password field is visible
3. Check for profile completion fields -> **Expected:** Name/profile fields may be pre-populated

## Edge Cases

### EC-004-01: Add Master with Duplicate Email
**Description:** Verify the system prevents adding a master with an email that already exists.

**Steps:**
1. Navigate to `/admin/masters/new` -> **Expected:** Add master form loads
2. Fill form with an email that already belongs to another master -> **Expected:** Field accepts input
3. Click submit -> **Expected:** Error message about duplicate email

### EC-004-02: Deactivate a Master
**Description:** Verify a master can be deactivated and no longer appears as bookable.

**Steps:**
1. Navigate to a master detail page -> **Expected:** Detail page loads
2. Find deactivate/disable toggle or button -> **Expected:** Deactivation control is visible
3. Deactivate the master -> **Expected:** Master status changes to inactive
4. Navigate to masters list -> **Expected:** Master is shown as inactive or filtered from active list

### EC-004-03: Invalid Invite Token
**Description:** Verify the invite page handles an invalid or expired token.

**Steps:**
1. Navigate to `/invite/invalid-token-123` -> **Expected:** Error message or redirect indicating the invite link is invalid or expired

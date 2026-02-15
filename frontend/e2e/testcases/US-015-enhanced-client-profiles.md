# US-015: Enhanced Client Profiles - E2E Test Cases

## Story Summary
As a salon owner, I want to see detailed client profiles with visit history and preferences, so that I can provide personalized service. This includes enhanced client detail pages with visit history timeline, preferences, notes, and the master "My Day" view with next client card.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- At least one client exists with appointment history
- At least one master exists

## Test Cases

### TC-015-01: Enhanced Client Detail Page
**Priority:** High
**Description:** Verify the client detail page shows comprehensive profile information.

**Steps:**
1. Navigate to `/admin/clients/:id` -> **Expected:** Client detail page loads
2. Check for client name -> **Expected:** Name is prominently displayed
3. Check for phone number -> **Expected:** Phone is visible
4. Check for email -> **Expected:** Email is visible (if available)
5. Check for visit history section -> **Expected:** Visit history section or tab is visible

### TC-015-02: Visit History Timeline
**Priority:** High
**Description:** Verify the visit history is displayed as a chronological timeline.

**Steps:**
1. Navigate to `/admin/clients/:id` for a client with multiple visits -> **Expected:** Client detail loads
2. Find the visit history section -> **Expected:** Section is visible
3. Check for chronological ordering -> **Expected:** Visits are listed from most recent to oldest (or oldest to newest)
4. Each visit entry shows date -> **Expected:** Date is visible for each visit
5. Each visit entry shows service name -> **Expected:** Service name is visible
6. Each visit entry shows master name -> **Expected:** Master name is visible
7. Each visit entry shows status -> **Expected:** Status (completed, cancelled, no-show) is visible

### TC-015-03: Client Preferences Display
**Priority:** Medium
**Description:** Verify client preferences are shown on the detail page.

**Steps:**
1. Navigate to `/admin/clients/:id` -> **Expected:** Client detail loads
2. Find preferences section -> **Expected:** Preferences area is visible
3. Check for preferred master -> **Expected:** Preferred master name is shown (if set)
4. Check for preferred service -> **Expected:** Most common or preferred service is indicated

### TC-015-04: Client Notes Section
**Priority:** High
**Description:** Verify client notes can be viewed and managed.

**Steps:**
1. Navigate to `/admin/clients/:id` -> **Expected:** Client detail loads
2. Find notes section -> **Expected:** Notes area is visible
3. Check existing notes -> **Expected:** Previously saved notes are displayed
4. Add a new note -> **Expected:** Note input accepts text
5. Save the note -> **Expected:** Note is persisted and displayed in the notes list

### TC-015-05: Client Communication History
**Priority:** Medium
**Description:** Verify client communication history is accessible from the profile.

**Steps:**
1. Navigate to `/admin/clients/:id` -> **Expected:** Client detail loads
2. Find communication history section or tab -> **Expected:** Communication section is visible
3. Check for message entries -> **Expected:** Messages from WhatsApp/other channels are listed

### TC-015-06: Master My Day View
**Priority:** High
**Description:** Verify the master "My Day" view shows today's appointments.

**Steps:**
1. Log in as a master user -> **Expected:** Master dashboard loads
2. Check for "My Day" or default landing view -> **Expected:** Today's date is prominently shown
3. Check for appointment timeline -> **Expected:** Today's appointments are listed in time order
4. Each appointment shows client name -> **Expected:** Client names are visible
5. Each appointment shows service name -> **Expected:** Service details are visible
6. Each appointment shows time -> **Expected:** Start and end times are displayed

### TC-015-07: Next Client Card
**Priority:** High
**Description:** Verify the "Next Up" client card is prominently displayed on the master's My Day view.

**Steps:**
1. Log in as a master with upcoming appointments today -> **Expected:** Master dashboard loads
2. Find the "Next Up" or next client card -> **Expected:** Card is prominently positioned at the top
3. Check for client name -> **Expected:** Next client's name is visible
4. Check for service name -> **Expected:** Service is displayed
5. Check for appointment time -> **Expected:** Time is shown
6. Check for client notes -> **Expected:** Any relevant notes (preferences, allergies) are shown
7. Check for action buttons -> **Expected:** Call, Message, or Details buttons are available

### TC-015-08: Edit Client Contact Information
**Priority:** Medium
**Description:** Verify client contact details can be edited from the detail page.

**Steps:**
1. Navigate to `/admin/clients/:id` -> **Expected:** Client detail loads
2. Find edit option for contact info -> **Expected:** Edit button or inline editing is available
3. Modify the client's phone number -> **Expected:** Field accepts new input
4. Save changes -> **Expected:** Updated phone number is persisted

## Edge Cases

### EC-015-01: Client with No Visit History
**Description:** Verify the client detail page handles a client with no visits.

**Steps:**
1. Navigate to `/admin/clients/:id` for a new client with zero visits -> **Expected:** Page loads
2. Check visit history section -> **Expected:** Empty state or "No visits yet" message is shown

### EC-015-02: Master My Day with No Appointments
**Description:** Verify the master My Day view handles a day with no appointments.

**Steps:**
1. Log in as a master with no appointments today -> **Expected:** Master dashboard loads
2. Check the My Day view -> **Expected:** Empty state with illustration or "No appointments today" message
3. Next client card -> **Expected:** Not shown or shows "No upcoming appointments"

### EC-015-03: GDPR Data Export Button
**Description:** Verify a data export option exists on the client profile.

**Steps:**
1. Navigate to `/admin/clients/:id` -> **Expected:** Client detail loads
2. Find data export option -> **Expected:** "Export Data" button or link is visible
3. Click export -> **Expected:** Client data is exported or download is initiated

### EC-015-04: GDPR Data Deletion
**Description:** Verify a data deletion option exists on the client profile.

**Steps:**
1. Navigate to `/admin/clients/:id` -> **Expected:** Client detail loads
2. Find data deletion option -> **Expected:** "Delete Client Data" button is visible
3. Click delete -> **Expected:** Confirmation dialog appears
4. Confirm deletion -> **Expected:** Client PII is removed, confirmation message shown

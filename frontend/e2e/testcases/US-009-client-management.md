# US-009: Client Management (Basic) - E2E Test Cases

## Story Summary
As a salon owner, I want to view and search clients with their visit history, so that I can understand my customer base. This includes the client list page with search/filter and client detail page with visit history.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- Some clients may already exist in the system

## Test Cases

### TC-009-01: Display Clients List Page
**Priority:** High
**Description:** Verify the clients list page renders with all expected elements.

**Steps:**
1. Navigate to `/admin/clients` -> **Expected:** Clients page loads
2. Check for "Clients" heading -> **Expected:** Heading is visible
3. Check for "Add Client" button -> **Expected:** Add Client button is visible
4. Check for search input -> **Expected:** Search input with placeholder containing "search" is visible

### TC-009-02: Show Empty State or Client List
**Priority:** High
**Description:** Verify the page shows either a list of clients or an empty state.

**Steps:**
1. Navigate to `/admin/clients` -> **Expected:** Clients page loads
2. Check for client data -> **Expected:** Either a table/cards with client data or "No clients yet" empty state message is visible

### TC-009-03: Open Add Client Dialog
**Priority:** High
**Description:** Verify the add client dialog opens with required fields.

**Steps:**
1. Navigate to `/admin/clients` -> **Expected:** Clients page loads
2. Click "Add Client" button -> **Expected:** Dialog/modal opens
3. Check for "Name" input -> **Expected:** Name field is visible in the dialog

### TC-009-04: Add New Client
**Priority:** High
**Description:** Verify a new client can be added with valid data.

**Steps:**
1. Navigate to `/admin/clients` -> **Expected:** Clients page loads
2. Click "Add Client" button -> **Expected:** Dialog opens
3. Fill name: "Test Client" -> **Expected:** Field accepts input
4. Fill phone: "+1234567890" -> **Expected:** Field accepts input
5. Fill email: "testclient@example.com" -> **Expected:** Field accepts input
6. Click "Add Client" submit button in dialog -> **Expected:** Client is created, dialog closes
7. Verify new client appears in the list -> **Expected:** "Test Client" is visible in the client list

### TC-009-05: Add Client Form Validation
**Priority:** High
**Description:** Verify form validation when adding a client.

**Steps:**
1. Navigate to `/admin/clients` -> **Expected:** Clients page loads
2. Click "Add Client" button -> **Expected:** Dialog opens
3. Leave name empty and click submit -> **Expected:** Validation error for name field

### TC-009-06: Search Clients by Name
**Priority:** High
**Description:** Verify the search functionality filters clients by name.

**Steps:**
1. Navigate to `/admin/clients` -> **Expected:** Clients page loads with clients
2. Type a known client name in the search input -> **Expected:** Client list filters to show matching results
3. Clear the search input -> **Expected:** Full client list is restored

### TC-009-07: Search Clients by Phone
**Priority:** High
**Description:** Verify the search functionality filters clients by phone number.

**Steps:**
1. Navigate to `/admin/clients` -> **Expected:** Clients page loads
2. Type a known client phone number in the search input -> **Expected:** Client with matching phone appears
3. Type a non-existent phone number -> **Expected:** No results shown

### TC-009-08: Search with No Results
**Priority:** Medium
**Description:** Verify the search handles no matching results gracefully.

**Steps:**
1. Navigate to `/admin/clients` -> **Expected:** Clients page loads
2. Type "nonexistent-client-xyz" in search -> **Expected:** No clients match
3. Wait for search debounce -> **Expected:** Empty state or "No results" message is shown

### TC-009-09: Navigate to Client Detail Page
**Priority:** High
**Description:** Verify clicking a client navigates to their detail page.

**Steps:**
1. Navigate to `/admin/clients` with existing clients -> **Expected:** Client list is visible
2. Click on a client entry (name or row link) -> **Expected:** URL changes to `/admin/clients/:id`
3. Check for client detail content -> **Expected:** Client name, contact info, and visit history section are visible

### TC-009-10: Client Detail - Contact Information
**Priority:** High
**Description:** Verify client detail page shows contact information.

**Steps:**
1. Navigate to `/admin/clients/:id` -> **Expected:** Client detail page loads
2. Check for client name -> **Expected:** Name is displayed
3. Check for phone number -> **Expected:** Phone is displayed
4. Check for email address -> **Expected:** Email is displayed (if available)

### TC-009-11: Client Detail - Visit History
**Priority:** High
**Description:** Verify client detail page shows visit/appointment history.

**Steps:**
1. Navigate to `/admin/clients/:id` for a client with past appointments -> **Expected:** Client detail page loads
2. Check for visit history section -> **Expected:** Visit history section is visible
3. Check for individual visit entries -> **Expected:** Each visit shows date, service, master, and status

### TC-009-12: Client Detail - Notes
**Priority:** Medium
**Description:** Verify client notes can be viewed and added.

**Steps:**
1. Navigate to `/admin/clients/:id` -> **Expected:** Client detail page loads
2. Find notes section -> **Expected:** Notes area is visible
3. Add a new note (if input is available) -> **Expected:** Note is saved and displayed

## Edge Cases

### EC-009-01: Add Client with Only Name
**Description:** Verify a client can be added with just a name (phone and email optional).

**Steps:**
1. Open add client dialog -> **Expected:** Dialog opens
2. Fill only name: "Quick Client" -> **Expected:** Field accepts input
3. Leave phone and email empty -> **Expected:** Fields remain empty
4. Click submit -> **Expected:** Client is created (if name is the only required field)

### EC-009-02: Add Client with Duplicate Phone
**Description:** Verify the system handles duplicate phone numbers.

**Steps:**
1. Add a client with phone "+1234567890" -> **Expected:** Client created
2. Try to add another client with the same phone "+1234567890" -> **Expected:** Either error about duplicate phone or client is merged/linked

### EC-009-03: Client Detail for Non-Existent ID
**Description:** Verify the app handles navigating to a non-existent client ID.

**Steps:**
1. Navigate to `/admin/clients/99999` (non-existent ID) -> **Expected:** 404 page or error message, no crash

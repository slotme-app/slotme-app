# US-005: Service Catalog Management - E2E Test Cases

## Story Summary
As a salon owner, I want to define my salon's service catalog, so that clients know what can be booked and the system calculates correct durations and prices. This includes services management with category grouping and add/edit service dialogs.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- At least one master exists for service assignment

## Test Cases

### TC-005-01: Display Services Page
**Priority:** High
**Description:** Verify the services management page renders with all expected elements.

**Steps:**
1. Navigate to `/admin/services` -> **Expected:** Services page loads
2. Check for "Services" heading -> **Expected:** Heading is visible
3. Check for "Add Service" button -> **Expected:** Add Service button is visible
4. Check for "Add Category" button -> **Expected:** Add Category button is visible

### TC-005-02: Show Empty State or Service List
**Priority:** High
**Description:** Verify the page shows either services grouped by category or an empty state.

**Steps:**
1. Navigate to `/admin/services` -> **Expected:** Services page loads
2. Check for service data -> **Expected:** Either service categories with services are visible, or "No services yet" empty state message is shown

### TC-005-03: Open Add Service Dialog
**Priority:** High
**Description:** Verify the add service dialog opens with all required fields.

**Steps:**
1. Navigate to `/admin/services` -> **Expected:** Services page loads
2. Click "Add Service" button -> **Expected:** Dialog/modal opens
3. Check for "Add Service" heading in dialog -> **Expected:** Dialog heading is visible
4. Check for "Name" input -> **Expected:** Name field is visible
5. Check for "Duration" field -> **Expected:** Duration selector/input is visible
6. Check for "Price" input -> **Expected:** Price field is visible

### TC-005-04: Create New Service
**Priority:** High
**Description:** Verify a new service can be created with valid data.

**Steps:**
1. Navigate to `/admin/services` -> **Expected:** Services page loads
2. Click "Add Service" button -> **Expected:** Dialog opens
3. Fill name: "Test Haircut" -> **Expected:** Field accepts input
4. Select duration: 60 minutes -> **Expected:** Duration is selected
5. Fill price: "50" -> **Expected:** Field accepts input
6. Select category (if categories exist) -> **Expected:** Category is selected
7. Click submit/save button in dialog -> **Expected:** Service is created, dialog closes
8. Verify new service appears in the list -> **Expected:** "Test Haircut" is visible in the service list

### TC-005-05: Add Service Form Validation
**Priority:** High
**Description:** Verify form validation in the add service dialog.

**Steps:**
1. Navigate to `/admin/services` -> **Expected:** Services page loads
2. Click "Add Service" button -> **Expected:** Dialog opens
3. Leave all fields empty and click save -> **Expected:** Validation errors for required fields
4. Fill only name and click save -> **Expected:** Validation errors for duration and price

### TC-005-06: Open Add Category Dialog
**Priority:** High
**Description:** Verify the add category dialog opens with the required field.

**Steps:**
1. Navigate to `/admin/services` -> **Expected:** Services page loads
2. Click "Add Category" button -> **Expected:** Dialog/modal opens
3. Check for "Add Category" heading -> **Expected:** Dialog heading is visible
4. Check for "Category Name" input -> **Expected:** Category name field is visible

### TC-005-07: Create New Category
**Priority:** High
**Description:** Verify a new service category can be created.

**Steps:**
1. Navigate to `/admin/services` -> **Expected:** Services page loads
2. Click "Add Category" button -> **Expected:** Dialog opens
3. Fill category name: "Hair Services" -> **Expected:** Field accepts input
4. Click save/submit button -> **Expected:** Category is created, dialog closes
5. Verify new category appears on the page -> **Expected:** "Hair Services" category section is visible

### TC-005-08: Edit Existing Service
**Priority:** High
**Description:** Verify an existing service can be edited.

**Steps:**
1. Navigate to `/admin/services` -> **Expected:** Services page loads with at least one service
2. Click edit button/icon on a service -> **Expected:** Edit dialog opens with pre-filled data
3. Modify the service name -> **Expected:** Field accepts new input
4. Modify the price -> **Expected:** Field accepts new input
5. Click save/update button -> **Expected:** Changes are saved, dialog closes
6. Verify updated service in the list -> **Expected:** Updated name and price are displayed

### TC-005-09: Assign Masters to Service
**Priority:** High
**Description:** Verify masters can be assigned to a service during creation or editing.

**Steps:**
1. Navigate to `/admin/services` -> **Expected:** Services page loads
2. Click "Add Service" or edit an existing service -> **Expected:** Dialog opens
3. Find master assignment section -> **Expected:** List of available masters is shown
4. Select/toggle masters to assign -> **Expected:** Masters are selected
5. Save the service -> **Expected:** Master assignment is persisted

### TC-005-10: Service Category Grouping Display
**Priority:** Medium
**Description:** Verify services are displayed grouped by their categories.

**Steps:**
1. Navigate to `/admin/services` (with multiple categories and services) -> **Expected:** Services page loads
2. Check for category grouping -> **Expected:** Services are visually grouped under category headers
3. Each service shows name, duration, and price -> **Expected:** Service details are visible within their category groups

## Edge Cases

### EC-005-01: Create Service with Zero Price
**Description:** Verify the system handles a service with price of 0 (free service).

**Steps:**
1. Open add service dialog -> **Expected:** Dialog opens
2. Fill name: "Free Consultation" -> **Expected:** Field accepts input
3. Set duration: 30 minutes -> **Expected:** Duration set
4. Fill price: "0" -> **Expected:** Field accepts zero
5. Save -> **Expected:** Service is created successfully with $0 price

### EC-005-02: Create Duplicate Service Name
**Description:** Verify handling of duplicate service names.

**Steps:**
1. Open add service dialog -> **Expected:** Dialog opens
2. Fill name with an existing service name -> **Expected:** Field accepts input
3. Fill remaining fields and save -> **Expected:** Either duplicate is allowed (different ID) or error message about duplicate name

### EC-005-03: Delete/Deactivate Service
**Description:** Verify a service can be deactivated or deleted.

**Steps:**
1. Navigate to `/admin/services` with existing services -> **Expected:** Services list visible
2. Find delete/deactivate action on a service -> **Expected:** Action button/icon is visible
3. Click delete/deactivate -> **Expected:** Confirmation prompt appears
4. Confirm the action -> **Expected:** Service is removed or marked as inactive

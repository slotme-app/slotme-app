# US-012: Booking Confirmation Notifications - E2E Test Cases

## Story Summary
As a client, I want to receive an instant confirmation message after booking, so that I know my appointment is secured. The frontend component is the notification template management page.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- Notification templates are seeded or configurable

## Test Cases

### TC-012-01: Display Notification Templates Page
**Priority:** High
**Description:** Verify the notification template management page loads.

**Steps:**
1. Navigate to the notification templates page (within Settings or as a separate page) -> **Expected:** Page loads
2. Check for page heading -> **Expected:** A heading like "Notification Templates" or "Notifications" is visible
3. Check for template list -> **Expected:** List of notification templates is shown (booking confirmation, reminder, cancellation)

### TC-012-02: View Booking Confirmation Template
**Priority:** High
**Description:** Verify the booking confirmation template can be viewed.

**Steps:**
1. Navigate to notification templates page -> **Expected:** Page loads
2. Find the "Booking Confirmation" template -> **Expected:** Template entry is visible
3. Click to view/edit the template -> **Expected:** Template content is displayed with variables like {service}, {master}, {date}, {time}

### TC-012-03: Edit Notification Template
**Priority:** Medium
**Description:** Verify a notification template can be edited.

**Steps:**
1. Navigate to notification templates page -> **Expected:** Page loads
2. Click edit on a template -> **Expected:** Template editor opens
3. Modify the template text -> **Expected:** Text area accepts changes
4. Save the template -> **Expected:** Changes are persisted, success message shown

### TC-012-04: Template Variable Display
**Priority:** Medium
**Description:** Verify template variables are displayed and documented.

**Steps:**
1. Open a notification template for editing -> **Expected:** Template editor loads
2. Check for variable placeholders -> **Expected:** Variables like {client_name}, {service}, {master}, {date}, {time}, {salon_name}, {address} are visible or documented

### TC-012-05: Notification After Booking
**Priority:** High
**Description:** Verify that creating a booking triggers a confirmation notification (visible in admin UI).

**Steps:**
1. Create a new appointment via the calendar -> **Expected:** Appointment created
2. Check the notification bell/panel -> **Expected:** A new notification appears about the booking
3. Check the activity feed (if visible on dashboard) -> **Expected:** Booking event is logged

## Edge Cases

### EC-012-01: Empty Template
**Description:** Verify the system handles an empty template gracefully.

**Steps:**
1. Open template editor -> **Expected:** Editor loads
2. Clear all template content -> **Expected:** Field is empty
3. Try to save -> **Expected:** Validation error or warning that template cannot be empty

### EC-012-02: Template with Invalid Variables
**Description:** Verify the system handles invalid variable placeholders.

**Steps:**
1. Open template editor -> **Expected:** Editor loads
2. Add an invalid variable: "{invalid_variable}" -> **Expected:** Field accepts input
3. Save the template -> **Expected:** Either warning about unknown variable or saves (variable renders as literal text when used)

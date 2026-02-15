# E2E Test Cases: Salon, Master & Service Management

**Feature:** US-003 Salon Profile Management, US-004 Master/Staff Management, US-005 Service Catalog Management
**Version:** 1.0
**Last Updated:** 2026-02-15
**Status:** Ready for Testing

---

## SALON PROFILE MANAGEMENT (US-003)

### Test Case TC-SALON-001: Update Salon Profile Information

**Priority:** High
**User Story:** US-003

**Description:** Verify that salon owner can update salon profile details

**Preconditions:**
- User is logged in as SALON_ADMIN
- Salon profile exists in database

**Test Steps:**
1. Navigate to Settings > Salon Profile (`/admin/settings`)
2. Verify current salon information is displayed
3. Update the following fields:
   - Salon name: `Beauty Studio Updated`
   - Address: `456 Broadway, New York, NY 10013`
   - Phone: `+1987654321`
   - Description: `Premium beauty services in Manhattan`
4. Upload a new logo image (PNG/JPG, max 2MB)
5. Click "Save Changes"

**Expected Results:**
- Success message: "Salon profile updated successfully"
- Changes are immediately reflected in the dashboard header
- Database is updated with new values
- Logo is uploaded and displayed
- All masters see updated salon name
- API response includes updated salon info

---

### Test Case TC-SALON-002: Configure Salon Working Hours

**Priority:** Critical
**User Story:** US-003

**Description:** Verify that salon owner can set and update working hours

**Preconditions:**
- User is logged in as SALON_ADMIN
- At Settings > Salon Profile page

**Test Steps:**
1. Navigate to "Working Hours" section in Settings
2. Set hours for each day:
   - Monday: 09:00 - 18:00
   - Tuesday: 09:00 - 18:00
   - Wednesday: 09:00 - 20:00 (late evening)
   - Thursday: 09:00 - 18:00
   - Friday: 09:00 - 18:00
   - Saturday: 10:00 - 16:00
   - Sunday: Closed
3. Add lunch break: 13:00 - 14:00 (all days except Sunday)
4. Click "Save Working Hours"
5. Navigate to Calendar view
6. Verify availability calculation respects these hours

**Expected Results:**
- Working hours are saved successfully
- Calendar does not show appointment slots outside working hours
- Sunday shows as unavailable
- Lunch break (13:00-14:00) is not available for booking
- AI assistant uses these hours when offering slots to clients
- Message: "Working hours updated. Availability recalculated."

---

### Test Case TC-SALON-003: Add Salon Holiday Closure

**Priority:** High
**User Story:** US-003

**Description:** Verify that salon owner can mark specific dates as closed

**Preconditions:**
- User is logged in as SALON_ADMIN
- Salon working hours are configured

**Test Steps:**
1. Navigate to Settings > Holidays & Closures
2. Click "Add Holiday"
3. Enter holiday details:
   - Name: `Thanksgiving`
   - Date: `2026-11-26`
   - Type: One-time closure
4. Click "Add"
5. Add another holiday:
   - Name: `Christmas Break`
   - Start Date: `2026-12-24`
   - End Date: `2026-12-26`
   - Type: Date range
6. Save changes

**Expected Results:**
- Holidays are added to the calendar
- No appointments can be booked on these dates
- Calendar view shows closure days grayed out
- Existing appointments on these dates generate alerts
- AI assistant does not offer these dates when clients request bookings
- Notification sent to masters about upcoming closures

---

### Test Case TC-SALON-004: Update Timezone

**Priority:** Medium
**User Story:** US-003

**Description:** Verify that changing salon timezone updates all time-based data correctly

**Preconditions:**
- Salon is configured with timezone `America/New_York`
- Appointments exist in the calendar

**Test Steps:**
1. Navigate to Settings > Salon Profile
2. Change timezone from `America/New_York` to `America/Los_Angeles`
3. Confirm the change with warning dialog
4. Navigate to Calendar view
5. Check existing appointments

**Expected Results:**
- Timezone is updated
- Warning shown: "Changing timezone will affect all scheduled appointments"
- All appointment times are adjusted to new timezone
- Masters are notified of timezone change
- Appointment reminders use new timezone
- Database stores timezone correctly

---

## MASTER/STAFF MANAGEMENT (US-004)

### Test Case TC-MASTER-001: Add New Master to Salon

**Priority:** Critical
**User Story:** US-004

**Description:** Verify that salon admin can add a new master/stylist

**Preconditions:**
- User is logged in as SALON_ADMIN
- At least one service exists in the catalog

**Test Steps:**
1. Navigate to Masters page (`/admin/masters`)
2. Click "Add Master" or "Invite Master" button
3. Fill in master details:
   - Name: `Alina Petrova`
   - Phone: `+1234567891`
   - Email: `alina@example.com`
   - Specialization: `Hair Colorist`
4. Upload profile photo (optional)
5. Assign services:
   - Select: Hair Coloring, Haircut & Styling
6. Set working hours:
   - Monday-Friday: 09:00 - 18:00
   - Saturday: 10:00 - 16:00
   - Sunday: Off
7. Click "Save & Send Invite"

**Expected Results:**
- Master is created in the database
- Master appears in the masters list
- Invitation email/SMS is sent to `alina@example.com` and phone
- Master status is "Pending" until they accept invitation
- Master is linked to the current tenant
- Assigned services are saved
- Working hours are configured

---

### Test Case TC-MASTER-002: Master Accepts Invitation

**Priority:** Critical
**User Story:** US-004

**Description:** Verify that invited master can accept invitation and complete profile

**Preconditions:**
- Master invitation has been sent by admin
- Master receives invitation link via email/SMS

**Test Steps:**
1. Master clicks the invitation link (format: `/invite/{token}`)
2. Verify pre-filled information (name, salon name)
3. Set password: `MasterPass123!`
4. Confirm password: `MasterPass123!`
5. Upload profile photo (optional)
6. Review assigned services (pre-populated by admin)
7. Review and adjust working hours if needed
8. Click "Accept & Join"

**Expected Results:**
- Master account is activated
- Status changes from "Pending" to "Active"
- Master can log in with credentials
- Master sees their own dashboard (`/master`)
- Master appears in salon's active staff list
- Admin receives notification: "Alina Petrova has joined your team"

---

### Test Case TC-MASTER-003: Edit Master Information

**Priority:** High
**User Story:** US-004

**Description:** Verify that admin can edit existing master details

**Preconditions:**
- Master "Alina Petrova" exists and is active
- User is logged in as SALON_ADMIN

**Test Steps:**
1. Navigate to Masters page
2. Click on "Alina Petrova" to open detail view
3. Click "Edit" button
4. Update fields:
   - Specialization: `Senior Hair Colorist`
   - Phone: `+1234567899` (updated)
5. Add new service assignment: Hair Treatment
6. Update working hours:
   - Wednesday: 09:00 - 20:00 (late day)
7. Click "Save Changes"

**Expected Results:**
- Master information is updated
- Changes reflected in master list
- Service assignments updated
- Working hours updated in calendar
- Master receives notification of changes
- Availability calculation uses new hours

---

### Test Case TC-MASTER-004: Deactivate Master

**Priority:** High
**User Story:** US-004

**Description:** Verify that admin can deactivate a master

**Preconditions:**
- Master "Alina Petrova" exists with future appointments
- User is logged in as SALON_ADMIN

**Test Steps:**
1. Navigate to Masters page
2. Click on "Alina Petrova"
3. Click "Deactivate" button
4. Confirm deactivation
5. Review warning about future appointments (if any)
6. Choose action for future appointments:
   - Option 1: Reassign to another master
   - Option 2: Cancel and notify clients
7. Confirm final action

**Expected Results:**
- Master status changes to "Inactive"
- Master no longer appears in booking options for clients
- Master cannot log in (or login shows inactive status)
- Future appointments are handled according to chosen option
- Clients with affected appointments are notified
- Master's calendar history is preserved

---

### Test Case TC-MASTER-005: Search and Filter Masters

**Priority:** Medium
**User Story:** US-004

**Description:** Verify that admin can search and filter master list

**Preconditions:**
- Multiple masters exist (at least 5)
- User is logged in as SALON_ADMIN

**Test Steps:**
1. Navigate to Masters page
2. Use search box:
   - Search by name: `Alina`
   - Expected: Only masters with "Alina" in name appear
3. Clear search
4. Use filters:
   - Filter by service: `Hair Coloring`
   - Expected: Only masters who offer Hair Coloring appear
5. Filter by status:
   - Select: `Active`
   - Expected: Only active masters appear
6. Combine filters:
   - Service: `Hair Coloring` AND Status: `Active`

**Expected Results:**
- Search returns results within 2 seconds
- Filtering works correctly
- Results update immediately
- Combined filters work as expected (AND logic)
- Result count is displayed

---

## SERVICE CATALOG MANAGEMENT (US-005)

### Test Case TC-SERVICE-001: Add New Service

**Priority:** Critical
**User Story:** US-005

**Description:** Verify that admin can create a new service

**Preconditions:**
- User is logged in as SALON_ADMIN
- At least one service category exists

**Test Steps:**
1. Navigate to Services page (`/admin/services`)
2. Click "Add Service" button
3. Fill in service details:
   - Service Name: `Balayage Hair Coloring`
   - Category: `Hair`
   - Duration: `180 minutes`
   - Price: `$150`
   - Description: `Premium balayage coloring technique`
   - Buffer Time: `15 minutes`
4. Assign masters:
   - Select: Alina Petrova, Dasha Ivanova
5. Toggle "Active" to ON
6. Click "Save Service"

**Expected Results:**
- Service is created successfully
- Service appears in the services list under "Hair" category
- Service is available for booking
- AI assistant can offer this service in conversations
- Only assigned masters can perform this service
- Price and duration are correctly stored
- Buffer time is included in availability calculations

---

### Test Case TC-SERVICE-002: Edit Existing Service

**Priority:** High
**User Story:** US-005

**Description:** Verify that admin can edit service details

**Preconditions:**
- Service "Balayage Hair Coloring" exists
- User is logged in as SALON_ADMIN

**Test Steps:**
1. Navigate to Services page
2. Click on "Balayage Hair Coloring" service
3. Click "Edit" button
4. Update fields:
   - Price: `$180` (price increase)
   - Duration: `210 minutes` (longer duration)
   - Description: Updated description
5. Remove one assigned master (Dasha Ivanova)
6. Click "Save Changes"

**Expected Results:**
- Service details are updated
- New price applies to future bookings
- Existing appointments keep old price (or show update notification)
- Duration change affects availability calculations
- Removed master no longer offers this service
- AI uses updated service information

---

### Test Case TC-SERVICE-003: Deactivate Service

**Priority:** High
**User Story:** US-005

**Description:** Verify that admin can deactivate a service

**Preconditions:**
- Service "Balayage Hair Coloring" exists
- Service has future appointments

**Test Steps:**
1. Navigate to Services page
2. Click on "Balayage Hair Coloring"
3. Toggle "Active" to OFF
4. Review warning about future appointments
5. Confirm deactivation

**Expected Results:**
- Service status changes to "Inactive"
- Service is not offered in new bookings
- AI does not suggest this service to clients
- Service remains in the list (not deleted) with "Inactive" badge
- Existing/future appointments are preserved
- Service can be reactivated later
- Historical data is retained

---

### Test Case TC-SERVICE-004: Create Service Category

**Priority:** Medium
**User Story:** US-005

**Description:** Verify that admin can create custom service categories

**Preconditions:**
- User is logged in as SALON_ADMIN
- At Services page

**Test Steps:**
1. Navigate to Services page
2. Click "Manage Categories" button
3. Click "Add Category"
4. Enter category details:
   - Name: `Skincare`
   - Description: `Facial and skin treatments`
   - Icon: Select skincare icon
5. Click "Save Category"

**Expected Results:**
- New category "Skincare" is created
- Category appears in the category list
- Category can be assigned to services
- Services are grouped by category in the UI
- AI uses category information in conversations

---

### Test Case TC-SERVICE-005: Assign Different Prices Per Master

**Priority:** Medium
**User Story:** US-005

**Description:** Verify that same service can have different prices for different masters

**Preconditions:**
- Service "Haircut & Styling" exists
- Multiple masters exist: Alina (Senior), Dasha (Junior)

**Test Steps:**
1. Navigate to Services page
2. Click on "Haircut & Styling"
3. Click "Edit"
4. Enable "Master-specific pricing"
5. Set prices:
   - Alina Petrova (Senior): `$60`
   - Dasha Ivanova (Junior): `$40`
6. Save changes
7. Test booking flow:
   - Select service "Haircut & Styling"
   - Select Alina → verify price shown is $60
   - Select Dasha → verify price shown is $40

**Expected Results:**
- Master-specific pricing is saved
- Correct price is displayed based on selected master
- AI quotes correct price during booking
- Appointment total reflects master-specific price
- Analytics show revenue per master correctly

---

### Test Case TC-SERVICE-006: Service Duration Variants

**Priority:** Medium
**User Story:** US-005

**Description:** Verify that a service can have multiple duration/price variants

**Preconditions:**
- User is logged in as SALON_ADMIN

**Test Steps:**
1. Navigate to Services page
2. Click "Add Service"
3. Create service with variants:
   - Service Name: `Hair Coloring`
   - Add variant 1:
     - Name: `Partial Highlights`
     - Duration: `90 minutes`
     - Price: `$80`
   - Add variant 2:
     - Name: `Full Color`
     - Duration: `120 minutes`
     - Price: `$120`
   - Add variant 3:
     - Name: `Full Highlights + Toner`
     - Duration: `180 minutes`
     - Price: `$180`
4. Save service

**Expected Results:**
- Service is created with 3 variants
- When booking, client can choose variant
- AI asks which variant client wants
- Correct duration and price are used based on selected variant
- Calendar blocks appropriate time for selected variant

---

### Test Case TC-SERVICE-007: Search and Filter Services

**Priority:** Medium
**User Story:** US-005

**Description:** Verify that admin can search and filter service catalog

**Preconditions:**
- Multiple services exist across different categories
- User is logged in as SALON_ADMIN

**Test Steps:**
1. Navigate to Services page
2. Search by name:
   - Enter: `Hair`
   - Expected: All services with "Hair" in name appear
3. Filter by category:
   - Select: `Hair`
   - Expected: Only Hair category services appear
4. Filter by status:
   - Select: `Active`
   - Expected: Only active services appear
5. Filter by assigned master:
   - Select: `Alina Petrova`
   - Expected: Only services assigned to Alina appear
6. Sort by price (ascending/descending)

**Expected Results:**
- Search returns results quickly (< 1 second)
- All filters work correctly
- Filters can be combined
- Sort order is correct
- Result count is displayed

---

### Test Case TC-SERVICE-008: Bulk Service Operations

**Priority:** Low
**User Story:** US-005

**Description:** Verify that admin can perform bulk operations on services

**Preconditions:**
- Multiple services exist (at least 5)
- User is logged in as SALON_ADMIN

**Test Steps:**
1. Navigate to Services page
2. Enable "Select Mode" or checkboxes
3. Select multiple services (3 services)
4. Use bulk actions:
   - Test 1: Bulk change category
   - Test 2: Bulk assign to master
   - Test 3: Bulk deactivate
5. Confirm each action

**Expected Results:**
- Bulk selection works
- Bulk category change applies to all selected
- Bulk master assignment adds master to all selected services
- Bulk deactivation marks all selected as inactive
- Confirmation dialog shows count of affected services
- Success message confirms bulk operation

---

## Edge Cases and Error Scenarios

### TC-SALON-005: Invalid Working Hours

**Priority:** Medium
**Description:** Verify validation for invalid working hour configurations

**Test Steps:**
1. Attempt to set end time before start time (e.g., 18:00 - 09:00)
2. Attempt to save

**Expected Results:**
- Validation error: "End time must be after start time"
- Changes are not saved

---

### TC-MASTER-006: Invite Master with Duplicate Email

**Priority:** Medium
**Description:** Verify that duplicate master emails are prevented

**Test Steps:**
1. Attempt to invite master with email that already exists

**Expected Results:**
- Error: "This email is already registered"
- Master is not created

---

### TC-SERVICE-009: Delete Service with Future Appointments

**Priority:** High
**Description:** Verify that services with future appointments cannot be deleted

**Test Steps:**
1. Attempt to delete a service that has future appointments

**Expected Results:**
- Warning: "This service has X future appointments"
- Options: Cancel appointments, Deactivate instead, or Go back
- Service is not deleted without confirmation

---

### TC-SERVICE-010: Service Name Maximum Length

**Priority:** Low
**Description:** Verify validation for service name length

**Test Steps:**
1. Enter service name exceeding 255 characters
2. Attempt to save

**Expected Results:**
- Validation error: "Service name must be less than 255 characters"
- Service is not saved

---

## Summary

**Total Test Cases:** 25
- Critical Priority: 6
- High Priority: 9
- Medium Priority: 9
- Low Priority: 1

**Coverage:**
- Salon Profile: 4 test cases
- Master Management: 6 test cases
- Service Catalog: 10 test cases
- Edge Cases: 5 test cases

**Estimated Testing Time:** 3-4 hours for full manual execution

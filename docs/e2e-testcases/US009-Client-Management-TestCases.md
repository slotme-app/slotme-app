# E2E Test Cases: Client Management

**Feature:** US-009 Client Management (Basic), US-015 Enhanced Client Profiles
**Version:** 1.0
**Last Updated:** 2026-02-15
**Status:** Ready for Testing

---

## CLIENT PROFILE MANAGEMENT

### Test Case TC-CLIENT-001: Auto-Create Client Profile on First Contact

**Priority:** Critical
**User Story:** US-009

**Description:** Verify that client profile is automatically created when client contacts salon for the first time

**Preconditions:**
- WhatsApp integration is active
- New client sends message for the first time
- Phone number: +1234567890 (not in database)

**Test Steps:**
1. Client sends WhatsApp message: "Hi, I want to book an appointment"
2. AI responds with greeting
3. Booking conversation proceeds
4. Admin checks Clients page

**Expected Results:**
- New client profile is automatically created
- Profile contains:
  - Phone number: +1234567890
  - Name: Initially shows as phone number or "Unknown"
  - Source channel: WhatsApp
  - First contact date: Current timestamp
  - Tenant ID: Correctly associated with the salon
- Profile appears in Clients list
- No duplicate profiles created if client messages again
- Profile is linked to subsequent appointments

---

### Test Case TC-CLIENT-002: View Client List

**Priority:** High
**User Story:** US-009

**Description:** Verify that admin can view list of all clients

**Preconditions:**
- User is logged in as SALON_ADMIN
- At least 10 clients exist in database

**Test Steps:**
1. Navigate to Clients page (`/admin/clients`)
2. Observe the client list

**Expected Results:**
- Client list displays with columns:
  - Name
  - Phone number
  - Email (if available)
  - Last visit date
  - Total visits count
  - Preferred master
  - Status (Active/Inactive)
- List is paginated (default 20 per page)
- Clients are sorted by last visit (most recent first)
- Load time < 2 seconds
- UI is responsive and clean

---

### Test Case TC-CLIENT-003: Search Clients by Name

**Priority:** High
**User Story:** US-009

**Description:** Verify that admin can search for clients by name

**Preconditions:**
- Multiple clients exist
- Client "Katya Ivanova" exists in database

**Test Steps:**
1. Navigate to Clients page
2. Enter search query in search box:
   - Test 1: "Katya" (partial match)
   - Test 2: "Ivanova" (last name)
   - Test 3: "Katya Ivanova" (full name)
   - Test 4: "katya" (lowercase)

**Expected Results:**
- All search variations return "Katya Ivanova"
- Search is case-insensitive
- Partial matches work
- Results appear within 2 seconds
- Result count is displayed
- No results found shows appropriate message

---

### Test Case TC-CLIENT-004: Search Clients by Phone Number

**Priority:** High
**User Story:** US-009

**Description:** Verify that admin can search for clients by phone number

**Preconditions:**
- Client exists with phone: +1234567890

**Test Steps:**
1. Navigate to Clients page
2. Search tests:
   - Test 1: "+1234567890" (full number with country code)
   - Test 2: "1234567890" (without country code)
   - Test 3: "234567890" (partial number)
   - Test 4: "123-456-7890" (formatted)

**Expected Results:**
- All formats successfully find the client
- Search handles different phone number formats
- Exact and partial matches work
- Results appear quickly (< 2 seconds)

---

### Test Case TC-CLIENT-005: View Client Profile Details

**Priority:** High
**User Story:** US-009, US-015

**Description:** Verify that admin can view comprehensive client profile

**Preconditions:**
- Client "Katya Ivanova" exists with visit history

**Test Steps:**
1. Navigate to Clients page
2. Click on "Katya Ivanova" to open profile
3. Review all profile sections

**Expected Results:**
- Client profile displays:
  - **Header:** Name, profile photo (if available), phone, email
  - **Overview:**
    - Total visits count
    - Total revenue generated
    - Member since date
    - Preferred master
    - Preferred communication channel
  - **Visit History Tab:**
    - Chronological list of all appointments (past and upcoming)
    - Each entry shows: Date, Service, Master, Price, Status
    - Sorted by date (newest first)
  - **Communication Tab:**
    - Message history across all channels
    - Channel icons for each conversation
  - **Notes Tab:**
    - Internal notes added by staff
    - Service preferences
    - Allergies or special requirements
  - **Preferences Tab:**
    - Auto-detected preferences (preferred master, usual services)
    - Notification preferences
- All data loads quickly
- Tabs switch without page reload

---

### Test Case TC-CLIENT-006: Add Client Manually

**Priority:** Medium
**User Story:** US-009

**Description:** Verify that admin can manually add a new client

**Preconditions:**
- User is logged in as SALON_ADMIN

**Test Steps:**
1. Navigate to Clients page
2. Click "Add Client" button
3. Fill in client details:
   - Name: "Elena Sokolova"
   - Phone: "+1987654321"
   - Email: "elena@example.com" (optional)
   - Preferred master: "Alina Petrova"
   - Notes: "Regular customer, prefers natural colors"
4. Click "Save Client"

**Expected Results:**
- Client is created successfully
- Client appears in clients list
- All entered information is saved
- Tenant ID is correctly associated
- Success notification: "Client added successfully"
- Profile can be viewed immediately

---

### Test Case TC-CLIENT-007: Edit Client Information

**Priority:** Medium
**User Story:** US-009, US-015

**Description:** Verify that admin can update client profile information

**Preconditions:**
- Client "Katya Ivanova" exists

**Test Steps:**
1. Open Katya's client profile
2. Click "Edit" button
3. Update fields:
   - Email: "katya.new@example.com"
   - Preferred master: Change to "Dasha"
   - Add note: "Allergic to product X"
4. Click "Save Changes"

**Expected Results:**
- Changes are saved successfully
- Updated information displays immediately
- Email is validated before saving
- Success notification shown
- Edit history is tracked (optional feature)

---

### Test Case TC-CLIENT-008: View Client Visit History

**Priority:** High
**User Story:** US-009, US-015

**Description:** Verify that complete visit history is displayed for a client

**Preconditions:**
- Client "Katya Ivanova" has multiple appointments (past and future)

**Test Steps:**
1. Open Katya's client profile
2. Navigate to "Visits" or "History" tab
3. Review appointment list

**Expected Results:**
- All appointments are listed (past, upcoming, cancelled)
- Each appointment shows:
  - Date and time
  - Service name and duration
  - Master name
  - Price
  - Status (Completed, Upcoming, Cancelled, No-Show)
- List is sorted chronologically (most recent first)
- Cancelled and no-show appointments are clearly marked
- Total visit count is accurate
- Can click appointment to see full details

---

### Test Case TC-CLIENT-009: Track Client Preferences

**Priority:** Medium
**User Story:** US-015

**Description:** Verify that system tracks and displays client preferences

**Preconditions:**
- Client "Katya" has 5 past appointments:
  - 4 with master "Alina"
  - 3 services were "Hair Coloring"
  - Usually books on Saturdays
  - Always books via WhatsApp

**Test Steps:**
1. Open Katya's profile
2. Navigate to "Preferences" or "Insights" section
3. Review auto-detected preferences

**Expected Results:**
- System displays:
  - Preferred master: Alina Petrova (based on frequency)
  - Typical service: Hair Coloring
  - Preferred day: Saturday
  - Preferred time: (if pattern exists, e.g., "10:00-12:00")
  - Preferred channel: WhatsApp
- Preferences are calculated from historical data
- Manual override option available for admin
- AI uses these preferences to suggest defaults in future bookings

---

### Test Case TC-CLIENT-010: Add Internal Notes to Client Profile

**Priority:** Medium
**User Story:** US-015

**Description:** Verify that admin/master can add private notes to client profile

**Preconditions:**
- Client "Katya" profile is open
- User has permission to add notes

**Test Steps:**
1. Navigate to "Notes" tab
2. Click "Add Note"
3. Enter note:
   - "Client prefers warm blonde tones. Last visit: requested highlights near face. Very happy with results."
4. Save note
5. Add another note from different user/master

**Expected Results:**
- Note is saved successfully
- Note displays with:
  - Note content
  - Author (who added it)
  - Timestamp
- Notes are visible to all staff (not to client)
- Notes are sorted by date (newest first)
- Master sees these notes before appointment
- Notes can be edited or deleted by author or admin

---

### Test Case TC-CLIENT-011: Merge Duplicate Client Profiles

**Priority:** Medium
**User Story:** US-015

**Description:** Verify that admin can merge duplicate client profiles

**Preconditions:**
- Two profiles exist for same person:
  - Profile A: "Katya Ivanova" (from WhatsApp, phone: +1234567890)
  - Profile B: "Katya I." (from Facebook Messenger, different identifier)

**Test Steps:**
1. Navigate to Clients page
2. Identify duplicate profiles
3. Select both profiles
4. Click "Merge Profiles"
5. Choose primary profile (Profile A)
6. Confirm merge

**Expected Results:**
- Profiles are merged into one
- All appointments from both profiles are combined
- All communication history from both channels is preserved
- Profile A (primary) retains name and main details
- Profile B's unique data (e.g., Facebook ID) is added to Profile A
- Profile B is archived (not deleted)
- No data loss occurs
- Merged profile shows complete history

---

### Test Case TC-CLIENT-012: Filter Clients by Various Criteria

**Priority:** Medium
**User Story:** US-009

**Description:** Verify that admin can filter client list

**Preconditions:**
- Multiple clients exist with different attributes

**Test Steps:**
1. Navigate to Clients page
2. Apply filters:
   - Test 1: Filter by preferred master: "Alina"
   - Test 2: Filter by last visit: "Last 30 days"
   - Test 3: Filter by total visits: "> 5 visits"
   - Test 4: Combine filters: Master "Alina" AND Last 30 days
3. Observe results for each filter

**Expected Results:**
- Each filter works correctly
- Results update immediately
- Combined filters use AND logic
- Filter count shows number of results
- Filters can be cleared easily
- No filter applied shows all clients

---

### Test Case TC-CLIENT-013: Export Client Data (GDPR)

**Priority:** High
**User Story:** US-015

**Description:** Verify that client data can be exported for GDPR compliance

**Preconditions:**
- Client "Katya Ivanova" exists with complete profile

**Test Steps:**
1. Open Katya's profile
2. Click "Export Data" button (GDPR compliance feature)
3. Confirm export

**Expected Results:**
- Data export file is generated (JSON or CSV format)
- Export includes:
  - Personal information (name, phone, email)
  - Visit history (all appointments)
  - Communication history
  - Preferences
  - Internal notes (if legally required to include)
  - All data associated with this client
- File downloads successfully
- Export action is logged
- Client can request this via AI/message (triggers admin notification)

---

### Test Case TC-CLIENT-014: Delete Client Data (GDPR)

**Priority:** High
**User Story:** US-015

**Description:** Verify that client data can be deleted per GDPR requirements

**Preconditions:**
- Client "Katya Ivanova" requests data deletion

**Test Steps:**
1. Open Katya's profile
2. Click "Delete Client Data" (danger zone)
3. Review warning about future appointments
4. Confirm deletion with password or two-step verification

**Expected Results:**
- Warning shows: "This will permanently delete all personal data"
- If future appointments exist, admin must cancel them first
- PII is removed:
  - Name, phone, email are deleted or anonymized
  - Communication history is deleted
- Appointment records are retained for business purposes but anonymized:
  - Client name changed to "Deleted Client [ID]"
  - Phone/email removed
  - Service/payment data retained (financial records)
- Deletion is logged
- Process complies with GDPR "right to be forgotten"
- Confirmation email sent to client (if email available)

---

### Test Case TC-CLIENT-015: Import Clients from CSV

**Priority:** Low
**User Story:** US-009

**Description:** Verify that admin can bulk import clients from CSV file

**Preconditions:**
- User has CSV file with client data
- CSV format: Name, Phone, Email, Notes

**Test Steps:**
1. Navigate to Clients page
2. Click "Import Clients"
3. Upload CSV file
4. Map CSV columns to client fields
5. Preview import (shows first 5 rows)
6. Handle duplicates: Skip/Update/Create new
7. Confirm import

**Expected Results:**
- CSV file is parsed correctly
- Column mapping interface is user-friendly
- Preview shows accurate data
- Duplicate detection works (by phone number)
- Import completes successfully
- Success message shows: "X clients imported, Y skipped (duplicates)"
- Imported clients appear in list
- All clients are associated with correct tenant

---

## CLIENT COMMUNICATION HISTORY

### Test Case TC-CLIENT-016: View Client Communication History

**Priority:** Medium
**User Story:** US-015

**Description:** Verify that admin can view all communication history with a client

**Preconditions:**
- Client "Katya" has communicated via WhatsApp and Facebook Messenger
- Conversation history exists

**Test Steps:**
1. Open Katya's profile
2. Navigate to "Communications" or "Messages" tab
3. Review conversation history

**Expected Results:**
- All conversations are displayed
- Grouped by channel (WhatsApp, Messenger, SMS)
- Each conversation shows:
  - Channel icon/badge
  - Date/time of conversation
  - Message preview
  - Click to expand full conversation
- Conversations sorted by date (newest first)
- AI and client messages are distinguished
- Admin can view but not edit past messages

---

### Test Case TC-CLIENT-017: Send Manual Message to Client

**Priority:** Medium
**User Story:** US-015

**Description:** Verify that admin can manually send message to client

**Preconditions:**
- Client "Katya" profile is open
- Client's preferred channel is WhatsApp

**Test Steps:**
1. In Katya's profile, click "Send Message"
2. Select channel: WhatsApp (auto-selected if only one available)
3. Type message: "Hi Katya! We have a new service you might be interested in. Would you like to hear more?"
4. Click "Send"

**Expected Results:**
- Message is sent via WhatsApp to client's phone
- Message appears in communication history
- Sent status is confirmed
- If client replies, reply appears in conversation
- Admin can see delivery/read status (if supported by channel)

---

## Edge Cases and Error Scenarios

### TC-CLIENT-018: Duplicate Phone Number Prevention

**Priority:** High
**Description:** Verify that duplicate phone numbers are prevented or merged

**Test Steps:**
1. Attempt to add new client with phone number that already exists

**Expected Results:**
- Warning: "Client with this phone number already exists"
- Options: View existing profile, Merge, or Go back
- No duplicate is created

---

### TC-CLIENT-019: Invalid Phone Number Format

**Priority:** Medium
**Description:** Verify validation of phone number format

**Test Steps:**
1. Attempt to add client with invalid phone: "12345"

**Expected Results:**
- Validation error: "Please enter a valid phone number"
- Suggested format shown
- Client is not saved

---

### TC-CLIENT-020: Client with No Visit History

**Priority:** Low
**Description:** Verify UI handles clients with no appointments

**Test Steps:**
1. View profile of newly created client with no visits

**Expected Results:**
- Visit history tab shows empty state message: "No appointments yet"
- Offer to create first appointment
- No errors or broken UI

---

### TC-CLIENT-021: Multi-Tenant Client Isolation

**Priority:** Critical
**Description:** Verify that clients from different tenants are isolated

**Preconditions:**
- Tenant A has client "Katya" with phone +1111111111
- Tenant B has different client "Elena" with phone +2222222222

**Test Steps:**
1. Log in as Tenant A admin
2. View Clients page
3. Search for client with phone +2222222222 (Tenant B's client)

**Expected Results:**
- No results found
- Only Tenant A's clients are visible
- Database queries include tenant_id filter
- No data leakage between tenants

---

## Summary

**Total Test Cases:** 21
- Critical Priority: 4
- High Priority: 9
- Medium Priority: 7
- Low Priority: 1

**Coverage:**
- Client Profile Creation & Viewing: 5 test cases
- Client Search & Filtering: 3 test cases
- Client Data Management: 5 test cases
- Client Preferences & Notes: 3 test cases
- Communication History: 2 test cases
- GDPR Compliance: 2 test cases
- Edge Cases: 4 test cases

**Estimated Testing Time:** 2-3 hours for full manual execution

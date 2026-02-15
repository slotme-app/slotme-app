# US-010: WhatsApp Channel Integration - E2E Test Cases

## Story Summary
As a salon owner, I want to connect my salon's WhatsApp Business number, so that clients can book via WhatsApp. This includes the channel setup page with WhatsApp configuration and connection status display.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- Channels page is accessible

## Test Cases

### TC-010-01: Display Channels Page
**Priority:** High
**Description:** Verify the channels management page renders with the heading and WhatsApp section.

**Steps:**
1. Navigate to `/admin/channels` -> **Expected:** Channels page loads
2. Check for "Channels" heading -> **Expected:** Heading is visible
3. Check for "WhatsApp Business" section -> **Expected:** WhatsApp configuration section is visible

### TC-010-02: Display WhatsApp Configuration Fields
**Priority:** High
**Description:** Verify the WhatsApp configuration form has all required fields.

**Steps:**
1. Navigate to `/admin/channels` -> **Expected:** Channels page loads
2. Check for "Phone Number ID" field -> **Expected:** Input labeled "Phone Number ID" is visible
3. Check for "Access Token" field -> **Expected:** Input labeled "Access Token" is visible
4. Check for "Verify Token" field -> **Expected:** Input labeled "Verify Token" is visible

### TC-010-03: Save Configuration Button
**Priority:** High
**Description:** Verify the save configuration button is present.

**Steps:**
1. Navigate to `/admin/channels` -> **Expected:** Channels page loads
2. Check for "Save Configuration" button -> **Expected:** Button with text matching "save configuration" is visible

### TC-010-04: Test Connection Button
**Priority:** High
**Description:** Verify the test connection button is present.

**Steps:**
1. Navigate to `/admin/channels` -> **Expected:** Channels page loads
2. Check for "Test Connection" button -> **Expected:** Button with text matching "test connection" is visible

### TC-010-05: Save WhatsApp Configuration
**Priority:** High
**Description:** Verify WhatsApp credentials can be saved.

**Steps:**
1. Navigate to `/admin/channels` -> **Expected:** Channels page loads
2. Fill "Phone Number ID": "1234567890" -> **Expected:** Field accepts input
3. Fill "Access Token": "test-access-token-value" -> **Expected:** Field accepts input
4. Fill "Verify Token": "test-verify-token" -> **Expected:** Field accepts input
5. Click "Save Configuration" button -> **Expected:** Configuration is saved, success message appears

### TC-010-06: Test Connection
**Priority:** Medium
**Description:** Verify the test connection functionality (may fail with invalid credentials but should not crash).

**Steps:**
1. Navigate to `/admin/channels` -> **Expected:** Channels page loads
2. Fill configuration fields with test values -> **Expected:** Fields populated
3. Click "Test Connection" button -> **Expected:** Test is initiated, either success or clear error message about invalid credentials

### TC-010-07: Show Conversations Link
**Priority:** High
**Description:** Verify the conversations link/card is displayed.

**Steps:**
1. Navigate to `/admin/channels` -> **Expected:** Channels page loads
2. Check for "Conversations" text -> **Expected:** Conversations section or card is visible
3. Check for "View Conversations" link/button -> **Expected:** Link to view conversations is visible

### TC-010-08: Navigate to Conversations Page
**Priority:** High
**Description:** Verify navigation to the conversations page.

**Steps:**
1. Navigate to `/admin/channels/conversations` -> **Expected:** Conversations page loads
2. Check for "Conversations" heading -> **Expected:** Heading is visible
3. Check for description text about AI-assisted conversations -> **Expected:** Descriptive text is present

### TC-010-09: Conversations Page Empty State
**Priority:** Medium
**Description:** Verify the conversations page shows an empty state when no conversations exist.

**Steps:**
1. Navigate to `/admin/channels/conversations` -> **Expected:** Conversations page loads
2. If no conversations exist -> **Expected:** "No conversations yet" or similar empty state message is shown

### TC-010-10: Channel Status Display
**Priority:** Medium
**Description:** Verify the channel status indicator shows connected/disconnected state.

**Steps:**
1. Navigate to `/admin/channels` -> **Expected:** Channels page loads
2. Check for status indicator -> **Expected:** Connection status (connected/disconnected) is visible as a badge, icon, or text

## Edge Cases

### EC-010-01: Save Empty Configuration
**Description:** Verify validation when trying to save empty WhatsApp credentials.

**Steps:**
1. Navigate to `/admin/channels` -> **Expected:** Channels page loads
2. Clear all fields -> **Expected:** Fields are empty
3. Click "Save Configuration" -> **Expected:** Validation errors for required fields

### EC-010-02: Back Navigation from Conversations
**Description:** Verify the back button from conversations returns to channels.

**Steps:**
1. Navigate to `/admin/channels/conversations` -> **Expected:** Conversations page loads
2. Click the back button -> **Expected:** Navigated back to `/admin/channels`

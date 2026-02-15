# US-011: AI Conversation Engine - E2E Test Cases

## Story Summary
As a client, I want to send a WhatsApp message and have an AI guide me through booking, so that I can book an appointment conversationally without calling the salon. The frontend aspects include the conversation viewer (list of conversations and message thread view) and conversation detail with message bubbles.

## Preconditions
- App is running on http://localhost:2999
- Authenticated as admin (admin@slotme-demo.com / demo-password-123)
- WhatsApp channel is configured
- At least one conversation exists (or create one via the API)

## Test Cases

### TC-011-01: Display Conversations List
**Priority:** High
**Description:** Verify the conversations list page shows all conversations.

**Steps:**
1. Navigate to `/admin/channels/conversations` -> **Expected:** Conversations page loads
2. Check for "Conversations" heading -> **Expected:** Heading is visible
3. Check for conversation entries -> **Expected:** List of conversations or empty state is shown
4. Each conversation entry should show client name/number and last message preview -> **Expected:** Conversation summaries are visible

### TC-011-02: Conversations Empty State
**Priority:** Medium
**Description:** Verify the empty state when no conversations exist.

**Steps:**
1. Navigate to `/admin/channels/conversations` (with no conversations) -> **Expected:** Page loads
2. Check for empty state message -> **Expected:** "No conversations yet" message is visible

### TC-011-03: Select Conversation from List
**Priority:** High
**Description:** Verify clicking a conversation opens the message thread.

**Steps:**
1. Navigate to `/admin/channels/conversations` with existing conversations -> **Expected:** Conversation list loads
2. Click on a conversation entry -> **Expected:** Message thread view opens or expands
3. Check for message bubbles -> **Expected:** Message bubbles are visible, showing the conversation history

### TC-011-04: Message Bubble Styling - AI vs Client
**Priority:** Medium
**Description:** Verify AI messages and client messages have distinct visual styling.

**Steps:**
1. Open a conversation with both AI and client messages -> **Expected:** Message thread loads
2. Check AI messages -> **Expected:** AI messages have a distinct style (e.g., different background color, alignment)
3. Check client messages -> **Expected:** Client messages have a different style from AI messages
4. Verify visual distinction -> **Expected:** It is clear which messages are from the AI and which from the client

### TC-011-05: Conversation Detail Information
**Priority:** High
**Description:** Verify conversation detail shows metadata about the conversation.

**Steps:**
1. Open a conversation -> **Expected:** Conversation detail loads
2. Check for client name/phone -> **Expected:** Client identifier is visible
3. Check for channel indicator (WhatsApp) -> **Expected:** Channel source is shown
4. Check for conversation status -> **Expected:** Status (AI Handling, Escalated, Resolved) is visible

### TC-011-06: Conversation Message Ordering
**Priority:** High
**Description:** Verify messages in a conversation are displayed in chronological order.

**Steps:**
1. Open a conversation with multiple messages -> **Expected:** Message thread loads
2. Check message ordering -> **Expected:** Messages are in chronological order (oldest at top, newest at bottom)
3. Check for timestamps -> **Expected:** Each message or message group has a timestamp

### TC-011-07: Escalated Conversation Indicator
**Priority:** Medium
**Description:** Verify escalated conversations are visually distinguished in the list.

**Steps:**
1. Navigate to `/admin/channels/conversations` with an escalated conversation -> **Expected:** Conversation list loads
2. Check for escalated badge or indicator -> **Expected:** Escalated conversations have a distinct visual marker (badge, icon, or color)

### TC-011-08: Filter Conversations
**Priority:** Medium
**Description:** Verify conversations can be filtered by status or channel.

**Steps:**
1. Navigate to `/admin/channels/conversations` -> **Expected:** Conversations page loads
2. Look for filter controls (status filter, channel filter) -> **Expected:** Filter options are available
3. Apply a filter -> **Expected:** Conversation list updates to show only matching conversations

## Edge Cases

### EC-011-01: Long Conversation Thread
**Description:** Verify the UI handles a conversation with many messages.

**Steps:**
1. Open a conversation with 50+ messages -> **Expected:** Messages load and are scrollable
2. Scroll through the thread -> **Expected:** All messages render without performance issues
3. Newest messages are visible at the bottom -> **Expected:** Thread auto-scrolls or allows manual scroll to bottom

### EC-011-02: Conversation with Special Characters
**Description:** Verify messages with emojis and special characters render correctly.

**Steps:**
1. Open a conversation that includes emojis and special characters -> **Expected:** Characters render correctly without corruption or missing glyphs

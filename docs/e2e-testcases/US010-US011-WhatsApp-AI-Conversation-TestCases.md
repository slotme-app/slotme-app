# E2E Test Cases: WhatsApp Integration & AI Conversation Engine

**Feature:** US-010 WhatsApp Channel Integration, US-011 AI Conversation Engine
**Version:** 1.0
**Last Updated:** 2026-02-15
**Status:** Ready for Testing

---

## WHATSAPP INTEGRATION (US-010)

### Test Case TC-WA-001: Configure WhatsApp Business API

**Priority:** Critical
**User Story:** US-010

**Description:** Verify that salon admin can configure WhatsApp Business API connection

**Preconditions:**
- User is logged in as SALON_ADMIN
- Admin has WhatsApp Business API credentials (via BSP like Twilio/360Dialog)
- Business verification is complete with Meta

**Test Steps:**
1. Navigate to Settings > Communication Channels
2. Click "Connect WhatsApp" button
3. Follow OAuth flow or enter credentials:
   - Access Token
   - Phone Number ID
   - Business Account ID
   - Webhook Verify Token (for webhook security)
4. Complete verification
5. Click "Test Connection"

**Expected Results:**
- OAuth flow redirects to Facebook/WhatsApp login
- Permissions are granted
- Connection is established
- Status shows "Connected" with green indicator
- Test message is successfully sent to configured number
- Webhook is registered with WhatsApp API
- Configuration is saved in database
- Channel appears as "Active" in channels list

---

### Test Case TC-WA-002: Receive WhatsApp Webhook Verification

**Priority:** Critical
**User Story:** US-010

**Description:** Verify that webhook endpoint correctly handles verification challenge from WhatsApp

**Preconditions:**
- WhatsApp Business API is being configured
- Webhook URL is set to: `https://your-backend.com/api/v1/webhooks/whatsapp`

**Test Steps:**
1. WhatsApp/Meta sends GET request to webhook URL:
   - Parameters: `hub.mode=subscribe`, `hub.verify_token=YOUR_TOKEN`, `hub.challenge=RANDOM_STRING`
2. Backend webhook controller receives request
3. Verify token matches configured token
4. Return challenge value

**Expected Results:**
- Backend validates `hub.verify_token`
- If valid, returns `hub.challenge` value as plain text
- Status code: 200 OK
- If invalid token, returns 403 Forbidden
- Webhook verification succeeds on WhatsApp side
- Connection is established

---

### Test Case TC-WA-003: Receive Incoming WhatsApp Message

**Priority:** Critical
**User Story:** US-010

**Description:** Verify that system receives and processes incoming WhatsApp messages

**Preconditions:**
- WhatsApp integration is active
- Client phone: +1234567890
- Client is not yet in database

**Test Steps:**
1. Client sends WhatsApp message to salon's business number: "Hi"
2. WhatsApp API sends POST webhook to backend
3. Backend receives webhook payload
4. Observe system behavior

**Expected Results:**
- Webhook endpoint receives POST request
- Signature verification succeeds (X-Hub-Signature-256 header)
- Tenant is resolved from phone_number_id
- TenantContext is set correctly
- Message is extracted from payload:
  - From: +1234567890
  - Text: "Hi"
  - Timestamp
- Client profile is auto-created (phone +1234567890)
- Conversation is created or resumed
- Message is passed to AI conversation engine
- AI response is generated and sent (tested in TC-AI-001)
- Message is logged in conversation history

---

### Test Case TC-WA-004: Send WhatsApp Message to Client

**Priority:** Critical
**User Story:** US-010

**Description:** Verify that system can send WhatsApp messages to clients

**Preconditions:**
- WhatsApp integration is active
- Client exists with phone: +1234567890

**Test Steps:**
1. AI generates response message (or admin manually sends)
2. System calls WhatsApp API to send message
3. Message content: "Hello! Welcome to Beauty Studio. How can I help you?"

**Expected Results:**
- API call to WhatsApp Cloud API succeeds
- Message is sent to client's WhatsApp number
- Response from WhatsApp API includes:
  - Message ID
  - Status: sent/delivered/read
- Message status is tracked in database
- Client receives message on their WhatsApp app
- Message appears in conversation history
- Delivery status updates (delivered, read) are received via webhook

---

### Test Case TC-WA-005: Webhook Signature Verification

**Priority:** High
**User Story:** US-010

**Description:** Verify that webhook rejects requests with invalid signatures (security)

**Preconditions:**
- WhatsApp webhook is configured
- App Secret is stored securely

**Test Steps:**
1. Send POST request to webhook endpoint with:
   - Valid payload
   - INVALID X-Hub-Signature-256 header (wrong signature)
2. Observe backend behavior

**Expected Results:**
- Backend calculates expected signature using HMAC SHA256
- Compares received signature with calculated signature
- Signatures don't match
- Request is REJECTED with 403 Forbidden
- Payload is NOT processed
- Security log entry created
- No message is created or AI called

---

### Test Case TC-WA-006: Tenant Resolution from Phone Number ID

**Priority:** Critical
**User Story:** US-010

**Description:** Verify that correct tenant is identified from WhatsApp phone_number_id

**Preconditions:**
- Tenant A uses phone_number_id: 111111111111
- Tenant B uses phone_number_id: 222222222222
- Both tenants have WhatsApp configured

**Test Steps:**
1. Incoming message webhook for Tenant A (phone_number_id: 111111111111)
2. Backend processes message
3. Verify tenant resolution

**Expected Results:**
- System looks up phone_number_id in communication_channels table
- Correct tenant (Tenant A) is identified
- TenantContext is set to Tenant A's tenant_id
- All subsequent DB queries are scoped to Tenant A
- Message is processed for Tenant A's client
- No cross-tenant data leakage

---

### Test Case TC-WA-007: WhatsApp Template Message Support

**Priority:** Medium
**User Story:** US-010

**Description:** Verify that system can send WhatsApp template messages for proactive notifications

**Preconditions:**
- WhatsApp templates are approved by Meta
- Template name: "appointment_reminder"
- 24-hour message window has expired

**Test Steps:**
1. System needs to send appointment reminder (outside 24h window)
2. System selects approved template
3. Populates template variables:
   - `{{client_name}}`: "Katya"
   - `{{service}}`: "Haircut"
   - `{{date}}`: "March 15"
   - `{{time}}`: "10:00 AM"
4. Sends template message

**Expected Results:**
- Template message API is called
- Template is sent successfully
- Client receives formatted template message
- Message includes call-to-action buttons (if configured)
- Message status is tracked
- Template message count is tracked for billing

---

## AI CONVERSATION ENGINE (US-011)

### Test Case TC-AI-001: AI Greeting for New Client

**Priority:** Critical
**User Story:** US-011

**Description:** Verify that AI sends appropriate greeting to new client

**Preconditions:**
- WhatsApp integration is active
- New client (first contact)
- Client sends: "Hi"

**Test Steps:**
1. Client sends message: "Hi"
2. System receives message
3. AI processes message and generates response

**Expected Results:**
- AI recognizes greeting intent
- AI generates welcome message:
  - "Hello! Welcome to [Salon Name]! I'm your virtual assistant."
  - "I can help you book an appointment. What service are you looking for?"
  - Lists 3-5 popular services with duration and price
- Response is sent within 3 seconds
- Conversation is created in database
- Conversation status: "AI_HANDLING"

---

### Test Case TC-AI-002: AI Recognizes Booking Intent

**Priority:** Critical
**User Story:** US-011

**Description:** Verify that AI correctly identifies booking intent from various client messages

**Preconditions:**
- Conversation exists
- AI is active

**Test Steps:**
1. Test various booking intent messages:
   - "I want to book an appointment"
   - "Book me for haircut"
   - "Can I schedule a coloring?"
   - "I need an appointment tomorrow"
   - "When is Alina available?"
2. Observe AI responses

**Expected Results:**
- All messages are recognized as BOOKING intent
- AI responds appropriately:
  - Confirms intent: "I'd be happy to help you book"
  - Asks for service if not specified
  - Asks for preferred master if not specified
  - Asks for preferred date/time if not specified
- Intent confidence is high (> 0.8)
- Conversation context tracks booking intent

---

### Test Case TC-AI-003: Complete Booking Flow via AI

**Priority:** Critical
**User Story:** US-011

**Description:** Verify that AI can complete entire booking process

**Preconditions:**
- Client "Katya" (returning client)
- Master "Alina" is available
- Service "Hair Coloring" exists

**Test Steps:**
1. Client: "I want to book hair coloring"
2. AI: "Great! For hair coloring, we have Alina and Dasha. Who do you prefer?"
3. Client: "Alina please"
4. AI: "Alina has these available slots for hair coloring (120 min): [lists slots]"
5. Client: "Wednesday at 2pm"
6. AI: "Perfect! Let me confirm: Hair Coloring with Alina on Wed, March 15 at 2:00 PM ($80). Shall I book this?"
7. Client: "Yes"
8. AI: Creates appointment via tool call
9. AI: "All booked! You'll get a reminder 24 hours before. See you Wednesday!"

**Expected Results:**
- AI guides through complete flow
- AI remembers context (service, master) between messages
- AI calls `check_availability` tool to get real slots
- Available slots are accurate
- AI calls `book_appointment` tool with correct parameters:
  - client_id, master_id, service_id, date, time
- Appointment is successfully created
- Confirmation message is sent
- Client profile is updated
- Master is notified
- Booking is tracked in analytics

---

### Test Case TC-AI-004: AI Handles Ambiguous Service Request

**Priority:** High
**User Story:** US-011

**Description:** Verify that AI asks clarifying questions for ambiguous requests

**Preconditions:**
- Multiple services exist under "Hair" category

**Test Steps:**
1. Client: "I want something for my hair"
2. Observe AI response

**Expected Results:**
- AI recognizes ambiguity
- AI asks clarification:
  - "We have several hair services! Which interests you?"
  - Lists: Haircut, Coloring, Treatment, Blowout (with prices)
  - "Or describe what you have in mind!"
- AI does NOT make assumptions
- AI waits for client to specify
- Conversation context updated: awaiting service selection

---

### Test Case TC-AI-005: AI Proposes Alternative Times When Unavailable

**Priority:** High
**User Story:** US-011

**Description:** Verify that AI suggests alternatives when requested slot is unavailable

**Preconditions:**
- Client requests master "Alina" on Wednesday at 2:00 PM
- Alina is fully booked on that day
- Alina has availability on Thursday

**Test Steps:**
1. Client: "I want to book with Alina on Wednesday at 2pm"
2. AI checks availability (slot not available)
3. AI generates response

**Expected Results:**
- AI acknowledges request
- AI informs client that slot is unavailable:
  - "Unfortunately, Alina doesn't have availability at 2pm on Wednesday."
- AI offers alternatives:
  - Option 1: "Alina is available on Thursday at [times]"
  - Option 2: "Dasha is available on Wednesday at 2pm for the same service"
  - Option 3: "Would you like me to add you to the waitlist for Wednesday at 2pm?"
- Client can choose from alternatives
- No booking is made without confirmation

---

### Test Case TC-AI-006: AI Tool Call - check_availability

**Priority:** Critical
**User Story:** US-011

**Description:** Verify that AI correctly uses check_availability tool

**Preconditions:**
- AI conversation is in progress
- Client has specified service and master

**Test Steps:**
1. Client asks: "When is Alina available for haircut next week?"
2. AI recognizes need to check availability
3. AI calls tool: `check_availability`
   - Parameters: `master_id={alina_id}`, `service_id={haircut_id}`, `start_date=next Monday`, `end_date=next Friday`
4. Tool returns available slots
5. AI presents results to client

**Expected Results:**
- AI correctly identifies parameters from context
- Tool call is made with valid parameters
- Tool returns actual available slots from database
- AI formats slots in user-friendly way:
  - "This week: Mon 10am, 2pm | Tue 11am, 3pm"
  - Groups by day
  - Maximum 3-5 options per response (not overwhelming)
- AI waits for client selection

---

### Test Case TC-AI-007: AI Tool Call - book_appointment

**Priority:** Critical
**User Story:** US-011

**Description:** Verify that AI correctly uses book_appointment tool

**Preconditions:**
- Client has confirmed booking details
- All required info collected: client, master, service, date, time

**Test Steps:**
1. Client confirms: "Yes, book it"
2. AI calls tool: `book_appointment`
   - Parameters: `client_id`, `master_id`, `service_id`, `date`, `start_time`
3. Tool executes booking logic
4. Tool returns success with appointment_id

**Expected Results:**
- Tool call parameters are correct
- Appointment is created in database
- Tool returns: `{success: true, appointment_id: 123, confirmation: "..."}`
- AI receives tool result
- AI sends confirmation to client with all details
- No duplicate booking (idempotency check)

---

### Test Case TC-AI-008: AI Tool Call - cancel_appointment

**Priority:** High
**User Story:** US-011

**Description:** Verify that AI can process cancellation requests

**Preconditions:**
- Client has upcoming appointment
- Client "Katya" has appointment on March 15 at 2pm

**Test Steps:**
1. Client: "I need to cancel my appointment"
2. AI: Looks up upcoming appointments for client
3. AI: "I see your appointment: Haircut with Alina on Wed March 15 at 2pm. Are you sure you want to cancel?"
4. Client: "Yes, cancel it"
5. AI calls tool: `cancel_appointment`
   - Parameters: `appointment_id`, `reason="client requested"`
6. Tool cancels appointment

**Expected Results:**
- AI finds correct appointment(s) for client
- If multiple appointments, AI lists them and asks which to cancel
- AI confirms before cancelling
- Tool call succeeds
- Appointment status changes to CANCELLED
- AI sends confirmation: "Your appointment has been cancelled. We hope to see you soon!"
- Master is notified
- Slot becomes available again

---

### Test Case TC-AI-009: AI Escalates to Human When Needed

**Priority:** High
**User Story:** US-011

**Description:** Verify that AI escalates complex requests to human admin

**Preconditions:**
- AI has failed to understand client request 3 times

**Test Steps:**
1. Client sends unclear message: "I want something special for next week but not sure what"
2. AI: Asks clarification
3. Client: Another unclear message
4. AI: Asks again
5. Client: Still unclear
6. AI recognizes it cannot help

**Expected Results:**
- After 2-3 failed attempts to understand, AI escalates
- AI calls tool: `escalate_to_staff`
- AI message: "I want to make sure you get the best help. Let me connect you with our team. Someone will respond shortly."
- Conversation status changes to "ESCALATED"
- Admin receives notification with:
  - Client name
  - Full conversation context
  - Reason for escalation
- Admin can take over conversation
- Client is informed of handoff

---

### Test Case TC-AI-010: AI Handles Cancellation Rescheduling

**Priority:** Medium
**User Story:** US-011

**Description:** Verify that AI can handle combined cancel and reschedule requests

**Preconditions:**
- Client has appointment on March 15

**Test Steps:**
1. Client: "I need to reschedule my Wednesday appointment to Friday"
2. AI processes request

**Expected Results:**
- AI recognizes reschedule intent
- AI identifies existing appointment
- AI checks availability for Friday
- AI calls tool: `reschedule_appointment`
  - Parameters: `appointment_id`, `new_date`, `new_time`
- Old appointment slot freed
- New slot booked
- AI confirms: "Your appointment has been moved from Wednesday 2pm to Friday 2pm. Updated confirmation sent!"

---

### Test Case TC-AI-011: AI Conversation Context Persistence

**Priority:** High
**User Story:** US-011

**Description:** Verify that AI maintains conversation context across multiple messages

**Preconditions:**
- Conversation is in progress

**Test Steps:**
1. Client: "I want to book hair coloring"
2. AI: "Great! Who do you prefer: Alina or Dasha?"
3. Client: "Alina" (does NOT repeat "hair coloring")
4. AI should remember service from step 1
5. Client: "Next Wednesday" (does NOT repeat service or master)
6. AI should remember both service and master

**Expected Results:**
- AI maintains context throughout conversation
- Client doesn't need to repeat information
- Context stored in conversation memory:
  - service: Hair Coloring
  - master: Alina
  - date: Next Wednesday
- AI uses context to fill tool call parameters
- Context is stored in Redis or database JSONB field
- Context expires after 30 min of inactivity

---

### Test Case TC-AI-012: AI Handles Multiple Services Booking

**Priority:** Medium
**User Story:** US-011

**Description:** Verify that AI can book multiple services in one conversation

**Preconditions:**
- Services exist: Haircut (60 min), Manicure (45 min)

**Test Steps:**
1. Client: "I want haircut and manicure for tomorrow"
2. AI recognizes multi-service request
3. AI: "I can book both! Would you like them back-to-back or at separate times?"
4. Client: "Back-to-back"
5. AI checks availability for combined duration (105 min)
6. AI proposes slots

**Expected Results:**
- AI recognizes multiple services
- AI offers consecutive or separate booking options
- If back-to-back:
  - Total duration calculated correctly
  - Single continuous time block found
  - Both services booked in sequence
- Total price calculated: $40 + $25 = $65
- Single appointment created with multiple services
  OR two linked appointments

---

### Test Case TC-AI-013: AI Multi-Language Support

**Priority:** Medium
**User Story:** US-011

**Description:** Verify that AI can converse in multiple languages

**Preconditions:**
- Salon supports English and Spanish
- AI model supports both languages

**Test Steps:**
1. Client sends message in Spanish: "Hola, quiero reservar un corte de pelo"
2. AI detects language
3. AI responds in Spanish
4. Client switches to English mid-conversation

**Expected Results:**
- AI detects Spanish from first message
- AI responds in Spanish throughout
- If client switches language, AI adapts
- Language preference is saved for future conversations
- All booking confirmations sent in client's preferred language

---

### Test Case TC-AI-014: AI FAQ Handling

**Priority:** Low
**User Story:** US-011

**Description:** Verify that AI can answer common questions without booking

**Preconditions:**
- FAQ configured in admin settings

**Test Steps:**
1. Client: "What are your hours?"
2. AI responds with salon hours
3. Client: "Where are you located?"
4. AI responds with address
5. Client: "What services do you offer?"
6. AI lists service categories

**Expected Results:**
- AI answers FAQs correctly
- Information pulled from salon settings
- No booking is initiated
- AI can transition to booking if client expresses intent
- Responses are concise and helpful

---

## Edge Cases and Error Scenarios

### TC-AI-015: AI Handles Simultaneous Messages

**Priority:** Medium
**Description:** Verify behavior when client sends multiple messages rapidly

**Test Steps:**
1. Client sends 3 messages in quick succession:
   - "I want haircut"
   - "Tomorrow"
   - "With Alina"

**Expected Results:**
- All messages are received
- AI processes them in order
- Context is built cumulatively
- AI response includes all gathered information
- No messages are lost

---

### TC-WA-008: WhatsApp API Rate Limiting

**Priority:** Medium
**Description:** Verify handling of WhatsApp API rate limits

**Test Steps:**
1. Send large number of messages rapidly (>80 per second)
2. Exceed WhatsApp rate limit

**Expected Results:**
- System detects rate limit error (429 Too Many Requests)
- Messages are queued
- Retry with exponential backoff
- No messages lost
- Admin notified if persistent issue

---

### TC-AI-016: AI Timeout on Slow API

**Priority:** Medium
**Description:** Verify behavior when LLM API is slow

**Test Steps:**
1. LLM API takes >10 seconds to respond
2. Client waits for AI response

**Expected Results:**
- After 5 seconds, send typing indicator (if supported by channel)
- After 10 seconds, timeout
- Send fallback message: "I'm taking a moment to process this. Please hold on..."
- Continue processing in background
- Send response when ready
- If > 30 sec, escalate to human

---

### TC-WA-009: Invalid WhatsApp Webhook Payload

**Priority:** High
**Description:** Verify handling of malformed webhook payloads

**Test Steps:**
1. Send malformed JSON to webhook endpoint

**Expected Results:**
- Webhook parses payload safely
- Invalid payload is logged
- Returns 400 Bad Request
- No exception crashes the service
- Security alert if repeated malformed payloads

---

## Summary

**Total Test Cases:** 25
- Critical Priority: 11
- High Priority: 8
- Medium Priority: 6
- Low Priority: 1

**Coverage:**
- WhatsApp Integration: 9 test cases
- AI Conversation Engine: 14 test cases
- Edge Cases: 4 test cases

**Estimated Testing Time:** 4-6 hours for full manual execution (includes message delays)

**Note:** Many of these tests require live WhatsApp Business API connection and AI LLM integration. For automated testing, mock services should be used.

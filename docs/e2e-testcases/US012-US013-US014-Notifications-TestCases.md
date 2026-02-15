# E2E Test Cases: Notifications & Reminders

**Feature:** US-012 Booking Confirmation Notifications, US-013 Appointment Reminders, US-014 Cancellation & Reschedule Notifications
**Version:** 1.0
**Last Updated:** 2026-02-15
**Status:** Ready for Testing

---

## BOOKING CONFIRMATION NOTIFICATIONS (US-012)

### Test Case TC-NOTIF-001: Send Booking Confirmation to Client

**Priority:** Critical
**User Story:** US-012

**Description:** Verify that client receives confirmation immediately after booking

**Preconditions:**
- Client "Katya" books appointment via WhatsApp
- Appointment: Haircut with Alina on March 15 at 10:00
- Booking is confirmed

**Test Steps:**
1. Client completes booking via AI conversation
2. Appointment is created
3. Wait up to 30 seconds
4. Check client's WhatsApp

**Expected Results:**
- Confirmation message sent within 30 seconds
- Message sent via same channel as booking (WhatsApp)
- Message includes:
  - Service name: "Haircut & Styling"
  - Master name: "Alina Petrova"
  - Date: "Wednesday, March 15, 2026"
  - Time: "10:00 AM - 11:00 AM"
  - Price: "$40"
  - Salon name and address
  - Cancellation instructions: "To cancel or reschedule, just message me here"
- Message is friendly and professional
- Client receives message successfully
- Notification logged in database

---

### Test Case TC-NOTIF-002: Send Booking Notification to Master

**Priority:** High
**User Story:** US-012

**Description:** Verify that master is notified when new appointment is booked

**Preconditions:**
- Master "Alina" is registered and active
- Client books appointment with Alina

**Test Steps:**
1. Client books appointment for Alina at 10:00
2. Appointment is confirmed
3. Check master notification

**Expected Results:**
- Master receives notification within 1 minute
- Notification sent via master's preferred channel (Push/SMS/WhatsApp)
- Notification includes:
  - "New booking: [Client Name] - [Service] at [Time]"
  - Client name: "Katya Ivanova"
  - Service: "Haircut"
  - Date: "Wednesday, March 15"
  - Time: "10:00 AM"
- Master can tap notification to view appointment details
- Notification appears in master's app/dashboard
- In-app notification bell shows unread count

---

### Test Case TC-NOTIF-003: Confirmation Template Customization

**Priority:** Medium
**User Story:** US-012

**Description:** Verify that admin can customize confirmation message template

**Preconditions:**
- User is logged in as SALON_ADMIN
- At Settings > Notifications page

**Test Steps:**
1. Navigate to Notification Templates
2. Select "Booking Confirmation" template
3. Edit template:
   - Add salon branding
   - Modify greeting: "Thank you for choosing [Salon Name]!"
   - Include custom footer: "Follow us on Instagram @beautystudio"
4. Use template variables: {{client_name}}, {{service}}, {{master}}, {{date}}, {{time}}
5. Save template
6. Create test booking
7. Check confirmation message

**Expected Results:**
- Template editor is user-friendly
- Variables are properly replaced with actual values
- Custom branding appears in confirmation
- Changes take effect immediately
- Preview shows final message before saving

---

### Test Case TC-NOTIF-004: Confirmation Notification Delivery Failure Handling

**Priority:** Medium
**User Story:** US-012

**Description:** Verify handling when confirmation message fails to deliver

**Preconditions:**
- Client has invalid/unreachable phone number
- Appointment is booked

**Test Steps:**
1. Book appointment for client with unreachable phone
2. System attempts to send confirmation
3. Delivery fails

**Expected Results:**
- Delivery failure is detected (webhook status update or timeout)
- Notification status marked as "FAILED" in database
- Admin receives alert: "Failed to send confirmation to [Client]"
- System retries 2-3 times with backoff
- If all retries fail, admin is notified to contact client manually
- Appointment remains valid (failure doesn't cancel appointment)

---

## APPOINTMENT REMINDERS (US-013)

### Test Case TC-REMIND-001: Send 24-Hour Reminder

**Priority:** Critical
**User Story:** US-013

**Description:** Verify that client receives reminder 24 hours before appointment

**Preconditions:**
- Appointment exists: Katya - Haircut with Alina on March 15 at 10:00
- Current time is March 14 at 10:00 (exactly 24 hours before)
- Reminder scheduler is running

**Test Steps:**
1. Scheduler job runs (every 5 minutes)
2. Identifies appointments due in 24 hours
3. Sends reminder to client

**Expected Results:**
- Reminder sent exactly 24 hours before appointment (or within 5-minute window)
- Message sent via client's booking channel (WhatsApp)
- Message includes:
  - "Hi [Name]! Just a friendly reminder about your appointment tomorrow:"
  - Service, Master, Date, Time, Location
  - "Reply CONFIRM to confirm, or RESCHEDULE if you need to change."
- Client receives message
- Reminder logged to prevent duplicate
- Database flag updated: reminder_24h_sent = true

---

### Test Case TC-REMIND-002: Send 1-Hour Reminder

**Priority:** High
**User Story:** US-013

**Description:** Verify that client receives reminder 1 hour before appointment

**Preconditions:**
- Appointment exists for today at 10:00
- Current time is 09:00
- 24-hour reminder already sent

**Test Steps:**
1. Scheduler runs at 09:00
2. Identifies appointments in 1 hour
3. Sends reminder

**Expected Results:**
- Reminder sent 1 hour before appointment
- Message is short:
  - "Hi [Name]! Your appointment is in 1 hour: [Service] with [Master] at [Time]. See you soon!"
- No action buttons (too close to appointment time)
- Reminder logged
- Database flag updated: reminder_1h_sent = true

---

### Test Case TC-REMIND-003: Skip Reminder for Cancelled Appointments

**Priority:** High
**User Story:** US-013

**Description:** Verify that reminders are NOT sent for cancelled appointments

**Preconditions:**
- Appointment scheduled for tomorrow at 10:00
- Appointment is cancelled today

**Test Steps:**
1. Cancel appointment
2. Wait for 24-hour reminder time
3. Scheduler runs

**Expected Results:**
- Scheduler checks appointment status
- Status is CANCELLED
- Reminder is NOT sent
- No message to client
- Cancelled appointments are excluded from reminder query

---

### Test Case TC-REMIND-004: Reminder Deduplication

**Priority:** High
**User Story:** US-013

**Description:** Verify that duplicate reminders are prevented

**Preconditions:**
- Appointment exists for tomorrow
- Reminder has already been sent

**Test Steps:**
1. Scheduler runs first time, sends 24h reminder
2. Database flag set: reminder_24h_sent = true
3. Scheduler runs again (5 min later, still within 24h window)
4. Check for duplicate

**Expected Results:**
- Scheduler queries appointments where reminder_24h_sent = false
- Already-reminded appointments are excluded
- No duplicate reminder is sent
- Flag prevents re-sending

---

### Test Case TC-REMIND-005: Client Confirms Appointment via Reminder

**Priority:** Medium
**User Story:** US-013

**Description:** Verify that client can confirm appointment by replying to reminder

**Preconditions:**
- Client receives 24h reminder
- Reminder includes "Reply CONFIRM to confirm"

**Test Steps:**
1. Client receives reminder
2. Client replies: "CONFIRM" or "Yes"
3. AI processes response

**Expected Results:**
- AI recognizes confirmation intent
- Appointment status updated to "CONFIRMED_BY_CLIENT"
- AI responds: "Thank you! Your appointment is confirmed. See you tomorrow!"
- Confirmation logged
- Master sees updated status

---

### Test Case TC-REMIND-006: Client Requests Reschedule via Reminder

**Priority:** Medium
**User Story:** US-013

**Description:** Verify that client can request reschedule from reminder

**Preconditions:**
- Client receives 24h reminder

**Test Steps:**
1. Client replies to reminder: "RESCHEDULE" or "Can I change to Friday?"
2. AI processes request

**Expected Results:**
- AI recognizes reschedule intent
- AI asks for new preferred time
- Reschedule flow initiated (same as TC-AI-010)
- Original appointment is rescheduled
- New confirmation sent

---

### Test Case TC-REMIND-007: Configure Reminder Timing

**Priority:** Low
**User Story:** US-013

**Description:** Verify that admin can configure reminder timing

**Preconditions:**
- User is logged in as SALON_ADMIN

**Test Steps:**
1. Navigate to Settings > Notifications
2. Configure reminder timings:
   - Enable/disable 24h reminder
   - Enable/disable 1h reminder
   - Add custom reminder: 2 hours before
3. Save settings

**Expected Results:**
- Settings are saved
- Scheduler respects new settings
- Reminders sent according to configuration
- Can disable reminders entirely if needed

---

## CANCELLATION & RESCHEDULE NOTIFICATIONS (US-014)

### Test Case TC-CANCEL-001: Notify Client When Master Cancels

**Priority:** Critical
**User Story:** US-014

**Description:** Verify that client is notified when master/admin cancels their appointment

**Preconditions:**
- Appointment exists: Katya - Haircut with Alina on March 15 at 10:00
- Master or admin cancels appointment

**Test Steps:**
1. Master/admin cancels appointment
2. Enter cancellation reason: "Master is sick"
3. Confirm cancellation

**Expected Results:**
- Client receives notification immediately (within 1 minute)
- Message sent via client's channel (WhatsApp)
- Message includes:
  - "Hi [Name], unfortunately your appointment for [Service] with [Master] on [Date] at [Time] has been cancelled."
  - Reason (if appropriate to share): "Due to unforeseen circumstances"
  - "Would you like me to find a new time for you?"
- AI offers to rebook
- Client can respond to rebook
- Cancellation is logged

---

### Test Case TC-CANCEL-002: Notify Master When Client Cancels

**Priority:** Critical
**User Story:** US-014

**Description:** Verify that master is notified when client cancels appointment

**Preconditions:**
- Appointment exists
- Client cancels via AI conversation

**Test Steps:**
1. Client sends message: "Cancel my appointment"
2. AI confirms and cancels appointment
3. Check master notification

**Expected Results:**
- Master receives notification immediately
- Notification format:
  - "[Client Name] cancelled their [Service] appointment on [Date] at [Time]."
  - "Slot is now open."
- Master sees updated calendar (slot freed)
- In-app notification appears
- Push notification sent (if enabled)

---

### Test Case TC-CANCEL-003: Admin Activity Feed Update

**Priority:** Medium
**User Story:** US-014

**Description:** Verify that cancellations appear in admin activity feed

**Preconditions:**
- Admin dashboard is open
- Appointment is cancelled

**Test Steps:**
1. Client cancels appointment
2. Check admin dashboard activity feed

**Expected Results:**
- Activity feed updates in real-time (or on refresh)
- Entry shows:
  - "Cancellation: [Client] - [Service] with [Master] on [Date]"
  - Timestamp
  - Cancelled by: Client/Master/Admin
  - Reason (if provided)
- Click entry to see full details

---

### Test Case TC-RESCHEDULE-001: Notify Both Parties on Reschedule

**Priority:** Critical
**User Story:** US-014

**Description:** Verify that both client and master are notified when appointment is rescheduled

**Preconditions:**
- Appointment: Katya - Haircut with Alina on March 15 at 10:00
- Appointment is rescheduled to March 16 at 14:00

**Test Steps:**
1. Admin/client reschedules appointment
2. New time confirmed

**Expected Results:**
- **Client notification:**
  - "Your appointment has been rescheduled."
  - "Old time: Wed, March 15 at 10:00 AM"
  - "New time: Thu, March 16 at 2:00 PM"
  - All other details (service, master, location)
- **Master notification:**
  - "[Client] appointment rescheduled from [Old Time] to [New Time]"
- Both receive notification within 1 minute
- Calendar updates for both
- New reminders scheduled for new time
- Old reminder jobs cancelled

---

### Test Case TC-RESCHEDULE-002: Client Initiated Reschedule via AI

**Priority:** High
**User Story:** US-014

**Description:** Verify reschedule notification flow when client initiates via AI

**Preconditions:**
- Client has appointment
- Client messages AI to reschedule

**Test Steps:**
1. Client: "I need to move my appointment to Friday"
2. AI processes reschedule
3. AI confirms with client
4. AI updates appointment
5. Notifications sent

**Expected Results:**
- AI guides reschedule process
- Master is notified: "Reschedule request from [Client]: [Old Time] → [New Time]"
- If auto-confirm enabled: Reschedule happens automatically
- If manual approval: Master must approve before confirming to client
- Client receives confirmation once finalized

---

### Test Case TC-NOTIF-005: Master Daily Schedule Summary

**Priority:** Low
**User Story:** US-014

**Description:** Verify that master receives daily summary of next day's appointments

**Preconditions:**
- Master "Alina" has appointments tomorrow
- Current time is 8:00 PM today
- Daily summary is enabled and configured for 8:00 PM

**Test Steps:**
1. Scheduler runs at 8:00 PM
2. Identifies masters with appointments next day
3. Sends summary to each master

**Expected Results:**
- Master receives summary message
- Message includes:
  - "Hi Alina! Here's your schedule for tomorrow (March 15):"
  - List of all appointments:
    - "10:00 AM - Katya Ivanova - Haircut"
    - "2:00 PM - Elena Sokolova - Hair Coloring"
  - Total appointments count
  - Total work hours
- Summary sent via master's preferred channel
- Sent at configured time (default 8:00 PM)

---

## NOTIFICATION PREFERENCES & SETTINGS

### Test Case TC-NOTIF-006: Master Sets Notification Preferences

**Priority:** Medium
**User Story:** US-014

**Description:** Verify that master can configure their notification preferences

**Preconditions:**
- Master is logged in

**Test Steps:**
1. Navigate to Profile > Notification Preferences
2. Configure settings:
   - New bookings: Push + SMS
   - Cancellations: Push only
   - Daily summary: Enabled, 8:00 PM
   - Reschedule requests: WhatsApp
3. Save preferences

**Expected Results:**
- Preferences are saved
- Master receives notifications according to preferences
- Can choose multiple channels per notification type
- Can disable specific notification types
- Changes take effect immediately

---

### Test Case TC-NOTIF-007: Client Notification Channel Preference

**Priority:** Low
**User Story:** US-014

**Description:** Verify that clients receive notifications via their preferred channel

**Preconditions:**
- Client has used both WhatsApp and Facebook Messenger

**Test Steps:**
1. Client books via WhatsApp
2. Later, client messages via Messenger
3. Next notification is sent

**Expected Results:**
- System tracks most recent channel
- Notifications sent via most recent active channel
- Client can specify preference manually
- Preference is saved in client profile

---

## Edge Cases and Error Scenarios

### TC-NOTIF-008: Reminder for Same-Day Appointment

**Priority:** Medium
**Description:** Verify behavior when appointment is booked for same day

**Test Steps:**
1. Book appointment for 3 hours from now
2. Check reminder behavior

**Expected Results:**
- 24-hour reminder is skipped (not applicable)
- 1-hour reminder is sent (if still > 1 hour away)
- Or immediate confirmation only, no reminders

---

### TC-NOTIF-009: Multiple Appointments Same Day

**Priority:** Medium
**Description:** Verify client with multiple appointments on same day

**Test Steps:**
1. Client has 2 appointments tomorrow:
   - 10:00 Haircut
   - 14:00 Manicure
2. Wait for 24h reminder

**Expected Results:**
- Single combined reminder listing both appointments
OR
- Separate reminders for each appointment
- No spam or excessive messages

---

### TC-NOTIF-010: Notification After Appointment Time Passed

**Priority:** Low
**Description:** Verify no reminder sent if appointment time has passed

**Test Steps:**
1. Appointment scheduled for yesterday (past)
2. Scheduler runs

**Expected Results:**
- No reminder sent for past appointments
- Scheduler filters appointments where appointment_time > current_time

---

### TC-NOTIF-011: WhatsApp Template Message Compliance

**Priority:** High
**Description:** Verify reminders outside 24h window use approved templates

**Test Steps:**
1. Client last messaged 2 days ago
2. Appointment reminder needs to be sent
3. 24-hour messaging window expired

**Expected Results:**
- System detects expired window
- Uses approved WhatsApp template message
- Template includes required variables
- Template complies with WhatsApp policy
- Message sends successfully

---

### TC-NOTIF-012: Notification Queue Performance

**Priority:** Medium
**Description:** Verify notification system handles high volume

**Test Steps:**
1. 100+ appointments have reminders due at same time
2. Scheduler runs

**Expected Results:**
- All notifications queued
- Sent in batches to avoid rate limits
- All notifications delivered within 5 minutes
- No messages lost
- System doesn't crash
- Database handles concurrent inserts

---

## Summary

**Total Test Cases:** 24
- Critical Priority: 7
- High Priority: 7
- Medium Priority: 8
- Low Priority: 2

**Coverage:**
- Booking Confirmations: 4 test cases
- Appointment Reminders: 7 test cases
- Cancellation Notifications: 3 test cases
- Reschedule Notifications: 2 test cases
- Notification Preferences: 2 test cases
- Edge Cases: 6 test cases

**Estimated Testing Time:** 3-4 hours for full manual execution

**Note:** Many notification tests are time-dependent and may require:
- Mocking system time for scheduler tests
- Test mode for immediate notification sending
- Webhook listeners for WhatsApp delivery confirmations

# SlotMe App - UX Flows & User Experience Design

> Version: 1.0
> Last Updated: 2026-02-07
> Author: UX Designer

---

## Table of Contents

1. [User Personas](#1-user-personas)
2. [Information Architecture](#2-information-architecture)
3. [Detailed User Flows](#3-detailed-user-flows)
4. [Screen Descriptions](#4-screen-descriptions)
5. [Conversation Design Patterns](#5-conversation-design-patterns)
6. [Edge Cases & Error States](#6-edge-cases--error-states)

---

## 1. User Personas

### 1.1 Salon Owner / Admin

**Profile:**
- **Name archetype:** Marina, 38, owns a mid-size beauty salon with 5-12 masters
- **Tech comfort:** Moderate. Uses smartphone daily, comfortable with Instagram/WhatsApp business, basic spreadsheet skills. Not a developer.
- **Device preference:** Mobile-first for quick checks; desktop for detailed analytics and setup

**Goals:**
- Reduce time spent on phone answering booking calls and managing WhatsApp messages manually
- Fill empty slots and minimize no-shows
- Have full visibility into all masters' schedules from one place
- Grow the business by improving client retention and reducing administrative overhead
- Set up the system once and let it run autonomously

**Pain Points:**
- Currently juggles multiple WhatsApp conversations, a paper calendar, and phone calls
- Loses clients when she can't respond fast enough
- Double-bookings happen when two clients message at the same time
- No easy way to see which time slots are underutilized
- Masters manage their own informal schedules, leading to conflicts

**Key Scenarios:**
- Initial salon setup and onboarding
- Reviewing daily/weekly booking performance
- Managing master roster (adding/removing)
- Configuring services and pricing
- Connecting communication channels

---

### 1.2 Master / Stylist

**Profile:**
- **Name archetype:** Alina, 27, hair colorist working at Marina's salon
- **Tech comfort:** High with social media and messaging apps, low with business software
- **Device preference:** Almost exclusively mobile (checks schedule between clients)

**Goals:**
- See her daily schedule at a glance, knowing exactly who is coming and for what service
- Block personal time or lunch breaks easily
- Get notified immediately when a booking is made or cancelled
- Fill cancelled slots quickly (hates gaps in the schedule)
- Spend zero time on administrative tasks

**Pain Points:**
- Currently relies on the salon owner forwarding her WhatsApp messages about bookings
- Sometimes finds out about cancellations too late to fill the slot
- Has no visibility into her own utilization rate
- Struggles with clients who want to rebook -- has to check availability manually

**Key Scenarios:**
- Morning check of the day's appointments
- Blocking time off for personal errands
- Viewing details about the next client (service, notes, history)
- Accepting or being notified about new bookings
- Setting recurring weekly availability

---

### 1.3 Client

**Profile:**
- **Name archetype:** Katya, 32, regular salon visitor who books every 4-6 weeks
- **Tech comfort:** High with messaging apps; expects instant responses
- **Device preference:** Mobile only. Prefers WhatsApp or Messenger over phone calls

**Goals:**
- Book an appointment with her preferred master in under 2 minutes
- Book at any time (evenings, weekends) without waiting for salon hours
- Get confirmation immediately so she can plan her day
- Receive reminders so she doesn't forget
- Easily cancel or reschedule without feeling guilty or making a phone call

**Pain Points:**
- Hates calling salons and being put on hold
- Frustrated when she messages a salon and doesn't get a reply for hours
- Wants to know exact availability before committing
- Sometimes forgets appointments and wishes she got reminders
- Doesn't want to download another app -- prefers channels she already uses

**Key Scenarios:**
- Initiating a booking conversation via WhatsApp/Messenger/SMS/Voice
- Selecting service, master, and time
- Receiving booking confirmation
- Receiving reminders
- Cancelling or rescheduling
- Receiving follow-up after a visit

---

## 2. Information Architecture

### 2.1 Salon Admin Dashboard - Sitemap

```
Admin Dashboard
|
+-- Home / Overview
|   +-- Today's Appointments (all masters)
|   +-- Key Metrics (bookings today, revenue estimate, utilization %)
|   +-- Recent Activity Feed
|
+-- Calendar
|   +-- Day View (all masters, side-by-side columns)
|   +-- Week View (all masters, grid)
|   +-- Month View (heatmap of busy/free)
|   +-- Filter by Master
|
+-- Masters
|   +-- Master List (name, photo, status, services)
|   +-- Add / Invite Master
|   +-- Master Profile & Settings
|   |   +-- Services assigned
|   |   +-- Working hours / Availability
|   |   +-- Performance stats
|   +-- Remove / Deactivate Master
|
+-- Services
|   +-- Service Catalog (list with categories)
|   +-- Add / Edit Service
|   |   +-- Name, Description
|   |   +-- Duration
|   |   +-- Price
|   |   +-- Category
|   |   +-- Assigned Masters
|   +-- Service Categories Management
|
+-- Clients
|   +-- Client List (searchable, sortable)
|   +-- Client Profile
|   |   +-- Contact info
|   |   +-- Visit history
|   |   +-- Preferred master
|   |   +-- Notes
|   |   +-- Communication history
|   +-- Import Clients (CSV)
|
+-- Messages / Conversations
|   +-- Active Conversations (AI-handled)
|   +-- Escalated Conversations (needs human)
|   +-- Conversation History
|   +-- Filter by Channel (WhatsApp, Messenger, SMS, Voice)
|
+-- Analytics
|   +-- Booking Trends (daily, weekly, monthly)
|   +-- Master Utilization
|   +-- Revenue Estimates
|   +-- Client Retention
|   +-- Popular Services
|   +-- Channel Performance (which channel brings most bookings)
|   +-- No-show Rate
|
+-- Settings
|   +-- Salon Profile (name, address, logo, business hours)
|   +-- Communication Channels
|   |   +-- WhatsApp Business Setup
|   |   +-- Facebook Messenger Setup
|   |   +-- SMS Provider Setup
|   |   +-- ElevenLabs Voice Setup
|   +-- AI Configuration
|   |   +-- Greeting messages per channel
|   |   +-- Language settings
|   |   +-- Booking rules (min advance time, max future booking)
|   +-- Notification Preferences
|   +-- Billing & Subscription
|   +-- Tenant / Account Management
```

### 2.2 Master Dashboard - Sitemap

```
Master Dashboard
|
+-- My Day (default landing)
|   +-- Today's Appointments (timeline view)
|   +-- Next Client Card (prominent)
|   +-- Quick Stats (bookings today, gaps)
|
+-- My Calendar
|   +-- Day View (personal only)
|   +-- Week View
|   +-- Block Time Off (quick action)
|   +-- Set Recurring Availability
|
+-- My Clients
|   +-- Upcoming Clients
|   +-- Client History
|   +-- Client Notes
|
+-- Notifications
|   +-- New Bookings
|   +-- Cancellations
|   +-- Reschedule Requests
|   +-- System Alerts
|
+-- My Profile
|   +-- Personal Info
|   +-- Services I Offer
|   +-- Working Hours
|   +-- Notification Preferences
```

### 2.3 Navigation Structure

**Admin Dashboard (Desktop):**
- Top bar: Salon name/logo, search, notifications bell, profile avatar
- Left sidebar: Home, Calendar, Masters, Services, Clients, Messages, Analytics, Settings
- Sidebar is collapsible to icons-only for more workspace

**Admin Dashboard (Mobile):**
- Bottom tab bar: Home, Calendar, Masters, Messages, More (Services, Clients, Analytics, Settings)
- Top bar: Salon name, notifications bell

**Master Dashboard (Mobile-first):**
- Bottom tab bar: My Day, Calendar, Clients, Notifications, Profile
- Top bar: Salon name, today's date

---

## 3. Detailed User Flows

### Onboarding Flows

---

#### F1: Salon Registration & Setup

**Trigger:** Salon owner visits the SlotMe website or receives an invitation link.

**Steps:**

1. **Landing Page**
   - Owner clicks "Get Started" / "Register Your Salon"
   - Sees value proposition: "AI receptionist for your beauty salon"

2. **Account Creation**
   - Enter: Email, Password, Phone number
   - Verify email (6-digit code sent)
   - [Decision] Email verified? -> Yes: Continue | No: Resend code (max 3 attempts)

3. **Salon Profile Setup**
   - Enter: Salon name, Address, Phone, Business hours
   - Upload: Logo (optional, can skip)
   - Select: Timezone, Primary language
   - Select: Salon type (hair salon, nail salon, spa, multi-service)

4. **Service Catalog Quick Start**
   - System suggests common services based on salon type
   - Owner can accept suggestions, modify, or skip and add later
   - For each service: Name, Duration (preset options: 30min, 60min, 90min, 120min), Price
   - [Decision] Add services now? -> Yes: Configure services | No: Skip (can do later)

5. **Invite First Master**
   - Enter master's name, phone number, and email
   - Assign services to master
   - Set working hours (template: Mon-Fri 9-18, Sat 10-16)
   - [Decision] Invite more? -> Yes: Repeat | No: Continue

6. **Connect First Channel**
   - Choose primary channel: WhatsApp (recommended), Facebook Messenger, SMS, or Voice
   - Guided setup wizard for chosen channel (see F24 for details)
   - [Decision] Connect channel now? -> Yes: Follow wizard | No: Skip (can do later, but AI won't function)

7. **Review & Launch**
   - Summary screen showing: Salon info, services count, masters count, connected channels
   - "Launch Your AI Receptionist" button
   - [Decision] Everything correct? -> Yes: Activate | No: Edit sections

8. **Welcome Dashboard**
   - First-time tour overlay highlighting key areas
   - Checklist widget showing setup completion (e.g., "3 of 5 steps done")
   - Prompt to complete remaining setup items

**Success Criteria:** Salon is created as a tenant, at least one master and one service are configured, at least one communication channel is connected.

---

#### F2: Master Onboarding (Invited by Admin)

**Trigger:** Master receives an SMS/WhatsApp/Email invitation from the salon admin.

**Steps:**

1. **Invitation Received**
   - Message: "Hi [Name]! [Salon Name] has invited you to join SlotMe. Manage your bookings and schedule easily. Tap to get started: [link]"

2. **Account Setup**
   - Tap link -> Opens registration form (pre-filled with name and salon)
   - Enter: Password (or social login)
   - Verify phone number (OTP via SMS)

3. **Profile Completion**
   - Upload profile photo (optional, skip-able)
   - Confirm assigned services (pre-populated by admin)
   - Review working hours (pre-set by admin, master can request changes)

4. **Availability Setup**
   - Calendar view showing the week
   - Confirm or adjust working hours per day
   - Mark any upcoming time-off
   - [Decision] Accept default hours? -> Yes: Confirm | No: Request change from admin

5. **Notification Preferences**
   - Choose how to be notified: Push notification, SMS, WhatsApp
   - Choose what to be notified about: New bookings, Cancellations, Reminders, Daily summary

6. **Quick Tour**
   - 4-screen walkthrough of the master dashboard:
     - "My Day" - see your schedule
     - "Calendar" - manage availability
     - "Clients" - know who's coming
     - "Notifications" - stay updated

7. **Ready**
   - "You're all set! Your first appointment will appear here."
   - Empty state with illustration

**Success Criteria:** Master account is active, linked to the salon tenant, services and hours confirmed.

---

#### F3: Service Catalog Configuration

**Trigger:** Admin navigates to Settings > Services, or during onboarding step 4.

**Steps:**

1. **Service List View**
   - Shows all existing services grouped by category
   - Each service shows: Name, Duration, Price, Assigned masters count
   - "Add Service" button prominently visible

2. **Add New Service**
   - Enter: Service name (with autocomplete suggestions)
   - Select: Category (Hair, Nails, Skin, Massage, Makeup, Other -- or create new)
   - Enter: Duration (dropdown: 15, 30, 45, 60, 90, 120, 150, 180 min)
   - Enter: Price (with currency)
   - Enter: Description (optional, shown to clients during booking)
   - Toggle: Buffer time after service (e.g., 15 min cleanup)
   - Assign: Select which masters can perform this service
   - [Decision] Assign to all masters? -> Yes: Auto-assign | No: Select specific masters

3. **Category Management**
   - Create, rename, reorder categories
   - Drag-and-drop service ordering within categories

4. **Bulk Actions**
   - Select multiple services -> Change price, Change category, Assign master, Deactivate

5. **Save & Publish**
   - Changes are saved immediately
   - AI assistant is updated to offer the new services in conversations

**Success Criteria:** Services are available for AI to offer during booking conversations.

---

### Client Booking Flows (Conversational)

---

#### F4: Client Books via WhatsApp

**Trigger:** Client sends a WhatsApp message to the salon's business number.

**Conversation Flow:**

```
CLIENT sends: "Hi" (or any greeting / "I want to book" / "appointment please")
    |
    v
AI: "Hello! Welcome to [Salon Name]! I'm your virtual assistant.
     I can help you book an appointment. What service are you looking for?

     Our popular services:
     * Haircut & Styling - 60 min - $40
     * Hair Coloring - 120 min - $80
     * Manicure - 45 min - $25
     * Pedicure - 60 min - $30

     Or type the service you need!"
    |
    v
[Decision: Does AI understand the requested service?]
    |
    +-- YES --> Continue to master selection
    |
    +-- NO --> AI: "I'm not sure I understood. Could you choose from our services list,
    |              or describe what you're looking for?"
    |              [After 2 failed attempts: "Let me connect you with our administrator."]
    |
    v
CLIENT: "Hair coloring"
    |
    v
AI: "Great choice! For hair coloring, we have these talented specialists:

     1. Alina - Senior Colorist (rating 4.9)
     2. Dasha - Color Specialist (rating 4.7)
     3. No preference - show me first available

     Who would you prefer?"
    |
    v
[Decision: Does client have a preference?]
    |
    +-- Specific master --> Check master availability
    |
    +-- No preference --> Check all qualified masters' availability
    |
    v
CLIENT: "Alina please"
    |
    v
AI: "Alina has these available slots for hair coloring (120 min):

     This week:
     * Wed, Feb 11 - 10:00 AM, 2:00 PM
     * Thu, Feb 12 - 11:00 AM, 3:00 PM
     * Fri, Feb 13 - 9:00 AM, 1:00 PM

     Next week:
     * Mon, Feb 16 - 10:00 AM, 2:00 PM, 4:00 PM

     Which works for you? Or tell me a preferred date."
    |
    v
[Decision: Client picks a valid slot?]
    |
    +-- YES --> Confirm booking
    |
    +-- Requests different date --> AI shows availability for that date
    |
    +-- No slots work --> AI: "Would you like to see Dasha's availability,
    |                         or should I add you to the waitlist for Alina?"
    |
    v
CLIENT: "Wednesday at 2pm"
    |
    v
AI: "Perfect! Let me confirm your appointment:

     Service: Hair Coloring
     Master: Alina
     Date: Wednesday, February 11
     Time: 2:00 PM - 4:00 PM
     Price: $80

     Shall I book this for you?"
    |
    v
[Decision: Client confirms?]
    |
    +-- YES -->
    |   |
    |   v
    |   [Decision: Is this a returning client (phone number recognized)?]
    |   |
    |   +-- YES --> Book immediately, use stored client info
    |   |           AI: "All booked! You'll get a reminder 24 hours before.
    |   |                See you Wednesday! If you need to change anything,
    |   |                just message me here."
    |   |
    |   +-- NO --> Collect client info
    |               AI: "I just need your name to complete the booking."
    |               CLIENT: "Katya Ivanova"
    |               AI: "Thank you, Katya! Your appointment is confirmed.
    |                    [Confirmation details]
    |                    You'll receive a reminder 24 hours before.
    |                    See you Wednesday!"
    |
    +-- NO / Changes mind -->
        AI: "No problem! Would you like to pick a different time,
             or is there anything else I can help with?"
```

**System Actions (Background):**
- Appointment created in the database
- Master's calendar updated
- Confirmation notification sent to master
- Client added to client database (if new)
- Appointment reminder scheduled (24h and 1h before)

---

#### F5: Client Books via Facebook Messenger

**Trigger:** Client sends a message via the salon's Facebook page Messenger.

**Flow:** Identical conversation logic to F4 (WhatsApp), with the following channel-specific adaptations:

1. **Entry Point Differences:**
   - Client may arrive via "Book Now" button on Facebook page
   - Client may arrive via an ad with "Message Us" CTA
   - AI greeting includes: "You can also visit our page for photos of our work!"

2. **UI Enhancements (Messenger-specific):**
   - Use Messenger Quick Reply buttons for service selection (up to 13 options)
   - Use Messenger Generic Template (cards) to show masters with photos
   - Use Messenger Button Template for confirmation (Book / Change / Cancel)
   - Persistent menu at bottom: "Book Appointment", "My Appointments", "Contact Salon"

3. **Rich Media:**
   - Service selection can include thumbnail images
   - Master selection includes profile photos and short bios

4. **Handoff:**
   - If client clicks "Contact Salon" or AI cannot resolve, handoff to the salon's Facebook page inbox where the admin can respond

**All other logic (service selection, availability check, confirmation) follows F4.**

---

#### F6: Client Books via Voice Call (ElevenLabs)

**Trigger:** Client calls the salon's phone number, which is connected to the ElevenLabs voice agent.

**Flow:**

```
[Phone rings, ElevenLabs agent picks up after 2 rings]
    |
    v
AI (voice): "Hello! Thank you for calling [Salon Name]. I'm your virtual
             assistant. I can help you book an appointment or answer questions.
             How can I help you today?"
    |
    v
[Decision: Caller intent detected?]
    |
    +-- Book appointment --> Continue booking flow
    +-- Ask question --> Answer FAQ (hours, location, services, pricing)
    +-- Ask for human --> "Let me transfer you to our administrator.
    |                      One moment please." [Transfer or take message]
    +-- Unclear --> "I'm sorry, could you repeat that? I can help you
                     book an appointment or answer questions about our salon."
    |
    v
CLIENT (voice): "I'd like to book a haircut"
    |
    v
AI: "Of course! We have several stylists available for haircuts.
     Do you have a preferred stylist, or would you like
     the first available appointment?"
    |
    v
[Continue with same logic as F4, adapted for voice:]
    - Keep responses SHORT (voice must be concise)
    - Offer maximum 3 time options at once (avoid overwhelming)
    - Repeat back details clearly for confirmation
    - Spell out dates and times unambiguously
    |
    v
[Booking confirmed via voice]
    |
    v
AI: "Your appointment is confirmed. I'll send a confirmation
     to your phone number with all the details.
     Is there anything else I can help with?"
    |
    v
[Decision: More help needed?]
    |
    +-- YES --> Continue conversation
    +-- NO --> AI: "Thank you for calling [Salon Name]. Have a wonderful day!"
                   [Call ends]
```

**Voice-specific considerations:**
- Maximum response length: 3 sentences per turn
- Confirmation must be explicit: "Just to confirm, that's [date] at [time] with [master], correct?"
- Numbers spoken as words: "two PM" not "14:00"
- Background noise handling: If speech-to-text confidence is low, ask to repeat
- Call duration target: Under 3 minutes for a standard booking
- Send SMS confirmation after call ends

---

#### F7: Client Books via SMS

**Trigger:** Client sends an SMS to the salon's number.

**Flow:** Same logic as F4 (WhatsApp), with SMS-specific adaptations:

1. **Message Length:**
   - Keep each AI message under 160 characters when possible (1 SMS segment)
   - For longer messages (availability lists), break into max 2-3 segments
   - Use abbreviations where clear: "Wed 2/11" instead of "Wednesday, February 11th"

2. **No Rich Media:**
   - No images, buttons, or cards
   - Use numbered lists for selections: "Reply 1 for Haircut, 2 for Coloring, 3 for Manicure"

3. **Example Shortened Flow:**

```
CLIENT SMS: "Book appointment"

AI SMS: "Hi! Welcome to [Salon Name]. What service?
Reply: 1-Haircut 2-Coloring 3-Manicure 4-Other"

CLIENT SMS: "1"

AI SMS: "Haircut! Preferred stylist?
1-Alina 2-Dasha 3-First available"

CLIENT SMS: "3"

AI SMS: "Available slots:
1-Wed 2/11 10am 2-Wed 2/11 2pm
3-Thu 2/12 11am 4-Thu 2/12 3pm"

CLIENT SMS: "2"

AI SMS: "Confirm? Haircut Wed 2/11 2pm $40
Reply Y to book, N to change"

CLIENT SMS: "Y"

AI SMS: "Booked! Haircut Wed Feb 11 2:00PM.
Reminder will be sent 24h before. Reply C to cancel anytime."
```

4. **Keyword Commands:**
   - "BOOK" - Start booking
   - "CANCEL" - Cancel existing appointment
   - "STATUS" - Check upcoming appointments
   - "HELP" - Get assistance options
   - "STOP" - Opt out of messages

---

### Calendar Management Flows

---

#### F8: Master Views Daily Schedule

**Trigger:** Master opens the app (default "My Day" screen) or taps "Calendar" tab.

**Steps:**

1. **My Day View (Default)**
   - Shows current date prominently at top
   - Timeline view (vertical, scrollable) from work start to work end
   - Each appointment shows:
     - Client name and profile photo (or initials)
     - Service name and duration (as block height)
     - Time slot (e.g., "10:00 - 11:00")
     - Color-coded by service category
   - Empty slots shown as available (lighter color)
   - Current time indicator (horizontal line moving in real-time)
   - Next upcoming client card highlighted at top

2. **Appointment Detail (Tap)**
   - Tap any appointment to expand:
     - Client full name, phone (tap to call/message)
     - Service details and price
     - Client notes (allergies, preferences from previous visits)
     - Visit history count ("5th visit")
     - Actions: Reschedule, Cancel, Add Note

3. **Quick Actions**
   - Swipe right on a slot: Mark as completed
   - Swipe left on a slot: Quick cancel (with confirmation)
   - Long press empty slot: Block time or add manual booking

4. **Navigation**
   - Swipe left/right to move between days
   - Tap date header to open date picker
   - "Today" button to jump back to current day

---

#### F9: Master Blocks Time Off

**Trigger:** Master needs to mark personal time, lunch, or vacation.

**Steps:**

1. **Access:** Calendar view -> Long press on empty slot OR tap "+" button -> "Block Time"

2. **Block Time Form:**
   - Select type: Lunch break, Personal, Vacation, Sick day, Other
   - Date: Pre-filled if tapped from calendar, otherwise date picker
   - Start time
   - End time
   - [Decision] Multi-day? -> Toggle "All Day" or "Multiple Days" (date range picker)
   - Note (optional): "Dentist appointment"
   - Recurring? (see F10 for recurring)

3. **Conflict Check:**
   - [Decision] Are there existing appointments in the selected time?
     - YES -> Warning: "You have 2 appointments during this time. Would you like to:
       1. Cancel those appointments (clients will be notified)
       2. Reschedule those appointments
       3. Go back and choose a different time"
     - NO -> Proceed

4. **Confirmation:**
   - "Time blocked: [Type] on [Date] from [Start] to [End]"
   - Calendar updated with blocked time (shown in gray/hatched pattern)
   - Admin is notified of the block

5. **Edit/Remove Block:**
   - Tap blocked time -> Edit or Remove
   - If removed, slots become available again for booking

---

#### F10: Master Sets Recurring Availability

**Trigger:** Master wants to define their standard weekly schedule.

**Steps:**

1. **Access:** Profile -> Working Hours, or Calendar -> Settings icon

2. **Weekly Template View:**
   - Shows Mon-Sun with time blocks
   - Each day shows: Start time, End time, Break (lunch)
   - Toggle days on/off (e.g., Sunday = OFF)

3. **Configure Per Day:**
   - Tap a day to edit:
     - Start time (e.g., 9:00 AM)
     - End time (e.g., 6:00 PM)
     - Add break: Lunch 1:00 PM - 2:00 PM
     - Add split shift: 9:00-13:00 and 15:00-19:00
   - Copy day settings to other days (e.g., "Copy Monday to Tue-Fri")

4. **Effective Date:**
   - "Apply starting from: [date picker]"
   - [Decision] Apply to all future weeks, or only until a specific date?

5. **Override Existing:**
   - [Decision] Does the new schedule conflict with existing bookings?
     - YES -> Show list of affected bookings
     - "These bookings fall outside your new hours. Reschedule or keep as exceptions?"
     - NO -> Apply immediately

6. **Save:**
   - "Your weekly schedule has been updated."
   - AI assistant is updated to offer only available slots matching this schedule

---

#### F11: Admin Views All Masters' Calendars

**Trigger:** Admin navigates to Calendar section.

**Steps:**

1. **Day View (Default):**
   - Horizontal layout: Each master gets a column
   - Vertical axis: Time slots (configurable: 15/30/60 min increments)
   - Appointments shown as colored blocks in each master's column
   - Master names/photos at column headers
   - Filter: Select/deselect specific masters

2. **Week View:**
   - Grid: Masters as rows, days as columns
   - Each cell shows appointment count and utilization %
   - Color coding: Green (>80% booked), Yellow (50-80%), Red (<50%)
   - Tap any cell to drill down into that master's day

3. **Month View (Heatmap):**
   - Calendar grid with color intensity showing overall salon utilization
   - Darker = more booked, Lighter = more available
   - Tap any day to switch to Day View for that date

4. **Admin Actions from Calendar:**
   - Click empty slot -> Create manual booking for that master
   - Click appointment -> View details, Reschedule, Cancel
   - Drag-and-drop appointment to a different time or master (desktop only)

---

### Appointment Lifecycle Flows

---

#### F12: Client Cancels Appointment

**Trigger:** Client messages the salon (any channel) requesting cancellation, or uses keyword "CANCEL".

**Flow:**

```
CLIENT: "I need to cancel my appointment"
    |
    v
AI: [Looks up client by phone number/messenger ID]
    |
    v
[Decision: Client has upcoming appointments?]
    |
    +-- No appointments found -->
    |   AI: "I don't see any upcoming appointments for you.
    |        Would you like to book a new one?"
    |
    +-- One appointment -->
    |   AI: "I see your appointment:
    |        Haircut with Alina on Wed Feb 11 at 2:00 PM.
    |        Are you sure you want to cancel?"
    |
    +-- Multiple appointments -->
        AI: "I see these upcoming appointments:
             1. Haircut with Alina - Wed Feb 11, 2:00 PM
             2. Manicure with Dasha - Fri Feb 13, 10:00 AM
             Which one would you like to cancel?"
    |
    v
CLIENT confirms cancellation
    |
    v
[Decision: Cancellation policy check]
    |
    +-- Within free cancellation window (e.g., >24h before) -->
    |   AI: "Your appointment has been cancelled. We hope to see
    |        you soon! Would you like to rebook for another time?"
    |
    +-- Late cancellation (e.g., <24h before) -->
        AI: "Your appointment is in less than 24 hours.
             Please note our cancellation policy: [policy text].
             Do you still want to cancel?"
        |
        +-- YES --> Cancel + policy applies
        +-- NO --> Keep appointment
    |
    v
[System Background Actions - TRIGGERS F13:]
    - Appointment marked as cancelled
    - Master notified immediately
    - Slot becomes available
    - F13 triggered: AI rearrangement flow starts
    - Admin notified
    - Cancellation logged for analytics
```

---

#### F13: AI Rearranges Slots After Cancellation

**Trigger:** Automatic, triggered by F12 (cancellation) or F14 (master reschedule).

**Flow:**

```
[Cancellation detected: Slot freed for Master X at Date/Time]
    |
    v
[Step 1: Check Waitlist]
    |
    +-- Clients on waitlist for this master/service/time?
    |   |
    |   +-- YES --> Contact waitlisted clients in order:
    |   |           AI (WhatsApp/SMS/Messenger): "Great news! A slot just
    |   |           opened up with [Master] on [Date] at [Time] for [Service].
    |   |           Would you like to book it? Reply YES to grab it!"
    |   |           |
    |   |           +-- Client responds YES within 30 min --> Book them in
    |   |           +-- Client responds NO or no response --> Try next on waitlist
    |   |           +-- No one accepts --> Go to Step 2
    |   |
    |   +-- NO --> Go to Step 2
    |
    v
[Step 2: Check Nearby Appointments]
    - Look for clients with the same master who are booked on adjacent days
    - If someone is booked Thurs and the freed slot is Wed, they might prefer Wed
    - AI messages them: "Hi [Name]! I noticed your [Service] with [Master]
      is on [Thu]. Would you prefer to come on [Wed] at [Time] instead?
      Let me know!"
    |
    v
[Step 3: Check Recent Inquiries]
    - Look for clients who recently asked about this master/service but
      couldn't find a slot
    - AI messages them: "Hi [Name]! You recently asked about [Service]
      with [Master]. A slot just opened on [Date] at [Time].
      Interested?"
    |
    v
[Step 4: Passive]
    - Slot remains open and available for new bookings through normal flow
    - Admin can see "recently freed slots" in dashboard

[All proactive messages include easy opt-out: "Reply STOP to not receive availability alerts"]
```

**Timing Rules:**
- Waitlist contacts: Immediately
- Nearby appointment offers: After 15 minutes (give waitlist priority)
- Recent inquiry contacts: After 1 hour
- Each contact attempt expires after 30 minutes before moving to next candidate

---

#### F14: Master Reschedules Appointment

**Trigger:** Master needs to move a client's appointment.

**Steps:**

1. **Access:** Calendar -> Tap appointment -> "Reschedule"

2. **Select New Time:**
   - Calendar view showing master's own availability
   - Conflicting slots grayed out
   - Choose new date and time
   - [Decision] New time within same day or different day?

3. **Client Notification:**
   - System auto-generates message to client via their original booking channel:
   - AI: "Hi [Name]! [Master] needs to reschedule your [Service] appointment
     from [Original Date/Time] to [New Date/Time]. Does this work for you?
     Reply YES to confirm or NO and I'll find another option."

4. **Client Response:**
   - [Decision] Client accepts?
     - YES -> Appointment moved, both parties confirmed
     - NO -> AI offers alternative times:
       "I understand. Here are other available times with [Master]:
       [List]. Which works for you?"
     - No response within 2 hours -> Reminder sent
     - No response within 24 hours -> Admin notified to handle manually

5. **Completion:**
   - Old slot freed (triggers F13 if applicable)
   - New slot booked
   - Both master and client see updated calendar

---

#### F15: Client Requests Reschedule

**Trigger:** Client messages the salon asking to change their appointment time.

**Flow:**

```
CLIENT: "Can I move my appointment to a different day?"
    |
    v
AI: [Identifies client and finds upcoming appointments]
    "I see your [Service] with [Master] on [Date] at [Time].
     When would you prefer instead?"
    |
    v
CLIENT: "Next Monday if possible"
    |
    v
AI: [Checks master's availability on Monday]
    |
    +-- Slots available -->
    |   "On Monday, [Master] has these available times:
    |    * 10:00 AM
    |    * 2:00 PM
    |    Which works better?"
    |
    +-- No slots with same master -->
        "[Master] is fully booked on Monday. I can:
         1. Check other days for [Master]
         2. See if another specialist is available Monday
         3. Add you to the waitlist for [Master] on Monday
         What would you prefer?"
    |
    v
[Client selects new time -> Confirmation flow same as F4 end]
    |
    v
[System: Old appointment cancelled, new one created, master notified]
```

---

### Notification Flows

---

#### F16: Appointment Reminder (24h Before)

**Trigger:** System scheduler, 24 hours before appointment time.

**Channel:** Same channel as original booking (WhatsApp, Messenger, SMS).

**Message:**

```
AI: "Hi [Name]! Just a friendly reminder about your appointment tomorrow:

     [Service] with [Master]
     [Date] at [Time]
     [Salon Name], [Address]

     We're looking forward to seeing you!

     Reply CONFIRM to confirm, or RESCHEDULE if you need to change."
```

**Client Responses:**
- "CONFIRM" / "Yes" / thumbs up -> AI: "See you tomorrow!" + Status updated to confirmed
- "RESCHEDULE" -> Triggers F15
- "CANCEL" -> Triggers F12
- No response -> Status remains "pending" (admin can see unconfirmed appointments)

---

#### F17: Appointment Reminder (1h Before)

**Trigger:** System scheduler, 1 hour before appointment time.

**Channel:** Same as original booking channel.

**Message:**

```
AI: "Hi [Name]! Your appointment is in 1 hour:
     [Service] with [Master] at [Time]
     See you soon!"
```

**Note:** No action buttons on this message -- it's purely informational. If client replies with cancel/reschedule at this point, late cancellation policy applies.

---

#### F18: Booking Confirmation

**Trigger:** Immediately after successful booking (any channel).

**Channel:** Same as booking channel + optional SMS backup.

**Message:**

```
AI: "Your appointment is confirmed!

     [Service]: [Service Name]
     [Master]: [Master Name]
     [Date]: [Day, Month Date, Year]
     [Time]: [Start] - [End]
     [Price]: [Amount]
     [Location]: [Salon Name, Address]

     You'll receive a reminder 24 hours before.
     To cancel or reschedule, just message me here anytime.

     See you then!"
```

**System Actions:**
- Calendar entry created for master
- Push notification to master: "New booking: [Client] - [Service] at [Time]"
- Admin activity feed updated

---

#### F19: Cancellation Notice

**Trigger:** Appointment cancelled (by client, master, or admin).

**Recipients and Messages:**

**To Client (if cancelled by master/admin):**
```
AI: "Hi [Name], unfortunately your appointment for [Service]
     with [Master] on [Date] at [Time] has been cancelled.

     Would you like me to find a new time for you?"
```

**To Master (if cancelled by client):**
```
Push notification: "[Client Name] cancelled their [Service]
                    appointment on [Date] at [Time].
                    Slot is now open."
```

**To Admin:**
```
Activity feed entry: "Cancellation: [Client] - [Service] with [Master]
                      on [Date]. Reason: [if provided]"
```

---

#### F20: Follow-up After Visit (Feedback Request)

**Trigger:** 2 hours after appointment end time.

**Channel:** Same as booking channel.

**Message:**

```
AI: "Hi [Name]! How was your [Service] with [Master] today?

     Rate your experience:
     1 - Not great
     2 - It was okay
     3 - Good
     4 - Very good
     5 - Excellent!

     Your feedback helps us improve!"
```

**Client Responds:**

```
[Decision: Rating provided?]
    |
    +-- Rating 4-5 -->
    |   AI: "Wonderful! We're so glad you enjoyed it.
    |        Would you like to book your next visit now?
    |        [Master] has availability in [4/6/8] weeks."
    |
    +-- Rating 1-3 -->
    |   AI: "We're sorry to hear that. Your feedback is important to us.
    |        Would you like to share what we could improve?
    |        I can also connect you with our manager."
    |   [If client provides feedback -> logged and admin notified]
    |
    +-- No response --> No follow-up (don't nag)
```

**System Actions:**
- Rating stored on client profile
- Master's average rating updated
- Low ratings flagged for admin review

---

### Admin Flows

---

#### F21: Salon Settings Management

**Trigger:** Admin navigates to Settings.

**Sections:**

1. **Salon Profile:**
   - Edit: Name, Address, Phone, Email, Website
   - Upload/change: Logo, Cover photo
   - Edit: Business description (shown in channels)
   - Set: Business hours (for display; actual availability is per-master)
   - Set: Timezone

2. **Booking Rules:**
   - Minimum advance booking time (e.g., 2 hours before)
   - Maximum future booking window (e.g., 60 days ahead)
   - Cancellation policy (free cancellation window: 24h/12h/6h/none)
   - Auto-confirm bookings: Yes/No (if No, master must approve)
   - Waitlist: Enable/Disable
   - Double-booking: Never allow / Allow with master approval

3. **Working Hours Template:**
   - Default hours for new masters
   - Holiday schedule (recurring and one-time closures)

4. **Notification Settings:**
   - Admin notifications: New bookings, Cancellations, Low utilization alerts
   - Delivery: Push, Email, SMS
   - Daily summary email: Enable/Disable, Time of delivery

5. **Danger Zone:**
   - Deactivate salon (pauses all booking, AI goes offline)
   - Delete salon (requires confirmation, exports data first)

---

#### F22: Analytics Dashboard View

**Trigger:** Admin navigates to Analytics.

**Dashboard Layout:**

1. **Top Bar: Date Range Selector**
   - Presets: Today, This Week, This Month, Last 30 Days, Custom Range
   - Compare toggle: "Compare to previous period"

2. **Key Metrics Row (Cards):**
   - Total Bookings (with % change)
   - Revenue Estimate (with % change)
   - Average Utilization Rate (with % change)
   - No-show Rate (with % change)
   - New Clients (with % change)

3. **Charts Section:**

   **Bookings Over Time (Line chart):**
   - Daily bookings count
   - Overlay: cancellations

   **Revenue by Service (Bar chart):**
   - Horizontal bars showing revenue per service category

   **Master Utilization (Stacked bar):**
   - Each master as a bar: Booked % vs Available %
   - Sorted by utilization (highest first)

   **Bookings by Channel (Pie/Donut chart):**
   - WhatsApp, Messenger, SMS, Voice, Manual (admin-created)

   **Popular Booking Times (Heatmap):**
   - Day of week (rows) x Hour of day (columns)
   - Color intensity = booking volume

4. **Client Insights:**
   - Client retention rate (% of clients who rebooked within 60 days)
   - Top 10 clients by visit count
   - New vs returning client ratio

5. **Export:**
   - Download as PDF report
   - Download raw data as CSV

---

#### F23: Client Database Management

**Trigger:** Admin navigates to Clients.

**Steps:**

1. **Client List View:**
   - Table: Name, Phone, Email, Last Visit, Total Visits, Preferred Master
   - Search: By name, phone, email
   - Filter: By preferred master, service history, last visit date range
   - Sort: By name, last visit (newest/oldest), visit count

2. **Client Profile (Click on client):**

   **Header:** Name, Photo (if available from messenger), Phone, Email

   **Tabs:**
   - **Visits:** Chronological list of all appointments (past and upcoming)
     - Each entry: Date, Service, Master, Price, Status (completed/cancelled/no-show)
   - **Communications:** Message history across all channels
   - **Notes:** Internal notes added by masters or admin
     - "Prefers long layers", "Allergic to product X", "Usually 15 min late"
   - **Preferences:** Auto-detected and manually set
     - Preferred master, Preferred day/time, Preferred channel

3. **Client Actions:**
   - Send message (via any connected channel)
   - Book appointment for client (manual booking)
   - Merge duplicates (if same client messaged from different channels)
   - Export client data
   - Delete client (with confirmation, GDPR compliance)

4. **Import Clients:**
   - Upload CSV (name, phone, email)
   - Map columns
   - Preview import
   - [Decision] Duplicates found? -> Skip / Merge / Create new
   - Import confirmation

---

#### F24: Communication Channel Setup

**Trigger:** Admin navigates to Settings > Communication Channels.

**Channel Setup Flows:**

**WhatsApp Business API:**
1. "Connect WhatsApp" button
2. Instructions: "You need a WhatsApp Business account and Facebook Business Manager"
3. OAuth flow: Login to Facebook -> Grant permissions -> Select phone number
4. Verify: Send a test message to the connected number
5. Configure: Set welcome message, business hours auto-reply
6. Status: Connected (green) / Pending (yellow) / Error (red)

**Facebook Messenger:**
1. "Connect Messenger" button
2. Login to Facebook -> Select Page -> Grant permissions
3. Configure: Persistent menu items, Welcome screen
4. Verify: Send test message to page
5. Status indicator

**SMS (via Twilio or similar):**
1. "Connect SMS" button
2. Enter: API credentials (Account SID, Auth Token) or "Create Twilio Account" link
3. Select or purchase phone number
4. Verify: Send test SMS
5. Configure: Opt-out keywords, Message templates
6. Status indicator

**ElevenLabs Voice:**
1. "Connect Voice Agent" button
2. Enter: ElevenLabs API key
3. Select: Voice profile (from ElevenLabs library or custom clone)
4. Configure: Phone number forwarding
5. Test: Make a test call
6. Configure: Voice agent personality, speech patterns, language
7. Status indicator

**Each connected channel shows:**
- Status (active/inactive/error)
- Messages handled today
- Last activity time
- Quick toggle to pause/resume
- "Disconnect" option (with confirmation)

---

## 4. Screen Descriptions

### 4.1 Admin Dashboard - Home Screen

**Desktop Layout:**
```
+-------+--------------------------------------------------+
| SIDE  |  TOP BAR: [Salon Name]  [Search]  [Bell] [Avatar]|
| BAR   +--------------------------------------------------+
|       |                                                   |
| Home  |  [Today's Date]                [Day/Week Toggle]  |
| Cal   |                                                   |
| Mstrs |  +-- TODAY'S APPOINTMENTS --+  +-- KEY METRICS --+|
| Srvcs |  | Timeline:                |  | Bookings: 24    ||
| Clnts |  | 9:00 Alina-Haircut       |  | Revenue: $1,200 ||
| Msgs  |  | 9:30 Dasha-Manicure      |  | Utilization: 78%||
| Anlys |  | 10:00 Alina-Coloring     |  | No-shows: 1     ||
| Stngs |  | ...                      |  +------------------+|
|       |  +---------------------------+                    |
|       |                                                   |
|       |  +-- RECENT ACTIVITY --------+                    |
|       |  | 2 min ago: New booking...  |                    |
|       |  | 15 min ago: Cancellation...|                    |
|       |  | 1h ago: New client...      |                    |
|       |  +----------------------------+                    |
+-------+--------------------------------------------------+
```

**Mobile Layout:**
```
+--------------------------------------+
| [Salon Name]          [Bell] [Avtr]  |
+--------------------------------------+
| Today: Wed, Feb 11        [See All>] |
+--------------------------------------+
| KEY METRICS                          |
| [24 Bookings] [78% Util] [$1.2K]    |
+--------------------------------------+
| UPCOMING                             |
| 9:00  Alina - Haircut - Maria K.    |
| 9:30  Dasha - Manicure - Olga S.    |
| 10:00 Alina - Coloring - Katya I.   |
| [View Full Schedule >]              |
+--------------------------------------+
| RECENT ACTIVITY                      |
| New booking: Maria K. - Haircut     |
| Cancelled: Igor P. - Beard Trim     |
+--------------------------------------+
| [Home] [Cal] [Mstrs] [Msgs] [More] |
+--------------------------------------+
```

**Data Displayed:**
- Today's date and day of week
- Appointment count for today
- Revenue estimate for today
- Utilization percentage (booked hours / available hours)
- No-show count
- Timeline of today's appointments across all masters
- Activity feed (last 20 events)

**Actions Available:**
- Tap any appointment to view details
- Tap "+" floating button to create manual booking
- Tap notification bell to see all notifications
- Search for clients, masters, or appointments

---

### 4.2 Admin Calendar Screen

**Desktop Layout:**
- Full-width calendar with master columns (day view) or master rows (week view)
- Time slots in 30-min increments on vertical axis
- Color-coded appointment blocks
- Drag-and-drop support for rescheduling
- Right-click context menu on appointments

**Mobile Layout:**
- Single master view (swipe horizontally between masters)
- Vertical timeline for the selected day
- Master selector bar at top (scrollable horizontally)
- Floating "+" button for new booking

**Data:** All appointments for selected date range, blocked times, breaks.

**Actions:** Create booking, View/Edit appointment, Reschedule (drag), Filter by master, Switch view (day/week/month).

---

### 4.3 Master Dashboard - My Day Screen

**Mobile Layout (Primary):**
```
+--------------------------------------+
| [Salon Name]    Wed, Feb 11          |
+--------------------------------------+
| NEXT UP                              |
| +----------------------------------+ |
| | Maria Kovalenko       10:00 AM   | |
| | Hair Coloring (120 min)          | |
| | Note: "Prefers warm tones"       | |
| | [Call]  [Message]  [Details]     | |
| +----------------------------------+ |
+--------------------------------------+
| TODAY'S SCHEDULE                     |
|                                      |
| 09:00 |----- Available -----|        |
|        |                     |        |
| 10:00 |=== Maria - Color ===|        |
| 11:00 |=== (continued) =====|        |
|        |                     |        |
| 12:00 |=== Olga - Haircut ==|        |
|        |                     |        |
| 13:00 |----- Lunch ---------|        |
|        |                     |        |
| 14:00 |=== Katya - Color ===|        |
| 15:00 |=== (continued) =====|        |
|        |                     |        |
| 16:00 |----- Available -----|        |
| 17:00 |----- Available -----|        |
+--------------------------------------+
| [MyDay] [Cal] [Clients] [Notif] [Me]|
+--------------------------------------+
```

**Data Displayed:**
- Current date
- Next upcoming client (prominent card): name, service, time, personal notes
- Full day timeline with booked, available, and blocked slots
- Service duration shown as block height
- Client names on each appointment block

**Actions:**
- Tap "Next Up" card -> Full client details
- Tap any appointment -> Appointment details
- Tap available slot -> Quick actions (block time, add manual booking)
- Pull to refresh

**Desktop Layout:**
- Same information in a wider layout
- Side panel for appointment details (no navigation needed)
- Wider timeline with more information visible per slot

---

### 4.4 Messages / Conversations Screen (Admin)

**Desktop Layout:**
```
+-------+------------------+-----------------------------+
| SIDE  | CONVERSATIONS    | CONVERSATION DETAIL         |
| BAR   | [Search]         |                             |
|       | [Filter: All|AI| | Client: Katya Ivanova       |
|       |  Escalated]      | Channel: WhatsApp           |
|       |                  | Status: AI Handling          |
|       | Katya I. (WA)    | ---                         |
|       |  "Wed at 2pm..." | Katya: Hi, I want to book   |
|       |  2 min ago       | AI: Hello! Welcome to...    |
|       |                  | Katya: Hair coloring         |
|       | Igor P. (FB)     | AI: Great! With Alina or...  |
|       |  "Cancel my..."  | Katya: Alina please          |
|       |  15 min ago      | AI: Available slots...       |
|       |                  | ...                          |
|       | Maria K. (SMS)   |                              |
|       |  "BOOK"          | [Take Over] [Flag] [Notes]   |
|       |  1h ago          |                              |
+-------+------------------+-----------------------------+
```

**Data Displayed:**
- List of all conversations (sorted by most recent)
- Each conversation: Client name, channel icon, last message preview, timestamp
- Badge for unread/escalated conversations
- Conversation detail: Full message history, AI and client messages distinguished
- Status: AI Handling, Escalated (needs human), Resolved

**Actions:**
- Search conversations
- Filter by channel (WhatsApp, Messenger, SMS, Voice) or status (AI, Escalated, Resolved)
- "Take Over" - Admin manually responds (AI paused for this conversation)
- "Flag" - Mark conversation for review
- "Notes" - Add internal notes to the conversation

**Mobile Layout:**
- List view by default, tap to open conversation detail (full screen)
- Back button to return to list

---

### 4.5 Analytics Dashboard Screen

**Desktop Layout:**
- Full-width dashboard with responsive card grid
- Date range selector at top
- 2 columns of charts on large screens, 1 column on smaller
- Interactive charts (hover for tooltips, click to drill down)

**Mobile Layout:**
- Single column, vertically scrollable
- Simplified charts (fewer data points)
- Key metrics as swipeable cards at top
- Charts load lazily as user scrolls

**Data Displayed:** All metrics defined in F22.

**Actions:**
- Change date range
- Toggle comparison period
- Tap chart segments to filter/drill down
- Export data (PDF/CSV)

---

## 5. Conversation Design Patterns

### 5.1 AI Greeting Templates Per Channel

**WhatsApp:**
```
"Hello! Welcome to [Salon Name]! I'm your virtual assistant and I can
help you book an appointment, check availability, or answer questions.
What would you like to do?"
```

**Facebook Messenger:**
```
"Hi there! Welcome to [Salon Name]!
I can help you with:
[Quick Reply: Book Appointment]
[Quick Reply: My Appointments]
[Quick Reply: Services & Prices]
[Quick Reply: Contact Us]"
```

**SMS:**
```
"[Salon Name]: Hi! I can help you book.
Reply BOOK to start, STATUS to check appointments, or HELP for options."
```

**Voice (ElevenLabs):**
```
"Hello! Thank you for calling [Salon Name]. I'm your virtual assistant.
I can help you book an appointment or answer questions about our services.
How can I help you today?"
```

### 5.2 Returning Client Greetings

When a client is recognized (phone number or messenger ID matched):

**WhatsApp/Messenger:**
```
"Hi [Name]! Welcome back to [Salon Name]!
Your last visit was [Service] with [Master] on [Date].
Would you like to book the same service again, or something different?"
```

**Voice:**
```
"Hello [Name]! Welcome back to [Salon Name].
Last time you had a [Service] with [Master].
Would you like to book the same, or something different today?"
```

### 5.3 Error Handling in Conversations

**AI Doesn't Understand (1st attempt):**
```
"I'm sorry, I didn't quite get that. Could you rephrase?
For example, you can say 'I want to book a haircut' or
'What services do you offer?'"
```

**AI Doesn't Understand (2nd attempt):**
```
"I'm having trouble understanding. Let me give you some options:
1. Book an appointment
2. Check my appointments
3. Services and prices
4. Talk to a person
Just reply with a number!"
```

**AI Doesn't Understand (3rd attempt - escalation):**
```
"I want to make sure you get the help you need. Let me connect
you with our team. Someone will respond shortly.
Our business hours are [hours]."
[Conversation escalated to admin queue]
```

**No Availability for Requested Time:**
```
"Unfortunately, [Master] doesn't have availability on [Date].
Here's what I can offer:
1. Other available times with [Master]: [List 3 nearest options]
2. Same time with another specialist: [Master2] is available
3. Add you to our waitlist - I'll notify you if a spot opens up
What would you prefer?"
```

**Service Not Offered:**
```
"I'm sorry, we don't currently offer [requested service].
Here are our available services that might be similar:
[List closest matching services]
Or would you like to see our full service menu?"
```

**Outside Business Hours (auto-reply):**
```
"Thank you for reaching out to [Salon Name]!
We're currently closed. Our business hours are:
[Hours]
I'll make sure to respond first thing when we're back.
Or you can book an appointment right now - I'm available 24/7 for bookings!"
```

### 5.4 Handoff to Human

**When AI Initiates Handoff:**
```
AI to Client: "Let me connect you with our team for this.
               Someone will be with you shortly!"

AI to Admin (internal notification):
"Escalated conversation from [Client Name] via [Channel].
 Reason: [AI couldn't understand / Complex request / Client requested human]
 Last messages: [Recent context]"
```

**When Client Requests Human:**
```
Client: "Can I talk to a real person?"
AI: "Of course! I'm connecting you with our team now.
     Please hold on for a moment. If you're contacting us
     outside business hours ([hours]), we'll get back to you
     as soon as we open."
```

**Admin Takes Over:**
- Admin sees escalated conversation in Messages screen
- Clicks "Take Over" - AI is paused for this conversation
- Admin responds directly
- Admin can click "Resume AI" when done to hand back to AI

### 5.5 Multi-language Considerations

**Language Detection:**
- AI detects client's language from first message
- Responds in the same language
- Supported languages configured by admin in settings
- Default language set per salon

**Language Switching:**
```
If client switches language mid-conversation:
AI: [Continues in newly detected language]
"[Translated greeting]. I see you prefer [Language].
I'll continue in [Language]. [Continue current flow]"
```

**Unsupported Language:**
```
AI: "I'm sorry, I currently only support [list languages].
     Can you please write in one of these languages?
     Or I can connect you with our team."
```

---

## 6. Edge Cases & Error States

### 6.1 Double Booking Prevention

**Scenario:** Two clients try to book the same slot simultaneously.

**Solution:**
- Slot locking: When AI starts offering a specific time slot to a client, that slot is soft-locked for 5 minutes
- If a second client requests the same slot during the lock, AI responds:
  ```
  "That slot was just booked. Let me check other available times..."
  [Shows next available slots]
  ```
- If the first client doesn't confirm within 5 minutes, the lock is released
- Database-level constraint: Unique constraint on (master_id, date, time_slot) prevents any actual double-booking
- If race condition occurs at DB level, the second booking fails gracefully and client is offered alternatives

### 6.2 Master Unavailable During Conversation

**Scenario:** Master becomes unavailable (blocks time) while a client is in the middle of booking with that master.

**Solution:**
```
AI: "I apologize, but [Master]'s availability just changed and
     the [Time] slot is no longer available.

     Here are updated options:
     1. [Master] is available at [alternative times]
     2. [Other Master] can do [Service] at [originally requested time]

     What would you prefer?"
```

- Availability is re-checked at the moment of final confirmation (not just when showing options)
- If the client had already confirmed but the booking hadn't been committed, apologize and offer alternatives

### 6.3 Network / Channel Failures

**WhatsApp API Down:**
- System detects delivery failure
- Queues messages for retry (exponential backoff: 1 min, 5 min, 15 min)
- After 3 failed retries: Admin notified via dashboard and email
- If client had a booking in progress: Booking is saved as "pending confirmation" and client is contacted when channel recovers
- Admin can manually switch to alternative channel (SMS fallback)

**Facebook Messenger Webhook Failure:**
- Similar retry logic
- Fallback: Admin can view and respond via Facebook page directly

**SMS Delivery Failure:**
- Carrier-level errors logged
- Invalid number: Mark client phone as invalid, flag for admin
- Rate limiting: Queue and pace outgoing messages

**ElevenLabs Voice API Down:**
- Fallback: Play pre-recorded message: "We're experiencing technical difficulties. Please try calling back in a few minutes, or message us on WhatsApp at [number]."
- Admin notified immediately
- Call log saved for callback

**General Internet Outage (Salon Side):**
- Cloud-based AI continues to handle messages
- Dashboard is unavailable for admin/masters
- All bookings and conversations are saved and accessible when connection is restored

### 6.4 Client Sends Ambiguous Messages

**Ambiguous Service Request:**
```
Client: "I want something for my hair"
AI: "We have several hair services! Which interests you?
     1. Haircut & Styling ($40, 60 min)
     2. Hair Coloring ($80, 120 min)
     3. Hair Treatment ($50, 60 min)
     4. Blowout ($30, 45 min)
     Or describe what you have in mind!"
```

**Ambiguous Time Reference:**
```
Client: "Tomorrow"
AI: "Tomorrow, [Day, Date]. What time works for you?
     [Master] has these available:
     * Morning: 9:00, 10:00, 11:00
     * Afternoon: 2:00, 3:00, 4:00"

Client: "Afternoon"
AI: "Which afternoon time?
     1. 2:00 PM
     2. 3:00 PM
     3. 4:00 PM"
```

**Ambiguous Intent:**
```
Client: "Is Maria working today?"
AI: "Yes, Maria is working today until 6:00 PM.
     Would you like to book an appointment with her?
     She has availability at [times]."
```

**Multiple Requests in One Message:**
```
Client: "Book haircut for me and coloring for my mom"
AI: "I'd be happy to help with both! Let's start with your haircut.

     For your haircut:
     Do you have a preferred stylist?"
[After first booking is complete:]
AI: "Your haircut is booked! Now let's arrange the coloring
     for your mom. What time works for her?"
```

**Client Sends Non-text Content:**
```
Client sends: [Photo]
AI: "Thanks for the photo! If you're showing us a style you'd like,
     I can help you book the right service.
     Would you like to book:
     1. Haircut & Styling
     2. Hair Coloring
     Or would you like me to share this with your stylist?"

Client sends: [Voice message] (WhatsApp)
AI: [Transcribes voice message and processes as text]
    [If transcription unclear:]
    "I had trouble understanding your voice message.
     Could you type your request instead?"

Client sends: [Location/Contact/Document]
AI: "Thanks! I can help you with booking appointments, checking
     availability, or answering questions. How can I assist you?"
```

### 6.5 Client Identity Resolution

**Same Client, Multiple Channels:**
```
Scenario: Katya books via WhatsApp, later messages via Messenger.

Resolution:
- System matches by phone number first (if available)
- Then by name + additional data points
- If uncertain: "Is this Katya who visited us on [Date] for [Service]?
  Just want to make sure I pull up the right records!"
- Admin can manually merge client records in the Clients section
```

**New Phone Number for Known Client:**
```
Client: "I got a new number, I used to come to you"
AI: "Welcome back! To pull up your records, could you tell me:
     1. Your name
     2. Your previous phone number or email
     I'll match your information right away."
[Match found -> Link new channel to existing client record]
[No match -> "I couldn't find a match. Our team will look into it.
              In the meantime, I can book you as a new client!"]
```

### 6.6 Capacity and Limits

**Salon Fully Booked:**
```
AI: "[Salon Name] is fully booked on [Date].
     The nearest available date is [Next Date].
     Would you like to:
     1. Book on [Next Date]
     2. Join our waitlist for [Requested Date]
     3. Check a different date"
```

**Master Overloaded (too many back-to-back bookings):**
- System enforces buffer times between appointments (configurable by admin)
- AI never offers slots that would violate buffer rules
- Example: If a 120-min coloring ends at 12:00 and buffer is 15 min, next offered slot is 12:15

**Conversation Timeout:**
```
[If client hasn't responded in 30 minutes during active booking:]
AI: "I haven't heard back from you. Your booking isn't confirmed yet.
     I'll hold the slot for another 30 minutes.
     Just reply when you're ready to continue!"

[If no response after 60 minutes total:]
AI: "It seems like you got busy! No worries - the slot has been
     released. Message me anytime to start a new booking."
[Soft-lock released, conversation marked as timed-out]
```

### 6.7 Data Privacy and Consent

**First-time Client (GDPR/Privacy):**
```
AI: "Before we proceed, I'd like to let you know that [Salon Name]
     uses your contact information to manage appointments and send
     reminders. You can opt out of messages anytime by replying STOP.

     Shall we continue with your booking?"
```

**Client Requests Data Deletion:**
```
Client: "Delete my data" / "Remove my information"
AI: "I understand you'd like to remove your data. I've forwarded
     your request to our team. They'll process it within 48 hours
     and confirm via this channel.

     Please note this will also cancel any upcoming appointments."
[Admin receives data deletion request in dashboard]
```

---

## Appendix: Flow Reference Matrix

| Flow | Trigger | Primary Actor | Channels | Priority |
|------|---------|---------------|----------|----------|
| F1 | Signup | Admin | Web | P0 - MVP |
| F2 | Invitation | Master | SMS/Email/WhatsApp | P0 - MVP |
| F3 | Settings | Admin | Web | P0 - MVP |
| F4 | Message | Client | WhatsApp | P0 - MVP |
| F5 | Message | Client | Messenger | P1 |
| F6 | Phone call | Client | Voice | P2 |
| F7 | SMS | Client | SMS | P1 |
| F8 | App open | Master | Web/Mobile | P0 - MVP |
| F9 | Manual | Master | Web/Mobile | P0 - MVP |
| F10 | Manual | Master | Web/Mobile | P1 |
| F11 | Navigation | Admin | Web | P0 - MVP |
| F12 | Message | Client | All | P0 - MVP |
| F13 | System | AI/System | All | P1 |
| F14 | Manual | Master | Web/Mobile | P0 - MVP |
| F15 | Message | Client | All | P0 - MVP |
| F16 | Scheduler | System | All | P0 - MVP |
| F17 | Scheduler | System | All | P1 |
| F18 | Booking | System | All | P0 - MVP |
| F19 | Cancellation | System | All | P0 - MVP |
| F20 | Scheduler | System | All | P2 |
| F21 | Navigation | Admin | Web | P0 - MVP |
| F22 | Navigation | Admin | Web | P2 |
| F23 | Navigation | Admin | Web | P1 |
| F24 | Settings | Admin | Web | P0 - MVP |

**Priority Legend:**
- **P0 - MVP:** Required for initial launch
- **P1:** Important, build in first iteration after MVP
- **P2:** Nice to have, can be phased in later

---

*End of UX Flows Document*

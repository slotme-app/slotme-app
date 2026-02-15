# Test Cases: US-MW-005 -- View Features

**User Story:** US-MW-005 -- As a prospective salon owner, I want to see what features SlotMe offers, so that I can evaluate if it solves my booking problems.
**Feature:** Marketing Website with Multi-Language Support
**Author:** QA Engineer
**Date:** 2026-02-15
**Base URL:** http://localhost:3033

---

## Happy Path Scenarios

### TC-029: Features section displays 6 feature cards
- **Description:** Verify the features section displays all 6 required features with complete content
- **Priority:** Critical
- **Browser/Device:** Desktop (1024px+ width)
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the Features section (or click "Features" in the navbar)
  3. Count the feature cards
  4. Verify each card's content
- **Expected Results:**
  - Section heading "Everything Your Salon Needs" (or equivalent) is displayed as `<h2>`
  - Exactly 6 feature cards are displayed in a 3-column grid
  - Each card contains:
    - An icon (56px square, rounded-2xl, gradient background)
    - A title (`<h3>` element)
    - A description paragraph
  - The 6 features are:
    1. AI Conversational Booking (WhatsApp, Messenger, Voice, SMS)
    2. Smart Calendar Management (no double-bookings, real-time availability)
    3. Automated Reminders and Notifications (reduce no-shows)
    4. Multi-Channel Support (meet clients where they are)
    5. Slot Rearrangement (fill cancelled slots automatically)
    6. Analytics Dashboard (business insights)

### TC-030: Feature card content is meaningful
- **Description:** Verify each feature description clearly communicates the benefit to a salon owner
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the Features section
  3. Read each feature title and description carefully
- **Expected Results:**
  - Each title clearly names a specific feature (not generic text)
  - Each description explains the benefit in 1-2 sentences from the salon owner's perspective
  - Descriptions are specific and actionable (e.g., "Never double-book again" rather than "Manage your calendar")
  - No placeholder or lorem ipsum text

---

## Responsive Behavior

### TC-031: Features section responsive grid layout
- **Description:** Verify the features grid adapts correctly to different viewport sizes
- **Priority:** High
- **Browser/Device:** Desktop + Tablet + Mobile
- **Preconditions:** None
- **Steps:**
  1. Open `/` at 1280px width, scroll to Features section, note the grid layout
  2. Resize browser to 768px width, observe the grid change
  3. Resize browser to 375px width, observe the grid change
- **Expected Results:**
  - Desktop (1280px): 3-column grid (`lg:grid-cols-3`), 2 rows of 3 cards
  - Tablet (768px): 2-column grid (`md:grid-cols-2`), 3 rows of 2 cards
  - Mobile (375px): 1-column stack, all 6 cards in a single column
  - Cards maintain consistent spacing and alignment at each breakpoint
  - No cards are cut off or overflow the viewport

### TC-062: Feature cards readable on mobile
- **Description:** Verify feature card content is fully readable on small screens
- **Priority:** Medium
- **Browser/Device:** Mobile (375px viewport)
- **Preconditions:** None
- **Steps:**
  1. Set viewport to 375px width
  2. Navigate to `/`
  3. Scroll to the Features section
  4. Read each feature card's icon, title, and description
- **Expected Results:**
  - Icons are visible and appropriately sized
  - Titles are fully visible (not truncated)
  - Descriptions are fully visible (not truncated)
  - Text is large enough to read without zooming (minimum 14px body text)

---

## Hover Interactions (Desktop Only)

### TC-032: Feature cards have hover interaction
- **Description:** Verify feature cards respond to mouse hover with visual feedback
- **Priority:** Low
- **Browser/Device:** Desktop (mouse required)
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the Features section
  3. Hover the mouse over a feature card
  4. Move mouse away from the card
  5. Repeat for another card
- **Expected Results:**
  - On hover: card border shifts to rose/accent color (`oklch(0.85 0.05 330)`)
  - On hover: shadow intensifies to `shadow-xl`
  - On hover: icon scales up slightly (110%)
  - Transitions are smooth (CSS transition)
  - On mouse leave: card returns to default state

---

## Multi-Language

### TC-033: Feature titles and descriptions translated in all languages
- **Description:** Verify all feature content is fully translated in Russian and Polish
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/` and note all 6 feature titles and descriptions (English)
  2. Navigate to `/ru` and compare all 6 feature titles and descriptions
  3. Navigate to `/pl` and compare all 6 feature titles and descriptions
- **Expected Results:**
  - All 6 feature titles are translated in Russian (Cyrillic text)
  - All 6 feature descriptions are translated in Russian
  - All 6 feature titles are translated in Polish
  - All 6 feature descriptions are translated in Polish
  - No English text remains in the RU/PL versions of the features section
  - Section heading ("Everything Your Salon Needs" equivalent) is also translated
  - Section subtitle is also translated
  - Icons remain the same across all languages

---

## Accessibility

### TC-063: Feature cards use semantic heading hierarchy
- **Description:** Verify feature card titles use proper `<h3>` elements
- **Priority:** Medium
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Open DevTools and inspect the Features section
  3. Check the heading elements
- **Expected Results:**
  - Section title uses `<h2>`
  - Each feature card title uses `<h3>`
  - Heading hierarchy is correct (h2 > h3)

### TC-064: Feature icons have appropriate ARIA attributes
- **Description:** Verify decorative feature icons are properly hidden from screen readers
- **Priority:** Medium
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Inspect the feature card icons in DevTools
- **Expected Results:**
  - Feature icons are either `<img>` with empty `alt=""` (decorative) or SVGs with `aria-hidden="true"`
  - Screen readers skip the icons and read only the title and description

---

*End of US-MW-005 Test Cases*

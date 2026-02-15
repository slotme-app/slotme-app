# Test Cases: US-MW-006 -- Read FAQ

**User Story:** US-MW-006 -- As a prospective salon owner, I want to read answers to common questions, so that I can resolve doubts before signing up.
**Feature:** Marketing Website with Multi-Language Support
**Author:** QA Engineer
**Date:** 2026-02-15
**Base URL:** http://localhost:3033

---

## Happy Path Scenarios

### TC-034: FAQ section displays at least 5 questions
- **Description:** Verify the FAQ section contains all required questions covering the specified topics
- **Priority:** Critical
- **Browser/Device:** Desktop (1024px+ width)
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the FAQ section (or click "FAQ" in the navbar)
  3. Count the visible questions
  4. Read each question text
- **Expected Results:**
  - Section heading "Frequently Asked Questions" (or equivalent) is displayed as `<h2>`
  - At least 5 FAQ questions are displayed (6 expected per FEATURE-BRIEF)
  - Questions cover these topics:
    1. Product overview: "What is SlotMe?"
    2. AI booking: "How does the AI booking work?"
    3. Supported channels: "Which messaging channels are supported?"
    4. Pricing: "How much does it cost?"
    5. Getting started: "How do I get started?"
    6. Data security: "Is my data secure?"
  - FAQ is laid out in a single centered column (`max-w-4xl`)

### TC-035: Accordion expand -- click a closed question
- **Description:** Verify that clicking a closed question expands it to reveal the answer
- **Priority:** Critical
- **Browser/Device:** Desktop
- **Preconditions:** FAQ section visible, all questions initially closed
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the FAQ section
  3. Verify all questions are in collapsed state (no answers visible)
  4. Click on the first question ("What is SlotMe?")
- **Expected Results:**
  - The answer panel for the clicked question expands and becomes visible
  - The chevron icon rotates 180 degrees (pointing up)
  - Answer text is readable, informative, and answers the question
  - The question button has `aria-expanded="true"`
  - Answer panel has a light gray background with a top border

### TC-036: Accordion collapse -- click an open question
- **Description:** Verify that clicking an already-open question collapses its answer
- **Priority:** Critical
- **Browser/Device:** Desktop
- **Preconditions:** FAQ section visible, one question already open
- **Steps:**
  1. Click a question to open it (if not already open)
  2. Verify the answer is visible
  3. Click the same question again
- **Expected Results:**
  - The answer panel collapses and is no longer visible
  - The chevron icon rotates back to its default position (pointing down)
  - The question button has `aria-expanded="false"`

### TC-037: Accordion single-select -- only one question open at a time
- **Description:** Verify that opening a new question automatically closes the previously open one
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** FAQ section visible
- **Steps:**
  1. Click the first question to open it
  2. Verify the first answer is visible
  3. Click the third question
  4. Observe both the first and third questions
- **Expected Results:**
  - The first question's answer collapses automatically
  - The third question's answer expands
  - Only one answer is visible at a time
  - The transition is smooth (chevron rotation, panel expand/collapse)

---

## Keyboard Accessibility

### TC-038: FAQ keyboard navigation
- **Description:** Verify FAQ accordion can be fully operated with keyboard only
- **Priority:** High
- **Browser/Device:** Desktop (Chrome or Firefox)
- **Preconditions:** FAQ section visible
- **Steps:**
  1. Use Tab key to navigate focus to the first FAQ question
  2. Press Enter to open the first question
  3. Verify the answer is visible
  4. Use Tab key to move focus to the second question
  5. Press Space to open the second question
  6. Verify the first question closed and the second is open
- **Expected Results:**
  - Focus ring is visible on the focused question button (clear outline or ring)
  - Enter key toggles the question open/closed
  - Tab moves focus to the next question sequentially
  - Space key also toggles the question open/closed
  - When a new question opens, the previous one closes (single-select behavior maintained)
  - Focus remains on the activated question button after toggling

### TC-065: FAQ ARIA attributes present
- **Description:** Verify proper ARIA attributes on FAQ accordion elements
- **Priority:** Medium
- **Browser/Device:** Desktop with DevTools
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Inspect the FAQ section in DevTools
  3. Check ARIA attributes on question buttons and answer panels
- **Expected Results:**
  - FAQ section or container has `role="region"` (or semantic `<section>`)
  - Each question button has `aria-expanded="true"` or `"false"` reflecting state
  - Each question button has `aria-controls="faq-answer-{n}"` pointing to its answer panel
  - Each answer panel has a corresponding `id="faq-answer-{n}"`

---

## Multi-Language

### TC-039: FAQ questions and answers translated in all languages
- **Description:** Verify FAQ content is fully translated in Russian and Polish
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/` and expand each FAQ item, noting all questions and answers (English)
  2. Navigate to `/ru` and expand each FAQ item (Russian)
  3. Navigate to `/pl` and expand each FAQ item (Polish)
- **Expected Results:**
  - All questions are translated in Russian (Cyrillic text, not English)
  - All answers are translated in Russian
  - All questions are translated in Polish
  - All answers are translated in Polish
  - No English text remains in the RU/PL versions
  - Section heading ("Frequently Asked Questions" equivalent) is also translated
  - Answer content quality is adequate (not machine-translated gibberish)

---

## Progressive Enhancement

### TC-040: FAQ works without JavaScript
- **Description:** Verify FAQ content is accessible when JavaScript is disabled (progressive enhancement)
- **Priority:** Medium
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Open browser DevTools > Settings > Disable JavaScript
  2. Navigate to `/`
  3. Scroll to the FAQ section
  4. Observe the FAQ display
  5. Re-enable JavaScript after test
- **Expected Results:**
  - All FAQ questions and answers are visible (all expanded by default)
  - Content is fully readable even without accordion interactivity
  - No JavaScript errors prevent content from displaying
  - Users can read all FAQ answers without needing to interact

---

## Edge Cases

### TC-066: FAQ hover state on desktop
- **Description:** Verify FAQ question items respond to hover
- **Priority:** Low
- **Browser/Device:** Desktop (mouse required)
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the FAQ section
  3. Hover over a closed FAQ question
- **Expected Results:**
  - Question container border shifts to rose/accent color
  - Background may lighten slightly
  - Transition is smooth
  - Cursor shows pointer

### TC-067: FAQ touch interaction on mobile
- **Description:** Verify FAQ accordion works with touch on mobile devices
- **Priority:** High
- **Browser/Device:** Mobile (375px viewport) or actual mobile device
- **Preconditions:** None
- **Steps:**
  1. Set viewport to 375px width (or use actual mobile device)
  2. Navigate to `/`
  3. Scroll to the FAQ section
  4. Tap on the first question
  5. Verify answer expands
  6. Tap on the third question
  7. Verify first closes and third opens
- **Expected Results:**
  - Tapping a question opens its answer
  - Single-select behavior works on touch (only one open at a time)
  - Touch targets are large enough (question button has `py-6`, well above 44px minimum)
  - No double-tap or long-press is required

### TC-068: All FAQ answers contain substantive content
- **Description:** Verify that each FAQ answer provides a useful, substantive response
- **Priority:** Medium
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Expand each FAQ item one by one
  3. Read each answer
- **Expected Results:**
  - Each answer is at least 1-2 sentences long
  - Answers are factual and relevant to the question
  - No placeholder text, lorem ipsum, or "TBD" content
  - Answers address the question directly

---

*End of US-MW-006 Test Cases*

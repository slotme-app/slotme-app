# Test Cases: US-MW-003 -- Navigate to Registration

**User Story:** US-MW-003 -- As a prospective salon owner, I want to click "Sign Up" or "Get Started", so that I can create a new salon account.
**Feature:** Marketing Website with Multi-Language Support
**Author:** QA Engineer
**Date:** 2026-02-15
**Base URL:** http://localhost:3033

---

## Happy Path Scenarios

### TC-013: Click Sign Up in navbar (desktop)
- **Description:** Verify that clicking "Sign Up" in the desktop navbar navigates to the registration page
- **Priority:** Critical
- **Browser/Device:** Desktop (Chrome/Firefox/Safari), 1024px+ width
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Navigate to `/`
  2. Locate the "Sign Up" button in the navigation bar (gradient pill button, primary CTA style)
  3. Click "Sign Up"
- **Expected Results:**
  - Browser navigates to `/register`
  - React SPA registration form is displayed (3-step form: Account -> Salon -> Confirm)
  - URL in the address bar shows `/register`

### TC-014: Click Sign Up in navbar (mobile)
- **Description:** Verify that clicking "Sign Up" on mobile navigates to the registration page
- **Priority:** Critical
- **Browser/Device:** Mobile (375px viewport) or Mobile Safari/Chrome for Android
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Set viewport to 375px width
  2. Navigate to `/`
  3. Tap "Sign Up" button in the navigation bar (always visible, gradient pill style)
- **Expected Results:**
  - Browser navigates to `/register`
  - Registration page is displayed and usable on mobile viewport

### TC-015: Click "Get Started Free" in hero section
- **Description:** Verify the primary CTA in the hero section navigates to the registration page
- **Priority:** Critical
- **Browser/Device:** Desktop (1024px+ width)
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Navigate to `/`
  2. Locate the hero section (first section after the navbar)
  3. Click the primary CTA button "Get Started Free" (gradient pill button)
- **Expected Results:**
  - Browser navigates to `/register`
  - Registration page is displayed
  - The CTA button is visually prominent with gradient background (rose to purple)

### TC-016: Click CTA in bottom CTA section
- **Description:** Verify the bottom CTA button navigates to the registration page
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the bottom CTA section (headline: "Ready to Transform Your Salon?")
  3. Click the CTA button "Get Started Free"
- **Expected Results:**
  - Browser navigates to `/register`
  - Registration page is displayed
  - Trust signal "No credit card required" is visible near the button

### TC-017: Click secondary CTA "Log In" in hero section
- **Description:** Verify the secondary CTA in the hero section navigates to the login page
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Navigate to `/`
  2. Locate the hero section
  3. Click the secondary CTA button "Log In" (outline style, next to "Get Started Free")
- **Expected Results:**
  - Browser navigates to `/login`
  - Login page is displayed
  - The secondary CTA is visually distinct from the primary CTA (outline border, not gradient)

---

## Edge Cases

### TC-018: Back button returns to marketing page from registration
- **Description:** Verify the browser back button works correctly after navigating to registration
- **Priority:** Medium
- **Browser/Device:** Desktop (any modern browser)
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Click "Get Started Free" to navigate to `/register`
  3. Verify the registration page is displayed
  4. Click the browser back button
- **Expected Results:**
  - Browser returns to the marketing page at `/`
  - Marketing page content is fully displayed

### TC-052: All CTA buttons navigate to /register from Russian variant
- **Description:** Verify all registration CTAs work from the Russian language version
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/ru`
  2. Click "Sign Up" equivalent in the navbar
  3. Verify navigation to `/register`
  4. Go back to `/ru`
  5. Click "Get Started Free" equivalent in the hero section
  6. Verify navigation to `/register`
  7. Go back to `/ru`
  8. Scroll to bottom CTA and click the CTA button
  9. Verify navigation to `/register`
- **Expected Results:**
  - All three CTA buttons navigate to `/register` from the Russian version
  - CTA button text is in Russian
  - Registration page loads correctly after each click

### TC-053: All CTA buttons navigate to /register from Polish variant
- **Description:** Verify all registration CTAs work from the Polish language version
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/pl`
  2. Click "Sign Up" equivalent in the navbar
  3. Verify navigation to `/register`
  4. Go back to `/pl`
  5. Click "Get Started Free" equivalent in the hero section
  6. Verify navigation to `/register`
- **Expected Results:**
  - CTA buttons navigate to `/register` from the Polish version
  - CTA button text is in Polish

### TC-054: Sign Up links are proper anchor tags
- **Description:** Verify registration links use proper anchor tags that work with right-click "Open in New Tab"
- **Priority:** Medium
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Right-click the navbar "Sign Up" button
  3. Select "Open in New Tab"
  4. Right-click the hero "Get Started Free" button
  5. Select "Open in New Tab"
- **Expected Results:**
  - Both links open `/register` in a new tab
  - Elements are `<a>` tags with `href="/register"`

---

## Responsive Behavior

### TC-055: Hero CTA buttons stack vertically on mobile
- **Description:** Verify that hero CTA buttons stack vertically on mobile viewport
- **Priority:** Medium
- **Browser/Device:** Mobile (375px viewport)
- **Preconditions:** None
- **Steps:**
  1. Set viewport to 375px width
  2. Navigate to `/`
  3. Observe the hero section CTA buttons
- **Expected Results:**
  - "Get Started Free" and "Log In" buttons are stacked vertically (not side by side)
  - Both buttons are full width or near full width
  - Both buttons have adequate touch target size (at least 44px height)

---

## Accessibility

### TC-056: CTA buttons keyboard accessible
- **Description:** Verify all registration CTA buttons can be activated via keyboard
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Tab to the "Sign Up" button in the navbar, press Enter
  3. Go back, tab to the hero "Get Started Free" button, press Enter
- **Expected Results:**
  - Focus indicators are visible on each CTA button when focused
  - Pressing Enter on each button navigates to `/register`

---

*End of US-MW-003 Test Cases*

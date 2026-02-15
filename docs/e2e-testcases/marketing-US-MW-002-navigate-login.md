# Test Cases: US-MW-002 -- Navigate to Login

**User Story:** US-MW-002 -- As an existing user, I want to click "Log In" on the marketing website, so that I can access my SlotMe dashboard.
**Feature:** Marketing Website with Multi-Language Support
**Author:** QA Engineer
**Date:** 2026-02-15
**Base URL:** http://localhost:3033

---

## Happy Path Scenarios

### TC-009: Click Log In in navbar (desktop)
- **Description:** Verify that clicking "Log In" in the desktop navbar navigates to the login page
- **Priority:** Critical
- **Browser/Device:** Desktop (Chrome/Firefox/Safari), 1024px+ width
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Navigate to `/`
  2. Locate the "Log In" button in the navigation bar (text link style, not gradient)
  3. Click "Log In"
- **Expected Results:**
  - Browser navigates to `/login`
  - React SPA login form is displayed with email and password fields
  - URL in the address bar shows `/login`

### TC-010: Click Log In in navbar (mobile)
- **Description:** Verify that clicking "Log In" on mobile navigates to the login page
- **Priority:** Critical
- **Browser/Device:** Mobile (375px viewport) or Mobile Safari/Chrome for Android
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Set viewport to 375px width
  2. Navigate to `/`
  3. Tap "Log In" button in the navigation bar (visible without hamburger menu)
- **Expected Results:**
  - Browser navigates to `/login`
  - Login page is displayed and usable on mobile viewport
  - No layout issues on the login page at mobile width

### TC-011: Log In button visible without scrolling
- **Description:** Verify the Log In button is immediately visible on page load without any user interaction
- **Priority:** High
- **Browser/Device:** Desktop (1280px) and Mobile (375px)
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/` on desktop (1280px viewport)
  2. Without scrolling, verify "Log In" is visible in the navbar
  3. Navigate to `/` on mobile (375px viewport)
  4. Without scrolling, verify "Log In" is visible in the navbar
- **Expected Results:**
  - "Log In" button is visible in the fixed navbar on desktop without scrolling
  - "Log In" button is visible in the fixed navbar on mobile without scrolling
  - The button is clearly distinguishable as a clickable element

---

## Edge Cases

### TC-012: Back button returns to marketing page from login
- **Description:** Verify the browser back button works correctly after navigating from marketing site to login
- **Priority:** Medium
- **Browser/Device:** Desktop (any modern browser)
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Click "Log In" to navigate to `/login`
  3. Verify the login page is displayed
  4. Click the browser back button
- **Expected Results:**
  - Browser returns to the marketing page at `/`
  - Marketing page content is fully displayed (SSR page re-renders correctly)
  - Scroll position may reset to top (acceptable for SSR page)

### TC-048: Log In button works from Russian language variant
- **Description:** Verify the Log In button navigates to `/login` from the Russian language version
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/ru`
  2. Locate the "Log In" equivalent button in the navbar (may show Russian text)
  3. Click it
- **Expected Results:**
  - Browser navigates to `/login`
  - Login page is displayed
  - Login page renders correctly (in its own language, not affected by marketing page language)

### TC-049: Log In button works from Polish language variant
- **Description:** Verify the Log In button navigates to `/login` from the Polish language version
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/pl`
  2. Locate the "Log In" equivalent button in the navbar
  3. Click it
- **Expected Results:**
  - Browser navigates to `/login`
  - Login page is displayed

### TC-050: Log In link is an anchor tag with correct href
- **Description:** Verify the Log In button uses a proper anchor tag that can be opened in new tab or copied
- **Priority:** Medium
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Right-click on "Log In" button
  3. Select "Open in New Tab"
  4. Also check "Copy Link Address"
- **Expected Results:**
  - The link opens `/login` in a new tab
  - Copied link address ends with `/login`
  - The element is an `<a>` tag with `href="/login"` (not a button with JavaScript navigation)

---

## Accessibility

### TC-051: Log In button keyboard accessible
- **Description:** Verify the Log In button can be activated via keyboard
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Press Tab until focus reaches the "Log In" button
  3. Press Enter
- **Expected Results:**
  - Focus indicator is visible on the "Log In" button when focused
  - Pressing Enter navigates to `/login`
  - Login page loads successfully

---

*End of US-MW-002 Test Cases*

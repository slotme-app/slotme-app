# Test Cases: US-MW-001 -- View Marketing Website

**User Story:** US-MW-001 -- As a prospective salon owner, I want to visit the SlotMe website and understand what the product does, so that I can decide if it fits my salon's needs.
**Feature:** Marketing Website with Multi-Language Support
**Author:** QA Engineer
**Date:** 2026-02-15
**Base URL:** http://localhost:3033

---

## Happy Path Scenarios

### TC-001: All sections visible on desktop
- **Description:** Verify that the marketing landing page displays all required sections in correct order on desktop
- **Priority:** Critical
- **Browser/Device:** Desktop (Chrome/Firefox/Safari), 1280px+ width
- **Preconditions:** Backend running on port 8083, frontend on port 3033
- **Steps:**
  1. Navigate to `/`
  2. Wait for the page to fully load
  3. Scroll through the entire page from top to bottom
- **Expected Results:**
  - Navigation bar is visible and fixed at the top (64px height, semi-transparent white with backdrop blur)
  - Hero section is displayed with headline ("Your AI Receptionist"), subtitle, description, and two CTA buttons ("Get Started Free" and "Log In")
  - Features section displays 6 feature cards with icons, titles, and descriptions in a 3-column grid
  - How It Works section shows 4 numbered steps with horizontal connector lines between them
  - Benefits/Stats section displays 4 stat cards on a dark purple-charcoal gradient background
  - FAQ section displays at least 5 questions in accordion format (single column, centered)
  - Bottom CTA section displays headline "Ready to Transform Your Salon?" and a CTA button
  - Footer displays with SlotMe logo, product links, legal links, contact email, language switcher, and copyright notice

### TC-002: Page renders as server-side HTML (SSR)
- **Description:** Verify the marketing page is server-side rendered and does not require JavaScript for initial content display
- **Priority:** Critical
- **Browser/Device:** Desktop (any modern browser)
- **Preconditions:** Backend running
- **Steps:**
  1. Open browser DevTools > Settings > Disable JavaScript
  2. Navigate to `/`
  3. Observe the page content
  4. Re-enable JavaScript after test
- **Expected Results:**
  - All page sections render with full text content visible
  - No blank page or loading spinners appear
  - All headings, descriptions, and FAQ answers are visible (FAQ defaults to all-expanded without JS)
  - Page is fully readable without JavaScript
  - Images display (or show alt text)

### TC-005: Smooth scroll to anchor sections
- **Description:** Verify that clicking navigation anchor links scrolls smoothly to the target section
- **Priority:** High
- **Browser/Device:** Desktop, 1024px+ width
- **Preconditions:** Page fully loaded at `/`
- **Steps:**
  1. Navigate to `/`
  2. Click "Features" in the navigation bar
  3. Observe scroll behavior
  4. Click "How It Works" in the navigation bar
  5. Observe scroll behavior
  6. Click "FAQ" in the navigation bar
  7. Observe scroll behavior
- **Expected Results:**
  - Page scrolls smoothly (not instantly) to the Features section with the section heading visible
  - Page scrolls smoothly to the How It Works section
  - Page scrolls smoothly to the FAQ section
  - Fixed navbar does not overlap the target section heading (scroll offset accounts for 64px navbar using `scroll-margin-top: 80px`)
  - URL hash updates to match the anchor (e.g., `#features`, `#how-it-works`, `#faq`)

---

## Responsive Behavior

### TC-003: Responsive layout on mobile (375px)
- **Description:** Verify the marketing page displays correctly on a mobile viewport
- **Priority:** Critical
- **Browser/Device:** Mobile Safari (iOS 15+) or Chrome for Android, or desktop browser at 375px width
- **Preconditions:** None
- **Steps:**
  1. Set browser viewport to 375px width
  2. Navigate to `/`
  3. Scroll through the entire page
  4. Attempt to scroll horizontally
- **Expected Results:**
  - No horizontal scrollbar appears
  - All content is readable without zooming
  - Navigation: section links (Features, How It Works, FAQ) are hidden; Logo, language switcher, Log In, and Sign Up buttons remain visible
  - Hero section: stacks vertically (text above visual placeholder), title uses `text-6xl` size, CTA buttons stack vertically
  - Feature cards: display in a single column
  - How It Works steps: display in a single column without connector lines
  - Stats: display in a single column
  - FAQ section: full width, single column centered
  - Footer columns: stack vertically
  - All touch targets are at least 44x44px

### TC-004: Responsive layout on tablet (768px)
- **Description:** Verify the marketing page displays correctly on a tablet viewport
- **Priority:** High
- **Browser/Device:** iPad or desktop browser at 768px width
- **Preconditions:** None
- **Steps:**
  1. Set browser viewport to 768px width
  2. Navigate to `/`
  3. Scroll through the entire page
- **Expected Results:**
  - No horizontal scrollbar appears
  - Navigation section links (Features, How It Works, FAQ) become visible
  - Feature cards display in a 2-column grid
  - How It Works steps display in a 2-column grid
  - Stats display in a 2-column grid
  - Footer displays in a 4-column grid
  - All spacing is tighter than desktop but content is not cramped

### TC-046: Responsive layout on large desktop (1920px)
- **Description:** Verify the marketing page is constrained to max-width on large screens
- **Priority:** Medium
- **Browser/Device:** Desktop at 1920px width
- **Preconditions:** None
- **Steps:**
  1. Set browser viewport to 1920px width
  2. Navigate to `/`
  3. Observe content alignment
- **Expected Results:**
  - Content is centered and constrained to `max-w-7xl` (1280px)
  - Page does not stretch to fill the full viewport width
  - Background gradient extends to edges

---

## SEO Verification

### TC-006: SEO meta tags present
- **Description:** Verify that proper SEO meta tags are rendered in the page source
- **Priority:** High
- **Browser/Device:** Any desktop browser
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. View page source (Ctrl+U / Cmd+U)
  3. Inspect the `<head>` section
- **Expected Results:**
  - `<title>` tag contains "SlotMe -- AI Virtual Receptionist for Beauty Salons"
  - `<meta name="description">` tag is present with marketing copy about AI salon booking
  - Open Graph tags are present:
    - `og:type` = "website"
    - `og:title` = "SlotMe - AI Virtual Receptionist"
    - `og:description` is present
    - `og:image` references `/og-image.jpg`
    - `og:url` is present
  - `hreflang` tags are present for `en`, `ru`, `pl`, and `x-default`
  - Semantic HTML is used: `<nav>`, `<main>`, `<section>`, `<footer>` elements present
  - Heading hierarchy is correct: single `<h1>`, followed by `<h2>` for each section

### TC-007: Sitemap.xml available
- **Description:** Verify that sitemap.xml is accessible and contains language variant URLs
- **Priority:** Medium
- **Browser/Device:** Any
- **Preconditions:** Backend running
- **Steps:**
  1. Navigate to `/sitemap.xml`
  2. Inspect the XML content
- **Expected Results:**
  - Valid XML sitemap is returned with correct content type
  - Contains URLs for `/`, `/ru`, and `/pl`
  - Each URL includes `<lastmod>` date

### TC-008: Robots.txt available
- **Description:** Verify that robots.txt is accessible and properly configured
- **Priority:** Medium
- **Browser/Device:** Any
- **Preconditions:** Backend running
- **Steps:**
  1. Navigate to `/robots.txt`
  2. Inspect the content
- **Expected Results:**
  - Valid robots.txt is returned as plain text
  - Contains `User-agent: *` directive
  - References the sitemap URL (`Sitemap: .../sitemap.xml`)

---

## Accessibility

### TC-042: Heading hierarchy
- **Description:** Verify the page has correct heading hierarchy for screen readers
- **Priority:** High
- **Browser/Device:** Desktop with accessibility inspector
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Use browser dev tools or an accessibility extension (e.g., axe, WAVE) to list all headings
- **Expected Results:**
  - Exactly one `<h1>` element in the hero section
  - Multiple `<h2>` elements for section titles: Features, How It Works, Benefits, FAQ, Bottom CTA
  - `<h3>` elements for feature card titles and How It Works step titles
  - No heading level is skipped (no h1 -> h3 without h2)

### TC-043: Keyboard navigation through entire page
- **Description:** Verify all interactive elements are keyboard accessible
- **Priority:** High
- **Browser/Device:** Desktop (Chrome or Firefox)
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Press Tab repeatedly to move through all interactive elements
  3. Note the focus order and visibility of focus indicators
- **Expected Results:**
  - Focus moves through in logical order: skip-to-content link (if present) -> nav section links -> language switcher buttons (EN, RU, PL) -> Log In -> Sign Up -> hero CTA buttons -> FAQ question buttons -> footer links -> footer language switcher
  - All focused elements have a visible focus indicator (ring or outline)
  - No interactive element is skipped or unreachable
  - Focus does not get trapped in any element

### TC-047: Color contrast compliance
- **Description:** Verify text meets WCAG 2.1 AA color contrast requirements
- **Priority:** High
- **Browser/Device:** Desktop with accessibility contrast checker
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Run an accessibility contrast checker (axe DevTools, WAVE, or Lighthouse)
  3. Check the dark stats section specifically
  4. Check the CTA gradient buttons with white text
- **Expected Results:**
  - All body text meets 4.5:1 contrast ratio against its background
  - All large text (18px+ or 14px+ bold) meets 3:1 contrast ratio
  - White text on the dark stats section background passes
  - White text on CTA gradient buttons passes (minimum 4.5:1)
  - No contrast failures reported by the checker

---

## Cross-Cutting / Integration

### TC-041: Navigation between marketing site and SPA routes
- **Description:** Verify that the marketing site and React SPA coexist correctly
- **Priority:** Critical
- **Browser/Device:** Desktop (any modern browser)
- **Preconditions:** Both backend and frontend running
- **Steps:**
  1. Navigate to `/` -- verify marketing page loads (SSR/Thymeleaf)
  2. Click "Log In" -- verify navigation to `/login`
  3. Click browser back button
  4. Click "Sign Up" -- verify navigation to `/register`
  5. Click browser back button
- **Expected Results:**
  - Marketing page at `/` is server-side rendered (full HTML in page source)
  - `/login` loads the React SPA login form
  - `/register` loads the React SPA registration form
  - Browser back/forward navigation works correctly between SSR and SPA pages
  - No JavaScript errors in the console during transitions

### TC-044: Performance - page loads within acceptable time
- **Description:** Verify the marketing page loads quickly (SSR advantage)
- **Priority:** Medium
- **Browser/Device:** Desktop (Chrome with DevTools)
- **Preconditions:** None
- **Steps:**
  1. Open Chrome DevTools > Performance tab
  2. Clear cache (hard reload: Ctrl+Shift+R)
  3. Navigate to `/`
  4. Observe loading metrics in Performance/Lighthouse tabs
- **Expected Results:**
  - First Contentful Paint (FCP) under 1.5 seconds
  - Largest Contentful Paint (LCP) under 2.5 seconds
  - Total page weight is reasonable for a static marketing page (under 2MB including fonts/images)
  - No render-blocking resources delay the initial paint

### TC-045: Logo links to home page
- **Description:** Verify clicking the SlotMe logo navigates to the marketing home page
- **Priority:** Medium
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/ru`
  2. Click the SlotMe logo in the navbar
- **Expected Results:**
  - Browser navigates to the marketing home page (current language root)
  - Marketing page is displayed
  - Logo has `aria-label="SlotMe home"` for accessibility

---

*End of US-MW-001 Test Cases*

# Test Cases: Marketing Website with Multi-Language Support

**Feature:** Marketing Website with Multi-Language Support
**Author:** QA Engineer
**Date:** 2026-02-15
**Base URL:** http://localhost:3033

---

## US-MW-001: View Marketing Website

### TC-001: All sections visible on desktop
- **Description:** Verify that the marketing landing page displays all required sections in correct order on desktop
- **Priority:** Critical
- **Preconditions:** Desktop browser at 1280px+ width
- **Steps:**
  1. Navigate to `/`
  2. Wait for the page to fully load
  3. Scroll through the entire page from top to bottom
- **Expected Results:**
  - Navigation bar is visible and fixed at the top
  - Hero section is displayed with headline, subtitle, description, and CTA buttons
  - Features section displays at least 6 feature cards with icons, titles, and descriptions
  - How It Works section shows 4 numbered steps with connector lines
  - Benefits/Stats section displays 4 stat cards on a dark background
  - FAQ section displays at least 5 questions in accordion format
  - Bottom CTA section displays a headline and CTA button
  - Footer displays with logo, product links, legal links, contact, and language switcher

### TC-002: Page renders as server-side HTML (SSR)
- **Description:** Verify the marketing page is server-side rendered and does not require JavaScript for initial content display
- **Priority:** Critical
- **Preconditions:** Desktop browser
- **Steps:**
  1. Disable JavaScript in the browser
  2. Navigate to `/`
  3. Observe the page content
- **Expected Results:**
  - All page sections render with full text content visible
  - No blank page or loading spinners
  - All headings, descriptions, and FAQ answers are visible
  - Page is fully readable without JavaScript

### TC-003: Responsive layout on mobile (375px)
- **Description:** Verify the marketing page displays correctly on a mobile viewport
- **Priority:** Critical
- **Preconditions:** Browser viewport set to 375px width
- **Steps:**
  1. Navigate to `/`
  2. Scroll through the entire page
  3. Verify there is no horizontal scrolling
- **Expected Results:**
  - No horizontal scrollbar appears
  - All content is readable without zooming
  - Navigation section links are hidden; Logo, language switcher, Log In, and Sign Up are visible
  - Hero section stacks vertically (text above visual)
  - Feature cards display in a single column
  - How It Works steps display in a single column without connector lines
  - Stats display in a single column
  - FAQ section is full width
  - Footer columns stack vertically
  - CTA buttons stack vertically

### TC-004: Responsive layout on tablet (768px)
- **Description:** Verify the marketing page displays correctly on a tablet viewport
- **Priority:** High
- **Preconditions:** Browser viewport set to 768px width
- **Steps:**
  1. Navigate to `/`
  2. Scroll through the entire page
- **Expected Results:**
  - No horizontal scrollbar appears
  - Navigation section links become visible
  - Feature cards display in a 2-column grid
  - How It Works steps display in a 2-column grid
  - Stats display in a 2-column grid
  - Footer displays in a 4-column grid

### TC-005: Smooth scroll to anchor sections
- **Description:** Verify that clicking navigation anchor links scrolls smoothly to the target section
- **Priority:** High
- **Preconditions:** Desktop browser, page fully loaded
- **Steps:**
  1. Navigate to `/`
  2. Click "Features" in the navigation bar
  3. Click "How It Works" in the navigation bar
  4. Click "FAQ" in the navigation bar
- **Expected Results:**
  - Page scrolls smoothly to the Features section with the section heading visible
  - Page scrolls smoothly to the How It Works section
  - Page scrolls smoothly to the FAQ section
  - Fixed navbar does not overlap the target section heading (scroll offset accounts for 64px navbar)

### TC-006: SEO meta tags present
- **Description:** Verify that proper SEO meta tags are rendered in the page source
- **Priority:** High
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. View page source (Ctrl+U)
  3. Inspect the `<head>` section
- **Expected Results:**
  - `<title>` tag contains "SlotMe" and describes the product
  - `<meta name="description">` tag is present with marketing copy
  - Open Graph tags are present: `og:type`, `og:title`, `og:description`, `og:image`, `og:url`
  - `hreflang` tags are present for `en`, `ru`, `pl`, and `x-default`
  - Semantic HTML is used (proper `<nav>`, `<main>`, `<section>`, `<footer>` elements)
  - Heading hierarchy is correct (single `<h1>`, followed by `<h2>` for sections)

### TC-007: Sitemap.xml available
- **Description:** Verify that sitemap.xml is accessible and contains language variant URLs
- **Priority:** Medium
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/sitemap.xml`
- **Expected Results:**
  - Valid XML sitemap is returned
  - Contains URLs for `/`, `/ru`, and `/pl`

### TC-008: Robots.txt available
- **Description:** Verify that robots.txt is accessible
- **Priority:** Medium
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/robots.txt`
- **Expected Results:**
  - Valid robots.txt is returned
  - References the sitemap URL

---

## US-MW-002: Navigate to Login

### TC-009: Click Log In in navbar (desktop)
- **Description:** Verify that clicking "Log In" in the desktop navbar navigates to the login page
- **Priority:** Critical
- **Preconditions:** Desktop browser, marketing page loaded
- **Steps:**
  1. Navigate to `/`
  2. Click "Log In" button in the navigation bar
- **Expected Results:**
  - Browser navigates to `/login`
  - Login page is displayed (React SPA login form)

### TC-010: Click Log In in navbar (mobile)
- **Description:** Verify that clicking "Log In" on mobile navigates to the login page
- **Priority:** Critical
- **Preconditions:** Mobile viewport (375px), marketing page loaded
- **Steps:**
  1. Navigate to `/`
  2. Tap "Log In" button in the navigation bar
- **Expected Results:**
  - Browser navigates to `/login`
  - Login page is displayed

### TC-011: Log In button visible without scrolling
- **Description:** Verify the Log In button is immediately visible on page load
- **Priority:** High
- **Preconditions:** Desktop and mobile browsers
- **Steps:**
  1. Navigate to `/`
  2. Without scrolling, check the navbar
- **Expected Results:**
  - "Log In" button is visible in the fixed navbar on both desktop and mobile
  - No scrolling is needed to find the login link

### TC-012: Back button returns to marketing page from login
- **Description:** Verify the browser back button works correctly after navigating to login
- **Priority:** Medium
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Click "Log In" to go to `/login`
  3. Click the browser back button
- **Expected Results:**
  - Browser returns to the marketing page at `/`
  - Marketing page content is fully displayed

---

## US-MW-003: Navigate to Registration

### TC-013: Click Sign Up in navbar (desktop)
- **Description:** Verify that clicking "Sign Up" in the desktop navbar navigates to the registration page
- **Priority:** Critical
- **Preconditions:** Desktop browser, marketing page loaded
- **Steps:**
  1. Navigate to `/`
  2. Click "Sign Up" button in the navigation bar
- **Expected Results:**
  - Browser navigates to `/register`
  - Registration page is displayed (React SPA registration form)

### TC-014: Click Sign Up in navbar (mobile)
- **Description:** Verify that clicking "Sign Up" on mobile navigates to the registration page
- **Priority:** Critical
- **Preconditions:** Mobile viewport (375px), marketing page loaded
- **Steps:**
  1. Navigate to `/`
  2. Tap "Sign Up" button in the navigation bar
- **Expected Results:**
  - Browser navigates to `/register`
  - Registration page is displayed

### TC-015: Click "Get Started Free" in hero section
- **Description:** Verify the primary CTA in the hero section navigates to registration
- **Priority:** Critical
- **Preconditions:** Desktop browser, marketing page loaded
- **Steps:**
  1. Navigate to `/`
  2. Locate the hero section
  3. Click "Get Started Free" (or equivalent primary CTA button)
- **Expected Results:**
  - Browser navigates to `/register`
  - Registration page is displayed

### TC-016: Click CTA in bottom CTA section
- **Description:** Verify the bottom CTA button navigates to registration
- **Priority:** High
- **Preconditions:** Desktop browser, marketing page loaded
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the bottom CTA section ("Ready to Transform Your Salon?")
  3. Click the CTA button ("Get Started Free")
- **Expected Results:**
  - Browser navigates to `/register`
  - Registration page is displayed

### TC-017: Click secondary CTA "Log In" in hero section
- **Description:** Verify the secondary CTA in the hero section navigates to login
- **Priority:** High
- **Preconditions:** Desktop browser, marketing page loaded
- **Steps:**
  1. Navigate to `/`
  2. Locate the hero section
  3. Click "Log In" (secondary outline CTA button)
- **Expected Results:**
  - Browser navigates to `/login`
  - Login page is displayed

### TC-018: Back button returns to marketing page from registration
- **Description:** Verify the browser back button works correctly after navigating to registration
- **Priority:** Medium
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Click "Get Started Free" to go to `/register`
  3. Click the browser back button
- **Expected Results:**
  - Browser returns to the marketing page at `/`
  - Marketing page content is fully displayed

---

## US-MW-004: Switch Language

### TC-019: Switch language from EN to RU via header switcher
- **Description:** Verify switching language to Russian updates all page content
- **Priority:** Critical
- **Preconditions:** Marketing page loaded in English (default)
- **Steps:**
  1. Navigate to `/`
  2. Locate the language switcher in the navigation bar
  3. Click "RU"
- **Expected Results:**
  - Page navigates to `/ru` (SSR mode)
  - All visible text is in Russian, including:
    - Hero headline and subtitle
    - Feature titles and descriptions
    - How It Works step titles and descriptions
    - Stat labels
    - FAQ questions and answers
    - CTA button text
    - Footer text and links
    - Nav button text ("Log In" / "Sign Up" equivalents)
  - "RU" button in the language switcher shows active/selected state

### TC-020: Switch language from EN to PL via header switcher
- **Description:** Verify switching language to Polish updates all page content
- **Priority:** Critical
- **Preconditions:** Marketing page loaded in English (default)
- **Steps:**
  1. Navigate to `/`
  2. Locate the language switcher in the navigation bar
  3. Click "PL"
- **Expected Results:**
  - Page navigates to `/pl`
  - All visible text is in Polish
  - "PL" button in the language switcher shows active/selected state

### TC-021: Switch language from RU back to EN
- **Description:** Verify switching back to English from Russian
- **Priority:** High
- **Preconditions:** Marketing page loaded in Russian
- **Steps:**
  1. Navigate to `/ru`
  2. Click "EN" in the language switcher
- **Expected Results:**
  - Page navigates to `/`
  - All visible text is in English
  - "EN" button shows active/selected state

### TC-022: Language preference persists across visits
- **Description:** Verify the selected language is remembered when revisiting the site
- **Priority:** High
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Click "RU" to switch to Russian
  3. Verify the page is in Russian
  4. Close the browser tab
  5. Open a new tab and navigate to `/`
- **Expected Results:**
  - The page loads in Russian (redirects to `/ru`)
  - Language preference is stored in a cookie (e.g., `slotme_lang=ru`)

### TC-023: Browser Accept-Language auto-detection (Russian)
- **Description:** Verify the page auto-detects Russian from the browser Accept-Language header on first visit
- **Priority:** High
- **Preconditions:** Clear all cookies for the domain. Set browser Accept-Language header to include "ru"
- **Steps:**
  1. Configure browser to send `Accept-Language: ru,en;q=0.5`
  2. Navigate to `/`
- **Expected Results:**
  - Server redirects to `/ru`
  - Page content is displayed in Russian

### TC-024: Browser Accept-Language auto-detection (Polish)
- **Description:** Verify the page auto-detects Polish from the browser Accept-Language header on first visit
- **Priority:** High
- **Preconditions:** Clear all cookies for the domain. Set browser Accept-Language header to include "pl"
- **Steps:**
  1. Configure browser to send `Accept-Language: pl,en;q=0.5`
  2. Navigate to `/`
- **Expected Results:**
  - Server redirects to `/pl`
  - Page content is displayed in Polish

### TC-025: Unsupported language falls back to English
- **Description:** Verify that an unsupported language code in the URL falls back to English
- **Priority:** High
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/de` (German, unsupported)
- **Expected Results:**
  - Server redirects to `/` (English default)
  - Page content is displayed in English

### TC-026: Footer language switcher works
- **Description:** Verify the secondary language switcher in the footer also switches language
- **Priority:** Medium
- **Preconditions:** Marketing page loaded, scrolled to footer
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the footer
  3. Click "RU" in the footer language switcher
- **Expected Results:**
  - Page navigates to `/ru`
  - All content is in Russian
  - Both header and footer language switchers show "RU" as active

### TC-027: Missing translation falls back to English
- **Description:** Verify that if a translation key is missing, the English fallback is used
- **Priority:** Medium
- **Preconditions:** A translation key is intentionally missing from one language file
- **Steps:**
  1. Navigate to `/ru`
  2. Inspect the page for any text that appears in English or shows a raw translation key
- **Expected Results:**
  - No raw translation keys (e.g., `hero.title`) are visible
  - Any missing translation displays the English fallback text

### TC-028: SEO meta tags update per language
- **Description:** Verify that meta tags are translated for each language variant
- **Priority:** Medium
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/` and view page source; note `<title>` and `<meta description>`
  2. Navigate to `/ru` and view page source; note `<title>` and `<meta description>`
  3. Navigate to `/pl` and view page source; note `<title>` and `<meta description>`
- **Expected Results:**
  - `/`: Title contains English text ("SlotMe -- AI Virtual Receptionist for Beauty Salons")
  - `/ru`: Title contains Russian text
  - `/pl`: Title contains Polish text
  - Meta descriptions are also translated per language

---

## US-MW-005: View Features

### TC-029: Features section displays 6 feature cards
- **Description:** Verify the features section displays all 6 required features
- **Priority:** Critical
- **Preconditions:** Desktop browser, marketing page loaded
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the Features section
  3. Count the feature cards
- **Expected Results:**
  - Exactly 6 feature cards are displayed
  - Each card has an icon, title, and description
  - Features include: AI Conversational Booking, Smart Calendar Management, Automated Reminders, Multi-Channel Support, Slot Rearrangement, Analytics Dashboard

### TC-030: Feature card content is meaningful
- **Description:** Verify each feature description clearly communicates the benefit to a salon owner
- **Priority:** High
- **Preconditions:** Desktop browser
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the Features section
  3. Read each feature title and description
- **Expected Results:**
  - Each title clearly names the feature
  - Each description explains the benefit in 1-2 sentences
  - Descriptions are specific and actionable (not generic filler text)

### TC-031: Features section responsive grid layout
- **Description:** Verify the features grid adapts to different viewport sizes
- **Priority:** High
- **Preconditions:** None
- **Steps:**
  1. Open `/` at 1280px width, scroll to Features section
  2. Resize browser to 768px width
  3. Resize browser to 375px width
- **Expected Results:**
  - Desktop (1280px): 3-column grid
  - Tablet (768px): 2-column grid
  - Mobile (375px): 1-column stack

### TC-032: Feature cards have hover interaction (desktop)
- **Description:** Verify feature cards respond to mouse hover
- **Priority:** Low
- **Preconditions:** Desktop browser
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the Features section
  3. Hover over a feature card
- **Expected Results:**
  - Card border shifts to a rose/accent color
  - Shadow intensifies
  - Icon scales up slightly

### TC-033: Feature titles and descriptions translated
- **Description:** Verify feature content is translated in all languages
- **Priority:** High
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/` and read feature titles/descriptions (English)
  2. Navigate to `/ru` and read feature titles/descriptions (Russian)
  3. Navigate to `/pl` and read feature titles/descriptions (Polish)
- **Expected Results:**
  - All 6 feature titles are translated in Russian
  - All 6 feature descriptions are translated in Russian
  - All 6 feature titles are translated in Polish
  - All 6 feature descriptions are translated in Polish
  - No English text remains in the RU/PL versions

---

## US-MW-006: Read FAQ

### TC-034: FAQ section displays at least 5 questions
- **Description:** Verify the FAQ section contains the required questions
- **Priority:** Critical
- **Preconditions:** Desktop browser, marketing page loaded
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the FAQ section
  3. Count the visible questions
- **Expected Results:**
  - At least 5 FAQ questions are displayed
  - Questions cover: product overview ("What is SlotMe?"), AI booking, supported channels, pricing, getting started, and data security

### TC-035: Accordion expand - click a closed question
- **Description:** Verify that clicking a closed question expands it to show the answer
- **Priority:** Critical
- **Preconditions:** FAQ section visible, all questions initially closed
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the FAQ section
  3. Click on the first question
- **Expected Results:**
  - The answer panel for the clicked question expands and becomes visible
  - The chevron icon rotates 180 degrees (pointing up)
  - Answer text is readable and informative

### TC-036: Accordion collapse - click an open question
- **Description:** Verify that clicking an already-open question collapses it
- **Priority:** Critical
- **Preconditions:** FAQ section visible, one question already open
- **Steps:**
  1. Click a question to open it
  2. Click the same question again
- **Expected Results:**
  - The answer panel collapses and is no longer visible
  - The chevron icon rotates back to its default position (pointing down)

### TC-037: Accordion single-select - only one question open at a time
- **Description:** Verify that opening a new question closes the previously open one
- **Priority:** High
- **Preconditions:** FAQ section visible
- **Steps:**
  1. Click the first question to open it
  2. Verify the first answer is visible
  3. Click the third question
- **Expected Results:**
  - The first question's answer collapses
  - The third question's answer expands
  - Only one answer is visible at a time

### TC-038: FAQ keyboard navigation
- **Description:** Verify FAQ accordion works with keyboard
- **Priority:** High
- **Preconditions:** Desktop browser, FAQ section visible
- **Steps:**
  1. Use Tab key to focus on the first FAQ question
  2. Press Enter to open the first question
  3. Use Tab key to move to the second question
  4. Press Space to open the second question
- **Expected Results:**
  - Focus ring is visible on the focused question button
  - Enter key toggles the question open
  - Tab moves focus to the next question
  - Space key toggles the question open
  - Previous question closes when a new one opens

### TC-039: FAQ answers translated in all languages
- **Description:** Verify FAQ questions and answers are translated
- **Priority:** High
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/` and expand all FAQ items, note questions and answers (English)
  2. Navigate to `/ru` and expand all FAQ items (Russian)
  3. Navigate to `/pl` and expand all FAQ items (Polish)
- **Expected Results:**
  - All questions are translated in Russian
  - All answers are translated in Russian
  - All questions are translated in Polish
  - All answers are translated in Polish
  - No English text remains in the RU/PL versions

### TC-040: FAQ works without JavaScript (progressive enhancement)
- **Description:** Verify FAQ content is accessible without JavaScript
- **Priority:** Medium
- **Preconditions:** None
- **Steps:**
  1. Disable JavaScript in the browser
  2. Navigate to `/`
  3. Scroll to the FAQ section
- **Expected Results:**
  - FAQ questions and answers are all visible (all expanded by default)
  - Content is readable even without accordion interactivity

---

## Cross-Cutting Test Cases

### TC-041: Navigation between marketing site and SPA routes
- **Description:** Verify that the marketing site and React SPA coexist correctly
- **Priority:** Critical
- **Preconditions:** Both backend and frontend running
- **Steps:**
  1. Navigate to `/` -- marketing page should load
  2. Click "Log In" -- should navigate to `/login` (React SPA)
  3. Click browser back -- should return to marketing page
  4. Click "Sign Up" -- should navigate to `/register` (React SPA)
  5. Click browser back -- should return to marketing page
- **Expected Results:**
  - Marketing page at `/` is SSR (Thymeleaf)
  - `/login` and `/register` load the React SPA
  - Browser back/forward navigation works correctly between SSR and SPA pages

### TC-042: Accessibility - heading hierarchy
- **Description:** Verify the page has correct heading hierarchy for screen readers
- **Priority:** High
- **Preconditions:** Desktop browser
- **Steps:**
  1. Navigate to `/`
  2. Use browser dev tools or an accessibility extension to list all headings
- **Expected Results:**
  - Exactly one `<h1>` element (hero section)
  - Multiple `<h2>` elements for section titles (Features, How It Works, Benefits, FAQ, Bottom CTA)
  - `<h3>` elements for feature titles and step titles
  - No heading level is skipped

### TC-043: Accessibility - keyboard navigation through entire page
- **Description:** Verify all interactive elements are keyboard accessible
- **Priority:** High
- **Preconditions:** Desktop browser
- **Steps:**
  1. Navigate to `/`
  2. Press Tab repeatedly to move through all interactive elements
- **Expected Results:**
  - Focus moves through: nav links, language switcher buttons, Log In, Sign Up, hero CTAs, FAQ questions, footer links
  - All focused elements have a visible focus indicator
  - No interactive element is skipped or unreachable

### TC-044: Performance - page loads within acceptable time
- **Description:** Verify the marketing page loads quickly (SSR advantage)
- **Priority:** Medium
- **Preconditions:** Desktop browser with dev tools open
- **Steps:**
  1. Open browser DevTools, go to Network tab
  2. Navigate to `/`
  3. Observe loading metrics
- **Expected Results:**
  - First Contentful Paint (FCP) under 1.5 seconds
  - Largest Contentful Paint (LCP) under 2.5 seconds
  - Total page weight is reasonable for a static marketing page

### TC-045: Logo links to home page
- **Description:** Verify clicking the SlotMe logo navigates to the marketing home page
- **Priority:** Medium
- **Preconditions:** Desktop browser
- **Steps:**
  1. Navigate to `/ru`
  2. Click the SlotMe logo in the navbar
- **Expected Results:**
  - Browser navigates to `/` (or `/ru` depending on language context)
  - Marketing page is displayed

---

*End of Test Cases*

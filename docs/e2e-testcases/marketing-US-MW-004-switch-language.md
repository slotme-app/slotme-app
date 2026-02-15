# Test Cases: US-MW-004 -- Switch Language

**User Story:** US-MW-004 -- As a visitor who speaks Russian or Polish, I want to switch the website language, so that I can read the content in my preferred language.
**Feature:** Marketing Website with Multi-Language Support
**Author:** QA Engineer
**Date:** 2026-02-15
**Base URL:** http://localhost:3033

---

## Happy Path Scenarios

### TC-019: Switch language from EN to RU via header switcher
- **Description:** Verify switching language to Russian updates all page content
- **Priority:** Critical
- **Browser/Device:** Desktop (1024px+ width)
- **Preconditions:** Marketing page loaded in English (default) at `/`
- **Steps:**
  1. Navigate to `/`
  2. Locate the language switcher in the navigation bar (pill-shaped container with EN, RU, PL buttons)
  3. Verify "EN" button shows active/selected state (white background with shadow)
  4. Click "RU"
- **Expected Results:**
  - Page navigates to `/ru` (SSR mode: full page navigation)
  - All visible text is in Russian, including:
    - Hero headline and subtitle
    - Feature titles and descriptions (all 6 cards)
    - How It Works step titles and descriptions (all 4 steps)
    - Stat labels in the Benefits section
    - FAQ questions and answers
    - CTA button text ("Get Started Free" equivalent)
    - Footer text, product links, legal links
    - Nav button text (Log In / Sign Up equivalents)
  - "RU" button in the language switcher shows active/selected state
  - "EN" and "PL" buttons show inactive state

### TC-020: Switch language from EN to PL via header switcher
- **Description:** Verify switching language to Polish updates all page content
- **Priority:** Critical
- **Browser/Device:** Desktop
- **Preconditions:** Marketing page loaded in English (default)
- **Steps:**
  1. Navigate to `/`
  2. Locate the language switcher in the navigation bar
  3. Click "PL"
- **Expected Results:**
  - Page navigates to `/pl`
  - All visible text is in Polish (same coverage as TC-019)
  - "PL" button in the language switcher shows active/selected state

### TC-021: Switch language from RU back to EN
- **Description:** Verify switching back to English from Russian works correctly
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** Marketing page loaded in Russian at `/ru`
- **Steps:**
  1. Navigate to `/ru`
  2. Verify all content is in Russian
  3. Click "EN" in the language switcher
- **Expected Results:**
  - Page navigates to `/`
  - All visible text is in English
  - "EN" button shows active/selected state

### TC-022: Language preference persists across visits (cookie)
- **Description:** Verify the selected language is remembered when revisiting the site
- **Priority:** High
- **Browser/Device:** Desktop (any modern browser)
- **Preconditions:** Clear all cookies for the domain before starting
- **Steps:**
  1. Navigate to `/`
  2. Click "RU" in the language switcher
  3. Verify the page is in Russian at `/ru`
  4. Open browser DevTools > Application > Cookies and verify a language cookie exists (e.g., `slotme_lang=ru`)
  5. Close the browser tab
  6. Open a new tab and navigate to `/`
- **Expected Results:**
  - After step 4: a cookie like `slotme_lang=ru` is set
  - After step 6: the server reads the cookie and redirects to `/ru`
  - Page loads in Russian without requiring the user to switch again

---

## Auto-Detection

### TC-023: Browser Accept-Language auto-detection (Russian)
- **Description:** Verify the page auto-detects Russian from the browser Accept-Language header on first visit
- **Priority:** High
- **Browser/Device:** Desktop (use DevTools network override or curl)
- **Preconditions:** Clear all cookies for the domain. No language cookie set.
- **Steps:**
  1. Configure browser to send `Accept-Language: ru,en;q=0.5` (or use curl: `curl -H "Accept-Language: ru" -I http://localhost:3033/`)
  2. Navigate to `/`
- **Expected Results:**
  - Server returns a redirect (302) to `/ru`
  - Page content is displayed in Russian
  - Language cookie is set to `ru`

### TC-024: Browser Accept-Language auto-detection (Polish)
- **Description:** Verify the page auto-detects Polish from the browser Accept-Language header on first visit
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** Clear all cookies for the domain. No language cookie set.
- **Steps:**
  1. Configure browser to send `Accept-Language: pl,en;q=0.5`
  2. Navigate to `/`
- **Expected Results:**
  - Server redirects to `/pl`
  - Page content is displayed in Polish
  - Language cookie is set to `pl`

### TC-057: Accept-Language with English preference stays on root
- **Description:** Verify English Accept-Language does not redirect
- **Priority:** Medium
- **Browser/Device:** Desktop
- **Preconditions:** Clear all cookies. Browser sends `Accept-Language: en-US,en;q=0.9`
- **Steps:**
  1. Navigate to `/`
- **Expected Results:**
  - Page stays at `/` (no redirect)
  - Content is in English

### TC-058: Cookie overrides Accept-Language
- **Description:** Verify that a saved language cookie takes priority over the Accept-Language header
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** Set browser Accept-Language to `ru`. Set cookie `slotme_lang=pl`.
- **Steps:**
  1. Navigate to `/`
- **Expected Results:**
  - Server redirects to `/pl` (cookie preference wins over Accept-Language)
  - Page content is in Polish

---

## Edge Cases

### TC-025: Unsupported language in URL falls back to English
- **Description:** Verify that an unsupported language code in the URL redirects to English
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/de` (German, unsupported)
  2. Navigate to `/fr` (French, unsupported)
  3. Navigate to `/zh` (Chinese, unsupported)
- **Expected Results:**
  - Each unsupported language URL redirects to `/` (English default)
  - Page content is displayed in English
  - No 404 error is shown

### TC-027: Missing translation falls back to English
- **Description:** Verify that if a translation key is missing in a language file, the English fallback is displayed
- **Priority:** Medium
- **Browser/Device:** Desktop
- **Preconditions:** A translation key is intentionally missing from one language file (may need developer to remove one for testing)
- **Steps:**
  1. Navigate to `/ru`
  2. Inspect every section for any text that appears in English or shows a raw translation key (e.g., `hero.title`)
- **Expected Results:**
  - No raw translation keys are visible on the page
  - Any missing translation displays the English fallback text instead
  - Page does not crash or show errors

### TC-028: SEO meta tags update per language
- **Description:** Verify that page title and meta description are translated for each language variant
- **Priority:** Medium
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/` and view page source; note `<title>` and `<meta name="description">`
  2. Navigate to `/ru` and view page source; note `<title>` and `<meta name="description">`
  3. Navigate to `/pl` and view page source; note `<title>` and `<meta name="description">`
- **Expected Results:**
  - `/`: Title = "SlotMe -- AI Virtual Receptionist for Beauty Salons" (English)
  - `/ru`: Title is in Russian (contains Cyrillic text)
  - `/pl`: Title is in Polish (contains Polish characters)
  - Meta descriptions are also different and in the correct language for each variant
  - `hreflang` tags are present on all three variants

---

## Secondary Language Switcher (Footer)

### TC-026: Footer language switcher works
- **Description:** Verify the secondary language switcher in the footer also switches language
- **Priority:** Medium
- **Browser/Device:** Desktop
- **Preconditions:** Marketing page loaded at `/`
- **Steps:**
  1. Navigate to `/`
  2. Scroll to the footer
  3. Locate the secondary language switcher (same pill-button pattern as header)
  4. Click "RU" in the footer language switcher
- **Expected Results:**
  - Page navigates to `/ru`
  - All content is in Russian
  - Both header and footer language switchers show "RU" as active

### TC-059: Footer and header switchers stay in sync
- **Description:** Verify both language switchers reflect the current language state
- **Priority:** Medium
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/pl`
  2. Check the header language switcher
  3. Scroll to the footer and check the footer language switcher
- **Expected Results:**
  - Header switcher shows "PL" as active
  - Footer switcher shows "PL" as active
  - Both switchers are visually consistent

---

## Responsive Behavior

### TC-060: Language switcher visible on mobile
- **Description:** Verify the language switcher is accessible on mobile viewports
- **Priority:** High
- **Browser/Device:** Mobile (375px viewport)
- **Preconditions:** None
- **Steps:**
  1. Set viewport to 375px width
  2. Navigate to `/`
  3. Locate the language switcher in the navbar
  4. Tap "RU"
- **Expected Results:**
  - Language switcher is visible in the mobile navbar
  - All three language buttons (EN, RU, PL) are tappable
  - Switching to RU navigates to `/ru` with Russian content

---

## Accessibility

### TC-061: Language switcher keyboard accessible
- **Description:** Verify the language switcher can be operated via keyboard
- **Priority:** High
- **Browser/Device:** Desktop
- **Preconditions:** None
- **Steps:**
  1. Navigate to `/`
  2. Tab to the language switcher buttons
  3. Press Enter on the "RU" button
- **Expected Results:**
  - Focus indicator is visible on each language button when focused
  - Pressing Enter switches the language
  - Language switcher has appropriate ARIA attributes (e.g., `role="radiogroup"`, `aria-label="Language"`)

---

*End of US-MW-004 Test Cases*

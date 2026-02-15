# Feature Brief: Marketing Website with Multi-Language Support

**Author:** Product Owner
**Date:** 2026-02-15
**Status:** Complete
**Feature:** Server-side rendered marketing website for SlotMe

---

## Problem Statement

SlotMe currently has no public-facing website to attract new salon owners and explain the platform's value proposition. Potential customers have no way to discover SlotMe, understand its features, or navigate to the login/registration pages. Without a marketing website, the platform relies entirely on word-of-mouth and direct outreach, severely limiting growth potential.

The target market spans multiple countries and languages (English, Russian, Polish), so the marketing site must support all three languages to reach the full addressable audience of small-to-medium beauty salons in these markets.

---

## Target Users

### Primary: Prospective Salon Owners
- Small-to-medium beauty salon owners (1-10 stylists) who are evaluating solutions for appointment management
- Located in English-speaking, Russian-speaking, and Polish-speaking markets
- Moderate tech comfort; they browse websites on both mobile and desktop
- Looking for an affordable alternative to a human receptionist

### Secondary: Existing Users
- Current SlotMe salon admins and masters who need a quick path to the login page
- Users who have forgotten the direct login URL and search for "SlotMe" to find it

---

## Requirements

### Functional Requirements

#### FR-MW-001: Server-Side Rendered Pages
- The marketing website must be rendered on the backend (Spring Boot with Thymeleaf or similar SSR template engine)
- Pages must be fully rendered HTML served from the backend, not a client-side SPA
- This ensures SEO indexability, fast initial page loads, and accessibility without JavaScript

#### FR-MW-002: Page Sections
The marketing website must include the following sections on the landing page:

1. **Navigation Bar (Header)**
   - SlotMe logo (links to home)
   - Navigation links to page sections (scrollable anchors)
   - Language switcher (EN / RU / PL)
   - "Log In" and "Sign Up" buttons (prominent, always visible)

2. **Hero Section**
   - Headline communicating the core value proposition: AI-powered virtual receptionist for beauty salons
   - Subheadline expanding on key benefits (24/7 booking, no missed clients, multi-channel)
   - Primary CTA button: "Get Started" / "Sign Up Free" (links to registration page)
   - Secondary CTA: "Log In" (links to login page)
   - Hero image or illustration representing salon booking

3. **Features Section**
   - Grid or card layout highlighting 4-6 key features:
     - AI Conversational Booking (WhatsApp, Messenger, Voice, SMS)
     - Smart Calendar Management (no double-bookings, real-time availability)
     - Automated Reminders and Notifications (reduce no-shows)
     - Multi-Channel Support (meet clients where they are)
     - Slot Rearrangement (fill cancelled slots automatically)
     - Analytics Dashboard (business insights)
   - Each feature card: icon, title, short description

4. **How It Works Section**
   - 3-4 step visual walkthrough:
     1. Sign up and configure your salon (services, staff, hours)
     2. Connect your communication channels (WhatsApp, Messenger, etc.)
     3. Your AI receptionist starts handling bookings automatically
     4. Monitor everything from your dashboard
   - Numbered steps with icons/illustrations

5. **Benefits / Why SlotMe Section**
   - Key statistics or selling points:
     - "Save 2-4 hours per day on admin tasks"
     - "Fill 40%+ of cancelled slots automatically"
     - "Never miss a booking -- available 24/7"
     - "Reduce no-shows with automated reminders"
   - Could use counter/stat cards or a comparison table (before vs. after SlotMe)

6. **Pricing Section** (optional for MVP, can be a placeholder)
   - If included: simple pricing tiers (Free / Starter / Pro)
   - If deferred: "Contact us for pricing" or "Start free trial" CTA

7. **Testimonials / Social Proof Section** (optional for MVP)
   - If included: 2-3 testimonial cards with quotes, names, and salon names
   - If deferred: can be omitted and added later

8. **FAQ Section**
   - Accordion-style frequently asked questions:
     - What is SlotMe?
     - How does the AI booking work?
     - Which messaging channels are supported?
     - How much does it cost?
     - How do I get started?
     - Is my data secure?

9. **Call-to-Action Section (Bottom CTA)**
   - Final conversion section before footer
   - Headline: "Ready to transform your salon?"
   - CTA button: "Get Started Free"

10. **Footer**
    - SlotMe logo and tagline
    - Quick links: Features, How It Works, Pricing, FAQ
    - Legal links: Privacy Policy, Terms of Service
    - Contact information or support email
    - Language switcher (secondary location)
    - Copyright notice

#### FR-MW-003: Login and Sign Up Buttons
- "Log In" button in the navbar must navigate to the main SlotMe application's login page at `/login`
- "Sign Up" / "Get Started" button must navigate to the registration page at `/register`
- These are the existing auth routes already implemented in the React frontend
- The marketing website coexists with the SPA: the root `/` path serves the marketing page, while `/login`, `/register`, `/dashboard/*` etc. continue to serve the React SPA

#### FR-MW-004: Multi-Language Support (i18n)
- The website must support three languages: **English (EN)**, **Russian (RU)**, and **Polish (PL)**
- All visible text content must be fully translated in all three languages (not just UI chrome, but all marketing copy, feature descriptions, FAQ answers, etc.)
- Language selection via:
  - Language switcher in the navbar (flag icons or language codes: EN / RU / PL)
  - URL-based language routing (e.g., `/`, `/ru`, `/pl` or `?lang=ru`)
- Default language: English
- Language preference should persist (via cookie or URL path)
- Browser `Accept-Language` header can be used for initial auto-detection

#### FR-MW-005: Responsive Design
- The marketing website must be fully responsive and work on:
  - Mobile phones (375px and wider)
  - Tablets (768px and wider)
  - Desktops (1024px and wider)
- Mobile-first design approach
- Navigation collapses to a hamburger menu on mobile
- All sections stack vertically on mobile

#### FR-MW-006: SEO Optimization
- Since pages are server-side rendered, they must include proper:
  - `<title>` and `<meta description>` tags (translated per language)
  - Open Graph meta tags for social sharing
  - Semantic HTML (proper heading hierarchy, landmarks)
  - `hreflang` tags for multi-language SEO
  - Structured data (Organization schema)
  - Sitemap.xml
  - robots.txt

### Non-Functional Requirements

#### NFR-MW-001: Performance
- First Contentful Paint (FCP) under 1.5 seconds
- Largest Contentful Paint (LCP) under 2.5 seconds
- Pages should be lightweight since they are static marketing content

#### NFR-MW-002: Accessibility
- WCAG 2.1 Level AA compliance
- Proper alt text for images, keyboard navigation, sufficient color contrast

#### NFR-MW-003: Browser Support
- Chrome/Edge 90+, Firefox 90+, Safari 15+, Mobile Safari (iOS 15+), Chrome for Android

---

## User Stories

### US-MW-001: View Marketing Website
**As a** prospective salon owner, **I want to** visit the SlotMe website and understand what the product does, **so that** I can decide if it fits my salon's needs.

**Acceptance Criteria:**
- Given a visitor navigates to the root URL `/`, When the page loads, Then the marketing landing page is displayed with all sections (hero, features, how it works, benefits, FAQ, footer)
- Given the page is loaded, When the visitor scrolls, Then sections are visible in a logical order with smooth scrolling between anchor links
- Given the visitor is on mobile, When they view the page, Then all content is readable and properly laid out without horizontal scrolling

### US-MW-002: Navigate to Login
**As an** existing user, **I want to** click "Log In" on the marketing website, **so that** I can access my SlotMe dashboard.

**Acceptance Criteria:**
- Given the marketing page is displayed, When the visitor clicks "Log In" in the navbar, Then they are navigated to `/login`
- Given the visitor is on mobile, When they open the hamburger menu and tap "Log In", Then they are navigated to `/login`

### US-MW-003: Navigate to Registration
**As a** prospective salon owner, **I want to** click "Sign Up" or "Get Started", **so that** I can create a new salon account.

**Acceptance Criteria:**
- Given the marketing page is displayed, When the visitor clicks "Sign Up" in the navbar, Then they are navigated to `/register`
- Given the visitor scrolls to the hero section, When they click "Get Started Free", Then they are navigated to `/register`
- Given the visitor scrolls to the bottom CTA, When they click the CTA button, Then they are navigated to `/register`

### US-MW-004: Switch Language
**As a** visitor who speaks Russian or Polish, **I want to** switch the website language, **so that** I can read the content in my preferred language.

**Acceptance Criteria:**
- Given the marketing page is displayed in English, When the visitor clicks "RU" in the language switcher, Then all page content switches to Russian
- Given the visitor selected Polish, When they navigate to any section, Then all text (headings, descriptions, FAQ, buttons, footer) is in Polish
- Given the visitor selected a language, When they revisit the site, Then their language preference is remembered
- Given the visitor's browser sends `Accept-Language: ru`, When they visit for the first time, Then the page defaults to Russian

### US-MW-005: View Features
**As a** prospective salon owner, **I want to** see what features SlotMe offers, **so that** I can evaluate if it solves my booking problems.

**Acceptance Criteria:**
- Given the features section is visible, When the visitor reads it, Then at least 4 key features are displayed with icons, titles, and descriptions
- Given the features are displayed, Then each feature description clearly communicates the benefit to a salon owner

### US-MW-006: Read FAQ
**As a** prospective salon owner, **I want to** read answers to common questions, **so that** I can resolve doubts before signing up.

**Acceptance Criteria:**
- Given the FAQ section is visible, When the visitor clicks a question, Then the answer expands/collapses (accordion behavior)
- Given the FAQ content, Then at least 5 questions are answered covering product overview, pricing, channels, setup, and data security

---

## Edge Cases

### Language Handling
- **Unsupported language in URL**: If a visitor navigates to an unsupported language path (e.g., `/de`), redirect to the default English version
- **Mixed content**: If a translation is missing for a specific string, fall back to English rather than showing a blank or key
- **RTL languages**: Not applicable for EN/RU/PL (all LTR), but the architecture should not preclude future RTL support

### Navigation Between Marketing Site and SPA
- **Route conflict**: The marketing page is at `/`. The React SPA handles `/login`, `/register`, `/admin/*`, `/master/*`. The backend must serve the SSR marketing page for `/` (and language variants like `/ru`, `/pl`) while letting the React SPA handle all other routes
- **Deep linking from marketing site**: All CTA buttons link to SPA routes (`/login`, `/register`). These must work regardless of whether the user previously had the SPA loaded
- **Back button**: If a user navigates from the marketing site to `/register` and hits back, they should return to the marketing page

### SEO and Crawling
- **Duplicate content**: `hreflang` tags must correctly signal language variants to search engines to avoid duplicate content penalties
- **Canonical URLs**: Each language variant should have a canonical URL pointing to itself

### Performance
- **Image optimization**: Hero images and feature icons should use modern formats (WebP with fallback) and be appropriately sized for each breakpoint
- **Caching**: Marketing pages are mostly static; aggressive caching headers should be set (cache-busting on content changes)

---

## Out of Scope

The following items are explicitly NOT part of this feature:

1. **Blog or content management system** -- No blog, news, or dynamic content pages
2. **User authentication on the marketing site** -- The marketing site itself has no auth; it only links to the SPA's auth pages
3. **Online booking widget** -- No embedded booking calendar or booking flow on the marketing page
4. **Payment / pricing management** -- No dynamic pricing engine or payment integration; pricing section is static content
5. **Contact form with backend processing** -- No form submissions requiring backend processing (email sending, etc.). A mailto link is sufficient
6. **Admin panel for marketing content** -- No CMS or admin interface for editing marketing copy; content is managed in template files and translation files
7. **A/B testing infrastructure** -- No experimentation framework
8. **Analytics integration** -- No Google Analytics, Mixpanel, or similar tracking (can be added later as a separate story)
9. **Cookie consent banner** -- Can be added as a follow-up if needed for GDPR compliance
10. **Additional languages beyond EN/RU/PL** -- Only three languages in this iteration

---

## Dependencies

### Existing Systems
- **React SPA (frontend)**: The marketing website must coexist with the existing React SPA. Routes `/login`, `/register`, and all dashboard routes are handled by the SPA. The marketing page only serves `/` and its language variants
- **Spring Boot backend**: The SSR marketing pages will be served by the existing Spring Boot application, likely using Thymeleaf or a similar Java template engine
- **Authentication system**: Login and Sign Up buttons link to the existing auth pages; no new auth work is needed

### External Dependencies
- **Translation content**: All marketing copy must be professionally written and translated into Russian and Polish. Translation files need to be provided or produced during development
- **Design assets**: Hero images, feature icons, and illustrations need to be created or sourced

---

## Impact on Existing Features

### Routing Changes
- The root path `/` must now serve the SSR marketing page instead of (or before) the React SPA's index route
- The backend needs a new controller (e.g., `MarketingController`) to serve the marketing page templates
- The existing `frontend/src/app/routes/index.tsx` route may need adjustment if it currently renders something at `/`

### Backend Changes
- Add Thymeleaf (or similar) template engine dependency to the Spring Boot project
- Create marketing page templates with i18n support
- Add a controller to handle `GET /`, `GET /ru`, `GET /pl` routes
- Add static assets (CSS, images) for the marketing page (separate from the React SPA's assets)

### Frontend Changes
- Minimal impact. The React SPA continues to handle all its existing routes (`/login`, `/register`, `/admin/*`, `/master/*`)
- The root route in TanStack Router may need to redirect to `/admin` or `/master` for authenticated users rather than rendering a landing page

### Infrastructure
- No new infrastructure required. The marketing pages are served by the existing Spring Boot application
- Static assets (images, CSS) for the marketing page can be served from the same backend or a CDN

---

## Technical Considerations

### SSR Approach
The requirement specifies server-side rendering. Two main approaches:

1. **Thymeleaf Templates** (recommended for simplicity):
   - Standard Spring Boot template engine
   - Templates with i18n via Spring `MessageSource` and `.properties` files
   - CSS can use Tailwind (pre-built) or custom styles
   - No JavaScript build step needed for the marketing pages

2. **React SSR** (more complex, not recommended for static marketing content):
   - Would require SSR setup (e.g., Vite SSR or custom Node.js renderer)
   - Overkill for static marketing pages with no interactive state

### i18n Architecture
- Translation strings stored in message property files:
  - `messages_en.properties`
  - `messages_ru.properties`
  - `messages_pl.properties`
- Spring `LocaleResolver` determines locale from URL path, cookie, or `Accept-Language` header
- All template text uses `#{message.key}` syntax (Thymeleaf) to resolve translations

### URL Strategy for Languages
Recommended approach: **URL path prefix**
- `/` -- English (default)
- `/ru` -- Russian
- `/pl` -- Polish

This approach is best for SEO (each language variant has a distinct URL) and is straightforward to implement with Spring MVC path variables.

---

*End of Feature Brief*

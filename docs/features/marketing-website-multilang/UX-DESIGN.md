# UX Design: Marketing Website with Multi-Language Support

**Author:** UX Designer
**Date:** 2026-02-15
**Status:** Complete
**Feature Brief:** [FEATURE-BRIEF.md](./FEATURE-BRIEF.md)
**Frontend Prototype:** `frontend/src/pages/MarketingLanding.tsx`

---

## 1. Existing Patterns Referenced

The following existing codebase patterns were studied and inform this design:

| Pattern | Source File | Relevance |
|---------|------------|-----------|
| Button variants (default, outline, ghost, link) | `frontend/src/components/ui/button.tsx` | CTA buttons reuse variant system |
| Card component structure | `frontend/src/components/ui/card.tsx` | Feature cards, stat cards |
| Auth layout (centered card on muted bg) | `frontend/src/app/routes/_auth.tsx` | Login/Register pages the marketing site links to |
| Form pattern (Label + Input + error) | `frontend/src/app/routes/_auth/login.tsx` | Consistent with forms users encounter after signup |
| Multi-step form with step indicator | `frontend/src/app/routes/_auth/register.tsx` | Registration flow users enter from marketing CTA |
| EmptyState component | `frontend/src/components/EmptyState.tsx` | Icon-in-circle pattern reused for feature cards |
| Loading skeletons | `frontend/src/components/LoadingSkeleton.tsx` | Skeleton approach for deferred content |
| Dashboard page layout (header + stats grid) | `frontend/src/app/routes/_dashboard/admin/index.tsx` | Grid layout conventions |
| oklch color tokens | `frontend/src/index.css` | Color system foundation |
| Lucide icon library | Throughout codebase | Consistent icon source |

**Key takeaway:** The existing app uses a neutral grayscale palette with shadcn/ui components. The marketing website intentionally departs from this with a warmer, editorial-luxury aesthetic while maintaining compatibility -- users transitioning from the marketing site to login/register will experience a smooth visual handoff since the auth pages use the neutral system that complements the warm marketing palette.

---

## 2. Navigation & Entry Points

### 2.1 URL Structure

| URL | Content | Language |
|-----|---------|----------|
| `/` | Marketing landing page | English (default) |
| `/ru` | Marketing landing page | Russian |
| `/pl` | Marketing landing page | Polish |
| `/login` | React SPA login page | N/A (existing) |
| `/register` | React SPA registration page | N/A (existing) |
| `/admin/*` | Admin dashboard | N/A (existing) |
| `/master/*` | Master dashboard | N/A (existing) |

### 2.2 Route Prefix

All marketing routes are at root level (`/`). The marketing page is the root route. Language variants use path prefixes (`/ru`, `/pl`). All other routes (`/login`, `/register`, `/admin/*`, `/master/*`) continue to be handled by the React SPA.

### 2.3 Navigation Bar (Header)

**Desktop (1024px+):**
```
[Logo: SlotMe]    [Features] [How It Works] [FAQ]    [EN|RU|PL] [Log In] [Sign Up]
```

- Fixed to top of viewport (`position: fixed`, `z-50`)
- Semi-transparent white background with backdrop blur (`bg-white/80 backdrop-blur-lg`)
- Height: 64px (`h-16`)
- Bottom border: `border-b border-[oklch(0.92 0 0)]`
- Max content width: `max-w-7xl` (1280px)
- Logo: Sparkles icon in gradient rounded-xl box + "SlotMe" in Cormorant display font
- Section links: hidden on mobile, visible on `md:` breakpoint
- Language switcher: pill-shaped container with three toggle buttons (EN, RU, PL)
- "Log In": text link style
- "Sign Up": gradient pill button (primary CTA, always visible)

**Mobile (< 768px):**
```
[Logo: SlotMe]                     [EN|RU|PL] [Log In] [Sign Up]
```

- Section navigation links are hidden (page is a single scroll)
- Language switcher and auth buttons remain visible
- No hamburger menu needed -- the page is a continuous vertical scroll with anchor sections, and the primary actions (Log In, Sign Up) are always visible

**Tablet (768px - 1023px):**
- Same as desktop but with tighter spacing

### 2.4 Footer Navigation

The footer provides a secondary navigation point with:
- Product links: Features, How It Works, FAQ, Pricing (anchor links)
- Legal links: Privacy Policy, Terms of Service
- Contact: mailto link to support@slotme.ai
- Secondary language switcher (same pill-button pattern as header)
- Copyright notice

---

## 3. User Flows

### 3.1 New Visitor -- Browse & Sign Up

```
1. Visitor arrives at / (or /ru, /pl based on browser Accept-Language)
   |
2. Sees hero section with value proposition
   |
3. Scrolls down or clicks nav anchor links
   |-- Features section: understands product capabilities
   |-- How It Works: understands onboarding steps
   |-- Benefits: sees quantified value (2-4 hrs saved, 40%+ slots filled)
   |-- FAQ: resolves doubts
   |
4. Clicks CTA button ("Get Started Free" / "Sign Up")
   |-- Hero CTA
   |-- Bottom CTA
   |-- Navbar "Sign Up" button
   |
5. Navigated to /register (React SPA)
   |
6. Completes 3-step registration form (Account -> Salon -> Confirm)
   |
7. Redirected to /admin dashboard
```

**Decision points:**
- At any point, visitor can switch language via the language switcher
- At any point, visitor can click "Log In" if they already have an account
- Visitor may leave and return later -- language preference is persisted via cookie

### 3.2 Existing User -- Direct Login

```
1. User arrives at / (searches "SlotMe" or types URL)
   |
2. Clicks "Log In" in navbar (visible immediately, no scrolling needed)
   |
3. Navigated to /login (React SPA)
   |
4. Enters credentials
   |
5. Redirected to /admin or /master based on role
```

### 3.3 Language Switching

```
1. Visitor is on / (English)
   |
2. Clicks "RU" in language switcher (header or footer)
   |
3a. [Client-side prototype]: All content re-renders in Russian instantly (React state)
3b. [Production SSR]: Browser navigates to /ru, server returns Russian version
   |
4. Language preference stored in cookie
   |
5. On next visit, cookie is read and user is redirected to preferred language
```

**Auto-detection flow (first visit only):**
```
1. New visitor arrives at /
   |
2. Server reads Accept-Language header
   |-- "ru" detected -> redirect to /ru
   |-- "pl" detected -> redirect to /pl
   |-- anything else -> stay on / (English)
   |
3. Language preference cookie set
```

### 3.4 Mobile Navigation

```
1. User opens site on mobile (375px+)
   |
2. Sees compact header with logo, language switcher, auth buttons
   |
3. Scrolls vertically through all sections (single column layout)
   |-- All content stacks vertically
   |-- Feature cards: 1 column
   |-- How It Works steps: 1 column stacked
   |-- Stats: 2 columns on sm, 1 column on xs
   |
4. Taps any CTA button
   |
5. Navigated to /register or /login
```

---

## 4. Page Sections & Component Layouts

### 4.1 Hero Section

**Layout:** Two-column grid on desktop (`lg:grid-cols-2`), stacked on mobile.

| Element | Desktop | Mobile |
|---------|---------|--------|
| Badge | Inline pill above title | Same |
| Title (h1) | `text-8xl` Cormorant bold | `text-6xl` |
| Subtitle | `text-4xl` Cormorant light, rose color | `text-3xl` |
| Description | `text-lg` DM Sans, max-w-xl | Full width |
| CTAs | Row of 2 buttons (primary gradient pill + outline) | Stacked column |
| Hero visual | Rounded-3xl card with calendar preview | Below text content |
| Background orbs | Floating gradient circles with blur-3xl | Same, reduced opacity |

**Spacing:** `pt-32 pb-20` (accounts for fixed navbar height)

### 4.2 Features Section

**Layout:** 3-column grid on desktop (`lg:grid-cols-3`), 2-column on tablet (`md:grid-cols-2`), 1-column on mobile.

**Each feature card:**
- Container: `p-8`, `rounded-3xl`, subtle gradient background, border
- Icon: 56px square (`w-14 h-14`), rounded-2xl, gradient background, shadow-lg
- Title: `text-2xl` Cormorant semibold
- Description: DM Sans body text, relaxed line-height
- Hover state: border color shifts to rose, shadow-xl, icon scales up 110%

**Section header:** Centered, `text-6xl` title + `text-lg` subtitle, `mb-16` spacing

### 4.3 How It Works Section

**Layout:** 4-column grid on desktop (`lg:grid-cols-4`), 2-column on tablet, 1-column on mobile.

**Each step:**
- Numbered circle: 80px (`w-20 h-20`), gradient background, `text-3xl` bold number
- Glow effect behind circle: blurred gradient at 30% opacity
- Title: `text-2xl` Cormorant semibold
- Description: DM Sans body text
- Connector line: horizontal gradient dash between steps (desktop only, hidden on mobile)

**Background:** Subtle gradient from rose-tinted to white

### 4.4 Benefits / Stats Section

**Layout:** 4-column grid (`lg:grid-cols-4`), 2-column on tablet (`sm:grid-cols-2`), stacked on mobile.

**Visual treatment:** Dark section (deep purple-charcoal gradient) with white text -- creates visual contrast in the page rhythm.

**Each stat card:**
- Container: `p-8`, `rounded-3xl`, semi-transparent white bg (`bg-white/5`), backdrop-blur, border (`border-white/10`)
- Value: `text-6xl` Cormorant bold, gradient text (white to rose) via `bg-clip-text`
- Label: `text-lg` DM Sans, 90% white opacity
- Hover: background brightens to `bg-white/10`

**Background effects:** Radial gradient spots at 10% opacity for depth

### 4.5 FAQ Section

**Layout:** Single column, centered, `max-w-4xl`.

**Accordion behavior:**
- Only one item open at a time (single-select accordion)
- Click an open item to close it
- Click a different item to open it and close the previous one
- State: `openFaq` index or `null`

**Each FAQ item:**
- Container: `rounded-2xl`, border, overflow-hidden
- Question button: full-width, `px-8 py-6`, flex with space-between
- Question text: `text-xl` Cormorant semibold
- Chevron icon: rotates 180 degrees when open (CSS transition)
- Answer panel: `px-8 py-6`, light gray background, top border
- Answer text: DM Sans body, relaxed line-height
- Hover: border color shifts to rose, background lightens

**Keyboard interaction:** Tab to focus each question, Enter/Space to toggle

### 4.6 Bottom CTA Section

**Layout:** Centered text block, `max-w-4xl`.

**Elements:**
- Headline: `text-7xl` (desktop), `text-5xl` (mobile), Cormorant bold
- Subtitle: `text-xl` DM Sans
- CTA button: large gradient pill (`px-10 py-5`), shimmer effect on hover
- Trust signal: checkmark icon + "No credit card required" text

**Background:** Soft rose gradient with large blurred orb in center

### 4.7 Footer

**Layout:** 4-column grid on desktop (`md:grid-cols-4`), stacked on mobile.

**Columns:**
1. Logo + tagline
2. Product links (anchor links to page sections)
3. Legal links (Privacy Policy, Terms of Service)
4. Contact (email link)

**Bottom bar:** Horizontal rule + copyright + secondary language switcher

**Colors:** Dark background (`oklch(0.15 0 0)`), white text with reduced opacity for hierarchy

---

## 5. Design System Integration

### 5.1 Typography

| Role | Font Family | Weight Range | Usage |
|------|------------|-------------|-------|
| Display / Headlines | Cormorant (serif) | 300-700 | h1, h2, h3, stat values, FAQ questions |
| Body / UI | DM Sans (sans-serif) | 400-700 | Paragraphs, buttons, labels, nav links |

**Rationale:** Cormorant is an elegant serif that evokes the luxury beauty industry. DM Sans provides clean readability for body text. This pairing creates an editorial feel appropriate for a salon-industry product. The existing app dashboard uses the system default sans-serif -- the marketing page intentionally uses distinctive typography to make a stronger first impression while the dashboard prioritizes functional clarity.

**Font loading:** Google Fonts CDN with `display=swap` to prevent layout shift.

### 5.2 Color Palette

The marketing page uses a custom warm palette built on oklch, distinct from the neutral dashboard tokens:

| Token | oklch Value | Usage |
|-------|------------|-------|
| Background warm start | `oklch(0.98 0.01 45)` | Page background (warm cream) |
| Background warm end | `oklch(0.97 0.015 320)` | Page background gradient end |
| Primary gradient start | `oklch(0.65 0.25 330)` | CTA buttons, logo background |
| Primary gradient end | `oklch(0.55 0.22 300)` | CTA buttons (deeper purple) |
| Accent rose | `oklch(0.75 0.15 330)` | Floating orbs, hover borders |
| Text dark | `oklch(0.20 0 0)` | Primary headings |
| Text medium | `oklch(0.25 0 0)` | Secondary headings |
| Text body | `oklch(0.45 0 0)` | Body paragraphs |
| Text muted | `oklch(0.50 0 0)` | Descriptions, captions |
| Nav link | `oklch(0.45 0 0)` | Nav text default |
| Nav link hover | `oklch(0.25 0 0)` | Nav text hover |
| Border light | `oklch(0.92 0 0)` | Card borders, navbar bottom |
| Border hover | `oklch(0.85 0.05 330)` | Card hover borders (rose tint) |
| Dark section bg | `oklch(0.30 0.05 330)` to `oklch(0.20 0.03 300)` | Benefits/stats section |
| Footer bg | `oklch(0.15 0 0)` | Footer |

**Relationship to existing tokens:** The dashboard uses `--primary: oklch(0.205 0 0)` (near-black) and a neutral palette. The marketing page's warm rose/plum colors are intentionally more expressive. When a user clicks "Sign Up" and lands on `/register`, the transition to the neutral auth card on `bg-muted` feels like entering a focused workspace -- a deliberate contrast that reinforces the product's professional nature.

### 5.3 Animation Patterns

| Animation | CSS Name | Duration | Easing | Usage |
|-----------|---------|----------|--------|-------|
| Fade In Up | `fadeInUp` | 0.8s | ease-out | Hero content entry (staggered) |
| Fade In | `fadeIn` | 1.0s | ease-out | Hero visual, badge |
| Float | `float` | 6.0s | ease-in-out, infinite | Background gradient orbs |
| Shimmer | `shimmer` | 3.0s | linear, infinite | CTA button hover shine |

**Stagger delays:** Hero elements use incremental delays (0.1s through 0.6s) via utility classes `.delay-100` through `.delay-600`. Elements start with `opacity: 0` and animate to `opacity: 1`.

**Performance:** All animations use `transform` and `opacity` only -- these are GPU-composited properties that do not trigger layout recalculations.

**Prefers-reduced-motion:** In production, animations should be wrapped with a `@media (prefers-reduced-motion: reduce)` query that disables all animations and shows content immediately.

---

## 6. State Handling

### 6.1 Page States

| State | Trigger | Behavior |
|-------|---------|----------|
| Initial load | User navigates to `/` | Full page renders with animations. SSR delivers complete HTML |
| Language switch | User clicks language button | Page re-renders in new language (client-side) or navigates to new URL (SSR) |
| FAQ open | User clicks question | Answer panel expands, chevron rotates. Previous open item closes |
| FAQ closed | User clicks open question | Answer panel collapses, chevron rotates back |
| CTA hover | Mouse over gradient button | Shimmer gradient overlay fades in, shadow deepens, slight scale-up |
| Feature card hover | Mouse over card | Border color shifts to rose, shadow intensifies, icon scales up |
| Scroll | User scrolls page | Fixed navbar stays in place. Smooth scroll for anchor links |

### 6.2 Loading State

Since the marketing page is server-side rendered, there is no client-side loading state. The page arrives fully rendered. If the Thymeleaf approach is used, no JavaScript is required for initial render.

For the FAQ accordion and language switcher (which require JavaScript), a progressive enhancement approach is used:
- Without JS: FAQ items can default to all-expanded, language links navigate to separate URLs
- With JS: FAQ becomes an accordion, language switcher updates content in-place

### 6.3 Error States

| Scenario | Handling |
|----------|----------|
| Invalid language in URL (e.g., `/de`) | Server redirects to `/` (English default) |
| Missing translation key | Fall back to English string (never show raw key) |
| Page not found (e.g., `/about`) | Standard 404 page (existing `NotFoundPage` component) |
| Network error loading fonts | `font-display: swap` ensures text is visible immediately with fallback fonts |

---

## 7. Multi-Language UX

### 7.1 Language Switcher Design

**Placement:** Two locations for accessibility:
1. **Header** (primary): Always visible in fixed navbar
2. **Footer** (secondary): Available at bottom of page

**Visual design:**
- Pill-shaped container with rounded-full background
- Three toggle buttons: EN, RU, PL
- Active state: white background with shadow (header) or white/10 background (footer)
- Inactive state: muted text color, hover brightens
- Font: DM Sans, `text-xs`, `font-semibold`, uppercase

**Behavior:**
- Click immediately switches all visible content
- Active language button has distinct visual treatment
- Language preference is stored in a cookie (`slotme_lang=ru`)
- No page reload in client-side mode; full navigation in SSR mode

### 7.2 Content Translation Strategy

All translatable strings are organized by section:

```
nav.login, nav.signup
hero.title, hero.subtitle, hero.description, hero.cta, hero.ctaAlt
features.title, features.subtitle, features.items[n].title, features.items[n].desc
howItWorks.title, howItWorks.steps[n].title, howItWorks.steps[n].desc
benefits.title, benefits.stats[n].value, benefits.stats[n].label
faq.title, faq.items[n].q, faq.items[n].a
cta.title, cta.subtitle, cta.button
footer.tagline, footer.links[n], footer.legal[n], footer.contact
```

**Total strings per language:** Approximately 65-70 translatable strings.

**Translation files (SSR):**
- `messages_en.properties`
- `messages_ru.properties`
- `messages_pl.properties`

All translations for EN, RU, and PL are already provided in the prototype component (`MarketingLanding.tsx`).

### 7.3 RTL Considerations (Future-Proofing)

Current languages (EN, RU, PL) are all left-to-right. To support RTL languages in the future:
- Use logical CSS properties (`margin-inline-start` instead of `margin-left`) where possible
- Avoid absolute left/right positioning for content elements
- Set `dir="rtl"` on the `<html>` element for RTL languages
- Flexbox and grid layouts naturally reverse in RTL mode
- The current design uses centered layouts for most sections, which are RTL-neutral

---

## 8. Responsive Behavior

### 8.1 Breakpoints

| Breakpoint | Width | Grid Columns | Key Changes |
|------------|-------|-------------|-------------|
| xs (mobile) | 375px - 639px | 1 column | Everything stacks. CTAs stack vertically. Reduced font sizes |
| sm (mobile+) | 640px - 767px | 1-2 columns | Stats grid becomes 2-col. CTA buttons go side-by-side |
| md (tablet) | 768px - 1023px | 2 columns | Nav section links appear. Feature grid 2-col. Footer 4-col |
| lg (desktop) | 1024px+ | 3-4 columns | Full layout. Hero 2-col grid. Features 3-col. Steps 4-col |

### 8.2 Section-Specific Responsive Behavior

**Navbar:**
- Mobile: Logo + language switcher + Log In + Sign Up (section links hidden)
- Desktop: Full nav with section anchor links

**Hero:**
- Mobile: Single column, text above visual, `text-6xl` title
- Desktop: Two-column grid, text left + visual right, `text-8xl` title

**Features:**
- Mobile: 1-column stack
- Tablet: 2-column grid
- Desktop: 3-column grid

**How It Works:**
- Mobile: 1-column stack, connector lines hidden
- Tablet: 2-column grid
- Desktop: 4-column grid with connector lines

**Stats:**
- Mobile: 1-column stack (or 2-column on sm+)
- Desktop: 4-column grid

**FAQ:**
- All breakpoints: Single column, max-w-4xl, centered
- Touch targets: Question buttons have `py-6` (48px+ height)

**Footer:**
- Mobile: Single column stack
- Desktop: 4-column grid

### 8.3 Touch Targets

All interactive elements meet the 44x44px minimum touch target:
- Navbar buttons: `h-16` containing area, individual buttons have adequate padding
- Language switcher buttons: `px-3 py-1` within a pill container (total height ~32px, but spaced within the 64px navbar)
- CTA buttons: `py-4` (hero) and `py-5` (bottom CTA) -- well above 44px
- FAQ question buttons: `py-6` -- well above 44px
- Footer links: `space-y-2` vertical spacing provides adequate tap separation

---

## 9. Interaction Patterns

### 9.1 FAQ Accordion

**Behavior:** Single-select accordion (one item open at a time).

| Action | Result |
|--------|--------|
| Click closed question | Opens answer, closes any other open answer |
| Click open question | Closes the answer |
| Tab to question | Focus ring appears on question button |
| Enter/Space on focused question | Toggles answer open/closed |

**Animation:** Chevron icon rotates 180 degrees via CSS `transition-transform`. Answer panel appears/disappears (no height animation in prototype; can add `transition-[max-height]` for smooth expand/collapse).

**Accessibility attributes (to add in production):**
- `role="region"` on the FAQ section
- `aria-expanded="true|false"` on each question button
- `aria-controls="faq-answer-{n}"` linking question to answer
- `id="faq-answer-{n}"` on each answer panel

### 9.2 Smooth Scroll

**Anchor links:** Clicking "Features", "How It Works", or "FAQ" in the navbar scrolls smoothly to the corresponding section.

**Implementation:**
- HTML: `<section id="features">`, `<section id="how-it-works">`, `<section id="faq">`
- Links: `<a href="#features">`
- CSS: `html { scroll-behavior: smooth; }` (or JS `element.scrollIntoView({ behavior: 'smooth' })`)
- Offset: Account for the 64px fixed navbar height using `scroll-margin-top: 80px` on sections

### 9.3 CTA Button States

**Primary CTA (gradient pill):**

| State | Visual |
|-------|--------|
| Default | Gradient from rose to purple, white text, rounded-full |
| Hover | Shadow deepens (`shadow-2xl`), slight scale-up (`scale-105`), shimmer overlay fades in |
| Focus | Focus ring (browser default or custom ring) |
| Active | Scale returns to 1.0 (pressed feel) |

**Secondary CTA (outline):**

| State | Visual |
|-------|--------|
| Default | White background, 2px border, dark text |
| Hover | Border darkens, shadow appears (`shadow-lg`) |
| Focus | Focus ring |

### 9.4 Feature Card Interaction

| State | Visual |
|-------|--------|
| Default | Subtle gradient bg, light border |
| Hover | Border shifts to rose tint, shadow-xl, icon scales up 110% |
| Focus-within | Same as hover (for keyboard navigation) |

---

## 10. Accessibility

### 10.1 Semantic HTML Structure

```
<nav>                          -- Fixed navbar
<main>
  <section>                    -- Hero (contains h1)
  <section id="features">      -- Features (contains h2)
  <section id="how-it-works">  -- How It Works (contains h2)
  <section>                    -- Benefits/Stats (contains h2)
  <section id="faq">           -- FAQ (contains h2)
  <section>                    -- Bottom CTA (contains h2)
</main>
<footer>                       -- Footer
```

### 10.2 Heading Hierarchy

```
h1: "Your AI Receptionist" (hero -- one per page)
  h2: "Everything Your Salon Needs" (features)
    h3: Feature titles (6 items)
  h2: "Simple Setup, Powerful Results" (how it works)
    h3: Step titles (4 items)
  h2: "Transform Your Salon" (benefits)
  h2: "Frequently Asked Questions" (FAQ)
  h2: "Ready to Transform Your Salon?" (bottom CTA)
  h4: Footer section headings (Product, Legal, Contact)
```

### 10.3 Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move focus through: nav links -> language buttons -> Log In -> Sign Up -> CTA buttons -> FAQ questions -> footer links |
| Enter/Space | Activate focused button or link |
| Escape | No modal to close (page is non-modal) |

**Focus indicators:** All interactive elements must have visible focus rings. The existing button component uses `focus-visible:ring-ring/50 focus-visible:ring-[3px]`. Marketing page buttons should have equivalent focus styles.

### 10.4 Screen Reader Considerations

- **Logo:** Include `aria-label="SlotMe home"` on logo link
- **Language switcher:** Wrap in `<div role="radiogroup" aria-label="Language">` with `aria-checked` on each button
- **Section anchors:** Use `aria-label` on nav links if text is abbreviated
- **FAQ accordion:** Use `aria-expanded` and `aria-controls` attributes
- **Decorative elements:** Background gradient orbs should have `aria-hidden="true"`
- **Stats section:** Stat values should be readable (e.g., "2 to 4 hours saved per day on admin tasks")
- **Skip to content:** Add a skip link at the top of the page (`<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>`)

### 10.5 Color Contrast Verification

| Text | Background | Contrast Ratio | WCAG AA |
|------|-----------|----------------|---------|
| `oklch(0.20 0 0)` on white | White `oklch(1 0 0)` | ~16:1 | Pass |
| `oklch(0.45 0 0)` on white | White | ~5.5:1 | Pass |
| `oklch(0.50 0 0)` on `oklch(0.97 0 0)` | Light gray | ~4.6:1 | Pass |
| White on `oklch(0.30 0.05 330)` | Dark section | ~9:1 | Pass |
| White on `oklch(0.15 0 0)` | Footer | ~14:1 | Pass |
| White on gradient CTA | Rose-purple gradient | ~4.5:1+ | Pass (verify) |

**Note:** The rose/purple CTA gradient (`oklch(0.65 0.25 330)` to `oklch(0.55 0.22 300)`) with white text should be verified with a contrast checker tool. The lighter end (`0.65 lightness`) against white text may be borderline -- if it fails, darken the gradient start slightly.

---

## 11. SEO & Meta

### 11.1 Page Title & Description (per language)

**English:**
- Title: "SlotMe -- AI Virtual Receptionist for Beauty Salons"
- Description: "Transform your salon with an AI assistant that handles bookings 24/7 across WhatsApp, Messenger, and SMS. Never miss a client again."

**Russian:**
- Title: "SlotMe -- AI Виртуальный Администратор для Салонов Красоты"
- Description: "Преобразите ваш салон с AI ассистентом, который обрабатывает записи 24/7 через WhatsApp, Messenger и SMS."

**Polish:**
- Title: "SlotMe -- AI Wirtualna Recepcjonistka dla Salonow Piękności"
- Description: "Przekształć swoj salon dzięki asystentowi AI, ktory obsługuje rezerwacje 24/7 przez WhatsApp, Messenger i SMS."

### 11.2 hreflang Tags

```html
<link rel="alternate" hreflang="en" href="https://slotme.ai/" />
<link rel="alternate" hreflang="ru" href="https://slotme.ai/ru" />
<link rel="alternate" hreflang="pl" href="https://slotme.ai/pl" />
<link rel="alternate" hreflang="x-default" href="https://slotme.ai/" />
```

### 11.3 Open Graph & Social Sharing

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="SlotMe - AI Virtual Receptionist" />
<meta property="og:description" content="..." />
<meta property="og:image" content="/og-image.jpg" />
<meta property="og:url" content="https://slotme.ai/" />
```

---

## 12. Assets Required

| Asset | Format | Purpose | Status |
|-------|--------|---------|--------|
| Cormorant font | Google Fonts CDN | Display typography | Available |
| DM Sans font | Google Fonts CDN | Body typography | Available |
| Lucide icons | npm package (existing) | Feature icons, UI icons | Available |
| Hero image/illustration | WebP + fallback PNG | Hero section visual | To be created |
| OG sharing image | JPG, 1200x630 | Social media previews | To be created |
| Favicon | ICO + PNG | Browser tab icon | To be created |

---

## 13. Component Summary for Implementation

| Component | Type | Description |
|-----------|------|-------------|
| MarketingNavbar | Layout | Fixed top navbar with logo, section links, language switcher, auth buttons |
| HeroSection | Section | Two-column hero with title, CTAs, visual placeholder |
| FeatureCard | Card | Icon + title + description card for features grid |
| FeaturesSection | Section | Grid of 6 FeatureCards |
| HowItWorksStep | Card | Numbered circle + title + description |
| HowItWorksSection | Section | Grid of 4 steps with connectors |
| StatCard | Card | Large value + label on dark background |
| BenefitsSection | Section | Dark section with grid of 4 StatCards |
| FaqItem | Accordion | Expandable question/answer item |
| FaqSection | Section | List of 5 FaqItems |
| BottomCTA | Section | Final conversion CTA with headline + button |
| MarketingFooter | Layout | 4-column footer with links, legal, contact, language switcher |

---

*End of UX Design Document*

# Architecture: Marketing Website with Multi-Language Support

**Author:** Architect
**Date:** 2026-02-15
**Status:** Draft (pending approval)

---

## 1. Technology Stack Decision

### Recommendation: Thymeleaf SSR

The marketing website will use **Thymeleaf templates** rendered by Spring Boot. This is the recommended approach for the following reasons:

1. **Simplicity**: Thymeleaf is already a first-class citizen in Spring Boot. No additional SSR framework or Node.js runtime is required.
2. **SEO**: Pages are fully rendered HTML on the server -- no JavaScript required for content to be visible to crawlers.
3. **Performance**: Static HTML served directly from Spring Boot is extremely fast. No hydration step, no JavaScript bundle for marketing pages.
4. **Maintainability**: The marketing pages are static content with no client-side interactivity beyond an FAQ accordion and language switcher. Thymeleaf is the right tool for this level of complexity.
5. **Coexistence**: The React SPA continues to handle all authenticated routes (`/login`, `/register`, `/admin/*`, `/master/*`). The Thymeleaf pages only serve `/`, `/ru`, `/pl`.

### What This Means

- The React prototype in `frontend/src/pages/MarketingLanding.tsx` serves as a **design reference** only. Its HTML structure, CSS, and translations will be extracted into Thymeleaf templates and static assets.
- The marketing pages do NOT load React, TanStack Router, or any SPA JavaScript.
- The FAQ accordion and mobile hamburger menu use vanilla JavaScript (~50 lines).

---

## 2. Directory Structure

### Backend Additions

```
backend/src/main/
├── java/com/slotme/
│   └── marketing/
│       ├── controller/
│       │   └── MarketingController.java
│       └── config/
│           └── MarketingWebConfig.java
├── resources/
│   ├── templates/
│   │   └── marketing/
│   │       ├── landing.html          # Main Thymeleaf template
│   │       └── fragments/
│   │           ├── head.html         # <head> with SEO meta, fonts, CSS
│   │           ├── nav.html          # Navigation bar
│   │           ├── hero.html         # Hero section
│   │           ├── features.html     # Features grid
│   │           ├── how-it-works.html # How it works steps
│   │           ├── benefits.html     # Stats/benefits section
│   │           ├── faq.html          # FAQ accordion
│   │           ├── cta.html          # Bottom CTA
│   │           └── footer.html       # Footer
│   ├── static/
│   │   └── marketing/
│   │       ├── css/
│   │       │   └── marketing.css     # All styles (extracted from React prototype)
│   │       ├── js/
│   │       │   └── marketing.js      # FAQ accordion + mobile menu (~50 lines)
│   │       ├── images/
│   │       │   ├── og-image.jpg      # Open Graph image
│   │       │   └── icons/            # SVG icons (extracted from Lucide)
│   │       │       ├── sparkles.svg
│   │       │       ├── calendar.svg
│   │       │       ├── bell.svg
│   │       │       ├── message-circle.svg
│   │       │       ├── refresh-cw.svg
│   │       │       ├── bar-chart.svg
│   │       │       ├── chevron-down.svg
│   │       │       └── check.svg
│   │       └── robots.txt
│   └── i18n/
│       ├── messages_en.properties    # English translations
│       ├── messages_ru.properties    # Russian translations
│       └── messages_pl.properties    # Polish translations
```

### Frontend Changes (Minimal)

```
frontend/src/app/routes/
├── index.tsx                # MODIFY: No longer redirects to /login for unauthenticated users
```

The `index.tsx` route change is discussed in Section 6 (Routing).

---

## 3. Backend Components

### 3.1 MarketingController

**File:** `backend/src/main/java/com/slotme/marketing/controller/MarketingController.java`

```java
@Controller
public class MarketingController {

    @GetMapping("/")
    public String landingDefault(Model model, HttpServletRequest request) {
        return renderLanding("en", model, request);
    }

    @GetMapping("/{lang:en|ru|pl}")
    public String landingWithLang(@PathVariable String lang, Model model,
                                  HttpServletRequest request) {
        return renderLanding(lang, model, request);
    }

    private String renderLanding(String lang, Model model, HttpServletRequest request) {
        model.addAttribute("lang", lang);
        model.addAttribute("currentYear", Year.now().getValue());
        return "marketing/landing";
    }

    @GetMapping("/sitemap.xml")
    @ResponseBody
    public ResponseEntity<String> sitemap() {
        // Returns XML sitemap with /, /ru, /pl
    }
}
```

**Key design decisions:**

- Uses `@Controller` (not `@RestController`) since it returns Thymeleaf view names.
- The `{lang:en|ru|pl}` regex path variable ensures only supported languages are matched. Any other path (like `/login`, `/register`, `/admin`) falls through to the SPA catch-all.
- Language resolution uses the URL path directly, with no `LocaleResolver` complexity. The Thymeleaf `#{...}` expressions automatically resolve to the correct locale based on the `lang` path variable.

### 3.2 MarketingWebConfig

**File:** `backend/src/main/java/com/slotme/marketing/config/MarketingWebConfig.java`

```java
@Configuration
public class MarketingWebConfig implements WebMvcConfigurer {

    @Bean
    public LocaleResolver localeResolver() {
        CookieLocaleResolver resolver = new CookieLocaleResolver("slotme_lang");
        resolver.setDefaultLocale(Locale.ENGLISH);
        return resolver;
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
        interceptor.setParamName("lang");
        return interceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/marketing/**")
                .addResourceLocations("classpath:/static/marketing/")
                .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));
    }
}
```

**Locale resolution strategy (in priority order):**

1. URL path: `/ru` sets locale to Russian
2. Cookie `slotme_lang`: persists user preference across visits
3. `Accept-Language` header: used for first-time visitors at `/`
4. Default: English

### 3.3 MessageSource Configuration

Spring Boot's default `MessageSource` will be configured to read from the `i18n/` directory:

**In `application.yml`:**

```yaml
spring:
  messages:
    basename: i18n/messages
    encoding: UTF-8
    fallback-to-system-locale: false
```

The `fallback-to-system-locale: false` ensures that missing translations fall back to English (the default bundle) rather than the server's system locale.

---

## 4. i18n Implementation

### 4.1 Message Properties Files

All marketing copy from the React prototype will be extracted into `.properties` files. The structure mirrors the React component's content object.

**File:** `backend/src/main/resources/i18n/messages_en.properties`

```properties
# Navigation
nav.login=Log In
nav.signup=Sign Up
nav.features=Features
nav.howItWorks=How It Works
nav.faq=FAQ

# Hero
hero.badge=AI-Powered Salon Management
hero.title=Your AI Receptionist
hero.subtitle=Never Miss a Booking Again
hero.description=SlotMe transforms your salon with an intelligent virtual assistant that handles bookings 24/7 across WhatsApp, Messenger, voice, and SMS.
hero.cta=Get Started Free
hero.ctaAlt=Watch Demo

# Features
features.title=Everything Your Salon Needs
features.subtitle=Powerful features designed for modern beauty businesses
features.1.title=AI Conversational Booking
features.1.desc=Natural language booking via WhatsApp, Messenger, voice calls, and SMS
features.2.title=Smart Calendar Management
features.2.desc=Intelligent scheduling prevents double-bookings and optimizes your time
features.3.title=Automated Reminders
features.3.desc=Reduce no-shows with personalized SMS and messaging reminders
features.4.title=Multi-Channel Support
features.4.desc=Meet clients on their preferred platform - all managed in one place
features.5.title=Intelligent Slot Rearrangement
features.5.desc=Automatically fill cancelled slots by reaching out to waitlisted clients
features.6.title=Business Analytics
features.6.desc=Track bookings, revenue, and client trends with real-time dashboards

# How It Works
howItWorks.title=Simple Setup, Powerful Results
howItWorks.1.title=Configure Your Salon
howItWorks.1.desc=Add your services, staff schedules, and business hours in minutes
howItWorks.2.title=Connect Your Channels
howItWorks.2.desc=Link WhatsApp, Messenger, and phone numbers to your SlotMe assistant
howItWorks.3.title=AI Takes Over
howItWorks.3.desc=Your virtual receptionist starts handling bookings automatically
howItWorks.4.title=Monitor & Grow
howItWorks.4.desc=Track everything from your dashboard and watch your business thrive

# Benefits
benefits.title=Transform Your Salon
benefits.1.value=2-4 hours
benefits.1.label=Saved per day on admin tasks
benefits.2.value=40%+
benefits.2.label=More cancelled slots filled
benefits.3.value=24/7
benefits.3.label=Availability for bookings
benefits.4.value=60%
benefits.4.label=Reduction in no-shows

# FAQ
faq.title=Frequently Asked Questions
faq.1.q=What is SlotMe?
faq.1.a=SlotMe is an AI-powered virtual receptionist for beauty salons. It handles appointment bookings, reminders, and customer communications across multiple channels automatically.
faq.2.q=How does the AI booking work?
faq.2.a=Clients can book appointments using natural language via WhatsApp, Messenger, SMS, or voice calls. Our AI understands their requests, checks availability, and confirms bookings instantly.
faq.3.q=Which messaging channels are supported?
faq.3.a=SlotMe supports WhatsApp, Facebook Messenger, SMS, and voice calls. All conversations are managed from a single dashboard.
faq.4.q=How much does it cost?
faq.4.a=We offer flexible pricing plans starting with a free tier for small salons. Contact us or sign up to see detailed pricing options.
faq.5.q=Is my data secure?
faq.5.a=Absolutely. We use enterprise-grade encryption and comply with GDPR and international data protection standards. Your salon and client data is always protected.

# CTA
cta.title=Ready to Transform Your Salon?
cta.subtitle=Join hundreds of salons already using SlotMe
cta.button=Start Free Trial
cta.noCreditCard=No credit card required

# Footer
footer.tagline=AI-powered booking for modern salons
footer.product=Product
footer.legal=Legal
footer.contact=Contact
footer.privacy=Privacy Policy
footer.terms=Terms of Service
footer.copyright=\u00A9 {0} SlotMe. All rights reserved.

# SEO
seo.title=SlotMe - AI Virtual Receptionist for Beauty Salons
seo.description=Transform your salon with an AI assistant that handles bookings 24/7 across WhatsApp, Messenger, and SMS. Never miss a client again.
seo.ogTitle=SlotMe - AI Virtual Receptionist
```

Russian (`messages_ru.properties`) and Polish (`messages_pl.properties`) files follow the same key structure with translated values, sourced directly from the React prototype's content object.

### 4.2 Thymeleaf i18n Usage

In templates, translations are referenced via `#{key}`:

```html
<h1 th:text="#{hero.title}">Your AI Receptionist</h1>
<p th:text="#{hero.description}">SlotMe transforms your salon...</p>
```

Each template element includes English fallback text as its body content, ensuring the template is readable and functional even outside Thymeleaf rendering.

---

## 5. Template Structure

### 5.1 Main Template

**File:** `backend/src/main/resources/templates/marketing/landing.html`

```html
<!DOCTYPE html>
<html th:lang="${lang}" xmlns:th="http://www.thymeleaf.org">
<head th:replace="~{marketing/fragments/head :: head}"></head>
<body class="font-body min-h-screen bg-gradient-to-b from-cream via-white to-soft-pink">
  <div th:replace="~{marketing/fragments/nav :: nav}"></div>
  <main>
    <div th:replace="~{marketing/fragments/hero :: hero}"></div>
    <div th:replace="~{marketing/fragments/features :: features}"></div>
    <div th:replace="~{marketing/fragments/how-it-works :: howItWorks}"></div>
    <div th:replace="~{marketing/fragments/benefits :: benefits}"></div>
    <div th:replace="~{marketing/fragments/faq :: faq}"></div>
    <div th:replace="~{marketing/fragments/cta :: cta}"></div>
  </main>
  <div th:replace="~{marketing/fragments/footer :: footer}"></div>
  <script src="/marketing/js/marketing.js" defer></script>
</body>
</html>
```

### 5.2 Head Fragment (SEO)

```html
<head th:fragment="head">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title th:text="#{seo.title}">SlotMe - AI Virtual Receptionist</title>
  <meta name="description" th:content="#{seo.description}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" th:content="#{seo.ogTitle}">
  <meta property="og:description" th:content="#{seo.description}">
  <meta property="og:image" content="/marketing/images/og-image.jpg">
  <meta property="og:url" th:content="@{${baseUrl + '/' + (lang == 'en' ? '' : lang)}}">

  <!-- hreflang for SEO -->
  <link rel="alternate" hreflang="en" th:href="@{${baseUrl + '/'}}">
  <link rel="alternate" hreflang="ru" th:href="@{${baseUrl + '/ru'}}">
  <link rel="alternate" hreflang="pl" th:href="@{${baseUrl + '/pl'}}">
  <link rel="alternate" hreflang="x-default" th:href="@{${baseUrl + '/'}}">

  <!-- Canonical -->
  <link rel="canonical" th:href="@{${baseUrl + '/' + (lang == 'en' ? '' : lang)}}">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="/marketing/css/marketing.css">

  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SlotMe",
    "description": "AI-powered virtual receptionist for beauty salons",
    "url": "https://slotme.ai",
    "logo": "https://slotme.ai/marketing/images/logo.png",
    "sameAs": []
  }
  </script>
</head>
```

### 5.3 Navigation Fragment

The language switcher in the nav generates links to language-prefixed URLs:

```html
<nav th:fragment="nav" class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <a th:href="@{'/' + (lang == 'en' ? '' : lang)}" class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <img src="/marketing/images/icons/sparkles.svg" alt="" class="w-5 h-5">
        </div>
        <span class="font-display text-2xl font-semibold text-dark">SlotMe</span>
      </a>

      <!-- Desktop nav links -->
      <div class="hidden md:flex items-center gap-8">
        <a href="#features" class="nav-link" th:text="#{nav.features}">Features</a>
        <a href="#how-it-works" class="nav-link" th:text="#{nav.howItWorks}">How It Works</a>
        <a href="#faq" class="nav-link" th:text="#{nav.faq}">FAQ</a>
      </div>

      <!-- Right side: lang switcher + auth -->
      <div class="flex items-center gap-4">
        <!-- Language switcher -->
        <div class="flex items-center gap-1 bg-gray-100 rounded-full p-1">
          <a th:href="@{/}" th:classappend="${lang == 'en'} ? 'lang-active' : 'lang-inactive'" class="lang-btn">EN</a>
          <a th:href="@{/ru}" th:classappend="${lang == 'ru'} ? 'lang-active' : 'lang-inactive'" class="lang-btn">RU</a>
          <a th:href="@{/pl}" th:classappend="${lang == 'pl'} ? 'lang-active' : 'lang-inactive'" class="lang-btn">PL</a>
        </div>

        <a href="/login" class="nav-link" th:text="#{nav.login}">Log In</a>
        <a href="/register" class="btn-primary" th:text="#{nav.signup}">Sign Up</a>

        <!-- Mobile hamburger -->
        <button id="mobile-menu-btn" class="md:hidden" aria-label="Menu">
          <svg>...</svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu (hidden by default) -->
  <div id="mobile-menu" class="hidden md:hidden">...</div>
</nav>
```

**Language switching uses full page navigation** (anchor links like `<a href="/ru">`), not client-side state. This ensures:
- Each language variant has a distinct, shareable, crawlable URL
- No JavaScript is required for language switching
- A cookie is set by the server on each request to remember the preference

---

## 6. Routing Configuration

### 6.1 How SSR and SPA Coexist

This is the most critical architectural decision. The system has three categories of routes:

| Route Pattern | Served By | Content |
|---|---|---|
| `/` | Spring Boot (Thymeleaf) | Marketing landing page (English) |
| `/ru` | Spring Boot (Thymeleaf) | Marketing landing page (Russian) |
| `/pl` | Spring Boot (Thymeleaf) | Marketing landing page (Polish) |
| `/sitemap.xml` | Spring Boot (controller) | XML sitemap |
| `/robots.txt` | Spring Boot (static resource) | Robots file |
| `/marketing/**` | Spring Boot (static resource) | CSS, JS, images for marketing pages |
| `/api/v1/**` | Spring Boot (REST controllers) | API endpoints |
| `/login`, `/register`, `/admin/*`, `/master/*` | React SPA | Application routes |

### 6.2 Implementation Strategy

**In development** (frontend dev server on port 3033, backend on 8083):

- The Vite dev server (port 3033) handles all SPA routes.
- The React SPA's `frontend/src/app/routes/index.tsx` currently redirects unauthenticated users to `/login`. This route will be **removed or updated** so that `/` is no longer claimed by the SPA. The marketing page at `/` will be accessed directly via the backend (port 8083) or proxied.
- The Vite proxy config should proxy `/api/**` to the backend as it already does.

**In production** (single deployment):

- The Spring Boot backend serves both the Thymeleaf marketing pages and the built React SPA.
- A `SpaForwardingController` or resource handler is added to serve the React SPA's `index.html` for all SPA routes that don't match a Thymeleaf or API route.
- The built React SPA assets (from `pnpm build`) are copied to `backend/src/main/resources/static/app/` during the build process.

### 6.3 SPA Forwarding

**File:** `backend/src/main/java/com/slotme/config/SpaForwardingConfig.java`

```java
@Controller
public class SpaForwardingConfig {

    /**
     * Forwards SPA routes to the React app's index.html.
     * Only matches routes that are NOT handled by:
     * - MarketingController (/, /en, /ru, /pl)
     * - API controllers (/api/**)
     * - Static resources (/marketing/**, /app/**)
     * - Actuator (/actuator/**)
     */
    @GetMapping({
        "/login", "/register", "/password-reset",
        "/admin", "/admin/{path:.*}",
        "/master", "/master/{path:.*}",
        "/invite/{token}"
    })
    public String forwardToSpa() {
        return "forward:/app/index.html";
    }
}
```

This explicitly lists SPA routes rather than using a catch-all, which avoids conflicts with the marketing controller and keeps routing predictable.

### 6.4 Frontend Route Changes

**File:** `frontend/src/app/routes/index.tsx`

The current `index.tsx` redirects unauthenticated users to `/login`. Since `/` will now be served by Thymeleaf, this route needs adjustment:

**Option A (recommended):** Remove `index.tsx` entirely. The `/` path is no longer handled by the SPA -- it is served by the backend. If an authenticated user navigates to `/`, they see the marketing page (which has "Log In" that takes them to the SPA). The SPA's TanStack Router simply does not define a `/` route.

**Option B:** Keep `index.tsx` but only for the dev server. In production, `/` is served by Thymeleaf and the SPA never receives that route.

**Recommendation:** Option A. Remove the `/` route from TanStack Router.

### 6.5 Security Configuration Changes

The existing `SecurityConfig.java` already has `auth.anyRequest().permitAll()` as the final rule, which means the marketing page routes (`/`, `/ru`, `/pl`) are already permitted. No security changes are needed.

The marketing pages are public and unauthenticated. The JWT filter will simply not find a token on marketing page requests and let them pass through.

---

## 7. Static Assets

### 7.1 CSS Strategy

**File:** `backend/src/main/resources/static/marketing/css/marketing.css`

The CSS will be a **hand-crafted, self-contained stylesheet** extracted from the React prototype. It will NOT use Tailwind's build system (to avoid adding a CSS build step to the backend). Instead:

1. Extract all Tailwind utility classes used in `MarketingLanding.tsx`
2. Convert them to semantic CSS classes in `marketing.css`
3. Use CSS custom properties for the color palette

```css
:root {
  /* Color palette from React prototype (oklch) */
  --color-cream: oklch(0.98 0.01 45);
  --color-soft-pink: oklch(0.97 0.015 320);
  --color-primary: oklch(0.65 0.25 330);
  --color-primary-dark: oklch(0.55 0.22 300);
  --color-accent-pink: oklch(0.75 0.15 330);
  --color-dark: oklch(0.20 0 0);
  --color-text: oklch(0.25 0 0);
  --color-text-muted: oklch(0.45 0 0);
  --color-border: oklch(0.92 0 0);

  /* Fonts */
  --font-display: 'Cormorant', serif;
  --font-body: 'DM Sans', sans-serif;
}
```

The CSS includes:
- Typography classes (`.font-display`, `.font-body`)
- Layout utilities (grid, flexbox, responsive breakpoints)
- Component styles (`.btn-primary`, `.nav-link`, `.feature-card`, `.faq-item`)
- Animations (`@keyframes fadeInUp`, `float`, `shimmer`)
- Responsive media queries for mobile (375px+), tablet (768px+), desktop (1024px+)

**Size estimate:** ~8-12 KB minified.

### 7.2 JavaScript

**File:** `backend/src/main/resources/static/marketing/js/marketing.js`

Minimal vanilla JavaScript for:

1. **FAQ accordion**: Toggle open/close of FAQ items
2. **Mobile hamburger menu**: Toggle visibility of mobile nav
3. **Smooth scrolling**: For anchor links (`#features`, `#how-it-works`, `#faq`)

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // FAQ accordion
  document.querySelectorAll('[data-faq-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const icon = button.querySelector('[data-chevron]');
      answer.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
    });
  });

  // Mobile menu
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  menuBtn?.addEventListener('click', () => menu?.classList.toggle('hidden'));

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute('href'))
        ?.scrollIntoView({ behavior: 'smooth' });
    });
  });
});
```

**Size:** ~1 KB minified. No external dependencies.

### 7.3 Icons

Lucide icons from the React prototype will be exported as individual SVG files and stored in `/marketing/images/icons/`. They are referenced in templates via `<img>` tags or inlined as SVG.

### 7.4 Fonts

Loaded via Google Fonts CDN with `display=swap` and `preconnect` hints (as shown in the head fragment). No self-hosting for MVP.

---

## 8. SEO Implementation

### 8.1 Meta Tags

Every language variant includes:
- `<title>` and `<meta name="description">` (translated per locale)
- `<meta property="og:title">`, `og:description`, `og:image`, `og:url`
- `<link rel="canonical">` pointing to the current language variant

### 8.2 hreflang Tags

```html
<link rel="alternate" hreflang="en" href="https://slotme.ai/">
<link rel="alternate" hreflang="ru" href="https://slotme.ai/ru">
<link rel="alternate" hreflang="pl" href="https://slotme.ai/pl">
<link rel="alternate" hreflang="x-default" href="https://slotme.ai/">
```

### 8.3 Sitemap

**Endpoint:** `GET /sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://slotme.ai/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://slotme.ai/"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://slotme.ai/ru"/>
    <xhtml:link rel="alternate" hreflang="pl" href="https://slotme.ai/pl"/>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://slotme.ai/ru</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://slotme.ai/"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://slotme.ai/ru"/>
    <xhtml:link rel="alternate" hreflang="pl" href="https://slotme.ai/pl"/>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://slotme.ai/pl</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://slotme.ai/"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://slotme.ai/ru"/>
    <xhtml:link rel="alternate" hreflang="pl" href="https://slotme.ai/pl"/>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

### 8.4 robots.txt

**File:** `backend/src/main/resources/static/robots.txt`

```
User-agent: *
Allow: /
Allow: /ru
Allow: /pl
Disallow: /api/
Disallow: /admin/
Disallow: /master/
Disallow: /login
Disallow: /register
Sitemap: https://slotme.ai/sitemap.xml
```

### 8.5 Structured Data

Organization schema in JSON-LD format (see head fragment in Section 5.2).

### 8.6 Semantic HTML

The templates use proper semantic elements:
- `<nav>` for navigation
- `<main>` wrapping all content sections
- `<section>` for each page section with `id` attributes
- `<footer>` for the footer
- Proper heading hierarchy: single `<h1>` in hero, `<h2>` for section titles, `<h3>` for subsections

---

## 9. Build and Deployment

### 9.1 Development Workflow

```
# Terminal 1: Backend (serves marketing pages + API)
cd backend && ./gradlew bootRun

# Terminal 2: Frontend dev server (serves SPA routes)
cd frontend && pnpm dev
```

During development:
- Visit `http://localhost:8083/` for the marketing page (Thymeleaf)
- Visit `http://localhost:3033/login` for the SPA (Vite dev server)
- API calls from the SPA proxy through Vite to `localhost:8083`

### 9.2 Production Build

```bash
# 1. Build React SPA
cd frontend && pnpm build
# Output: frontend/dist/

# 2. Copy SPA build to backend static resources
cp -r frontend/dist/* backend/src/main/resources/static/app/

# 3. Build Spring Boot JAR (includes Thymeleaf templates + SPA + static assets)
cd backend && ./gradlew bootJar
# Output: backend/build/libs/slotme-backend-0.0.1-SNAPSHOT.jar
```

The single JAR serves everything:
- Marketing pages (Thymeleaf SSR) at `/`, `/ru`, `/pl`
- React SPA at `/login`, `/register`, `/admin/*`, `/master/*`
- API at `/api/v1/**`
- Static assets at `/marketing/**` and `/app/**`

### 9.3 Gradle Task for SPA Copy

A Gradle task can automate step 2:

```kotlin
tasks.register<Copy>("copySpaAssets") {
    dependsOn(":frontend:build")  // if using composite build
    from("../frontend/dist")
    into("src/main/resources/static/app")
}

tasks.named("processResources") {
    dependsOn("copySpaAssets")
}
```

---

## 10. Performance Optimizations

### 10.1 Caching

- **Static assets** (`/marketing/css/`, `/marketing/js/`, `/marketing/images/`): Cache-Control `max-age=31536000` (1 year) with content-hash in filenames for cache busting.
- **Marketing pages** (`/`, `/ru`, `/pl`): Cache-Control `public, max-age=3600` (1 hour). These are static content that rarely changes.
- **Spring Boot response compression** is enabled in `application.yml`:

```yaml
server:
  compression:
    enabled: true
    mime-types: text/html,text/css,application/javascript,application/json
    min-response-size: 1024
```

### 10.2 Font Loading

- `<link rel="preconnect">` for Google Fonts
- `font-display: swap` prevents blocking render on font load

### 10.3 Image Optimization

- Use WebP format for hero images with JPEG fallback
- Provide multiple sizes via `srcset` for responsive images
- Lazy-load images below the fold with `loading="lazy"`
- SVG icons are small and inline-able

### 10.4 Page Size Budget

| Asset | Target Size (gzipped) |
|---|---|
| HTML (Thymeleaf rendered) | ~8 KB |
| CSS (marketing.css) | ~3 KB |
| JS (marketing.js) | ~0.5 KB |
| SVG icons (8 files) | ~2 KB total |
| Fonts (Google CDN) | 0 KB (external) |
| **Total (excluding images)** | **~13.5 KB** |

This comfortably meets the FCP < 1.5s and LCP < 2.5s targets on any connection.

---

## 11. Security Considerations

### 11.1 No New Attack Surface

The marketing pages are purely static HTML served by Thymeleaf. There are:
- No form submissions
- No user input processing
- No database queries
- No authentication requirements
- No cookies set (except the language preference cookie, which is not sensitive)

### 11.2 Content Security Policy

Add CSP headers via Spring Security for marketing pages:

```
Content-Security-Policy:
  default-src 'self';
  style-src 'self' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data:;
  script-src 'self';
  frame-ancestors 'none';
```

This is configured in `SecurityConfig.java` via Spring Security's headers configuration.

### 11.3 Existing Security Preserved

- CSRF is disabled (stateless JWT API -- no change)
- X-Content-Type-Options, X-Frame-Options already configured
- HSTS enabled in production profile
- The marketing pages use Thymeleaf's built-in XSS protection (all `th:text` output is automatically HTML-escaped)

---

## 12. Database Changes

**None.** The marketing website is purely static content. No new tables, columns, or migrations are needed.

---

## 13. File Inventory

### Files to Create

| File | Description |
|---|---|
| `backend/src/main/java/com/slotme/marketing/controller/MarketingController.java` | Controller for `/`, `/ru`, `/pl`, `/sitemap.xml` |
| `backend/src/main/java/com/slotme/marketing/config/MarketingWebConfig.java` | Locale resolver, interceptor, resource handler config |
| `backend/src/main/java/com/slotme/config/SpaForwardingConfig.java` | Forwards SPA routes to React index.html |
| `backend/src/main/resources/templates/marketing/landing.html` | Main Thymeleaf template |
| `backend/src/main/resources/templates/marketing/fragments/head.html` | Head fragment with SEO meta |
| `backend/src/main/resources/templates/marketing/fragments/nav.html` | Navigation bar fragment |
| `backend/src/main/resources/templates/marketing/fragments/hero.html` | Hero section fragment |
| `backend/src/main/resources/templates/marketing/fragments/features.html` | Features section fragment |
| `backend/src/main/resources/templates/marketing/fragments/how-it-works.html` | How it works section fragment |
| `backend/src/main/resources/templates/marketing/fragments/benefits.html` | Benefits/stats section fragment |
| `backend/src/main/resources/templates/marketing/fragments/faq.html` | FAQ accordion fragment |
| `backend/src/main/resources/templates/marketing/fragments/cta.html` | Bottom CTA fragment |
| `backend/src/main/resources/templates/marketing/fragments/footer.html` | Footer fragment |
| `backend/src/main/resources/static/marketing/css/marketing.css` | All styles for marketing pages |
| `backend/src/main/resources/static/marketing/js/marketing.js` | FAQ accordion + mobile menu JS |
| `backend/src/main/resources/static/marketing/images/icons/sparkles.svg` | Lucide icon |
| `backend/src/main/resources/static/marketing/images/icons/calendar.svg` | Lucide icon |
| `backend/src/main/resources/static/marketing/images/icons/bell.svg` | Lucide icon |
| `backend/src/main/resources/static/marketing/images/icons/message-circle.svg` | Lucide icon |
| `backend/src/main/resources/static/marketing/images/icons/refresh-cw.svg` | Lucide icon |
| `backend/src/main/resources/static/marketing/images/icons/bar-chart.svg` | Lucide icon |
| `backend/src/main/resources/static/marketing/images/icons/chevron-down.svg` | Lucide icon |
| `backend/src/main/resources/static/marketing/images/icons/check.svg` | Lucide icon |
| `backend/src/main/resources/static/robots.txt` | robots.txt |
| `backend/src/main/resources/i18n/messages_en.properties` | English translations |
| `backend/src/main/resources/i18n/messages_ru.properties` | Russian translations |
| `backend/src/main/resources/i18n/messages_pl.properties` | Polish translations |

### Files to Modify

| File | Change |
|---|---|
| `backend/build.gradle.kts` | Add `spring-boot-starter-thymeleaf` dependency |
| `backend/src/main/resources/application.yml` | Add `spring.messages.basename`, server compression config |
| `backend/src/main/java/com/slotme/security/SecurityConfig.java` | Add CSP header for marketing pages |
| `frontend/src/app/routes/index.tsx` | Remove or modify -- `/` no longer served by SPA |

### Files Unchanged

- All existing backend controllers, services, entities, repositories
- All existing frontend routes except `index.tsx`
- All database migrations
- Docker, CI/CD configuration

---

## 14. API Contracts

The marketing website introduces no new API endpoints. The only new HTTP endpoints are:

### GET / (and /ru, /pl)

- **Response:** `200 OK` with `text/html` content type
- **Headers:** `Content-Language: en|ru|pl`, `Cache-Control: public, max-age=3600`
- **Body:** Fully rendered HTML page

### GET /sitemap.xml

- **Response:** `200 OK` with `application/xml` content type
- **Body:** XML sitemap (see Section 8.3)

---

## 15. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Route conflict between Thymeleaf and SPA | Medium | High | Explicit route listing in SPA forwarder; regex constraint on lang path variable |
| Translation quality issues | Medium | Medium | Source translations from React prototype (already reviewed); native speaker review |
| CSS inconsistency with React prototype | Low | Medium | Pixel-compare against React prototype during QA |
| Performance regression on SPA routes | Low | Low | SPA forwarding is a simple `forward:`, no overhead |

---

*End of Architecture Document*

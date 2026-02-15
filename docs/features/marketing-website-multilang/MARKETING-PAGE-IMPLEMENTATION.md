# Marketing Page Implementation Guide

## Overview

The SlotMe marketing landing page is a distinctive, editorial-luxury design created specifically for the beauty salon industry. It features:

- **Aesthetic**: Refined, salon-inspired design with warm colors and elegant typography
- **Tech**: React 19 + TypeScript, Tailwind CSS v4, Lucide icons
- **i18n**: Full translations for English, Russian, and Polish
- **Responsive**: Mobile-first design (375px to 1024px+)

## File Location

**React Component**: `frontend/src/pages/MarketingLanding.tsx`

## Design Philosophy

### Typography
- **Display (Headlines)**: Cormorant - elegant serif font
- **Body (Paragraphs)**: DM Sans - clean, modern sans-serif
- **NOT using**: Generic fonts like Inter, Roboto, Arial

### Color Palette (oklch)
- **Warm Beiges/Creams**: Backgrounds (`oklch(0.98 0.01 45)` to `oklch(0.97 0.015 320)`)
- **Soft Pinks/Rose**: Accents and highlights (`oklch(0.75 0.15 330)`)
- **Deep Purple/Plum**: Primary CTAs (`oklch(0.65 0.25 330)` to `oklch(0.55 0.22 300)`)
- **Dark Charcoal**: Text (`oklch(0.20 0 0)` to `oklch(0.25 0 0)`)

### Animations
- **Fade In Up**: Staggered entry animations for hero content
- **Float**: Gentle floating background orbs
- **Shimmer**: Gradient shine effect on hover for primary buttons
- All animations use CSS-only for performance

## Integration Options

### Option 1: React SSR (Recommended for Dynamic Content)

If you need client-side interactivity and plan to add features like booking widgets later:

1. Set up Vite SSR or use a framework like Remix/Next.js
2. Serve the marketing page at `/` route
3. Preserve existing SPA routes (`/login`, `/register`, `/admin/*`)

### Option 2: Thymeleaf Templates (Recommended for Static Marketing)

For a purely static marketing page (as specified in Feature Brief):

**Steps to Convert React Component to Thymeleaf**:

1. **Extract HTML structure** from the TSX component
2. **Replace dynamic content** with Thymeleaf i18n syntax: `#{message.key}`
3. **Convert inline styles** to external CSS file
4. **Replace state management** with simple vanilla JS for FAQ accordion and language switcher

**Example Conversion**:

React:
```tsx
<h1>{t.hero.title}</h1>
```

Thymeleaf:
```html
<h1 th:text="#{hero.title}">Your AI Receptionist</h1>
```

### Translation Files

Create Spring MessageSource property files:

**messages_en.properties**:
```properties
nav.login=Log In
nav.signup=Sign Up
hero.title=Your AI Receptionist
hero.subtitle=Never Miss a Booking Again
hero.description=SlotMe transforms your salon...
# ... (continue for all content)
```

**messages_ru.properties**, **messages_pl.properties**: (Use translations from the React component)

## URL Structure

- `/` - English landing page (default)
- `/ru` - Russian landing page
- `/pl` - Polish landing page
- `/login` - Existing React SPA login page
- `/register` - Existing React SPA registration page

## Navigation Integration

All CTA buttons link to existing SPA routes:
- "Sign Up" / "Get Started" → `/register`
- "Log In" → `/login`

## Assets Needed

### Fonts (Already Loaded via Google Fonts CDN)
- Cormorant (300, 400, 500, 600, 700)
- DM Sans (400, 500, 600, 700)

### Images (To Be Created)
- Hero image/illustration (aspect ratio 4:3)
- Feature icons (already using Lucide icons, can replace with custom)
- Optional: Testimonial photos
- Optional: Background textures

### Icons
Currently using **Lucide React** icons:
- Sparkles (logo, features)
- Calendar (hero, features)
- Bell (features)
- MessageCircle (features)
- RefreshCw (features)
- BarChart3 (features)
- ChevronDown (FAQ accordion)
- Check (CTA section)

## Responsive Breakpoints

- **Mobile**: 375px - 767px (single column, stacked sections)
- **Tablet**: 768px - 1023px (2-column grids)
- **Desktop**: 1024px+ (3-4 column grids, full layouts)

## Accessibility Considerations

- Semantic HTML structure (nav, section, footer)
- Proper heading hierarchy (h1 → h2 → h3)
- Color contrast meets WCAG AA standards
- Keyboard navigation for FAQ accordion
- Focus states on all interactive elements
- Alt text placeholders for images (to be added)

## SEO Metadata (To Be Added)

For each language variant, include:

```html
<title>SlotMe - AI Virtual Receptionist for Beauty Salons</title>
<meta name="description" content="Transform your salon with an AI assistant that handles bookings 24/7 across WhatsApp, Messenger, and SMS. Never miss a client again.">
<meta property="og:title" content="SlotMe - AI Virtual Receptionist">
<meta property="og:description" content="...">
<meta property="og:image" content="/og-image.jpg">
<link rel="alternate" hreflang="en" href="https://slotme.ai/">
<link rel="alternate" hreflang="ru" href="https://slotme.ai/ru">
<link rel="alternate" hreflang="pl" href="https://slotme.ai/pl">
```

## Performance Optimizations

- Fonts loaded via Google Fonts CDN with `display=swap`
- CSS animations use `transform` and `opacity` for GPU acceleration
- No external JavaScript dependencies except React (for React version)
- Lazy load images below the fold
- Aggressive caching headers for static assets

## Next Steps

1. **Choose implementation approach**: React SSR vs. Thymeleaf
2. **Create/source hero image** and any custom graphics
3. **Finalize translation copy** with native speakers
4. **Set up backend routing** for `/`, `/ru`, `/pl`
5. **Add SEO metadata** and structured data
6. **Test multi-language switching** and URL routing
7. **Accessibility audit** and keyboard navigation testing
8. **Performance testing** (Lighthouse, Core Web Vitals)

## Development Preview

To preview the React component locally:

1. Create a new route in TanStack Router:
   ```typescript
   // frontend/src/app/routes/marketing.tsx
   import { createFileRoute } from '@tanstack/react-router'
   import MarketingLanding from '@/pages/MarketingLanding'

   export const Route = createFileRoute('/marketing')({
     component: MarketingLanding,
   })
   ```

2. Visit `http://localhost:3033/marketing` to see the live preview

## Production Deployment

For Thymeleaf implementation:
- Templates: `backend/src/main/resources/templates/marketing/`
- Static CSS/JS: `backend/src/main/resources/static/marketing/`
- i18n: `backend/src/main/resources/i18n/messages_*.properties`
- Controller: `backend/src/main/java/com/slotme/marketing/controller/MarketingController.java`

---

**Design Credits**: Created with frontend-design skill, focusing on distinctive editorial-luxury aesthetic appropriate for the beauty salon industry. Avoids generic AI template patterns through custom typography, unique color palette, and intentional animation choices.

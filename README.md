# Suraj Designs — Digital HQ

> Premium AI-powered web design for forward-thinking businesses.

A flagship website built to serve as both a portfolio and a business development tool. Every section is intentional — designed to convince business owners to book a discovery call.

## Tech Stack

- **HTML5** — Semantic, accessible markup
- **Vanilla CSS** — Design tokens, modular stylesheets
- **Vanilla JS** — Lightweight, no framework dependencies
- **Google Fonts** — DM Sans + Inter + JetBrains Mono
- **Netlify** — Deployment target

## Project Structure

```
/
├── index.html              # Single-page application entry
├── css/
│   ├── reset.css           # Box model & baseline reset
│   ├── tokens.css          # Design tokens (colors, type, spacing)
│   ├── base.css            # Body, containers, buttons, utilities
│   ├── nav.css             # Navigation component
│   ├── hero.css            # Hero section
│   ├── projects.css        # Featured projects grid
│   ├── why.css             # Why Work With Me + Services
│   ├── lab.css             # Website Lab + Process + Tech Stack
│   └── casestudy.css       # Case Study + FAQ + Booking + Footer
├── js/
│   ├── nav.js              # Scroll detection, drawer, active links
│   ├── animations.js       # Scroll reveals, cursor glow, parallax
│   ├── faq.js              # FAQ accordion
│   └── booking.js          # Time slot selection, form handling
├── assets/                 # Images, favicon, OG image
├── netlify.toml            # Netlify config (headers, caching, redirects)
├── robots.txt
└── sitemap.xml
```

## Sections

1. **Navigation** — Sticky, transparent → solid on scroll, mobile drawer
2. **Hero** — Editorial headline, ambient orbs, grid background, CTAs
3. **Featured Projects** — Interactive cards with hover overlay
4. **Why Work With Me** — Outcome-focused, 6-card grid
5. **Services** — 5 service cards with business value statements
6. **Website Lab** — Experimental product section with progress bars
7. **Process** — Numbered timeline, alternating layout
8. **Tech Stack** — Visual pipeline from Antigravity to Production
9. **Case Study** — Full editorial layout with sidebar metrics
10. **FAQ** — Accordion with 6 real client questions
11. **Discovery Call Booking** — Form + time slots, conversion-focused
12. **Footer** — Brand, navigation, social links

## Deployment

### Netlify (recommended)

1. Push this repo to GitHub
2. Connect repo to Netlify
3. Deploy settings: publish directory `/`, no build command
4. Live in ~60 seconds

### Local preview

Open `index.html` directly in a browser, or use a local server:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

## Future Integration

- **Supabase** — Contact form submissions + lead capture
- **Calendar API** — Calendly or native calendar for discovery calls
- **Analytics** — Plausible or PostHog (privacy-first)

## License

Private. All rights reserved — Suraj Designs.

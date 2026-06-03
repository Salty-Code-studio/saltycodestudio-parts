# Landing — SaaS

A complete, production-feel **SaaS marketing landing page** in a single HTML file. It composes the full marketing narrative — navigation, hero, social proof, product value, mechanics, pricing, testimonials, objections, and conversion — into one cohesive, responsive page.

Built with the **Tailwind Play CDN** and an inline config, so there is no build step: open `index.html` and it renders. The file *is* both the page and its own preview.

The demo brands it as **Tidewell**, a fictional product-analytics tool, with real, specific marketing copy (no lorem ipsum) so you can see how the layout reads when it's full.

## What's inside

| Section | Notes |
| --- | --- |
| **Sticky nav** | Brand `~<` logomark, desktop links, mobile sheet with animated hamburger, scroll elevation. |
| **Hero** | Eyebrow pill with live dot, large headline, dual CTAs, trust line, and a faux dashboard mock (KPI cards + inline SVG chart). |
| **Logo cloud** | Auto-scrolling, hover-pausable marquee of customer wordmarks. |
| **Feature bento** | Asymmetric 3-column grid mixing large, tall, and wide cards. |
| **How it works** | Dark band with a 3-step ordered list and a 4-up stats strip. |
| **Pricing** | Three tiers with a monthly/annual billing toggle that rewrites prices live. |
| **Testimonials** | One featured dark quote plus a mosaic of customer cards. |
| **FAQ** | Native `<details>` accordion with an animated chevron — works with zero JS. |
| **CTA band** | Email capture form on a teal panel with soft glow. |
| **Footer** | Four-column nav, social icons, legal row, auto-updating year. |

## Who it's for

- Founders and indie hackers who need a credible launch page **today**.
- Designers/devs who want a high-quality starting point to restyle, not a wireframe.
- Anyone assembling a marketing site from the `saltycodestudio-parts` library — this template is the showcase that ties the individual sections together.

## How to adapt / clone

1. **Copy** `index.html` anywhere and open it — no install, no tooling.
2. **Rebrand the palette** in one place: edit the `tailwind.config` block in `<head>`. The page uses semantic color names — `sand`, `ink`, `ocean`, `coral` — so changing those values reskins the whole page.
   - Default "Sand & Surf": sand/cream `#fbf7f0 · #f4ece0 · #ece0cd`, ink `#1c2b33` (soft `#4a5d66`), ocean teal `#1f8a8a` / deep `#0f5c5c` / surf `#2ec3c3`, accent coral `#ff6f59`.
3. **Swap fonts** via the Google Fonts `<link>` and the matching `fontFamily` keys (`display`, `mono`, `body`).
4. **Replace copy**: change "Tidewell", the headline, feature cards, pricing numbers, testimonials, and FAQ to your product. Pricing values live on `data-monthly` / `data-annual` attributes so the toggle keeps working.
5. **Wire it up**: point the nav links, the "Start free" buttons, and the CTA `<form>` at your real signup route or handler. The form currently calls `return false` so it doesn't navigate.
6. **Ship it**: for production you'll want to swap the Play CDN for a compiled Tailwind build (the CDN prints a console note and is not meant for production). The markup is standard Tailwind, so a normal build picks it up unchanged.

## Accessibility & polish

- Skip-to-content link, labelled landmarks, `aria-expanded`/`aria-controls` on the menu, `role="switch"` + `aria-checked` on the billing toggle, and SVG `role="img"` labels.
- Visible focus rings on every interactive element.
- All motion (marquee, scroll-reveal, smooth scroll) is disabled under `prefers-reduced-motion`, and every section is fully visible without JavaScript.

License: **MIT** · Source: saltycodestudio-parts (original)

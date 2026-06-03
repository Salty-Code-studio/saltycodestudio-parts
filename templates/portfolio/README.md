# Portfolio — template

A complete, runnable single-page **personal / creative portfolio**. One `index.html` file IS the page and its own preview — no build step, no dependencies. It loads Tailwind from the Play CDN and runs a small amount of vanilla JavaScript.

## What it is

A premium portfolio for a designer / creative developer, built around a clear narrative:

1. **Sticky nav** — logo, anchor links, "Let's talk" CTA, animated hamburger mobile menu (Escape to close, closes on tap), and scroll-spy that highlights the current section.
2. **Hero** — availability pill with a live ping, oversized headline with a hand-drawn underline, dual CTAs, mini stats, a floating illustrated portrait card, and a seamless looping marquee of disciplines.
3. **About** — positioning statement plus a 4-up grid of values / working principles with hover lift.
4. **Work** — a dark, case-study-feel showcase: one featured project with result metrics, then a 2×2 grid of projects. Every cover is inline SVG, so there are zero external image requests.
5. **Skills & services** — a numbered services list paired with a toolbox of tags and animated proficiency bars that fill when scrolled into view.
6. **Testimonial** — a single, credible pull-quote.
7. **Contact** — pitch + details + social links beside an accessible, validated demo contact form (no backend; shows a success state).
8. **Footer** — brand, nav, dynamic year.

Micro-interactions throughout: scroll-reveal on every block, header elevation on scroll, hover states on cards and links, animated underlines. Everything respects `prefers-reduced-motion`.

## Who it's for

- Designers, developers, photographers, writers, or any freelancer who needs a sharp one-pager.
- Anyone who wants a real, deployable site today and can edit HTML.
- A starting point for a fuller multi-page portfolio or a per-project case-study page.

## Brand

Themed in the "Sand & Surf" palette via an inline `tailwind.config`:

- **Surfaces** — `cream #fbf7f0`, `sand #f4ece0`, `dune #ece0cd`
- **Ink** — `ink #1c2b33`, `ink-soft #4a5d66`
- **Ocean** — `teal #1f8a8a`, `teal-deep #0f5c5c`, `surf #2ec3c3`
- **Type** — Space Grotesk (display), Inter (body), JetBrains Mono (labels)

## How to adapt / clone

1. **Copy the folder** (or just `index.html`) anywhere you like.
2. **Make it yours:** replace `Maya Solano`, the hero copy, the project cards (title, tags, blurb, metrics), the testimonial, and the contact details. Update the `<title>` and `<meta name="description">`.
3. **Recolor:** edit the `colors` block inside the inline `tailwind.config` in `<head>` — every class (`bg-teal`, `text-surf`, etc.) updates automatically.
4. **Swap project covers:** each card uses an inline `<svg>` placeholder. Drop in `<img>` tags with your real screenshots (keep the `work-cover` class for the hover-zoom).
5. **Wire up the form:** the form is a front-end demo. Point it at Formspree, Basin, a serverless function, or your own endpoint, or keep the `mailto:` as a fallback.
6. **Deploy:** any static host works — Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3. Drag the file in and you're live.

> Production tip: the Tailwind Play CDN is perfect for prototypes and small sites. For a high-traffic production site, install Tailwind as a build dependency (see the `starters/` in this library) to ship a smaller, purged stylesheet and self-host fonts.

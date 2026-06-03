# SEO & Performance

> **Local model: read this when you're building or auditing a page.** This is the
> non-negotiable layer that makes a site rank, load fast, and survive a Lighthouse
> run. Apply the checklists; copy the snippets; respect the budget at the bottom.

Two rules above everything:
1. **Ship semantic HTML first.** Effects from the parts bin go *on top* of correct
   markup, never instead of it.
2. **Every page is a budget.** If you add weight, remove weight somewhere else.

---

## 1. Semantic structure

One `<h1>` per page. Headings descend in order — never skip from `<h1>` to `<h3>`
for styling (size with CSS, not heading level).

Use landmarks so screen readers and crawlers map the page:

```html
<header>      <!-- site header / logo / nav -->
  <nav aria-label="Primary">…</nav>
</header>
<main>        <!-- exactly one per page, the unique content -->
  <article>…</article>   <!-- self-contained: blog post, product -->
  <section aria-labelledby="features-h">
    <h2 id="features-h">Features</h2>
  </section>
</main>
<aside>…</aside>          <!-- tangential: related links, sidebar -->
<footer>…</footer>
```

Checklist:
- [ ] Exactly one `<h1>`, headings in order, no levels skipped.
- [ ] One `<main>`; nav/header/footer outside it.
- [ ] Buttons that *do something* = `<button>`; things that *go somewhere* = `<a href>`. Never a `<div onclick>`.
- [ ] Every `<img>` has `alt` (empty `alt=""` if purely decorative).
- [ ] Form fields have a `<label for>`; icon-only controls get `aria-label`.
- [ ] Lists are `<ul>/<ol>/<li>`, not stacked `<div>`s.
- [ ] Color contrast ≥ 4.5:1 for body text (this is an SEO + a11y signal).

---

## 2. `<head>`: title, meta, Open Graph, Twitter

Title: 50–60 chars, primary keyword first, brand last. Meta description: 140–160
chars, written for a human to click (it's not a ranking factor, but it drives CTR).

```html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>Surf Lessons in Bonaire — Salty Surf Co.</title>
  <meta name="description"
        content="Private and group surf lessons on Bonaire's calm bays. Beginner-friendly, gear included, booked online in 60 seconds." />
  <link rel="canonical" href="https://example.com/lessons" />

  <!-- Open Graph (Facebook, LinkedIn, iMessage, Slack, WhatsApp) -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Surf Lessons in Bonaire — Salty Surf Co." />
  <meta property="og:description" content="Beginner-friendly lessons on calm bays. Gear included." />
  <meta property="og:url" content="https://example.com/lessons" />
  <meta property="og:image" content="https://example.com/og/lessons.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Surf Lessons in Bonaire — Salty Surf Co." />
  <meta name="twitter:description" content="Beginner-friendly lessons on calm bays. Gear included." />
  <meta name="twitter:image" content="https://example.com/og/lessons.jpg" />
</head>
```

Rules that catch most mistakes:
- **OG image is exactly 1200×630**, < 1 MB, with an **absolute** `https://` URL. Relative paths break previews.
- One `og:image` per page — a generic site-wide one is a wasted impression. Auto-generate per-page if you can.
- `canonical` on every page, pointing to the *one true* URL (no tracking params, consistent trailing slash).
- Do **not** add `<meta name="keywords">` — dead since ~2009, ignored by Google.
- Only add `<meta name="robots" content="noindex">` on pages you truly want hidden (thank-you pages, internal search results, staging).
- One language root: `<html lang="en">`. For NL/EN bilingual sites, add `hreflang` (see §4).

Checklist:
- [ ] Unique title + description on **every** page (no duplicates across the site).
- [ ] `<meta charset>` and `<meta viewport>` are the first two tags in `<head>`.
- [ ] OG + Twitter tags present; image is 1200×630 and absolute URL.
- [ ] `canonical` set and self-referencing.
- [ ] No accidental `noindex` shipped to production (the #1 silent traffic killer).

---

## 3. JSON-LD structured data

One `<script type="application/ld+json">` block in `<head>` or end of `<body>`.
Pick the type that matches the page. This is what powers rich results (stars,
breadcrumbs, FAQ accordions, sitelinks).

**Every site** — Organization (once, on the homepage):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Salty Surf Co.",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": ["https://instagram.com/saltysurf", "https://x.com/saltysurf"]
}
</script>
```

**Local business** (storefront, restaurant, studio) — adds map pin, hours, phone:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Salty Surf Co.",
  "telephone": "+599-700-0000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Kaya Grandi 1",
    "addressLocality": "Kralendijk",
    "addressCountry": "BQ"
  },
  "openingHours": "Mo-Sa 09:00-18:00"
}
```

Other common types: `Product` (+`Offer`/`AggregateRating` for shops),
`Article`/`BlogPosting` (author, datePublished), `BreadcrumbList`, `FAQPage`,
`Event`, `Person`.

Rules:
- Structured data must **describe content visible on the page** — fake ratings or hidden FAQ = manual penalty.
- Validate before shipping: search.google.com/test/rich-results and validator.schema.org.
- Don't ship `FAQPage`/`HowTo` expecting rich snippets — Google heavily restricted these in 2023; still useful for clarity, just not guaranteed stars.

Checklist:
- [ ] Organization (or LocalBusiness) JSON-LD on the homepage.
- [ ] Page-type schema (Product / Article / etc.) where it applies.
- [ ] Validated, no errors, matches visible content.

---

## 4. Sitemaps, robots, hreflang

**`/robots.txt`** (root). Allow everything, point to the sitemap:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /cart
Sitemap: https://example.com/sitemap.xml
```

Never `Disallow: /` on production. Don't try to hide a page from *indexing* with
robots.txt — blocked pages can still get indexed without content. Use a `noindex`
meta tag for that instead.

**`/sitemap.xml`** — list every canonical, indexable URL. Generate it; don't
hand-maintain.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-06-01</lastmod>
  </url>
  <url><loc>https://example.com/lessons</loc></url>
</urlset>
```

**Bilingual (NL/EN)** — declare alternates on every page, including a self-reference and `x-default`:

```html
<link rel="alternate" hreflang="nl" href="https://example.com/nl/lessen" />
<link rel="alternate" hreflang="en" href="https://example.com/en/lessons" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/lessons" />
```

Checklist:
- [ ] `robots.txt` present, not blocking the whole site, points to sitemap.
- [ ] `sitemap.xml` lists only 200-status canonical URLs (no redirects, no noindex pages).
- [ ] Sitemap submitted in Google Search Console.
- [ ] `hreflang` reciprocal + `x-default` on multilingual sites.

---

## 5. Core Web Vitals: LCP, CLS, INP

Google ranks on real-user (field) data. Three metrics, "good" thresholds:

| Metric | Measures | Good | Common cause when bad |
|--------|----------|------|------------------------|
| **LCP** | time to render the largest element (usually hero image/heading) | **≤ 2.5 s** | huge unoptimized hero image, render-blocking CSS/JS, slow server |
| **CLS** | layout shift / things jumping around | **≤ 0.1** | images without dimensions, late-loading fonts/ads, injected banners |
| **INP** | responsiveness to taps/clicks (replaced FID in 2024) | **≤ 200 ms** | heavy JS on the main thread, long event handlers |

**LCP fixes (highest leverage):**
- Identify the LCP element (Lighthouse tells you). It's almost always the hero image or headline.
- `<link rel="preload" as="image" href="hero.avif" fetchpriority="high">` the hero image.
- Never lazy-load the LCP image. `loading="eager"` + `fetchpriority="high"` on it; lazy-load everything *below* the fold.
- Inline critical CSS for above-the-fold; defer the rest.
- Self-host fonts; preconnect to any required third-party origin.

**CLS fixes:**
- Always set `width` + `height` (or `aspect-ratio`) on images, video, iframes, ads — so the browser reserves space.
- Use `font-display: swap` **with** a matched fallback (size-adjust) to avoid reflow on font load.
- Reserve space for anything injected (cookie bar, embeds) — give it a min-height.
- Never insert content above existing content after load.

**INP fixes:**
- Keep JS bundles small (see §8). Break long tasks; defer non-critical work.
- Debounce/throttle scroll & input handlers.
- Avoid hydrating the whole page if only a widget is interactive.
- Prefer CSS animations (compositor) over JS-driven layout animation.

Measure with: Lighthouse (lab), Chrome DevTools Performance panel, PageSpeed Insights
(shows field CrUX data), `web-vitals` JS library for real-user monitoring.

---

## 6. Image strategy

Images are usually 60–80% of page weight. This is the biggest single win.

**Format** (in order of preference):
- **AVIF** — best compression, use first. **WebP** — fallback. JPEG/PNG only as last resort.
- **SVG** for logos, icons, line art (sharp at any size, tiny).
- Never PNG for photos; never JPEG for flat-color graphics.

**Sizing & responsive** — serve the right size per device, never a 4000px image into a 400px slot:

```html
<img
  src="hero-800.avif"
  srcset="hero-400.avif 400w, hero-800.avif 800w, hero-1600.avif 1600w"
  sizes="(max-width: 768px) 100vw, 800px"
  width="1600" height="900"
  alt="Surfer on a calm bay at sunrise"
  fetchpriority="high" />        <!-- hero only -->
```

For art direction / format fallback use `<picture>`:

```html
<picture>
  <source type="image/avif" srcset="photo.avif" />
  <source type="image/webp" srcset="photo.webp" />
  <img src="photo.jpg" width="1200" height="800" alt="…" loading="lazy" decoding="async" />
</picture>
```

**Lazy loading:**
- Below the fold: `loading="lazy" decoding="async"`.
- Above the fold / LCP: `loading="eager" fetchpriority="high"` — **never lazy.**

Checklist:
- [ ] AVIF/WebP with fallback; SVG for icons/logos.
- [ ] `width` + `height` (or `aspect-ratio`) on every image → prevents CLS.
- [ ] `srcset` + `sizes` for anything that scales across breakpoints.
- [ ] Below-fold images lazy; hero eager + high priority.
- [ ] Hero compressed to a sane size (target < 200 KB for a full-width hero).
- [ ] Descriptive `alt` (or `alt=""` if decorative).

---

## 7. Font loading

Fonts block text rendering and cause layout shift. Tame them:

- **Self-host** (don't hit Google Fonts at runtime — extra DNS + connection + privacy). Download the `woff2`, serve from your own origin.
- **`woff2` only** — smallest, universally supported now.
- **Subset** to the characters/weights you actually use. A full font family is often 200 KB+; a Latin subset of 2 weights is ~30 KB.
- **Preload** the 1–2 critical fonts (the ones in the hero):

```html
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />
```

- **`font-display: swap`** so text shows immediately in the fallback, then swaps. Pair with `size-adjust`/`ascent-override` on the fallback to minimize the swap shift:

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
@font-face {                 /* metrics-matched fallback → near-zero CLS */
  font-family: "Inter Fallback";
  src: local("Arial");
  size-adjust: 107%;
  ascent-override: 90%;
}
body { font-family: "Inter", "Inter Fallback", sans-serif; }
```

- Prefer **one variable font** over loading 4 static weights.

Checklist:
- [ ] Self-hosted woff2, subsetted, ≤ 2 families.
- [ ] Critical font preloaded with `crossorigin`.
- [ ] `font-display: swap` + metrics-matched fallback.

---

## 8. Code-splitting & JS discipline

Less JavaScript is the most reliable performance win. Smaller models love to reach
for libraries — push back.

- **Ship HTML/CSS first.** Many "interactive" parts (accordions, carousels, tabs, reveals) have CSS-only versions in this bin — use them and ship **zero JS**.
- **No framework for a brochure site.** A 5-page marketing site does not need React. Vanilla + the parts bin is faster and ranks better.
- If using a framework:
  - **Route-level code-split** — each page loads only its own JS (`React.lazy`, dynamic `import()`, Next.js automatic splitting).
  - **Lazy-load heavy/below-fold widgets** (maps, video players, charts, the WebGL hero): dynamic-import on intersection or interaction.
  - **Defer third-party scripts** — analytics, chat widgets, embeds load `defer` or after `load`, never render-blocking in `<head>`.
- `defer` for your own scripts in `<head>`; `async` only for independent third-party tags.
- Tree-shake; check the bundle (`vite build` reports sizes, or `source-map-explorer`). Drop a dependency before adding one.
- A GSAP scroll effect is great — but load GSAP only on pages that use it, and gate motion behind `prefers-reduced-motion`.

Checklist:
- [ ] CSS-only solution chosen where one exists (no JS shipped for it).
- [ ] No SPA framework on a static marketing site.
- [ ] Per-route splitting; heavy widgets dynamically imported.
- [ ] Third-party scripts deferred/async, loaded after first paint.
- [ ] Own scripts use `defer`.

---

## 9. The performance budget

Hard limits for a marketing/landing page. If you blow one, cut something.

| Resource | Budget (mobile, initial load) |
|----------|-------------------------------|
| Total page weight | **≤ 1 MB** (stretch: ≤ 500 KB) |
| HTML | ≤ 100 KB |
| CSS | ≤ 75 KB |
| JS (parsed/executed) | ≤ 150 KB |
| Fonts | ≤ 100 KB total (≤ 2 families) |
| Largest single image | ≤ 200 KB |
| HTTP requests (initial) | ≤ 50 |
| Time to Interactive (mid-tier mobile, throttled) | ≤ 3.5 s |

Target scores:
- **Lighthouse Performance ≥ 90** (mobile, the harder test).
- **LCP ≤ 2.5 s · CLS ≤ 0.1 · INP ≤ 200 ms** in field data.
- Accessibility & Best Practices ≥ 95.

How to enforce:
- Run Lighthouse mobile on every page before "done" — not just the homepage.
- Throttle to "Slow 4G" + 4× CPU in DevTools; that's your real audience, not your laptop.
- Add a budget file to the build if the stack supports it (Lighthouse CI / `lighthouserc`, webpack/vite `performance.maxAssetSize`) so a regression fails the build.

---

## Final pre-ship checklist

- [ ] One `<h1>`, semantic landmarks, all images have `alt`.
- [ ] Unique title + meta description; canonical; OG 1200×630 + Twitter card.
- [ ] JSON-LD present and validated.
- [ ] `robots.txt` + `sitemap.xml` correct; no stray `noindex`.
- [ ] LCP image preloaded + eager; everything below fold lazy.
- [ ] All images have dimensions (no CLS); AVIF/WebP; responsive `srcset`.
- [ ] Fonts self-hosted, subsetted, preloaded, `font-display: swap`.
- [ ] JS minimized — CSS-only parts where possible, route-split, deferred 3rd-party.
- [ ] Lighthouse mobile ≥ 90; page weight under budget.

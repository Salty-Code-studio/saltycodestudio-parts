# saltycodestudio · Astro starter

A minimal but real **Astro + Tailwind** skeleton, pre-wired to the shared
[`saltycodestudio-parts`](../../) foundations (the _Sand & Surf_ design system).
Static-first, with React "islands" available for the interactive bits — and a
direct line to the parts library so you paste premium components instead of
hand-rolling them.

> Brand: **Sand & Surf** — _"Clean code, warm coast."_
> Warm Sand `#F2EBDD` · Deep Teal `#0E3A40` · Surf Coral `#FF6F59` ·
> Sky Blue `#4FA8C9` · Driftwood Ink `#1C2B2E`.

---

## Install & run

This starter lives _inside_ the parts repo at `starters/astro/`, and it
references the foundations by relative path (`../../foundations/…`). Run all
commands from this folder.

```bash
# from saltycodestudio-parts/starters/astro
npm install          # or: pnpm install / yarn

npm run dev          # dev server at http://localhost:4321
npm run build        # production build -> dist/
npm run preview      # preview the built site locally
```

> Node 18.17+ (or 20+) is recommended for Astro 4.

### Versions (known-good set)

| Package | Version |
|---|---|
| `astro` | ^4.16 |
| `@astrojs/tailwind` | ^5.1 |
| `tailwindcss` | ^3.4 (the foundations preset is **Tailwind v3**) |
| `@astrojs/react` + `react` / `react-dom` | ^3.6 / ^18.3 |

The foundations preset (`foundations/tailwind.preset.js`) is authored for
**Tailwind v3** (`rgb(var(--rgb-*) / <alpha-value>)`, CommonJS export). Don't
bump `tailwindcss` to v4 here without porting the preset.

---

## How it's wired

```
starters/astro/
├── astro.config.mjs      tailwind() (applyBaseStyles:false) + react()
├── tailwind.config.mjs    presets:[ ../../foundations/tailwind.preset.js ]
├── tsconfig.json          astro/strict + React 18 automatic JSX + @/* alias
├── public/favicon.svg
└── src/
    ├── styles/global.css  foundations layers interleaved with @tailwind
    ├── layouts/Base.astro html shell: SEO/OG meta slots, fonts, imports CSS
    ├── pages/index.astro  the hero
    └── components/
        └── Counter.tsx    example React island (safe to delete)
```

**The CSS order matters** (`src/styles/global.css`):

1. `tokens.css` — **before** `@tailwind`, so the preset can resolve its
   `--rgb-*` color channels.
2. `typography.css`, `palettes.css`
3. `@tailwind base / components / utilities`
4. `shadows.css`, `gradients.css`, `motion.css` — **after**, so their utility
   classes win the cascade.

We intentionally **skip `foundations/base.css`** — Tailwind's Preflight already
resets the page, so we set `tailwind({ applyBaseStyles: false })` and call
`@tailwind base` ourselves. Stacking two resets fights itself.

The brand vocabulary is then available everywhere:

```html
<section class="bg-sand text-ink">
  <h1 class="font-display text-teal">Clean code, warm coast.</h1>
  <button class="bg-coral text-white shadow-coral rounded-lg animate-fade-up">
    Start a project
  </button>
  <span class="text-teal/60 font-mono">since 2026</span>
</section>
```

Opacity modifiers (`text-teal/60`, `bg-coral/20`) work out of the box. The
`.anim-*` motion classes from `foundations/motion.css` also work alongside the
preset's `animate-fade-up` / `animate-shimmer` / `animate-marquee`.

---

## Using React islands

Astro renders components to **static HTML by default**. To make one
interactive, drop it in a `.astro` page/layout and add a `client:*` directive —
that ships JS for _just_ that component and hydrates it in the browser. The rest
of the page stays static.

```astro
---
// src/pages/index.astro
import Counter from "../components/Counter.tsx";
---
<Counter client:visible />   <!-- hydrate when scrolled into view -->
<Counter client:load />      <!-- hydrate immediately -->
<Counter client:idle />      <!-- hydrate when the browser is idle -->
<Counter client:media="(min-width: 768px)" />  <!-- hydrate at a breakpoint -->
```

Notes:
- React is already configured (`@astrojs/react`, React 18, automatic JSX
  runtime via `tsconfig.json`) — **no `import React`** needed in `.tsx`.
- In `.tsx` files use `className`; in `.astro` files use `class`.
- A working example lives in `src/components/Counter.tsx` and is referenced
  (commented out) in `src/pages/index.astro`.

---

## Pulling parts from the library

The whole point of the parts bin: don't generate fancy effects from scratch —
copy a finished, on-brand one.

1. **Find a part.** Browse [`../../INDEX.md`](../../INDEX.md) (every part in one
   table), open any `preview.html` to see it live, or skim
   [`../../components/react/`](../../components/react/) for `.tsx` islands.
   Each part folder has a `part.json` (name, tags, tier, `deps`, `files`) and a
   `README.md` with paste-in instructions.

2. **Copy it in.** Put React parts under `src/components/`:

   ```bash
   # from starters/astro
   cp -R ../../components/react/bento-grid/BentoGrid.tsx src/components/
   ```

   Then render it as an island:

   ```astro
   ---
   import BentoGrid from "../components/BentoGrid.tsx";
   ---
   <BentoGrid client:visible />
   ```

3. **Match the deps.** Check the part's `part.json` `deps`. Most React parts
   need only `react` + `tailwindcss` (already installed). Showcase parts may add
   one (e.g. a WebGL or motion lib) — install whatever it lists.

4. **It's already on-brand.** Parts use the same Sand & Surf utilities this
   starter ships, so they inherit colors/type/motion with no extra theming.
   `tailwind.config.mjs` already scans `../../components/**` so classes used
   inside copied parts are never purged — but for production you should copy the
   file into `src/` rather than import across the repo boundary.

> CSS-only or vanilla parts (`../../components/css`, `../../components/vanilla`)
> can be pasted straight into a `.astro` component's markup + `<style>`; no
> hydration needed.

---

## SEO / Open Graph

`Base.astro` takes props and emits canonical + Open Graph + Twitter meta:

```astro
---
import Base from "../layouts/Base.astro";
---
<Base
  title="Pricing"
  description="Simple, honest pricing."
  ogImage="/og/pricing.png"
  ogType="website"
  noindex={false}
>
  ...page...
</Base>
```

OG image URLs are made absolute against `site` in `astro.config.mjs` — set that
to your real domain before shipping. Use the named `head` slot for per-page
extras (JSON-LD, extra meta).

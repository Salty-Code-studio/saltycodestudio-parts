# Foundations

The base layer the rest of `saltycodestudio-parts` is built on: a reset, design
tokens, color palettes, typography, gradients, shadows, and motion — plus a
Tailwind preset that maps it all onto utility classes. Drop these in **once per
project**, then paste components from `components/` on top.

Everything is framework-agnostic and namespaced, so nothing collides with
Tailwind, a UI kit, or your own styles.

Brand: **Sand & Surf** — _"Clean code, warm coast."_
Palette: Warm Sand `#F2EBDD` · Deep Teal `#0E3A40` · Surf Coral `#FF6F59` ·
Sky Blue `#4FA8C9` · Driftwood Ink `#1C2B2E`.

---

## Every file in this folder

| File | What it provides | Vanilla | Tailwind |
|------|------------------|:------:|:--------:|
| **`tokens.css`** | Brand palette as both `--color-*` (hex) and `--rgb-*` (raw channels for alpha), plus spacing (`--space-*`), radius, z-index, container width, and breakpoint scales. The single source of truth every other layer reads. | ✅ | ✅ (required — the preset reads its `--rgb-*` channels) |
| **`base.css`** | Modern, opinionated CSS reset + global defaults: `box-sizing`, margin zero-out, fluid media, `:focus-visible` rings, form inheritance, brand text/background fallbacks. | ✅ | ❌ skip — Tailwind's Preflight already resets the page |
| **`typography.css`** | Fluid type system on a modular scale with `clamp()` (`--step--2`…`--step-6`), line-height/measure/tracking/weight tokens, base element defaults, and `.measure` / `.text-balance` / `.text-pretty` helpers. | ✅ | ✅ (use for base prose rhythm; or mirror the steps into the preset) |
| **`palettes.css`** | Five curated palettes (Sand & Surf + four alts) as `data-palette` / `data-mode` themes exposing nine **semantic** tokens (`--bg`, `--surface`, `--text`, `--primary`, `--ring`, …). Lets you re-skin a section by swapping one attribute. | ✅ | ✅ (consume the semantic tokens inside `@apply` or arbitrary values) |
| **`gradients.css`** | Curated gradient + mesh backgrounds and utilities on the palette: `.bg-gradient-sand`, `.mesh-gradient`, `.gradient-animated`, `.text-gradient`, `.gradient-border`. | ✅ | ✅ (plain utility classes — use alongside Tailwind) |
| **`shadows.css`** | Layered, ink-tinted elevation system: `--shadow-{sm…2xl}` tokens plus `.elevation-*`, `.surface-card`, and `.ring` helpers that read more "expensive" than a single drop shadow. | ✅ | ✅ (tokens + classes; or mirror into the preset) |
| **`motion.css`** | Easing curves (`--scs-ease-out-expo`, `--scs-ease-spring`, …), a duration scale, travel distances, eight reusable `@keyframes`, the `.anim-*` utility classes that play them, duration/delay/easing modifiers, and a `prefers-reduced-motion` kill-switch. Fully self-contained. | ✅ | ✅ (works as-is; the preset also exposes equivalent `animate-*` utilities) |
| **`tailwind.preset.js`** | Tailwind v3 preset wiring the tokens onto the theme — colors via `rgb(var(--rgb-*) / <alpha-value>)` (so `bg-coral/20` works), plus spacing, radius, shadows, and `animate-{fade-up,shimmer,marquee}` utilities. | — | ✅ (the Tailwind entry point) |
| **`palettes.md`** | Human docs for `palettes.css` — the five palettes, their tokens, and how to apply `data-palette` / `data-mode`. | reference | reference |
| **`font-pairings.md`** | Eight curated Google Fonts display/body pairings for `typography.css`, with the `<link>` tags and the two custom properties to override per pairing. | reference | reference |
| **`README.md`** | This file. | — | — |

> Each CSS file carries brand-fallback values inline, so any one of them is safe
> to drop in on its own. Loading `tokens.css` first makes the whole set
> coherent and lets the Tailwind preset resolve its color channels.

---

## Recommended `@import` order

Order matters — tokens must exist before anything consumes them, the reset must
land before component styles, and motion/utilities go last so they win the
cascade.

```css
/* foundations.css — your single project entry point */

@import "./foundations/tokens.css";       /* 1 · palette + scales (first!)   */
@import "./foundations/base.css";          /* 2 · reset + global defaults     */
@import "./foundations/typography.css";    /* 3 · type scale (needs tokens)   */
@import "./foundations/palettes.css";      /* 4 · semantic theme tokens       */
@import "./foundations/shadows.css";       /* 5 · elevation tokens + helpers  */
@import "./foundations/gradients.css";     /* 6 · gradient backgrounds        */
@import "./foundations/motion.css";        /* 7 · animation utilities (last)  */
```

Pick only what you need — every file is independent. For just motion:

```css
@import "./foundations/motion.css";
```

> **Bundler note:** native `@import` is fine for prototypes but blocks parallel
> downloads. For production with Vite / PostCSS, use `postcss-import` (inlines
> these at build time) or import each file from your JS/TS entry
> (`import "./foundations/tokens.css"`).

---

## Wiring it into a project

### Vanilla (plain HTML/CSS/JS, no build step)

Link the files in the `<head>` in the import order above, then your own
stylesheet last:

```html
<head>
  <!-- foundations -->
  <link rel="stylesheet" href="/foundations/tokens.css" />
  <link rel="stylesheet" href="/foundations/base.css" />
  <link rel="stylesheet" href="/foundations/typography.css" />
  <link rel="stylesheet" href="/foundations/palettes.css" />
  <link rel="stylesheet" href="/foundations/shadows.css" />
  <link rel="stylesheet" href="/foundations/gradients.css" />
  <link rel="stylesheet" href="/foundations/motion.css" />
  <!-- your styles -->
  <link rel="stylesheet" href="/styles.css" />
</head>
```

Then use the vocabulary directly in markup:

```html
<html data-palette="sand-surf" data-mode="light">
  <h1 class="text-gradient anim-fade-up dur-slow ease-spring">
    Clean code, warm coast.
  </h1>

  <ul class="stagger-children">
    <li class="anim-fade-up">First</li>
    <li class="anim-fade-up">Second</li>   <!-- one stagger step later -->
    <li class="anim-fade-up">Third</li>
  </ul>

  <article class="surface-card elevation-3">…</article>
</html>
```

### Tailwind

With Tailwind you **skip `base.css`** — Preflight already resets the page, and
stacking two resets fights itself. Bring in the preset plus the token/utility
layers.

1. Reference the preset from `tailwind.config.js`:

   ```js
   // tailwind.config.js  (CommonJS)
   module.exports = {
     presets: [require("./foundations/tailwind.preset.js")],
     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue,svelte}"],
     theme: { extend: {} }, // project overrides win over the preset
   };
   ```

   ```js
   // ESM projects
   import scsPreset from "./foundations/tailwind.preset.js";
   export default { presets: [scsPreset], content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue,svelte}"] };
   ```

2. Import the CSS layers around Tailwind. `tokens.css` **must** come before
   Tailwind so the preset can resolve its `--rgb-*` color channels:

   ```css
   /* app.css */
   @import "./foundations/tokens.css";        /* before: defines --rgb-* / --color-* */
   @import "./foundations/typography.css";
   @import "./foundations/palettes.css";

   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @import "./foundations/shadows.css";        /* after: utilities win the cascade   */
   @import "./foundations/gradients.css";
   @import "./foundations/motion.css";
   ```

   _(Tailwind v4: replace the three `@tailwind` lines with `@import "tailwindcss";`.)_

3. Use the brand utilities the preset adds — opacity modifiers included:

   ```html
   <section class="bg-sand text-ink">
     <button class="bg-coral text-white shadow-md rounded-lg animate-fade-up">
       Start a project
     </button>
     <span class="text-teal/60 font-display">since 2026</span>
   </section>
   ```

   The preset ships `animate-fade-up`, `animate-shimmer`, and `animate-marquee`.
   The `.anim-*` classes from `motion.css` also work as-is alongside Tailwind, so
   use whichever reads cleaner — the preset utilities for one-offs, the `.anim-*`
   modifier system (`dur-*`, `delay-*`, `ease-*`, `stagger-children`) when you
   need to retune timing.

---

## `motion.css` cheat sheet

**Enter animations** (start hidden, hold the finished frame):
`.anim-fade-up` · `.anim-fade-in` · `.anim-scale-in` · `.anim-blur-in` ·
`.anim-slide-in` (`+ .from-left|.from-right|.from-top|.from-bottom`).

**Ambient loops:** `.anim-shimmer` · `.anim-float` (`+ .pause-on-hover`) ·
`.anim-marquee` (`+ .reverse`, applied to a track holding **two identical groups**).

**Compose with modifiers:**
- Duration — `.dur-instant` `.dur-fast` `.dur-base` `.dur-slow` `.dur-slower` `.dur-slowest`
- Easing — `.ease-expo` `.ease-quart` `.ease-spring` `.ease-back` `.ease-in-out` `.ease-linear`
- Delay — `.delay-1` … `.delay-6`, or `.stagger-children` on a parent to auto-sequence its direct children (up to 8)
- Control — `.anim-fill-forwards` `.anim-loop` `.anim-paused`

**Retune one element** by overriding the vars inline — no new class needed:

```html
<div class="anim-slide-in"
     style="--scs-anim-duration: 500ms; --scs-travel-lg: 80px;">…</div>
```

Available custom properties: `--scs-ease-*`, `--scs-duration-*`,
`--scs-travel-{sm,md,lg}`, `--scs-blur-amount`, `--scs-stagger`, and the
per-element `--scs-anim-{duration,delay,ease}`.

**Accessibility:** every animation is wrapped in `@media (prefers-reduced-motion:
reduce)`. When a visitor asks for less motion, ambient loops stop and enter
animations jump straight to their visible end state — content is never stranded
at `opacity: 0`.

# Plain HTML + Tailwind starter — _no build_

A zero-tooling skeleton for **saltycodestudio** ("Sand & Surf"). Tailwind comes
from the Play CDN, the brand foundations load as plain stylesheets, and there's
a little vanilla JS for progressive enhancement. **It runs by double-clicking
`index.html`.** No npm, no bundler, no server.

```
plain-html-tailwind/
├── index.html        nav + hero + footer; inline tailwind.config with brand colors
├── assets/
│   ├── styles.css     project overrides + @import of the foundations
│   └── main.js        progressive enhancement (mobile nav, scroll reveal, year)
└── README.md          you are here
```

---

## 1 · How to open it

Easiest: **double-click `index.html`** (or drag it into a browser). That's it —
it works from the `file://` protocol.

Want live reload while you tinker? Any static server works, e.g. from this
folder:

```bash
# Python (built into macOS)
python3 -m http.server 8000
# then visit http://localhost:8000

# …or, if you have Node:
npx serve .
```

> **Heads-up:** the browser console will show a Tailwind notice —
> _"cdn.tailwindcss.com should not be used in production."_ That's expected for
> a no-build starter. See [§4](#4--the-build-step-later) for when to graduate.

---

## 2 · How it's wired

- **Tailwind** loads from `https://cdn.tailwindcss.com/3.4.16` (Play CDN, pinned
  to v3 so the inline `tailwind.config` object stays valid).
- The **inline `tailwind.config`** in `<head>` mirrors the brand palette and
  fonts from `../../foundations/tokens.css` + `../../foundations/tailwind.preset.js`,
  so the same color names work here as in the React/Tailwind parts:

  | Utility | Color | Use |
  |---|---|---|
  | `bg-sand` / `bg-sand-2` | `#F2EBDD` / `#EAE1CF` | page canvas / raised surface |
  | `text-teal` | `#0E3A40` | headings, body, the `~<` mark |
  | `text-ink` / `bg-ink` | `#1C2B2E` | deep text, dark footer |
  | `bg-coral` | `#FF6F59` | **one** CTA accent per view |
  | `text-sky` | `#4FA8C9` | supporting accent, tags |

  Fonts: `font-display` (Space Grotesk), `font-body` (Inter), `font-mono`
  (JetBrains Mono). Plus `shadow-coral` and `rounded-pill`.

- The **foundations** (`tokens`, `typography`, `palettes`, `shadows`,
  `gradients`, `motion`) load as `<link>`s in the right order. `base.css` is
  **deliberately skipped** — Tailwind's Preflight already resets the page.
- `assets/styles.css` re-`@import`s the same foundations (so it's self-
  sufficient) and holds **your overrides below them**, where they win the
  cascade.
- `assets/main.js` is optional sugar: the page is fully usable without it.

> **Brand-color edits:** because this is no-build, the brand hex values live in
> **two** places — the inline `tailwind.config` (here) and
> `../../foundations/tokens.css`. Change both, or move to the build step
> ([§4](#4--the-build-step-later)) where `tailwind.preset.js` keeps them in sync
> automatically.

---

## 3 · Dropping in parts

The parts bin lives two levels up. Browse `../../INDEX.md` (every part in one
table) or open any part's `preview.html` to see it live.

### Components — `../../components`

Four flavors; for this no-build file prefer **`vanilla/`** and **`css/`**
(they need no compiler). React parts (`.tsx`) won't run here without a build.

```
../../components/vanilla/   drop-in HTML/CSS/JS (modal, tabs, preloader, …)
../../components/css/        CSS-only effects (glassmorphism-card, marquee, …)
../../components/motion/     GSAP / scroll-driven (needs the GSAP <script> the part lists)
../../components/react/      .tsx — build step only
```

**To add a vanilla or CSS component:**

1. Open the part folder and read its `README.md`.
2. Paste its HTML where you want it in `index.html` (a good spot is the
   "CONTENT PLACEHOLDER" / `#work` section).
3. Link or paste its CSS. Either copy the part's stylesheet into `assets/` and
   add a `<link>`, or paste its rules into the overrides area of
   `assets/styles.css`.
4. If it ships JS, add a `<script src="...">` before `</body>` (after
   `main.js`), or fold it into `main.js`.
5. The part inherits the brand tokens automatically — it's already on-palette.

### Sections — `../../sections`

Full page blocks (hero variants, feature grids, pricing, footers). Same idea,
bigger: paste a section's markup between `<main>`'s existing `<section>`s in
`index.html`, then bring over its CSS/JS the same way as a component.

> If `../../sections` doesn't exist in your checkout yet, it's on the parts-bin
> roadmap — use `../../components` in the meantime, and check `../../INDEX.md`
> for what's currently shipped.

**Keep it on-brand:** one coral accent per view, sand + teal carry ~90% of the
layout, sky stays supporting. (See `../../foundations/palettes.md`.)

---

## 4 · The build step later

When the CDN warning starts to matter — production, custom Tailwind plugins,
purged/minified CSS, or you're tired of syncing hex values by hand — graduate
to a real Tailwind build. The foundations already ship the pieces for it.

1. **Init a project** in (a copy of) this folder:

   ```bash
   npm init -y
   npm install -D tailwindcss@3.4.16 postcss postcss-import autoprefixer
   npx tailwindcss init
   ```

2. **Point the config at the brand preset** (it reads the tokens directly, so
   colors stay in sync — no more double-editing hex):

   ```js
   // tailwind.config.js
   module.exports = {
     presets: [require('../../foundations/tailwind.preset.js')],
     content: ['./index.html', './assets/**/*.js'],
     theme: { extend: {} }, // project overrides win over the preset
   };
   ```

3. **Make a CSS entry point** that wraps Tailwind in the foundations
   (`postcss-import` inlines the `@import`s at build time):

   ```css
   /* assets/app.css */
   @import "../../foundations/tokens.css";       /* before: defines the color channels */
   @import "../../foundations/typography.css";
   @import "../../foundations/palettes.css";

   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @import "../../foundations/shadows.css";       /* after: utilities win the cascade */
   @import "../../foundations/gradients.css";
   @import "../../foundations/motion.css";
   ```

4. **Build the CSS:**

   ```bash
   npx tailwindcss -i ./assets/app.css -o ./assets/build.css --watch
   ```

5. **Swap the `<head>`:** delete the `cdn.tailwindcss.com` `<script>`, the
   inline `tailwind.config`, and the foundations `<link>`s, then link the
   compiled file instead:

   ```html
   <link rel="stylesheet" href="./assets/build.css" />
   ```

   Everything else — markup, classes, `main.js` — stays exactly the same.

> Going further (multi-page, components, routing)? The full studio site at
> `~/Desktop/saltycodestudio-site/` is the React + Vite + Tailwind reference.

---

_saltycodestudio — clean code, warm coast._

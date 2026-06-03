# Vite + React + Tailwind starter

A minimal but real starter for **saltycodestudio**, pre-wired to the shared
**Sand & Surf** foundations. Spin it up, then paste finished parts from the
library instead of hand-rolling effects.

Stack: **Vite 5 · React 18 · TypeScript 5 · Tailwind v3** (+ PostCSS,
Autoprefixer). Brand theme comes from `../../foundations/tailwind.preset.js`.

```
starters/vite-react-tailwind/
├── index.html            # loads brand fonts + #root; data-palette="sand-surf"
├── package.json          # pinned, mutually-compatible versions
├── vite.config.ts        # @vitejs/plugin-react, dev server on :5173
├── tsconfig.json         # bundler mode, strict, noEmit (Vite emits)
├── postcss.config.js     # tailwindcss + autoprefixer
├── tailwind.config.js     # presets: ['../../foundations/tailwind.preset.js']
└── src/
    ├── main.tsx          # React root + imports index.css
    ├── App.tsx           # a Sand & Surf hero (smoke test for the tokens)
    ├── index.css         # foundations @imports + @tailwind layers
    └── vite-env.d.ts     # Vite client types
```

---

## Install & run

```bash
# from this folder: starters/vite-react-tailwind/
npm install      # installs the pinned deps above
npm run dev      # Vite dev server → http://localhost:5173 (opens automatically)
```

Other scripts:

```bash
npm run build      # type-check (tsc -b) then production build to dist/
npm run preview    # serve the production build locally
npm run typecheck  # tsc --noEmit only
```

> If the hero renders Deep Teal text on a Warm Sand canvas with a Coral CTA,
> the chain `tokens.css → tailwind.preset.js → index.css` is wired correctly.

### Why these versions

The brand preset (`foundations/tailwind.preset.js`) is a **Tailwind v3
CommonJS** preset, so this starter pins **`tailwindcss@^3.4`** and uses the
`tailwindcss: {}` PostCSS plugin (not the v4 `@tailwindcss/postcss`). React 18
+ `@vitejs/plugin-react@4` + Vite 5 + TypeScript 5.6 are a tested, compatible
set. Don't bump Tailwind to v4 without porting the preset.

---

## How the brand theme is wired

1. **`index.html`** sets `data-palette="sand-surf" data-mode="light"` on
   `<html>` (read by `palettes.css`) and loads the three brand fonts:
   Space Grotesk, JetBrains Mono, Inter.
2. **`tailwind.config.js`** pulls the whole theme in via
   `presets: ['../../foundations/tailwind.preset.js']` and scans
   `../../components` + `../../sections` so pasted-in classes are never purged.
3. **`src/index.css`** imports the foundations in the required order
   (`tokens` → `typography` → `palettes` **before** `@tailwind`, then
   `shadows` → `gradients` → `motion` **after**). `base.css` is intentionally
   skipped — Tailwind's Preflight is the reset.

You get brand utilities out of the box, opacity modifiers included:

```tsx
<section className="bg-sand text-teal">
  <button className="bg-coral text-white shadow-coral rounded-pill animate-fade-up">
    Start a project
  </button>
  <span className="font-mono text-sky/70">~&lt; since 2026</span>
</section>
```

Palette: `sand` · `teal` · `ink` · `coral` · `sky` (+ `brand.*` aliases).
Fonts: `font-display` (Space Grotesk) · `font-sans`/`font-body` (Inter) ·
`font-mono` (JetBrains Mono). Animations: `animate-fade-up`, `animate-shimmer`,
`animate-marquee`, plus the `.anim-*` system from `motion.css`.

---

## How to pull PARTS

The whole point of this starter: don't generate fancy effects from scratch —
**reuse finished parts** from the sibling libraries.

- **`../../components/`** — individual components, grouped by stack:
  `react/` (`.tsx` + Tailwind), `css/` (CSS-only), `vanilla/` (HTML/CSS/JS),
  `motion/` (GSAP / scroll). This starter targets the **`react/`** parts.
- **`../../sections/`** — larger, page-level sections (hero, pricing, footer…)
  assembled from components. Same pull recipe as below. _(May be empty/early;
  `tailwind.config.js` already scans it so it's ready when parts land.)_

### Find a part

Open **`../../INDEX.md`** (every part in one table, with tags + path) or open
any part's **`preview.html`** in a browser to see it render. Each part folder
looks like:

```
components/react/<part-name>/
├── part.json      # name, tags, tier, deps, files
├── preview.html   # live preview
├── README.md      # paste-in instructions
└── <Source>.tsx   # the code to copy
```

### Pull recipe (React part)

Example: pulling **Gradient Mesh Hero**
(`components/react/gradient-mesh-hero/`).

1. **Read `part.json`** for its `deps` and `files`. Gradient Mesh Hero needs
   `framer-motion` beyond what this starter ships:

   ```json
   { "deps": ["react", "tailwindcss", "framer-motion"],
     "files": ["GradientMeshHero.tsx"] }
   ```

2. **Install any extra deps** the part lists (skip ones already here —
   `react`, `react-dom`, `tailwindcss` are pre-installed):

   ```bash
   npm install framer-motion
   ```

3. **Copy the source file(s)** into your app. A `components/` folder under
   `src/` keeps things tidy:

   ```bash
   mkdir -p src/components
   cp ../../components/react/gradient-mesh-hero/GradientMeshHero.tsx src/components/
   ```

4. **Import and render it**:

   ```tsx
   // src/App.tsx
   import GradientMeshHero from './components/components/GradientMeshHero';
   // (adjust the path to wherever you copied it)

   export default function App() {
     return <GradientMeshHero title="Clean code, warm coast." />;
   }
   ```

5. **Nothing else to configure.** Parts use the same brand utilities this
   starter already wires up, and `tailwind.config.js` scans the source folder,
   so the classes survive `npm run build`. Read the part's own `README.md` for
   any props or usage notes.

### Notes per stack

- **`react/` parts** — copy the `.tsx`, install its `deps`, import it. (Above.)
- **`css/` parts** — copy the CSS into `src/` and `@import` it from
  `index.css` _below_ the `@tailwind` layers, then add the documented classes.
- **`vanilla/` parts** — copy the markup into your JSX and the JS into a small
  module you call from `main.tsx` (or a `useEffect`).
- **`motion/` (GSAP) parts** — `npm install gsap` (+ any plugin the part
  lists), then follow the part's README; most register a ScrollTrigger.

> Tip: keep pulled parts under `src/components/` and `src/sections/` so your
> own code and library code stay separate and easy to update.

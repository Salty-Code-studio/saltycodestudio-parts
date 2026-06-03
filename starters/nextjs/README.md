# Next.js starter — saltycodestudio

A minimal but real **Next.js (App Router)** skeleton, pre-wired to the
saltycodestudio brand foundations. Sand & Surf palette, Space Grotesk / Inter /
JetBrains Mono, and the shared Tailwind preset are all hooked up — `npm install`,
`npm run dev`, and you're building on-brand from the first paint.

> Brand: **Sand & Surf** — _"Clean code, warm coast."_
> Stack: **Next 14.2 · React 18 · TypeScript 5 · Tailwind v3.4** (a mutually
> compatible, pinned set).

---

## Quick start

```bash
# from this folder: starters/nextjs/
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm run start        # serve the production build
npm run lint         # next lint
npm run typecheck    # tsc --noEmit
```

> Requires Node **>= 18.17** (Next 14).

---

## How it's wired to the foundations

This starter lives at `starters/nextjs/` inside `saltycodestudio-parts`, so the
shared foundations sit two levels up at `../../foundations/`. Three files connect
them:

1. **`tailwind.config.ts`** pulls in the brand theme via the required preset:

   ```ts
   import scsPreset from "../../foundations/tailwind.preset.js";
   const config: Config = { presets: [scsPreset as Partial<Config>], /* ... */ };
   ```

   That gives you `bg-sand`, `text-teal`, `bg-coral`, `text-sky`, `font-display`,
   `animate-fade-up`, the brand radii/shadows, etc. — opacity modifiers included
   (`text-teal/70`).

2. **`app/globals.css`** imports the CSS foundations around Tailwind's layers, in
   the README-prescribed order (tokens → typography → palettes **before**
   `@tailwind`, then shadows → gradients → motion **after**). `postcss-import`
   (configured in `postcss.config.mjs`) inlines them at build time. Note: we skip
   `base.css` because Tailwind's Preflight already resets the page.

3. **`app/layout.tsx`** loads the three brand fonts with `next/font/google`,
   exposes them as CSS variables, and maps them onto `font-display` / `font-sans`
   / `font-mono` in `tailwind.config.ts`. It also sets
   `data-palette="sand-surf" data-mode="light"` on `<html>` for `palettes.css`.

If you move this starter, fix the `../../foundations/...` paths in
`tailwind.config.ts` and the `../../../foundations/...` paths in
`app/globals.css` (globals.css is one level deeper, inside `app/`).

---

## How to pull parts

The rest of `saltycodestudio-parts` is a parts bin you copy from. The fastest
path:

1. **Find a part.** Browse `../../INDEX.md` (every part in one table) or open any
   `../../components/<category>/<part>/preview.html` in a browser.

2. **Copy the source into this app.** React/Tailwind parts (`.tsx`) drop into a
   local `components/` folder here:

   ```bash
   mkdir -p components
   cp -R ../../components/react/<part-name>/<file>.tsx components/
   ```

   Then import it from a page or layout:

   ```tsx
   // app/page.tsx
   import { ThatPart } from "@/components/<file>";
   ```

   The `@/*` alias (see `tsconfig.json`) points at the project root, and the
   `content` globs in `tailwind.config.ts` already scan `./components/**`, so the
   part's brand utilities compile with no extra setup.

3. **Read its README.** Each part ships a `README.md` next to the source with any
   dependencies and paste-in notes. Install any listed deps with `npm install`.

4. **Client vs server.** Parts that use hooks/state/animation libraries need
   `"use client"` at the top of the file (most interactive React parts already
   have it). Static parts can stay server components.

> Vanilla / CSS-only parts: copy their markup into a component and their CSS into
> `app/globals.css` (or a co-located CSS module). GSAP/motion parts: `npm install`
> their deps, then mark the component `"use client"`.

---

## Project layout

```
starters/nextjs/
├── app/
│   ├── globals.css      # foundations + Tailwind layers (import order matters)
│   ├── layout.tsx       # fonts + metadata + <html> palette attrs
│   └── page.tsx         # the hero
├── next.config.mjs
├── postcss.config.mjs   # postcss-import → tailwindcss → autoprefixer
├── tailwind.config.ts   # presets: ['../../foundations/tailwind.preset.js']
├── tsconfig.json        # strict, @/* alias
├── next-env.d.ts
├── .gitignore
└── package.json
```

---

## A note on versions

Tailwind here is **v3**, on purpose: the foundations preset uses the v3
`presets` array and the `rgb(var(--rgb-*) / <alpha-value>)` color syntax.
Upgrading to Tailwind v4 means rewriting both the preset and `app/globals.css`
(v4 replaces the three `@tailwind` directives with a single
`@import "tailwindcss";`). Keep the pinned set in `package.json` together.

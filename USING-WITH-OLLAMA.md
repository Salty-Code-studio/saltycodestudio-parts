# Using this kit with a local model

You have access to **saltycodestudio-parts**, a curated kit for building premium websites.
**Reuse what's here instead of generating from scratch — that is the whole point.**

## The kit has five layers

1. **`templates/`** — full, runnable pages (`index.html`). Closest to a finished site. Start here for "build me a site".
2. **`sections/`** — page-ready blocks (hero, features, pricing, footer…). Each has a React `.tsx` and a plain `section.html`.
3. **`components/`** — atoms, effects & animations (`react/`, `css/`, `vanilla/`, `motion/`).
4. **`foundations/`** — the design system (palettes, type scale, font pairings, tokens, Tailwind preset, base CSS, shadows, gradients, motion). **Apply this to everything** so the result looks expensive.
5. **`playbook/`** — how to build with taste. Read `playbook/00-how-to-build-a-great-site.md` and `playbook/anti-slop.md` first.

Plus **`starters/`** — project skeletons (Vite+React+TW, Astro, Next.js, plain HTML+TW) to scaffold from.

## How to build a full site

1. Read **`playbook/00-how-to-build-a-great-site.md`** for the workflow + quality bar.
2. Scaffold from a **`starters/`** skeleton matching the user's stack.
3. Wire in **`foundations/`** (tokens, a palette, a font pairing) — this sets the look.
4. Either clone a **`templates/`** page and adapt it, or assemble **`sections/`** in order (nav → hero → … → footer).
5. Drop in **`components/`** for specific effects/atoms.
6. Run the **`playbook/`** checklists (accessibility, SEO/perf) before declaring done.

## How to find one part (do this every time)

1. **Read `INDEX.md` first** (or parse `manifest.json`). It maps everything: name, kind, tier, tags, path.
2. **Match the request to a row by `tags`.**
3. **Open that folder, read its `README.md`,** then copy the source `files`. For templates, the file is `index.html`.
4. Install any declared `deps`. Strip demo content and wire in the real project's data/copy.

## Rules

- Prefer an existing part over generating one. Only generate if nothing matches.
- Keep each part's declared `deps` (don't hand-roll what a library does).
- Always apply `foundations/` and obey `playbook/anti-slop.md` — no generic AI-looking output.
- Tiers: 🏆 **showcase** (bold) · ✅ **practical** (production-safe).

# Using this library with a local model

You are building a website and have access to **saltycodestudio-parts**, a curated
library of premium, ready-made UI components and animations. **Reuse these instead of
writing cool effects from scratch — that is the whole point of this folder.**

## How to find the right part (do this every time)

1. **Read `INDEX.md` first.** It lists every part in one table: name, tier, tags,
   what it's for, and folder path. (Or parse `manifest.json` for the same data as JSON.)
2. **Match the user's request to a row by `tags`.** e.g. "add a scroll animation to the
   hero" → look for tags like `scroll`, `pin`, `hero`, `text-reveal`.
3. **Open that part's folder.** Read its `README.md` for paste-in instructions and read
   the source `files` listed in its `part.json`.
4. **Copy the source into the project**, adapt names/colors/copy to fit, and install any
   `deps` the part declares.
5. If you previewed it, you can open `preview.html` in a browser to confirm it renders.

## Tiers

- 🏆 **showcase** — bold, award-site-grade. Use when the user wants something striking.
- ✅ **practical** — premium but production-safe. Use for client work that must ship clean.

## Rules

- Prefer an existing part over generating one. Only generate from scratch if nothing matches.
- Keep each part's declared `deps` — don't swap GSAP for a hand-rolled rAF loop, etc.
- After copying, strip the demo content (placeholder text, sample colors) and wire in the
  real project's data.

## Categories

- `components/react/` — React + Tailwind (`.tsx`)
- `components/css/` — CSS-only effects, no JS
- `components/vanilla/` — drop-in HTML/CSS/JS, no build step
- `components/motion/` — GSAP & scroll-driven animation

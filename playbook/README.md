# Playbook — saltycodestudio

> **Local model: this is the design brain of the repo. Start here.** These docs tell
> you *how* to build a great site; the `components/` parts bin gives you the premium
> *pieces* to build it with. Read `00-how-to-build-a-great-site.md` first — it's the
> workflow that ties everything together — then pull in the topic doc you need.

Core principle of this whole repo: **assemble premium parts, do not hand-roll fancy
effects.** Smaller models are weak at WebGL/GSAP/physics — the parts already exist,
reach for them. The playbook keeps your *taste, structure, and performance* tight so
those parts land in a site that looks intentional and ships fast.

## Read in this order

| # | Doc | One-line summary |
|---|-----|------------------|
| 0 | [`00-how-to-build-a-great-site.md`](./00-how-to-build-a-great-site.md) | The end-to-end build workflow — read top to bottom once, then work its Build Order checklist; ties the parts bin + every other doc together. |
| 1 | [`layout-and-hierarchy.md`](./layout-and-hierarchy.md) | Arranging the page so the eye knows what matters first, second, third — grids, spacing, focal points, the structural backbone of an intentional layout. |
| 2 | [`typography.md`](./typography.md) | Choosing, pairing, sizing, and setting type — two fonts max, fluid scale, negative tracking on big type, ~66ch paragraphs; pairs with `foundations/typography.css`. |
| 3 | [`motion.md`](./motion.md) | When and how to animate — motion as a quiet bartender that points the eye and confirms actions, never a show; honor `prefers-reduced-motion`. |
| 4 | [`seo-and-performance.md`](./seo-and-performance.md) | The make-it-rank-and-load-fast layer — semantic HTML, title/meta/OG/Twitter, JSON-LD, sitemaps/robots, Core Web Vitals (LCP/CLS/INP), images, fonts, code-splitting, and a hard perf budget. |

## Then build with

| Resource | What it gives you |
|----------|-------------------|
| [`../foundations/`](../foundations/) | Design tokens, palettes, fonts, gradients, shadows, motion, and a Tailwind preset — the raw style system the playbook references. Start at `foundations/README.md`. |
| [`../INDEX.md`](../INDEX.md) | The full parts catalogue — 65 premium components (React, CSS-only, vanilla, GSAP motion) in one lookup table. Match by tag, copy the source. |
| [`../USING-WITH-OLLAMA.md`](../USING-WITH-OLLAMA.md) | How to wire this repo into a local model's system prompt so it reaches for finished parts instead of generating from scratch. |

## The 30-second loop

1. **Plan** with `00-how-to-build-a-great-site.md` (what sections, what hierarchy).
2. **Structure** the page using `layout-and-hierarchy.md` + semantic HTML from `seo-and-performance.md` §1.
3. **Style** with `foundations/` tokens, set type per `typography.md`.
4. **Assemble** premium pieces from `INDEX.md` — don't hand-roll effects.
5. **Animate** sparingly per `motion.md`.
6. **Harden** with the `seo-and-performance.md` pre-ship checklist (meta, OG, vitals, budget) before you call it done.

---
_saltycodestudio · "Clean code, warm coast." · Sand & Surf._

# How to Build a Great Site — Master Playbook

> **You are building a website with this repo.** This is the end-to-end workflow.
> Read it top to bottom once, then work the **Build Order** checklist at the bottom.
> The whole point of this repo: **assemble premium parts, do not generate fancy
> effects from scratch.** Smaller models are bad at hand-rolling WebGL, GSAP, and
> physics. This repo already did that work. Reach for it.

Companion file: read [`anti-slop.md`](./anti-slop.md) too. It lists the exact
patterns that make AI sites look cheap, and the fix for each. This playbook tells
you what to do; that file tells you what never to do.

---

## The repo in one diagram

```
foundations/   ← drop in ONCE per project (tokens, fonts, palette, motion)
components/     ← paste premium parts ON TOP (react / css / vanilla / motion)
INDEX.md        ← 65 parts in one table — your lookup. READ IT FIRST.
manifest.json   ← same data as JSON if you'd rather parse
```

Brand of the house system: **Sand & Surf** — _"Clean code, warm coast."_
Default palette `sand-surf`. Default everything is warm, coastal, generous with space.

---

## The workflow (5 moves)

### 1 — Pick a direction (palette + fonts), not a template
There is no "starter HTML" to clone. The starter IS the foundations layer plus a
chosen **palette** and **font pairing**. Pick those two first; they set the whole
mood before you write a line of markup.

- **Palette** (from `foundations/palettes.md`): `sand-surf` (default house),
  `midnight` (dark luxe / SaaS / fintech), `editorial` (warm paper, content-first),
  `neon-noir` (dev-tool / high-energy), `forest` (organic / wellness / hospitality).
  Apply with one attribute: `<html data-palette="midnight" data-mode="dark">`.
- **Fonts** (from `foundations/font-pairings.md`): 8 curated display+body pairs.
  Pick by vibe — Editorial (Fraunces+Inter), Modern-tech (Space Grotesk+Inter),
  Luxury (Cormorant Garamond+Jost), Clean-minimal (Sora+Inter), etc. Copy the
  `<link>` and override `--font-heading` / `--font-body`.

> Decide these from the brief. "Fintech dashboard" → `midnight` + Modern-tech.
> "Spa retreat" → `forest` + Luxury. "Coastal studio site" → leave it `sand-surf`.

### 2 — Wire in the foundations (once)
Import in this exact order (tokens must exist before anything reads them; motion
goes last so utilities win the cascade):

```css
@import "./foundations/tokens.css";     /* 1 palette + spacing/radius/z/shadow scales */
@import "./foundations/base.css";        /* 2 reset (SKIP if using Tailwind Preflight) */
@import "./foundations/typography.css";  /* 3 fluid type scale --step--2 … --step-6   */
@import "./foundations/palettes.css";    /* 4 semantic tokens: --bg --surface --text … */
@import "./foundations/shadows.css";     /* 5 teal-tinted elevation + .surface-card    */
@import "./foundations/gradients.css";   /* 6 .mesh-gradient, .text-gradient, …        */
@import "./foundations/motion.css";      /* 7 .anim-* utilities + reduced-motion guard  */
```

Tailwind project: reference `foundations/tailwind.preset.js`, **skip `base.css`**,
keep `tokens.css` before `@tailwind base`. (Full wiring in `foundations/README.md`.)

Now you have a vocabulary. **Use the tokens, never magic numbers:**
- Spacing: `var(--space-6)`, section rhythm `var(--space-section)`, gutter `var(--space-gutter)`.
- Color in components: always the **semantic** tokens — `var(--bg)`, `var(--surface)`,
  `var(--text)`, `var(--muted)`, `var(--border)`, `var(--primary)`, `var(--primary-fg)`,
  `var(--accent)`, `var(--ring)`. Never the raw brand hex inside a component.
- Type: heading sizes from the scale — `font-size: var(--step-5)` for a hero, never `48px`.
- Elevation: `.surface-card` + `.elevation-3`, not a hand-typed `box-shadow`.
- Motion: `.anim-fade-up`, modifiers `.dur-slow .ease-spring`, `.stagger-children` on lists.

### 3 — Compose the page out of sections, with a narrative
A premium site is a **sequence**, not a stack of boxes. Plan the section spine
before building (AIDA is a fine default):

```
Nav → Hero → Social proof → Problem/Value → Features → How it works
   → Proof (testimonials / metrics) → Pricing → FAQ → Final CTA → Footer
```

Give the page **rhythm**: alternate dense and airy, dark and light, wide and
narrow. Constrain text width with `var(--container-md)` / `--container-prose`
(68ch) so lines never run 6 deep. Separate sections with `var(--space-section)`,
not a 16px margin. **Vary the layout** section to section — see anti-slop.md;
do not left-text/right-image every single block.

### 4 — Drop in components + motion (don't hand-roll)
For each section, **match a part by tag in `INDEX.md`**, open its folder, read its
`README.md`, copy the source listed in `part.json`, then strip the demo content and
wire in real data. Keep each part's declared `deps` (don't swap GSAP for a homemade
rAF loop).

Fast tag map (full list in INDEX.md, 65 parts):

| Need | Reach for |
|------|-----------|
| Hero with motion | `gradient-mesh-hero`, `webgl-mesh-gradient-plasma`, `lamp-effect`, `layered-zoom-scroll` |
| Feature grid | `bento-grid`, `spotlight-card`, `feature-accordion` |
| Social proof | `logo-marquee`, `testimonial-carousel`, `animated-counter` |
| Pricing | `pricing-toggle`, `border-beam` (frame the featured tier) |
| Nav / chrome | `shrinking-sticky-navbar`, `command-palette`, `scrollspy-nav`, `macos-dock` |
| Scroll storytelling | `pinned-scroll-section`, `sticky-stacking-cards`, `horizontal-scroll-gallery`, `scroll-text-reveal`, `sticky-grid-scroll` |
| Micro-interaction | `magnetic-button`, `confetti-button`, `neon-glow-button`, `heart-like-burst`, `text-shimmer` |
| Texture / depth | `grain-noise-overlay`, `aurora-background`, `canvas-particle-field`, `tilt-card-3d` |
| Page polish | `preloader`, `scroll-progress-bar`, `custom-cursor`, `smooth-scroll`, `dark-mode-toggle` |

**Motion budget — be disciplined:**
- One signature moment per page (the hero, or one big scroll piece). Not five.
- Entrance animations once, on scroll-in. Ambient loops (marquee, float, aurora)
  used sparingly and never under reading text.
- Everything respects `prefers-reduced-motion` — the foundations already guard
  this; don't add raw `@keyframes` that ignore it.
- Showcase (🏆) parts are the spice; practical (✅) parts are the meal. A client
  site is mostly ✅ with one or two 🏆 accents.

### 5 — Run the checklists (below) before you call it done
Open `preview.html` of any part you used to confirm it renders. Then run the
Quality Bar and the pre-flight checklist. Fix every miss. Do not ship at 80%.

---

## The Quality Bar (what "premium" actually means)

A site clears the bar only if **all** of these are true:

**Typography**
- [ ] Real display + body pairing loaded (not the system font fallback).
- [ ] Clear hierarchy: hero uses `--step-5`/`--step-6`; body `--step-0`; sizes step down the scale, not arbitrary px.
- [ ] Body line length capped (~68ch / `--container-prose`). No 6-line-wide paragraphs.
- [ ] Headlines use `.text-balance`; paragraphs `.text-pretty`.

**Color**
- [ ] Exactly one accent (`--accent`/coral) used as a spice, not a field.
- [ ] 90% of the surface is `--bg` + `--surface` + `--text`. Calm, not a rainbow.
- [ ] Body text pairs clear WCAG AA (`--text` on `--bg`, `--muted` on `--bg`).
- [ ] Focus states use `--ring` with `outline-offset: 2px`.

**Layout & space**
- [ ] Sections separated by `--space-section`, generous and breathing.
- [ ] Layout varies down the page — not the same centered column every section.
- [ ] Content is aligned to a grid; intentional asymmetry, not accidental.
- [ ] Cards use `.surface-card` + tinted elevation, not flat even-gray boxes.

**Motion**
- [ ] One signature moment, the rest subtle. Nothing distracting under text.
- [ ] `prefers-reduced-motion` respected end to end.
- [ ] No element stranded at `opacity: 0` if JS/animation fails.

**Craft / content**
- [ ] Zero lorem ipsum, zero emoji-as-icons, zero placeholder logos shipped.
- [ ] Real copy, real (or clearly-art-directed) imagery, consistent icon set.
- [ ] Responsive at 360px, 768px, 1280px — nav, hero, and grids all hold.
- [ ] Hover/active/focus states on every interactive element.

If any box is unchecked, it is not premium yet. See `anti-slop.md` for the fix.

---

## Build Order checklist (work top to bottom)

1. [ ] Read the brief → choose **palette** + **font pairing** (move 1).
2. [ ] Read `INDEX.md` (or `manifest.json`) end to end so you know what exists.
3. [ ] Wire `foundations/` in import order; set `data-palette`/`data-mode` on `<html>`; load the font `<link>` and set `--font-heading`/`--font-body`.
4. [ ] Write the **section spine** (nav → hero → … → footer) as empty sections with `--space-section` rhythm and varied layouts.
5. [ ] Write **real copy** for every section first (headlines, value props, CTAs) — no lorem.
6. [ ] For each section, match a part by tag, copy from its folder, strip demo content, wire real data, keep its `deps`.
7. [ ] Add **one** signature motion moment; keep the rest as subtle scroll-in entrances.
8. [ ] Apply page polish (sticky nav, scroll progress, preloader/cursor only if the brand wants it).
9. [ ] Responsive pass at 360 / 768 / 1280; fix nav, hero, grids.
10. [ ] Run the **Quality Bar** + the `anti-slop.md` pre-flight. Fix every miss.
11. [ ] Open the relevant `preview.html` files to confirm parts render; ship.

---

## Hard rules (do not violate)

- **Reuse before you build.** Generate a part from scratch only if nothing in
  `INDEX.md` matches. Then it is a candidate to add to the library.
- **Tokens, not magic numbers.** Color, space, radius, type, shadow, motion all
  come from the foundations vocabulary.
- **Semantic color in components.** `--bg/--surface/--text/--primary/--accent/--ring`.
  Re-skinning a section must be one attribute swap, never a find-and-replace.
- **One accent per view.** Coral/neon is a jolt, never a background.
- **Generous space is the brand.** When unsure, add more whitespace, not more stuff.
- **Accessibility is not optional.** AA contrast, focus rings, reduced-motion, real alt text.

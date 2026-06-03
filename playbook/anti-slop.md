# Anti-Slop — the tells that make AI sites look cheap, and the fix

> **Read this before and after building.** These are the specific patterns that
> scream "an AI generated this." Each one has a concrete, opinionated fix using
> this repo's foundations and parts. If you catch yourself doing the left column,
> stop and do the right column.

Companion to [`00-how-to-build-a-great-site.md`](./00-how-to-build-a-great-site.md).

---

## 1. Centered-everything

**The tell:** every section is a centered column — centered heading, centered
paragraph, centered button — straight down the page. Reads like a slide deck.

**Why it's cheap:** no rhythm, no tension, no eye movement. Centered text is also
harder to read past two lines.

**Fix:**
- Left-align body copy and most headings. Center is for short hero lines and the
  occasional pull-quote — not paragraphs.
- **Vary layout per section:** left-text/right-media, then full-bleed, then a
  two-column asymmetric split, then a centered statement, then a bento. Never the
  same shape twice in a row.
- Use the grid and containers: `--container-md` for prose, wider for media.
- Build asymmetry on purpose (e.g. `bento-grid` — uneven tiles read intentional).

---

## 2. Default system font

**The tell:** everything is in the OS sans (San Francisco / Segoe / Arial). The
`--font-heading` / `--font-body` overrides were never set, or the `<link>` is missing.

**Why it's cheap:** the single fastest signal of "unstyled / template." No brand voice.

**Fix:**
- Load a pairing from `foundations/font-pairings.md` — copy the `<link>`, set both
  custom properties. Pick by vibe (Editorial = Fraunces+Inter, Luxury = Cormorant
  Garamond+Jost, Modern-tech = Space Grotesk+Inter, Clean-minimal = Sora+Inter).
- **Display face for headlines, neutral body face for reading.** Contrast, not conflict.
- Limit to 2–3 weights total. More weights ≠ more premium; it's just slower.
- Let the heading carry the personality; the body face should "disappear."

---

## 3. Even-gray cards / flat boxes

**The tell:** feature grid of identical light-gray rounded rectangles, each with
the same flat `box-shadow: 0 2px 4px rgba(0,0,0,.1)`.

**Why it's cheap:** neutral-black shadows look muddy, and identical cards read as
a spreadsheet, not a design.

**Fix:**
- Use `.surface-card` + a **teal-tinted** elevation (`.elevation-3`, `.elevation-4`).
  The foundations shadows are tinted with Deep Teal, never neutral black — they
  read "expensive."
- Surfaces from `var(--surface)`, borders from `var(--border)` (a real hairline).
- Add hover life: `.elevation-interactive`, or a `spotlight-card` / `tilt-card-3d` /
  `hover-glow-border` for a featured card. The featured tier can wear a `border-beam`.
- **Break the grid uniformity:** make one card larger (bento), or give the primary
  one the accent treatment. Identical-everything is the slop.

---

## 4. No whitespace (cramped)

**The tell:** sections jammed together with ~16–24px gaps; content edge-to-edge;
the page feels like a brochure with no air.

**Why it's cheap:** density without hierarchy reads as low-budget. Space is what
signals confidence and premium.

**Fix:**
- Separate sections with `var(--space-section)` (`clamp(4rem, 9vw, 8rem)`), never
  a hand-typed small margin.
- Page side gutters from `var(--space-gutter)`.
- Give the hero room to breathe — big top/bottom padding, one idea, not five.
- When a section feels off, the answer is almost always **more whitespace, fewer
  elements**, not a new color or effect.

---

## 5. Rainbow gradients

**The tell:** purple→pink→blue hero gradient, multi-color buttons, gradient text
on gradient background. The "2021 AI startup" look.

**Why it's cheap:** unfocused, dates instantly, fights legibility, and has no tie
to the brand palette.

**Fix:**
- Backgrounds come from `foundations/gradients.css`, built on the palette:
  `.mesh-gradient--sand`, `.mesh-gradient--ocean`, `.bg-gradient-tide`, etc.
  Tonal, within one palette family — not a rainbow.
- **One accent per view.** Coral (or the palette's `--accent`) is a single jolt:
  the primary CTA, one underline, one highlight. Never a full-bleed field.
- Want a living background? Use a curated part — `aurora-background`,
  `webgl-mesh-gradient-plasma`, `gradient-mesh-hero` — they stay on-palette.
- Gradient text only on a short headline (`.text-gradient`), never on body copy.

---

## 6. Emoji as icons

**The tell:** 🚀 ⚡ 🔒 ✨ as feature/section icons.

**Why it's cheap:** emoji render differently per OS, can't be recolored, don't
align to a grid, and look like a placeholder that shipped.

**Fix:**
- Use one consistent SVG icon set (line or solid — pick one, stay consistent),
  sized and colored with `currentColor` so they inherit the text/accent token.
- If no icon system is available, prefer a small numeral, a hairline rule, or a
  tinted shape over an emoji.
- Keep stroke width and corner radius consistent across every icon. A mixed icon
  set is its own slop tell.

---

## 7. Lorem ipsum

**The tell:** "Lorem ipsum dolor sit amet" in headings or cards; placeholder
button labels like "Button" / "Learn more" everywhere; `[Company Name]` left in.

**Why it's cheap:** signals unfinished, breaks layout (real copy is a different
length), and makes hierarchy untestable.

**Fix:**
- **Write real copy first**, before building sections (build step 5). Specific
  headlines, concrete value props, distinct CTA verbs ("Start a project", "See the
  work", "Get the quote" — not three "Learn more").
- After copying any part, **strip its demo content** and wire in the real data —
  that step is in the part workflow for a reason.
- No `[bracketed]` placeholders or sample logos in shipped output.

---

## 8. Identical card grids

**The tell:** 3×3 (or 4×) grid of perfectly equal cards, equal text length, equal
icon, equal everything. Every "Features" section looks the same.

**Why it's cheap:** zero hierarchy — nothing says what matters most — and it's the
single most templated AI layout.

**Fix:**
- Use a **bento** instead of an even grid: different tile sizes encode importance
  (`bento-grid`). The hero feature gets the big tile.
- Vary content length on purpose; let some cards be text-only, one carry an image
  or a stat (`animated-counter`).
- For a "how it works" flow, use a **sequence** (`sticky-stacking-cards`,
  `scroll-text-reveal`, `svg-line-draw-on-scroll`) rather than a static grid.
- If a grid is genuinely right, give one cell the accent/featured treatment so the
  eye has somewhere to land.

---

## Bonus tells (catch these too)

- **Hover-state amnesia:** interactive elements with no hover/active/focus change.
  Add them — `magnetic-button`, `neon-glow-button`, `.elevation-interactive`,
  and always a `--ring` focus state.
- **Stock-everything imagery:** generic handshake/laptop stock photos. Prefer
  art-directed, on-palette, or textured imagery; add `grain-noise-overlay` to make
  flat images feel intentional.
- **Dead-flat backgrounds:** a single hex fill behind everything. Add subtle depth
  — a tonal mesh, grain, or `aurora-background` (kept well behind text).
- **Motion overload:** five competing animations. One signature moment; the rest subtle.
- **Tiny cramped type / huge thin type:** body below ~16px, or a hairline-weight
  giant headline. Use the type scale (`--step-*`) and sensible weights.
- **Centered nav with a logo island:** vary it — logo left, links/CTA right
  (`shrinking-sticky-navbar`).

---

## Pre-flight (run before shipping — every box must be checkable)

- [ ] Body copy left-aligned and capped near 68ch; layout varies section to section.
- [ ] A real font pairing is loaded (not the system fallback).
- [ ] Cards use `.surface-card` + tinted elevation, with hover states — not flat gray boxes.
- [ ] Sections breathe at `--space-section`; the page has air.
- [ ] Backgrounds are on-palette/tonal; exactly one accent used as a spice.
- [ ] No emoji icons — one consistent SVG set inheriting `currentColor`.
- [ ] Zero lorem / placeholder copy / sample logos; all demo content stripped from copied parts.
- [ ] No dead-equal card grid where a bento or sequence would carry hierarchy.
- [ ] Every interactive element has hover + focus (`--ring`) states.
- [ ] `prefers-reduced-motion` respected; nothing stranded at `opacity: 0`.

If you can't check a box, you found slop. Fix it before you ship.

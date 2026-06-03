# Typography

How to choose, pair, size, and set type for a saltycodestudio site. Opinionated.
Pairs with `foundations/typography.css` (the fluid scale + tokens) and
`foundations/font-pairings.md` (eight ready-to-use Google Fonts combos).

> TL;DR: Two fonts max. One display, one body. Body must disappear. Big type
> goes negative tracking + tight leading. Cap every paragraph at ~66ch. Use the
> `--step-*` scale — never hand-pick pixel sizes.

---

## 1. Choosing fonts

Don't audition fonts in a vacuum. Pick the **vibe first**, then take the matching
pairing straight from `foundations/font-pairings.md`. They're pre-tuned to the
fluid scale, so you skip the hard part.

| If the site should feel… | Use pairing | Display / Body |
|---------------------------|-------------|----------------|
| Editorial, premium long-form | 1 | Fraunces / Inter |
| Smart software, SaaS, dev tool | 2 | Space Grotesk / Inter |
| Warm, friendly, consumer | 3 | Poppins / Work Sans |
| Luxury, fashion, beauty | 4 | Cormorant Garamond / Jost |
| Bold, graphic, agency | 5 | Archivo / Archivo Narrow |
| Classic, finance, professional | 6 | Playfair Display / Source Sans 3 |
| Calm, minimal, studio | 7 | Sora / Inter |
| Technical, docs, dashboards | 8 | IBM Plex Sans / IBM Plex Mono |

**Rules for choosing:**

- **Inter is the safe body default.** When unsure which body face, use Inter. It
  is invisible in the best way. The personality belongs in the headline.
- **Don't pick a font because it's trendy.** Pick it because it matches the
  content's tone. A law firm in Space Grotesk lies to the visitor.
- **Serif display = trust/editorial. Geometric sans display = modern/tech.
  Rounded sans = friendly.** This mapping is reliable; start there.
- **System fonts are a legitimate choice** for fast, utilitarian UI. The fallback
  stack in `typography.css` already looks good with zero web-font load.

### Don't
- Don't use more than 2 families (3 only if one is a mono for code/data).
- Don't use a display face for body text — high-contrast serifs and quirky sans
  faces get tiring after two sentences.
- Don't pick two fonts that are too similar (two humanist sans = muddy, looks
  like a mistake). Contrast is the point.

---

## 2. Pairing fonts

A pairing works when there is **contrast without conflict**. The two faces should
look like they were chosen together, not fighting.

**Three pairing formulas that always work:**

1. **Serif display + sans body** — the classic. Fraunces/Inter, Playfair/Source
   Sans. Editorial, trustworthy.
2. **Characterful sans display + neutral sans body** — Space Grotesk/Inter,
   Sora/Inter. Modern, calm.
3. **One superfamily, two cuts** — Archivo/Archivo Narrow, IBM Plex Sans/Mono.
   Cohesive and disciplined; tension comes from weight/width, not contrast.

**Checklist for a good pair:**
- [ ] Body face has a generous x-height (stays readable small). All eight
      pairings already do.
- [ ] Display and body clearly differ in role — you can tell headline from body
      at a glance.
- [ ] You're loading only the weights you use (see §6).
- [ ] Fallbacks are set so layout doesn't shift before fonts load (the pairing
      blocks ship sensible fallbacks already).

To apply a pairing, override the two custom properties — that's the entire
integration:

```css
:root {
  --font-heading: "Space Grotesk", system-ui, sans-serif;
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

Everything in `typography.css` reads from these, so headings and body update
everywhere automatically.

---

## 3. The type scale

Use the **fluid scale already defined** in `typography.css`. It interpolates from
a Major Third (1.25) on mobile to a Perfect Fourth (1.333) on desktop using
`clamp()`, so nothing jumps at breakpoints. Don't invent your own sizes.

| Token | Role | Lands at (mobile → desktop) |
|-------|------|------------------------------|
| `--step--2` | fine print, captions | 0.69 → 0.80rem |
| `--step--1` | labels, metadata, small UI | 0.83 → 1.0rem |
| `--step-0` | **body baseline** | 1.0 → 1.25rem |
| `--step-1` | lead paragraph | 1.2 → 1.56rem |
| `--step-2` | h4 / small headings | 1.44 → 1.95rem |
| `--step-3` | h3 | 1.73 → 2.44rem |
| `--step-4` | h2 | 2.07 → 3.05rem |
| `--step-5` | h1 | 2.49 → 3.81rem |
| `--step-6` | display / hero | 2.99 → 4.77rem |

**How to use it:**
- Semantic elements (`h1`…`h6`, `p`, `small`) already map to the right step. Just
  write correct HTML and you get the scale for free.
- For one-off sizing without a semantic element, use the helper classes:
  `.text-step-4`, `.text-step--1`, etc.
- For a hero headline bigger than `h1`, use the `.display` class (it's `--step-6`
  with the right tracking and leading baked in).

**Rules:**
- **Body never goes below `--step-0`** (1rem) for primary reading text. Smaller is
  for labels and captions only.
- **Skip steps for emphasis.** A page reads better when h1 (`--step-5`) and body
  (`--step-0`) are far apart and the in-between steps are used sparingly. Don't
  make everything mid-sized — that's the "wall of grey" look.
- **Keep `html { font-size: 100% }`.** The scale is responsive on its own; don't
  hack the root size, it breaks user zoom/accessibility.

---

## 4. Measure (line length)

The single highest-leverage typography fix. Lines that run too wide are
exhausting; the eye loses its place on the return sweep.

- **Target ~66 characters per line** for body. This is `--measure` (the default
  cap on every `<p>`).
- Variants: `--measure-narrow` (48ch) for sidebars/captions/cards,
  `--measure-wide` (78ch) when you genuinely need density.
- Apply with the utility classes: `.measure`, `.measure-narrow`, `.measure-wide`,
  or `.measure-none` to remove the cap.

```html
<article class="flow">
  <h2>A readable column</h2>
  <p>This paragraph is capped at ~66ch automatically.</p>
  <p class="measure-narrow">A tighter aside or pull-quote.</p>
</article>
```

**Rules:**
- **Never let body text span a full wide desktop container.** A 1200px-wide
  paragraph is a bug, not a layout. Cap it.
- Centered text only for short blocks (a tagline, a single sentence). Never
  center a paragraph — ragged left edges kill readability.

---

## 5. Line-height, weight, tracking

These three turn "technically correct" type into type that looks intentional.

### Line-height (leading)
Inverse relationship with size: **big type tight, small type loose.**

| Token | Value | Use on |
|-------|-------|--------|
| `--leading-tight` | 1.1 | display / hero headlines |
| `--leading-snug` | 1.2 | headings |
| `--leading-normal` | 1.6 | body copy |
| `--leading-loose` | 1.75 | long-form articles |

- Body at 1.5–1.6 is the comfortable reading zone. 1.6 is the default — keep it.
- A hero at 1.6 looks like loose, accidental spacing. Drop big type to ~1.1.
- Utilities: `.leading-tight`, `.leading-snug`, `.leading-normal`, `.leading-loose`.

### Weight contrast
Hierarchy comes from **weight jumps**, not just size.

- Use the tokens: `--weight-regular` (400), `--weight-medium` (500),
  `--weight-semibold` (600), `--weight-bold` (700).
- **Body 400, headings 600–700.** That gap reads as clear hierarchy.
- **Don't use weights below 300 on body text** — thin type fails on low-quality
  screens and for low-vision users.
- Avoid going from 400 straight to 900 unless the brand is loud/brutalist — it
  can look unbalanced. One or two steps of contrast usually reads richer.

### Tracking (letter-spacing)
- **Big type wants negative tracking.** `--tracking-tight` (-0.02em) on headings,
  `--tracking-tighter` (-0.04em) on display. Default-spaced large type looks
  loose and amateur.
- **Body stays at 0** (`--tracking-normal`). Never track body text.
- **Small uppercase labels want positive tracking.** Eyebrows/overlines use
  `--tracking-wider` (0.08em) so the caps breathe — the `.eyebrow` class does
  this for you.

```html
<p class="eyebrow">Case study</p>
<h2 class="tracking-tight">Tightened so it feels deliberate</h2>
```

---

## 6. When to go big

Big type is a tool for **focus and confidence**, not decoration. Use it to make
one thing unmistakably the most important element on the screen.

**Go big when:**
- It's the hero's main statement. One headline at `.display` (`--step-6`), short.
- It's a single number or stat you want to land ("$2.4M saved", "10x faster").
- It's a section opener that needs to reset the reader's attention.

**Make big type work:**
- Keep it **short** — 2 to 6 words. Big type wrapping to four lines is a wall, not
  a statement. Use `text-wrap: balance` (already on headings and `.display`) so
  the lines distribute evenly.
- Pair big with **tight leading + negative tracking** (see §5). This is the
  difference between "big" and "expensive".
- Surround it with **whitespace.** Big type needs room. Crowding it cancels the
  effect.

**Don't go big when:**
- Everything is big. If three things shout, nothing is heard. One focal size per
  viewport.
- It's body or explanatory copy. Length + big size = unreadable.

---

## 7. Practical defaults & polish

`typography.css` already enables these — don't undo them:

- `text-wrap: balance` on headings (even line distribution, no orphaned words).
- `text-wrap: pretty` on paragraphs (avoids single-word last lines).
- `font-feature-settings: "kern" "liga" "calt"` (proper kerning + ligatures).
- `text-rendering: optimizeLegibility` and antialiasing for crisp retina text.
- `.nums-tabular` for numbers in tables/dashboards so digits align in columns.
- `.truncate` (one line + ellipsis) and `.line-clamp` (set `--lines`) for cards.

**Vertical rhythm:** wrap stacked text blocks in `.flow` to get consistent
spacing (`--flow-space`, 1.25em) between children instead of fighting margins.

---

## Quick checklist (ship this)

- [ ] Exactly 2 font families (+1 mono only if needed for code/data).
- [ ] Body is a neutral, high-x-height face; personality is in the display face.
- [ ] Sizes come from the `--step-*` scale, not hand-picked pixels.
- [ ] Every paragraph capped at `--measure` (~66ch).
- [ ] Body line-height 1.6; headings 1.1–1.2.
- [ ] Body weight 400, headings 600–700 (clear weight contrast).
- [ ] Headings use `--tracking-tight`; display uses `--tracking-tighter`; body 0.
- [ ] Eyebrows/labels are small, uppercase, `--tracking-wider`.
- [ ] One focal "big" element per viewport — short, with whitespace around it.
- [ ] Only the weights you actually use are loaded.
```
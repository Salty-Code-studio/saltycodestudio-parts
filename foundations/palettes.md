# Palettes

Five curated, production-ready color systems for saltycodestudio, shipped as
CSS custom-property themes in [`palettes.css`](./palettes.css). Every palette
defines a **light** and **dark** variant and the same nine **semantic tokens**,
so components can be styled once and re-skinned by swapping a single attribute.

## How to apply

Set `data-palette` (and optionally `data-mode`) on any element. The nearest
ancestor wins, so palettes can scope to a whole page or a single section.

```html
<!-- Whole document, brand palette, light -->
<html data-palette="sand-surf" data-mode="light"> … </html>

<!-- A section overrides the page palette -->
<section data-palette="midnight" data-mode="dark"> … </section>
```

- **Light is the default.** Add `data-mode="dark"` to flip.
- **Omit `data-mode`** to follow the operating system via `prefers-color-scheme`.

Always consume the **semantic tokens** in component CSS — never the raw brand
values, which are implementation details and may change.

```css
body  { background: var(--bg);   color: var(--text); }
.card { background: var(--surface); border: 1px solid var(--border); }
.btn  { background: var(--primary); color: var(--primary-fg); }
.btn:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
a     { color: var(--accent); }
small { color: var(--muted); }
```

### Semantic token contract

| Token          | Role                                                            |
| -------------- | --------------------------------------------------------------- |
| `--bg`         | Page background — the furthest-back surface                     |
| `--surface`    | Raised surface: cards, sheets, inputs, popovers                 |
| `--text`       | Primary body + heading text (highest contrast on `--bg`)        |
| `--muted`      | Secondary text: captions, metadata, placeholders                |
| `--border`     | Hairlines, dividers, input outlines                             |
| `--primary`    | Primary action / brand fill (buttons, active states)            |
| `--primary-fg` | Foreground (text/icon) sitting **on** `--primary`               |
| `--accent`     | Secondary highlight: links, focus glow, small flourishes        |
| `--ring`       | Focus ring color, tuned for visibility on `--bg` and `--surface`|

---

## Palette overview

| Palette        | Mood / personality                                          | Light feel                              | Dark feel                                  | Best used for |
| -------------- | ----------------------------------------------------------- | --------------------------------------- | ------------------------------------------ | ------------- |
| **sand-surf**  | The house brand. Calm, coastal, premium, trustworthy.       | Sun-bleached sand & cream, ocean teal   | Night ocean: deep ink-teal, bright surf    | saltycodestudio site, client coastal/lifestyle brands, marketing pages, anything that should feel like the studio's own voice |
| **midnight**   | Dark luxe. Nocturnal, expensive, confident.                 | Cool platinum daytime counterpart       | Inky blue-black, electric indigo + gold    | High-end SaaS, fintech, agency portfolios, product launches, pricing/upgrade screens, hero sections that want gravitas |
| **editorial**  | Warm paper + ink. Timeless, literary, content-first.        | Warm paper, near-black ink, vermilion   | Sepia reading mode on warm charcoal        | Blogs, long-form articles, documentation, case studies, newsletters, type-driven landing pages |
| **neon-noir**  | Dark + electric. Cyberpunk, dev-tool, high-energy.          | Stark studio white, readable neon       | Black-graphite void, high-voltage cyan-green | Developer tools, technical product launches, gaming, hackathons, dark dashboards, anything that wants a single jolt of voltage |
| **forest**     | Deep green + cream. Botanical, grounded, organic luxury.    | Warm cream, deep pine, muted clay       | Forest at night: near-black green, moss     | Wellness, hospitality, craft & food brands, sustainability, spa/retreat sites, premium organic e-commerce |

### When to reach for which

- **sand-surf** is the default. Use it unless a project has a strong reason not
  to — it *is* the studio identity.
- **midnight** when the work needs to feel premium and serious, especially for
  dark-first products. The gold accent is for sparing emphasis, not body links.
- **editorial** when words are the product. It is the most neutral and the
  easiest to read for long sessions.
- **neon-noir** when you want energy and a technical edge. Treat the neon as a
  spice: one accent per view, never as a background or large text fill.
- **forest** when the brand is natural, tactile, or hospitality-driven and
  should feel warm rather than cold-premium.

---

## Contrast guidance

Tokens are tuned so the common pairings clear **WCAG 2.1 AA**: 4.5:1 for normal
body text, 3:1 for large text (≥24px, or ≥19px bold) and for UI components such
as borders, icons, and focus rings.

### Pairings that are safe for body text (target ≥ 4.5:1)

| Pairing                       | Notes |
| ----------------------------- | ----- |
| `--text` on `--bg`            | Primary reading pair. Comfortably above 4.5:1 in every palette, both modes. |
| `--text` on `--surface`       | Same intent on raised cards. Safe across all palettes. |
| `--muted` on `--bg`           | Tuned to clear 4.5:1, so it is safe for real secondary copy, not just decoration. |
| `--primary-fg` on `--primary` | Button label on its fill. Verified per palette in both modes. |

### Pairings safe only for large text / UI (target ≥ 3:1)

| Pairing                  | Notes |
| ------------------------ | ----- |
| `--accent` on `--bg`     | Great for links, large numerals, icons. For **small** link text on the brightest backgrounds, prefer `--primary` or pair the accent with an underline. |
| `--border` on `--bg`     | Intentionally low-contrast (hairlines). Do **not** put text on or near `--border` weight. |
| `--ring` against `--bg` / `--surface` | Focus indicator. Always render with `outline-offset` so it reads against both. |

### Accent caveats by palette

- **midnight (light)** and **neon-noir (light)**: the `--accent` is a *darkened*
  version of the brand gold / magenta specifically so it passes AA as link text
  on light backgrounds. The vivid versions live in the dark variants.
- **neon-noir (dark)**: the neon `--primary` is brilliant — use `--primary-fg`
  (near-black) on it, never white. Avoid large neon fills; it vibrates.
- **editorial / forest accents** (vermilion, clay) are warm mid-tones: excellent
  for large text and buttons, borderline for tiny captions — add an underline or
  bump the size when in doubt.

### Rules of thumb

1. **Text fills:** use `--text` (primary) or `--muted` (secondary). Both are
   verified for body copy.
2. **Links / emphasis:** `--accent`. Add an underline anywhere the link is small
   or sits on a near-white background.
3. **Buttons:** `--primary` fill + `--primary-fg` label, always paired.
4. **Focus:** `--ring` with `outline-offset: 2px` so it survives on `--bg` and
   `--surface` alike.
5. **Never** place text on `--border`-weight values; they are structural only.
6. **Re-check after edits:** if you change a raw brand value, re-verify the four
   body-text pairings above before shipping.

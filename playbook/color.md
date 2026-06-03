# Color

How to build, balance, and apply a palette for a saltycodestudio site.
Opinionated. Pairs with `foundations/palettes.css`, which ships five tuned,
AA-compliant palettes (sand-surf, midnight, editorial, neon-noir, forest) with
light + dark variants.

> TL;DR: Don't invent colors — pick a palette from `palettes.css` and consume the
> nine **semantic tokens**, never the raw brand hex. Follow 60-30-10. Accent is a
> spice, not a sauce. Check contrast before you ship.

---

## 1. Build a palette (or just use one)

**Easiest path: use a ready palette.** `foundations/palettes.css` gives you five
complete systems. Set them on any element; the closest ancestor wins:

```html
<html data-palette="sand-surf" data-mode="light"> … </html>
<section data-palette="midnight" data-mode="dark"> … </section>
```

| Palette | Feel | Reach for it when |
|---------|------|-------------------|
| `sand-surf` | calm, coastal, premium (house default) | trustworthy brand, general-purpose |
| `midnight` | dark luxe, indigo + champagne gold | high-end SaaS, fintech, agency |
| `editorial` | warm paper + ink + one vermilion | long-form, magazine, content-first |
| `neon-noir` | black + one electric cyan-green | dev tools, launches, cyberpunk energy |
| `forest` | deep pine + cream + clay | wellness, hospitality, sustainability |

**If you must build your own,** keep it to these roles and you'll have a real
system, not a pile of hex:

1. **One neutral family** — 3–5 steps from background to text (e.g. cream → sand →
   ink). This is 90% of the page.
2. **One primary** — the brand action color. Buttons, active states, key links.
3. **One accent** — a secondary highlight used sparingly (see §5).
4. Derive **muted**, **border**, and **surface** from the neutral, not from new
   hues.

**Don't:**
- Don't use 5 saturated brand colors. That's a children's toy, not a brand.
- Don't pull random hex into components. Map everything to the tokens below.

---

## 2. The semantic token contract

Every palette in `palettes.css` defines the **same nine tokens**. Build your CSS
against these and you get light/dark and palette-swapping for free — never touch
the raw `--brand-*` values in components.

| Token | What it is |
|-------|-----------|
| `--bg` | page background, furthest-back surface |
| `--surface` | raised surfaces: cards, sheets, inputs, popovers |
| `--text` | primary body + heading text (highest contrast on `--bg`) |
| `--muted` | secondary text: captions, metadata, placeholders |
| `--border` | hairlines, dividers, input outlines |
| `--primary` | primary action / brand fill |
| `--primary-fg` | text/icon color that sits **on** `--primary` |
| `--accent` | secondary highlight: links, focus glow, small flourishes |
| `--ring` | focus ring color, tuned for visibility |

```css
body  { background: var(--bg); color: var(--text); }
.card { background: var(--surface); border: 1px solid var(--border); }
.btn  { background: var(--primary); color: var(--primary-fg); }
.btn:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
small { color: var(--muted); }
```

**Rule:** if you find yourself typing a hex code in a component, stop — there's a
token for that. Hardcoded color is how dark mode and rebrands break.

---

## 3. The 60-30-10 rule

The most reliable way to make a palette feel balanced and intentional.

- **60% dominant** — your neutral background (`--bg`) and its surfaces. Most of the
  page is quiet.
- **30% secondary** — text, borders, surfaces, the structural mid-tones
  (`--text`, `--surface`, `--border`, `--muted`).
- **10% accent** — `--primary` and `--accent` combined. This is the loud part, and
  it's small on purpose.

**Why it works:** the eye needs rest. When 10% of the page is colorful, that 10%
*means* something — it's where you put the CTA and the one thing you want clicked.
When 60% is colorful, the visitor's eye has nowhere to land.

**Gut check:** screenshot the page and squint. If color is splattered everywhere,
you've blown past 10%. The CTA should be the obvious bright spot.

---

## 4. Semantic (state) color

Beyond brand color, UI needs **status** color. Keep it conventional — people read
these colors as meaning, so don't get clever:

- **Success → green. Warning → amber/yellow. Error/destructive → red. Info →
  blue.** Don't make "delete" your brand teal; users won't register the danger.
- Give each a **fill** and a **text/on-fill** pair so it passes contrast both ways.
- **Never rely on color alone** to convey state. Add an icon, label, or text. ~8%
  of men have color-vision deficiency and can't distinguish red/green reliably.
  A red border with no error text is invisible to them.

```html
<p class="error"><span aria-hidden="true">⚠</span> Card was declined.</p>
```

Keep state colors distinct from `--primary` and `--accent` so a real error never
looks like a brand flourish.

---

## 5. Use accent sparingly

This is the line between a designed site and a loud one.

- **Accent is a spice.** One CTA per section. One highlighted word in a headline.
  One active nav item. The link color. That's it.
- The more rarely accent appears, **the more powerful each use is.** If every
  heading is accent-colored, the color stops meaning "look here".
- In high-contrast palettes (`neon-noir`, `midnight`), this is non-negotiable —
  the neon/gold is a scalpel. A whole section of neon text is a headache, and on
  `neon-noir` the bright `--primary` literally won't pass contrast as body text.
- Most text should be `--text` or `--muted`. Reserve `--primary`/`--accent` for
  things that are interactive or genuinely the focal point.

**Don't:** color every heading with the accent, fill big background blocks with
saturated primary, or use accent for body copy.

---

## 6. Dark mode

`palettes.css` ships a dark variant for every palette. Two ways to switch:

```html
<!-- Explicit: you control it (e.g. a theme toggle) -->
<html data-palette="midnight" data-mode="dark">

<!-- Automatic: follow the OS — just omit data-mode -->
<html data-palette="midnight">
```

Omitting `data-mode` activates the `prefers-color-scheme` block, so the OS decides.

**Dark mode rules (the palettes already do these — match them in custom work):**

- **Dark backgrounds are not pure black.** Use a dark, slightly-tinted bg (e.g.
  `#0e171c`, `#0a0c14`) and a *lighter* `--surface` to lift cards. Pure `#000`
  with pure `#fff` text vibrates and feels cheap.
- **Don't use pure white text on dark.** Use a soft off-white (`#f4ece0`,
  `#e6e9f5`). Full-white on black is harsh and causes halation.
- **Brand colors usually need to brighten in dark mode.** Note how `sand-surf`
  swaps teal → brighter "surf", and `--primary-fg` flips to a dark color so text
  on the bright button still reads. Don't reuse light-mode hues unchanged.
- **Elevation = lightness in dark mode.** Cards/popovers get *lighter*, not
  darker, the higher they sit. The opposite of shadow-on-light.
- Re-check contrast in *both* modes. A pair that passes on light can fail on dark.

---

## 7. Contrast & accessibility

Non-negotiable. The token pairs in `palettes.css` are tuned to clear **WCAG 2.1
AA**, but if you add or change colors, verify:

- **Body text: 4.5:1** against its background.
- **Large text (≥24px, or ≥19px bold) and UI/icons: 3:1.**
- **Focus rings and borders need contrast too** — `--ring` is tuned for this; keep
  `outline-offset` so the ring is visible against both `--bg` and `--surface`.

**Checklist:**
- [ ] `--text` on `--bg` ≥ 4.5:1.
- [ ] `--muted` on `--bg` ≥ 4.5:1 (muted is still text — don't let it drop to grey
      mush; the palettes keep muted readable, not decorative).
- [ ] `--primary-fg` on `--primary` ≥ 4.5:1 (the button label is readable).
- [ ] `--accent` used for links passes against its background — note `editorial`,
      `midnight`, and `neon-noir` *darken* the accent for light mode precisely so
      it passes AA. Follow that pattern.
- [ ] Every focusable element has a visible `:focus-visible` ring via `--ring`.
- [ ] No information conveyed by color alone (see §4).
- [ ] Re-checked in dark mode.

**Tools:** browser DevTools shows a contrast ratio in the color picker; WebAIM's
contrast checker for ad-hoc pairs.

---

## Quick checklist (ship this)

- [ ] Using a `data-palette` from `palettes.css` (or a self-built one with the
      same nine tokens).
- [ ] Components read **semantic tokens**, never raw `--brand-*` hex.
- [ ] Roughly 60-30-10 — most of the page is quiet neutral.
- [ ] Accent appears rarely; the CTA is the obvious bright spot when you squint.
- [ ] Status colors are conventional (green/amber/red/blue) and paired with
      text/icons, not color alone.
- [ ] Dark mode: tinted-not-black bg, off-white-not-white text, lifted surfaces,
      brightened brand color.
- [ ] All key pairs pass AA (4.5:1 text, 3:1 large/UI), in both modes.
- [ ] Every focusable element has a visible focus ring.
```
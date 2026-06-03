# Responsive Playbook — saltycodestudio

> A saltycodestudio site is **mobile-first, fluid, and touch-honest**. It looks
> intentional at 360px and at 1920px, with no awkward in-between snaps. We lean on
> `clamp()` and container queries so most layouts need *few* breakpoints.

Read these foundations before building — the responsive system already exists:

- `foundations/tokens.css` — breakpoints (`--bp-*`), container widths
  (`--container-*`), fluid section/gutter spacing, `@custom-media` aliases.
- `foundations/typography.css` — the fluid `--step-*` type scale (clamp-based).
- `foundations/base.css` — `100svh` body min-height, `max-width:100%` media,
  sensible box-sizing reset.
- `components/css/container-query-card` — the reference container-query pattern.

---

## 1. Mobile-first, always

Write the small-screen layout as the **base**, then *add* at larger widths with
`min-width` queries. Never start desktop-down with `max-width`.

```css
/* base = mobile: single column, stacked */
.features { display: grid; grid-template-columns: 1fr; gap: var(--space-6); }

/* enhance up */
@media (min-width: 768px)  { .features { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .features { grid-template-columns: repeat(3, 1fr); } }
```

Why: mobile is the constrained case. Designing it first forces real priority
(what content actually matters) and means the desktop layout is additive, not a
cramped afterthought.

---

## 2. Fluid type & space — prefer `clamp()` over breakpoints

The type scale is already fluid. **Use the steps; don't set fixed `px` font
sizes.** They interpolate smoothly from 320px → 1240px viewports and still
respect the user's font-size preference (the `rem` term).

```css
h1   { font-size: var(--step-5); }   /* 2.49rem → 3.81rem, no breakpoint needed */
h2   { font-size: var(--step-4); }
p    { font-size: var(--step-0); }   /* 1rem → 1.125rem body */
.lead{ font-size: var(--step-1); }
.fine{ font-size: var(--step--1); }
```

**Fluid spacing** for the big rhythm — section gaps and page gutters scale with
the viewport so vertical rhythm stays generous (part of the coastal/editorial
feel) without breakpoints:

```css
section        { padding-block: var(--space-section); }       /* clamp(4rem, 9vw, 8rem) */
.section-tight { padding-block: var(--space-section-tight); }
.page          { padding-inline: var(--space-gutter); }        /* clamp(1rem, 4vw, 2rem) */
```

For one-off fluid values, follow the existing formula:
`clamp(MIN, preferred-with-vw, MAX)` with the viewport range locked to
**320px → 1240px**. Don't mint random clamps with different ranges — keep the
curve consistent across the site.

**Rule of thumb:** reach for `clamp()` first. Only add a media query when a
layout must *restructure* (columns change, an element repositions, a nav
collapses) — not merely to resize text or padding.

---

## 3. Breakpoints — the canonical set

Mobile-first `min-width` values from `tokens.css`. These are the **only**
breakpoints; don't invent new ones mid-project.

| Token | Value | Target |
|---|---|---|
| `--bp-sm`  | 640px  | large phone / small tablet portrait |
| `--bp-md`  | 768px  | tablet |
| `--bp-lg`  | 1024px | small laptop |
| `--bp-xl`  | 1280px | desktop |
| `--bp-2xl` | 1536px | large desktop |

> **Gotcha:** CSS custom properties **cannot** be used inside `@media (...)` —
> media features resolve before `var()`. So write the literal px in the query
> and keep it matching the token. If your build has `postcss-custom-media`, use
> the aliases instead, which stay in sync:

```css
@media (--md)  { /* 768px  */ }
@media (--lg)  { /* 1024px */ }
```

**Constrain content width** with the container tokens so line length stays
readable — don't let text run the full width of a 1920px monitor:

```css
.container       { max-width: var(--container-xl); margin-inline: auto; }  /* 1200px */
.prose           { max-width: var(--container-prose); }                    /* 68ch  */
article p        { max-width: var(--container-md); }                       /* 720px */
```

Ideal reading measure is **~60–75ch**; `--container-prose` (68ch) bakes this in.

---

## 4. Container queries — for reusable components

Media queries respond to the **viewport**. That breaks reusable components: a
card in a wide hero and the same card in a narrow sidebar would look identical
because the viewport is one size. **Container queries** let a component respond
to the width of its *slot*.

Use container queries when a component can appear in differently-sized
containers (cards, media objects, widgets, dashboard tiles). See
`components/css/container-query-card` for the full reference.

```css
/* 1. the slot opts into containment */
.card-slot {
  container-type: inline-size;
  container-name: card;
}

/* 2. the card queries its slot, NOT the viewport (mobile/narrow-first) */
.card { grid-template-columns: 1fr; }              /* stacked by default */

@container card (min-width: 24rem) {
  .card { grid-template-columns: 42% 1fr; }        /* go side-by-side */
}
@container card (min-width: 40rem) {
  .card { grid-template-columns: 48% 1fr; }        /* more generous */
}
```

**When to use which:**
- **Page-level layout** (overall grid, nav collapse, section restructure) →
  media queries on `--bp-*`.
- **Component internals** (a card/tile/widget reused in many slots) →
  container queries.

Don't double up: if a component uses container queries, it shouldn't also have
viewport media queries fighting it.

---

## 5. Touch targets & touch-honest UI

- **Minimum tappable size: 44×44px** (use 48px for primary actions). If the
  visual is smaller (e.g. an icon), expand the hit area with padding or a
  pseudo-element — never ship a 16px tap target.
```css
.icon-btn {
  min-width: 44px; min-height: 44px;
  display: inline-grid; place-items: center;
}
```
- **Spacing between targets:** keep ≥8px gap so fat fingers don't mis-tap
  adjacent controls.
- **No hover-only affordances.** Touch devices have no hover, so anything
  revealed *only* on `:hover` (menus, "delete" buttons, tooltips) is invisible
  to touch users. Make the action reachable by tap, and treat hover styling as
  an enhancement. (Magnetic/cursor effects correctly no-op on touch.)
- **Always include `:active`** for press feedback — it's the only state touch
  gives you.
- **Respect safe areas** on notched phones for fixed/sticky chrome:
```css
.bottom-bar { padding-bottom: max(var(--space-4), env(safe-area-inset-bottom)); }
```
- **Use `dvh`/`svh`, not `vh`,** for full-height sections so mobile browser
  chrome (the shrinking address bar) doesn't cause jumps. `base.css` already
  uses `min-height: 100svh` on the body.
```css
.hero { min-height: 100svh; }   /* small-viewport-height: stable, no jump */
```
- **Inputs ≥16px font-size** on iOS, or Safari auto-zooms the page on focus.
  `--step-0` (1rem+) satisfies this — don't shrink form inputs below it.

---

## 6. Images & media

- `base.css` already sets media to `max-width: 100%; height: auto` — they never
  overflow and keep aspect ratio. Don't override that.
- Set `width`/`height` attributes (or `aspect-ratio` in CSS) on images to
  reserve space and **prevent layout shift** (CLS) as they load.
- Serve responsive sources: `srcset` + `sizes`, and prefer modern formats
  (AVIF/WebP) with a fallback.
- `loading="lazy"` for below-the-fold images; **never** lazy-load the LCP/hero
  image (it delays the largest paint).

---

## 7. Testing — do this every time

**Resize, don't assume.** Drag the browser from ~320px to ~1920px slowly and
watch for:
- [ ] Horizontal scrollbar at any width (almost always a fixed width, a wide
      image, or a `100vw` that ignores the scrollbar — find and fix it).
- [ ] Text that overflows or gets clipped; long unbroken strings (URLs) —
      add `overflow-wrap: anywhere` where needed.
- [ ] Awkward in-between states right around each breakpoint (640/768/1024px).
- [ ] Two-up/three-up grids that orphan a lonely last item.

**Real-device-ish checks:**
- [ ] Chrome DevTools device toolbar: iPhone SE (375px — the tight case),
      iPhone Pro (notch / safe areas), iPad (768px), then a wide desktop.
- [ ] Touch targets ≥44px (use the DevTools ruler).
- [ ] Tap every hover-revealed control on a touch emulation — is it reachable?
- [ ] Zoom the browser to **200%** — content must reflow and stay usable
      (WCAG). Fixed-px layouts break here; clamp/rem layouts don't.
- [ ] Landscape phone (short height) — does `100svh` hero still work?
- [ ] Container-query components: drop one into a narrow AND a wide slot and
      confirm both lay out correctly.
- [ ] Reduced-motion + reduced-data preferences don't break layout.

---

## 8. Pre-ship responsive checklist

- [ ] Built mobile-first (`min-width` queries, base = smallest screen).
- [ ] Type uses `--step-*`; no hardcoded `px` font sizes.
- [ ] Section/gutter spacing uses fluid `--space-section*` / `--space-gutter`.
- [ ] Breakpoints are only the canonical `--bp-*` values (literal px in `@media`).
- [ ] Content width capped via `--container-*` / `--container-prose` (60–75ch text).
- [ ] Reusable components use **container queries**, not viewport media queries.
- [ ] Touch targets ≥44px, ≥8px apart; no hover-only actions; `:active` present.
- [ ] Full-height sections use `svh`/`dvh`; safe-area insets honored.
- [ ] Images: `aspect-ratio`/dimensions set, `srcset`, lazy-load (except hero).
- [ ] No horizontal scroll from 320px → 1920px; usable at 200% zoom.

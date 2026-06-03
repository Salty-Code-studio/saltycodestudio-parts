# Sticky Grid Scroll

A pinned, scroll-driven 3-column image grid. As you scroll, the cells stagger in
from the top and bottom, the whole grid zooms open (side columns drift outward,
center holds), and an overlaid title + CTA fade in at a precise scroll window
before the section releases back to normal scrolling. Lenis adds optional
smoothing.

This is a **motion** showcase part for the saltycodestudio library.

## Dependencies

- [`gsap`](https://gsap.com/) + `gsap/ScrollTrigger` (required)
- [`lenis`](https://github.com/darkroomengineering/lenis) (optional — auto-detected for smooth scrolling)

## Files

- `animation.js` — the `initStickyGridScroll(root, options)` initializer (ES module + global fallback).
- `styles.css` — structural styles. Colors come from `--sgs-*` CSS custom properties so you can theme it.

## Paste-in instructions

**1. Markup** — three columns, each with one or more `.sgs-cell`, plus an overlay:

```html
<section class="sgs">
  <div class="sgs-stage">
    <div class="sgs-grid">
      <div class="sgs-col" data-col="left">
        <figure class="sgs-cell"><img src="…" alt="" /></figure>
        <figure class="sgs-cell"><img src="…" alt="" /></figure>
      </div>
      <div class="sgs-col" data-col="center">
        <figure class="sgs-cell"><img src="…" alt="" /></figure>
        <figure class="sgs-cell"><img src="…" alt="" /></figure>
      </div>
      <div class="sgs-col" data-col="right">
        <figure class="sgs-cell"><img src="…" alt="" /></figure>
        <figure class="sgs-cell"><img src="…" alt="" /></figure>
      </div>
    </div>

    <div class="sgs-content" data-sgs-content>
      <h2 class="sgs-title">Built by the coast.</h2>
      <a class="sgs-cta" href="/work">See the studio</a>
    </div>
  </div>
</section>
```

The `data-col` values matter: the **center** column flies in from the top, the
**left / right** columns fly in from the bottom and drift apart during the zoom.

**2. Styles** — import `styles.css` (or copy it in). Override the tokens to theme:

```css
.sgs-stage { --sgs-bg: #0f5c5c; }
.sgs-cta   { --sgs-accent: #2ec3c3; --sgs-accent-ink: #0f2c3a; }
```

**3. Init** — ES module:

```js
import { initStickyGridScroll } from "./animation.js";
initStickyGridScroll(document, {
  scrollLength: 2.6,  // pin duration in viewport heights
  zoom: 2.05,         // peak grid scale
  columnOffset: 18,   // % lateral drift of side columns
  stagger: 0.06,      // per-cell reveal stagger
  revealStart: 0.7,   // progress (0..1) where content begins fading in
  revealEnd: 0.86,    // progress (0..1) where content is fully shown
  lenis: false,       // pass an instance, or false to disable smoothing
});
```

Or drop GSAP + ScrollTrigger via `<script>` and call the global
`initStickyGridScroll()` (a `window` fallback is registered automatically).

## Accessibility

Respects `prefers-reduced-motion: reduce` in both JS and CSS — when set, the grid
renders in its resolved, fully-visible end state with no scrubbed animation.

## Source / inspiration

Inspired by the Codrops/Tympanus tutorial
["Sticky Grid Scroll: Building a Scroll-Driven Animated Grid"](https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/)
(Codrops content is free for personal and commercial use). Reimplemented cleanly
in our own code — no verbatim source — for the saltycodestudio parts library.

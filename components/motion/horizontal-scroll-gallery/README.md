# Horizontal Scroll Gallery

Pin a section and translate an over-wide track horizontally, so the user's **vertical scroll sweeps a row of panels sideways**. Classic award-site move for portfolios, case-study reels, and feature showcases.

**Tier:** showcase

## Dependencies
- GSAP 3 core
- GSAP **ScrollTrigger** plugin

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

## Files
- `animation.js` — `initHorizontalGallery()`; pins, scrubs the track, and adds per-panel parallax.
- `styles.css` — track + panel layout (Sand & Surf palette).
- `preview.html` — self-contained working demo.

## Paste-in instructions
1. Copy `styles.css` and remap `--ss-*` tokens.
2. Markup: a `.hscroll` section → one `.hscroll-track` flex row → N `.hscroll-panel` children. Each panel may include an absolutely-positioned `[data-hscroll-parallax]` media block for the depth effect.
3. Load GSAP + ScrollTrigger, then call `initHorizontalGallery()`.

```html
<section class="hscroll">
  <div class="hscroll-track">
    <article class="hscroll-panel">
      <div class="hscroll-media" data-hscroll-parallax></div>
      <div class="hscroll-content"> ... </div>
    </article>
    <!-- more panels -->
  </div>
</section>
```

```js
import { initHorizontalGallery } from './animation.js';
initHorizontalGallery();
```

## Notes
- Travel distance is computed from `track.scrollWidth - innerWidth`, so it adapts to any number/width of panels and recalculates on resize (`invalidateOnRefresh`).
- The parallax uses `containerAnimation` so ScrollTrigger maps each panel's position **inside the horizontal tween**, not the page — this is the correct pattern for elements that move with a pinned horizontal track.
- For touch/trackpad smoothness, pair with a smooth-scroll lib (Lenis) if desired; not required.

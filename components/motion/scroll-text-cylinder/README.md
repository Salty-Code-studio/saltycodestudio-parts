# 3D Scroll Text Cylinder

Lines of text wrapped around an invisible 3D cylinder (or tube) that rotates through depth as you scroll. The ring tumbles toward the viewer — or spins like a carousel — while back-facing lines fade and blur into the distance. Pure CSS 3D transforms + GSAP. **No WebGL.**

The trick: the stage gets `perspective: 70vw`, the ring gets `transform-style: preserve-3d`, and each line is placed on the cylinder surface with `Math.sin`/`Math.cos` + `translateZ(radius)`. GSAP `ScrollTrigger` pins the stage and maps scroll distance to the ring's rotation. `ScrollSmoother`, if present, adds inertia.

## Dependencies

- `gsap`
- `gsap/ScrollTrigger`
- `gsap/ScrollSmoother` *(optional — auto-detected; adds inertia)*

```bash
npm i gsap
```

CDN (matches `preview.html`):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<!-- optional -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollSmoother.min.js"></script>
```

## Paste-in instructions

1. Copy `styles.css` and `animation.js` into your project (or paste their contents inline).
2. Add the markup — one `.cyl-line` per line of text, inside a `[data-cylinder]` ring, inside a full-height `.cyl-stage`:

```html
<section class="cyl-stage">
  <div class="cyl"
       data-cylinder
       data-radius="300"   <!-- cylinder radius in px        -->
       data-arc="360"      <!-- degrees the lines span (360 = full ring) -->
       data-spin="1.25"    <!-- extra full turns across the scroll -->
       data-axis="x"       <!-- "x" = tube toward you, "y" = carousel -->
       data-scrub="1600">  <!-- pinned scroll length in px    -->
    <span class="cyl-line">Sand</span>
    <span class="cyl-line">Surf</span>
    <span class="cyl-line">Salt</span>
    <span class="cyl-line">Code</span>
    <!-- add as many lines as you like -->
  </div>
</section>
```

3. Initialize after the DOM and GSAP are ready:

```js
import { initScrollCylinder } from './animation.js';
initScrollCylinder();
// (the script also exposes window.initScrollCylinder for non-module use)
```

You can place multiple `[data-cylinder]` stages on one page — each is configured independently via its `data-*` attributes.

## Options

| Attribute     | Default | Meaning                                            |
| ------------- | ------- | -------------------------------------------------- |
| `data-radius` | `320`   | Cylinder radius in px (bigger = wider ring).       |
| `data-arc`    | `360`   | Total degrees the lines span. `360` = closed ring. |
| `data-spin`   | `1.25`  | Extra full turns mapped across the scroll.         |
| `data-axis`   | `"x"`   | `"x"` tube tumbling toward you · `"y"` carousel.   |
| `data-scrub`  | `1400`  | Pinned scroll distance in px.                      |

## Accessibility

Respects `prefers-reduced-motion: reduce` — the cylinder renders as a static, fully readable ring with no scroll-pinning, blur, or per-frame rotation.

## Source / inspiration

Reimplemented in original code, inspired by **Codrops / Tympanus** — ["Creating 3D Scroll-Driven Text Animations with CSS and GSAP" (2025-11-04)](https://tympanus.net/codrops/2025/11/04/creating-3d-scroll-driven-text-animations-with-css-and-gsap/). Codrops/Tympanus demo code is free for personal and commercial use; GSAP plugins are now free. Released here as **MIT — reimplemented**.

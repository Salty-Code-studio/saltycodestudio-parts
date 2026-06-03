# Scroll Progress Bar

A slim, fixed bar at the top of the viewport that **fills 0 → 100% with scroll progress**. Point it at the whole document or a single article for a reading-progress indicator.

**Tier:** practical

## Dependencies
- GSAP 3 core
- GSAP **ScrollTrigger** plugin

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

## Files
- `animation.js` — `initScrollProgress(options)`.
- `styles.css` — fixed track + gradient fill.
- `preview.html` — self-contained working demo (a tall article).

## Paste-in instructions
1. Copy `styles.css`.
2. Add the markup as the first element in `<body>`:
```html
<div class="scroll-progress"><span class="scroll-progress-fill"></span></div>
```
3. Load GSAP + ScrollTrigger, then call `initScrollProgress()`.

```js
import { initScrollProgress } from './animation.js';
initScrollProgress();                       // whole-page progress
initScrollProgress({ target: '#article' }); // reading progress of one element
```

## Options
- `target` — a selector to measure progress over (default: the whole document body).
- `fillSelector` — custom selector for the fill element (default `.scroll-progress-fill`).

## Notes
- Animation is a single `scaleX` on a `will-change: transform` layer — GPU-cheap and smooth on long pages.
- Tweaks: change `--ss-progress-height` for thickness, swap the gradient for a solid brand color, or move it to the bottom by setting `top: auto; bottom: 0;`.
- The bar empties in reverse when scrolling up because it's scrubbed, not one-shot.

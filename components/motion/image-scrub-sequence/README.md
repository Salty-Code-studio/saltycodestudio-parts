# Image Scrub Sequence

Scroll **scrubs a playhead through a frame sequence rendered to `<canvas>`**, the classic Apple-product-page "scroll plays a video" effect. The demo generates its frames procedurally (animated gradient + rotating ribbon) so it works with **zero external image assets** — and the same scaffolding swaps cleanly to a real PNG/JPG sequence in production.

**Tier:** showcase

## Dependencies
- GSAP 3 core
- GSAP **ScrollTrigger** plugin

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

## Files
- `animation.js` — `initScrubSequence()`, the `drawFrame()` generator, DPR-aware canvas sizing, and scroll→frame mapping.
- `styles.css` — tall section + pinned sticky canvas + caption overlay.
- `preview.html` — self-contained working demo.

## Paste-in instructions
1. Copy `styles.css`.
2. Markup:
```html
<section class="scrub-section">
  <div class="scrub-sticky">
    <canvas class="scrub-canvas"></canvas>
    <div class="scrub-caption"> ... optional overlay ... </div>
  </div>
</section>
```
3. Load GSAP + ScrollTrigger, then call `initScrubSequence()`.

```js
import { initScrubSequence } from './animation.js';
initScrubSequence();
```

## Swapping in a real image sequence
Replace the procedural `drawFrame()` with an image-array renderer:

```js
const frames = []; // preload: frames[i] = new Image(); frames[i].src = `/seq/${i}.jpg`;
function renderImage(ctx, w, h, frameIndex) {
  const img = frames[frameIndex];
  if (img && img.complete) ctx.drawImage(img, 0, 0, w, h);
}
```
Set `FRAME_COUNT` to your sequence length, preload all frames before init, and call your renderer from the `onUpdate` mapping instead of `drawFrame`.

## Notes
- Scroll runway = the `.scrub-section` height (`400vh` in the demo). Taller section → slower, more granular scrub.
- Canvas is sized to its CSS box and scaled by `devicePixelRatio` (capped at 2) so it stays crisp without over-rendering on hi-DPI screens.
- `scrub: 0.4` adds a little smoothing; set to `true` for exact 1:1 tracking.
- For long real-image sequences, preload and consider compressing frames; canvas `drawImage` is cheap, decoding is the cost.

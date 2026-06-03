# Parallax Layers

Multiple stacked layers translate at **different speeds** as you scroll, creating dimensional depth. Great for hero scenes, section backdrops, and editorial dividers.

**Tier:** practical

## Dependencies
- GSAP 3 core
- GSAP **ScrollTrigger** plugin

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

## Files
- `animation.js` — `initParallaxLayers()`; reads `data-parallax-speed` per layer.
- `styles.css` — scene + layer positioning (layers bleed past the edges so motion never reveals a gap).
- `preview.html` — self-contained working demo.

## Paste-in instructions
1. Copy `styles.css`.
2. Build a `.parallax-scene` containing `.parallax-layer` elements, each with a `data-parallax-speed`:
   - Negative (e.g. `-0.35`) → lags behind scroll → reads as far background.
   - Positive (e.g. `0.4`–`0.6`) → moves faster → reads as foreground.
   - Add `is-content` to any layer that needs to remain clickable.
3. Load GSAP + ScrollTrigger, then call `initParallaxLayers()`.

```js
import { initParallaxLayers } from './animation.js';
initParallaxLayers();
```

## Notes
- Movement is `yPercent` based and scrubbed across the scene's full pass through the viewport (`top bottom` → `bottom top`), so it's resolution-independent and recalculates on resize.
- Keep speeds modest (roughly -0.5 to 0.6); larger values feel jittery and can reveal layer edges — that's why layers use `inset: -20%` bleed.
- For horizontal parallax, swap `yPercent` for `xPercent` in `animation.js`.

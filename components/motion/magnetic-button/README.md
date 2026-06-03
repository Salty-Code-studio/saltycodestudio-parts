# Magnetic Button

A button that is **magnetically pulled toward the cursor** while hovered, with its label drifting slightly further for depth, then springing back elastically on leave. The signature micro-interaction for hero CTAs and contact buttons.

**Tier:** practical

## Dependencies
- GSAP 3 core (uses `gsap.quickTo` + the elastic ease). **No ScrollTrigger needed.**

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
```

## Files
- `animation.js` — `initMagneticButtons()`.
- `styles.css` — pill button + ghost variant, plus a `prefers-reduced-motion` guard.
- `preview.html` — self-contained working demo (three variants).

## Paste-in instructions
1. Copy `styles.css`.
2. Markup — a `.magnetic` element with a `.magnetic-label` inside:
```html
<button class="magnetic" data-magnetic-strength="0.4">
  <span class="magnetic-label">Get in touch →</span>
</button>
```
3. Load GSAP, then call `initMagneticButtons()`.

```js
import { initMagneticButtons } from './animation.js';
initMagneticButtons();
```

## Tunables (per button, via data attributes)
- `data-magnetic-strength` — how far the button follows the cursor (default `0.4`).
- `data-magnetic-label` — extra pull applied to the label on top of strength (default `0.2`) for the parallax-y depth.

## Notes
- Uses `gsap.quickTo` for high-frequency, allocation-free pointer updates — smooth even on rapid mouse movement.
- The label has `pointer-events: none` so the button reliably owns `mousemove`/`mouseleave`.
- Works on any element (anchor, div); just keep the `.magnetic` / `.magnetic-label` structure.
- Touch devices have no hover, so the effect simply doesn't fire — taps behave like a normal button.

# Pinned Scroll Section

A full-height section that **pins in place** while its inner content cross-fades through a set of "stages" driven by scroll. Reach for it on hero process steps, feature walkthroughs, or any "as you scroll, the story advances" moment.

**Tier:** showcase

## Dependencies
- [GSAP 3](https://gsap.com/) core
- GSAP **ScrollTrigger** plugin

Both are loaded from CDN in `preview.html`:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

## Files
- `animation.js` — the reusable `initPinnedSection()` logic (works as ES module or global).
- `styles.css` — section + stage styling using the Sand & Surf palette.
- `preview.html` — self-contained working demo (open it in a browser).

## Paste-in instructions
1. Copy `styles.css` into your stylesheet (remap the `--ss-*` tokens to your own).
2. Add the markup — one `.pin-section` containing a `.pin-inner` with N `.pin-stage` children. Add an optional `<div class="pin-progress" data-pin-progress></div>` for the scrub bar.
3. Load GSAP + ScrollTrigger, then call `initPinnedSection()`.

```html
<section class="pin-section">
  <div class="pin-inner">
    <div class="pin-stage"> ...stage 1... </div>
    <div class="pin-stage"> ...stage 2... </div>
    <div class="pin-progress" data-pin-progress></div>
  </div>
</section>
```

```js
import { initPinnedSection } from './animation.js';
initPinnedSection();
```

## Notes
- Pin duration = `100vh × number of stages`. Change `stageCount` math in `animation.js` to make stages linger longer/shorter.
- `scrub: 0.6` gives a slight smoothing lag; set to `true` for 1:1 tracking.
- Uses `autoAlpha` (opacity + visibility) so hidden stages stay out of the a11y/tab order.
- Call `ScrollTrigger.refresh()` after async content/font loads if measurements drift.

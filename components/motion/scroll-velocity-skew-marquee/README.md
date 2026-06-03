# Scroll Velocity Skew Marquee

An infinite horizontal marquee that **skews and stretches in proportion to scroll velocity**, then snaps back upright when scrolling stops. The text leans into the direction you scroll — fast flicks produce a strong lean, slow drags a gentle one — and the underlying loop speeds up with your momentum.

Part of the **saltycodestudio** parts library · category: `motion` · tier: `showcase`.

## Dependencies

- [`gsap`](https://gsap.com) (3.x)
- `gsap/ScrollTrigger`

GSAP core is free under GreenSock's standard "no charge" license.

## Files

| File | Purpose |
| --- | --- |
| `animation.js` | Canonical ES module — exports `initScrollVelocitySkewMarquee(root, options)` and auto-inits any `[data-svm]` element. |
| `styles.css` | Structural styles for the marquee, with Sand & Surf palette tokens as fallbacks and `prefers-reduced-motion` handling. |
| `preview.html` | Standalone, self-contained demo (open in a browser). |

## Paste-in instructions

**1. Install / load GSAP** (npm or the CDN scripts used in `preview.html`):

```bash
npm i gsap
```

**2. Add the markup.** Provide **two identical rows** of items inside the track so the `-50%` loop wraps seamlessly (or pass `duplicateTrack: true` to clone a single row automatically):

```html
<div class="svm" data-svm>
  <div class="svm__track" data-svm-track>
    <!-- Row A -->
    <span class="svm__item">Sand &amp; Surf</span>
    <span class="svm__item svm__item--outline">Build Fast</span>
    <span class="svm__item">Ship Calm</span>
    <!-- Row B (identical copy) -->
    <span class="svm__item">Sand &amp; Surf</span>
    <span class="svm__item svm__item--outline">Build Fast</span>
    <span class="svm__item">Ship Calm</span>
  </div>
</div>
```

**3. Include the CSS** (`styles.css`) and initialize:

```js
import { initScrollVelocitySkewMarquee } from "./animation.js";

const el = document.querySelector("[data-svm]");
const destroy = initScrollVelocitySkewMarquee(el, {
  baseSpeed: 18,       // seconds per loop at rest
  maxSkew: 20,         // degrees of lean at full velocity
  direction: 1,        // 1 = scrolls left, -1 = scrolls right
  duplicateTrack: false,
});

// later, to tear down:
// destroy();
```

If you just include `animation.js` directly, any element with `data-svm` is wired up automatically on `DOMContentLoaded` (use `data-svm-duplicate="true"` to auto-clone a single row).

## Options

| Option | Default | Description |
| --- | --- | --- |
| `baseSpeed` | `18` | Seconds for one full loop at rest. |
| `velocityToSkew` | `0.018` | Raw px/s velocity → degrees, before clamping. |
| `maxSkew` | `20` | Max skewX angle (degrees) at full lean. |
| `maxStretch` | `0.18` | Extra `scaleY` at full lean (`1 + this`). |
| `timeScaleBoost` | `4` | How hard scroll velocity speeds the loop. |
| `snapDuration` | `0.7` | Seconds for the snap-back to rest. |
| `direction` | `1` | Resting scroll direction (`1` left, `-1` right). |
| `duplicateTrack` | `false` | Auto-clone the row for a seamless loop. |

## How it works

- A base GSAP tween loops the track from `xPercent: 0` to `-50` and repeats forever — with two identical rows of content this reads as a seamless infinite belt.
- On every `ScrollTrigger` update, `self.getVelocity()` (signed px/s) is mapped to a `skewX` angle, clamped to roughly ±20°, plus a proportional `scaleY` stretch.
- `gsap.quickTo` applies skew and stretch cheaply at high frequency (one reused tween, not a new tween per frame), and the loop's `timeScale` is nudged by scroll direction so the type physically leans into your scroll.
- A debounced timer detects when scrolling stops and runs a snap-back tween that eases skew and stretch back to rest.

## Accessibility

When `prefers-reduced-motion: reduce` is set, the initializer bails out and the marquee renders as a clean, static, fully legible band (no infinite scroll, no skew).

## Source / inspiration

Inspired by the official GreenSock CodePen <https://codepen.io/GreenSock/pen/eYpGLYL>. Reimplemented cleanly in original code; GSAP core is free under GreenSock's standard "no charge" license.

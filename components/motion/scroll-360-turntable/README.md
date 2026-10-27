# Scroll 360 Turntable

A pinned hero where a product spins a full **360 degrees** as you scroll through
the section, scrubbed by GSAP ScrollTrigger. A giant headline layered behind the
product fades and letter-spaces out slightly as the spin progresses. The
award-site way to present a hero product, a bottle, a sneaker, or a gadget.

**Tier:** showcase

Two modes live in one `animation.js`:

1. **CSS-3D mode (default).** `initTurntable()` rotateY-spins the
   `.turntable-object`, an abstract faceted flacon built entirely from
   transformed divs and one inline SVG. No images, nothing to shoot.
2. **Frame-sequence mode.** `initTurntable({ frames: [urls] })` preloads a real
   360 photo shoot and swaps stills by scrub progress, exactly like the big
   product sites do it.

## Dependencies

- GSAP 3 core
- GSAP **ScrollTrigger** plugin

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

## Files

- `animation.js`: `initTurntable()`, the pin, the scrub, both spin modes, and
  the headline fade.
- `styles.css`: the section stage, the layered headline, and the whole CSS-3D
  product (8-face body, cap, lids, disc, shadow).
- `index.html`: minimal usage example with the full product markup to copy.
- `preview.html`: self-contained working demo, Sand & Surf themed.

## Paste-in instructions

1. Copy `styles.css` into your project.
2. Copy the `.turntable-section` block from `index.html`. The important bones:

```html
<section class="turntable-section">
  <div class="turntable-headline">
    <p class="turntable-kicker">Eau de parfum · No. 01</p>
    <h1>Saltwater</h1>
  </div>
  <div class="turntable-scene" aria-hidden="true">
    <div class="turntable-shadow"></div>
    <div class="turntable-tilt">
      <div class="turntable-object">
        <!-- 8 body faces, body lid, cap (8 faces + lid), disc.
             Grab the full markup from index.html. -->
      </div>
    </div>
  </div>
</section>
```

3. Load GSAP + ScrollTrigger, then call the init:

```js
import { initTurntable } from './animation.js';

// CSS-3D mode (the default flacon)
initTurntable();

// Frame-sequence mode, for a real 360 shoot
initTurntable({
  frames: ['spin/shot-000.webp', 'spin/shot-001.webp' /* ... */],
});
```

The script also attaches `window.initTurntable` for non-module setups. Note
that ES module imports need a local server (`npx serve`), they do not run from
`file://`.

Frame convention: frame 0 is 0 degrees and the set covers one full turn with no
duplicate closing frame. The scrub wraps with modulo, so the end of the scroll
lands back on frame 0 for a seamless 360. In frame mode the CSS product is
hidden automatically and an `<img class="turntable-frame">` is created for you
(or reused if you put one in the markup yourself).

## Options

| Option            | Default                 | What it does                                     |
| ----------------- | ----------------------- | ------------------------------------------------ |
| `section`         | `'.turntable-section'`  | Selector for the pinned section                  |
| `object`          | `'.turntable-object'`   | Selector for the CSS-3D object                   |
| `headline`        | `'.turntable-headline'` | Selector for the layered headline                |
| `frames`          | `null`                  | Array of image urls, enables frame mode          |
| `turns`           | `1`                     | Full rotations across the pin                    |
| `scrollLength`    | `3`                     | Pin distance, in multiples of the section height |
| `headlineSpacing` | `'0.18em'`              | Letter-spacing the headline drifts toward        |
| `headlineFade`    | `0.55`                  | Share of the scrub the headline fade occupies    |

## Tunables (CSS variables)

- `--tt-radius`, `--tt-height`: size of the bottle body.
- `--tt-cap-radius`, `--tt-cap-h`: size of the cap.
- `--tt-glass-*`, `--tt-cap-*`, `--tt-disc-*`: product colors.
- The resting angle for no-JS and reduced-motion visitors is the
  `rotateY(-32deg)` on `.turntable-object`.

## How it works

- ScrollTrigger pins the section (`start: 'top top'`) for `scrollLength`
  viewport heights and scrubs a single timeline across that distance.
- In CSS-3D mode the timeline tweens `rotationY` from 0 to `360 * turns` on the
  object. The 3D product is a classic CSS prism: eight absolutely positioned
  faces, each `rotateY(n * 45deg) translateZ(radius)`, closed with octagonal
  clip-path lids and stood on a disc. A slight `rotateX(-8deg)` on a wrapper
  provides the camera tilt, so GSAP only ever touches `rotationY` (keeping the
  transform decomposition clean).
- In frame mode the timeline tweens a proxy value and swaps the preloaded
  frame `src` whenever the computed index changes, so scrubbing is instant in
  both directions.
- The headline tween runs on the same timeline: opacity to 0 plus a slight
  letter-spacing drift over the first ~55% of the spin.

## Browser support and graceful degradation

- GSAP ScrollTrigger and CSS 3D transforms (`preserve-3d`, `clip-path`) work in
  all modern browsers: Chrome, Edge, Firefox, and Safari.
- **Reduced motion:** if `prefers-reduced-motion: reduce` is set, the init
  returns before creating any ScrollTrigger. Nothing pins, nothing spins. The
  CSS resting angle (or the first frame in frame mode) stays on screen and the
  headline remains fully readable, so the section reads as a normal static hero.
- **No JavaScript:** the same static hero renders, because the resting angle
  and the headline are plain CSS.
- This part uses GSAP rather than CSS scroll-driven animations, so it does not
  depend on `animation-timeline` support (Chrome/Edge 115+, Safari 26+, Firefox
  behind a flag) and needs no `@supports` guard.

## Source / inspiration

Pattern seen on https://coffee-tech.com (Awwwards Site of the Day by MAKETHECUT
and Or Halevi). Implemented from scratch in the saltycodestudio-parts house
style, no code or assets copied.

License: MIT for this implementation.

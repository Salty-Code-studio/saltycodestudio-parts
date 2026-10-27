# Pinned Numbered Testimonials

A pinned testimonial stage. Giant numerals 01, 02, 03 crossfade in sequence as
you scroll while each large quote and its author slide-fade through in step.
GSAP ScrollTrigger scrubs the whole sequence, snaps to every testimonial so
visitors never stop stranded between two quotes, and fills a thin progress
hairline on the side as the sequence advances.

**Tier:** showcase

## Dependencies
- GSAP 3 core
- GSAP **ScrollTrigger** plugin

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

## Files
- `animation.js` exposes `initNumberedTestimonials()` and builds one scrubbed, snapped timeline per section.
- `styles.css` holds the readable list layout, the giant numeral type, and the live overlaid stage.
- `index.html` is a minimal usage example, `preview.html` is the full standalone Sand and Surf demo.

## Browser support and graceful degradation
GSAP and ScrollTrigger run in every modern browser (Chrome, Edge, Firefox,
Safari), so the effect itself needs no cutting-edge CSS. Resilience is layered
in three ways:

- **No JavaScript:** the base CSS renders the testimonials as a plain readable list with dividers, no pinning.
- **Reduced motion:** `initNumberedTestimonials()` checks `prefers-reduced-motion` and leaves the static list in place.
- **GSAP missing:** the script warns in the console and keeps the static list too.

In both fallback cases the section gets a `.pnt-static` class as a styling
hook, in case you want to dress the plain list up further.

## Paste-in instructions
1. Copy `styles.css` and `animation.js` into your project.
2. Add the markup, one `.pnt-item` figure per testimonial:

```html
<section class="pnt-section" aria-label="What clients say">
  <div class="pnt-inner">
    <div class="pnt-rail" aria-hidden="true"><span class="pnt-rail-fill"></span></div>
    <div class="pnt-stage">

      <figure class="pnt-item">
        <span class="pnt-num" aria-hidden="true">01</span>
        <blockquote class="pnt-quote">The quote itself, big and confident.</blockquote>
        <figcaption class="pnt-author"><strong>Name</strong><span>Role, company</span></figcaption>
      </figure>

      <figure class="pnt-item">
        <span class="pnt-num" aria-hidden="true">02</span>
        <blockquote class="pnt-quote">The next quote slides in as the numeral crossfades.</blockquote>
        <figcaption class="pnt-author"><strong>Name</strong><span>Role, company</span></figcaption>
      </figure>

    </div>
  </div>
</section>
```

Repeat the figure for each testimonial and number the `.pnt-num` spans
yourself (01, 02, 03 and so on). They are decorative, hence `aria-hidden`.

3. Load GSAP plus ScrollTrigger, then call the init:

```js
import { initNumberedTestimonials } from './animation.js';
initNumberedTestimonials();
```

No bundler? `animation.js` uses an `export`, so it must load with
`type="module"` (a plain script tag cannot parse it). Loaded that way it also
attaches `initNumberedTestimonials` to `window`, so a second small module
script can call it:

```html
<script type="module" src="./animation.js"></script>
<script type="module">initNumberedTestimonials();</script>
```

## How it works
- ScrollTrigger pins `.pnt-inner` for one viewport height of scroll per testimonial and scrubs a single timeline through the whole stay.
- The timeline spends one unit per handover: the outgoing numeral and copy drift up and fade, the incoming numeral rises underneath, and the quote plus author follow on a small stagger.
- Every handover ends exactly on a whole timeline unit, and the snap points sit on those same units, so a snapped stop always lands on a fully settled testimonial with a comfortable reading hold.
- The hairline fill is a tween on the same timeline, so it scrubs and snaps in perfect step with the quotes.
- Before anything is hidden, the script adds `.pnt-is-live`, which switches the CSS from a flowing list to a stacked stage (every figure in the same grid cell). Both happen in the same tick, so no overlapping frame ever paints.

## Tunables
- `--pnt-num-size` sets the numeral scale, `--pnt-num-ink` its tint, `--pnt-accent` the rail fill, `--pnt-rail-track` the rail track and list dividers, `--pnt-muted` the author role color.
- Scroll length: the trigger's `end` value (`window.innerHeight * count`) decides how much scroll the section holds. Raise the multiplier for a slower, more cinematic ride.
- `scrub: 0.75` is the smoothing. Use `true` for a hard lock to the scrollbar.
- The `snap` block controls how quickly and softly the section settles on a testimonial.

## Source and license
Pattern seen on https://coffee-tech.com (Awwwards Site of the Day by
MAKETHECUT and Or Halevi), implemented here from scratch in the saltycodestudio
house style. License: MIT, original clean-room implementation by
saltycodestudio-parts. No code or assets were copied.

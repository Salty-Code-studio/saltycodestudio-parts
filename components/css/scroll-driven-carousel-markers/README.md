# Scroll-Driven Carousel Markers

A snap-scrolling carousel whose marker dots light up in perfect sync with the
scroll position, wired entirely in CSS. The scroller publishes a named scroll
timeline, and each dot animates over its own slice of it. No scroll listeners,
no IntersectionObserver, no JavaScript at all.

## What it does

- A horizontal scroller with `scroll-snap-type: x mandatory`, so the carousel
  always rests cleanly on a slide.
- A row of marker dots pinned to the bottom. As you scroll, the dot for the
  slide currently in view fills with the active color and scales up, live,
  even mid-swipe.
- Each dot is a real link to its slide, so clicking a marker scrolls the
  carousel there (smoothly, when the visitor allows motion).

## How it works

Three declarations carry the whole trick:

1. The scroller declares `scroll-timeline: --sdcm x`, which turns its
   horizontal scroll position into a named progress value.
2. Timeline lookups only travel up the ancestor tree, and the markers are
   siblings of the scroller, not descendants. `timeline-scope: --sdcm` on the
   component root hoists the name so the markers can reach it.
3. Every marker runs a tiny keyframe animation with `animation-timeline: --sdcm`
   and an `animation-range` covering only its slice of the scroll, sized as
   100% divided by the slide count. The start and end keyframes are identical,
   so the dot holds its lit look for the whole slice and releases the moment
   you scroll past.

This part generalizes the original demo's hard-coded 20% slices: set the
`--sdcm-n` custom property to your slide count and the math adapts.

## Dependencies

None. Pure CSS, native browser feature.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome and Edge 115+ and Safari 26+.
Firefox has them behind a flag. All the timeline wiring sits inside
`@supports (animation-timeline: scroll())`, so browsers without support still
get a fully working experience:

- the carousel scrolls, snaps and stays keyboard-reachable,
- the marker links still jump to their slides,
- the dots simply keep their resting color instead of lighting up.

Smooth marker-click scrolling is gated behind
`prefers-reduced-motion: no-preference`. The dot highlight itself stays on for
everyone because it is state indication, not decorative motion. For full
cross-browser highlighting you can add the official
[scroll-timeline polyfill](https://github.com/flackr/scroll-timeline); the
markup and classes here work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a `<style>`).
2. Drop in the component markup. Give the carousel `--sdcm-n` matching your
   slide count, give each slide an `id`, and point each marker link at one:

   ```html
   <div class="sdcm-carousel" style="--sdcm-n: 3">
     <ul class="sdcm-entries" tabindex="0" aria-label="Featured slides">
       <li id="slide-1">First slide content</li>
       <li id="slide-2">Second slide content</li>
       <li id="slide-3">Third slide content</li>
     </ul>
     <ul class="sdcm-markers">
       <li><a href="#slide-1"><span class="sdcm-sr-only">Slide 1</span></a></li>
       <li><a href="#slide-2"><span class="sdcm-sr-only">Slide 2</span></a></li>
       <li><a href="#slide-3"><span class="sdcm-sr-only">Slide 3</span></a></li>
     </ul>
   </div>
   ```

3. Size it your way. The frame defaults to `aspect-ratio: 16 / 10`; override
   that, or set a fixed height, on `.sdcm-carousel`.
4. Theme it with custom properties on the carousel or any ancestor:

   ```css
   .sdcm-carousel {
     --sdcm-dot: rgba(28, 43, 51, 0.28);  /* resting dot */
     --sdcm-dot-active: #1f8a8a;          /* lit dot */
     --sdcm-radius: 1.25rem;              /* frame corners */
   }
   ```

5. The stylesheet indexes the first ten markers via `nth-child`. Past ten,
   set the index inline: `<li style="--i: 11">`.

Several carousels can share one page; each component root scopes its own
timeline, so instances never interfere. See `index.html` for the markup
reference and `preview.html` for a complete, self-contained demo.

## Source / credit

Adapted from "Carousel with Markers" by Bramus Van Damme on
[scroll-driven-animations.style](https://scroll-driven-animations.style/demos/carousel-with-markers/css/),
published under Apache-2.0 and made to be copied. This part strips the site
chrome, renames classes to the `sdcm-` prefix, generalizes the slide count and
restyles the demo for the Sand & Surf palette.

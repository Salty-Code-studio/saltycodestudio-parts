# CSS Horizontal Scroll Section

A section that scrolls horizontally while the page scrolls vertically, with zero
JavaScript. The native CSS scroll-driven animations API (a named
`view-timeline` plus `animation-timeline`) binds a sideways translate to the
section's own journey through the scrollport. No scroll listeners, no
IntersectionObserver, no animation library.

## What it does

- **Creates scroll room.** The outer section is stretched tall (500vh by
  default), so the page keeps scrolling vertically while the visible window
  stays put.
- **Pins the window.** A sticky inner wrapper holds a full-viewport frame in
  place for the whole ride and hides horizontal overflow.
- **Rides sideways.** A wide flex strip inside translates from left to right as
  scroll progress advances, ending with its right edge parked against the right
  edge of the viewport.

## How it works

Three nested layers, straight from the original demo:

1. `.shs-section` is stretched to `--shs-scroll-length` (500vh). A view
   timeline named `--shs-ride` tracks it as it crosses the scrollport.
2. `.shs-sticky` sticks to the top of the viewport with `overflow-x: hidden`.
3. `.shs-track` is the wide strip. Its keyframe animation ends at
   `translateX(calc(-100% + 100vw))`. The `-100%` alone would push the strip
   fully out of view, so the viewport width is added back to park the strip's
   right edge exactly against the viewport's right edge.

`animation-range: contain 0% contain 100%` plays the animation precisely while
the stretched section fully covers the scrollport, so the ride begins the
moment the section pins and finishes the moment it releases.

## Dependencies

None. Pure CSS, native browser feature.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome and Edge 115+ and Safari 26+.
Firefox has them behind a flag. All the timeline code is wrapped in
`@supports (animation-timeline: view())` plus a
`prefers-reduced-motion: no-preference` query, so:

- Browsers without support render a normal full-height band, and the strip
  stays reachable as a manual horizontal swipe (the sticky wrapper falls back
  to `overflow-x: auto`).
- Users who prefer reduced motion get the same calm, swipeable band instead of
  the scroll-linked ride.

For full cross-browser animation you can optionally load the official
[scroll-timeline polyfill](https://github.com/flackr/scroll-timeline); the
markup and classes here work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block).
2. Wrap your panels in the three-layer shell, anywhere between normal
   vertically scrolling sections:
   ```html
   <section class="shs-section" aria-label="Horizontal showcase">
     <div class="shs-sticky">
       <div class="shs-track">
         <div><h2>Panel one</h2></div>
         <figure><!-- artwork or image --></figure>
         <div><h2>Panel three</h2></div>
       </div>
     </div>
   </section>
   ```
3. Every direct child of `.shs-track` becomes one stop on the ride. By default
   each gets `min-width: 60vmax` and generous side padding; override those on
   your own panel classes as needed.
4. Tune the ride with the custom properties, on `:root` or on the section
   itself:
   ```css
   .shs-section {
     --shs-scroll-length: 400vh;    /* shorter = faster ride */
     --shs-track-width: max-content; /* fit the panels exactly */
     --shs-bg: #0f5c5c;              /* band background */
     --shs-fg: #fbf7f0;              /* band text color */
   }
   ```

Tip: the default strip width is the demo's original `250vmax`. Setting
`--shs-track-width: max-content` makes the strip exactly as wide as its
panels, which is usually what you want once you add real content. The strip
never gets narrower than the viewport thanks to a `min-width: 100%` guard.

See `index.html` for the full markup reference and `preview.html` for a
complete, self-contained demo.

## Source and credit

Adapted from the "Horizontal Scrolling Section" demo by Bramus Van Damme on
scroll-driven-animations.style:
https://scroll-driven-animations.style/demos/horizontal-section/css/

That demo is itself adapted from the original by Cameron Knight:
https://codepen.io/cameronknight/pen/qBNvrRQ

License: Apache-2.0 (the demo code is published to be copied), adapted here
with credit. Class names were renamed with the `shs-` prefix and the fallback
plus reduced-motion guards were added for this library.

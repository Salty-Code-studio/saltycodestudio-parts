# CSS Cover Flow

The classic Cover Flow UI (once famous from iTunes) rebuilt as a pure CSS part.
A horizontal shelf of square covers scrolls sideways; each cover rotates in 3D
as it travels, straightens up and pops toward you at dead center, then rotates
away as it leaves. No JavaScript, no observers, no animation library.

## What it does

- **Per-cover `view(inline)` timelines.** Every cover tracks its own trip
  across the horizontal scrollport. The 50% mark of the keyframes is the exact
  center of the shelf, so one animation choreographs enter, feature, and exit.
- **One keyframe track.** `scf-rotate-cover` moves the cover from
  `translateX(-100%) rotateY(-45deg)` through a straight, scaled-up center
  pose (`translateZ(1em) scale(1.5)`) and out the other side, mirrored.
- **Scroll snapping.** `scroll-snap-type: x mandatory` on the shelf plus
  `scroll-snap-align: center` on each item keeps one cover featured at rest.
- **Reflections.** `-webkit-box-reflect` paints the glassy floor reflection
  under each cover, entirely in CSS.
- **The child-transform trick** (straight from the original demo): transforms
  live on the `.scf-cover` child, never on the `<li>`. Transforming the `<li>`
  would change the scroller's total scroll distance and flicker. The `<li>`
  boxes stay put; only the art rotates, so the 3D never fights the scroll.

## Dependencies

None. Pure CSS, native browser feature.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome and Edge 115+, Safari 26+, and sit
behind a flag in Firefox. The animation block is wrapped in
`@supports (animation-timeline: view())` plus a
`prefers-reduced-motion: no-preference` check, so:

- Browsers without support get a plain horizontal shelf with snapping intact,
  fully readable and usable.
- Users who prefer reduced motion get the same calm, flat shelf.
- The reflection (`-webkit-box-reflect`) renders in WebKit and Blink browsers;
  Firefox simply shows no reflection, which reads fine.

For older browsers you can optionally load the
[flackr/scroll-timeline polyfill](https://github.com/flackr/scroll-timeline);
the markup and classes here work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block).
2. Add the shelf markup. Each `<li>` holds one square cover, which can be an
   `<img>`, an inline `<svg>`, or a styled `<div>`:
   ```html
   <div class="scf" role="region" aria-label="Album covers" tabindex="0">
     <ul class="scf-covers">
       <li><img class="scf-cover" src="cover-1.jpg" alt="Album one" /></li>
       <li><img class="scf-cover" src="cover-2.jpg" alt="Album two" /></li>
       <li><img class="scf-cover" src="cover-3.jpg" alt="Album three" /></li>
     </ul>
   </div>
   ```
   The `tabindex="0"` makes the shelf keyboard scrollable: focus it and use
   the arrow keys.
3. Tune the shelf with two custom properties on `.scf`:
   ```css
   .scf {
     --scf-cover-size: 12rem; /* square cover edge length */
     --scf-span: 5;           /* cover widths the shelf spans */
   }
   ```
4. Give it a dark backdrop if you want the full jukebox feel; the reflection
   gradient is tuned for it. See `index.html` for the minimal reference and
   `preview.html` for a complete, self-contained demo with inline SVG covers.

## Source and license

Recreated from the Cover Flow demo by Bramus Van Damme on
scroll-driven-animations.style:
https://scroll-driven-animations.style/demos/cover-flow/css/

License: Apache-2.0 (demo by Bramus Van Damme, scroll-driven-animations.style),
adapted with credit. Class names were renamed with the `scf-` prefix, site
chrome removed, and the album art replaced with self-contained placeholder art.

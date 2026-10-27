# Scroll 3D Object Explorer

A horizontal scroll-snap "shelf" where each card carries a product built from
pure CSS 3D. As a card travels through the scroller it spins its object a full
450 degrees, wipes its title in and out, and fades its caption up right around
the snap point. Everything runs on the native CSS scroll-driven animations API
(named view timelines). No JavaScript, no 3D library, no images.

## What it does

- **Scroll-snap explorer.** An `.s3d-explorer` panel holds full-width cards on
  one row with `scroll-snap-type: x mandatory`, plus a closing "fin." snap stop
  generated with `::after` (customize it via the `--s3d-fin` custom property).
- **A view timeline per card.** Each `.s3d-card` declares
  `view-timeline: --s3d-card inline`, turning its horizontal progress through
  the scroller into an animation clock that all of its descendants can use.
- **Scroll-driven 3D spin.** The `.s3d-object` inside each card animates a
  `rotateY` keyframe against that timeline. It rotates from 225deg to minus
  225deg across the cover range, so the product faces you dead-center exactly
  when the card snaps.
- **Choreographed text.** The `h2` title clips in while the card enters and
  clips out while it exits. The `footer` caption fades in and out in a narrow
  window around the middle, same ranges as the original demo.
- **Three placeholder products, all self-contained.** A six face cuboid box, a
  hologram cross of three intersecting SVG surfboard planes, and a hexagonal
  tin with a striped label plus a clip-path lid. All divs, gradients and inline
  SVG in the Sand & Surf palette. Swap in your own art or real product shots.

The core wiring is tiny:

```css
.s3d-card {
  view-timeline: --s3d-card inline;
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .s3d-object {
      animation: s3d-spin linear both;
      animation-timeline: --s3d-card;
    }
  }
}
```

## Dependencies

None. Pure CSS, native browser features (scroll snap, CSS 3D transforms,
scroll-driven animations).

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome and Edge 115+ and Safari 26+.
Firefox has them behind a flag. The whole engine is wrapped in
`@supports (animation-timeline: view())` plus a
`prefers-reduced-motion: no-preference` media query, so:

- Browsers without support still get a fully working, snapping product
  scroller. Objects sit in a handsome static three-quarter pose, and titles
  and captions are simply always visible.
- Users who prefer reduced motion get that same calm static presentation.

For full cross-browser animation you can optionally load the
[flackr/scroll-timeline polyfill](https://github.com/flackr/scroll-timeline);
the markup and classes here work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block).
2. Add the scroller with an intro card and one card per product:

   ```html
   <section class="s3d-explorer" tabindex="0" role="region"
            aria-label="Product explorer, scrolls horizontally">

     <div class="s3d-card">
       <h1>Object Explorer</h1>
       <em class="s3d-hint">Scroll sideways<b>&#8596;</b></em>
     </div>

     <div class="s3d-card">
       <h2>Product name</h2>
       <div class="s3d-stage" aria-hidden="true">
         <div class="s3d-object s3d-box">
           <div class="s3d-face s3d-face--front"><!-- your art --></div>
           <div class="s3d-face s3d-face--back"></div>
           <div class="s3d-face s3d-face--left"></div>
           <div class="s3d-face s3d-face--right"></div>
           <div class="s3d-face s3d-face--top"></div>
           <div class="s3d-face s3d-face--bottom"></div>
         </div>
       </div>
       <footer><p>One line about the product.</p></footer>
     </div>

   </section>
   ```

3. Pick an object variant per card: `s3d-box` (cuboid, six `.s3d-face` divs),
   `s3d-planes` (intersecting `.s3d-plane` divs holding inline SVG, set
   `--s3d-i` to 0, 1, 2 for the 60 degree fan), or `s3d-hex` (six `.s3d-face`
   divs with `--s3d-i` 0 through 5, plus one `.s3d-face--lid`). `index.html`
   has all three written out, art included.
4. Tune to taste. Box proportions live in `--s3d-w`, `--s3d-h` and `--s3d-d`,
   the tin in `--s3d-side` and `--s3d-hh`. The Sand & Surf colors are custom
   properties on `.s3d-explorer`, so retheming is one override away. The end
   card text comes from `--s3d-fin`.

A note on scrolling: the panel scrolls on its inline axis, so users swipe,
drag, or shift-scroll through it. The intro card's animated hint makes that
obvious, keep it (or something like it) in place.

## Source / inspiration

Adapted from the "3D Shoe Explorer" demo by Bramus Van Damme on
scroll-driven-animations.style:
https://scroll-driven-animations.style/demos/3d-shoe-explorer/css/

The original displays glTF shoe models through `<model-viewer>` and syncs
their orientation with a JavaScript helper (`trackProgress` from
`@bramus/sda-utilities`) that reads the progress of an empty timeline-bound
animation every frame. This part keeps the scroller, the timeline wiring and
the title and caption choreography faithful, but swaps the models for CSS 3D
objects, which lets the rotation bind directly to the view timeline and
removes the need for any script.

License: Apache-2.0 (original demo), adapted with credit.

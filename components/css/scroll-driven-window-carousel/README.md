# Window Parallax Carousel

A horizontal scroll-snap carousel where every slide is a little window. The
artwork inside each frame is wider than the frame itself, so as a slide travels
across the strip the image pans from its right edge to its left edge. Pure CSS,
zero JavaScript: the pan is an `object-position` keyframe animation whose
progress is driven by the image's own horizontal View Timeline,
`animation-timeline: view(x)`.

## What it does

- A `<ul>` becomes a sideways scroll-snap strip; the centered slide snaps into
  place on touch and trackpad.
- Each slide clips a landscape image inside a portrait frame. `object-fit:
  cover` scales the art to the frame height, so the extra width hangs outside
  the window.
- As the slide crosses the scrollport, a keyframe animation moves
  `object-position` from `100% 50%` (right edge) to `0% 50%` (left edge). The
  browser links the animation to scroll position, so the art glides behind the
  frame in perfect sync with your drag.
- A rotated `.wpc-tag` label sits along the left edge of each frame, gallery
  style. It is optional.

## How the trick works

```css
/* At rest, show the right edge of the (wider-than-frame) image */
.wpc-slide > img {
  object-fit: cover;
  object-position: 100% 50%;
}

/* Scroll progress, not time, drives the pan */
@keyframes wpc-pan {
  from { object-position: 100% 50%; }
  to   { object-position: 0% 50%; }
}
.wpc-slide > img {
  animation: wpc-pan linear both;
  animation-timeline: view(x); /* tracks the image across the x scrollport */
}
```

`view(x)` attaches the animation to the nearest ancestor that scrolls
horizontally (the `.wpc-slides` strip), and maps the image's journey across
that scrollport to animation progress. No observers, no listeners, no library.

## Dependencies

None. Native CSS only.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome/Edge 115+ and Safari 26+. Firefox
has them behind a flag. The pan is wrapped in both
`@supports (animation-timeline: view())` and
`@media (prefers-reduced-motion: no-preference)`, so:

- Browsers without support still get a fully working scroll-snap carousel;
  each image simply shows its right-edge crop, which is a complete picture.
- Visitors who prefer reduced motion get the same calm, static carousel.

If you need the pan everywhere today, the official
[flackr scroll-timeline polyfill](https://github.com/flackr/scroll-timeline)
works with this markup and CSS unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block).
2. Add the strip anywhere in your page. Keep it inside a width-constrained
   wrapper so the strip itself scrolls, not the page:

   ```html
   <ul class="wpc-slides" tabindex="0" aria-label="Image carousel, scrolls sideways">
     <li class="wpc-slide">
       <img src="wide-art-1.jpg" alt="Describe the image" draggable="false">
       <span class="wpc-tag">01 Daybreak</span>
     </li>
     <li class="wpc-slide">
       <img src="wide-art-2.jpg" alt="Describe the image" draggable="false">
       <span class="wpc-tag">02 Rollers</span>
     </li>
     <!-- more slides -->
   </ul>
   ```

3. Use landscape images, roughly 3:2 or wider. The wider the art relative to
   the portrait frame, the longer and more dramatic the pan. The placeholder
   art in `index.html` and `preview.html` is inline SVG (data URIs) in the
   Sand & Surf palette, so the part ships with zero image assets; swap in your
   own photography.
4. Tune the look with the custom properties on `.wpc-slides`:

   ```css
   .wpc-slides {
     --wpc-slide-w: 280px;                      /* frame width */
     --wpc-slide-h: calc(var(--wpc-slide-w) * 1.4); /* frame height */
     --wpc-gap: 1.5rem;                         /* space between frames */
     --wpc-radius: 18px;                        /* frame corner radius */
   }
   ```

The `tabindex="0"` plus `aria-label` on the list lets keyboard users focus the
strip and scroll it with the arrow keys.

See `index.html` for the minimal markup reference and `preview.html` for a
complete, self-contained Sand & Surf demo page.

## Source / credit

Adapted from the "Parallax Carousel" demo by Bramus Van Damme on
[scroll-driven-animations.style](https://scroll-driven-animations.style/demos/parallax-carousel/css/).
Licensed Apache-2.0, adapted with credit. Site chrome, polyfills and remote
images were removed; the technique and markup structure are kept faithful.

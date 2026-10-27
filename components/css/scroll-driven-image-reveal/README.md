# Scroll-Driven Image Reveal

Images fade in and open like a curtain as they enter the viewport. The whole
effect is two CSS declarations deep: an `opacity` fade plus a `clip-path`
inset that shrinks from a letterboxed slit to nothing, both interpolated along
a named **CSS view timeline**. No IntersectionObserver, no scroll listeners,
no JavaScript at all.

## What it does

Every element carrying `.imr-reveal` gets its own view timeline
(`view-timeline-name`), which tracks the element's journey through the
viewport. The reveal animation is linked to that timeline and scoped to a
window with `animation-range: entry 25% cover 50%`, so the unveiling starts
once a quarter of the image has entered and finishes when the image reaches
the middle of the screen. Scroll back up and it politely closes again, the
animation is bound to scroll position, not to time.

Two tuning knobs are exposed as custom properties:

- `--imr-hide-y` (default `45%`), how much is clipped from top and bottom at
  the start.
- `--imr-hide-x` (default `20%`), how much is clipped from the sides.

Bigger values mean the image starts as a narrower slit.

## Dependencies

None. Pure CSS, native browser feature.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome and Edge 115+, and Safari 26+.
Firefox has the feature behind a flag. Everything here is wrapped in
`@supports (animation-timeline: view())` plus a
`prefers-reduced-motion: no-preference` media query, so:

- Browsers without support render the finished, fully visible images. Nothing
  is ever stuck half-clipped or invisible.
- Users who prefer reduced motion get the calm static layout too.

If you need the animation everywhere today, the
[flackr/scroll-timeline polyfill](https://github.com/flackr/scroll-timeline)
supports this exact pattern; the markup and classes work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block). The Sand & Surf tokens at the top only feed the optional
   frame styles, swap or delete them freely.
2. Add `imr-reveal` to any image or media block:

   ```html
   <figure class="imr-frame">
     <img src="photo.jpg" alt="A wave breaking over the reef"
          width="1080" height="720" class="imr-reveal" />
     <figcaption class="imr-caption">Opens like a curtain on scroll.</figcaption>
   </figure>
   ```

3. Vary the starting slit per element with inline custom properties:

   ```html
   <img src="photo-2.jpg" alt="" class="imr-reveal"
        style="--imr-hide-y: 30%; --imr-hide-x: 35%" />
   ```

4. It works on any block, not just `<img>`. Inline SVG, `<video>`, a gradient
   card, whatever you want unveiled:

   ```html
   <div class="imr-reveal">…your media…</div>
   ```

Tune when the reveal plays by editing the `animation-range` keywords in
`styles.css` (`entry 25% cover 50%` by default). See `index.html` for the
markup reference and `preview.html` for a complete, self-contained demo page.

## Source and credit

Adapted from the "Image Reveal" demo by Bramus Van Damme on
[scroll-driven-animations.style](https://scroll-driven-animations.style/demos/image-reveal/css/),
published under Apache-2.0 and made to be copied. Class names were renamed to
the `imr-` prefix, the effect gained tuning knobs and an `@supports` plus
reduced-motion guard, and all demo imagery was replaced with self-contained
inline SVG art in the Sand & Surf palette.

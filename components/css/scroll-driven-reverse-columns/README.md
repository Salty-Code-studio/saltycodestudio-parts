# Reverse-Scrolling Columns

A three column gallery where the middle column follows your scroll and the two
outer columns glide the opposite way. The whole trick is one keyframe animation
attached to the page scroll with `animation-timeline: scroll(root block)`.
No JavaScript, no observers, no scroll listeners.

## What it does

- **Three column grid.** One `.rsc-columns` wrapper holds three flex
  `.rsc-column` stacks of `.rsc-item` figures.
- **Counter-scroll.** Columns marked `.rsc-reverse` are translated from
  `calc(-100% + 100vh)` to `calc(100% - 100vh)` as the document scrolls.
  Shifting a column up by its own height puts it fully off-screen, and adding
  `100vh` pulls it back so its bottom edge kisses the bottom of the viewport.
  The end keyframe is the mirror image. Interpolating between the two against
  the scroll timeline makes the column move upward while you scroll down.
- **Order flip.** Reversed columns get `flex-direction: column-reverse` so
  their first item sits at the bottom, which is where a reversed column starts
  reading. The wrapper hides vertical overflow so the translated columns never
  stretch the page.

## Dependencies

None. Pure CSS, native browser feature.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome and Edge 115+, and in Safari 26+.
Firefox has them behind a flag. The motion is wrapped in
`@supports (animation-timeline: scroll())` plus a
`prefers-reduced-motion: no-preference` media query, so:

- Browsers without support render a normal three column grid that scrolls
  with the page, complete and readable.
- Users who prefer reduced motion get the same calm static grid.

For older browsers you can optionally add the
[flackr scroll-timeline polyfill](https://github.com/flackr/scroll-timeline);
this markup and CSS work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block).
2. Add the three columns and mark the outer two as reversed:
   ```html
   <div class="rsc-columns">
     <div class="rsc-column rsc-reverse"> ...items... </div>
     <div class="rsc-column">             ...items... </div>
     <div class="rsc-column rsc-reverse"> ...items... </div>
   </div>
   ```
3. Fill each column with items. Any art works: images, inline SVG, video,
   or a plain gradient div like the demos use:
   ```html
   <figure class="rsc-item">
     <div class="rsc-art"><img src="your-image.jpg" alt="" /></div>
     <figcaption class="rsc-caption"><span>Title</span> <span>2026</span></figcaption>
   </figure>
   ```
4. Make sure each column is taller than the viewport (roughly four or more
   tall tiles), otherwise the counter-scroll has no distance to travel.
5. Tune with the custom properties: `--rsc-gap`, `--rsc-maxw`,
   `--rsc-column-offset` (the vertical peek offset), `--rsc-art-ratio`, and
   `--rsc-radius`.

Two things worth knowing. The animation tracks the root scroller, so the
effect is at its best when the columns are the main content of the page (put
fixed chrome on top like `preview.html` does). And the start and end
translations use `100vh`, so if you move this into a nested scroll container
you will want to swap `scroll(root block)` for `scroll(nearest block)` and
adjust the `100vh` to match that scroller.

See `index.html` for the minimal markup reference and `preview.html` for a
complete, self-contained Sand & Surf demo.

## Source and credit

Adapted from the "Reverse scrolling columns" demo by Bramus Van Damme on
[scroll-driven-animations.style](https://scroll-driven-animations.style/demos/reverse-scroll/css/),
published under Apache-2.0 and made to be copied. Class names were prefixed,
site chrome removed, and the artwork replaced with self-contained gradient
tiles in the Sand & Surf palette.

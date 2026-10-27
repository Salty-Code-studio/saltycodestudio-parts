# Cover Card to Fixed Header

A full-viewport cover hero that shrinks, darkens and docks into a slim fixed
page header as you scroll, powered entirely by the native CSS
**scroll-driven animations** API (`animation-timeline: scroll()`).
No JavaScript, no observers, no scroll listeners.

## What it does

- **The dock.** The cover starts at `height: 100vh` and collapses to a fixed
  `10vh` header over the first `90vh` of scrolling, set with the
  `animation-range` property. Scroll back up and it grows right back, frame
  by frame, because the animation is scrubbed by scroll position.
- **The parallax.** The background artwork (an inline SVG seascape shipped as
  a data URI, no external images) is much taller than wide. The keyframes pan
  `background-position` from top to bottom while the card shrinks.
- **The darkening.** `background-color` animates toward a deep ink teal, and
  `background-blend-mode: soft-light` lets that color tint the artwork, so the
  white title stays readable at every height.
- **The type.** The title is sized in `em` against the cover's own
  `font-size`, and the keyframes animate that single property from hero scale
  down to header scale.
- **The tagline.** An optional `.cvh-sub` line fades out and collapses over
  the first `35vh`, so the docked bar shows the title only.

## Why fixed instead of sticky

Straight from the original demo's explanation: you cannot use
`position: sticky` here, because animating the cover's `height` would shrink
the entire document and change the available scroll distance mid-animation.
Instead the cover is `position: fixed`, and the content wrapper
(`.cvh-content`) gets `padding-top: 100vh` so the page does not jump up when
the cover leaves the normal flow.

## Dependencies

None. Pure CSS, native browser feature.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome and Edge 115+, and Safari 26+.
Firefox has them behind a flag. Everything stateful here lives inside
`@supports (animation-timeline: scroll())` plus a
`prefers-reduced-motion: no-preference` media query, so:

- Browsers without support render a normal, static full-height hero followed
  by the content in regular document flow. Complete and readable, nothing
  overlaps.
- Users who prefer reduced motion get the same static layout.

For older browsers you can optionally add the
[flackr/scroll-timeline polyfill](https://github.com/flackr/scroll-timeline);
the classes and keyframes here work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block).
2. Make your hero the cover, right at the top of `<body>`:
   ```html
   <header class="cvh-cover">
     <div class="cvh-cover-inner">
       <h1 class="cvh-title">Your title</h1>
       <p class="cvh-sub">Optional tagline, fades out as the cover docks</p>
     </div>
   </header>
   ```
3. Wrap everything that follows the cover in the content container:
   ```html
   <main class="cvh-content">
     <!-- the rest of your page -->
   </main>
   ```
   This matters: the wrapper carries the `100vh` offset once the cover goes
   fixed, so content outside it would hide underneath the cover.
4. Scroll. The dock plays out over the first `90vh`, so any page taller than
   about two viewports shows the full effect.

## Tuning

- **Docked height:** set `--cvh-docked` on `.cvh-cover` (default `10vh`).
- **Scroll distance:** change `animation-range: 0vh 90vh` in the guarded
  block. Longer ranges make the dock feel slower.
- **Docked type size:** the `font-size: 1.3rem` in the `to` keyframe of
  `cvh-dock`.
- **Artwork:** swap the `background-image` data URI for your own image. Keep
  `background-size: cover` and pick something clearly taller than wide,
  otherwise the `background-position` pan has no room to move.
- **Colors:** the `--cvh-*` tokens at the top of `styles.css` hold the whole
  Sand & Surf palette, including `--cvh-abyss`, the color the docked header
  settles on.

A note on performance: the keyframes animate `height` and `font-size`, which
trigger layout. For one header element this is fine in practice (it is how
the original demo works too), but keep heavy content out of the cover itself.

See `index.html` for the minimal markup and `preview.html` for a complete,
self-contained demo page.

## Source and credit

Adapted from "Cover Card to Fixed Header", a demo by Bramus Van Damme on
scroll-driven-animations.style:
https://scroll-driven-animations.style/demos/cover-to-fixed-header/css/

License: Apache-2.0 (the demo code is published to be copied), adapted with
credit. The markup was restructured with part-specific class names, the photo
was replaced with inline SVG art, and the effect was wrapped in `@supports`
and reduced-motion guards.

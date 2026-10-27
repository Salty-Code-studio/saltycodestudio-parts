# Scroll-Driven Progress Bar

A reading-progress indicator: a slim bar fixed to the top of the viewport that
fills from left to right as the document scrolls. At the top of the page it is
empty, at the very bottom it spans the full width. Pure CSS, powered by the
native scroll-driven animations API. No scroll listeners, no
requestAnimationFrame, no JavaScript at all.

## What it does

- Creates a named Scroll Progress Timeline on the root element with
  `scroll-timeline: --sdp-page-scroll block`.
- Attaches a two-frame keyframe animation (`scaleX(0)` to `scaleX(1)`) to that
  timeline via `animation-timeline`, so the browser maps scroll position
  directly to animation progress.
- Animates `transform`, not `width`, so the bar stays composited and updates
  off the main thread, staying perfectly smooth even while the page is busy.

## Dependencies

None. Pure CSS, native browser feature.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome and Edge 115+ and in Safari 26+.
Firefox has the feature behind a flag. Everything here is wrapped in
`@supports (animation-timeline: scroll())` plus a
`prefers-reduced-motion: no-preference` media query, so:

- Browsers without support keep the bar collapsed (`scaleX(0)`), which means
  they simply never see it. The page itself renders complete and readable.
- Users who prefer reduced motion get the same quiet, bar-free page. If you
  consider the indicator essential you can remove that media query, since the
  bar only ever moves in step with the user's own scrolling.

For full cross-browser coverage today you can optionally load the official
[scroll-timeline polyfill](https://github.com/flackr/scroll-timeline); the
markup and CSS here work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block).
2. Add the bar once, right after the opening `<body>` tag:
   ```html
   <div class="sdp-bar" aria-hidden="true"></div>
   ```
3. That's it. Scroll any page taller than the viewport and the bar fills.

### Customizing

Three custom properties control the look, settable on the element or any
ancestor:

```html
<div class="sdp-bar" aria-hidden="true"
     style="--sdp-height: 4px; --sdp-fill: #0f5c5c; --sdp-z: 300"></div>
```

- `--sdp-height` controls thickness (default `6px`).
- `--sdp-fill` accepts any color or gradient (default is a Sand & Surf teal
  gradient).
- `--sdp-z` sets the stacking level (default `100`), raise it above any fixed
  site header.

### Tracking a nested scroll container instead

The part tracks the document by default. To track an inner scroller, move the
`scroll-timeline` declaration from `html` onto that element and place the bar
inside it with `position: sticky; top: 0`. If the bar cannot live inside the
scroller, set `timeline-scope: --sdp-page-scroll` on a shared ancestor so the
named timeline reaches it.

See `index.html` for the markup reference and `preview.html` for a complete,
self-contained long-read demo.

## Source and credit

Adapted from the "Progress Bar" demo by Bramus Van Damme on
[scroll-driven-animations.style](https://scroll-driven-animations.style/demos/progress-bar/css/),
licensed Apache-2.0 and adapted here with credit. Class names were prefixed
(`sdp-`), the bar was rethemed to Sand & Surf, and the timeline hookup was
wrapped in progressive-enhancement guards so unsupported browsers degrade
cleanly.

# CSS Scroll Shadows

The classic scroll-shadow affordance, finally without JavaScript. Any scrollable
container gets a soft shadow at its top and bottom edge, but only while more
content is actually hiding in that direction. Scroll to the end and the bottom
shadow melts away. Scroll back up and the top one goes. Containers that are too
short to scroll show no shadows at all. No scroll listeners, no
IntersectionObserver, no resize math, just CSS.

## What it does

- Paints the shadows as generated content (`::before` / `::after`) pinned to
  the container edges with `position: sticky`, each drawn as a soft radial
  gradient that fades to fully transparent.
- Publishes a named Scroll Progress Timeline on the container with
  `scroll-timeline: --sds-timeline y`, then drives each shadow's opacity from
  it. The top shadow fades in over the first `1em` of scrolling
  (`animation-range: 1em 2em`), the bottom one plays the same fade in reverse
  over the last `1em`, so each edge only signals when there is somewhere left
  to go.
- Detects whether the container can scroll at all. Scroll-driven animations
  only activate when there is scrollable overflow, so a no-op animation sets a
  "space toggle" custom property (`--sds-can-scroll`) that flips the shadows'
  `visibility` on. Short containers never activate it and stay clean. The
  technique is described in detail at https://brm.us/css-can-scroll.

## Dependencies

None. Pure CSS, native browser feature.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome and Edge 115+ and in Safari 26+.
Firefox has the feature behind a flag. Everything here is wrapped in
`@supports (animation-timeline: scroll())` plus a
`prefers-reduced-motion: no-preference` media query, so:

- Browsers without support simply render a normal scrollable panel with no
  shadows. Content stays complete, readable and scrollable everywhere.
- Users who prefer reduced motion get the same quiet panels. The shadows only
  ever move in step with the user's own scrolling, so if you consider the
  affordance essential you can remove that media query.

For full cross-browser coverage today you can optionally load the official
[scroll-timeline polyfill](https://github.com/flackr/scroll-timeline); the
markup and CSS here work with it unchanged.

One build note: the scroll detection relies on a custom property whose value is
a single space (`--sds-can-scroll: ;`). Some aggressive CSS minifiers strip
that space, so check the output if the shadows ever refuse to show after a
production build.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block).
2. Add the class to any element that scrolls vertically and make sure it has a
   height or max-height so it can overflow:
   ```html
   <div class="sds-scroller" style="max-height: 16rem"
        tabindex="0" role="region" aria-label="Long article">
     <p>Long content…</p>
     <p>More content…</p>
   </div>
   ```
3. That's it. Shadows appear at whichever edge hides more content, and panels
   that do not overflow show none.

The `tabindex="0"` plus `role="region"` and a label keep the scroll region
reachable by keyboard and announced by screen readers. Skip them only when the
scroller already contains focusable elements.

### Customizing

Three custom properties control the look, settable on the scroller or any
ancestor:

```html
<div class="sds-scroller"
     style="max-height: 16rem;
            --sds-shadow-rgb: 46 195 195;
            --sds-shadow-alpha: 0.45;
            --sds-shadow-size: 1rem">
  …
</div>
```

- `--sds-shadow-rgb` sets the shadow color as bare `r g b` channels
  (default `14 58 64`, Sand & Surf deep teal). On dark panels, switch to a
  bright channel set and the shadow reads as a glow.
- `--sds-shadow-alpha` sets the strength (default `0.28`).
- `--sds-shadow-size` sets the height of each shadow strip (default `0.75rem`).

Two layout notes. The shadow strips are in-flow, so they double as top and
bottom padding inside the scroller; give the container horizontal padding only
(for example `padding: 0 1rem`) and let the strips handle the vertical
breathing room. And the fade distance is the `1em` / `2em` pair in the
`animation-range` declarations, so raise those values for a lazier fade.

See `index.html` for the markup reference and `preview.html` for a complete,
self-contained demo page.

## Source and credit

Adapted from the "Scroll Shadows" demo by Bramus Van Damme on
[scroll-driven-animations.style](https://scroll-driven-animations.style/demos/scroll-shadows/css/),
licensed Apache-2.0 and adapted here with credit. The can-scroll detection
follows his write-up at [brm.us/css-can-scroll](https://brm.us/css-can-scroll).
Class names were prefixed (`sds-`), the shadow color, strength and size were
lifted into custom properties and rethemed to Sand & Surf, and the whole
timeline hookup was wrapped in progressive-enhancement guards so unsupported
browsers degrade cleanly.

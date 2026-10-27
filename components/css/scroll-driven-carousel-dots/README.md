# Scroll-Driven Carousel Dots

Step indicator dots that track a horizontally scroll-snapping carousel with
zero JavaScript. The track publishes a named CSS Scroll Progress Timeline and
the active dot glides across the rail as you swipe, always in perfect sync
with the scroll position (not with discrete "slide changed" events, so it even
tracks mid-swipe). A second flavor renders the original growing step bar: it
starts at 1/N of the width to say "slide 1 of N" and fills completely when the
last slide is in view.

## What it does

- **Dots rail** (default): a frosted pill overlay with one grey dot per slide
  and a teal thumb that glides from dot to dot as the carousel scrolls.
- **Bar variant**: the exact mechanic from the source demo, a bar that scales
  from `1 / var(--sdc-slides)` up to full width via `transform: scaleX()`.
- **Scroll snapping**: the track uses `scroll-snap-type: x mandatory` so
  slides always settle cleanly.
- No IntersectionObserver, no scroll listeners, no library. The browser drives
  the indicator off the scroll position on the compositor.

## How it works (the clever bit)

The indicator lives inside the scrolling track but is absolutely positioned,
so its containing block is the `.sdc` wrapper (`position: relative`). That is
why it stays put while the slides scroll underneath it.

It is also why an anonymous timeline like
`animation-timeline: scroll(nearest inline)` would fail here: the `nearest`
lookup walks the containing block chain, and for an absolutely positioned
element that chain skips the scroller and lands on the wrapper. A named
timeline walks the element tree instead, so it finds the track:

```css
.sdc-track {
  scroll-timeline: --sdc-carousel inline; /* publish horizontal progress */
}
.sdc-thumb {
  animation: auto sdc-glide linear forwards;
  animation-timeline: --sdc-carousel;     /* subscribe to it */
}
```

This insight comes straight from Bramus Van Damme's original demo notes.
Because named timelines resolve to the nearest ancestor that declares them,
you can put as many carousels on one page as you like; each indicator finds
its own track.

## Dependencies

None. Pure CSS, native browser features.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome/Edge 115+ and Safari 26+. Firefox
has them behind the `layout.css.scroll-driven-animations.enabled` flag. All
timeline wiring here sits inside `@supports (animation-timeline: scroll())`
plus a `prefers-reduced-motion: no-preference` media query, so:

- Unsupported browsers never see the indicators (they are `display: none` by
  default and only revealed inside the guard). Instead, a thin native
  scrollbar stays visible and the carousel remains a fully usable, swipeable
  snap scroller. Nothing looks broken.
- Users who prefer reduced motion get the same calm fallback.

For full cross-browser indicators you can optionally load the
[flackr/scroll-timeline polyfill](https://github.com/flackr/scroll-timeline);
the markup and classes here work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block).
2. Mark up the carousel. Set `--sdc-slides` to the slide count and give the
   rail one `.sdc-dot` per slide:

   ```html
   <div class="sdc" style="--sdc-slides: 3">
     <div class="sdc-track" role="region" aria-label="Photo carousel, 3 slides" tabindex="0">
       <div class="sdc-dots" aria-hidden="true">
         <span class="sdc-dot"></span>
         <span class="sdc-dot"></span>
         <span class="sdc-dot"></span>
         <span class="sdc-thumb"></span>
       </div>
       <div class="sdc-slide"><img src="one.jpg" alt="First slide" /></div>
       <div class="sdc-slide"><img src="two.jpg" alt="Second slide" /></div>
       <div class="sdc-slide"><img src="three.jpg" alt="Third slide" /></div>
     </div>
   </div>
   ```

3. Prefer the growing bar? Replace the whole `.sdc-dots` rail with a single
   element:

   ```html
   <div class="sdc-bar" aria-hidden="true"></div>
   ```

4. Tune the knobs on `.sdc`: `--sdc-dot-size` and `--sdc-dot-gap` control the
   rail geometry (the glide distance is computed from them, so the thumb
   always lands exactly on each dot), `--sdc-radius` rounds the carousel, and
   the four color properties restyle it away from Sand & Surf.

Keep `--sdc-slides` in sync with the real number of `.sdc-slide` elements,
it drives both the bar's starting width and the thumb's travel distance.
The `tabindex="0"` on the track lets keyboard users focus it and scroll with
arrow keys; keep it in place.

See `index.html` for a minimal runnable example (it links `styles.css` and
uses inline SVG placeholder slides) and `preview.html` for a complete,
self-contained demo page.

## Source and credit

Adapted from the "Horizontal Carousel" demo by Bramus Van Damme on
[scroll-driven-animations.style](https://scroll-driven-animations.style/demos/horizontal-carousel/css/).
The original is published under the Apache-2.0 license and was made to be
copied; this part restyles it for Sand & Surf, renames the classes to the
`sdc-` prefix, and adds the dots-rail flavor on top of the original bar.

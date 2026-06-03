# SVG Line Draw on Scroll

An SVG path (or several) that progressively draws itself in sync with scroll — ideal for connecting timeline sections, tracing a coastline/route, or animating line illustrations as the reader moves down the page. Scrub it backward and it un-draws.

## How it works

Every targeted path is primed so its `stroke-dasharray` and `stroke-dashoffset` both equal `path.getTotalLength()` — making the whole stroke "hidden" off the end of the dash. A GSAP **ScrollTrigger** with `scrub: true` then tweens `stroke-dashoffset` back to `0`, revealing the stroke exactly in step with scroll position. Because it's scrubbed, scrolling up reverses the draw.

This implementation uses **core GSAP only** (no DrawSVGPlugin needed), but the same markup also works with DrawSVGPlugin if you prefer:

```js
gsap.from('.draw-on-scroll path', { drawSVG: 0, scrollTrigger: { trigger: '.draw-on-scroll', scrub: true } });
```

A **no-library, pure-CSS variant** is included in `styles.css` using `animation-timeline: view()` — add the `draw-on-scroll--css` class and set `--path-length` per path.

## Dependencies

- `gsap`
- `gsap/ScrollTrigger`

(No DrawSVGPlugin required. The CSS-only variant needs nothing.)

## Files

- `animation.js` — `initSvgLineDraw(options)`, the canonical copy-paste init.
- `styles.css` — base path styles + the pure-CSS scroll-timeline fallback + reduced-motion handling.

## Paste-in instructions

1. Add an SVG with class `draw-on-scroll` and one or more stroked `<path fill="none">` elements:

   ```html
   <svg class="draw-on-scroll" viewBox="0 0 1000 420" fill="none">
     <path d="M40 330 C 150 300, 180 200, 300 210 S 460 320, 560 250"
           stroke="#1f8a8a" stroke-width="5" />
   </svg>
   ```

2. Include `styles.css`, then load GSAP + ScrollTrigger, then `animation.js`:

   ```html
   <link rel="stylesheet" href="styles.css" />
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
   <script src="animation.js"></script>
   ```

3. Initialise once the DOM is ready:

   ```js
   initSvgLineDraw();
   // or, scoped + custom range:
   initSvgLineDraw({
     pathSelector: '.timeline .draw-on-scroll path',
     trigger: '.timeline',
     start: 'top 70%',
     end: 'bottom 80%'
   });
   ```

### Options

| option         | default                 | description                                            |
| -------------- | ----------------------- | ------------------------------------------------------ |
| `pathSelector` | `.draw-on-scroll path`  | which strokes to draw (works on `circle` too)          |
| `trigger`      | closest `.draw-on-scroll` | element whose scroll drives the draw                 |
| `start`        | `top 80%`               | ScrollTrigger start                                    |
| `end`          | `bottom 60%`            | ScrollTrigger end                                      |
| `scrub`        | `true`                  | `true` for 1:1, or a number of seconds for smoothing   |
| `markers`      | `false`                 | ScrollTrigger debug markers                            |

Paths are grouped by their `trigger`, so multiple illustrations on one page each scrub independently. When several paths share a trigger they draw with a small stagger.

## Accessibility

Respects `prefers-reduced-motion: reduce` in both `animation.js` and `styles.css`: the finished art is shown immediately with no progressive draw.

## Source / inspiration

- GSAP DrawSVGPlugin docs — https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/

License: GSAP and the (formerly premium) DrawSVGPlugin are now free for everyone under the standard GSAP license. This part is an original reimplementation using the `stroke-dashoffset` idiom on core GSAP; the pure-CSS variant is an unrestricted public-domain CSS idiom. MIT — reimplemented.

# Layered Zoom Scroll

A cinematic trailing-zoom hero. Six stacked duplicate image layers start at
descending scales (1 → ~0.15) with progressive blur, then scale to 1 / zero
blur as you scroll. A single ScrollTrigger broadcasts a shared CSS
`--progress` variable (0–1) that simultaneously scales the central masked
subject and parts the split headline halves. ScrollSmoother adds inertia.

## Files

- `animation.js` — the part. Exports `initLayeredZoomScroll(options)` which
  returns a `cleanup()` function.
- `styles.css` — layout + the duotone/vignette styling that consumes
  `--progress`.
- `preview.html` — standalone demo (open in a browser). Uses brand-tinted
  inline SVG "photos" so it needs no remote images.

## Dependencies

- `gsap` (3.12+)
- `gsap/ScrollTrigger`
- `gsap/ScrollSmoother` (optional — degrades gracefully if absent; note this
  was a Club GSAP plugin and is now free for everyone)

## Paste-in instructions

1. Drop the markup scaffold into your page (the wrapper/content pair is what
   ScrollSmoother needs):

   ```html
   <div id="smooth-wrapper">
     <div id="smooth-content">
       <section class="lzs" data-lzs>
         <div class="lzs__stage">
           <div class="lzs__layers">
             <!-- repeat ~6 times, deepest last -->
             <div class="lzs__layer" style="--img:url(/img/a.jpg)"></div>
           </div>
           <figure class="lzs__subject"
                   style="--img:url(/img/hero.jpg); --mask:url(/mask.svg)"></figure>
           <h1 class="lzs__title">
             <span class="lzs__word lzs__word--a">SALTY</span>
             <span class="lzs__word lzs__word--b">SURF</span>
           </h1>
           <div class="lzs__hint">Scroll <span></span></div>
         </div>
         <div class="lzs__spacer"></div>
       </section>
       <!-- rest of page -->
     </div>
   </div>
   ```

2. Import the styles and register GSAP, then init:

   ```js
   import { gsap } from "gsap";
   import { ScrollTrigger } from "gsap/ScrollTrigger";
   import { ScrollSmoother } from "gsap/ScrollSmoother";
   import { initLayeredZoomScroll } from "./animation.js";
   import "./styles.css";

   const cleanup = initLayeredZoomScroll({ gsap, ScrollTrigger, ScrollSmoother });
   // call cleanup() on unmount / route change
   ```

   When loading via plain `<script>` tags (UMD), the function picks GSAP up
   off `window` automatically — just call `initLayeredZoomScroll()`.

## Options

| option | default | meaning |
| --- | --- | --- |
| `layerCount` | `6` | how many stacked layers to seed |
| `minLayerScale` | `0.15` | start scale of the deepest layer |
| `maxBlur` | `18` | px blur on the deepest layer |
| `subjectStartScale` | `0.62` | start scale of the masked subject |
| `wordTravel` | `26` | vw each headline half travels apart |
| `scrub` | `1.1` | ScrollTrigger scrub smoothing |

## Accessibility

Respects `prefers-reduced-motion: reduce` — every layer, the subject, and the
headline are resolved to their finished state with no scroll-driven motion and
the scroll-hint chevron stops bobbing.

## Source / inspiration

Reimplemented from the Codrops tutorial
"Building a Layered Zoom Scroll Effect with GSAP ScrollSmoother and
ScrollTrigger" — https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/

License: Codrops tutorial code is reusable; credits the original Telescope
site authors for the concept. GSAP and its plugins (including ScrollSmoother)
are now free for everyone. This is a clean reimplementation, not the verbatim
tutorial source.

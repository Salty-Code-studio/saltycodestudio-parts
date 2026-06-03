# SVG Text Clip Reveal

Large display type used as an SVG `<clipPath>` over an image/pattern layer. As
the user scrolls, GSAP ScrollTrigger drives a horizontal **wipe** that opens the
mask while the type drifts one way and the background image counter-parallaxes
the other — so the picture appears to slide *through* the letterforms.

- **Category:** motion · **Tier:** showcase
- **Files:** `animation.js`, `styles.css`
- **Deps:** `gsap`, `gsap/ScrollTrigger`

## Preview

Open `preview.html` in a browser. It is fully self-contained (GSAP loaded from
CDN, two reveal blocks with inline SVG patterns, plus a tall scrollable page) and
uses the "Sand & Surf" palette. Scroll to watch the words `SALTY` and `SURF`
wipe open over teal wave/dot patterns.

## How it works

1. The headline lives inside an SVG `<clipPath>`.
2. A media layer (`<rect>` with a pattern, an `<image>`, or even a clipped video)
   is rendered with `clip-path="url(#…)"` so it only shows *inside* the letters.
3. ScrollTrigger scrubs three things in sync as the section passes the viewport:
   - the clip group (the text) drifts horizontally,
   - the media drifts the opposite way (parallax),
   - a CSS custom property `--stcr-wipe` animates `0% → 100%`, which a
     `linear-gradient` mask on the SVG uses to wipe the whole thing in.

`prefers-reduced-motion: reduce` is respected: the block renders fully revealed
with no wipe or scroll-driven motion.

## Paste-in instructions

1. Add the deps and register the plugin:

   ```js
   import gsap from "gsap";
   import { ScrollTrigger } from "gsap/ScrollTrigger";
   gsap.registerPlugin(ScrollTrigger);
   ```

   (Or load both from a CDN — see `preview.html`.)

2. Copy `styles.css` and `animation.js` into your project.

3. Add a reveal block. Note the required hooks:
   `data-stcr` (the section), `data-stcr-clip-group` (group inside `<clipPath>`),
   `data-stcr-text` (the `<text>`), and `data-stcr-media` (the clipped layer).

   ```html
   <section class="stcr" data-stcr>
     <svg class="stcr__svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
       <defs>
         <clipPath id="my-clip">
           <g data-stcr-clip-group>
             <text class="stcr__text" x="600" y="300" data-stcr-text>SALTY</text>
           </g>
         </clipPath>
       </defs>

       <!-- optional ink outline so the word always reads -->
       <text class="stcr__text stcr__ghost" x="600" y="300">SALTY</text>

       <!-- the media revealed through the letters -->
       <g clip-path="url(#my-clip)">
         <image data-stcr-media href="/surf.jpg"
                x="-120" y="-60" width="1440" height="720"
                preserveAspectRatio="xMidYMid slice" />
       </g>
     </svg>
   </section>
   ```

   Give each block a **unique `clipPath` id**. Swap the `<image>` for a
   `<rect fill="url(#pattern)">` or a `<foreignObject>`/`<video>` as needed.

4. `animation.js` auto-inits on `DOMContentLoaded`. To customise, call it
   yourself (in a framework, after mount):

   ```js
   import { initSvgTextClipReveal } from "./animation.js";
   const triggers = initSvgTextClipReveal({
     drift: 120,      // px the type drifts across the scroll
     mediaDrift: 90,  // px the background counter-parallaxes
     scrub: 1,        // ScrollTrigger scrub (true | number)
     start: "top bottom",
     end: "bottom top"
   });
   // cleanup: triggers.forEach(t => t.kill());
   ```

## Notes

- For crisp masking, keep the `<text>` and the `viewBox` proportional; this part
  assumes a `2:1` viewBox.
- The CSS-property wipe (`--stcr-wipe`) is animated via GSAP's CSS-var support,
  so no extra plugin is needed.

## Source / inspiration

Technique adapted from Codrops:
[Experimental On-Scroll Text Animations with SVG clip-path](https://tympanus.net/codrops/2024/01/10/experimental-on-scroll-text-animations-with-svg-clip-path/).
Reimplemented from scratch. Codrops/Tympanus license: free for personal and
commercial use; do not redistribute as-is.

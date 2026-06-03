# Gravity Mouse Trail

Images burst from the cursor as it moves, then fall under simulated gravity, bounce off the bottom of the viewport, and fade away. The "gravity" is a pure GSAP-ease illusion — an elastic entrance, horizontal drift carried from the cursor's momentum, and a `back.in` fall-and-bounce whose strength scales with how high the image was born. No physics engine, no `requestAnimationFrame` loop.

## Dependencies

- [GSAP 3](https://gsap.com/) (core only — no plugins)

## Files

- `animation.js` — the canonical effect (`initGravityMouseTrail`)
- `styles.css` — base styles for the stage + spawned images

## How it works

On `mousemove` the handler accumulates pointer travel and, once it passes a threshold (default `innerWidth / 8`), spawns one preloaded image at the cursor. Each image gets its own GSAP timeline:

1. **Burst** — `elastic.out` scale from 0 to 1.
2. **Drift** — horizontal `x` shift + spin driven by the cursor's `deltaX` momentum.
3. **Fall + bounce** — `y` tweens to the stage floor with `back.in(overshoot)`; the overshoot (bounce) grows with fall distance, so images born high drop harder.
4. **Settle** — a quick scale-down and fade as it lands, then the element removes itself.

A live-image cap (`maxOnScreen`) protects performance. `prefers-reduced-motion` is respected: images simply fade in and out at the cursor with no flight or bounce.

## Paste-in instructions

1. Add GSAP to your page:

   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
   ```

2. Copy `animation.js` and `styles.css` into your project and include them.

3. Add a positioned stage element where the trail should live (often a full-viewport layer behind your content):

   ```html
   <div class="gmt-stage" id="trail" aria-hidden="true"></div>
   ```

   ```css
   .gmt-stage { position: fixed; inset: 0; overflow: hidden; z-index: 0; }
   /* Keep foreground content above it and let clicks pass through the stage. */
   ```

4. Initialize with your own images:

   ```js
   import { initGravityMouseTrail } from "./animation.js";

   const trail = initGravityMouseTrail(document.getElementById("trail"), {
     images: ["/img/a.jpg", "/img/b.jpg", "/img/c.jpg"],
     size: 110,        // rendered px (optional)
     threshold: 180,   // px of cursor travel before next spawn (optional)
     gravity: 1,       // higher = snappier fall (optional)
     maxOnScreen: 30,  // live-image cap (optional)
   });

   // trail.destroy(); // remove listeners + clear images when tearing down
   ```

   Without the module system, `animation.js` also exposes `window.initGravityMouseTrail`.

Open `preview.html` in a browser for a working Sand & Surf demo (images are generated inline, so it runs with no asset files).

## Source / inspiration

Inspired by Codrops / Tympanus — ["Made with GSAP: Building a Fun Gravity-Based Mouse Trail"](https://tympanus.net/codrops/2026/05/20/made-with-gsap-building-a-fun-gravity-based-mouse-trail/). Reimplemented cleanly in original code. Codrops/Tympanus license: free for personal and commercial use, no redistribution as-is.

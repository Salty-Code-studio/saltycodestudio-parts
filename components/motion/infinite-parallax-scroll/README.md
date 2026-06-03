# Infinite Parallax Scroll

Fullscreen sections that loop endlessly with eased, mandatory snapping, while
each section's inner media drifts at a slower rate to fake real depth. Scroll
past the last frame and you wrap seamlessly back to the top — the story never
ends.

## How it works

- **Seamless loop** — duplicate your *first* section and append it as the
  *last* child of the scroll container. Lenis runs with `infinite: true`, so
  when scroll reaches the bottom it teleports back to the top. Because the
  trailing clone is identical to the first real frame, the jump is invisible.
- **Parallax depth** — each `.ips__media` is 120% tall and is animated from
  `yPercent: -50` to `+50` with a GSAP `fromTo` + `ScrollTrigger` (`scrub: true`).
  It moves slower than the scroll, so foreground content reads against a drifting
  backdrop.
- **Mandatory snap** — Lenis Snap (the `lenis/snap` add-on) snaps to whole
  viewport heights with an eased cubic-bezier, so the page always rests on a
  clean fullscreen frame.
- **iOS Safari fix** — `ScrollTrigger.scrollerProxy(document.documentElement, …)`
  proxies the scroll position through Lenis. This keeps parallax start/end math
  accurate while the mobile address bar collapses/expands and avoids the nested
  scroll-container jitter that breaks ScrollTrigger on iOS.
- **Reduced motion** — when `prefers-reduced-motion: reduce` is set, Lenis,
  the loop and the parallax are all skipped, the trailing clone is removed, and
  the page degrades to plain, fully legible stacked sections with native scroll.

## Dependencies

- [`gsap`](https://gsap.com/) + `gsap/ScrollTrigger`
- [`lenis`](https://lenis.darkroom.engineering/) + the `lenis/snap` add-on

CDN (used in `preview.html`):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis-snap.min.js"></script>
```

The UMD builds expose `Lenis` and `Snap` as globals, which `animation.js` reads.

## Paste-in instructions

1. Add `styles.css` and `animation.js` to your project.

2. Mark up your scroll container. **Duplicate the first section as the last
   child** and tag the clone with `data-ips-clone`:

   ```html
   <main class="ips" data-ips>
     <section class="ips__section">
       <div class="ips__media"><img src="/a.jpg" alt="" /></div>
       <div class="ips__content"><h2 class="ips__title">Coast</h2></div>
     </section>
     <section class="ips__section">
       <div class="ips__media"><img src="/b.jpg" alt="" /></div>
       <div class="ips__content"><h2 class="ips__title">Lagoon</h2></div>
     </section>
     <!-- clone of the FIRST section, appended last -->
     <section class="ips__section" data-ips-clone>
       <div class="ips__media"><img src="/a.jpg" alt="" /></div>
       <div class="ips__content"><h2 class="ips__title">Coast</h2></div>
     </section>
   </main>
   ```

3. Initialise after the libraries have loaded:

   **Plain script** — `animation.js` auto-exposes `window.initInfiniteParallaxScroll`:

   ```html
   <script type="module" src="animation.js"></script>
   <script type="module">
     initInfiniteParallaxScroll(); // returns { lenis, snap, destroy }
   </script>
   ```

   **Bundler / ES module:**

   ```js
   import Lenis from 'lenis';
   import Snap from 'lenis/snap';
   import { gsap } from 'gsap';
   import { ScrollTrigger } from 'gsap/ScrollTrigger';
   import { initInfiniteParallaxScroll } from './animation.js';

   // animation.js reads the globals `Lenis`, `Snap`, `gsap`, `ScrollTrigger`.
   // If you import them as modules, attach them to window first:
   Object.assign(window, { Lenis, Snap, gsap, ScrollTrigger });

   const ctrl = initInfiniteParallaxScroll();
   // ...later, on teardown / route change:
   ctrl?.destroy();
   ```

Options: `initInfiniteParallaxScroll({ root, parallaxRange, snapDuration, snapEase, lerp })`.

## Source / inspiration

Inspired by Codrops / Tympanus — *"The Never-Ending Story: Building a Seamless
Infinite Scroll Experience with GSAP & Lenis"*
(https://tympanus.net/codrops/2026/05/28/the-never-ending-story-building-a-seamless-infinite-scroll-experience-with-gsap-lenis/).
Reimplemented cleanly in our own code. Codrops/Tympanus license: demo code is
free for personal and commercial use; not redistributed as-is.

/* Scroll 360 Turntable · saltycodestudio
 * A pinned hero where a product spins a full 360 degrees as you scroll,
 * driven by a GSAP ScrollTrigger scrub. The layered headline fades and
 * letter-spaces out slightly as the spin progresses.
 *
 * Requires: gsap, gsap/ScrollTrigger.
 *
 * Two modes, one call:
 *   initTurntable()                      CSS-3D mode: rotateY-spins the
 *                                        .turntable-object built from faces.
 *   initTurntable({ frames: [urls] })    Frame-sequence mode: swaps preloaded
 *                                        frame images by scrub progress, for
 *                                        real 360 product shoots.
 *
 * Frame convention: frame 0 is 0 degrees and the set covers one full turn
 * without a duplicate closing frame, so wrapping with modulo lands the end
 * of the scrub back on frame 0 (a seamless 360).
 *
 * Reduced motion: no pin and no spin. The CSS resting angle (or the first
 * frame) stays on screen and the headline remains fully readable.
 */

export function initTurntable(options = {}) {
  const opts = Object.assign({
    root: document,             // scope for querySelectorAll
    section: '.turntable-section',
    object: '.turntable-object',
    headline: '.turntable-headline',
    frames: null,               // array of image urls enables frame mode
    turns: 1,                   // full rotations across the pin
    scrollLength: 3,            // pin distance, in multiples of section height
    headlineSpacing: '0.18em',  // letter-spacing the headline drifts toward
    headlineFade: 0.55,         // share of the scrub the fade occupies (0 to 1)
  }, options);

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[scroll-360-turntable] GSAP and ScrollTrigger are required.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frames = Array.isArray(opts.frames) && opts.frames.length ? opts.frames : null;

  opts.root.querySelectorAll(opts.section).forEach((section) => {
    const object = section.querySelector(opts.object);
    const headline = section.querySelector(opts.headline);

    let frameImg = null;
    let loaded = null;

    if (frames) {
      // Frame-sequence mode. Reuse an existing <img class="turntable-frame">
      // or create one inside the scene (falls back to the section).
      frameImg = section.querySelector('.turntable-frame');
      if (!frameImg) {
        frameImg = document.createElement('img');
        frameImg.className = 'turntable-frame';
        frameImg.alt = '';
        frameImg.decoding = 'async';
        (section.querySelector('.turntable-scene') || section).appendChild(frameImg);
      }
      // Preload every frame once so scrubbing never waits on the network.
      loaded = frames.map((src) => {
        const im = new Image();
        im.decoding = 'async';
        im.src = src;
        return im;
      });
      frameImg.src = loaded[0].src;
      section.classList.add('turntable--frames');
    }

    if (!frames && !object) return;

    if (prefersReduced) {
      // Static fallback: the page flows normally, nothing pins or spins.
      section.classList.add('turntable--static');
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + section.offsetHeight * opts.scrollLength,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    if (frames) {
      const count = loaded.length;
      const state = { p: 0 };
      let current = 0;
      tl.to(state, {
        p: 1,
        duration: 1,
        onUpdate() {
          const i = Math.round(state.p * count * opts.turns) % count;
          if (i !== current) {
            current = i;
            frameImg.src = loaded[i].src;
          }
        },
      }, 0);
    } else {
      tl.fromTo(object,
        { rotationY: 0 },
        { rotationY: 360 * opts.turns, duration: 1 },
        0);
    }

    if (headline) {
      tl.to(headline, {
        opacity: 0,
        letterSpacing: opts.headlineSpacing,
        duration: Math.max(0.1, Math.min(1, opts.headlineFade)),
      }, 0);
    }
  });
}

if (typeof window !== 'undefined') {
  window.initTurntable = initTurntable;
}

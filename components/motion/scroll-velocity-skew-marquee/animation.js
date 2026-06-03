/*
 * Scroll Velocity Skew Marquee
 * --------------------------------
 * An infinite horizontal marquee whose text skews and stretches in proportion
 * to scroll velocity, then snaps back upright when scrolling stops.
 *
 * How it works:
 *  - A base track tween loops the marquee row continuously (xPercent: -50 over a
 *    duplicated row of content, giving a seamless infinite scroll).
 *  - ScrollTrigger.getVelocity() is read on every update. We map that raw
 *    velocity to a skewX angle (clamped to ~ -20..20 deg) and a subtle scaleY
 *    stretch, applied through gsap.quickTo for cheap, high-frequency setting.
 *  - The base loop's timeScale is also nudged by scroll direction so the text
 *    physically leans into the direction you scroll.
 *  - A debounced snap-back tween eases skew + stretch back to rest once the
 *    scroll velocity settles, so the marquee "rights itself" on stop.
 *
 * Dependencies: gsap, gsap/ScrollTrigger
 *
 * Markup expected (see styles.css for matching classes):
 *   <div class="svm" data-svm>
 *     <div class="svm__track" data-svm-track>
 *       <span class="svm__item">Sand &amp; Surf &middot;</span>
 *       ... (repeat enough items to overflow the viewport) ...
 *     </div>
 *   </div>
 *
 * Provide TWO identical rows of items inside the track (or call
 * duplicateTrack: true) so the -50% loop is seamless.
 */

/* global gsap, ScrollTrigger */

export function initScrollVelocitySkewMarquee(root, options = {}) {
  if (!root) return () => {};

  const cfg = {
    baseSpeed: 18,        // seconds for one full loop at timeScale 1
    velocityToSkew: 0.018, // raw px/s velocity -> degrees (before clamp)
    maxSkew: 20,          // degrees of skewX at full lean
    maxStretch: 0.18,     // extra scaleY at full lean (1 + this)
    timeScaleBoost: 4,    // how hard scroll direction speeds the loop
    snapDuration: 0.7,    // seconds for the snap-back to rest
    direction: 1,         // 1 = scrolls left, -1 = scrolls right (rest dir)
    duplicateTrack: false, // auto-clone the row for a seamless loop
    ...options,
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[scroll-velocity-skew-marquee] gsap + ScrollTrigger required.');
    return () => {};
  }

  gsap.registerPlugin(ScrollTrigger);

  const track = root.querySelector('[data-svm-track]') || root.firstElementChild;
  if (!track) return () => {};

  // Respect reduced-motion: show a static, readable marquee and bail out.
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    gsap.set(track, { xPercent: 0, skewX: 0, scaleY: 1 });
    return () => {};
  }

  // Optionally duplicate the row so a -50% loop wraps seamlessly.
  if (cfg.duplicateTrack) {
    track.innerHTML += track.innerHTML;
  }

  // --- Base infinite loop ---------------------------------------------------
  // The track holds 2x content; animating xPercent 0 -> -50 and repeating
  // produces a seamless infinite scroll.
  const loop = gsap.to(track, {
    xPercent: -50 * cfg.direction,
    repeat: -1,
    duration: cfg.baseSpeed,
    ease: 'none',
  });

  // quickTo gives us a reusable, cheap setter for high-frequency updates.
  const setSkew = gsap.quickTo(track, 'skewX', {
    duration: 0.4,
    ease: 'power3.out',
  });
  const setStretch = gsap.quickTo(track, 'scaleY', {
    duration: 0.4,
    ease: 'power3.out',
  });

  let snapTimer = null;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // Ease skew + stretch back to rest, and let the loop settle to base speed.
  function snapBack() {
    setSkew(0);
    setStretch(1);
    gsap.to(loop, {
      timeScale: cfg.direction,
      duration: cfg.snapDuration,
      ease: 'power2.out',
    });
  }

  // --- Velocity-driven distortion ------------------------------------------
  const st = ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = self.getVelocity(); // px/s, signed by scroll direction

      // Map velocity -> skew angle, clamped for taste.
      const skew = clamp(
        velocity * cfg.velocityToSkew,
        -cfg.maxSkew,
        cfg.maxSkew,
      );

      // Stretch scales with the magnitude of the lean.
      const stretch = 1 + (Math.abs(skew) / cfg.maxSkew) * cfg.maxStretch;

      // Lean the marquee + push the loop faster in the scroll direction.
      setSkew(skew);
      setStretch(stretch);

      const dir = velocity > 0 ? 1 : -1;
      const boost =
        cfg.direction * (1 + (Math.abs(skew) / cfg.maxSkew) * cfg.timeScaleBoost);
      loop.timeScale(dir < 0 ? -boost : boost);

      // Debounced snap-back: when updates stop arriving, right the text.
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(snapBack, 120);
    },
  });

  // --- Teardown -------------------------------------------------------------
  return function destroy() {
    if (snapTimer) clearTimeout(snapTimer);
    st.kill();
    loop.kill();
    gsap.set(track, { clearProps: 'transform' });
  };
}

// Optional auto-init: any element with [data-svm] is wired up on load.
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-svm]').forEach((el) => {
      // data-svm-duplicate="true" enables auto-cloning of the row.
      const duplicateTrack = el.getAttribute('data-svm-duplicate') === 'true';
      initScrollVelocitySkewMarquee(el, { duplicateTrack });
    });
  });
}

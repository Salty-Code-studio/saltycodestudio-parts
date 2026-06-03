/*
 * SVG Text Clip Reveal
 * --------------------
 * Large display type is used as an SVG <clipPath> over an image/pattern layer.
 * As the user scrolls, GSAP ScrollTrigger drives a clip-path "wipe" that opens
 * the mask so the background slides through the letterforms.
 *
 * Two coordinated motions run on scrub:
 *   1. the whole clip group translates (parallax-ish drift of the type), and
 *   2. a rectangular wipe expands over the background so the image is revealed
 *      only inside the letters as they move into view.
 *
 * Markup contract (see README for the full snippet):
 *
 *   <section class="stcr" data-stcr>
 *     <svg class="stcr__svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
 *       <defs>
 *         <clipPath id="stcr-clip">
 *           <text class="stcr__text" x="50%" y="50%" data-stcr-text>SALTY</text>
 *         </clipPath>
 *       </defs>
 *       <!-- background layer, clipped to the text -->
 *       <image class="stcr__media" data-stcr-media
 *              href="..." x="-15%" y="0" width="130%" height="100%"
 *              clip-path="url(#stcr-clip)" preserveAspectRatio="xMidYMid slice" />
 *     </svg>
 *   </section>
 *
 * Deps: gsap, gsap/ScrollTrigger (both registered before init).
 */

(function () {
  'use strict';

  /**
   * Initialise every [data-stcr] block on the page.
   * @param {object} [opts]
   * @param {number} [opts.drift=120]   how far (px in viewBox units) the type drifts horizontally
   * @param {number} [opts.mediaDrift=90] how far the background image counter-parallaxes
   * @param {string} [opts.scrub=true|number] ScrollTrigger scrub value
   * @param {string} [opts.start='top bottom'] ScrollTrigger start
   * @param {string} [opts.end='bottom top']   ScrollTrigger end
   * @returns {Array} created ScrollTrigger instances (for cleanup)
   */
  function initSvgTextClipReveal(opts) {
    opts = opts || {};
    var drift = opts.drift != null ? opts.drift : 120;
    var mediaDrift = opts.mediaDrift != null ? opts.mediaDrift : 90;
    var scrub = opts.scrub != null ? opts.scrub : 1;
    var start = opts.start || 'top bottom';
    var end = opts.end || 'bottom top';

    if (typeof gsap === 'undefined') {
      console.warn('[svg-text-clip-reveal] GSAP not found.');
      return [];
    }
    // ScrollTrigger may be auto-registered; register defensively.
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    var reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var blocks = Array.prototype.slice.call(
      document.querySelectorAll('[data-stcr]')
    );
    var triggers = [];

    blocks.forEach(function (block) {
      var clipGroup = block.querySelector('[data-stcr-clip-group]');
      var textEl = block.querySelector('[data-stcr-text]');
      var mediaEl = block.querySelector('[data-stcr-media]');

      if (!textEl) return;

      // Reduced motion: present the revealed state, no scroll-driven animation.
      if (reduce) {
        if (clipGroup) gsap.set(clipGroup, { x: 0 });
        if (mediaEl) gsap.set(mediaEl, { x: 0 });
        block.classList.add('is-revealed');
        return;
      }

      // Animate the clip group (the text mask) drifting one way, and the
      // background media drifting the other, so the image appears to slide
      // *through* the letters as the section scrolls past.
      var driftTarget = clipGroup || textEl;

      gsap.set(driftTarget, { x: -drift / 2 });
      if (mediaEl) gsap.set(mediaEl, { x: mediaDrift / 2 });
      // Letters start tucked behind a wipe; reveal as we scroll in.
      gsap.set(block, { '--stcr-wipe': '0%' });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: block,
          start: start,
          end: end,
          scrub: scrub
        }
      });

      tl.to(
        driftTarget,
        { x: drift / 2, ease: 'none' },
        0
      );

      if (mediaEl) {
        tl.to(
          mediaEl,
          { x: -mediaDrift / 2, ease: 'none' },
          0
        );
      }

      // The wipe: a CSS custom property that some demos use to mask the SVG in.
      tl.to(
        block,
        { '--stcr-wipe': '100%', ease: 'none' },
        0
      );

      block.classList.add('is-revealed');

      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    });

    return triggers;
  }

  // UMD-ish export so it works as a module or a global.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initSvgTextClipReveal: initSvgTextClipReveal };
  } else {
    window.initSvgTextClipReveal = initSvgTextClipReveal;
  }

  // Auto-init when used as a plain <script> after DOM is ready.
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        initSvgTextClipReveal();
      });
    } else {
      initSvgTextClipReveal();
    }
  }
})();

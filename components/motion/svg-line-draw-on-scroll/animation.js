/* SVG Line Draw on Scroll — saltycodestudio
 *
 * Progressively "draws" one or more SVG paths in sync with scroll.
 *
 * Technique: every targeted path is primed with stroke-dasharray and
 * stroke-dashoffset both equal to its getTotalLength(). A ScrollTrigger
 * with scrub:true then tweens stroke-dashoffset back toward 0, so the
 * stroke is revealed exactly in step with the scroll position.
 *
 * This avoids DrawSVGPlugin entirely (so it works on the free core GSAP
 * build), but the same markup also works with DrawSVGPlugin if you prefer:
 *   gsap.from(paths, { drawSVG: 0, scrollTrigger: {...} });
 *
 * Requires (load before this file):
 *   gsap, gsap/ScrollTrigger
 */
(function (global) {
  'use strict';

  function toArray(nodes) {
    return Array.prototype.slice.call(nodes);
  }

  /**
   * Initialise scroll-driven line drawing.
   *
   * @param {Object}  [options]
   * @param {string}  [options.pathSelector='.draw-on-scroll path']  paths to draw
   * @param {string|Element} [options.trigger]  element whose scroll drives the draw
   *        (defaults to the closest .draw-on-scroll ancestor of the first path,
   *         or the path itself).
   * @param {string}  [options.start='top 80%']   ScrollTrigger start
   * @param {string}  [options.end='bottom 60%']   ScrollTrigger end
   * @param {boolean} [options.scrub=true]         scrub value (true, or seconds)
   * @param {boolean} [options.markers=false]      ScrollTrigger debug markers
   * @returns {Array} the ScrollTrigger instances created (one per trigger group)
   */
  function initSvgLineDraw(options) {
    options = options || {};

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[svg-line-draw] gsap + ScrollTrigger are required.');
      return [];
    }
    gsap.registerPlugin(ScrollTrigger);

    var pathSelector = options.pathSelector || '.draw-on-scroll path';
    var paths = toArray(document.querySelectorAll(pathSelector));
    if (!paths.length) return [];

    var reduce =
      global.matchMedia &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Prime each path: dash pattern == full length, hidden offset == full length.
    paths.forEach(function (path) {
      var len = path.getTotalLength();
      path.style.strokeDasharray = len + ' ' + len;
      path.style.strokeDashoffset = reduce ? 0 : len;
      path.style.willChange = 'stroke-dashoffset';
    });

    // Reduced motion: show finished art immediately, skip the scroll animation.
    if (reduce) return [];

    // Group paths by the trigger element so each illustration scrubs independently.
    var groups = new Map();
    paths.forEach(function (path) {
      var trig;
      if (options.trigger) {
        trig =
          typeof options.trigger === 'string'
            ? document.querySelector(options.trigger)
            : options.trigger;
      } else {
        trig = path.closest('.draw-on-scroll') || path;
      }
      if (!groups.has(trig)) groups.set(trig, []);
      groups.get(trig).push(path);
    });

    var triggers = [];
    groups.forEach(function (groupPaths, trig) {
      var st = gsap.to(groupPaths, {
        strokeDashoffset: 0,
        ease: 'none',
        stagger: groupPaths.length > 1 ? 0.05 : 0,
        scrollTrigger: {
          trigger: trig,
          start: options.start || 'top 80%',
          end: options.end || 'bottom 60%',
          scrub: options.scrub === undefined ? true : options.scrub,
          markers: !!options.markers
        }
      });
      triggers.push(st.scrollTrigger);
    });

    return triggers;
  }

  global.initSvgLineDraw = initSvgLineDraw;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = initSvgLineDraw;
  }
})(typeof window !== 'undefined' ? window : this);

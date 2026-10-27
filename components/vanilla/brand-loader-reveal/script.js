/* Brand Loader Reveal, saltycodestudio
 * A tiny dependency-free page loader. Holds a full-screen brand overlay,
 * then on window load (after a minimum display time) lifts it away like a
 * curtain and lets the hero content stagger in via CSS transition delays.
 *
 * Usage:
 *   initLoaderReveal({ minTime: 1200, onRevealed: function () {} });
 *
 * Options:
 *   minTime    minimum overlay display time in ms (default 1200)
 *   onRevealed callback fired once the overlay is gone
 *   maxWait    safety net in ms, reveals even if load hangs (default 8000)
 *   loader     CSS selector or element for the overlay (default '.blr-loader')
 *
 * The page can never be trapped: a reveal always happens on window load,
 * on the maxWait safety net, or (with no JS at all) via the 4 second CSS
 * failsafe in styles.css.
 */
(function (global) {
  'use strict';

  function initLoaderReveal(options) {
    var opts = options || {};
    var minTime = typeof opts.minTime === 'number' ? opts.minTime : 1200;
    var maxWait = typeof opts.maxWait === 'number' ? opts.maxWait : 8000;
    var onRevealed = typeof opts.onRevealed === 'function' ? opts.onRevealed : null;

    var docEl = document.documentElement;
    var loader = typeof opts.loader === 'string'
      ? document.querySelector(opts.loader)
      : (opts.loader || document.querySelector('.blr-loader'));

    // Announce that JS is in charge. This cancels the pure CSS failsafe.
    docEl.classList.add('blr-js');

    // No overlay found: reveal the content immediately and bow out.
    if (!loader) {
      docEl.classList.add('blr-revealed');
      if (onRevealed) onRevealed();
      return;
    }

    var reduceMotion = global.matchMedia &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) minTime = 0;

    // Lock body scroll while the loader is up.
    document.body.classList.add('blr-lock');

    var start = Date.now();
    var revealed = false;

    function finish() {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
      document.dispatchEvent(new CustomEvent('blr:revealed'));
      if (onRevealed) onRevealed();
    }

    function reveal() {
      if (revealed) return;
      revealed = true;

      loader.classList.add('is-revealing');   // curtain lifts (CSS)
      docEl.classList.add('blr-revealed');    // hero stagger begins (CSS)
      document.body.classList.remove('blr-lock');

      var done = false;
      function onEnd() {
        if (done) return;
        done = true;
        loader.removeEventListener('transitionend', onTransitionEnd);
        finish();
      }
      function onTransitionEnd(e) {
        // Ignore transitions bubbling up from the logo mark.
        if (e && e.target !== loader) return;
        onEnd();
      }
      loader.addEventListener('transitionend', onTransitionEnd);
      // Belt and braces in case transitionend never fires.
      setTimeout(onEnd, reduceMotion ? 500 : 1600);
    }

    function onLoaded() {
      var wait = Math.max(0, minTime - (Date.now() - start));
      setTimeout(reveal, wait);
    }

    if (document.readyState === 'complete') {
      onLoaded();
    } else {
      global.addEventListener('load', onLoaded, { once: true });
    }

    // Never hold the page hostage on a hung asset.
    setTimeout(reveal, maxWait);
  }

  global.initLoaderReveal = initLoaderReveal;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = initLoaderReveal;
  }
})(typeof window !== 'undefined' ? window : this);

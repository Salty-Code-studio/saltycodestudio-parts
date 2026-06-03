/* Preloader — saltycodestudio
 * Animates a count-up + progress sweep, then slides away on window load.
 * Always resolves (even if `load` already fired or assets hang) so the page
 * is never permanently hidden.
 */
(function () {
  'use strict';

  var el = document.getElementById('preloader');
  if (!el) return;

  var fill = el.querySelector('.preloader__fill');
  var count = el.querySelector('.preloader__count');

  // Lock scroll while loading.
  document.body.classList.add('preloader-active');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var progress = 0;          // displayed progress 0..100
  var pageLoaded = false;    // becomes true on window load
  var done = false;

  function setProgress(v) {
    progress = Math.max(0, Math.min(100, v));
    if (fill) fill.style.width = progress + '%';
    if (count) count.textContent = Math.round(progress) + '%';
  }

  function finish() {
    if (done) return;
    done = true;
    setProgress(100);

    // Small beat at 100% before the reveal.
    setTimeout(function () {
      el.classList.add('is-done');
      document.body.classList.remove('preloader-active');

      // Remove from the DOM after the exit transition.
      var removed = false;
      function cleanup() {
        if (removed) return;
        removed = true;
        if (el.parentNode) el.parentNode.removeChild(el);
        document.dispatchEvent(new CustomEvent('preloader:done'));
      }
      el.addEventListener('transitionend', cleanup, { once: true });
      // Fallback in case the transition doesn't fire.
      setTimeout(cleanup, 1000);
    }, reduceMotion ? 80 : 250);
  }

  // Tick the displayed progress upward. Creeps toward 90% while loading,
  // then races to 100% once the page is actually loaded.
  function tick() {
    if (done) return;
    var target = pageLoaded ? 100 : 90;
    var step = pageLoaded ? 6 : Math.max(0.4, (target - progress) * 0.06);
    setProgress(progress + step);

    if (pageLoaded && progress >= 99.5) {
      finish();
      return;
    }
    requestAnimationFrame(tick);
  }

  function onLoaded() {
    pageLoaded = true;
    if (reduceMotion) finish();
  }

  if (document.readyState === 'complete') {
    onLoaded();
  } else {
    window.addEventListener('load', onLoaded, { once: true });
  }

  // Safety net: never block the page for more than 6s.
  setTimeout(function () { onLoaded(); }, 6000);

  if (reduceMotion) {
    setProgress(100);
    // Wait for load (or the safety net) then finish without the count animation.
    if (pageLoaded) finish();
  } else {
    requestAnimationFrame(tick);
  }
})();

/* Scroll Theme Switch (saltycodestudio)
 * Sections declare data-theme="dark" or data-theme="light". A tiny
 * IntersectionObserver watches which section currently dominates the
 * viewport and mirrors its theme onto <html data-theme="...">. The
 * custom properties in styles.css then crossfade the whole page.
 * No dependencies. Without JS (or without IntersectionObserver) the
 * page simply stays in the light theme.
 */
(function () {
  'use strict';

  function initThemeSwitch(options) {
    var opts = options || {};
    var target = opts.target || document.documentElement;
    var selector = opts.selector || 'section[data-theme], [data-theme-section]';
    var fallback = opts.fallback || 'light';

    var sections = Array.prototype.slice
      .call(document.querySelectorAll(selector))
      .filter(function (el) { return el !== target; });

    if (sections.length === 0) return null;

    function apply(theme) {
      if (target.getAttribute('data-theme') !== theme) {
        target.setAttribute('data-theme', theme);
      }
    }

    if (!('IntersectionObserver' in window)) {
      apply(fallback);
      return null;
    }

    /* Measure how many viewport pixels each section covers right now and
       let the biggest slice win. Plain rect math keeps the answer exact
       even for sections much taller than the screen. */
    function refresh() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var best = null;
      var bestPx = 0;
      for (var i = 0; i < sections.length; i++) {
        var r = sections[i].getBoundingClientRect();
        var visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (visible > bestPx) { bestPx = visible; best = sections[i]; }
      }
      if (best) {
        apply(best.getAttribute('data-theme') ||
              best.getAttribute('data-theme-section') || fallback);
      }
    }

    /* A dense threshold list makes the observer fire often enough that
       the handoff between sections feels seamless while scrolling. */
    var thresholds = [];
    for (var t = 0; t <= 20; t++) thresholds.push(t / 20);

    var observer = new IntersectionObserver(refresh, { threshold: thresholds });
    sections.forEach(function (s) { observer.observe(s); });

    refresh();

    return {
      refresh: refresh,
      destroy: function () {
        observer.disconnect();
        target.removeAttribute('data-theme');
      }
    };
  }

  /* Auto-init. The handle lands on window.themeSwitch so a custom setup
     can call window.themeSwitch.destroy() before running its own init. */
  function boot() { window.themeSwitch = initThemeSwitch(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.initThemeSwitch = initThemeSwitch;
})();

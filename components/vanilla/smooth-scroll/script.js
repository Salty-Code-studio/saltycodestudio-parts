/* Smooth Scroll — saltycodestudio
 * Inertia scrolling: the native scrollbar still scrolls the window (body height
 * is set to the content height), and we transform a fixed wrapper toward that
 * scroll position with lerp easing.
 *
 * DISABLING:
 *   - Automatically disabled when prefers-reduced-motion is reduce, or on
 *     coarse-pointer / touch devices (native momentum is already great there).
 *   - To force-disable: don't include this script, OR set
 *     window.SMOOTH_SCROLL_DISABLED = true before it runs.
 */
(function () {
  'use strict';

  var content = document.getElementById('scroll-content');
  if (!content) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (window.SMOOTH_SCROLL_DISABLED || reduceMotion || coarsePointer) {
    // Leave native scrolling untouched.
    return;
  }

  var EASE = 0.1;            // 0..1 — higher follows faster
  var current = 0;          // animated position
  var target = 0;           // real scroll position
  var rafId = null;
  var running = false;

  function setBodyHeight() {
    // Give the document a real height so the scrollbar range matches content.
    document.body.style.height = content.getBoundingClientRect().height + 'px';
  }

  function onScroll() {
    target = window.scrollY || window.pageYOffset || 0;
    if (!running) {
      running = true;
      rafId = requestAnimationFrame(render);
    }
  }

  function render() {
    current += (target - current) * EASE;
    // Snap when close enough to avoid endless sub-pixel updates.
    if (Math.abs(target - current) < 0.1) {
      current = target;
      running = false;
    }
    content.style.transform = 'translate3d(0, ' + (-current) + 'px, 0)';
    if (running) {
      rafId = requestAnimationFrame(render);
    }
  }

  function enable() {
    document.documentElement.classList.add('has-smooth-scroll');
    setBodyHeight();
    current = target = window.scrollY || 0;
    content.style.transform = 'translate3d(0, ' + (-current) + 'px, 0)';
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  enable();

  // Recompute on resize and when content/images change size.
  window.addEventListener('resize', setBodyHeight);
  window.addEventListener('load', setBodyHeight);

  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(setBodyHeight);
    ro.observe(content);
  }

  // Make in-page anchor links land at the right place.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    var el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    var top = el.getBoundingClientRect().top + (window.scrollY || 0);
    window.scrollTo({ top: top, behavior: 'auto' });
  });

  // Expose a tiny API for teardown if a host app needs it.
  window.smoothScroll = {
    destroy: function () {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', setBodyHeight);
      if (rafId) cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('has-smooth-scroll');
      content.style.transform = '';
      document.body.style.height = '';
    },
    refresh: setBodyHeight
  };
})();

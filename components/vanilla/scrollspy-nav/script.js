/* Scrollspy Nav — saltycodestudio
 * Highlights the nav link for the section currently in view using
 * IntersectionObserver, and smooth-scrolls to anchors on click.
 * Initialises every [data-scrollspy] nav on the page.
 */
(function () {
  'use strict';

  function initSpy(nav) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    if (links.length === 0) return;

    // Map section element -> its link.
    var map = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      if (!id) return;
      var section = document.getElementById(id);
      if (section) map.push({ id: id, link: link, section: section });
    });
    if (map.length === 0) return;

    function linkFor(id) {
      for (var i = 0; i < map.length; i++) if (map[i].id === id) return map[i].link;
      return null;
    }

    function setActive(id) {
      links.forEach(function (l) { l.classList.remove('is-active'); });
      var link = linkFor(id);
      if (link) {
        link.classList.add('is-active');
        if (link.hasAttribute('aria-current')) link.removeAttribute('aria-current');
        link.setAttribute('aria-current', 'true');
      }
      links.forEach(function (l) {
        if (l !== link) l.removeAttribute('aria-current');
      });
    }

    // Track visibility ratios so the most-visible section wins.
    var visibility = {};

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        visibility[id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });

      // Pick the section with the highest visible ratio.
      var bestId = null;
      var best = 0;
      map.forEach(function (m) {
        var r = visibility[m.id] || 0;
        if (r > best) { best = r; bestId = m.id; }
      });

      if (bestId) setActive(bestId);
    }, {
      // Bias the "active" zone toward the upper-middle of the viewport.
      rootMargin: '-20% 0px -55% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
    });

    map.forEach(function (m) { observer.observe(m.section); });

    // Smooth-scroll on click (with our own handling so we can respect motion prefs).
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      e.preventDefault();
      section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      setActive(id);
      // Update the URL hash without an extra jump.
      if (history.replaceState) history.replaceState(null, '', '#' + id);
    });

    // Set an initial active state based on current scroll position.
    var initial = map[0].id;
    for (var i = 0; i < map.length; i++) {
      if (map[i].section.getBoundingClientRect().top <= window.innerHeight * 0.4) {
        initial = map[i].id;
      }
    }
    setActive(initial);
  }

  function initAll() {
    Array.prototype.slice
      .call(document.querySelectorAll('[data-scrollspy]'))
      .forEach(initSpy);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  window.Scrollspy = { init: initSpy, initAll: initAll };
})();

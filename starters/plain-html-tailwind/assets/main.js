/* ============================================================================
   saltycodestudio · plain-html-tailwind starter — PROGRESSIVE ENHANCEMENT
   ----------------------------------------------------------------------------
   Zero dependencies, no build. The page is fully usable WITHOUT this file:
     • the mobile menu degrades to a plain anchor list,
     • [data-reveal] content stays visible (styles.css only hides it once we
       flag <html data-js>), and
     • the footer year falls back to the hard-coded 2026 in the markup.

   Everything here is defensive: each feature checks its element exists before
   wiring up, so removing a section from index.html never throws.
   ============================================================================ */

(function () {
  'use strict';

  var root = document.documentElement;

  /* Honor the OS "reduce motion" setting throughout. */
  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────────────────────────────────
     1 · FLAG THAT JS IS ALIVE
     styles.css keys its reveal animation off html[data-js], so we only opt
     into "hide then animate in" once we know JS can animate it back. No-JS
     visitors never see this attribute, so their content stays visible.
     ────────────────────────────────────────────────────────────────────── */
  root.setAttribute('data-js', '');

  /* ──────────────────────────────────────────────────────────────────────
     2 · MOBILE NAV TOGGLE
     Toggles the [hidden] attribute on the menu and keeps aria-expanded in
     sync for screen readers. Closes on Escape and when a link is tapped.
     ────────────────────────────────────────────────────────────────────── */
  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-nav-menu]');

  if (toggle && menu) {
    var setMenu = function (open) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggle.addEventListener('click', function () {
      setMenu(menu.hidden); // if currently hidden, open it (and vice versa)
    });

    // Tapping any link inside the menu closes it.
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    // Escape closes and returns focus to the toggle.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !menu.hidden) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────────────
     3 · SCROLL REVEAL
     Adds .is-revealed to [data-reveal] elements as they enter the viewport.
     If IntersectionObserver is unsupported or motion is reduced, reveal
     everything immediately so nothing stays hidden.
     ────────────────────────────────────────────────────────────────────── */
  var revealables = document.querySelectorAll('[data-reveal]');

  var revealAll = function () {
    revealables.forEach(function (el) {
      el.classList.add('is-revealed');
    });
  };

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target); // reveal once, then stop watching
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    revealables.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ──────────────────────────────────────────────────────────────────────
     4 · FOOTER YEAR
     Keeps the copyright current without touching the HTML each January.
     ────────────────────────────────────────────────────────────────────── */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();

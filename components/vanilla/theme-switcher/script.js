/* Theme Switcher — saltycodestudio
 * Toggles [data-theme] on <html>, persists the choice to localStorage, and
 * follows the OS preference until the user makes an explicit choice.
 *
 * The inline <head> snippet (see index.html / README) sets the initial theme
 * BEFORE CSS loads to prevent a flash. This file handles the toggle + syncing.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'theme';
  var root = document.documentElement;

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setStored(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) setStored(theme);
    updateToggle(theme);
  }

  function updateToggle(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var isDark = theme === 'dark';
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  // Ensure an initial attribute exists even if the inline snippet was omitted.
  if (!root.getAttribute('data-theme')) {
    var sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(getStored() || (sysDark ? 'dark' : 'light'), false);
  } else {
    updateToggle(currentTheme());
  }

  // Enable transitions only after first paint so the initial load doesn't animate.
  requestAnimationFrame(function () {
    root.classList.add('theme-ready');
  });

  // Toggle on click.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('#theme-toggle');
    if (!btn) return;
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
  });

  // Follow OS changes only while the user hasn't chosen explicitly.
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function onSystemChange(e) {
    if (getStored()) return; // user override wins
    applyTheme(e.matches ? 'dark' : 'light', false);
  }
  if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
  else if (mq.addListener) mq.addListener(onSystemChange); // older Safari

  // Tiny API.
  window.ThemeSwitcher = {
    get: currentTheme,
    set: function (t) { applyTheme(t === 'dark' ? 'dark' : 'light', true); },
    toggle: function () { applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true); },
    clear: function () { // forget the override, fall back to OS
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      applyTheme(mq.matches ? 'dark' : 'light', false);
    }
  };
})();

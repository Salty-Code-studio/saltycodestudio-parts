/* Tabs — saltycodestudio
 * Accessible tabs following the WAI-ARIA tabs pattern.
 *   - Click or keyboard (Left/Right/Home/End) to navigate.
 *   - Roving tabindex; selected tab is the only one in the tab order.
 *   - A sliding indicator follows the active tab.
 * Initialises every [data-tabs] block on the page.
 */
(function () {
  'use strict';

  function initTabs(root) {
    var tablist = root.querySelector('[role="tablist"]');
    if (!tablist) return;

    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var indicator = root.querySelector('.tabs__indicator');
    if (tabs.length === 0) return;

    function panelFor(tab) {
      return document.getElementById(tab.getAttribute('aria-controls'));
    }

    function moveIndicator(tab) {
      if (!indicator) return;
      indicator.style.width = tab.offsetWidth + 'px';
      indicator.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
    }

    function selectTab(tab, setFocus) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
        t.tabIndex = selected ? 0 : -1;
        var panel = panelFor(t);
        if (panel) panel.hidden = !selected;
      });
      moveIndicator(tab);
      if (setFocus) tab.focus();
    }

    tablist.addEventListener('click', function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (tab && tabs.indexOf(tab) !== -1) selectTab(tab, false);
    });

    tablist.addEventListener('keydown', function (e) {
      var current = document.activeElement;
      var idx = tabs.indexOf(current);
      if (idx === -1) return;

      var newIdx = null;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          newIdx = (idx + 1) % tabs.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          newIdx = (idx - 1 + tabs.length) % tabs.length;
          break;
        case 'Home':
          newIdx = 0;
          break;
        case 'End':
          newIdx = tabs.length - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      selectTab(tabs[newIdx], true);
    });

    // Initial state: honour an existing aria-selected, else first tab.
    var initial = tabs.filter(function (t) {
      return t.getAttribute('aria-selected') === 'true';
    })[0] || tabs[0];
    selectTab(initial, false);

    // Keep the indicator aligned on resize / font load.
    window.addEventListener('resize', function () {
      var active = tabs.filter(function (t) {
        return t.getAttribute('aria-selected') === 'true';
      })[0];
      if (active) moveIndicator(active);
    });
    // Re-measure once fonts settle.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        var active = tabs.filter(function (t) {
          return t.getAttribute('aria-selected') === 'true';
        })[0];
        if (active) moveIndicator(active);
      });
    }
  }

  function initAll() {
    Array.prototype.slice
      .call(document.querySelectorAll('[data-tabs]'))
      .forEach(initTabs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  window.Tabs = { init: initTabs, initAll: initAll };
})();

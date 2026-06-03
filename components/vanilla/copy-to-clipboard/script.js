/* Copy to Clipboard — saltycodestudio
 * Buttons with [data-copy="text"] copy that literal text.
 * Buttons with [data-copy-target="#sel"] copy that element's text/value.
 * Uses the async Clipboard API, with a legacy execCommand fallback for
 * non-secure contexts. Shows a "Copied!" state for ~1.6s.
 */
(function () {
  'use strict';

  var RESET_MS = 1600;

  function getText(btn) {
    if (btn.hasAttribute('data-copy')) {
      return btn.getAttribute('data-copy');
    }
    var sel = btn.getAttribute('data-copy-target');
    if (sel) {
      var el = document.querySelector(sel);
      if (el) {
        if ('value' in el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
          return el.value;
        }
        return el.innerText || el.textContent || '';
      }
    }
    return '';
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      legacyCopy(text) ? resolve() : reject(new Error('Copy command failed'));
    });
  }

  function flash(btn, cls) {
    // Clear any pending reset.
    if (btn._copyTimer) clearTimeout(btn._copyTimer);
    btn.classList.remove('is-copied', 'is-error');
    btn.classList.add(cls);
    if (cls === 'is-copied') btn.setAttribute('aria-live', 'polite');
    btn._copyTimer = setTimeout(function () {
      btn.classList.remove('is-copied', 'is-error');
    }, RESET_MS);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-btn, [data-copy], [data-copy-target]');
    if (!btn) return;
    e.preventDefault();

    var text = getText(btn);
    if (!text) {
      flash(btn, 'is-error');
      return;
    }

    copyText(text).then(function () {
      flash(btn, 'is-copied');
    }).catch(function () {
      flash(btn, 'is-error');
    });
  });
})();

/* Modal Dialog — saltycodestudio
 * Accessible modal: focus trap, Esc to close, backdrop click, scroll lock.
 * Wires every [data-modal-open="ID"] trigger and every [data-modal-close]
 * element automatically. No per-modal setup needed.
 */
(function () {
  'use strict';

  var FOCUSABLE = [
    'a[href]', 'button:not([disabled])', 'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  var activeModal = null;
  var lastFocused = null;

  function getFocusable(modal) {
    return Array.prototype.slice
      .call(modal.querySelectorAll(FOCUSABLE))
      .filter(function (el) {
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
      });
  }

  function openModal(modal) {
    if (!modal || activeModal === modal) return;
    lastFocused = document.activeElement;
    activeModal = modal;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Move focus into the dialog (first focusable, else the dialog itself).
    var focusables = getFocusable(modal);
    var first = focusables[0];
    if (first) {
      first.focus();
    } else {
      var dialog = modal.querySelector('[role="dialog"]') || modal;
      dialog.setAttribute('tabindex', '-1');
      dialog.focus();
    }

    document.addEventListener('keydown', onKeydown, true);
  }

  function closeModal(modal) {
    modal = modal || activeModal;
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onKeydown, true);

    if (activeModal === modal) activeModal = null;

    // Restore focus to the trigger.
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  function onKeydown(e) {
    if (!activeModal) return;

    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      closeModal(activeModal);
      return;
    }

    if (e.key === 'Tab') {
      var focusables = getFocusable(activeModal);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      var active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !activeModal.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !activeModal.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  // Delegated handlers — work for dynamically added modals/triggers.
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-modal-open]');
    if (opener) {
      e.preventDefault();
      var id = opener.getAttribute('data-modal-open');
      var modal = document.getElementById(id);
      if (modal) openModal(modal);
      return;
    }

    var closer = e.target.closest('[data-modal-close]');
    if (closer) {
      e.preventDefault();
      var parent = closer.closest('.modal');
      closeModal(parent);
    }
  });

  // Expose a minimal API.
  window.Modal = {
    open: function (id) { openModal(document.getElementById(id)); },
    close: function (id) { closeModal(id ? document.getElementById(id) : null); }
  };
})();

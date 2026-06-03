/* Custom Cursor — saltycodestudio
 * Dot follows the pointer 1:1; ring trails via lerp.
 * Grows / changes over links, buttons and [data-cursor] elements.
 * No-ops on touch / coarse-pointer devices and when reduced motion is preferred.
 */
(function () {
  'use strict';

  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  // Bail on devices without a fine pointer (touch, etc.).
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer) return;

  document.documentElement.classList.add('has-custom-cursor');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Target = real pointer position. Ring position eases toward the target.
  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var ringX = mouseX;
  var ringY = mouseY;
  var hasMoved = false;

  // How tightly the ring follows (0..1). 1 = no lag.
  var EASE = reduceMotion ? 1 : 0.18;

  function onMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!hasMoved) {
      hasMoved = true;
      ringX = mouseX;
      ringY = mouseY;
    }
    // Dot is exact, no easing.
    dot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px) translate(-50%, -50%)';
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');
  }

  function render() {
    ringX += (mouseX - ringX) * EASE;
    ringY += (mouseY - ringY) * EASE;
    ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
    requestAnimationFrame(render);
  }

  window.addEventListener('mousemove', onMove, { passive: true });

  // Hide when the pointer leaves the document.
  document.addEventListener('mouseleave', function () {
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
  });
  document.addEventListener('mouseenter', function () {
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');
  });

  // Pressed state.
  window.addEventListener('mousedown', function () {
    ring.classList.add('is-down');
  });
  window.addEventListener('mouseup', function () {
    ring.classList.remove('is-down');
  });

  // Interactive-element detection via event delegation, so it works for
  // elements added after load.
  var interactiveSelector = 'a, button, [role="button"], input[type="submit"], input[type="button"], label[for], select, summary, [data-cursor]';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest && e.target.closest(interactiveSelector)) {
      ring.classList.add('is-active');
      dot.classList.add('is-active');
    }
  });
  document.addEventListener('mouseout', function (e) {
    // Only clear if we actually left an interactive element and didn't enter another.
    var from = e.target.closest && e.target.closest(interactiveSelector);
    var to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(interactiveSelector);
    if (from && !to) {
      ring.classList.remove('is-active');
      dot.classList.remove('is-active');
    }
  });

  requestAnimationFrame(render);
})();

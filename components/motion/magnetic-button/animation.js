/* Magnetic Button — saltycodestudio
 * Button is pulled toward the cursor on hover; label drifts a touch more.
 * Requires: gsap (no ScrollTrigger needed).
 *
 * Markup:
 *   <button class="magnetic"><span class="magnetic-label">Get in touch</span></button>
 *
 * Tunables via data attributes:
 *   data-magnetic-strength   how far the button follows the cursor   (default 0.4)
 *   data-magnetic-label      extra pull on the label for depth        (default 0.2)
 */

export function initMagneticButtons(root = document) {
  if (typeof gsap === 'undefined') {
    console.warn('[magnetic-button] GSAP not found.');
    return;
  }

  root.querySelectorAll('.magnetic').forEach((btn) => {
    const label = btn.querySelector('.magnetic-label') || btn;
    const strength = parseFloat(btn.getAttribute('data-magnetic-strength')) || 0.4;
    const labelExtra = parseFloat(btn.getAttribute('data-magnetic-label')) || 0.2;

    const xToBtn = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
    const yToBtn = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
    const xToLabel = gsap.quickTo(label, 'x', { duration: 0.6, ease: 'power3.out' });
    const yToLabel = gsap.quickTo(label, 'y', { duration: 0.6, ease: 'power3.out' });

    const onMove = (e) => {
      const r = btn.getBoundingClientRect();
      // distance of cursor from button center
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      xToBtn(relX * strength);
      yToBtn(relY * strength);
      xToLabel(relX * (strength + labelExtra));
      yToLabel(relY * (strength + labelExtra));
    };

    const onLeave = () => {
      // spring back to origin
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      gsap.to(label, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)' });
    };

    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);

    // store handlers so a teardown could remove them if needed
    btn._magneticCleanup = () => {
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    };
  });
}

if (typeof window !== 'undefined' && !window.__MAGNETIC_MANUAL__) {
  window.initMagneticButtons = initMagneticButtons;
}

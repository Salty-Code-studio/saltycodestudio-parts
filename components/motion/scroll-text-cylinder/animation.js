/* 3D Scroll Text Cylinder — saltycodestudio
 * Lines of text wrapped around an invisible 3D cylinder that rotates
 * through depth as you scroll. No WebGL — pure CSS 3D transforms + GSAP.
 *
 * Requires: gsap, gsap/ScrollTrigger.
 * Optional: gsap/ScrollSmoother (adds inertia — auto-detected if loaded).
 *
 * Markup (one line per child, any text):
 *   <section class="cyl-stage">
 *     <div class="cyl" data-cylinder>
 *       <span class="cyl-line">Sand</span>
 *       <span class="cyl-line">Surf</span>
 *       <span class="cyl-line">Salt</span>
 *       ...
 *     </div>
 *   </section>
 *
 * Then:
 *   initScrollCylinder();
 *
 * Options (per element via data-* or passed to init):
 *   data-radius   : cylinder radius in px            (default 320)
 *   data-arc      : total degrees the lines span     (default 360 = full ring)
 *   data-spin     : extra full turns across scroll    (default 1.25)
 *   data-axis     : "x" (tube tumbling toward you) or "y" (carousel)  (default "x")
 */

const DEFAULTS = { radius: 320, arc: 360, spin: 1.25, axis: 'x' };

function readOpts(el) {
  const o = { ...DEFAULTS };
  if (el.dataset.radius) o.radius = parseFloat(el.dataset.radius);
  if (el.dataset.arc) o.arc = parseFloat(el.dataset.arc);
  if (el.dataset.spin) o.spin = parseFloat(el.dataset.spin);
  if (el.dataset.axis) o.axis = el.dataset.axis;
  return o;
}

/* Position each line on the surface of the cylinder.
 * Using sin/cos to place lines around a circle, then translateZ pushes
 * them out to the radius so they sit on the curved surface. */
function layout(lines, opts) {
  const n = lines.length;
  const step = (opts.arc * (Math.PI / 180)) / Math.max(n, 1);
  // Center the arc so the middle line faces the viewer at progress 0.
  const offset = -((n - 1) * step) / 2;

  lines.forEach((line, i) => {
    const angle = offset + i * step; // radians around the axis
    const deg = angle * (180 / Math.PI);
    // sin/cos give the curved placement; translateZ lifts onto the surface.
    const rot = opts.axis === 'y' ? `rotateY(${deg}deg)` : `rotateX(${-deg}deg)`;
    line.style.transform = `${rot} translateZ(${opts.radius}px)`;
    // store its base angle so we can fade back-facing lines as we spin
    line._baseAngle = angle;
  });
}

function initOne(el, smoother) {
  const opts = readOpts(el);
  const lines = Array.from(el.querySelectorAll('.cyl-line'));
  if (!lines.length) return;

  layout(lines, opts);

  const reduce =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Spin amount across the whole scroll (radians).
  const totalSpin = opts.spin * Math.PI * 2;
  const axisProp = opts.axis === 'y' ? 'rotateY' : 'rotateX';

  // Drive a single proxy value 0 -> 1 and recompute the ring each frame.
  const state = { p: 0 };

  const apply = () => {
    const spinRad = state.p * totalSpin;
    const spinDeg = spinRad * (180 / Math.PI);
    // Rotate the whole ring.
    el.style.transform = `${axisProp}(${
      opts.axis === 'y' ? spinDeg : -spinDeg
    }deg)`;

    // Depth-fade: lines whose live angle faces away from the viewer dim out.
    lines.forEach((line) => {
      const live = line._baseAngle + (opts.axis === 'y' ? spinRad : spinRad);
      // cos(live) == 1 when facing viewer, -1 when on the far side.
      const facing = Math.cos(live);
      const opacity = reduce ? 1 : Math.max(0.04, (facing + 1) / 2);
      const blur = reduce ? 0 : (1 - Math.max(0, facing)) * 3;
      line.style.opacity = opacity.toFixed(3);
      line.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';
    });
  };

  apply();

  if (reduce) {
    // Static, readable ring — no scroll binding.
    return;
  }

  gsap.to(state, {
    p: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: el.closest('.cyl-stage') || el,
      start: 'top top',
      end: '+=' + (el.dataset.scrub || 1400),
      scrub: smoother ? 1 : true,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
    onUpdate: apply,
  });
}

export function initScrollCylinder(root = document) {
  if (typeof gsap === 'undefined') {
    console.warn('[scroll-text-cylinder] GSAP not found.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // ScrollSmoother is optional; wire it up for inertia if it's present.
  let smoother = null;
  if (typeof ScrollSmoother !== 'undefined') {
    gsap.registerPlugin(ScrollSmoother);
    smoother =
      ScrollSmoother.get() ||
      (document.querySelector('#smooth-wrapper') &&
        ScrollSmoother.create({
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          smooth: 1.1,
          effects: true,
        }));
  }

  root.querySelectorAll('[data-cylinder]').forEach((el) => initOne(el, smoother));
}

if (typeof window !== 'undefined' && !window.__CYLINDER_MANUAL__) {
  window.initScrollCylinder = initScrollCylinder;
}

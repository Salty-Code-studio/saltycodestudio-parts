/* Gravity Mouse Trail — saltycodestudio
 * Images burst from the cursor as it moves, then fall under simulated gravity,
 * bounce off the bottom of the viewport, and fade away. No physics engine — the
 * "gravity" is faked entirely with GSAP eases (back.in for the fall + bounce).
 *
 * Requires: gsap (no plugins).
 *
 * Markup: an empty stage element that fills the area you want trails in.
 *   <div class="gmt-stage" id="trail"></div>
 *
 * Usage:
 *   const trail = initGravityMouseTrail(document.getElementById('trail'), {
 *     images: ['/img/a.jpg', '/img/b.jpg', '/img/c.jpg'],
 *   });
 *   // later, if you tear the stage down:
 *   trail.destroy();
 *
 * Options (all optional):
 *   images        array of image URLs to cycle through (required to see anything)
 *   threshold     pointer travel (px) before the next image spawns
 *                 (default: window.innerWidth / 8)
 *   size          rendered image size in px (default 110)
 *   gravity       multiplier on the fall/bounce timing (default 1; higher = snappier)
 *   maxOnScreen   hard cap on live images to protect performance (default 30)
 */

export function initGravityMouseTrail(stage, options = {}) {
  if (typeof gsap === 'undefined') {
    console.warn('[gravity-mouse-trail] GSAP not found.');
    return { destroy() {} };
  }
  if (!stage) {
    console.warn('[gravity-mouse-trail] No stage element provided.');
    return { destroy() {} };
  }

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const images = options.images || [];
  const size = options.size ?? 110;
  const gravity = options.gravity ?? 1;
  const maxOnScreen = options.maxOnScreen ?? 30;
  const getThreshold = () =>
    options.threshold ?? Math.max(60, window.innerWidth / 8);

  // Preload so the burst is instant and we never spawn a half-loaded image.
  const pool = images.map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  });

  let imgIndex = 0;
  let live = 0;

  // Track pointer travel + momentum between moves.
  let lastX = null;
  let lastY = null;
  let accumulated = 0;

  function spawn(x, y, deltaX) {
    if (!pool.length || live >= maxOnScreen) return;

    const src = pool[imgIndex % pool.length].src;
    imgIndex++;

    const el = document.createElement('img');
    el.className = 'gmt-img';
    el.src = src;
    el.alt = '';
    el.setAttribute('aria-hidden', 'true');
    el.draggable = false;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    stage.appendChild(el);
    live++;

    const cleanup = () => {
      if (el.parentNode) el.parentNode.removeChild(el);
      live--;
    };

    // Reduced motion: a calm fade in/out at the cursor, no flight or gravity.
    if (prefersReduced) {
      gsap.set(el, { xPercent: -50, yPercent: -50, x, y, scale: 0.85, autoAlpha: 0 });
      gsap
        .timeline({ onComplete: cleanup })
        .to(el, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'power2.out' })
        .to(el, { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, '+=0.35');
      return;
    }

    const stageH = stage.clientHeight || window.innerHeight;
    // How far this image must fall to reach the stage floor. Bounce strength
    // scales with this so images born high fall harder — the gravity illusion.
    const fallDistance = Math.max(40, stageH - size / 2 - y);
    const fallTime = Math.min(1.4, Math.max(0.5, (fallDistance / 900) / gravity));

    // Sideways momentum carried from the cursor, clamped so it stays on-feel.
    const drift = gsap.utils.clamp(-180, 180, deltaX * 2.4);
    const spin = gsap.utils.clamp(-40, 40, deltaX * 0.6);

    gsap.set(el, {
      xPercent: -50,
      yPercent: -50,
      x,
      y,
      scale: 0,
      rotation: gsap.utils.random(-12, 12),
      autoAlpha: 1,
    });

    const tl = gsap.timeline({ onComplete: cleanup });

    // 1) Elastic burst out of the cursor.
    tl.to(el, {
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.55)',
    });

    // 2) Horizontal drift on the cursor's momentum, overlapping the entrance.
    tl.to(
      el,
      {
        x: '+=' + drift,
        rotation: '+=' + spin,
        duration: fallTime + 0.4,
        ease: 'power1.out',
      },
      0.05
    );

    // 3) Fall to the floor + bounce. back.in eases into the drop, then the
    //    overshoot reads as a bounce — its size grows with the fall distance.
    const overshoot = gsap.utils.clamp(0.8, 3.2, fallDistance / 240);
    tl.to(
      el,
      {
        y: y + fallDistance,
        duration: fallTime,
        ease: `back.in(${overshoot.toFixed(2)})`,
      },
      0.1
    );

    // 4) Settle + fade as it hits bottom.
    tl.to(
      el,
      {
        scale: 0.86,
        autoAlpha: 0,
        duration: 0.45,
        ease: 'power2.in',
      },
      '>-0.1'
    );
  }

  function onMove(e) {
    const x = e.clientX;
    const y = e.clientY;

    if (lastX === null) {
      lastX = x;
      lastY = y;
      return;
    }

    const dx = x - lastX;
    const dy = y - lastY;
    accumulated += Math.hypot(dx, dy);

    if (accumulated >= getThreshold()) {
      accumulated = 0;
      // Position relative to the stage's own box.
      const r = stage.getBoundingClientRect();
      spawn(x - r.left, y - r.top, dx);
    }

    lastX = x;
    lastY = y;
  }

  function onLeave() {
    lastX = null;
    lastY = null;
    accumulated = 0;
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);

  return {
    destroy() {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf(stage.querySelectorAll('.gmt-img'));
      stage.querySelectorAll('.gmt-img').forEach((n) => n.remove());
      live = 0;
    },
  };
}

if (typeof window !== 'undefined' && !window.__GMT_MANUAL__) {
  window.initGravityMouseTrail = initGravityMouseTrail;
}

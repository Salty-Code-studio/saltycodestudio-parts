/* Infinite Parallax Scroll — saltycodestudio
 * Fullscreen sections that loop endlessly with eased snap, while their
 * inner media drifts at a slower rate to create a seamless sense of depth.
 *
 * Requires: gsap, gsap/ScrollTrigger, lenis, lenis/snap
 * (Lenis Snap is the official add-on package "lenis/snap".)
 *
 * Markup:
 *   <main class="ips" data-ips>
 *     <section class="ips__section">
 *       <div class="ips__media"><img ... /></div>
 *       <div class="ips__content"> ...overlay... </div>
 *     </section>
 *     ...more sections...
 *   </main>
 *
 * IMPORTANT — the seamless loop:
 *   Duplicate your FIRST section and append it as the LAST child. When Lenis
 *   reaches the bottom, infinite:true teleports the scroll back to the top.
 *   Because the last (duplicate) frame is identical to the first real frame,
 *   the jump is invisible — the story never ends.
 *
 * Returns a controller with { lenis, snap, destroy() } so the host app can
 * tear everything down (e.g. on route change / HMR).
 */

export function initInfiniteParallaxScroll(options = {}) {
  const {
    root = document.querySelector('[data-ips]') || document,
    // How far the inner media travels across one section, in % of its own height.
    // The media is 120% tall, so a range of -50%..50% keeps edges covered.
    parallaxRange = 50,
    // Snap behaviour
    snapDuration = 1.1,
    snapEase = 'cubic-bezier(0.22, 1, 0.36, 1)',
    lerp = 0.1,
  } = options;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[infinite-parallax-scroll] GSAP + ScrollTrigger are required.');
    return null;
  }
  if (typeof Lenis === 'undefined') {
    console.warn('[infinite-parallax-scroll] Lenis is required (and the lenis/snap add-on for snapping).');
    return null;
  }

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sections = Array.from(root.querySelectorAll('.ips__section'));
  if (!sections.length) {
    console.warn('[infinite-parallax-scroll] No .ips__section elements found.');
    return null;
  }

  // ---- Reduced motion: skip Lenis, the seamless loop and parallax entirely.
  // The page is still fully readable as plain stacked sections with native
  // scroll. We also remove the trailing duplicate so content is not repeated.
  if (reduceMotion) {
    const dupe = root.querySelector('.ips__section[data-ips-clone]');
    if (dupe) dupe.remove();
    return { lenis: null, snap: null, destroy() {} };
  }

  // ---- Lenis smooth scroll with the seam-hiding infinite loop.
  const lenis = new Lenis({
    lerp,
    infinite: true,
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  const rafId = requestAnimationFrame(raf);

  // Keep ScrollTrigger in sync with Lenis' virtual scroll position.
  lenis.on('scroll', ScrollTrigger.update);

  // ---- iOS Safari fix: nest the scroll proxy on a real overflow container.
  // On iOS the document scroller can be hijacked by the browser chrome, which
  // breaks ScrollTrigger's start/end math. Proxying through the actual scrolled
  // node (documentElement here, since Lenis drives window scroll) keeps the
  // parallax triggers accurate while the address bar collapses/expands.
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    // pinType "transform" is the iOS-safe choice for nested scroll containers.
    pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
  });

  // ---- Parallax: drift each section's inner media slower than the scroll.
  const triggers = [];
  sections.forEach((section) => {
    const media = section.querySelector('.ips__media');
    if (!media) return;

    const tween = gsap.fromTo(
      media,
      { yPercent: -parallaxRange },
      {
        yPercent: parallaxRange,
        ease: 'none',
        scrollTrigger: {
          scroller: document.documentElement,
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  });

  ScrollTrigger.addEventListener('refresh', () => lenis.resize());
  ScrollTrigger.refresh();

  // ---- Lenis Snap: mandatory eased snapping to each fullscreen section.
  // Requires the "lenis/snap" add-on exposed as window.Snap (see preview/README).
  let snap = null;
  if (typeof Snap !== 'undefined') {
    snap = new Snap(lenis, {
      type: 'mandatory',
      lerp,
      duration: snapDuration,
      easing: cubicBezierFromCss(snapEase),
      velocityThreshold: 1,
    });
    // One snap stop per viewport height. We include the trailing duplicate so
    // the final snap lands exactly on the seam before the infinite wrap.
    const vh = () => window.innerHeight;
    sections.forEach((_, i) => snap.add(i * vh()));
    // Recompute snap offsets on resize so they always equal whole viewports.
    const onResize = () => {
      snap.snaps = {};
      sections.forEach((_, i) => snap.add(i * vh()));
    };
    window.addEventListener('resize', onResize);
    snap.__onResize = onResize;
  }

  // ---- Controller.
  function destroy() {
    cancelAnimationFrame(rafId);
    triggers.forEach((t) => t.kill());
    ScrollTrigger.getAll().forEach((t) => {
      if (t.scroller === document.documentElement) t.kill();
    });
    if (snap) {
      if (snap.__onResize) window.removeEventListener('resize', snap.__onResize);
      snap.destroy?.();
    }
    lenis.destroy();
  }

  return { lenis, snap, destroy };
}

// Parse a CSS cubic-bezier(...) string into a JS easing function for Lenis.
// Falls back to a smooth easeOutExpo-ish curve if parsing fails.
function cubicBezierFromCss(value) {
  const match = /cubic-bezier\(([^)]+)\)/.exec(value || '');
  if (!match) return (t) => 1 - Math.pow(1 - t, 3);
  const [x1, y1, x2, y2] = match[1].split(',').map((n) => parseFloat(n.trim()));
  return makeCubicBezier(x1, y1, x2, y2);
}

// Minimal, dependency-free cubic-bezier easing (Newton-Raphson + bisection).
function makeCubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;

  const solveX = (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xt = sampleX(t) - x;
      const d = sampleDX(t);
      if (Math.abs(xt) < 1e-6) return t;
      if (Math.abs(d) < 1e-6) break;
      t -= xt / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (lo < hi) {
      const xt = sampleX(t);
      if (Math.abs(xt - x) < 1e-6) return t;
      if (x > xt) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return t;
  };

  return (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return sampleY(solveX(t));
  };
}

// Auto-init when loaded as a plain script (not as a module being orchestrated).
if (typeof window !== 'undefined' && !window.__IPS_MANUAL__) {
  window.initInfiniteParallaxScroll = initInfiniteParallaxScroll;
}

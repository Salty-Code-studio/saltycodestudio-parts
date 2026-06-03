/* Sticky Grid Scroll — saltycodestudio
 * A pinned 3-column image grid that staggers in from top/bottom, zooms open,
 * and reveals an overlaid title + CTA at precise scroll points before releasing.
 *
 * Requires: gsap, gsap/ScrollTrigger. Optional: Lenis (auto-detected) for smoothing.
 *
 * Markup:
 *   <section class="sgs">
 *     <div class="sgs-stage">
 *       <div class="sgs-grid">
 *         <div class="sgs-col" data-col="left">  <figure class="sgs-cell">…</figure> … </div>
 *         <div class="sgs-col" data-col="center"><figure class="sgs-cell">…</figure> … </div>
 *         <div class="sgs-col" data-col="right"> <figure class="sgs-cell">…</figure> … </div>
 *       </div>
 *       <div class="sgs-content" data-sgs-content>
 *         <h2 class="sgs-title">…</h2>
 *         <a class="sgs-cta" href="#">…</a>
 *       </div>
 *     </div>
 *   </section>
 *
 * Tuning is exposed through the options object below.
 */

export function initStickyGridScroll(root = document, userOptions = {}) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[sticky-grid-scroll] GSAP + ScrollTrigger are required.');
    return [];
  }
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const options = {
    scrollLength: 2.6,   // how long the pin lasts, in viewport heights
    zoom: 2.05,          // peak grid scale during the "open up" phase
    columnOffset: 18,    // % lateral drift of side columns at peak zoom
    stagger: 0.06,       // per-cell stagger when the columns reveal
    revealStart: 0.7,    // 0..1 progress where the title/CTA begin to fade in
    revealEnd: 0.86,     // 0..1 progress where the title/CTA are fully shown
    ...userOptions,
  };

  const instances = [];

  root.querySelectorAll('.sgs').forEach((section) => {
    const stage = section.querySelector('.sgs-stage');
    const grid = section.querySelector('.sgs-grid');
    const content = section.querySelector('[data-sgs-content]');
    const cells = gsap.utils.toArray(section.querySelectorAll('.sgs-cell'));
    const leftCol = section.querySelector('[data-col="left"]');
    const centerCol = section.querySelector('[data-col="center"]');
    const rightCol = section.querySelector('[data-col="right"]');
    if (!stage || !grid || cells.length === 0) return;

    // Split cells into the columns we will fly in from top/bottom.
    const fromTop = [];
    const fromBottom = [];
    gsap.utils.toArray(section.querySelectorAll('.sgs-col')).forEach((col) => {
      const colCells = gsap.utils.toArray(col.querySelectorAll('.sgs-cell'));
      // Center column reveals from the top; side columns from the bottom.
      if (col === centerCol) fromTop.push(...colCells);
      else fromBottom.push(...colCells);
    });

    // Reduced-motion: render the resolved end-state, skip the scrubbed timeline.
    if (reduceMotion) {
      gsap.set(cells, { autoAlpha: 1, yPercent: 0, scale: 1 });
      gsap.set(grid, { scale: 1 });
      if (content) gsap.set(content, { autoAlpha: 1, y: 0 });
      return;
    }

    // Starting state — cells parked off their column edges, grid slightly small,
    // content hidden until the precise reveal window.
    gsap.set(fromTop, { yPercent: -160, autoAlpha: 0, scale: 0.92 });
    gsap.set(fromBottom, { yPercent: 160, autoAlpha: 0, scale: 0.92 });
    gsap.set(grid, { scale: 0.86, transformOrigin: '50% 50%' });
    if (content) gsap.set(content, { autoAlpha: 0, y: 28 });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + window.innerHeight * options.scrollLength,
        scrub: 1,
        pin: stage,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Phase 1 — columns reveal with stagger (top set, then bottom set overlapping).
    tl.to(
      fromTop,
      { yPercent: 0, autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power2.out',
        stagger: { each: options.stagger, from: 'start' } },
      0
    );
    tl.to(
      fromBottom,
      { yPercent: 0, autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power2.out',
        stagger: { each: options.stagger, from: 'end' } },
      0.12
    );

    // Phase 2 — the grid zooms open; side columns drift outward, center holds.
    tl.to(grid, { scale: options.zoom, duration: 1.6, ease: 'power1.inOut' }, 0.9);
    if (leftCol)
      tl.to(leftCol, { xPercent: -options.columnOffset, duration: 1.6, ease: 'power1.inOut' }, 0.9);
    if (rightCol)
      tl.to(rightCol, { xPercent: options.columnOffset, duration: 1.6, ease: 'power1.inOut' }, 0.9);
    if (centerCol)
      tl.to(centerCol, { yPercent: -4, duration: 1.6, ease: 'power1.inOut' }, 0.9);

    // Phase 3 — reveal overlaid content at a fixed scroll window, then release.
    if (content) {
      // Convert progress-based reveal points into timeline time.
      const total = tl.duration() || 1;
      const inAt = options.revealStart * total;
      const outAt = options.revealEnd * total;
      tl.to(content, { autoAlpha: 1, y: 0, duration: Math.max(0.001, outAt - inAt),
        ease: 'power2.out' }, inAt);
      // Gently push the now-bright grid back so the content reads clearly.
      tl.to(grid, { filter: 'brightness(0.55)', duration: outAt - inAt }, inAt);
    }

    instances.push({ section, timeline: tl, scrollTrigger: tl.scrollTrigger });
  });

  // ---- Optional Lenis smoothing -------------------------------------------
  // If a Lenis instance was passed in, drive ScrollTrigger from it. Otherwise,
  // if the global Lenis constructor exists and no instance was supplied, create
  // a lightweight one. Pass { lenis: false } to opt out entirely.
  if (options.lenis !== false) {
    let lenis = options.lenis;
    if (!lenis && typeof window !== 'undefined' && typeof window.Lenis === 'function') {
      lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true });
    }
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  ScrollTrigger.refresh();
  return instances;
}

if (typeof window !== 'undefined' && !window.__SGS_MANUAL__) {
  window.initStickyGridScroll = initStickyGridScroll;
}

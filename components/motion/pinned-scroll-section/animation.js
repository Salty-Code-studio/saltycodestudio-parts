/* Pinned Scroll Section — saltycodestudio
 * Pins a section and animates inner "stages" through a single scrubbed timeline.
 * Requires: gsap, gsap/ScrollTrigger (register the plugin before calling).
 *
 * Expected markup:
 *   <section class="pin-section">
 *     <div class="pin-inner">
 *       <div class="pin-stage" data-stage="0"> ... </div>
 *       <div class="pin-stage" data-stage="1"> ... </div>
 *       <div class="pin-stage" data-stage="2"> ... </div>
 *     </div>
 *   </section>
 */

export function initPinnedSection(root = document) {
  if (typeof gsap === 'undefined') {
    console.warn('[pinned-scroll-section] GSAP not found.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sections = root.querySelectorAll('.pin-section');

  sections.forEach((section) => {
    const inner = section.querySelector('.pin-inner');
    const stages = gsap.utils.toArray(section.querySelectorAll('.pin-stage'));
    if (!inner || stages.length === 0) return;

    // Reduced motion: reveal every stage as plain stacked content, no pin/scrub.
    if (prefersReduced) {
      gsap.set(stages, { autoAlpha: 1, yPercent: 0 });
      const progress = section.querySelector('[data-pin-progress]');
      if (progress) gsap.set(progress, { scaleX: 1, transformOrigin: 'left center' });
      return;
    }

    // How many viewport heights of scroll the pin should last.
    const stageCount = stages.length;
    const scrollLength = stageCount * 100; // vh per stage

    // Start every stage hidden except the first.
    gsap.set(stages, { autoAlpha: 0, yPercent: 8 });
    gsap.set(stages[0], { autoAlpha: 1, yPercent: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + window.innerHeight * stageCount,
        scrub: 0.6,
        pin: inner,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Cross-fade between consecutive stages.
    stages.forEach((stage, i) => {
      if (i === 0) return;
      const prev = stages[i - 1];
      tl.to(prev, { autoAlpha: 0, yPercent: -8, ease: 'power2.in' }, '+=0.4')
        .to(stage, { autoAlpha: 1, yPercent: 0, ease: 'power2.out' }, '<0.1');
    });

    // Optional progress accent: animate any element flagged data-pin-progress.
    const progress = section.querySelector('[data-pin-progress]');
    if (progress) {
      gsap.to(progress, {
        scaleX: 1,
        ease: 'none',
        transformOrigin: 'left center',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + window.innerHeight * stageCount,
          scrub: true,
        },
      });
    }
  });
}

// Auto-init when loaded directly (non-module / global usage).
if (typeof window !== 'undefined' && !window.__PIN_SECTION_MANUAL__) {
  window.initPinnedSection = initPinnedSection;
}

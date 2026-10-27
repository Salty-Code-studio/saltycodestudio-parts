/* Pinned Numbered Testimonials, saltycodestudio
 * A pinned stage where giant numerals 01, 02, 03 crossfade in sequence while
 * each quote and author slide-fade through, scrubbed and snapped per item.
 * Requires: gsap, gsap/ScrollTrigger.
 *
 * Expected markup:
 *   <section class="pnt-section">
 *     <div class="pnt-inner">
 *       <div class="pnt-rail" aria-hidden="true"><span class="pnt-rail-fill"></span></div>
 *       <div class="pnt-stage">
 *         <figure class="pnt-item">
 *           <span class="pnt-num" aria-hidden="true">01</span>
 *           <blockquote class="pnt-quote">The quote itself.</blockquote>
 *           <figcaption class="pnt-author"><strong>Name</strong><span>Role, company</span></figcaption>
 *         </figure>
 *         (one figure per testimonial)
 *       </div>
 *     </div>
 *   </section>
 *
 * Without JavaScript, without GSAP, or with reduced motion the section stays a
 * plain readable list. When this script itself falls back (reduced motion or
 * missing GSAP) it adds .pnt-static as a styling hook; with no JavaScript the
 * list simply never changes, which renders identically.
 */

export function initNumberedTestimonials(root = document) {
  const sections = root.querySelectorAll('.pnt-section');
  if (!sections.length) return;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[pinned-numbered-testimonials] GSAP + ScrollTrigger not found, keeping the static list.');
    sections.forEach((section) => section.classList.add('pnt-static'));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  sections.forEach((section) => {
    const inner = section.querySelector('.pnt-inner');
    const items = gsap.utils.toArray(section.querySelectorAll('.pnt-item'));

    // Reduced motion, or nothing to sequence: keep the plain stacked list.
    if (prefersReduced || !inner || items.length < 2) {
      section.classList.add('pnt-static');
      return;
    }

    // Flip the CSS from flowing list to overlaid stage, then hide everything
    // in the same tick so no overlapping frame ever paints.
    section.classList.add('pnt-is-live');

    const parts = items.map((item) => ({
      num: item.querySelector('.pnt-num'),
      copy: gsap.utils.toArray(item.querySelectorAll('.pnt-quote, .pnt-author')),
    }));

    parts.forEach((part, i) => {
      const shown = i === 0;
      gsap.set(part.num, {
        autoAlpha: shown ? 1 : 0,
        yPercent: shown ? 0 : 24,
        scale: shown ? 1 : 0.94,
      });
      gsap.set(part.copy, { autoAlpha: shown ? 1 : 0, y: shown ? 0 : 40 });
    });

    const count = items.length;
    const steps = count - 1;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + window.innerHeight * count,
        pin: inner,
        scrub: 0.75,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Settle exactly on a testimonial after every scroll gesture.
        snap: {
          snapTo: 1 / steps,
          duration: { min: 0.2, max: 0.6 },
          delay: 0.05,
          ease: 'power1.inOut',
        },
      },
    });

    // One timeline unit per handover. Every handover ends exactly on a whole
    // unit, and the snap points sit on those same units, so a snapped stop is
    // always a fully settled testimonial with a comfortable reading hold
    // before the next handover begins.
    for (let i = 1; i < count; i += 1) {
      const prev = parts[i - 1];
      const next = parts[i];
      const at = i - 0.5;

      tl.to(prev.num, { autoAlpha: 0, yPercent: -24, scale: 1.05, duration: 0.22, ease: 'power2.in' }, at)
        .to(prev.copy, { autoAlpha: 0, y: -36, duration: 0.2, stagger: 0.04, ease: 'power2.in' }, at)
        .to(next.num, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.26, ease: 'power2.out' }, at + 0.18)
        .to(next.copy, { autoAlpha: 1, y: 0, duration: 0.24, stagger: 0.06, ease: 'power2.out' }, at + 0.2);
    }

    // The side hairline rides the same timeline, so it scrubs and snaps in
    // perfect step with the quotes.
    const fill = section.querySelector('.pnt-rail-fill');
    if (fill) {
      gsap.set(fill, { scaleY: 0, transformOrigin: 'top center' });
      tl.to(fill, { scaleY: 1, duration: steps, ease: 'none' }, 0);
    }
  });
}

// Also expose on window so pages without a bundler can load this file as a
// module script and call it from a follow-up script. Note the export above
// means a plain non-module script tag cannot parse this file.
if (typeof window !== 'undefined' && !window.__PNT_MANUAL__) {
  window.initNumberedTestimonials = initNumberedTestimonials;
}

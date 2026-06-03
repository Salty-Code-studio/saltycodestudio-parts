/* Horizontal Scroll Gallery — saltycodestudio
 * Vertical scroll drives a horizontal sweep of panels.
 * Requires: gsap, gsap/ScrollTrigger.
 *
 * Markup:
 *   <section class="hscroll">
 *     <div class="hscroll-track">
 *       <article class="hscroll-panel"> ... </article>
 *       ...
 *     </div>
 *   </section>
 */

export function initHorizontalGallery(root = document) {
  if (typeof gsap === 'undefined') {
    console.warn('[horizontal-scroll-gallery] GSAP not found.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  root.querySelectorAll('.hscroll').forEach((section) => {
    const track = section.querySelector('.hscroll-track');
    const panels = gsap.utils.toArray(section.querySelectorAll('.hscroll-panel'));
    if (!track || panels.length === 0) return;

    // Distance the track must travel = its overflow beyond the viewport width.
    const getScrollDistance = () => track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + getScrollDistance(),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Subtle parallax on each panel's inner media as it crosses the screen.
    panels.forEach((panel) => {
      const media = panel.querySelector('[data-hscroll-parallax]');
      if (!media) return;
      gsap.fromTo(
        media,
        { xPercent: -12 },
        {
          xPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        }
      );
    });
  });
}

if (typeof window !== 'undefined' && !window.__HSCROLL_MANUAL__) {
  window.initHorizontalGallery = initHorizontalGallery;
}

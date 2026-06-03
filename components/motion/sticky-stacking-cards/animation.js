/* Sticky Stacking Cards — saltycodestudio
 * Each card pins, then scales/dims back as the next card slides up over it.
 * Requires: gsap, gsap/ScrollTrigger.
 *
 * Markup:
 *   <section class="stack-cards">
 *     <article class="stack-card"> ... </article>
 *     <article class="stack-card"> ... </article>
 *     ...
 *   </section>
 *
 * The CSS uses position: sticky for the pinning; GSAP scrubs the scale/opacity
 * of each card as the FOLLOWING card travels up to cover it.
 */

export function initStackingCards(root = document) {
  if (typeof gsap === 'undefined') {
    console.warn('[sticky-stacking-cards] GSAP not found.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  root.querySelectorAll('.stack-cards').forEach((container) => {
    const cards = gsap.utils.toArray(container.querySelectorAll('.stack-card'));
    if (cards.length < 2) return;

    cards.forEach((card, i) => {
      // The last card never gets covered, so it doesn't scale back.
      if (i === cards.length - 1) return;

      const next = cards[i + 1];

      // As `next` rises from below to cover `card`, shrink + dim `card`.
      gsap.to(card, {
        scale: 0.9,
        filter: 'brightness(0.7)',
        ease: 'none',
        scrollTrigger: {
          trigger: next,
          start: 'top bottom',   // next card's top hits viewport bottom
          end: 'top top',        // next card reaches the pinned position
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
  });
}

if (typeof window !== 'undefined' && !window.__STACK_MANUAL__) {
  window.initStackingCards = initStackingCards;
}

/* Parallax Layers — saltycodestudio
 * Each layer moves at a fraction of the scroll for a depth effect.
 * Requires: gsap, gsap/ScrollTrigger.
 *
 * Markup:
 *   <section class="parallax-scene">
 *     <div class="parallax-layer" data-parallax-speed="-0.3"> ...far / slow... </div>
 *     <div class="parallax-layer" data-parallax-speed="0.15"> ...mid... </div>
 *     <div class="parallax-layer" data-parallax-speed="0.5"> ...near / fast... </div>
 *   </section>
 *
 * speed: positive = moves up faster than scroll (foreground feel),
 *        negative = lags behind (background feel). Tune between -0.5 and 0.6.
 */

export function initParallaxLayers(root = document) {
  if (typeof gsap === 'undefined') {
    console.warn('[parallax-layers] GSAP not found.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Reduced motion: leave layers in their natural positions, no parallax drift.
  if (prefersReduced) return;

  root.querySelectorAll('.parallax-scene').forEach((scene) => {
    const layers = scene.querySelectorAll('[data-parallax-speed]');
    if (!layers.length) return;

    layers.forEach((layer) => {
      const speed = parseFloat(layer.getAttribute('data-parallax-speed')) || 0;

      gsap.fromTo(
        layer,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: 'none',
          scrollTrigger: {
            trigger: scene,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });
  });
}

if (typeof window !== 'undefined' && !window.__PARALLAX_MANUAL__) {
  window.initParallaxLayers = initParallaxLayers;
}

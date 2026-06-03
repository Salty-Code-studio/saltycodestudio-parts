/* Scroll Progress Bar — saltycodestudio
 * Slim fixed top bar that fills with document scroll progress.
 * Requires: gsap, gsap/ScrollTrigger.
 *
 * Markup (place near the top of <body>):
 *   <div class="scroll-progress"><span class="scroll-progress-fill"></span></div>
 *
 * Options:
 *   target  — selector to measure progress over (default: whole document).
 *             Useful for "reading progress" of a single <article>.
 */

export function initScrollProgress(options = {}) {
  if (typeof gsap === 'undefined') {
    console.warn('[scroll-progress-bar] GSAP not found.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const fill = document.querySelector(options.fillSelector || '.scroll-progress-fill');
  if (!fill) {
    console.warn('[scroll-progress-bar] .scroll-progress-fill not found.');
    return;
  }

  const trigger = options.target
    ? document.querySelector(options.target)
    : document.body;

  gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' });

  ScrollTrigger.create({
    trigger,
    start: options.target ? 'top top' : 'top top',
    end: options.target ? 'bottom bottom' : 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      gsap.to(fill, { scaleX: self.progress, duration: 0.1, ease: 'none', overwrite: true });
    },
  });
}

if (typeof window !== 'undefined' && !window.__PROGRESS_MANUAL__) {
  window.initScrollProgress = initScrollProgress;
}

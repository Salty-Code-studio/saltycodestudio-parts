/**
 * Layered Zoom Scroll
 * ------------------------------------------------------------------
 * A cinematic trailing-zoom hero. Stacked duplicate image layers begin
 * at descending scales (1 -> ~0.15) with progressive blur, then scale to
 * 1 / zero blur on scroll. A shared CSS `--progress` var (0..1) is driven
 * by a master ScrollTrigger so the central masked subject scales up while
 * the split headline halves translate apart. ScrollSmoother adds inertia.
 *
 * Expected markup (see styles.css for the matching classes):
 *
 *   <div id="smooth-wrapper">
 *     <div id="smooth-content">
 *       <section class="lzs" data-lzs>
 *         <div class="lzs__stage">
 *           <div class="lzs__layers">
 *             <div class="lzs__layer" style="--img:url(...)"></div> x6
 *           </div>
 *           <figure class="lzs__subject" style="--img:url(...)"></figure>
 *           <h1 class="lzs__title">
 *             <span class="lzs__word lzs__word--a">SALTY</span>
 *             <span class="lzs__word lzs__word--b">CODE</span>
 *           </h1>
 *         </div>
 *         <div class="lzs__spacer"></div>
 *       </section>
 *       ...rest of page...
 *     </div>
 *   </div>
 *
 * Usage:
 *   import { initLayeredZoomScroll } from "./animation.js";
 *   const cleanup = initLayeredZoomScroll();
 *
 * GSAP + ScrollTrigger + ScrollSmoother must be registered (or pass them in).
 */

export function initLayeredZoomScroll(options = {}) {
  const {
    gsap = globalThis.gsap,
    ScrollTrigger = globalThis.ScrollTrigger,
    ScrollSmoother = globalThis.ScrollSmoother,
    root = document,
    layerCount = 6,
    minLayerScale = 0.15, // smallest (deepest) layer start scale
    maxBlur = 18, // px of blur on the deepest layer
    subjectStartScale = 0.62, // central masked subject starts here
    wordTravel = 26, // vw each headline half travels apart
    scrub = 1.1,
  } = options;

  if (!gsap || !ScrollTrigger) {
    console.warn("[layered-zoom-scroll] GSAP + ScrollTrigger are required.");
    return () => {};
  }

  gsap.registerPlugin(ScrollTrigger);
  if (ScrollSmoother) gsap.registerPlugin(ScrollSmoother);

  const reduceMotion =
    globalThis.matchMedia &&
    globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sections = Array.from(root.querySelectorAll("[data-lzs]"));
  if (!sections.length) return () => {};

  let smoother = null;
  const triggers = [];
  const setters = [];

  // ScrollSmoother needs the wrapper/content scaffold. Create it only if present.
  if (ScrollSmoother && !reduceMotion) {
    const wrapper = root.querySelector("#smooth-wrapper");
    const content = root.querySelector("#smooth-content");
    if (wrapper && content) {
      smoother = ScrollSmoother.create({
        wrapper,
        content,
        smooth: 1.15,
        effects: false,
        normalizeScroll: true,
      });
    }
  }

  sections.forEach((section) => {
    const stage = section.querySelector(".lzs__stage");
    const layers = Array.from(section.querySelectorAll(".lzs__layer"));
    const subject = section.querySelector(".lzs__subject");
    const wordA = section.querySelector(".lzs__word--a");
    const wordB = section.querySelector(".lzs__word--b");

    // ---- Reduced motion: resolve everything to its finished state. ----
    if (reduceMotion) {
      gsap.set(layers, { scale: 1, filter: "blur(0px)", autoAlpha: 1 });
      gsap.set(subject, { scale: 1, autoAlpha: 1 });
      gsap.set([wordA, wordB], { xPercent: 0, autoAlpha: 1 });
      section.style.setProperty("--progress", "1");
      return;
    }

    // ---- Seed each layer's start state. Deeper layers = smaller + blurrier. ----
    const n = Math.min(layers.length, layerCount) || layers.length;
    layers.forEach((layer, i) => {
      // i = 0 is the front-most layer (starts near full size, sharp),
      // i = n-1 is the deepest (tiny + heavily blurred).
      const t = n > 1 ? i / (n - 1) : 0; // 0..1 depth
      const startScale = gsap.utils.interpolate(1, minLayerScale, t);
      const startBlur = gsap.utils.interpolate(0, maxBlur, t);
      gsap.set(layer, {
        scale: startScale,
        filter: `blur(${startBlur}px)`,
        autoAlpha: gsap.utils.interpolate(1, 0.35, t),
        zIndex: n - i,
        transformOrigin: "50% 50%",
      });
    });

    if (subject) {
      gsap.set(subject, {
        scale: subjectStartScale,
        autoAlpha: 0.92,
        transformOrigin: "50% 50%",
      });
    }
    if (wordA) gsap.set(wordA, { xPercent: 0 });
    if (wordB) gsap.set(wordB, { xPercent: 0 });

    // Broadcast the shared progress var + drive the split headline. We use
    // quickSetters only for `xPercent` (a single, quickSetter-safe transform
    // prop). The subject SCALE is animated on the timeline below instead —
    // gsap.quickSetter(el, "scale") does NOT resolve the scale shorthand and
    // would silently no-op.
    const setProgress = (v) => section.style.setProperty("--progress", v.toFixed(4));
    const wordASet = wordA ? gsap.quickSetter(wordA, "xPercent") : null;
    const wordBSet = wordB ? gsap.quickSetter(wordB, "xPercent") : null;

    // ---- Master timeline: scrub the whole composition. ----
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=180%",
        scrub,
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress; // 0..1
          setProgress(p);
          // Words part with an ease-out feel via a gentle power curve.
          const parted = Math.pow(p, 0.72) * wordTravel;
          if (wordASet) wordASet(-parted);
          if (wordBSet) wordBSet(parted);
        },
      },
    });

    // Central masked subject scales up across the whole scrub.
    if (subject) {
      tl.fromTo(
        subject,
        { scale: subjectStartScale },
        { scale: 1, autoAlpha: 1, duration: 1 },
        0,
      );
    }

    // Each layer settles to scale 1 / no blur, staggered by depth so the
    // composition resolves from front to back (trailing zoom).
    layers.forEach((layer, i) => {
      const t = n > 1 ? i / (n - 1) : 0;
      tl.to(
        layer,
        {
          scale: 1,
          filter: "blur(0px)",
          autoAlpha: 1,
          duration: 1,
        },
        t * 0.5, // stagger position along the 1-unit timeline
      );
    });

    triggers.push(tl.scrollTrigger);
    setters.push(() => section.style.removeProperty("--progress"));
  });

  ScrollTrigger.refresh();

  // ---- Cleanup ----
  return function cleanup() {
    triggers.forEach((t) => t && t.kill());
    setters.forEach((fn) => fn());
    if (smoother) smoother.kill();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}

export default initLayeredZoomScroll;

/* Image Scrub Sequence — saltycodestudio
 * Scroll scrubs a frame "playhead" through a sequence rendered to <canvas>.
 * Frames are generated procedurally (animated gradient + rotating ribbon),
 * so it works with ZERO external image assets — swap drawFrame() for an
 * <img> sequence in production (see README).
 *
 * Requires: gsap, gsap/ScrollTrigger.
 *
 * Markup:
 *   <section class="scrub-section">
 *     <div class="scrub-sticky">
 *       <canvas class="scrub-canvas"></canvas>
 *       <div class="scrub-caption"> ... optional overlay ... </div>
 *     </div>
 *   </section>
 */

const FRAME_COUNT = 120;

// Sand & Surf palette stops used to tint the generated sequence.
const PALETTE = {
  cream: [250, 246, 240],
  sand: [232, 167, 107],
  teal: [42, 127, 128],
  deep: [15, 44, 58],
};

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function mixRGB(c1, c2, t) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
}
function rgb([r, g, b], a = 1) {
  return `rgba(${r},${g},${b},${a})`;
}

/* Draws one frame of the procedural sequence at progress p (0..1). */
function drawFrame(ctx, w, h, p) {
  ctx.clearRect(0, 0, w, h);

  // 1) background gradient sweeps cream -> teal -> deep across the sequence
  const top = mixRGB(PALETTE.cream, PALETTE.teal, Math.min(p * 1.4, 1));
  const bot = mixRGB(PALETTE.teal, PALETTE.deep, p);
  const g = ctx.createLinearGradient(0, 0, w * 0.3, h);
  g.addColorStop(0, rgb(top));
  g.addColorStop(1, rgb(bot));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // 2) a rotating, scaling ribbon of arcs that reads as a spinning object
  const cx = w / 2;
  const cy = h / 2;
  const baseR = Math.min(w, h) * (0.16 + 0.12 * Math.sin(p * Math.PI));
  const rings = 5;
  for (let i = 0; i < rings; i++) {
    const ringP = i / rings;
    const radius = baseR + ringP * Math.min(w, h) * 0.28;
    const rot = p * Math.PI * 3 + i * 0.5;
    const span = Math.PI * (0.6 + 0.4 * Math.sin(p * Math.PI * 2 + i));
    const tint = mixRGB(PALETTE.sand, PALETTE.cream, ringP);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, rot, rot + span);
    ctx.lineWidth = Math.max(2, Math.min(w, h) * 0.012 * (1 - ringP * 0.5));
    ctx.strokeStyle = rgb(tint, 0.85 - ringP * 0.45);
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // 3) a core dot that pulses, anchoring the eye
  const core = mixRGB(PALETTE.cream, PALETTE.sand, p);
  ctx.beginPath();
  ctx.arc(cx, cy, baseR * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = rgb(core, 0.95);
  ctx.fill();

  // 4) a subtle progress tick row along the bottom
  const ticks = 24;
  const active = Math.floor(p * ticks);
  for (let i = 0; i < ticks; i++) {
    const tx = (w / (ticks + 1)) * (i + 1);
    const on = i <= active;
    ctx.beginPath();
    ctx.rect(tx - 1, h - 40, 2, on ? 16 : 8);
    ctx.fillStyle = rgb(on ? PALETTE.cream : PALETTE.deep, on ? 0.9 : 0.25);
    ctx.fill();
  }
}

export function initScrubSequence(root = document) {
  if (typeof gsap === 'undefined') {
    console.warn('[image-scrub-sequence] GSAP not found.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  root.querySelectorAll('.scrub-section').forEach((section) => {
    const canvas = section.querySelector('.scrub-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    }

    // playhead state we scrub via ScrollTrigger
    const state = { frame: 0 };

    function render() {
      const rect = canvas.getBoundingClientRect();
      drawFrame(ctx, rect.width, rect.height, state.frame / (FRAME_COUNT - 1));
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
      pin: section.querySelector('.scrub-sticky') || canvas,
      anticipatePin: 1,
      onUpdate: (self) => {
        state.frame = Math.round(self.progress * (FRAME_COUNT - 1));
        render();
      },
      invalidateOnRefresh: true,
    });

    window.addEventListener('resize', resize);
    resize();
  });
}

if (typeof window !== 'undefined' && !window.__SCRUB_MANUAL__) {
  window.initScrubSequence = initScrubSequence;
}

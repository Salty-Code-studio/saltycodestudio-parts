/*
 * Dot Matrix Wave  ·  saltycodestudio-parts (original, MIT)
 * ------------------------------------------------------------
 * A canvas-2D grid of dots whose radius, brightness and (optional) vertical
 * offset are driven by a traveling wave field. Two to three sine waves at
 * different angles are summed with a slow time term, so a smooth undulating
 * ripple crosses the grid. Dots near the pointer are pushed away and grow,
 * then ease back, leaving a soft interactive dent in the field.
 *
 * Color interpolates along the "Sand & Surf" ramp (sand -> sky-blue ->
 * deep-teal) based on each dot's local wave amplitude. Wave crests get a
 * faint surf-coral tint, used sparingly.
 *
 * Performance notes:
 *   - The grid (x/y positions) is precomputed once per resize. No per-frame
 *     allocation in the hot loop.
 *   - Colors are quantized into a fixed number of buckets so dots can be
 *     drawn in batched paths (one beginPath/fill per bucket) instead of one
 *     fill per dot. This keeps a few thousand dots at 60fps.
 *   - Reduced-motion users get a single static frame and no rAF loop.
 *
 * Public API:
 *   const inst = initDotMatrixWave(canvas, opts)
 *   inst.destroy()
 *
 * opts (all optional):
 *   gap            spacing between dots in CSS px            (default 26)
 *   dotSize        base dot radius in CSS px                 (default 2.2)
 *   speed          wave time multiplier                      (default 1)
 *   amplitude      wave strength 0..1+ (drives size/lift)    (default 1)
 *   repelRadius    pointer influence radius in CSS px        (default 130)
 *   repelStrength  how hard dots are pushed/grown            (default 1)
 *   colors         { sand, sky, teal, coral } hex overrides
 */

function initDotMatrixWave(canvas, opts = {}) {
  // --- Guard: a null/invalid canvas or missing 2D context must not throw. ---
  if (!canvas || typeof canvas.getContext !== 'function') {
    return { destroy() {} };
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // Extremely rare for 2D, but honor the contract: degrade gracefully.
    canvas.style.background =
      'linear-gradient(135deg,#F2EBDD 0%,#4FA8C9 60%,#0E3A40 100%)';
    return { destroy() {} };
  }

  // --------------------------------------------------------------------------
  // Config
  // --------------------------------------------------------------------------
  const cfg = {
    gap: opts.gap ?? 26,
    dotSize: opts.dotSize ?? 2.2,
    speed: opts.speed ?? 1,
    amplitude: opts.amplitude ?? 1,
    repelRadius: opts.repelRadius ?? 130,
    repelStrength: opts.repelStrength ?? 1,
    colors: Object.assign(
      { sand: '#F2EBDD', sky: '#4FA8C9', teal: '#0E3A40', coral: '#FF6F59' },
      opts.colors || {}
    ),
  };

  // --------------------------------------------------------------------------
  // Color ramp setup. We precompute a lookup table of N buckets along
  // sand -> sky -> teal, then blend a touch of coral into the brightest end.
  // Drawing is grouped per bucket so we only issue ~N fills per frame.
  // --------------------------------------------------------------------------
  const BUCKETS = 24; // visual smoothness vs. batch count tradeoff

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(
      h.length === 3 ? h.split('').map((c) => c + c).join('') : h,
      16
    );
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(a, b, t) {
    return [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
  }

  const cSand = hexToRgb(cfg.colors.sand);
  const cSky = hexToRgb(cfg.colors.sky);
  const cTeal = hexToRgb(cfg.colors.teal);
  const cCoral = hexToRgb(cfg.colors.coral);

  // Build the bucket color strings once.
  const bucketColors = new Array(BUCKETS);
  for (let i = 0; i < BUCKETS; i++) {
    const t = i / (BUCKETS - 1); // 0 = trough, 1 = crest
    let rgb;
    // First half sand->sky, second half sky->teal.
    if (t < 0.5) rgb = mix(cSand, cSky, t / 0.5);
    else rgb = mix(cSky, cTeal, (t - 0.5) / 0.5);
    // Faint coral kiss only on the top crests, easing in over the last ~30%.
    if (t > 0.7) {
      const coralAmt = ((t - 0.7) / 0.3) * 0.28; // max ~28% coral
      rgb = mix(rgb, cCoral, coralAmt);
    }
    bucketColors[i] = `rgb(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0})`;
  }

  // --------------------------------------------------------------------------
  // Wave field. Sum of three plane waves at different angles + a slow drift.
  // Each wave: amplitude * sin(dot(pos, dir) * freq + phaseSpeed * time).
  // Precompute direction unit vectors so the loop is pure multiply/add.
  // --------------------------------------------------------------------------
  const waves = [
    { ang: 0.5, freq: 0.018, spd: 0.9, amp: 0.55 },
    { ang: 2.1, freq: 0.013, spd: -0.6, amp: 0.35 },
    { ang: 3.7, freq: 0.026, spd: 1.4, amp: 0.25 },
  ].map((w) => ({
    dx: Math.cos(w.ang),
    dy: Math.sin(w.ang),
    freq: w.freq,
    spd: w.spd,
    amp: w.amp,
  }));

  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------
  let dpr = 1;
  let cssW = 0;
  let cssH = 0;
  let cols = 0;
  let rows = 0;
  let count = 0;
  // Flat typed arrays: base positions (CSS px). No per-frame allocation.
  let baseX = new Float32Array(0);
  let baseY = new Float32Array(0);

  // Pointer state (CSS px). Eased current vs. target so leaving resets softly.
  const pointer = { x: -9999, y: -9999, active: false };
  // Smoothed influence: 0 when away, ramps to 1 while present.
  let pInfluence = 0;

  let raf = 0;
  let startT = 0;
  let running = false;

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // Grid build (called on init + every resize)
  // --------------------------------------------------------------------------
  function buildGrid() {
    const rect = canvas.getBoundingClientRect();
    cssW = Math.max(1, rect.width || canvas.clientWidth || 1);
    cssH = Math.max(1, rect.height || canvas.clientHeight || 1);
    dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR for perf

    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);

    // Center the grid with a margin so edges breathe.
    cols = Math.max(1, Math.floor(cssW / cfg.gap) + 2);
    rows = Math.max(1, Math.floor(cssH / cfg.gap) + 2);
    count = cols * rows;

    baseX = new Float32Array(count);
    baseY = new Float32Array(count);

    const offsetX = (cssW - (cols - 1) * cfg.gap) / 2;
    const offsetY = (cssH - (rows - 1) * cfg.gap) / 2;

    let i = 0;
    for (let r = 0; r < rows; r++) {
      const y = offsetY + r * cfg.gap;
      for (let c = 0; c < cols; c++) {
        baseX[i] = offsetX + c * cfg.gap;
        baseY[i] = y;
        i++;
      }
    }
  }

  // --------------------------------------------------------------------------
  // Frame render. `time` is seconds since start (0 for the still frame).
  // --------------------------------------------------------------------------
  // Reusable per-bucket batches so we never allocate in the loop. Each entry
  // holds the dot coordinates+radii queued for that color bucket.
  const batchX = [];
  const batchY = [];
  const batchR = [];
  for (let b = 0; b < BUCKETS; b++) {
    batchX.push([]);
    batchY.push([]);
    batchR.push([]);
  }

  function render(time) {
    // Clear with the sand base so the field reads as dots on warm paper.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const t = time * cfg.speed;
    const amp = cfg.amplitude;
    const repelR = cfg.repelRadius;
    const repelR2 = repelR * repelR;
    const repelS = cfg.repelStrength;

    const px = pointer.x;
    const py = pointer.y;
    const inf = pInfluence; // 0..1 eased presence

    // Reset batches (keep arrays, just truncate length).
    for (let b = 0; b < BUCKETS; b++) {
      batchX[b].length = 0;
      batchY[b].length = 0;
      batchR[b].length = 0;
    }

    const w0 = waves[0], w1 = waves[1], w2 = waves[2];
    const baseR = cfg.dotSize;

    for (let i = 0; i < count; i++) {
      const x = baseX[i];
      const y = baseY[i];

      // --- Wave field value at this point, range roughly -1..1 ---
      const f =
        w0.amp * Math.sin((x * w0.dx + y * w0.dy) * w0.freq + w0.spd * t) +
        w1.amp * Math.sin((x * w1.dx + y * w1.dy) * w1.freq + w1.spd * t) +
        w2.amp * Math.sin((x * w2.dx + y * w2.dy) * w2.freq + w2.spd * t);
      // Normalize: total wave amp = 0.55+0.35+0.25 = 1.15
      let wave = f / 1.15; // -1..1
      const wave01 = wave * 0.5 + 0.5; // 0..1 crest measure

      // --- Pointer repel: push outward + grow, eased by presence ---
      let drawX = x;
      let drawY = y;
      let push = 0;
      if (inf > 0.001) {
        const ddx = x - px;
        const ddy = y - py;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < repelR2) {
          const d = Math.sqrt(d2) || 0.0001;
          // Smooth falloff (1 at center -> 0 at edge), squared for softness.
          const fall = 1 - d / repelR;
          push = fall * fall * inf * repelS;
          const shove = push * 18; // px of displacement at full strength
          drawX = x + (ddx / d) * shove;
          drawY = y + (ddy / d) * shove;
        }
      }

      // --- Vertical lift from the wave (subtle parallax-y undulation) ---
      drawY -= wave * amp * 3.2;

      // --- Radius: base, swollen on crests and near the pointer ---
      const radius =
        baseR * (0.55 + wave01 * 0.9 * amp) + push * baseR * 2.4;

      // --- Color bucket from crest measure, nudged brighter by the pointer ---
      let tCol = wave01 + push * 0.5;
      if (tCol > 1) tCol = 1;
      let bucket = (tCol * (BUCKETS - 1)) | 0;
      if (bucket < 0) bucket = 0;
      else if (bucket >= BUCKETS) bucket = BUCKETS - 1;

      batchX[bucket].push(drawX);
      batchY[bucket].push(drawY);
      batchR[bucket].push(radius);
    }

    // --- Draw one batched path per color bucket ---
    const TAU = Math.PI * 2;
    for (let b = 0; b < BUCKETS; b++) {
      const xs = batchX[b];
      if (xs.length === 0) continue;
      const ys = batchY[b];
      const rs = batchR[b];
      ctx.fillStyle = bucketColors[b];
      ctx.beginPath();
      for (let k = 0; k < xs.length; k++) {
        const r = rs[k];
        if (r <= 0.05) continue;
        ctx.moveTo(xs[k] + r, ys[k]);
        ctx.arc(xs[k], ys[k], r, 0, TAU);
      }
      ctx.fill();
    }
  }

  // --------------------------------------------------------------------------
  // Animation loop
  // --------------------------------------------------------------------------
  function loop(now) {
    if (!running) return;
    if (!startT) startT = now;
    const time = (now - startT) / 1000;

    // Ease pointer influence toward target (1 if active, else 0).
    const target = pointer.active ? 1 : 0;
    pInfluence += (target - pInfluence) * 0.12;
    if (!pointer.active && pInfluence < 0.002) pInfluence = 0;

    render(time);
    raf = requestAnimationFrame(loop);
  }

  // --------------------------------------------------------------------------
  // Event handlers
  // --------------------------------------------------------------------------
  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    if (!point) return;
    pointer.x = point.clientX - rect.left;
    pointer.y = point.clientY - rect.top;
    pointer.active = true;
  }
  function onLeave() {
    // Soft reset: stop influencing; ease handles the fade-out.
    pointer.active = false;
    pointer.x = -9999;
    pointer.y = -9999;
  }

  let resizeRaf = 0;
  function onResize() {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      buildGrid();
      if (reduceMotion) render(0); // refresh the still frame
    });
  }

  // --------------------------------------------------------------------------
  // Boot
  // --------------------------------------------------------------------------
  buildGrid();

  if (reduceMotion) {
    // Single, good-looking static frame. No rAF, no pointer drama.
    render(0);
  } else {
    running = true;
    raf = requestAnimationFrame(loop);
    canvas.addEventListener('mousemove', onMove, { passive: true });
    canvas.addEventListener('touchmove', onMove, { passive: true });
    canvas.addEventListener('mouseleave', onLeave, { passive: true });
    canvas.addEventListener('touchend', onLeave, { passive: true });
    canvas.addEventListener('touchcancel', onLeave, { passive: true });
  }
  window.addEventListener('resize', onResize, { passive: true });

  // --------------------------------------------------------------------------
  // Teardown
  // --------------------------------------------------------------------------
  function destroy() {
    running = false;
    cancelAnimationFrame(raf);
    cancelAnimationFrame(resizeRaf);
    window.removeEventListener('resize', onResize);
    canvas.removeEventListener('mousemove', onMove);
    canvas.removeEventListener('touchmove', onMove);
    canvas.removeEventListener('mouseleave', onLeave);
    canvas.removeEventListener('touchend', onLeave);
    canvas.removeEventListener('touchcancel', onLeave);
  }

  return { destroy };
}

// UMD-ish export so the file works as a module or a plain <script>.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = initDotMatrixWave;
}

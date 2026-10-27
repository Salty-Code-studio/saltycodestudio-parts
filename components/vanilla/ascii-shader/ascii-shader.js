/*
 * ASCII Shader — saltycodestudio-parts (original, MIT)
 * ---------------------------------------------------------------------------
 * An animated grayscale field rendered live as ASCII art on a single 2D canvas.
 *
 * How it works (all CPU + canvas-2D, no WebGL, no deps):
 *   1. We keep an OFFSCREEN low-res intensity buffer — one float per character
 *      cell, NOT one per pixel. With ~12px cells a 1280x720 view is only a
 *      ~107x60 grid, i.e. ~6.4k cells. Cheap to update every frame.
 *   2. Each frame we fill that buffer with a smooth, flowing value-noise field
 *      (layered fbm) plus an optional pointer "bulge". The result is a calm
 *      0..1 intensity per cell.
 *   3. For each cell we map intensity -> a glyph from a density ramp
 *      (" .:-=+*#%@") and -> a colour along the Sand & Surf ramp, then draw it
 *      with fillText in a monospace font. The hottest cells get a sparse coral
 *      accent so it reads as designed, not noisy.
 *
 * Performance notes:
 *   - No per-cell object allocation in the render loop. Buffers are reused
 *     typed arrays sized to the grid; we only reallocate on resize.
 *   - We batch fillText calls by colour bucket so we set ctx.fillStyle a
 *     handful of times per frame instead of thousands.
 *   - Value noise uses a precomputed permutation/gradient table; the field is
 *     evaluated at grid resolution only.
 *
 * Public API:
 *   const handle = initAsciiShader(canvasEl, opts);
 *   handle.destroy();   // cancels RAF, removes listeners, releases buffers
 *
 * opts (all optional):
 *   cell            : px size of one character cell (default 12)
 *   ramp            : string of glyphs, sparse -> dense (default " .:-=+*#%@")
 *   speed           : flow speed multiplier (default 1)
 *   scale           : noise feature scale; smaller = larger blobs (default 1)
 *   mouseInfluence  : 0..2 strength of the pointer bulge (default 1)
 *   colors          : { sand, sand2, teal, sky, coral, ink }
 *                     (defaults to the Sand & Surf palette)
 *   coralThreshold  : intensity above which the coral accent appears (0..1, default 0.92)
 *   fontFamily      : monospace stack used for glyphs
 *   contrast        : tightens/loosens the intensity-to-glyph mapping (default 1)
 */

export function initAsciiShader(canvas, opts = {}) {
  // ---- Resolve options + Sand & Surf defaults ----------------------------
  const palette = Object.assign(
    {
      sand: '#F2EBDD',
      sand2: '#EAE1CF',
      teal: '#0E3A40',
      sky: '#4FA8C9',
      coral: '#FF6F59',
      ink: '#1C2B2E',
    },
    opts.colors || {}
  );

  const cfg = {
    cell: opts.cell || 12,
    ramp: opts.ramp || ' .:-=+*#%@',
    speed: opts.speed != null ? opts.speed : 1,
    scale: opts.scale != null ? opts.scale : 1,
    mouseInfluence: opts.mouseInfluence != null ? opts.mouseInfluence : 1,
    coralThreshold: opts.coralThreshold != null ? opts.coralThreshold : 0.92,
    contrast: opts.contrast != null ? opts.contrast : 1,
    fontFamily:
      opts.fontFamily ||
      "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace",
  };

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    // Graceful fallback: paint a static coastal gradient so the slot never
    // looks broken if 2D context is somehow unavailable.
    canvas.style.background =
      'linear-gradient(160deg, #F2EBDD 0%, #EAE1CF 55%, #4FA8C9 130%)';
    return { destroy() {} };
  }

  const reduceMotion =
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Build a colour ramp (teal -> sky) as a small lookup table ---------
  // We precompute N interpolated colours so the per-cell loop just indexes in.
  const RAMP_STEPS = 24;
  const colorLUT = buildColorLUT(palette.teal, palette.sky, RAMP_STEPS);
  const coralStr = palette.coral;

  // ---- Value-noise tables (deterministic, built once) --------------------
  const noise = createValueNoise(1337);

  // ---- Grid / buffer state ----------------------------------------------
  let dpr = 1;
  let cssW = 0;
  let cssH = 0;
  let cols = 0;
  let rows = 0;
  let cellPx = cfg.cell; // CSS px per cell
  let field = null; // Float32Array, intensity per cell
  let charScratch = ''; // reused per row to avoid allocs where possible

  // Pointer state (in CSS px). Eased toward the raw target for a soft bulge.
  let pointerActive = false;
  let pxTarget = 0;
  let pyTarget = 0;
  let px = 0;
  let py = 0;

  let raf = 0;
  let startTime = performance.now();
  let running = false;

  // ---------------------------------------------------------------------
  // Sizing: recompute DPR, canvas backing store, and the character grid.
  // ---------------------------------------------------------------------
  function resize() {
    const rect = canvas.getBoundingClientRect();
    cssW = Math.max(1, Math.round(rect.width));
    cssH = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2 for perf

    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);

    // Work in CSS px; the transform handles the device pixel scaling.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cellPx = cfg.cell;
    cols = Math.max(1, Math.ceil(cssW / cellPx) + 1);
    rows = Math.max(1, Math.ceil(cssH / cellPx) + 1);

    const total = cols * rows;
    if (!field || field.length !== total) {
      field = new Float32Array(total);
    }

    // Font + alignment set once per resize (cheap, but avoids per-frame churn).
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `${Math.round(cellPx * 1.04)}px ${cfg.fontFamily}`;

    // Center pointer by default so the still / reduced-motion frame looks good.
    if (!pointerActive) {
      pxTarget = px = cssW * 0.62;
      pyTarget = py = cssH * 0.42;
    }
  }

  // ---------------------------------------------------------------------
  // Fill the intensity buffer for time t (seconds). Layered value noise +
  // a soft pointer bulge. Output is clamped 0..1 per cell.
  // ---------------------------------------------------------------------
  function computeField(t) {
    // Feature size: convert cell coords to noise space. Larger divisor =>
    // larger, calmer blobs. cfg.scale lets the caller tune it.
    const fScale = (0.10 / cfg.scale);
    const flow = t * 0.12 * cfg.speed; // base drift through noise space

    // Two drifting offsets give the field a sense of current/parallax.
    const ox1 = Math.sin(t * 0.10 * cfg.speed) * 1.6;
    const oy1 = Math.cos(t * 0.08 * cfg.speed) * 1.6;
    const ox2 = Math.cos(t * 0.05 * cfg.speed) * 2.4;
    const oy2 = Math.sin(t * 0.06 * cfg.speed) * 2.4;

    // Pointer bulge geometry, expressed in cell units.
    const infl = cfg.mouseInfluence;
    const pcx = px / cellPx;
    const pcy = py / cellPx;
    const radius = Math.max(cols, rows) * 0.28; // bulge reach in cells
    const invR2 = 1 / (radius * radius);

    let i = 0;
    for (let y = 0; y < rows; y++) {
      const ny = y * fScale;
      for (let x = 0; x < cols; x++, i++) {
        const nx = x * fScale;

        // fbm: two octaves of value noise, one slow drifting layer + one
        // finer layer flowing the other way. Kept to 2 octaves for speed.
        let v =
          noise.fbm(nx + ox1 + flow, ny + oy1, 0.6) * 0.65 +
          noise.fbm(nx * 2.1 + ox2, ny * 2.1 + oy2 - flow * 0.7, 0.5) * 0.35;

        // noise.fbm returns ~0..1; gently bias toward a calm midtone field.
        v = v * 1.08 - 0.04;

        // Pointer bulge: smooth falloff that lifts intensity near the cursor.
        if (infl > 0) {
          const dx = x - pcx;
          const dy = y - pcy;
          const d2 = (dx * dx + dy * dy) * invR2;
          if (d2 < 1) {
            const f = 1 - d2;
            v += f * f * 0.5 * infl; // squared falloff -> soft dome
          }
        }

        // Contrast shaping + clamp. Using a smooth curve keeps glyph
        // transitions readable rather than flickery.
        v = (v - 0.5) * cfg.contrast + 0.5;
        field[i] = v < 0 ? 0 : v > 1 ? 1 : v;
      }
    }
  }

  // ---------------------------------------------------------------------
  // Draw the current field as glyphs. Batches by colour bucket so we only
  // touch ctx.fillStyle ~RAMP_STEPS times instead of once per cell.
  // ---------------------------------------------------------------------
  const ramp = cfg.ramp;
  const rampMax = ramp.length - 1;

  function render() {
    // Background wash: warm sand. A faint vertical sand2 gradient adds depth.
    const g = ctx.createLinearGradient(0, 0, 0, cssH);
    g.addColorStop(0, palette.sand);
    g.addColorStop(1, palette.sand2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cssW, cssH);

    // We render bucket-by-bucket. For each colour bucket we sweep the grid
    // once and draw only the cells that fall into it. This trades a few grid
    // sweeps for far fewer fillStyle changes (the expensive part).
    //
    // To keep it to a single grid sweep we instead group draws by computing
    // the bucket per cell and emitting text immediately, but only changing
    // fillStyle when the bucket actually changes between adjacent cells.
    let curBucket = -1;
    let i = 0;
    const cp = cellPx;

    for (let y = 0; y < rows; y++) {
      const py0 = y * cp;
      for (let x = 0; x < cols; x++, i++) {
        const v = field[i];

        // Skip the lowest band entirely: blank "space" glyph means nothing to
        // draw, so we save thousands of fillText calls on quiet areas.
        const gi = (v * rampMax) | 0;
        const ch = ramp[gi];
        if (ch === ' ' || ch === undefined) continue;

        // Pick colour bucket: coral accent for the hottest cells, else the
        // teal->sky LUT indexed by intensity.
        let bucket;
        if (v >= cfg.coralThreshold) {
          bucket = RAMP_STEPS; // sentinel for coral
        } else {
          bucket = (v * (RAMP_STEPS - 1)) | 0;
        }

        if (bucket !== curBucket) {
          ctx.fillStyle = bucket === RAMP_STEPS ? coralStr : colorLUT[bucket];
          curBucket = bucket;
        }

        ctx.fillText(ch, x * cp, py0);
      }
    }
  }

  // ---------------------------------------------------------------------
  // Main loop
  // ---------------------------------------------------------------------
  function frame(now) {
    // Ease pointer toward its target for a soft, premium bulge.
    px += (pxTarget - px) * 0.12;
    py += (pyTarget - py) * 0.12;

    const t = (now - startTime) / 1000;
    computeField(t);
    render();

    if (running) raf = requestAnimationFrame(frame);
  }

  function renderStill() {
    // One good-looking frozen frame for reduced-motion users.
    computeField(2.3); // a hand-picked t that composes nicely
    render();
  }

  // ---------------------------------------------------------------------
  // Pointer interaction
  // ---------------------------------------------------------------------
  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    pxTarget = e.clientX - rect.left;
    pyTarget = e.clientY - rect.top;
    pointerActive = true;
  }

  function onPointerLeave() {
    // Drift back to a pleasant resting spot rather than snapping.
    pointerActive = false;
    pxTarget = cssW * 0.62;
    pyTarget = cssH * 0.42;
  }

  // ---------------------------------------------------------------------
  // Resize handling (debounced via RAF coalescing)
  // ---------------------------------------------------------------------
  let resizePending = false;
  function onResize() {
    if (resizePending) return;
    resizePending = true;
    requestAnimationFrame(() => {
      resizePending = false;
      resize();
      if (!running) renderStill(); // keep the still frame correct on resize
    });
  }

  // ResizeObserver catches element-size changes (flex/grid) that window
  // 'resize' misses. Fall back to window resize if RO is unavailable.
  let ro = null;
  if (typeof ResizeObserver === 'function') {
    ro = new ResizeObserver(onResize);
    ro.observe(canvas);
  } else {
    window.addEventListener('resize', onResize);
  }

  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });

  // ---- Boot --------------------------------------------------------------
  resize();
  if (reduceMotion) {
    renderStill();
  } else {
    running = true;
    startTime = performance.now();
    raf = requestAnimationFrame(frame);
  }

  // ---- Teardown ----------------------------------------------------------
  function destroy() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (ro) ro.disconnect();
    else window.removeEventListener('resize', onResize);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerleave', onPointerLeave);
    field = null;
  }

  return { destroy };
}

/* =========================================================================
 * Helpers
 * ========================================================================= */

// Linear-interpolate two hex colours across `steps` and return CSS rgb strings.
function buildColorLUT(hexA, hexB, steps) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const lut = new Array(steps);
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    // Ease the blend so most cells sit in the calm teal range and only the
    // brighter cells climb toward sky-blue.
    const e = t * t * (3 - 2 * t); // smoothstep
    const r = Math.round(a[0] + (b[0] - a[0]) * e);
    const g = Math.round(a[1] + (b[1] - a[1]) * e);
    const bl = Math.round(a[2] + (b[2] - a[2]) * e);
    lut[i] = `rgb(${r},${g},${bl})`;
  }
  return lut;
}

function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// ---------------------------------------------------------------------------
// Tiny deterministic value-noise generator with 2-octave fbm. Self-contained
// so the part has zero dependencies. Smooth (cosine-style) interpolation gives
// the flowing, organic look we want without the cost of full Perlin gradients.
// ---------------------------------------------------------------------------
function createValueNoise(seed) {
  // Build a permutation table and a per-cell pseudo-random value table.
  const SIZE = 256;
  const MASK = SIZE - 1;
  const rand = mulberry32(seed);
  const vals = new Float32Array(SIZE);
  const perm = new Uint8Array(SIZE * 2);
  for (let i = 0; i < SIZE; i++) {
    vals[i] = rand();
    perm[i] = i;
  }
  // Shuffle the permutation (Fisher-Yates) for spatial decorrelation.
  for (let i = SIZE - 1; i > 0; i--) {
    const j = (rand() * (i + 1)) | 0;
    const tmp = perm[i];
    perm[i] = perm[j];
    perm[j] = tmp;
  }
  for (let i = 0; i < SIZE; i++) perm[SIZE + i] = perm[i];

  function hash(xi, yi) {
    return perm[(perm[xi & MASK] + yi) & MASK];
  }

  // Smooth fade (quintic) for continuous first derivative -> no banding.
  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  // Single-octave value noise in ~[0,1].
  function value(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    const v00 = vals[hash(xi, yi)];
    const v10 = vals[hash(xi + 1, yi)];
    const v01 = vals[hash(xi, yi + 1)];
    const v11 = vals[hash(xi + 1, yi + 1)];

    const u = fade(xf);
    const v = fade(yf);

    const a = v00 + (v10 - v00) * u;
    const b = v01 + (v11 - v01) * u;
    return a + (b - a) * v;
  }

  // Fractal Brownian motion: sum octaves with decreasing amplitude. `gain`
  // controls roughness. Normalised back to ~[0,1].
  function fbm(x, y, gain) {
    let amp = 1;
    let freq = 1;
    let sum = 0;
    let norm = 0;
    for (let o = 0; o < 3; o++) {
      sum += value(x * freq, y * freq) * amp;
      norm += amp;
      amp *= gain;
      freq *= 2.03; // slightly irrational lacunarity avoids visible tiling
    }
    return sum / norm;
  }

  return { value, fbm };
}

// Small fast seeded PRNG.
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// UMD-ish convenience: also expose on window for non-module <script> use.
if (typeof window !== 'undefined') {
  window.initAsciiShader = initAsciiShader;
}

/*
 * Iridescent Foil — saltycodestudio-parts (original, MIT)
 * ---------------------------------------------------------------------------
 * A raw-WebGL holographic / thin-film iridescence surface. It looks like a
 * holographic foil sticker or a sheen of oil-on-water that shifts hue as you
 * move the pointer (or tilt a device). Everything is drawn by a single
 * fullscreen fragment shader — no three.js, no libraries, no CDN.
 *
 * How the effect works (high level):
 *   1. Flowing value-noise builds a smooth "height" field across the canvas.
 *   2. From that height we derive a surface normal (finite differences).
 *   3. A view/light direction is biased by the pointer (u_mouse), so the
 *      grazing angle the eye sees changes as the cursor moves.
 *   4. (normal · view) plus a noise term drive the PHASE of a cosine
 *      "spectral" palette — that's the thin-film interference colour.
 *   5. The palette is biased toward Sand & Surf (teal <-> sky-blue <-> sand),
 *      with surf-coral / violet glints only at grazing angles, so it reads as
 *      a coastal-premium foil rather than a full neon rainbow.
 *   6. Soft specular streaks + a fine anisotropic brushed-metal grain sell it
 *      as a real, physical piece of foil.
 *
 * Public API:
 *   const foil = initIridescentFoil(canvas, opts);
 *   foil.destroy();   // removes listeners, cancels RAF, frees GL resources
 *
 * opts (all optional):
 *   hueShift       Number   base phase offset for the palette        (default 0.0)
 *   sheen          Number   specular streak strength, 0..~2          (default 1.0)
 *   grain          Number   anisotropic brushed-metal grain, 0..~2   (default 1.0)
 *   speed          Number   animation speed multiplier               (default 1.0)
 *   mouseInfluence Number   how strongly the pointer shifts hue      (default 1.0)
 *   colors         Object   palette anchors (CSS hex strings):
 *                    { sand, teal, sky, coral, ink }
 *
 * Reduced motion:
 *   With `prefers-reduced-motion: reduce` the time-based flow is FROZEN on a
 *   hand-picked, good-looking frame. The pointer can STILL shift the hue band,
 *   because reacting to a deliberate cursor move is not motion the user passively
 *   receives — it is direct, intentional interaction. This keeps the part usable
 *   and expressive while respecting the spirit of the setting. Set
 *   `opts.respectReducedMotion = "freeze-all"` to also disable pointer hue shift.
 */

function initIridescentFoil(canvas, opts) {
  opts = opts || {};

  // ---- options / defaults -------------------------------------------------
  var hueShift       = numOr(opts.hueShift, 0.0);
  var sheen          = numOr(opts.sheen, 1.0);
  var grain          = numOr(opts.grain, 1.0);
  var speed          = numOr(opts.speed, 1.0);
  var mouseInfluence = numOr(opts.mouseInfluence, 1.0);
  var reduceMode     = opts.respectReducedMotion || "freeze"; // "freeze" | "freeze-all"

  // Sand & Surf palette anchors (coastal, not neon).
  var defaultColors = {
    sand:  "#F2EBDD", // warm-sand
    teal:  "#0E3A40", // deep-teal
    sky:   "#4FA8C9", // sky-blue
    coral: "#FF6F59", // surf-coral (single accent, grazing-angle glints only)
    ink:   "#1C2B2E"  // driftwood-ink (shadow base)
  };
  var colors = Object.assign({}, defaultColors, opts.colors || {});

  // ---- reduced-motion detection ------------------------------------------
  var mqReduce = (typeof window.matchMedia === "function")
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false, addEventListener: null, removeEventListener: null };
  var reducedMotion = !!mqReduce.matches;

  // ---- WebGL context ------------------------------------------------------
  var gl = null;
  try {
    var ctxOpts = { antialias: false, alpha: false, premultipliedAlpha: false,
                    preserveDrawingBuffer: false, powerPreference: "high-performance" };
    gl = canvas.getContext("webgl", ctxOpts) || canvas.getContext("experimental-webgl", ctxOpts);
  } catch (e) { gl = null; }

  // If WebGL is missing, degrade gracefully to a CSS conic-gradient fallback.
  if (!gl) {
    applyCssFallback(canvas, colors);
    return { destroy: function () { clearCssFallback(canvas); } };
  }

  // ---- shaders ------------------------------------------------------------
  // A single fullscreen triangle; the vertex shader just passes clip coords.
  var VERT = [
    "attribute vec2 a_pos;",
    "void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }"
  ].join("\n");

  // The whole effect lives here.
  var FRAG = [
    "precision highp float;",
    "",
    "uniform vec2  u_resolution;",
    "uniform float u_time;",
    "uniform vec2  u_mouse;          // 0..1, pointer position",
    "uniform float u_hueShift;",
    "uniform float u_sheen;",
    "uniform float u_grain;",
    "uniform float u_mouseInfluence;",
    "uniform vec3  u_sand;",
    "uniform vec3  u_teal;",
    "uniform vec3  u_sky;",
    "uniform vec3  u_coral;",
    "uniform vec3  u_ink;",
    "",
    "// ---- hash + value noise (cheap, smooth) ---------------------------------",
    "float hash(vec2 p){",
    "  p = fract(p * vec2(123.34, 345.45));",
    "  p += dot(p, p + 34.345);",
    "  return fract(p.x * p.y);",
    "}",
    "float vnoise(vec2 p){",
    "  vec2 i = floor(p); vec2 f = fract(p);",
    "  vec2 u = f*f*(3.0-2.0*f);              // smoothstep weights",
    "  float a = hash(i + vec2(0.0,0.0));",
    "  float b = hash(i + vec2(1.0,0.0));",
    "  float c = hash(i + vec2(0.0,1.0));",
    "  float d = hash(i + vec2(1.0,1.0));",
    "  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);",
    "}",
    "// Flowing fractal noise: a few octaves that drift over time.",
    "float fbm(vec2 p, float t){",
    "  float v = 0.0; float amp = 0.55; float freq = 1.0;",
    "  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);",
    "  for(int i=0;i<5;i++){",
    "    vec2 q = p*freq + vec2(t*0.10*float(i+1), -t*0.07*float(i+1));",
    "    v += amp * vnoise(q);",
    "    p = rot * p;",
    "    freq *= 2.02; amp *= 0.52;",
    "  }",
    "  return v;",
    "}",
    "",
    "// ---- spectral / thin-film cosine palette --------------------------------",
    "// Generic iridescent rainbow from a phase value (written originally).",
    "vec3 spectral(float phase){",
    "  // classic cosine-gradient form; phase travels -> hue travels.",
    "  vec3 a = vec3(0.50, 0.50, 0.50);",
    "  vec3 b = vec3(0.50, 0.50, 0.50);",
    "  vec3 c = vec3(1.00, 1.00, 1.00);",
    "  vec3 d = vec3(0.00, 0.33, 0.67);",
    "  return a + b * cos(6.28318 * (c * phase + d));",
    "}",
    "",
    "void main(){",
    "  vec2 uv = gl_FragCoord.xy / u_resolution.xy;",
    "  // aspect-correct coordinates centred at 0",
    "  vec2 p = (gl_FragCoord.xy - 0.5*u_resolution.xy) / min(u_resolution.x, u_resolution.y);",
    "  float t = u_time;",
    "",
    "  // mouse in the same centred / aspect space",
    "  vec2 m = (u_mouse - 0.5) * vec2(u_resolution.x/min(u_resolution.x,u_resolution.y),",
    "                                  u_resolution.y/min(u_resolution.x,u_resolution.y)) * 2.0;",
    "",
    "  // ---- 1) height field from flowing noise ------------------------------",
    "  vec2 warp = vec2(fbm(p*2.0 + 11.3, t), fbm(p*2.0 - 7.1, t));",
    "  float h = fbm(p*2.6 + 0.6*warp + m*0.15, t);",
    "",
    "  // ---- 2) normal from height via finite differences --------------------",
    "  float e = 1.5/min(u_resolution.x,u_resolution.y);",
    "  float hx = fbm((p+vec2(e,0.0))*2.6 + 0.6*warp + m*0.15, t) - h;",
    "  float hy = fbm((p+vec2(0.0,e))*2.6 + 0.6*warp + m*0.15, t) - h;",
    "  vec3 nrm = normalize(vec3(-hx, -hy, e*2.2));",
    "",
    "  // ---- 3) view/light direction biased by the pointer -------------------",
    "  // The pointer tilts where the 'light' sits, so the grazing band moves.",
    "  vec3 viewDir  = normalize(vec3(0.0, 0.0, 1.0));",
    "  vec3 lightDir = normalize(vec3(m * (0.55*u_mouseInfluence) + p*0.25, 0.85));",
    "  float ndv = clamp(dot(nrm, viewDir), 0.0, 1.0);",
    "  float ndl = clamp(dot(nrm, lightDir), 0.0, 1.0);",
    "  // Fresnel-ish grazing term: stronger iridescence at shallow angles.",
    "  float fres = pow(1.0 - ndv, 3.0);",
    "",
    "  // ---- 4) thin-film phase: height + angle + mouse ----------------------",
    "  // Optical path difference analogue -> phase. Mouse shifts the band so the",
    "  // hue VISIBLY travels across the canvas as the cursor moves.",
    "  float mouseAngle = atan(m.y, m.x);",
    "  float phase = h*1.7",
    "              + (1.0-ndv)*1.3",
    "              + ndl*0.4",
    "              + (m.x*0.35 + m.y*0.20)*u_mouseInfluence",
    "              + mouseAngle*0.05*u_mouseInfluence",
    "              + u_hueShift;",
    "",
    "  vec3 rainbow = spectral(phase);",
    "",
    "  // ---- 5) BIAS palette toward Sand & Surf ------------------------------",
    "  // Use the rainbow only as a 'where in the sweep are we' selector, then",
    "  // remap onto teal <-> sky <-> sand, with coral/violet glints at grazing.",
    "  float sweep = 0.5 + 0.5*sin(6.28318*phase);          // 0..1 sweep position",
    "  // base coastal gradient: deep-teal -> sky-blue -> warm-sand",
    "  vec3 coastal = mix(u_teal, u_sky, smoothstep(0.0, 0.55, sweep));",
    "  coastal      = mix(coastal, u_sand, smoothstep(0.5, 1.0, sweep));",
    "  // borrow a little of the pure spectral chroma so it shimmers, but keep it low",
    "  vec3 col = mix(coastal, coastal*0.6 + rainbow*0.55, 0.32 + 0.30*fres);",
    "",
    "  // surf-coral + violet glints ONLY at grazing angles, sparingly",
    "  float glint = fres * smoothstep(0.6, 1.0, 0.5+0.5*sin(6.28318*phase*1.7 + 1.3));",
    "  vec3 violet = mix(u_coral, vec3(0.55,0.40,0.85), 0.5);",
    "  col = mix(col, mix(u_coral, violet, 0.5), clamp(glint*0.55, 0.0, 0.6));",
    "",
    "  // shade with the height a touch toward driftwood-ink for depth",
    "  col = mix(u_ink, col, clamp(0.55 + 0.55*h + 0.3*ndl, 0.0, 1.0));",
    "",
    "  // ---- 6a) soft specular streaks ---------------------------------------",
    "  vec3 halfv = normalize(lightDir + viewDir);",
    "  float spec = pow(clamp(dot(nrm, halfv), 0.0, 1.0), 48.0);",
    "  // stretch the highlight into streaks along x for a foil look",
    "  float streak = pow(clamp(dot(nrm, halfv), 0.0, 1.0), 12.0);",
    "  streak *= 0.5 + 0.5*sin(p.y*60.0 + h*8.0);",
    "  col += u_sheen * (spec*0.7 + streak*0.18) * vec3(1.0, 0.98, 0.94);",
    "",
    "  // ---- 6b) fine anisotropic brushed-metal grain ------------------------",
    "  // Directional noise stretched along x -> reads as brushed foil.",
    "  float g = vnoise(vec2(p.x*420.0, p.y*22.0) + t*0.3);",
    "  float g2 = vnoise(vec2(p.x*900.0, p.y*8.0));",
    "  float brush = (g*0.7 + g2*0.3 - 0.5);",
    "  col += brush * 0.05 * u_grain;",
    "  // very subtle per-pixel sparkle dither to kill banding",
    "  col += (hash(uv*u_resolution.xy + t) - 0.5) * 0.012;",
    "",
    "  // gentle vignette so edges feel like a physical sheet catching light",
    "  float vig = smoothstep(1.25, 0.35, length(p));",
    "  col *= mix(0.86, 1.06, vig);",
    "",
    "  col = clamp(col, 0.0, 1.0);",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  // ---- compile / link ----------------------------------------------------
  var program = createProgram(gl, VERT, FRAG);
  if (!program) {
    // Shader failed to compile/link — degrade rather than throw.
    applyCssFallback(canvas, colors);
    return { destroy: function () { clearCssFallback(canvas); } };
  }
  gl.useProgram(program);

  // Fullscreen triangle (covers the viewport with 3 verts).
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Uniform locations.
  var U = {
    res:   gl.getUniformLocation(program, "u_resolution"),
    time:  gl.getUniformLocation(program, "u_time"),
    mouse: gl.getUniformLocation(program, "u_mouse"),
    hue:   gl.getUniformLocation(program, "u_hueShift"),
    sheen: gl.getUniformLocation(program, "u_sheen"),
    grain: gl.getUniformLocation(program, "u_grain"),
    mInf:  gl.getUniformLocation(program, "u_mouseInfluence"),
    sand:  gl.getUniformLocation(program, "u_sand"),
    teal:  gl.getUniformLocation(program, "u_teal"),
    sky:   gl.getUniformLocation(program, "u_sky"),
    coral: gl.getUniformLocation(program, "u_coral"),
    ink:   gl.getUniformLocation(program, "u_ink")
  };

  // Static uniforms (colours + tunables) — set once, update on demand.
  function pushStaticUniforms() {
    gl.useProgram(program);
    gl.uniform1f(U.hue, hueShift);
    gl.uniform1f(U.sheen, sheen);
    gl.uniform1f(U.grain, grain);
    gl.uniform1f(U.mInf, mouseInfluence);
    gl.uniform3fv(U.sand,  hexToRgb(colors.sand));
    gl.uniform3fv(U.teal,  hexToRgb(colors.teal));
    gl.uniform3fv(U.sky,   hexToRgb(colors.sky));
    gl.uniform3fv(U.coral, hexToRgb(colors.coral));
    gl.uniform3fv(U.ink,   hexToRgb(colors.ink));
  }
  pushStaticUniforms();

  // ---- state --------------------------------------------------------------
  var dpr = 1;
  var mouse = { x: 0.5, y: 0.5 };       // current (0..1)
  var targetMouse = { x: 0.5, y: 0.5 }; // smoothed toward this
  var raf = 0;
  var startTime = (typeof performance !== "undefined" ? performance.now() : Date.now());
  // Frozen frame chosen to look good when motion is reduced.
  var FROZEN_TIME = 7.3;
  var disposed = false;

  // ---- resize / DPR -------------------------------------------------------
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR for perf
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(1, Math.round(rect.width * dpr));
    var h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  // ---- pointer ------------------------------------------------------------
  function pointerToUV(clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    var x = (clientX - rect.left) / Math.max(1, rect.width);
    var y = 1.0 - (clientY - rect.top) / Math.max(1, rect.height); // flip Y for GL
    return { x: clamp01(x), y: clamp01(y) };
  }
  function onPointerMove(e) {
    var t = pointerToUV(e.clientX, e.clientY);
    targetMouse.x = t.x; targetMouse.y = t.y;
    // When motion is reduced but pointer-hue is allowed, render on demand.
    if (reducedMotion && reduceMode !== "freeze-all" && !raf) {
      raf = requestAnimationFrame(renderOnce);
    }
  }
  function onTouchMove(e) {
    if (e.touches && e.touches.length) {
      onPointerMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    }
  }
  // Device tilt also nudges the highlight (progressive enhancement).
  function onOrientation(e) {
    if (e.gamma == null || e.beta == null) return;
    targetMouse.x = clamp01(0.5 + (e.gamma / 45) * 0.5); // left/right
    targetMouse.y = clamp01(0.5 - (e.beta - 45) / 90);   // front/back
    if (reducedMotion && reduceMode !== "freeze-all" && !raf) {
      raf = requestAnimationFrame(renderOnce);
    }
  }

  // ---- draw ---------------------------------------------------------------
  function draw(timeSeconds) {
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(U.res, canvas.width, canvas.height);
    gl.uniform1f(U.time, timeSeconds);
    gl.uniform2f(U.mouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // Animated loop (normal motion).
  function frame(now) {
    if (disposed) return;
    // smooth the pointer for a liquid feel
    mouse.x += (targetMouse.x - mouse.x) * 0.08;
    mouse.y += (targetMouse.y - mouse.y) * 0.08;
    var elapsed = (now - startTime) / 1000 * speed;
    draw(elapsed);
    raf = requestAnimationFrame(frame);
  }

  // One-shot render (reduced-motion: frozen time, but pointer can shift hue).
  function renderOnce() {
    raf = 0;
    if (disposed) return;
    // settle the pointer quickly toward target with a few sub-steps
    for (var i = 0; i < 6; i++) {
      mouse.x += (targetMouse.x - mouse.x) * 0.5;
      mouse.y += (targetMouse.y - mouse.y) * 0.5;
    }
    draw(FROZEN_TIME);
  }

  // ---- wiring -------------------------------------------------------------
  function startAnimation() {
    cancelAnimationFrame(raf); raf = 0;
    if (reducedMotion) {
      // Freeze on a still frame; pointer still allowed to shift hue (default).
      renderOnce();
    } else {
      raf = requestAnimationFrame(frame);
    }
  }

  function onReduceChange() {
    reducedMotion = !!mqReduce.matches;
    startAnimation();
  }

  // Listeners
  window.addEventListener("resize", onResizeWrapped, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
  }
  if (mqReduce.addEventListener) mqReduce.addEventListener("change", onReduceChange);
  else if (mqReduce.addListener) mqReduce.addListener(onReduceChange); // older Safari

  function onResizeWrapped() {
    resize();
    if (reducedMotion) renderOnce();
  }

  // Initial sizing + first paint.
  resize();
  startAnimation();

  // ---- public API ---------------------------------------------------------
  return {
    /** Update tunables/colours live. */
    update: function (next) {
      next = next || {};
      if (next.hueShift != null) hueShift = +next.hueShift;
      if (next.sheen != null) sheen = +next.sheen;
      if (next.grain != null) grain = +next.grain;
      if (next.speed != null) speed = +next.speed;
      if (next.mouseInfluence != null) mouseInfluence = +next.mouseInfluence;
      if (next.colors) colors = Object.assign({}, colors, next.colors);
      pushStaticUniforms();
      if (reducedMotion) renderOnce();
    },
    /** Tear everything down. Safe to call once. */
    destroy: function () {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf); raf = 0;
      window.removeEventListener("resize", onResizeWrapped);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", onOrientation);
      }
      if (mqReduce.removeEventListener) mqReduce.removeEventListener("change", onReduceChange);
      else if (mqReduce.removeListener) mqReduce.removeListener(onReduceChange);
      try {
        gl.deleteBuffer(buf);
        gl.deleteProgram(program);
        var lose = gl.getExtension("WEBGL_lose_context");
        if (lose) lose.loseContext();
      } catch (e) { /* ignore */ }
    }
  };

  // ===== helpers (module scope) ==========================================
}

/* ----------------------------- utilities -------------------------------- */

function numOr(v, d) { return (typeof v === "number" && isFinite(v)) ? v : d; }
function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }

/** "#RRGGBB" (or "#RGB") -> [r,g,b] in 0..1. */
function hexToRgb(hex) {
  if (typeof hex !== "string") return [1, 1, 1];
  var h = hex.replace("#", "").trim();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  var n = parseInt(h, 16);
  if (isNaN(n) || h.length !== 6) return [1, 1, 1];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Compile a shader, log + return null on failure. */
function compileShader(gl, type, src) {
  var sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-console
    console.error("[iridescent-foil] shader compile error:\n" + gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/** Link a program from vertex + fragment source. */
function createProgram(gl, vsrc, fsrc) {
  var vs = compileShader(gl, gl.VERTEX_SHADER, vsrc);
  var fs = compileShader(gl, gl.FRAGMENT_SHADER, fsrc);
  if (!vs || !fs) return null;
  var p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    // eslint-disable-next-line no-console
    console.error("[iridescent-foil] program link error:\n" + gl.getProgramInfoLog(p));
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

/** CSS conic-gradient fallback when WebGL is unavailable. */
function applyCssFallback(canvas, colors) {
  var c = colors || {};
  var sand = c.sand || "#F2EBDD", teal = c.teal || "#0E3A40",
      sky = c.sky || "#4FA8C9", coral = c.coral || "#FF6F59", ink = c.ink || "#1C2B2E";
  canvas.style.background =
    "conic-gradient(from 200deg at 35% 40%, " +
    teal + ", " + sky + ", " + sand + ", " + coral + " 78%, " + sky + ", " + teal + "), " +
    "radial-gradient(120% 120% at 70% 30%, " + sky + "55, transparent 60%), " +
    ink;
  canvas.style.backgroundBlendMode = "screen, normal, normal";
  canvas.setAttribute("data-foil-fallback", "css");
}
function clearCssFallback(canvas) {
  canvas.style.background = "";
  canvas.style.backgroundBlendMode = "";
  canvas.removeAttribute("data-foil-fallback");
}

// UMD-ish export so it works as a module or a plain <script>.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { initIridescentFoil: initIridescentFoil };
}
if (typeof window !== "undefined") {
  window.initIridescentFoil = initIridescentFoil;
}

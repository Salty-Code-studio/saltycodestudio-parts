/*
 * Glass Refraction Panel — saltycodestudio-parts (original, MIT)
 * ----------------------------------------------------------------
 * A real REFRACTIVE frosted-glass card rendered in raw WebGL (no three.js,
 * no libraries). A slowly animated Sand & Surf gradient/noise background is
 * computed procedurally in the fragment shader. Over a rounded-rectangle
 * "glass panel" region, the shader DISTORTS the sampled background using a
 * procedural ripple/bump (normal) function — so it genuinely looks like you
 * are peering through textured glass — and adds:
 *
 *   - chromatic aberration (R/G/B sampled at slightly offset UVs near edges)
 *   - a soft multi-tap blur (the "frost")
 *   - a bright specular edge highlight
 *   - a faint inner shadow
 *
 * The panel is DRAGGABLE: move the pointer and the glass slides across the
 * background, refraction updating live.
 *
 * Public API:
 *   const handle = initGlassRefraction(canvasEl, opts);
 *   handle.destroy();
 *
 * opts (all optional):
 *   ripple      number  0..2     strength of the glass surface distortion (default 1)
 *   blur        number  0..2     frost / blur amount (default 1)
 *   aberration  number  0..2     chromatic aberration strength (default 1)
 *   radius      number  px       corner radius of the panel (default 36)
 *   speed       number           background animation speed multiplier (default 1)
 *   colors      object           Sand & Surf overrides:
 *                                 { sand, sand2, teal, sky, coral, ink }
 *                                 each as [r,g,b] in 0..1
 *
 * Honors prefers-reduced-motion (freezes on a still, composed frame),
 * handles DPR + resize, cleans up rAF + listeners, and degrades to a static
 * CSS glass-card fallback if WebGL is unavailable.
 */

function initGlassRefraction(canvas, opts) {
  opts = opts || {};

  // ---- Sand & Surf palette (coastal, not neon). RGB in 0..1. ----------------
  var C = opts.colors || {};
  var COL = {
    sand:  C.sand  || [0.949, 0.922, 0.867], // #F2EBDD warm-sand
    sand2: C.sand2 || [0.918, 0.882, 0.812], // #EAE1CF sand-2
    teal:  C.teal  || [0.055, 0.227, 0.251], // #0E3A40 deep-teal
    sky:   C.sky   || [0.310, 0.659, 0.788], // #4FA8C9 sky-blue
    coral: C.coral || [1.000, 0.435, 0.349], // #FF6F59 surf-coral (single accent)
    ink:   C.ink   || [0.110, 0.169, 0.180]  // #1C2B2E driftwood-ink
  };

  var settings = {
    ripple:     num(opts.ripple, 1.0),
    blur:       num(opts.blur, 1.0),
    aberration: num(opts.aberration, 1.0),
    radius:     num(opts.radius, 36),
    speed:      num(opts.speed, 1.0)
  };
  function num(v, d) { return (typeof v === 'number' && isFinite(v)) ? v : d; }

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // WebGL context (try webgl, then experimental-webgl). Fall back to CSS.
  // --------------------------------------------------------------------------
  var gl = null;
  try {
    gl = canvas.getContext('webgl', { antialias: true, alpha: false, premultipliedAlpha: false }) ||
         canvas.getContext('experimental-webgl', { antialias: true, alpha: false });
  } catch (e) { gl = null; }

  if (!gl) {
    return cssFallback(canvas, COL);
  }

  // --------------------------------------------------------------------------
  // Shaders
  // --------------------------------------------------------------------------
  var VERT = [
    'attribute vec2 aPos;',
    'void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }'
  ].join('\n');

  // Fragment shader: everything happens here.
  var FRAG = [
    'precision highp float;',
    '',
    'uniform vec2  uRes;        // canvas resolution in px',
    'uniform float uTime;       // seconds',
    'uniform vec2  uPanelPos;   // panel center in px',
    'uniform vec2  uPanelSize;  // panel half-size in px',
    'uniform float uRadius;     // corner radius px',
    'uniform float uRipple;',
    'uniform float uBlur;',
    'uniform float uAberr;',
    '',
    'uniform vec3 uSand;',
    'uniform vec3 uSand2;',
    'uniform vec3 uTeal;',
    'uniform vec3 uSky;',
    'uniform vec3 uCoral;',
    'uniform vec3 uInk;',
    '',
    '// ---- hash / value noise -------------------------------------------------',
    'vec2 hash2(vec2 p){',
    '  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));',
    '  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);',
    '}',
    'float noise(vec2 p){',
    '  vec2 i = floor(p); vec2 f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  float a = dot(hash2(i + vec2(0.0,0.0)), f - vec2(0.0,0.0));',
    '  float b = dot(hash2(i + vec2(1.0,0.0)), f - vec2(1.0,0.0));',
    '  float c = dot(hash2(i + vec2(0.0,1.0)), f - vec2(0.0,1.0));',
    '  float d = dot(hash2(i + vec2(1.0,1.0)), f - vec2(1.0,1.0));',
    '  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);',
    '}',
    'float fbm(vec2 p){',
    '  float v = 0.0; float a = 0.5;',
    '  for(int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }',
    '  return v;',
    '}',
    '',
    '// ---- procedural Sand & Surf background ----------------------------------',
    '// uv in 0..1 (aspect-corrected). Slow drifting coastal gradient + surf bands.',
    'vec3 background(vec2 uv, float t){',
    '  vec2 q = uv;',
    '  q.x *= uRes.x / uRes.y;            // aspect correct so noise is not stretched',
    '  // large slow flow field',
    '  float f1 = fbm(q * 1.6 + vec2(t * 0.05, t * 0.03));',
    '  float f2 = fbm(q * 3.1 - vec2(t * 0.04, t * 0.06) + f1);',
    '  // vertical-ish gradient: sand at the foot, teal->sky toward the top',
    '  float grad = clamp(uv.y * 0.9 + f1 * 0.35, 0.0, 1.0);',
    '  vec3 col = mix(uSand, uSand2, smoothstep(0.0, 0.5, f2));',
    '  col = mix(col, uSky,  smoothstep(0.35, 0.95, grad + f2 * 0.15));',
    '  col = mix(col, uTeal, smoothstep(0.7, 1.05, grad));',
    '  // soft "surf" bands — thin bright sky-blue streaks drifting across',
    '  float bands = sin((uv.y * 6.0 + f1 * 2.0 - t * 0.25)) * 0.5 + 0.5;',
    '  bands = pow(bands, 6.0) * 0.18;',
    '  col += uSky * bands * (1.0 - grad);',
    '  // single coral accent: one faint warm glow, used sparingly (never a field)',
    '  vec2 cc = vec2(0.26 + 0.04 * sin(t * 0.1), 0.30 + 0.03 * cos(t * 0.13));',
    '  float glow = smoothstep(0.32, 0.0, distance(uv, cc));',
    '  col = mix(col, uCoral, glow * 0.16);',
    '  // gentle vignette toward ink at the corners for depth',
    '  float vig = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(uRes.x/uRes.y, 1.0)));',
    '  col = mix(uInk, col, mix(0.78, 1.0, vig));',
    '  return col;',
    '}',
    '',
    '// ---- signed distance to a rounded rectangle -----------------------------',
    '// p, halfSize, radius all in px, p relative to panel center.',
    'float sdRoundRect(vec2 p, vec2 b, float r){',
    '  vec2 d = abs(p) - b + r;',
    '  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;',
    '}',
    '',
    '// ---- glass surface height -> used to build a refraction normal ----------',
    '// A procedural rippled/bumpy height field local to the panel.',
    'float glassHeight(vec2 lp, float t){',
    '  // lp = panel-local coords, roughly -1..1',
    '  float h = 0.0;',
    '  h += fbm(lp * 3.5 + vec2(t * 0.08, -t * 0.05)) * 0.6;',
    '  h += sin(lp.x * 9.0 + t * 0.6) * sin(lp.y * 7.0 - t * 0.4) * 0.12;',
    '  h += fbm(lp * 8.0) * 0.18;   // fine grain frost',
    '  return h;',
    '}',
    '',
    'void main(){',
    '  vec2 fc = gl_FragCoord.xy;',
    '  vec2 uv = fc / uRes;',
    '  float t = uTime;',
    '',
    '  // plain background everywhere (the part outside the glass)',
    '  vec3 bg = background(uv, t);',
    '',
    '  // distance to panel (px). Negative inside.',
    '  vec2 rel = fc - uPanelPos;',
    '  float d = sdRoundRect(rel, uPanelSize, uRadius);',
    '',
    '  // antialiased panel mask',
    '  float aa = 1.5;',
    '  float inside = 1.0 - smoothstep(-aa, aa, d);',
    '',
    '  vec3 outCol = bg;',
    '',
    '  if (inside > 0.001){',
    '    // panel-local normalized coords (-1..1)',
    '    vec2 lp = rel / uPanelSize;',
    '',
    '    // --- refraction: derive a normal from the glass height field ---------',
    '    float e = 0.012;',
    '    float hx = glassHeight(lp + vec2(e, 0.0), t) - glassHeight(lp - vec2(e, 0.0), t);',
    '    float hy = glassHeight(lp + vec2(0.0, e), t) - glassHeight(lp - vec2(0.0, e), t);',
    '    vec2 grad = vec2(hx, hy);',
    '',
    '    // refraction offset in uv space; stronger near the edges (bevel feel)',
    '    float edge = smoothstep(0.0, 60.0, -d);            // 0 at rim -> 1 inside',
    '    float bevel = mix(1.35, 0.85, edge);               // rim refracts more',
    '    vec2 refr = grad * (0.06 * uRipple * bevel) ;',
    '    vec2 ruv = uv + refr;',
    '',
    '    // --- frost blur: multi-tap average of the background ------------------',
    '    float spread = (0.004 + 0.010 * uBlur) ;',
    '    vec3 blurred = vec3(0.0);',
    '    // 9-tap rotated kernel (cheap, smooth)',
    '    vec2 k0 = vec2( 1.0,  0.0);',
    '    vec2 k1 = vec2( 0.5,  0.86);',
    '    vec2 k2 = vec2(-0.5,  0.86);',
    '    vec2 k3 = vec2(-1.0,  0.0);',
    '    vec2 k4 = vec2(-0.5, -0.86);',
    '    vec2 k5 = vec2( 0.5, -0.86);',
    '    blurred += background(ruv, t) * 0.28;',
    '    blurred += background(ruv + k0 * spread, t) * 0.12;',
    '    blurred += background(ruv + k1 * spread, t) * 0.12;',
    '    blurred += background(ruv + k2 * spread, t) * 0.12;',
    '    blurred += background(ruv + k3 * spread, t) * 0.12;',
    '    blurred += background(ruv + k4 * spread, t) * 0.12;',
    '    blurred += background(ruv + k5 * spread, t) * 0.12;',
    '',
    '    // --- chromatic aberration: split R/G/B along the refraction dir -------',
    '    vec2 ca = (refr) * (2.2 * uAberr) + normalize(rel + 0.0001) * (0.0016 * uAberr * (1.0 - edge));',
    '    float r = background(ruv + ca, t).r;',
    '    float b = background(ruv - ca, t).b;',
    '    vec3 glass = vec3(r, blurred.g, b);',
    '    // blend the blur in so the frost still reads',
    '    glass = mix(glass, blurred, 0.55);',
    '',
    '    // --- tint: glass keeps a faint cool teal cast ------------------------',
    '    glass = mix(glass, glass * vec3(0.96, 1.0, 1.02) + uTeal * 0.04, 0.35);',
    '    glass += 0.03; // slight lift, like backlit glass',
    '',
    '    // --- specular edge highlight -----------------------------------------',
    '    // bright thin ring just inside the rim, biased to the top-left light',
    '    float rim = smoothstep(2.5, 0.0, abs(d + 2.0));',
    '    vec2 lightDir = normalize(vec2(-0.6, 0.8));',
    '    float facing = clamp(dot(normalize(grad + lightDir * 0.6), lightDir), 0.0, 1.0);',
    '    float spec = rim * (0.35 + 0.65 * facing);',
    '    glass += vec3(1.0) * spec * 0.55;',
    '',
    '    // top-left soft sheen across the whole panel',
    '    float sheen = smoothstep(0.9, -0.6, lp.x + lp.y);',
    '    glass += vec3(1.0) * sheen * 0.06;',
    '',
    '    // --- faint inner shadow near the rim (bottom-right) ------------------',
    '    float innerSh = smoothstep(0.0, 22.0, -d) ;',
    '    innerSh = (1.0 - innerSh);',
    '    float shadowSide = clamp(lp.x + lp.y, 0.0, 1.0);',
    '    glass -= vec3(0.0, 0.02, 0.03) * innerSh * (0.4 + 0.6 * shadowSide) * 2.0;',
    '',
    '    // --- soft outer drop shadow on the background ------------------------',
    '    // (handled below via outShadow before compositing)',
    '    outCol = mix(bg, glass, inside);',
    '  }',
    '',
    '  // outer drop shadow: darken background in a band just outside the panel',
    '  float outShadow = smoothstep(26.0, 2.0, d) * (1.0 - inside);',
    '  outCol = mix(outCol, outCol * 0.82, outShadow * 0.9);',
    '',
    '  // subtle outer glow rim (light catching the very edge)',
    '  float outGlow = smoothstep(3.0, 0.0, abs(d)) * (1.0 - inside);',
    '  outCol += vec3(1.0) * outGlow * 0.05;',
    '',
    '  gl_FragColor = vec4(outCol, 1.0);',
    '}'
  ].join('\n');

  // --------------------------------------------------------------------------
  // Compile + link
  // --------------------------------------------------------------------------
  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error('Shader compile error: ' + log);
    }
    return s;
  }

  var program, vs, fs;
  try {
    vs = compile(gl.VERTEX_SHADER, VERT);
    fs = compile(gl.FRAGMENT_SHADER, FRAG);
    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Program link error: ' + gl.getProgramInfoLog(program));
    }
  } catch (err) {
    // GLSL failed: degrade gracefully rather than throw.
    if (typeof console !== 'undefined') console.warn('[glass-refraction]', err.message);
    return cssFallback(canvas, COL);
  }

  gl.useProgram(program);

  // Fullscreen triangle pair
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Uniform locations
  var U = {
    res:        gl.getUniformLocation(program, 'uRes'),
    time:       gl.getUniformLocation(program, 'uTime'),
    panelPos:   gl.getUniformLocation(program, 'uPanelPos'),
    panelSize:  gl.getUniformLocation(program, 'uPanelSize'),
    radius:     gl.getUniformLocation(program, 'uRadius'),
    ripple:     gl.getUniformLocation(program, 'uRipple'),
    blur:       gl.getUniformLocation(program, 'uBlur'),
    aberr:      gl.getUniformLocation(program, 'uAberr'),
    sand:       gl.getUniformLocation(program, 'uSand'),
    sand2:      gl.getUniformLocation(program, 'uSand2'),
    teal:       gl.getUniformLocation(program, 'uTeal'),
    sky:        gl.getUniformLocation(program, 'uSky'),
    coral:      gl.getUniformLocation(program, 'uCoral'),
    ink:        gl.getUniformLocation(program, 'uInk')
  };

  gl.uniform3fv(U.sand,  COL.sand);
  gl.uniform3fv(U.sand2, COL.sand2);
  gl.uniform3fv(U.teal,  COL.teal);
  gl.uniform3fv(U.sky,   COL.sky);
  gl.uniform3fv(U.coral, COL.coral);
  gl.uniform3fv(U.ink,   COL.ink);

  // --------------------------------------------------------------------------
  // State: size, DPR, panel position (in CSS px), dragging.
  // --------------------------------------------------------------------------
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var cssW = 0, cssH = 0;       // CSS pixel size
  var panel = { x: 0, y: 0 };   // panel center in CSS px
  var half = { w: 0, h: 0 };    // panel half-size in CSS px
  var started = false;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    cssW = Math.max(1, rect.width);
    cssH = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // panel sizing: responsive, capped, portrait-ish card
    var w = Math.min(cssW * 0.46, 460);
    var h = Math.min(cssH * 0.62, 320);
    w = Math.max(w, 200);
    h = Math.max(h, 150);
    half.w = w * 0.5;
    half.h = h * 0.5;

    if (!started) {
      panel.x = cssW * 0.5;
      panel.y = cssH * 0.5;
      started = true;
    }
    clampPanel();
  }

  function clampPanel() {
    var m = 8;
    panel.x = Math.max(half.w + m, Math.min(cssW - half.w - m, panel.x));
    panel.y = Math.max(half.h + m, Math.min(cssH - half.h - m, panel.y));
  }

  // --------------------------------------------------------------------------
  // Dragging: pointer moves the glass. Grab-anywhere; offset preserved if you
  // grab the panel itself, otherwise the panel re-centers under the pointer.
  // --------------------------------------------------------------------------
  var dragging = false;
  var grabDX = 0, grabDY = 0;

  function localPoint(ev) {
    var rect = canvas.getBoundingClientRect();
    var cx = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
    var cy = (ev.touches ? ev.touches[0].clientY : ev.clientY) - rect.top;
    return { x: cx, y: cy };
  }

  function insidePanel(p) {
    return Math.abs(p.x - panel.x) <= half.w && Math.abs(p.y - panel.y) <= half.h;
  }

  function onDown(ev) {
    var p = localPoint(ev);
    dragging = true;
    if (insidePanel(p)) {
      grabDX = panel.x - p.x;
      grabDY = panel.y - p.y;
    } else {
      grabDX = 0; grabDY = 0;
      panel.x = p.x; panel.y = p.y;
    }
    clampPanel();
    canvas.style.cursor = 'grabbing';
    if (ev.cancelable) ev.preventDefault();
  }
  function onMove(ev) {
    if (!dragging) {
      // hover cue
      var hp = localPoint(ev);
      canvas.style.cursor = insidePanel(hp) ? 'grab' : 'default';
      return;
    }
    var p = localPoint(ev);
    panel.x = p.x + grabDX;
    panel.y = p.y + grabDY;
    clampPanel();
    if (ev.cancelable) ev.preventDefault();
  }
  function onUp() {
    dragging = false;
    canvas.style.cursor = 'grab';
  }

  canvas.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  canvas.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onUp);

  // Resize handling
  var ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(resize);
    ro.observe(canvas);
  }
  window.addEventListener('resize', resize);

  // --------------------------------------------------------------------------
  // Render loop
  // --------------------------------------------------------------------------
  var raf = 0;
  var startT = performance.now();

  function draw(now) {
    var t = ((now - startT) / 1000) * settings.speed;
    gl.uniform2f(U.res, canvas.width, canvas.height);
    gl.uniform1f(U.time, t);
    gl.uniform2f(U.panelPos, panel.x * dpr, (cssH - panel.y) * dpr); // flip Y for gl_FragCoord
    gl.uniform2f(U.panelSize, half.w * dpr, half.h * dpr);
    gl.uniform1f(U.radius, settings.radius * dpr);
    gl.uniform1f(U.ripple, settings.ripple);
    gl.uniform1f(U.blur, settings.blur);
    gl.uniform1f(U.aberr, settings.aberration);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!reduceMotion) raf = requestAnimationFrame(draw);
  }

  resize();

  if (reduceMotion) {
    // Freeze on a still, composed frame (use a pleasant non-zero time).
    requestAnimationFrame(function () {
      startT = performance.now() - 6200; // jump to a nicely-evolved moment
      draw(performance.now());
    });
  } else {
    raf = requestAnimationFrame(draw);
  }

  // --------------------------------------------------------------------------
  // Public handle
  // --------------------------------------------------------------------------
  return {
    /** Update settings live (e.g. presets). */
    set: function (next) {
      next = next || {};
      if (typeof next.ripple === 'number') settings.ripple = next.ripple;
      if (typeof next.blur === 'number') settings.blur = next.blur;
      if (typeof next.aberration === 'number') settings.aberration = next.aberration;
      if (typeof next.radius === 'number') settings.radius = next.radius;
      if (typeof next.speed === 'number') settings.speed = next.speed;
      if (reduceMotion) { startT = performance.now() - 6200; draw(performance.now()); }
    },
    /** Tear everything down. */
    destroy: function () {
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('resize', resize);
      if (ro) ro.disconnect();
      try {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buf);
        var lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      } catch (e) { /* ignore */ }
      canvas.style.cursor = '';
    }
  };
}

// ----------------------------------------------------------------------------
// CSS fallback: a static, good-looking glass card on a Sand & Surf gradient.
// Used when WebGL is missing or the shader fails to compile.
// ----------------------------------------------------------------------------
function cssFallback(canvas, COL) {
  function rgb(a) {
    return 'rgb(' + Math.round(a[0] * 255) + ',' + Math.round(a[1] * 255) + ',' + Math.round(a[2] * 255) + ')';
  }
  var host = document.createElement('div');
  host.setAttribute('data-glass-fallback', '');
  var s = host.style;
  s.position = 'absolute';
  s.inset = '0';
  s.overflow = 'hidden';
  s.background =
    'radial-gradient(120% 90% at 25% 25%, ' + rgb(COL.sky) + '33 0%, transparent 55%),' +
    'radial-gradient(100% 120% at 80% 80%, ' + rgb(COL.teal) + '66 0%, transparent 60%),' +
    'linear-gradient(160deg, ' + rgb(COL.sand) + ' 0%, ' + rgb(COL.sand2) + ' 45%, ' + rgb(COL.sky) + ' 100%)';

  var card = document.createElement('div');
  var cs = card.style;
  cs.position = 'absolute';
  cs.left = '50%'; cs.top = '50%';
  cs.transform = 'translate(-50%,-50%)';
  cs.width = 'min(46%, 460px)';
  cs.height = 'min(62%, 320px)';
  cs.borderRadius = '36px';
  cs.background = 'linear-gradient(145deg, rgba(255,255,255,0.30), rgba(255,255,255,0.08))';
  cs.border = '1px solid rgba(255,255,255,0.45)';
  cs.boxShadow = '0 30px 60px -20px rgba(14,58,64,0.55), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -20px 40px -20px rgba(14,58,64,0.4)';
  if ('backdropFilter' in cs || 'webkitBackdropFilter' in cs) {
    cs.backdropFilter = 'blur(14px)';
    cs.webkitBackdropFilter = 'blur(14px)';
  }
  host.appendChild(card);

  var parent = canvas.parentNode;
  if (parent) {
    if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    canvas.style.display = 'none';
    parent.appendChild(host);
  }

  return {
    set: function () {},
    destroy: function () {
      if (host.parentNode) host.parentNode.removeChild(host);
      canvas.style.display = '';
    }
  };
}

// UMD-ish export so it works as a module or a plain <script>.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = initGlassRefraction;
}

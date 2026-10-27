/*!
 * Voronoi Cells — animated cellular / Worley-noise WebGL background
 * saltycodestudio-parts (original) — MIT
 *
 * A single fullscreen fragment shader paints a drifting Voronoi (Worley) field.
 * For every pixel we hash a 3x3 grid of feature points, animate their jitter with
 * time, and find the two nearest distances (F1, F2). F1 drives a teal/sand fill;
 * the distance-to-edge trick (an honest re-derivation of the "voronoi distance"
 * idea) gives crisp-but-soft seams between cells, like sea glass or cracked
 * ceramic. A faint surf-coral glow lights a few hashed cells, and the pointer can
 * gently lift nearby cells.
 *
 * Public API:
 *   const inst = initVoronoiCells(canvas, opts);
 *   inst.destroy();
 *
 * opts (all optional):
 *   density   {number}  cells across the short axis           (default 6)
 *   speed     {number}  motion multiplier                     (default 1)
 *   edgeWidth {number}  seam thickness in cell-space          (default 0.06)
 *   colors    {object}  { sand, teal, sky, coral, ink }       (hex strings)
 *   glow      {number}  coral glow strength 0..1              (default 0.5)
 *   mouse     {boolean} enable pointer lift                   (default true)
 */
(function (global) {
  'use strict';

  // ---- Sand & Surf defaults (coastal, not neon) --------------------------
  var DEFAULTS = {
    density: 6,
    speed: 1,
    edgeWidth: 0.06,
    glow: 0.5,
    mouse: true,
    colors: {
      sand: '#F2EBDD',
      teal: '#0E3A40',
      sky: '#4FA8C9',
      coral: '#FF6F59',
      ink: '#1C2B2E'
    }
  };

  // ---- hex -> [r,g,b] in 0..1 -------------------------------------------
  function hexToRgb(hex) {
    var h = String(hex).replace('#', '').trim();
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    var n = parseInt(h, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  // ---- Shaders -----------------------------------------------------------
  var VERT = [
    'attribute vec2 a_pos;',
    'void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }'
  ].join('\n');

  var FRAG = [
    'precision highp float;',
    '',
    'uniform vec2  u_resolution;',
    'uniform float u_time;',
    'uniform vec2  u_mouse;',     // pixels, y already flipped to gl space; (-1,-1) when absent
    'uniform float u_density;',
    'uniform float u_edge;',
    'uniform float u_glow;',
    'uniform float u_mouseOn;',
    'uniform vec3  u_sand;',
    'uniform vec3  u_teal;',
    'uniform vec3  u_sky;',
    'uniform vec3  u_coral;',
    'uniform vec3  u_ink;',
    '',
    '// --- hashes (original constants) ---',
    'vec2 hash2(vec2 p){',
    '  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));',
    '  return fract(sin(p) * 43758.5453123);',
    '}',
    'float hash1(vec2 p){',
    '  return fract(sin(dot(p, vec2(41.3, 289.1))) * 24634.6345);',
    '}',
    '',
    '// Voronoi pass 1: nearest cell. Returns F1 distance + the offset vector to',
    '// the nearest feature point + the integer id of that cell.',
    'void voronoiF1(in vec2 uv, in float t, out float f1, out vec2 toNear, out vec2 nearId){',
    '  vec2 g = floor(uv);',
    '  vec2 f = fract(uv);',
    '  f1 = 8.0;',
    '  toNear = vec2(0.0);',
    '  nearId = vec2(0.0);',
    '  for(int j = -1; j <= 1; j++){',
    '    for(int i = -1; i <= 1; i++){',
    '      vec2 o  = vec2(float(i), float(j));',
    '      vec2 id = g + o;',
    '      vec2 jitter = hash2(id);',
    '      // drift the feature point on a slow circular path',
    '      vec2 fp = o + 0.5 + 0.42 * sin(t + 6.2831 * jitter);',
    '      vec2 r  = fp - f;',
    '      float d = dot(r, r);',
    '      if(d < f1){ f1 = d; toNear = r; nearId = id; }',
    '    }',
    '  }',
    '  f1 = sqrt(f1);',
    '}',
    '',
    '// Voronoi pass 2: distance to the nearest CELL EDGE (the iq-style border',
    '// trick, re-derived). We re-scan the neighbourhood and, for every point that',
    '// is not the nearest one, project onto the perpendicular bisector between it',
    '// and the nearest point. The smallest such projection is the edge distance.',
    'float voronoiEdge(in vec2 uv, in float t, in vec2 toNear){',
    '  vec2 g = floor(uv);',
    '  vec2 f = fract(uv);',
    '  float md = 8.0;',
    '  for(int j = -2; j <= 2; j++){',
    '    for(int i = -2; i <= 2; i++){',
    '      vec2 o  = vec2(float(i), float(j));',
    '      vec2 id = g + o;',
    '      vec2 jitter = hash2(id);',
    '      vec2 fp = o + 0.5 + 0.42 * sin(t + 6.2831 * jitter);',
    '      vec2 r  = fp - f;',
    '      vec2 diff = r - toNear;',
    '      // skip the nearest point itself',
    '      if(dot(diff, diff) > 0.00001){',
    '        float d = dot(0.5 * (toNear + r), normalize(r - toNear));',
    '        md = min(md, d);',
    '      }',
    '    }',
    '  }',
    '  return md;',
    '}',
    '',
    'void main(){',
    '  vec2 frag = gl_FragCoord.xy;',
    '  vec2 res  = u_resolution;',
    '  // aspect-correct uv, scaled so density = cells across the short axis',
    '  float minside = min(res.x, res.y);',
    '  vec2 uv = (frag - 0.5 * res) / minside;',
    '  uv *= u_density;',
    '',
    '  float t = u_time;',
    '',
    '  float f1; vec2 toNear; vec2 nearId;',
    '  voronoiF1(uv, t, f1, toNear, nearId);',
    '  float edge = voronoiEdge(uv, t, toNear);',
    '',
    '  // --- cell fill: teal -> sand gradient driven by F1 + a per-cell tint ---',
    '  float cellRnd = hash1(nearId);',
    '  // smooth large-scale wash so the field reads as a coastline, not noise',
    '  float wash = 0.5 + 0.5 * sin(uv.x * 0.25 + uv.y * 0.2 + t * 0.3);',
    '  float fill = clamp(f1 * 0.9, 0.0, 1.0);',
    '  vec3 base = mix(u_teal, u_sand, fill);',
    '  // nudge some cells toward sky-blue for depth (teal+sand still ~90%)',
    '  base = mix(base, u_sky, smoothstep(0.6, 1.0, cellRnd) * 0.35 * wash);',
    '  // deepen toward ink in the cell centres for a glassy core',
    '  base = mix(u_ink, base, smoothstep(0.0, 0.5, f1) * 0.85 + 0.15);',
    '',
    '  // --- seams: soft thin borders via distance-to-edge ---',
    '  float seam = smoothstep(0.0, u_edge, edge);',
    '  // darken the seam slightly; sand cells get a lighter hairline',
    '  vec3 seamCol = mix(u_ink, u_sand, 0.25);',
    '  vec3 col = mix(seamCol, base, seam);',
    '  // a faint bright highlight just inside each seam (sea-glass bevel)',
    '  float bevel = smoothstep(u_edge, u_edge * 2.2, edge) * (1.0 - smoothstep(u_edge * 2.2, u_edge * 4.0, edge));',
    '  col += bevel * 0.06;',
    '',
    '  // --- coral glow on a few hashed cells (single accent, used sparingly) ---',
    '  float coralPick = step(0.86, cellRnd);',
    '  float pulse = 0.5 + 0.5 * sin(t * 0.8 + cellRnd * 24.0);',
    '  float glowAmt = coralPick * u_glow * pulse * smoothstep(0.0, 0.55, f1);',
    '  col = mix(col, u_coral, glowAmt * 0.45);',
    '',
    '  // --- pointer lift: brighten + warm cells near the cursor ---',
    '  if(u_mouseOn > 0.5){',
    '    float md2 = distance(frag, u_mouse) / minside;',
    '    float lift = smoothstep(0.45, 0.0, md2);',
    '    col += lift * 0.12;',
    '    col = mix(col, mix(col, u_sand, 0.4), lift * 0.5);',
    '  }',
    '',
    '  // gentle vignette to seat the field',
    '  vec2 vp = (frag / res - 0.5);',
    '  float vig = 1.0 - dot(vp, vp) * 0.5;',
    '  col *= vig;',
    '',
    '  col = clamp(col, 0.0, 1.0);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  // ---- WebGL helpers -----------------------------------------------------
  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error('Voronoi Cells shader compile error:\n' + log);
    }
    return sh;
  }

  function makeProgram(gl) {
    var prog = gl.createProgram();
    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      var log = gl.getProgramInfoLog(prog);
      gl.deleteProgram(prog);
      throw new Error('Voronoi Cells link error:\n' + log);
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return prog;
  }

  // ---- CSS gradient fallback (WebGL missing or shader fails) --------------
  function applyFallback(canvas, c) {
    var el = canvas;
    el.style.background =
      'radial-gradient(120% 120% at 30% 20%, ' + c.sand + ' 0%, ' + c.sky + ' 38%, ' +
      c.teal + ' 78%, ' + c.ink + ' 100%)';
  }

  // ---- Public init -------------------------------------------------------
  function initVoronoiCells(canvas, opts) {
    if (!canvas) throw new Error('initVoronoiCells: canvas element required');
    opts = opts || {};

    var cfg = {
      density: opts.density != null ? opts.density : DEFAULTS.density,
      speed: opts.speed != null ? opts.speed : DEFAULTS.speed,
      edgeWidth: opts.edgeWidth != null ? opts.edgeWidth : DEFAULTS.edgeWidth,
      glow: opts.glow != null ? opts.glow : DEFAULTS.glow,
      mouse: opts.mouse != null ? opts.mouse : DEFAULTS.mouse,
      colors: {}
    };
    var col = opts.colors || {};
    cfg.colors = {
      sand: col.sand || DEFAULTS.colors.sand,
      teal: col.teal || DEFAULTS.colors.teal,
      sky: col.sky || DEFAULTS.colors.sky,
      coral: col.coral || DEFAULTS.colors.coral,
      ink: col.ink || DEFAULTS.colors.ink
    };

    var gl = null;
    try {
      gl =
        canvas.getContext('webgl', { antialias: true, alpha: false }) ||
        canvas.getContext('experimental-webgl', { antialias: true, alpha: false });
    } catch (e) {
      gl = null;
    }

    // No WebGL -> static CSS gradient, still a clean API object.
    if (!gl) {
      applyFallback(canvas, cfg.colors);
      return { destroy: function () { canvas.style.background = ''; } };
    }

    var prog;
    try {
      prog = makeProgram(gl);
    } catch (err) {
      if (global.console && console.warn) console.warn(err.message);
      applyFallback(canvas, cfg.colors);
      return { destroy: function () { canvas.style.background = ''; } };
    }

    gl.useProgram(prog);

    // Fullscreen triangle (covers the clip space with one tri, no index buffer).
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    var aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    var U = {
      res: gl.getUniformLocation(prog, 'u_resolution'),
      time: gl.getUniformLocation(prog, 'u_time'),
      mouse: gl.getUniformLocation(prog, 'u_mouse'),
      density: gl.getUniformLocation(prog, 'u_density'),
      edge: gl.getUniformLocation(prog, 'u_edge'),
      glow: gl.getUniformLocation(prog, 'u_glow'),
      mouseOn: gl.getUniformLocation(prog, 'u_mouseOn'),
      sand: gl.getUniformLocation(prog, 'u_sand'),
      teal: gl.getUniformLocation(prog, 'u_teal'),
      sky: gl.getUniformLocation(prog, 'u_sky'),
      coral: gl.getUniformLocation(prog, 'u_coral'),
      ink: gl.getUniformLocation(prog, 'u_ink')
    };

    // Static color uniforms
    gl.uniform3fv(U.sand, hexToRgb(cfg.colors.sand));
    gl.uniform3fv(U.teal, hexToRgb(cfg.colors.teal));
    gl.uniform3fv(U.sky, hexToRgb(cfg.colors.sky));
    gl.uniform3fv(U.coral, hexToRgb(cfg.colors.coral));
    gl.uniform3fv(U.ink, hexToRgb(cfg.colors.ink));
    gl.uniform1f(U.density, cfg.density);
    gl.uniform1f(U.edge, cfg.edgeWidth);
    gl.uniform1f(U.glow, cfg.glow);

    // ---- reduced motion: freeze on a pleasant still frame ----
    var reduceQuery =
      global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)');
    var reduced = !!(reduceQuery && reduceQuery.matches);

    // ---- mouse state ----
    var mouseX = -1, mouseY = -1, mouseOn = 0;

    function onPointerMove(e) {
      var rect = canvas.getBoundingClientRect();
      var px = (e.clientX - rect.left);
      var py = (e.clientY - rect.top);
      // store in device pixels, y flipped to gl space (origin bottom-left)
      mouseX = px * dpr;
      mouseY = (rect.height - py) * dpr;
      mouseOn = 1;
    }
    function onPointerLeave() { mouseOn = 0; }

    // ---- sizing (DPR + resize) ----
    var dpr = 1;
    function resize() {
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      var h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    var ro = null;
    if (global.ResizeObserver) {
      ro = new ResizeObserver(resize);
      ro.observe(canvas);
    } else {
      global.addEventListener('resize', resize);
    }

    if (cfg.mouse) {
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerleave', onPointerLeave);
    }

    // ---- render loop ----
    var raf = 0;
    var start = (global.performance && performance.now ? performance.now() : Date.now());

    function frame(now) {
      raf = global.requestAnimationFrame(frame);
      resize();
      var t = reduced ? 12.0 : ((now - start) / 1000) * 0.5 * cfg.speed;
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.time, t);
      gl.uniform2f(U.mouse, mouseX, mouseY);
      gl.uniform1f(U.mouseOn, cfg.mouse ? mouseOn : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (reduced) {
        // one frame is enough when motion is off
        global.cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    resize();
    raf = global.requestAnimationFrame(frame);

    // If reduced motion preference changes live, react.
    function onReduceChange(e) {
      reduced = e.matches;
      if (!reduced && !raf) raf = global.requestAnimationFrame(frame);
    }
    if (reduceQuery) {
      if (reduceQuery.addEventListener) reduceQuery.addEventListener('change', onReduceChange);
      else if (reduceQuery.addListener) reduceQuery.addListener(onReduceChange);
    }

    // ---- teardown ----
    function destroy() {
      if (raf) global.cancelAnimationFrame(raf);
      raf = 0;
      if (ro) ro.disconnect();
      else global.removeEventListener('resize', resize);
      if (cfg.mouse) {
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerleave', onPointerLeave);
      }
      if (reduceQuery) {
        if (reduceQuery.removeEventListener) reduceQuery.removeEventListener('change', onReduceChange);
        else if (reduceQuery.removeListener) reduceQuery.removeListener(onReduceChange);
      }
      var ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }

    return { destroy: destroy };
  }

  // ---- export (UMD-ish) --------------------------------------------------
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = initVoronoiCells;
  } else {
    global.initVoronoiCells = initVoronoiCells;
  }
})(typeof window !== 'undefined' ? window : this);

/*
 * Shader Gradient Flow — saltycodestudio-parts (original, MIT)
 * ----------------------------------------------------------------------------
 * A full-bleed raw-WebGL fragment-shader background of silky, slowly flowing
 * colour. The look is driven by DOMAIN-WARPED fractal Brownian motion (fBm):
 *
 *   1. We build value-noise inline in GLSL (no textures).
 *   2. We stack 5–6 octaves of that noise into fBm.
 *   3. We then warp the input coordinates of the fBm by ANOTHER fBm field,
 *      twice over (warp the warp) — this is what makes the colour bands curl,
 *      fold and drift like ink or smoke, instead of looking like static blobs.
 *   4. The final scalar field is mapped through a Sand & Surf colour ramp
 *      (sand -> sky-blue -> deep-teal, with a faint surf-coral wisp at the
 *      very high end).
 *   5. A touch of animated film grain keeps it from banding.
 *
 * This is deliberately NOT a "mesh gradient of colour spots" — it is a
 * continuous, organic flow field.
 *
 * Public API:
 *   const handle = initGradientFlow(canvasEl, opts);
 *   handle.destroy();
 *
 * opts (all optional):
 *   colors        Array of 4 hex strings [sand, sky, teal, coral].
 *   speed         Drift speed multiplier. Default 1.
 *   warp          Domain-warp strength. Default 1.
 *   grain         Film-grain amount 0..1. Default 0.06.
 *   scale         Noise scale (zoom). Larger = more, tighter bands. Default 1.
 *   mouseParallax Whether the pointer gently pushes the warp. Default true.
 *
 * Degrades gracefully: if WebGL is unavailable it paints a static CSS
 * gradient onto the canvas's parent and bails out cleanly. Honours
 * prefers-reduced-motion by freezing on a nice, well-composed frame.
 */

(function (global) {
  'use strict';

  /* --- Sand & Surf defaults (coastal, not neon) ------------------------- */
  var DEFAULT_COLORS = ['#F2EBDD', '#4FA8C9', '#0E3A40', '#FF6F59'];

  /* Convert "#RRGGBB" -> [r,g,b] in 0..1 floats. */
  function hexToRgb(hex) {
    var h = hex.replace('#', '').trim();
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    var int = parseInt(h, 16);
    return [
      ((int >> 16) & 255) / 255,
      ((int >> 8) & 255) / 255,
      (int & 255) / 255
    ];
  }

  /* ---------------------------------------------------------------------- */
  /* Shaders                                                                */
  /* ---------------------------------------------------------------------- */

  // A single fullscreen triangle (covers the viewport with one draw call,
  // no index buffer, no quad seams). Clip-space positions only.
  var VERT_SRC = [
    'attribute vec2 a_pos;',
    'void main() {',
    '  gl_Position = vec4(a_pos, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG_SRC = [
    'precision highp float;',
    '',
    'uniform vec2  u_resolution;',
    'uniform float u_time;',
    'uniform vec2  u_mouse;      // -0.5..0.5 across the canvas',
    'uniform float u_warp;       // domain-warp strength',
    'uniform float u_scale;      // noise zoom',
    'uniform float u_grain;      // film-grain amount',
    'uniform vec3  u_sand;',
    'uniform vec3  u_sky;',
    'uniform vec3  u_teal;',
    'uniform vec3  u_coral;',
    '',
    '// --- hash + value noise (no textures) ----------------------------',
    'float hash(vec2 p) {',
    '  p = fract(p * vec2(123.34, 456.21));',
    '  p += dot(p, p + 45.32);',
    '  return fract(p.x * p.y);',
    '}',
    '',
    'float valueNoise(vec2 p) {',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  // smootherstep for silky interpolation',
    '  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);',
    '  float a = hash(i);',
    '  float b = hash(i + vec2(1.0, 0.0));',
    '  float c = hash(i + vec2(0.0, 1.0));',
    '  float d = hash(i + vec2(1.0, 1.0));',
    '  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);',
    '}',
    '',
    '// --- fractal Brownian motion (5 octaves) -------------------------',
    'float fbm(vec2 p) {',
    '  float total = 0.0;',
    '  float amp   = 0.5;',
    '  float freq  = 1.0;',
    '  // slight rotation per octave kills axis-aligned artefacts',
    '  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);',
    '  for (int i = 0; i < 5; i++) {',
    '    total += amp * valueNoise(p * freq);',
    '    p = rot * p;',
    '    freq *= 2.0;',
    '    amp  *= 0.5;',
    '  }',
    '  return total;',
    '}',
    '',
    '// Sand & Surf gradient ramp. t in 0..1.',
    '// sand -> sky-blue -> deep-teal, with a faint coral wisp at the top end.',
    'vec3 ramp(float t) {',
    '  t = clamp(t, 0.0, 1.0);',
    '  vec3 col;',
    '  if (t < 0.5) {',
    '    col = mix(u_sand, u_sky, smoothstep(0.0, 1.0, t / 0.5));',
    '  } else {',
    '    col = mix(u_sky, u_teal, smoothstep(0.0, 1.0, (t - 0.5) / 0.5));',
    '  }',
    '  // coral only as a thin wisp near the high end, never a full field',
    '  float wisp = smoothstep(0.82, 0.97, t) * (1.0 - smoothstep(0.97, 1.0, t));',
    '  col = mix(col, u_coral, wisp * 0.35);',
    '  return col;',
    '}',
    '',
    'void main() {',
    '  // aspect-correct, centred coordinates',
    '  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;',
    '  uv *= 1.6 * u_scale;',
    '',
    '  float t = u_time;',
    '  // pointer gently pushes the field',
    '  vec2 m = u_mouse * 0.6;',
    '',
    '  // --- domain warp, twice over (warp the warp) -------------------',
    '  // first warp field',
    '  vec2 q = vec2(',
    '    fbm(uv + vec2(0.0, 0.0) + t * 0.06),',
    '    fbm(uv + vec2(5.2, 1.3) - t * 0.05)',
    '  );',
    '',
    '  // second warp field, driven by the first + mouse',
    '  vec2 r = vec2(',
    '    fbm(uv + u_warp * q + vec2(1.7, 9.2) + m + t * 0.08),',
    '    fbm(uv + u_warp * q + vec2(8.3, 2.8) - m + t * 0.07)',
    '  );',
    '',
    '  // final field samples the noise at the doubly-warped coordinate',
    '  float f = fbm(uv + u_warp * r);',
    '',
    '  // shape the field for richer, foldier contrast',
    '  f = f * 0.65 + dot(r, vec2(0.35)) + 0.18;',
    '',
    '  vec3 color = ramp(f);',
    '',
    '  // soften toward sand at the screen edges for a premium vignette',
    '  float vig = smoothstep(1.25, 0.2, length(uv) / u_scale);',
    '  color = mix(mix(u_sand, color, 0.55), color, vig);',
    '',
    '  // --- film grain ------------------------------------------------',
    '  float g = hash(gl_FragCoord.xy + fract(t) * 100.0) - 0.5;',
    '  color += g * u_grain;',
    '',
    '  gl_FragColor = vec4(color, 1.0);',
    '}'
  ].join('\n');

  /* ---------------------------------------------------------------------- */
  /* WebGL helpers                                                          */
  /* ---------------------------------------------------------------------- */

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error('Shader compile error: ' + log);
    }
    return sh;
  }

  function link(gl, vs, fs) {
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      var log = gl.getProgramInfoLog(prog);
      gl.deleteProgram(prog);
      throw new Error('Program link error: ' + log);
    }
    return prog;
  }

  /* Paint a static CSS gradient fallback when WebGL is missing. */
  function cssFallback(canvas, colors) {
    var sand = colors[0], sky = colors[1], teal = colors[2];
    canvas.style.background =
      'radial-gradient(120% 120% at 20% 10%, ' + sand + ' 0%, ' +
      sky + ' 45%, ' + teal + ' 100%)';
    return { destroy: function () { canvas.style.background = ''; } };
  }

  /* ---------------------------------------------------------------------- */
  /* Public init                                                            */
  /* ---------------------------------------------------------------------- */

  function initGradientFlow(canvas, opts) {
    opts = opts || {};

    var colors = (opts.colors && opts.colors.length >= 3)
      ? opts.colors : DEFAULT_COLORS;
    // ensure 4 colours (coral optional but ramp wants it)
    while (colors.length < 4) colors.push(DEFAULT_COLORS[colors.length]);

    // live, mutable settings (presets tweak these in place)
    var settings = {
      speed: opts.speed != null ? opts.speed : 1,
      warp: opts.warp != null ? opts.warp : 1,
      grain: opts.grain != null ? opts.grain : 0.06,
      scale: opts.scale != null ? opts.scale : 1,
      mouseParallax: opts.mouseParallax !== false
    };

    var reduceMotion = global.matchMedia &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- get a context, else fall back --------------------------------- */
    var gl = null;
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: false }) ||
           canvas.getContext('experimental-webgl', { antialias: false, alpha: false });
    } catch (e) { gl = null; }

    if (!gl) {
      return cssFallback(canvas, colors);
    }

    var program, vbo, vs, fs;
    try {
      vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
      fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
      program = link(gl, vs, fs);
    } catch (err) {
      // shader failed for some reason — degrade rather than throw
      if (global.console) global.console.warn('[gradient-flow] ' + err.message);
      return cssFallback(canvas, colors);
    }

    gl.useProgram(program);

    // fullscreen triangle (covers clip space [-1,3] so it overshoots safely)
    var verts = new Float32Array([-1, -1, 3, -1, -1, 3]);
    vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // uniform locations
    var U = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
      warp: gl.getUniformLocation(program, 'u_warp'),
      scale: gl.getUniformLocation(program, 'u_scale'),
      grain: gl.getUniformLocation(program, 'u_grain'),
      sand: gl.getUniformLocation(program, 'u_sand'),
      sky: gl.getUniformLocation(program, 'u_sky'),
      teal: gl.getUniformLocation(program, 'u_teal'),
      coral: gl.getUniformLocation(program, 'u_coral')
    };

    var sand = hexToRgb(colors[0]);
    var sky = hexToRgb(colors[1]);
    var teal = hexToRgb(colors[2]);
    var coral = hexToRgb(colors[3]);
    gl.uniform3fv(U.sand, sand);
    gl.uniform3fv(U.sky, sky);
    gl.uniform3fv(U.teal, teal);
    gl.uniform3fv(U.coral, coral);

    /* --- sizing (DPR-aware) -------------------------------------------- */
    function resize() {
      var dpr = Math.min(global.devicePixelRatio || 1, 2);
      var w = canvas.clientWidth || canvas.offsetWidth || 300;
      var h = canvas.clientHeight || canvas.offsetHeight || 150;
      var pw = Math.max(1, Math.round(w * dpr));
      var ph = Math.max(1, Math.round(h * dpr));
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();

    /* --- pointer parallax ---------------------------------------------- */
    var mouseTarget = [0, 0];
    var mouse = [0, 0];
    function onPointer(e) {
      if (!settings.mouseParallax) return;
      var rect = canvas.getBoundingClientRect();
      var px = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      var py = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      mouseTarget[0] = px / rect.width - 0.5;
      mouseTarget[1] = 0.5 - py / rect.height;
    }

    var ro = null;
    if (global.ResizeObserver) {
      ro = new global.ResizeObserver(resize);
      ro.observe(canvas);
    } else {
      global.addEventListener('resize', resize);
    }
    global.addEventListener('pointermove', onPointer, { passive: true });
    global.addEventListener('touchmove', onPointer, { passive: true });

    /* --- render loop ---------------------------------------------------- */
    var raf = null;
    var start = (global.performance ? performance.now() : Date.now());
    var running = true;

    function frame(now) {
      if (!running) return;
      var elapsed = ((global.performance ? now : Date.now()) - start) / 1000;
      // reduced motion: park time at a hand-picked, well-composed moment
      var t = reduceMotion ? 8.0 : elapsed * settings.speed;

      // ease mouse toward target for buttery parallax
      mouse[0] += (mouseTarget[0] - mouse[0]) * 0.05;
      mouse[1] += (mouseTarget[1] - mouse[1]) * 0.05;

      gl.uniform2f(U.resolution, canvas.width, canvas.height);
      gl.uniform1f(U.time, t);
      gl.uniform2f(U.mouse, mouse[0], mouse[1]);
      gl.uniform1f(U.warp, settings.warp);
      gl.uniform1f(U.scale, settings.scale);
      gl.uniform1f(U.grain, settings.grain);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (reduceMotion) {
        running = false; // one good frame and stop
        return;
      }
      raf = global.requestAnimationFrame(frame);
    }
    raf = global.requestAnimationFrame(frame);

    /* --- handle --------------------------------------------------------- */
    return {
      /* Update live settings (used by preset buttons). */
      set: function (next) {
        next = next || {};
        for (var k in next) {
          if (settings.hasOwnProperty(k)) settings[k] = next[k];
        }
        // if we were frozen (reduced motion) we stay frozen by design
      },
      destroy: function () {
        running = false;
        if (raf) global.cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        else global.removeEventListener('resize', resize);
        global.removeEventListener('pointermove', onPointer);
        global.removeEventListener('touchmove', onPointer);
        try {
          gl.deleteBuffer(vbo);
          gl.deleteProgram(program);
          gl.deleteShader(vs);
          gl.deleteShader(fs);
          var ext = gl.getExtension('WEBGL_lose_context');
          if (ext) ext.loseContext();
        } catch (e) { /* nothing to do */ }
      }
    };
  }

  // expose
  global.initGradientFlow = initGradientFlow;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = initGradientFlow;
  }
})(typeof window !== 'undefined' ? window : this);

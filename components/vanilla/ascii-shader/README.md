# ASCII Shader

A flowing grayscale intensity field rendered live as **ASCII art** on a single 2D canvas, the awwwards/contentcore staple, built in the Sand & Surf palette. An offscreen low-resolution buffer holds one intensity value per character cell; each frame it is filled with layered value-noise (fbm) plus a soft pointer "bulge", then every cell is mapped to a glyph from a density ramp (`" .:-=+*#%@"`) and a colour along a teal→sky ramp. The hottest cells get a sparse surf-coral accent so the whole thing reads like a designed terminal, not noise. Pure canvas-2D, zero dependencies, ~60fps.

## Preview

Open `preview.html` directly in any modern browser (no build step). Move your cursor over the field to push it around, and toggle the **Sparse** / **Dense** presets at the bottom.

## Paste-in instructions

1. Copy `ascii-shader.js` into your project.
2. Add a sized canvas where you want the effect:

   ```html
   <canvas id="ascii" style="position:absolute; inset:0; width:100%; height:100%;"></canvas>
   ```

3. Initialise it and keep the handle so you can clean up:

   ```js
   import { initAsciiShader } from './ascii-shader.js';

   const handle = initAsciiShader(document.getElementById('ascii'), {
     cell: 14,
     speed: 1,
     mouseInfluence: 1,
   });

   // later, e.g. on route change / component unmount:
   handle.destroy();
   ```

   The file also attaches `initAsciiShader` to `window`, so a plain
   `<script src="./ascii-shader.js"></script>` (no module) works too.

The canvas must have a real CSS size (the part reads `getBoundingClientRect`). It recomputes the character grid on resize and adapts to device pixel ratio automatically.

## Props / options

All options are optional; sensible Sand & Surf defaults are used.

| Option           | Type     | Default                        | Description |
|------------------|----------|--------------------------------|-------------|
| `cell`           | number   | `12`                           | Character cell size in CSS px. Smaller = denser grid. |
| `ramp`           | string   | `" .:-=+*#%@"`                 | Glyphs ordered sparse → dense; the field intensity indexes into this. |
| `speed`          | number   | `1`                            | Flow speed multiplier for the noise drift. |
| `scale`          | number   | `1`                            | Noise feature scale. Smaller values = larger, calmer blobs. |
| `mouseInfluence` | number   | `1`                            | Strength of the pointer bulge (0 disables it; ~2 is strong). |
| `coralThreshold` | number   | `0.92`                         | Intensity (0–1) above which the coral accent appears. Higher = rarer. |
| `contrast`       | number   | `1`                            | Tightens/loosens the intensity→glyph mapping around the midtone. |
| `colors`         | object   | Sand & Surf                    | `{ sand, sand2, teal, sky, coral, ink }` hex overrides. |
| `fontFamily`     | string   | monospace stack                | Monospace font used to draw glyphs. |

Returns `{ destroy() }` — call `destroy()` to cancel the animation frame, disconnect the resize observer, and remove pointer listeners.

## Accessibility

Honours `prefers-reduced-motion: reduce`: when set, the effect paints **one** static, well-composed frame instead of animating, and no animation loop runs. The canvas is decorative (`aria-hidden="true"` in the demo) and sits behind real, readable content. If the 2D context is unavailable, it degrades to a static coastal CSS gradient rather than throwing.

## Source / inspiration

Original work — **MIT licensed**. `saltycodestudio-parts (original)`. No external code or libraries; the value-noise, fbm, colour ramp, and glyph mapping are all self-contained.

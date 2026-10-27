# Shader Gradient Flow

A full-bleed, raw-WebGL fragment-shader background of silky, slowly flowing
colour. Unlike a "mesh gradient of colour spots", this is a continuous flow
field: value noise stacked into fractal Brownian motion (fBm), then
**domain-warped twice over** (the noise coordinates are warped by another noise
field, and that warp is warped again) so the colour bands curl and fold like ink
or smoke drifting through warm sand and ocean teal. The scalar field is mapped
through a Sand & Surf ramp (sand → sky-blue → deep-teal, with a faint
surf-coral wisp at the high end), finished with subtle animated film grain and a
soft edge vignette. Noise is computed inline in GLSL, with no textures, no
dependencies.

## Preview

Open `preview.html` directly in a browser (no build step). Try the **Calm tide**
and **Riptide** preset buttons, and move your pointer to nudge the current.

## Paste-in instructions

1. Copy `shader-gradient-flow.js` into your project.
2. Add a canvas where you want the background:

   ```html
   <canvas id="flow" style="position:fixed; inset:0; width:100%; height:100%;"></canvas>
   <script src="./shader-gradient-flow.js"></script>
   <script>
     const handle = initGradientFlow(document.getElementById('flow'), {
       colors: ['#F2EBDD', '#4FA8C9', '#0E3A40', '#FF6F59'],
       speed: 0.5,
       warp: 1.0
     });
     // later, to swap feel live:  handle.set({ speed: 1.4, warp: 1.9 });
     // on teardown:               handle.destroy();
   </script>
   ```

The canvas sizes itself to its CSS box (device-pixel-ratio aware), so style its
width/height however you like.

## Props / options

`initGradientFlow(canvas, opts)` — all options are optional.

| Option          | Type       | Default                                      | Description                                                            |
| --------------- | ---------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| `colors`        | `string[]` | `['#F2EBDD','#4FA8C9','#0E3A40','#FF6F59']`   | Ramp stops: `[sand, sky-blue, deep-teal, coral]`. Coral is a sparse accent. |
| `speed`         | `number`   | `1`                                          | Drift speed multiplier.                                                |
| `warp`          | `number`   | `1`                                          | Domain-warp strength — higher curls and folds the bands more.          |
| `grain`         | `number`   | `0.06`                                       | Film-grain amount (0–1).                                               |
| `scale`         | `number`   | `1`                                          | Noise zoom — larger means more, tighter bands.                         |
| `mouseParallax` | `boolean`  | `true`                                       | Whether the pointer gently pushes the warp.                            |

**Returns** `{ set(partialOpts), destroy() }`.
`set()` updates `speed`, `warp`, `grain`, `scale`, `mouseParallax` live (used by
the preview's preset buttons). `destroy()` cancels the animation frame, removes
all listeners, and releases the GL context.

## Accessibility

- Honours `prefers-reduced-motion: reduce` by freezing on a single, well-composed
  still frame instead of animating.
- Purely decorative: it carries no information, so no ARIA is required. Keep real
  content above it with sufficient contrast (the preview uses a soft scrim for
  this).
- If WebGL is unavailable, it degrades silently to a static CSS gradient and
  never throws.

## Source / inspiration

Original work by saltycodestudio. MIT licensed. No external code or assets.

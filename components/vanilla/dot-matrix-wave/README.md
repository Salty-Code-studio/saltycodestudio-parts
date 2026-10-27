# Dot Matrix Wave

A canvas-2D grid of dots whose radius, brightness and subtle vertical lift are driven by a traveling wave field. Two to three sine waves at different angles are summed with a slow time term, so a smooth, undulating ripple crosses the grid. Dots near the pointer get pushed away and grow, then ease back, leaving a soft interactive dent in the surface. Colors interpolate along the Sand & Surf ramp (sand to sky-blue to deep-teal) based on each dot's wave amplitude, with a faint surf-coral kiss on the crests. No WebGL, no dependencies, and it stays buttery at 60fps for a few thousand dots by precomputing the grid and batching draws per color bucket.

## Preview

Open `preview.html` directly in any browser (no build step). Move your pointer across the field and try the **Ripple** and **Storm** presets.

## Paste-in instructions

1. Copy `dot-matrix-wave.js` into your project.
2. Add a full-bleed canvas:

   ```html
   <canvas id="wave" style="position:fixed;inset:0;width:100%;height:100%"></canvas>
   <script src="./dot-matrix-wave.js"></script>
   ```

3. Initialize it once:

   ```js
   const inst = initDotMatrixWave(document.getElementById('wave'), {
     gap: 26,
     amplitude: 0.9,
     speed: 0.8,
   });

   // later, when you tear the view down:
   inst.destroy();
   ```

The function handles devicePixelRatio, window resize (rebuilds the grid), pointer-leave reset and `prefers-reduced-motion` for you.

## Props / options

All options are optional and passed in the second argument.

| Option          | Type   | Default | Description |
| --------------- | ------ | ------- | ----------- |
| `gap`           | number | `26`    | Spacing between dots in CSS px. Smaller = denser grid (more dots). |
| `dotSize`       | number | `2.2`   | Base dot radius in CSS px. |
| `speed`         | number | `1`     | Wave time multiplier. Higher = faster ripple. |
| `amplitude`     | number | `1`     | Wave strength; drives dot size swell and vertical lift. |
| `repelRadius`   | number | `130`   | Pointer influence radius in CSS px. |
| `repelStrength` | number | `1`     | How hard dots are pushed away and grown near the pointer. |
| `colors`        | object | Sand & Surf | `{ sand, sky, teal, coral }` hex overrides for the color ramp. |

Returns `{ destroy() }` — call `destroy()` to cancel the animation frame and remove all listeners.

## Accessibility

Honors `prefers-reduced-motion: reduce`: when set, the effect renders a single static, good-looking frame and never starts an animation loop or responds to the pointer. The canvas is purely decorative; keep your real content in the DOM above it (as the preview does) so screen readers and keyboard users are unaffected.

## Source / inspiration

Original work. License: MIT. `"source": "saltycodestudio-parts (original)"`.

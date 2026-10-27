# Iridescent Foil

A raw-WebGL **thin-film iridescence** surface: the look of a holographic foil sticker or a sheen of oil-on-water that shifts hue as you move the pointer (or tilt a device). A single fullscreen fragment shader builds a smooth height/normal field from flowing noise, derives a view/light direction biased by the cursor, then drives a small originally-written cosine "spectral" palette through a thin-film interference phase. The rainbow is then **biased toward the Sand & Surf palette** (a deep-teal to sky-blue to warm-sand sweep, with surf-coral and violet glints only at grazing angles), so it reads coastal-premium rather than full neon. Soft specular streaks and a fine anisotropic brushed-metal grain sell it as a real, physical sheet of foil. No three.js, no libraries, no build step.

## Preview

Open [`preview.html`](./preview.html) directly in any modern browser. Move your cursor across the canvas and the hue band travels with it. Toggle between the **Pearl** (subtle, pearlescent) and **Oil slick** (vivid, high-chroma) presets at the bottom.

## Paste-in instructions

1. Copy `iridescent-foil.js` into your project.
2. Add a canvas and size it however you like (it fills its CSS box):

   ```html
   <canvas id="foil" style="position:fixed; inset:0; width:100%; height:100%;"></canvas>
   <script src="./iridescent-foil.js"></script>
   <script>
     const foil = initIridescentFoil(document.getElementById("foil"), {
       sheen: 1.15,
       speed: 0.8,
       mouseInfluence: 1.0
     });
     // foil.update({ hueShift: 0.4 });  // live-tune any option
     // foil.destroy();                  // clean up when you remove it
   </script>
   ```

3. Put your real content in a layer above the canvas (give it a higher `z-index`). If you want the pointer to reach the canvas through your overlay text, set `pointer-events: none` on the overlay (see `preview.html`).

The script also works as a module: `import { initIridescentFoil } from "./iridescent-foil.js"` (or `require`). It attaches `window.initIridescentFoil` for plain `<script>` use.

## Options

Pass these in the `opts` object. All are optional. Call `foil.update(partialOpts)` to change them live.

| Option | Type | Default | What it does |
| --- | --- | --- | --- |
| `hueShift` | number | `0.0` | Base phase offset for the iridescent palette (rotates the colour band). |
| `sheen` | number | `1.0` | Strength of the soft specular streaks (the foil highlight). `0` = matte. |
| `grain` | number | `1.0` | Amount of fine anisotropic brushed-metal grain. |
| `speed` | number | `1.0` | Animation speed multiplier for the flowing noise. |
| `mouseInfluence` | number | `1.0` | How strongly the pointer/tilt shifts the hue band and highlight. |
| `colors` | object | Sand & Surf | Palette anchors as CSS hex: `{ sand, teal, sky, coral, ink }`. |
| `respectReducedMotion` | string | `"freeze"` | `"freeze"` stops time but still lets the pointer shift hue; `"freeze-all"` disables pointer hue shift too. |

### Returned API

```js
const foil = initIridescentFoil(canvas, opts);
foil.update(partialOpts); // change tunables/colours live
foil.destroy();           // remove listeners, cancel RAF, free GL resources
```

## Accessibility

Honors `prefers-reduced-motion: reduce`: the time-based flow is **frozen on a hand-picked, good-looking frame**. By default the pointer can still shift the hue band, because reacting to a deliberate cursor move is intentional interaction rather than passively-received motion — this keeps the effect expressive without animating on its own. Set `respectReducedMotion: "freeze-all"` to also disable the pointer hue shift for a fully static result. The canvas is purely decorative (`aria-hidden`); keep your real content in the DOM above it. DPR is handled (capped at 2 for performance) and the canvas resizes with its container. If WebGL is unavailable, it degrades silently to a static CSS conic-gradient in the same palette and never throws.

## Source / inspiration

Original work for saltycodestudio-parts. The noise, normal reconstruction, thin-film phase function, and the cosine "spectral" palette are written from scratch. **MIT licensed.**

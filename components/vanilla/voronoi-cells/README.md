# Voronoi Cells

A raw-WebGL fragment-shader background that renders an animated cellular / Voronoi (Worley)
field. For every pixel the shader hashes a small grid of feature points, drifts those points
over time, and finds the nearest distance (F1) plus the distance to the nearest cell edge. F1
drives a calm teal-to-sand gradient inside each cell; the distance-to-edge gives crisp-but-soft
seams between cells, like sea glass, cracked ceramic, or an aerial coastline. A few hashed cells
catch a slow surf-coral glow, and the pointer can gently lift the cells nearby. It is one
fullscreen triangle, no libraries, and it holds 60fps.

## Preview

Open `preview.html` directly in a browser (no build step). It shows a full-bleed field behind a
"Sea glass." headline with two presets: **Tide pools** (large soft cells) and **Mosaic** (dense
crisp cells).

## Paste-in instructions

1. Copy `voronoi-cells.js` into your project.
2. Add a full-bleed canvas behind your content:

   ```html
   <canvas id="bg" style="position:fixed; inset:0; width:100%; height:100%;"></canvas>
   <script src="./voronoi-cells.js"></script>
   <script>
     const inst = initVoronoiCells(document.getElementById('bg'), {
       density: 6,
       speed: 1,
       edgeWidth: 0.06,
       glow: 0.5,
       mouse: true
     });
     // later: inst.destroy();
   </script>
   ```

   The canvas sizes itself to its CSS box (using `clientWidth`/`clientHeight`), so give it a real
   width and height in CSS. Keep your readable content in a higher `z-index` layer above it.

## Props / options

`initVoronoiCells(canvasEl, opts)` — all options are optional.

| Option      | Type      | Default     | Description |
|-------------|-----------|-------------|-------------|
| `density`   | number    | `6`         | Number of cells across the short axis. Lower = big soft tiles, higher = dense mosaic. |
| `speed`     | number    | `1`         | Motion multiplier for the drifting feature points. |
| `edgeWidth` | number    | `0.06`      | Seam thickness in cell-space. Larger = chunkier borders. |
| `glow`      | number    | `0.5`       | Strength (0–1) of the coral glow on the few accent cells. |
| `mouse`     | boolean   | `true`      | Enable the pointer lift (cells near the cursor brighten and warm). |
| `colors`    | object    | Sand & Surf | `{ sand, teal, sky, coral, ink }` hex strings to retheme the palette. |

Returns `{ destroy() }`. Call `destroy()` to cancel the animation frame, drop listeners, and
release the WebGL context.

## Accessibility

- Honors `prefers-reduced-motion: reduce` — it renders a single still, good-looking frame and
  stops animating (and reacts live if the preference changes).
- The canvas is decorative (`aria-hidden` in the demo); keep meaningful content in real DOM.
- If WebGL is unavailable or the shader fails to compile, it degrades gracefully to a static
  CSS gradient in the same palette instead of throwing.

## Source / inspiration

Original work for **saltycodestudio-parts**. The cell-edge seam uses the classic Voronoi
distance-to-border idea (perpendicular-bisector projection), re-derived from scratch here.
MIT licensed.

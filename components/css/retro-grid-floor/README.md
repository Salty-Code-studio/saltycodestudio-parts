# Retro Synthwave Grid Floor

An infinitely scrolling Tron / vaporwave floor grid that recedes to a glowing
horizon. The whole effect is **pure CSS** — two `repeating-linear-gradient`s
draw the rows and columns, a single `perspective() rotateX()` tips the plane
into 3D, a `mask-image` fade dissolves the far lines into the horizon, and a
gradient "sun" with scanline bands sets behind it. No canvas, no images, no
JavaScript.

## Dependencies

None. Plain CSS. Uses `mask-image` and `color-mix()` (supported in all current
evergreen browsers); the grid degrades gracefully where `mask` is unavailable.

## Files

- `styles.css` — the canonical, copy-paste stylesheet.
- `index.html` — the small markup snippet (4 nested divs).
- `preview.html` — standalone Sand & Surf demo (open in a browser).

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a `<style>`).
2. Add the markup wherever you want the floor. Give the `.rgf` element a height:

   ```html
   <div class="rgf" style="height: 70vh;">
     <div class="rgf__sky"></div>
     <div class="rgf__sun"></div>
     <div class="rgf__plane">
       <div class="rgf__grid"></div>
     </div>
   </div>
   ```

3. (Optional) Layer foreground content above the floor with `z-index: 4`:

   ```html
   <div class="rgf__content" style="position:relative; z-index:4;">
     <h1>OUTRUN</h1>
   </div>
   ```

## Customizing

Everything is driven by CSS custom properties set on `.rgf` (or any ancestor):

| Property            | Default              | What it does                          |
| ------------------- | -------------------- | ------------------------------------- |
| `--rgf-line`        | `#2ec3c3` (surf)     | Grid line color                       |
| `--rgf-glow`        | `#1f8a8a` (teal)     | Glow wash + horizon glow              |
| `--rgf-floor`       | transparent          | Base floor tint                       |
| `--rgf-cell`        | `44px`               | Grid cell size                        |
| `--rgf-speed`       | `1.6s`               | Scroll loop duration (lower = faster) |
| `--rgf-tilt`        | `58deg`              | Plane tilt toward viewer              |
| `--rgf-perspective` | `14em`               | Perspective depth (lower = steeper)   |

Example — a slow deep-teal floor:

```css
.my-hero .rgf {
  --rgf-line: #0f5c5c;
  --rgf-glow: #2ec3c3;
  --rgf-speed: 2.2s;
  --rgf-cell: 52px;
}
```

## Accessibility

Respects `prefers-reduced-motion: reduce` — the scrolling animation is frozen
for users who request reduced motion, while the grid itself stays visible.

## Source / inspiration

Inspired by the pure-CSS synthwave technique catalogued at
[FreeFrontend — Pure CSS Synthwave 80s Animation](https://freefrontend.com/code/pure-css-synthwave-80s-animation-2026-01-20/).
Reimplemented cleanly from scratch in original code. The underlying approach
(a perspective-tilted plane painted with repeating gradients and scrolled via
`background-position`) is a public-domain CSS idiom. **License: MIT — reimplemented.**

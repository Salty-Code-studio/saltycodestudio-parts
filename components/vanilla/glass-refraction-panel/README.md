# Glass Refraction Panel

A genuinely refractive frosted-glass card rendered in **raw WebGL** (no three.js, no
libraries), not a CSS `backdrop-filter`. A slow Sand & Surf gradient and noise field
is computed procedurally in a single fullscreen fragment shader. Over a rounded-rectangle
"glass panel" the shader warps the sampled background using a procedural ripple/bump
(normal) function, so it really looks like you are peering through textured glass. It
adds chromatic aberration (R/G/B sampled at slightly offset UVs, stronger at the rim),
a soft multi-tap frost blur, a bright specular edge highlight, a faint inner shadow, and
an outer drop shadow. The panel is **draggable**: move the pointer and the glass slides
across the background while the refraction updates live.

## Preview

Open `preview.html` directly in any modern browser (no build step). Drag the glass card
around and toggle the **Frosted** / **Crystal** presets.

## Paste-in instructions

1. Copy `glass-refraction-panel.js` into your project.
2. Add a full-bleed canvas (give its parent `position: relative` and a real height):

```html
<div style="position:relative; width:100%; height:100vh;">
  <canvas id="glass" style="position:absolute; inset:0; width:100%; height:100%;"></canvas>
</div>

<script src="./glass-refraction-panel.js"></script>
<script>
  const handle = initGlassRefraction(document.getElementById('glass'), {
    blur: 1.0,
    aberration: 1.0,
    ripple: 1.0,
    radius: 36,
    speed: 1.0
  });

  // later, to update live (e.g. a preset) or clean up:
  // handle.set({ blur: 1.6, aberration: 0.45 });
  // handle.destroy();
</script>
```

The canvas sizes itself to its CSS box (device-pixel-ratio aware) and re-renders on resize.

## Props / options

`initGlassRefraction(canvas, opts)` — all `opts` are optional.

| Option       | Type     | Default | Description                                                                 |
|--------------|----------|---------|-----------------------------------------------------------------------------|
| `ripple`     | number   | `1.0`   | Strength of the glass surface distortion (≈ 0–2). Higher = more warped.     |
| `blur`       | number   | `1.0`   | Frost / multi-tap blur amount (≈ 0–2). Higher = milkier.                     |
| `aberration` | number   | `1.0`   | Chromatic aberration strength (≈ 0–2). Higher = more prismatic edges.        |
| `radius`     | number   | `36`    | Corner radius of the panel, in CSS pixels.                                   |
| `speed`      | number   | `1.0`   | Background animation speed multiplier.                                       |
| `colors`     | object   | Sand & Surf | Palette overrides as `{ sand, sand2, teal, sky, coral, ink }`, each `[r,g,b]` in `0..1`. |

Returns `{ set(next), destroy() }`:

- **`set(next)`** — live-update any of `ripple`, `blur`, `aberration`, `radius`, `speed`
  (used by the preview presets).
- **`destroy()`** — cancels the animation frame, removes all listeners, and releases the
  WebGL context.

The panel follows the pointer: grab it and it stays under your cursor; click elsewhere on
the canvas and it jumps under the pointer. Touch is supported.

## Accessibility

Honors `prefers-reduced-motion: reduce` by freezing on a still, fully-composed frame
(no animation loop). Dragging still works. The canvas carries an `aria-label`; all overlay
copy in the demo lives in real text, not the canvas. There is no flashing or rapid motion.

## Fallback

If WebGL is unavailable, or the shaders fail to compile, the effect degrades gracefully to
a static CSS glass card on a Sand & Surf gradient (using `backdrop-filter` where supported).
It never throws.

## Palette

Sand & Surf: warm-sand `#F2EBDD`, sand-2 `#EAE1CF`, deep-teal `#0E3A40`, sky-blue `#4FA8C9`,
surf-coral `#FF6F59` (single accent), driftwood-ink `#1C2B2E`. Teal and sand carry the field;
coral appears only as one faint warm glow.

## Source / inspiration

Original, written from scratch for saltycodestudio-parts. **MIT** licensed.

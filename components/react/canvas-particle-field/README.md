# Canvas Particle Field

Lightweight canvas particles that drift and gently react to the cursor, adding depth and motion behind hero content. A single `<canvas>` driven by one `requestAnimationFrame` loop — each particle stores its own position, velocity, and magnetism, and eases toward the mouse based on a staticity/ease factor. No external particle engine; just hand-rolled vanilla canvas wrapped in a React component.

## Dependencies

None. React 18+ only (the component is a client component — note the `"use client"` directive for Next.js App Router).

## Files

- `CanvasParticleField.tsx` — the canonical, typed component to copy in.

## Paste-in instructions

1. Copy `CanvasParticleField.tsx` into your project (e.g. `components/CanvasParticleField.tsx`).
2. Render it as the **first child** of a `position: relative` section. It positions itself `absolute inset-0` and is `pointer-events-none`, so it sits behind your content without intercepting clicks.

```tsx
import CanvasParticleField from "@/components/CanvasParticleField";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <CanvasParticleField quantity={120} color="#1f8a8a" staticity={40} ease={50} />
      <div className="relative z-10">
        {/* your hero content */}
      </div>
    </section>
  );
}
```

Layer two instances with different `quantity`, `size`, and `color` for parallax depth (see `preview.html`).

## Props

| Prop        | Type     | Default     | Description                                                            |
| ----------- | -------- | ----------- | ---------------------------------------------------------------------- |
| `quantity`  | number   | `80`        | Number of particles.                                                   |
| `size`      | number   | `0.6`       | Base particle radius in px (randomized up to ~2px on top).             |
| `color`     | string   | `"#1f8a8a"` | Particle color (hex, `#rgb` or `#rrggbb`).                             |
| `vx`        | number   | `0`         | Constant horizontal drift per frame.                                   |
| `vy`        | number   | `0`         | Constant vertical drift per frame.                                     |
| `staticity` | number   | `50`        | How "stuck" particles are to origin — higher = less mouse reaction.    |
| `ease`      | number   | `50`        | Easing toward the mouse — lower = snappier follow.                     |
| `className` | string   | `""`        | Extra utility classes on the wrapping div.                             |

## Notes

- **Reduced motion:** when `prefers-reduced-motion: reduce` is set, the field renders a single static frame and the animation loop never starts.
- **Retina:** the canvas scales by `devicePixelRatio` (capped at 2) for crisp dots.
- **Cleanup:** all listeners (`resize`, `mousemove`) and the rAF loop are torn down on unmount.

## Source / inspiration

Inspired by the Particles component from [Magic UI](https://magicui.design/docs/components/particles) (MIT, `magicuidesign/magicui` on GitHub). Reimplemented cleanly here — MIT — reimplemented.

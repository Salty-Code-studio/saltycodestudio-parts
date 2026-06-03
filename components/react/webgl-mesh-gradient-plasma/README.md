# WebGL Mesh Gradient Plasma

A flowing **WebGL mesh-gradient** of color spots that swirl and distort like plasma — built for a high-end animated hero canvas. Each color spot travels its own trajectory and is warped by noise-based organic distortion plus a controllable swirl/vortex, finished with film grain. This is real-time GPU shader output running on a single `<canvas>`, **not** a static CSS mesh gradient.

It freezes on a single still (still-beautiful) frame automatically when the user has `prefers-reduced-motion: reduce` set.

## Preview

Open `preview.html` in any modern browser. It renders a full "Sand & Surf" hero plus two preset panels (calm tide / full vortex). No build step — React, ReactDOM, the shader library (via esm.sh import map), Babel and Tailwind all load from CDNs.

## Dependencies

```bash
npm i @paper-design/shaders-react
```

(React 18+ is a peer dependency, assumed to already be in your app.)

## Paste-in instructions

1. Copy `MeshGradientPlasma.tsx` into your project (e.g. `components/MeshGradientPlasma.tsx`).
2. Install the dependency above.
3. Wrap your hero content with the component:

```tsx
import { MeshGradientPlasma } from "@/components/MeshGradientPlasma";

export default function Hero() {
  return (
    <MeshGradientPlasma className="min-h-[640px] w-full">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep/30 to-ink/45" />
      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-6xl font-extrabold text-cream">Sand &amp; surf, in real time.</h1>
      </div>
    </MeshGradientPlasma>
  );
}
```

The component renders the shader as an absolutely-positioned canvas filling the wrapper, with `children` stacked on top (`z-10`). Give the wrapper a height (Tailwind `min-h-*` / `h-*`) so the canvas has something to fill, and add a dark gradient veil over the shader to keep overlaid copy legible.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `colors` | `string[]` | teal → surf → sand | Up to 10 color spots (hex/rgb/hsl); order affects trajectories. |
| `speed` | `number` | `0.6` | `0` freezes the animation. |
| `distortion` | `number` | `0.85` | Organic noise distortion power, 0–1. |
| `swirl` | `number` | `0.7` | Vortex power, 0–1. |
| `grainMixer` | `number` | `0.18` | Grain distortion at shape edges, 0–1. |
| `grainOverlay` | `number` | `0.32` | Post-process film grain, 0–1. |
| `scale` | `number` | `1` | Field zoom, 0.01–4. |
| `rotation` | `number` | `0` | Field rotation in degrees, 0–360. |
| `frame` | `number` | `9000` | Start frame; also the still frame used under reduced motion. |
| `className` / `style` | — | — | Applied to the wrapper. Set a height here. |
| `children` | `ReactNode` | — | Content layered above the canvas. |

## Accessibility

Honors `prefers-reduced-motion: reduce` by setting `speed={0}`, so the gradient holds on a static composed frame instead of animating.

## Source / inspiration

Built on the **MeshGradient** shader from Paper — https://shaders.paper.design/mesh-gradient (package `@paper-design/shaders-react`). License: **PolyForm Shield** — free for commercial and non-commercial use unless it competes with Paper. The wrapper, demo, presets and reduced-motion handling here were written cleanly with credit; the underlying GLSL shader is provided by the dependency.

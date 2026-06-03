# Animated Beam Connector

An animated gradient pulse that travels along a curved SVG path connecting two
referenced DOM nodes. Drop it into integration, pipeline, or architecture
diagrams to show data flowing between services and a central hub.

## How it works

- Measures the `from` / `to` element rects against a container ref and builds a
  quadratic-bezier path between their centres.
- Animates a `<linearGradient>`'s `x1/x2/y1/y2` (via `motion`) so a bright comet
  of colour sweeps the stroke.
- A `ResizeObserver` on the container plus a `window` resize listener recompute
  the path on any layout change, so the beams stay glued to their nodes.
- Honours `prefers-reduced-motion`: the pulse parks as a static gradient at the
  midpoint instead of animating.

## Dependencies

- `motion` (Framer Motion / `motion/react`)
- `tailwindcss` (styling in the demo; the component itself only needs the
  `motion` import)

## Paste-in instructions

1. Copy `AnimatedBeam.tsx` into your project (e.g. `components/AnimatedBeam.tsx`).
2. Ensure `motion` is installed: `npm i motion`.
3. Wire it up — the container must be `position: relative`, and each node and the
   container each need their own ref:

```tsx
import * as React from "react";
import { AnimatedBeam } from "./components/AnimatedBeam";

export function Diagram() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fromRef = React.useRef<HTMLDivElement>(null);
  const toRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative flex items-center justify-between p-12">
      <div ref={fromRef} className="z-10 h-12 w-12 rounded-full bg-white" />
      <div ref={toRef} className="z-10 h-12 w-12 rounded-full bg-white" />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={fromRef}
        toRef={toRef}
        curvature={-40}
        gradientStartColor="#2ec3c3"
        gradientStopColor="#0f5c5c"
      />
    </div>
  );
}
```

Render one `<AnimatedBeam />` per connection. Give each its own `fromRef` /
`toRef`. Keep node elements above the SVG with `z-10` (the SVG sits at the
container's top-left with `pointer-events: none`).

## Key props

| Prop | Default | Notes |
| --- | --- | --- |
| `containerRef` | — | Ref to the `relative` wrapper (required). |
| `fromRef` / `toRef` | — | Refs to the start / end nodes (required). |
| `curvature` | `0` | Bezier bow in px; positive bows up, negative down. |
| `reverse` | `false` | Reverse the direction the pulse travels. |
| `duration` | `4` | Seconds per pulse pass. |
| `delay` | `0` | Seconds before the first pulse (stagger multiple beams). |
| `gradientStartColor` / `gradientStopColor` | `#2ec3c3` / `#0f5c5c` | Pulse gradient colours. |
| `pathColor` / `pathOpacity` / `pathWidth` | `#ece0cd` / `1` / `2` | The static guide line under the pulse. |
| `gradientWidth` | `2` | Stroke width of the moving pulse. |
| `startXOffset` / `startYOffset` / `endXOffset` / `endYOffset` | `0` | Nudge the anchor points in px. |

## Preview

Open `preview.html` in any browser — it is fully self-contained (React 18 UMD,
framer-motion, Babel Standalone, and Tailwind via CDN) and renders a "Sand &
Surf" integration diagram wiring six services to a central core.

## Source / inspiration

Reimplemented cleanly from [Magic UI — Animated Beam](https://magicui.design/docs/components/animated-beam)
(MIT, github.com/magicuidesign/magicui). Rewritten in our own code with credit;
no proprietary source pasted verbatim.

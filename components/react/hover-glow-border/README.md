# Hover Glow Border

A Cursor-style border glow that orbits any card and concentrates toward the mouse
pointer. It tracks the pointer's angle relative to the element center, stores it
in a CSS custom property (`--hgb-angle`), and rotates a conic-gradient ring that
is masked to the border band with `mask-composite`. Because the ring is pure CSS
masking, it adapts to any container width, height or aspect ratio with zero
layout math.

`spread`, `proximity` and `inactiveZone` shape *when* and *how tightly* the glow
reacts, and a `movementDuration` tween eases the angle so the light feels like it
has weight rather than snapping.

## Dependencies

- `motion` (Motion for React — `import { animate } from "motion/react"`)
- `tailwindcss`

```bash
npm install motion
```

## Paste-in instructions

1. Copy `HoverGlowBorder.tsx` into your components folder (e.g.
   `components/HoverGlowBorder.tsx`).
2. Define the two glow color tokens once — globally in your CSS, or inline on the
   wrapper. The conic gradient reads `--hgb-surf` (the soft trailing color) and
   `--hgb-glow` (the bright hotspot):

   ```css
   /* globals.css — Sand & Surf defaults */
   :root {
     --hgb-surf: rgba(46, 195, 195, 0.35); /* surf teal, soft */
     --hgb-glow: #1f8a8a;                  /* ocean accent hotspot */
   }
   ```

3. Wrap any card. Give the **inner** element its own rounded background so the
   masked ring sits on the edge:

   ```tsx
   import { HoverGlowBorder } from "@/components/HoverGlowBorder";

   export function Card() {
     return (
       <HoverGlowBorder spread={40} proximity={80} movementDuration={2}>
         <div className="rounded-2xl bg-[#f4ece0] p-7 ring-1 ring-[#ece0cd]">
           <h3 className="text-xl font-semibold text-[#1c2b33]">Pointer-aware</h3>
           <p className="mt-2 text-sm text-[#4a5d66]">
             Move your cursor — the ring chases it.
           </p>
         </div>
       </HoverGlowBorder>
     );
   }
   ```

   The wrapper uses `rounded-[inherit]` internally, so the ring matches whatever
   radius you put on the inner element. Set the wrapper's radius (default
   `rounded-2xl` via your own class) to match.

## Props

| Prop               | Type        | Default | Description |
| ------------------ | ----------- | ------- | ----------- |
| `borderWidth`      | `number`    | `1`     | Ring thickness in px. |
| `spread`           | `number`    | `40`    | Conic sweep width of the hotspot in degrees. Lower = tighter/brighter. |
| `proximity`        | `number`    | `64`    | Px band outside the edge where the pointer drives the glow before it eases to idle. |
| `inactiveZone`     | `number`    | `0.01`  | 0..1 dead-center radius (fraction of element) where micro-movements are ignored. |
| `movementDuration` | `number`    | `2`     | Seconds the angle tween takes to ease toward the pointer. |
| `disabled`         | `boolean`   | `false` | Renders a static idle ring with no tracking. |
| `className`        | `string`    | `""`    | Extra classes on the ring wrapper. |
| `children`         | `ReactNode` | —       | Card content. |

## Accessibility

Honors `prefers-reduced-motion: reduce`: the glow angle is applied instantly
instead of tweening, and the opacity transitions are disabled.

## Source / inspiration

Inspired by the **Glowing Effect** from Aceternity UI —
<https://ui.aceternity.com/components/glowing-effect>.
License: MIT (Aceternity UI). Reimplemented cleanly from scratch with credit; no
proprietary code was copied verbatim.

# Border Beam

An animated beam of light that continuously travels around the border of any container. Drop it into a card, pricing tier, or feature panel and it frames the element with a premium, living glow. Stack two beams with offset `delay`s for a chasing effect, or set `reverse` on one so the lights pass each other.

## Preview

Open `preview.html` in any browser — it renders a three-tier "Sand & Surf" pricing row with single, chasing, and counter-rotating beams. No build step required.

## Dependencies

- **React 18+**
- **[motion](https://motion.dev)** (the `motion` package — formerly `framer-motion`) for the looping animation
- **Tailwind CSS** for the demo styling (the component itself only needs Tailwind for the optional sample card; the beam works with plain styles too)

```bash
npm install motion
```

## How it works

The beam is an absolutely-positioned strip driven along the container edge with the CSS `offset-path: rect(... round)` so it hugs rounded corners cleanly. A CSS mask (`content-box xor border-box`) carves out only the border ring, so the glow reads as a moving edge rather than a dot floating inside the card. A radial-gradient gives it a comet head with a fading tail. The motion runs on a `linear`, infinite `offsetDistance` keyframe — negative `delay` lets you phase-shift stacked beams.

It respects `prefers-reduced-motion`: when reduced motion is requested the beam parks at its `initialOffset` instead of looping.

## Paste-in instructions

1. Copy `BorderBeam.tsx` into your components folder (e.g. `components/BorderBeam.tsx`).
2. Make the **parent** container `relative overflow-hidden` with a `rounded-*` radius — the beam inherits the radius and clips to it.
3. Render one or more `<BorderBeam />` as the first children of that container:

```tsx
import { BorderBeam } from "@/components/BorderBeam";

export function PricingCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#ece0cd] bg-[#fbf7f0] p-8">
      <BorderBeam size={90} duration={7} colorFrom="#2ec3c3" colorTo="#0f5c5c" />
      <BorderBeam size={90} duration={7} delay={3.5} colorFrom="#1f8a8a" colorTo="#2ec3c3" />
      {/* ...card content... */}
    </div>
  );
}
```

## Props

| Prop            | Type     | Default     | Description                                                  |
| --------------- | -------- | ----------- | ------------------------------------------------------------ |
| `size`          | `number` | `60`        | Diameter of the travelling beam segment (px).                |
| `duration`      | `number` | `6`         | Seconds for one full lap.                                    |
| `delay`         | `number` | `0`         | Seconds to phase-shift the loop (great for chasing beams).   |
| `initialOffset` | `number` | `0`         | Start position along the perimeter (0–100%).                 |
| `reverse`       | `boolean`| `false`     | Travel counter-clockwise.                                    |
| `colorFrom`     | `string` | `#2ec3c3`   | Leading gradient colour.                                     |
| `colorTo`       | `string` | `#0f5c5c`   | Trailing gradient colour.                                    |
| `borderWidth`   | `number` | `1.5`       | Thickness of the glowing ring (px).                          |
| `className`     | `string` | `—`         | Extra classes on the moving beam element.                    |

The file also exports a ready-made `BorderBeamCard` sample using the Sand & Surf palette.

## Source / inspiration

Reimplemented cleanly, in our own code, from **Magic UI's Border Beam** — <https://magicui.design/docs/components/border-beam>. Magic UI is MIT-licensed (<https://github.com/magicuidesign/magicui>). This is an independent reimplementation with credit, not a verbatim copy.

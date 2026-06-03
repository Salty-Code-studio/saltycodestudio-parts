# Lamp Effect

A Linear-inspired overhead **lamp** that fans a cone of light down onto a section header. Two mirrored conic-gradient cones are masked with `linear-gradient` fades, a blurred glow ellipse plus a hairline filament bar form the "bulb", and Framer Motion `whileInView` animates the cone width and opacity so the beam expands as the section enters view. The headline rises into the light. Sand & Surf palette on a deep teal-ink base.

## Props

| Prop        | Type              | Default | Description |
| ----------- | ----------------- | ------- | ----------- |
| `title`     | `string`          | sample  | Headline rendered inside the beam. |
| `subtitle`  | `string`          | sample  | Supporting line under the headline (pass `""` to hide). |
| `eyebrow`   | `string`          | `"saltycodestudio"` | Small uppercase pill above the headline. |
| `glow`      | `string`          | `"#2ec3c3"` | Hex/CSS color for the cones, glow, and filament. |
| `className` | `string`          | `""`    | Extra classes on the outer `<section>`. |
| `children`  | `React.ReactNode` | —       | Optional content (e.g. CTAs) below the subtitle. |

## Dependencies

- `motion` (Framer Motion — import path `motion/react`, or `framer-motion`)
- `tailwindcss`

## Drop-in

Client component (uses motion + scroll-triggered animation). `"use client"` is already present for Next.js App Router.

```bash
npm install motion
```

```tsx
import LampEffect from "@/components/LampEffect";

export default function Page() {
  return (
    <LampEffect
      eyebrow="Pricing"
      title="Light, fast, and built to convert."
      subtitle="Every plan ships on the same blazing edge stack."
      glow="#1f8a8a"
    />
  );
}
```

> The component imports from `framer-motion`. If you use the newer `motion` package, change the import to `import { motion } from "motion/react";` — the API used here is identical.

### Notes

- The cone shape is pure CSS: a `conic-gradient` clipped by two `mask-image: linear-gradient` panels in the brand background color, so the light "fades into" the page with no image assets.
- Ensure Tailwind scans this file so the arbitrary-value classes (`[mask-image:...]`, `bg-[#0f1f24]`) are generated.
- **Reduced motion:** users with `prefers-reduced-motion: reduce` should see the lamp at full expansion with no animation. With Framer Motion, wrap your app in `<MotionConfig reducedMotion="user">` (from `framer-motion`) — the standalone `preview.html` already handles this with a CSS override.

## Source / inspiration

Reimplemented from the **Lamp Effect** by Aceternity UI — <https://ui.aceternity.com/components/lamp-effect>. Aceternity UI components are MIT-licensed; this is a clean, independent reimplementation with credit.

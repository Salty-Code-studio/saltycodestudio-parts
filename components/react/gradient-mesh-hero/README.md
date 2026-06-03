# Gradient Mesh Hero

A full-height hero with three animated, blurred gradient-mesh blobs (teal, amber, deep navy) drifting behind a bold headline, plus a subtle SVG grain overlay and two CTAs. Sand & Surf palette on a deep-navy base.

## Props

| Prop           | Type                            | Default | Description |
| -------------- | ------------------------------- | ------- | ----------- |
| `eyebrow`      | `string`                        | `"saltycodestudio"` | Small pill label. |
| `title`        | `string`                        | sample  | Headline. |
| `subtitle`     | `string`                        | sample  | Supporting paragraph. |
| `primaryCta`   | `{ label: string; href: string }` | sample | Filled CTA. |
| `secondaryCta` | `{ label: string; href: string }` | sample | Outline CTA. |
| `className`    | `string`                        | `""`    | Extra classes on `<section>`. |

## Dependencies

- `react`
- `tailwindcss`
- `framer-motion`

## Drop-in

Client component (uses `framer-motion`). `"use client"` is already present for Next.js App Router.

```bash
npm install framer-motion
```

```tsx
import GradientMeshHero from "@/components/GradientMeshHero";

export default function Home() {
  return <GradientMeshHero title="Your headline here." />;
}
```

The blobs animate on an infinite ease-in-out loop. The grain is an inline data-URI SVG, so there are no extra asset requests. Ensure Tailwind scans the file.

# Pricing Toggle

Three pricing cards with a monthly/annual switch. The selected billing period slides a pill in the toggle, the prices tween smoothly via `requestAnimationFrame`, and annual savings appear under each price. Sand & Surf palette with a featured plan.

## Props

| Prop        | Type     | Default | Description |
| ----------- | -------- | ------- | ----------- |
| `plans`     | `Plan[]` | 3 samples | Plans to render. |
| `currency`  | `string` | `"$"`   | Currency symbol. |
| `heading`   | `string` | sample  | Section heading. |
| `className` | `string` | `""`    | Extra classes on `<section>`. |

### `Plan`

| Field         | Type       | Description |
| ------------- | ---------- | ----------- |
| `name`        | `string`   | Plan name. |
| `monthly`     | `number`   | Monthly price. |
| `annual`      | `number`   | Per-month price when billed annually. |
| `description` | `string`   | Short tagline. |
| `features`    | `string[]` | Feature bullets. |
| `featured`    | `boolean?` | Marks the recommended plan. |
| `ctaLabel`    | `string?`  | Button text. |

## Dependencies

- `react`
- `tailwindcss`

## Drop-in

Client component (uses hooks + rAF animation). `"use client"` is already present.

```tsx
import PricingToggle from "@/components/PricingToggle";

export default function Pricing() {
  return <PricingToggle currency="€" />;
}
```

Annual savings are computed as `(monthly − annual) × 12`. Ensure Tailwind scans the file.

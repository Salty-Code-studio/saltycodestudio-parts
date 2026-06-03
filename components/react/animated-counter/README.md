# Animated Counter

A number that eases up to a target with an ease-out-expo curve **when it scrolls into view** (via `IntersectionObserver`). Supports prefix/suffix, decimals, and `en-US` thousands separators. Honors `prefers-reduced-motion` by jumping straight to the value. Animates once.

The file exports a named `AnimatedCounter` (single value) and a default `StatGrid` (a ready-made 4-up stat row).

## `AnimatedCounter` props

| Prop        | Type      | Default | Description |
| ----------- | --------- | ------- | ----------- |
| `value`     | `number`  | —       | Target value (required). |
| `duration`  | `number`  | `1800`  | Animation length in ms. |
| `decimals`  | `number`  | `0`     | Decimal places. |
| `prefix`    | `string`  | `""`    | Text before the number. |
| `suffix`    | `string`  | `""`    | Text after the number. |
| `separator` | `boolean` | `true`  | Thousands separators. |
| `className` | `string`  | `""`    | Classes on the `<span>`. |

## `StatGrid` props

| Prop    | Type     | Default   | Description |
| ------- | -------- | --------- | ----------- |
| `stats` | `Stat[]` | 4 samples | `{ value, label, prefix?, suffix?, decimals? }`. |

## Dependencies

- `react`
- `tailwindcss`

## Drop-in

Client component. `"use client"` is already present.

```tsx
import StatGrid, { AnimatedCounter } from "@/components/AnimatedCounter";

// Single value:
<AnimatedCounter value={1200} suffix="+" className="text-5xl font-bold" />

// Or the ready-made grid:
<StatGrid />
```

`IntersectionObserver` is supported in all modern browsers. Ensure Tailwind scans the file.

# Bento Grid

A responsive, asymmetric bento grid of feature cards in the Sand & Surf palette. Each card lifts and reveals a soft gradient glow on hover.

## Props

| Prop        | Type          | Default               | Description |
| ----------- | ------------- | --------------------- | ----------- |
| `eyebrow`   | `string`      | `"Why teams choose us"` | Small uppercase label above the heading. |
| `heading`   | `string`      | sample heading        | Section heading. |
| `items`     | `BentoItem[]` | 6 sample cards        | Cards to render. |
| `className` | `string`      | `""`                  | Extra classes on the `<section>`. |

### `BentoItem`

| Field         | Type     | Description |
| ------------- | -------- | ----------- |
| `title`       | `string` | Card title. |
| `description` | `string` | Supporting copy. |
| `icon`        | `string?`| Emoji/glyph icon. |
| `span`        | `string?`| Tailwind span classes, e.g. `"md:col-span-2 md:row-span-2"`. |
| `accent`      | `string?`| Tailwind gradient classes for the hover glow. |

## Dependencies

- `react`
- `tailwindcss`

## Drop-in

1. Copy `BentoGrid.tsx` into your project (e.g. `components/BentoGrid.tsx`).
2. Ensure Tailwind is configured and scanning the file in `content`.
3. Use it:

```tsx
import BentoGrid from "@/components/BentoGrid";

export default function Page() {
  return <BentoGrid heading="Built for coastal brands" />;
}
```

Works in Next.js (App or Pages Router) and Vite. No client directive is required — it is a static server component unless you add interactivity.

# Feature Accordion

An accordion of features that animates open/closed with the CSS `grid-rows-[0fr]→[1fr]` technique — smooth height transitions with no JS measurement. One item open at a time (optionally collapsible). Proper disclosure a11y: `aria-expanded`, `aria-controls`, and labelled `region` panels with `useId`. Sand & Surf palette.

## Props

| Prop          | Type              | Default | Description |
| ------------- | ----------------- | ------- | ----------- |
| `items`       | `AccordionItem[]` | 4 samples | `{ title, content, icon? }`. |
| `defaultOpen` | `number \| null`  | `0`     | Index open initially; `null` = all closed. |
| `collapsible` | `boolean`         | `true`  | Allow clicking the open item to close it. |
| `heading`     | `string`          | `"How we work"` | Section heading; pass `""` to hide. |
| `className`   | `string`          | `""`    | Extra classes on `<section>`. |

## Dependencies

- `react`
- `tailwindcss`

## Drop-in

Client component. `"use client"` is already present.

```tsx
import FeatureAccordion from "@/components/FeatureAccordion";

<FeatureAccordion
  items={[
    { title: "Question one", content: "Answer one.", icon: "❓" },
    { title: "Question two", content: "Answer two." },
  ]}
  heading="FAQ"
/>
```

The `grid-rows-[0fr]` / `grid-rows-[1fr]` utilities are built into Tailwind 3.4+. Ensure Tailwind scans the file.

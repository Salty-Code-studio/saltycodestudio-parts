# Segmented Control

An iOS-style segmented control / tab switcher with a single active "pill" that
slides between segments. Controlled, typed, and accessible: it is a WAI-ARIA
`radiogroup` with full keyboard navigation, a roving tab stop, and a sliding
pill that respects `prefers-reduced-motion`. Styled on the Sand & Surf palette.

## Props

| Prop               | Type                                          | Default | Description |
| ------------------ | --------------------------------------------- | ------- | ----------- |
| `options`          | `SegmentedControlOption<T>[]`                 | —       | The segments. Each has `value`, `label`, optional `icon`, optional `disabled`. |
| `value`            | `T`                                           | —       | Controlled selected value. |
| `onChange`         | `(value: T) => void`                          | —       | Called with the newly selected value. |
| `size`             | `"sm" \| "md" \| "lg"`                        | `"md"`  | Overall scale (height, padding, text). |
| `fullWidth`        | `boolean`                                     | `false` | Stretch each segment to share the row equally. |
| `disabled`         | `boolean`                                     | `false` | Disable the entire control. |
| `aria-label`       | `string`                                      | —       | Accessible name for the group (use this or `aria-labelledby`). |
| `aria-labelledby`  | `string`                                      | —       | `id` of a visible label for the group. |
| `className`        | `string`                                      | —       | Extra classes merged onto the outer track. |

`SegmentedControlOption<T>`: `{ value: T; label: React.ReactNode; icon?: React.ReactNode; disabled?: boolean }`.
The component is generic over `T extends string`, so `value` / `onChange` stay
type-safe against your option values.

## Accessibility

- Root is `role="radiogroup"`; each segment is `role="radio"` with
  `aria-checked`, so screen readers announce selection and the option count.
- Roving tabindex: only the selected segment is in the tab order. Tab enters the
  group, then arrow keys move between segments.
- Keyboard: `←`/`↑` previous, `→`/`↓` next (wraps around), `Home` first, `End`
  last. Disabled segments are skipped automatically.
- Focus is shown with a teal `focus-visible` ring only — hidden for mouse users.
- The sliding pill is `aria-hidden` and only animates under
  `motion-safe` (disabled when the user prefers reduced motion).
- Provide a name via `aria-label` or `aria-labelledby`.

## Variants & states (all shown in `preview.html`)

- Segments with leading icons + live content switching
- Three sizes (`sm` / `md` / `lg`)
- `fullWidth` distribution
- A single disabled segment (skipped by the keyboard)
- An entirely disabled control
- One control driving the size of another

## Dependencies

- `react`
- `tailwindcss`

No animation library required — the pill slides via GPU `transform` transitions.

## Drop-in

Copy `SegmentedControl.tsx` into your components folder. It is a client
component (`"use client"` is already present) and is fully controlled, so keep
the selected value in state.

```tsx
import { useState } from "react";
import SegmentedControl from "@/components/SegmentedControl";

export default function Example() {
  const [view, setView] = useState<"list" | "grid" | "map">("list");

  return (
    <SegmentedControl
      aria-label="View mode"
      value={view}
      onChange={setView}
      options={[
        { value: "list", label: "List" },
        { value: "grid", label: "Grid" },
        { value: "map", label: "Map" },
      ]}
    />
  );
}
```

Ensure Tailwind scans this file so its classes are generated.

## License

MIT · saltycodestudio-parts (original)

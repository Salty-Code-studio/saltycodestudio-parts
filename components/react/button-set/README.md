# Button Set

A complete, production-grade button system for React + Tailwind, styled for the
saltycodestudio **"Sand & Surf"** palette. One component covers every common
button need: five visual variants, three sizes, loading and disabled states, and
first-class icon support.

## What it is

`ButtonSet` is a single forward-ref component that renders a real, accessible
`<button>`. It spreads all native button attributes, so `onClick`, `type`,
`form`, `name`, `aria-*` and the rest work exactly as you expect.

## Variants

| `variant`      | Use for                                  | Look                                  |
| -------------- | ---------------------------------------- | ------------------------------------- |
| `primary`      | The main action on a screen              | Ocean teal fill, white text           |
| `secondary`    | Supporting actions                       | Sand fill, ink text                   |
| `ghost`        | Low-emphasis / toolbar actions           | Transparent, teal text, tinted hover  |
| `outline`      | Secondary actions that need a clear edge | Teal border, transparent fill         |
| `destructive`  | Delete / irreversible actions            | Clay-red fill, white text, red focus  |

## Props

| Prop          | Type                                                              | Default     | Description                                                        |
| ------------- | ----------------------------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| `variant`     | `"primary" \| "secondary" \| "ghost" \| "outline" \| "destructive"` | `"primary"` | Visual style.                                                      |
| `size`        | `"sm" \| "md" \| "lg"`                                            | `"md"`      | Control height & padding.                                          |
| `loading`     | `boolean`                                                         | `false`     | Shows a spinner, sets `aria-busy`, and blocks clicks.              |
| `loadingText` | `ReactNode`                                                       | —           | Optional label shown beside the spinner (falls back to children).  |
| `leftIcon`    | `ReactNode`                                                      | —           | Icon before the label (decorative, `aria-hidden`).                 |
| `rightIcon`   | `ReactNode`                                                     | —           | Icon after the label (decorative, `aria-hidden`).                  |
| `iconOnly`    | `boolean`                                                         | `false`     | Square icon-only button. **Pass `aria-label`.**                    |
| `fullWidth`   | `boolean`                                                         | `false`     | Stretches to the container width.                                  |
| `disabled`    | `boolean`                                                         | `false`     | Disables the button.                                               |
| `className`   | `string`                                                          | —           | Extra classes, merged after the defaults.                          |
| ...rest       | `ButtonHTMLAttributes<HTMLButtonElement>`                         | —           | Any native button prop (`onClick`, `type`, `form`, ...).           |

## Accessibility

- Renders a native `<button>` — full keyboard and screen-reader support out of the box.
- `focus-visible` ring on every variant (red ring for destructive), offset against the sand background.
- `loading` sets `aria-busy="true"` and disables the control so it cannot be double-submitted.
- Icons are marked `aria-hidden`; for `iconOnly` buttons supply an `aria-label` so the action is announced.

## Dependencies

None beyond React and Tailwind. The component is pure Tailwind utility classes —
no `framer-motion`, no icon library required (bring your own SVG icons).

## Paste-in instructions

1. Copy `ButtonSet.tsx` into your components folder
   (e.g. `src/components/ButtonSet.tsx`).
2. Make sure Tailwind is set up in your project and scans that file.
3. Import and use:

```tsx
import { ButtonSet } from "@/components/ButtonSet";

export function Example() {
  const ArrowIcon = (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ButtonSet variant="primary" size="md" rightIcon={ArrowIcon}>
        Get started
      </ButtonSet>

      <ButtonSet variant="outline">Learn more</ButtonSet>

      <ButtonSet variant="primary" loading loadingText="Saving…">
        Save
      </ButtonSet>

      <ButtonSet variant="destructive">Delete</ButtonSet>

      <ButtonSet variant="ghost" iconOnly aria-label="More options">
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
          <circle cx="4" cy="10" r="1.6" />
          <circle cx="10" cy="10" r="1.6" />
          <circle cx="16" cy="10" r="1.6" />
        </svg>
      </ButtonSet>
    </div>
  );
}
```

## License

MIT — `saltycodestudio-parts (original)`.

# Tooltip

An accessible tooltip that reveals on hover **and** keyboard focus, with smart viewport-aware placement and a small pointing arrow. It renders in a fixed-coordinate layer so it is never clipped by an `overflow: hidden` ancestor, auto-flips to the opposite side when the preferred side would overflow, and shifts along the cross-axis to stay on-screen (the arrow tracks the trigger). Built in the Sand & Surf palette.

## Accessibility

- The bubble is `role="tooltip"`; the trigger gets `aria-describedby` only while open.
- Opens on `mouseenter` / `focus`, closes on `mouseleave` / `blur` / **Escape**.
- Hover is debounced by `delay`; keyboard focus shows the tooltip immediately.
- The trigger keeps its own focus-visible ring — the tooltip never steals focus, and the bubble is `pointer-events-none`.
- Works with any focusable single child (`<button>`, `<a>`, an input wrapper, etc.). The child's existing `onMouseEnter/onMouseLeave/onFocus/onBlur` and `ref` are preserved and called through.

## Props

| Prop        | Type                                      | Default   | Description |
| ----------- | ----------------------------------------- | --------- | ----------- |
| `content`   | `ReactNode`                               | —         | Tooltip body. Strings or rich JSX. |
| `children`  | `ReactElement`                            | —         | A single focusable trigger element. |
| `placement` | `"top" \| "bottom" \| "left" \| "right"`  | `"top"`   | Preferred side; auto-flips/shifts to fit the viewport. |
| `delay`     | `number`                                  | `150`     | ms before showing on hover (focus is always instant). |
| `offset`    | `number`                                  | `8`       | px gap between trigger and tooltip (the arrow lives here). |
| `disabled`  | `boolean`                                 | `false`   | Renders the trigger but suppresses the tooltip. |
| `className` | `string`                                  | `""`      | Extra classes merged onto the bubble. |

## Dependencies

None beyond React and Tailwind (utility classes only). No `framer-motion` — the entry animation is a tiny inline keyframe.

## Paste-in

1. Copy `Tooltip.tsx` into your components folder (e.g. `@/components/Tooltip.tsx`). It already starts with `"use client"`.
2. Ensure Tailwind scans the file.
3. Wrap any focusable element:

```tsx
import Tooltip from "@/components/Tooltip";

<Tooltip content="Copy link to clipboard">
  <button aria-label="Copy link" onClick={copy}>
    {/* icon */}
  </button>
</Tooltip>

<Tooltip placement="right" delay={0} content={
  <span>
    <strong className="block">Deploy preview</strong>
    <span className="block text-[#bfe3e3]">Builds a temporary URL.</span>
  </span>
}>
  <button>Deploy</button>
</Tooltip>
```

The child must accept a `ref`, event handlers, and `aria-describedby`. Native elements and `forwardRef` components both work.

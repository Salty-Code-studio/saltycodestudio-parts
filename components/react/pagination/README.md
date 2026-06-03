# Pagination

An accessible, controlled pagination control. Renders Previous / Next buttons,
numbered page buttons, and collapses long ranges into ellipses (`…`) while
always keeping the boundaries and a window around the current page visible.
Edge buttons disable themselves at the first / last page.

Styled on the saltycodestudio **Sand & Surf** palette — sand surfaces with
ocean-teal accents.

## Preview

Open `preview.html` in any browser. No build step. It renders every state:
default, near the start, in the middle, near the end, few pages (no ellipsis),
boundary/sibling tuning, and a `hidePrevNext` variant.

## Props

| Prop            | Type                        | Default        | Description                                                                 |
| --------------- | --------------------------- | -------------- | --------------------------------------------------------------------------- |
| `page`          | `number`                    | —              | The active page (1-based). **Required.**                                    |
| `totalPages`    | `number`                    | —              | Total number of pages (>= 1). **Required.**                                 |
| `onPageChange`  | `(page: number) => void`    | —              | Called with the requested page when the user navigates. **Required.**       |
| `siblingCount`  | `number`                    | `1`            | Page buttons shown on each side of the current page before an ellipsis.     |
| `boundaryCount` | `number`                    | `1`            | Page buttons always shown at the very start and end.                        |
| `hidePrevNext`  | `boolean`                   | `false`        | Hide the Previous / Next buttons.                                           |
| `ariaLabel`     | `string`                    | `"Pagination"` | Accessible label for the wrapping `<nav>`.                                  |
| `className`     | `string`                    | `""`           | Extra classes on the wrapping `<nav>`.                                       |

The named export `usePaginationRange(...)` is also available if you want to
build a custom layout from the same truncation algorithm.

## Accessibility

- Wrapped in `<nav role="navigation" aria-label="Pagination">`.
- The active page button carries `aria-current="page"`.
- Every button has a descriptive `aria-label` (e.g. "Go to page 4", "Go to next page").
- Ellipses are inert (`aria-hidden`, non-focusable).
- Prev / Next use the native `disabled` attribute at the edges.
- Visible focus ring via `focus-visible` (teal `#2ec3c3`), keyboard operable
  with Tab + Enter/Space like any button.

## Behaviour

It is a **controlled** component: it holds no internal page state. Keep `page`
in your own state and update it in `onPageChange`. Requests are clamped to
`[1, totalPages]`, and `onPageChange` only fires when the page actually changes.

## Dependencies

None beyond React 18 and Tailwind CSS (utility classes only — no plugins).

## Paste-in

1. Copy `Pagination.tsx` into your components folder.
2. Ensure Tailwind is configured (the colors are arbitrary-value classes, so no
   theme changes are needed).
3. Use it:

```tsx
import { useState } from "react";
import Pagination from "./Pagination";

export default function Results() {
  const [page, setPage] = useState(1);
  const totalPages = 20;

  return (
    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
  );
}
```

## License

MIT — `saltycodestudio-parts (original)`.

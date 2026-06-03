# Data Table

A clean, accessible data table in the Sand & Surf palette. Click a column header to sort (toggles asc → desc); the active column shows a teal sort arrow and a proper `aria-sort` value. Rows zebra-stripe, lift to a soft ocean tint on hover, and the header stays pinned while you scroll. Ships with a loading skeleton state and a built-in empty state.

## What it is

A single generic, typed React component (`DataTable<T>`). You define columns with `key`, `header`, alignment, optional custom renderer, and an optional comparator. Sorting works out of the box (uncontrolled) or you can fully control it.

## Props

| Prop           | Type                                  | Default            | Description |
| -------------- | ------------------------------------- | ------------------ | ----------- |
| `columns`      | `Column<T>[]`                         | —                  | Column definitions (required). |
| `data`         | `T[]`                                 | —                  | Row data (required). |
| `rowKey`       | `(row, i) => string \| number`        | array index        | Stable React key per row. |
| `caption`      | `string`                              | —                  | Screen-reader-only table caption. |
| `title`        | `string`                              | —                  | Heading shown above the table. |
| `description`  | `string`                              | —                  | Sub text under the title. |
| `sort`         | `SortState<T>`                        | —                  | Controlled sort. Omit for uncontrolled. |
| `onSortChange` | `(sort: SortState<T>) => void`        | —                  | Fires whenever the sort changes. |
| `defaultSort`  | `SortState<T>`                        | `{ key:null }`     | Initial sort (uncontrolled mode). |
| `stickyHeader` | `boolean`                             | `true`             | Pin the header while scrolling. |
| `zebra`        | `boolean`                             | `true`             | Alternating row backgrounds. |
| `maxHeight`    | `string`                              | —                  | Scroll-area height, e.g. `"24rem"`. Enables sticky header. |
| `loading`      | `boolean`                             | `false`            | Render skeleton rows. |
| `loadingRows`  | `number`                              | `5`                | Skeleton row count. |
| `emptyState`   | `React.ReactNode`                     | built-in           | Shown when `data` is empty and not loading. |
| `onRowClick`   | `(row, i) => void`                    | —                  | Makes rows focusable/clickable (Enter/Space). |
| `className`    | `string`                              | `""`               | Extra classes on the outer wrapper. |

### `Column<T>`

| Field      | Type                                     | Description |
| ---------- | ---------------------------------------- | ----------- |
| `key`      | `keyof T & string`                       | Maps to a field on each row. |
| `header`   | `string`                                 | Column label. |
| `align`    | `"left" \| "right" \| "center"`          | Cell + header alignment. Default `"left"`. |
| `sortable` | `boolean`                                | Default `true`. Set `false` to disable. |
| `width`    | `string`                                 | Fixed column width, e.g. `"8rem"`. |
| `render`   | `(row, i) => React.ReactNode`            | Custom cell content. |
| `sortFn`   | `(a, b) => number`                       | Custom comparator for this column. |

### `SortState<T>`

```ts
{ key: (keyof T & string) | null; direction: "asc" | "desc" }
```

## Variants / states

- **Sortable columns** — header buttons toggle asc/desc with a numeric-aware default comparator (handles strings, numbers, and `Date`). Nullish values sort last. Sort is stable.
- **Zebra + hover** — alternating rows with an ocean-tint hover (toggle `zebra`).
- **Sticky header** — set `maxHeight` so the body scrolls under a pinned header.
- **Empty state** — automatic when `data` is empty; override with `emptyState`.
- **Loading** — `loading` renders shimmering skeleton rows.
- **Interactive rows** — pass `onRowClick` to make rows keyboard-focusable (`role="button"`, Enter/Space) with a focus ring.

## Accessibility

- Semantic `<table>` with `scope="col"` headers and a visually-hidden `<caption>`.
- Sortable headers are real `<button>`s with `aria-sort` (`ascending` / `descending` / `none`) and visible `focus-visible` rings.
- Interactive rows expose `role="button"`, `tabIndex={0}`, and Enter/Space handling.

## Dependencies

None beyond React + Tailwind. `deps: []` — no `framer-motion`.

## Drop-in

Client component (uses hooks). `"use client"` is already present.

```tsx
import DataTable, { type Column } from "@/components/DataTable";

type Customer = { name: string; plan: string; mrr: number; status: string };

const columns: Column<Customer>[] = [
  { key: "name", header: "Customer" },
  { key: "plan", header: "Plan" },
  { key: "mrr", header: "MRR", align: "right", render: (r) => `$${r.mrr}` },
  { key: "status", header: "Status" },
];

export default function Page() {
  return (
    <DataTable
      columns={columns}
      data={rows}
      title="Customers"
      caption="Customer accounts and monthly recurring revenue"
      maxHeight="24rem"
    />
  );
}
```

Ensure Tailwind scans the component file. The Sand & Surf hex values are inlined as Tailwind arbitrary values, so no theme config is required.

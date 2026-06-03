# Breadcrumb

Accessible breadcrumb navigation for showing the user's location in a hierarchy. Renders a proper `<nav><ol>` landmark with `aria-current="page"` on the final crumb, chevron or slash separators (marked `aria-hidden`), optional label truncation, and an expandable collapse for long paths.

## What it is

- Semantic markup: `<nav aria-label>` wrapping an ordered list, links for ancestors, a non-link current page.
- Long trails can collapse the middle into a `…` button that announces how many levels are hidden and expands them on click.
- Keyboard + focus-visible: every link and the expand button show a teal focus ring; no mouse required.
- Brand "Sand & Surf" palette out of the box, styled with Tailwind utility classes.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | sample trail | Ordered trail from root to current page. The last item is the current page. |
| `maxItems` | `number` | `0` | Collapse the middle once the trail exceeds this count. `0` disables collapsing. |
| `itemsBeforeCollapse` | `number` | `1` | Leading crumbs always kept visible when collapsed. |
| `itemsAfterCollapse` | `number` | `1` | Trailing crumbs always kept visible when collapsed. |
| `separator` | `"chevron" \| "slash"` | `"chevron"` | Separator glyph between crumbs. |
| `truncateLabels` | `boolean` | `false` | Cap each crumb width and ellipsize overflow (full label in `title`). |
| `ariaLabel` | `string` | `"Breadcrumb"` | Accessible label for the landmark. |
| `className` | `string` | `""` | Extra classes on the `<nav>`. |

`BreadcrumbItem`: `{ label: string; href?: string }`. Omit `href` for the current page (or any non-navigable node).

## Variants / states

- **Default** — chevron separators, all crumbs visible.
- **Slash** — `separator="slash"`.
- **Truncated** — `truncateLabels` caps each crumb at ~10rem and shows the full label on hover/focus.
- **Collapsed** — `maxItems={3}` hides the middle behind a `…` button; click to expand the full trail.
- **Single page** — one item renders just the current page with no separators.

## Dependencies

None beyond React and Tailwind (which the host app already provides). No `framer-motion`.

## Paste-in

1. Copy `Breadcrumb.tsx` into your components folder (e.g. `components/Breadcrumb.tsx`).
2. Ensure Tailwind is configured in your project.
3. Import and use:

```tsx
import Breadcrumb from "@/components/Breadcrumb";

export default function Page() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "/" },
        { label: "Work", href: "/work" },
        { label: "Client Projects", href: "/work/clients" },
        { label: "Bilingual Website Build" },
      ]}
      maxItems={3}
    />
  );
}
```

Open `preview.html` directly in a browser to see every variant rendered on the Sand & Surf palette.

## License

MIT — `saltycodestudio-parts (original)`.

# Features Grid

A responsive three- or four-column feature grid with icon tiles, titles, and
short descriptions. Built in the "Sand & Surf" palette: sand/cream backgrounds,
ink text, and ocean-teal accents. Cards lift gently and warm to white on
hover/focus.

## Files

- `FeaturesGrid.tsx` — React + Tailwind component (typed props, sensible defaults).
- `section.html` — the same section as plain HTML + Tailwind utility classes (no React).
- `preview.html` — a self-contained page (Tailwind Play CDN) that renders the HTML variant on a brand page with a minimal nav + footer. Open it directly in a browser.

## React props (`FeaturesGrid.tsx`)

| Prop          | Type                | Default                                             | Description                                          |
| ------------- | ------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| `eyebrow`     | `string`            | `"Why teams pick us"`                               | Small uppercase label above the heading. Hidden if empty. |
| `heading`     | `string`            | `"Everything you need to launch with confidence"`   | Section heading.                                     |
| `subheading`  | `string`            | `"We pair sharp design…"`                           | Supporting paragraph. Hidden if empty.               |
| `features`    | `FeatureItem[]`     | 6 built-in items                                    | The feature cards to render.                         |
| `columns`     | `3 \| 4`            | `3`                                                 | Columns on large screens (2 on `sm`, 1 on mobile).   |
| `ariaLabel`   | `string`            | `"Product features"`                                | Accessible label for the `<section>` landmark.       |

### `FeatureItem`

```ts
type FeatureItem = {
  id: string;              // unique key
  title: string;           // scannable title
  description: string;     // 1–2 sentence support text
  icon: React.ReactNode;   // inline SVG node rendered inside the icon tile
};
```

### Example

```tsx
import FeaturesGrid, { FeatureItem } from "./FeaturesGrid";

const features: FeatureItem[] = [
  {
    id: "speed",
    title: "Blazing fast",
    description: "Edge-delivered and tuned for Core Web Vitals.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
      </svg>
    ),
  },
  // …add three more for a clean 4-column row
];

export default function Page() {
  return (
    <FeaturesGrid
      eyebrow="What you get"
      heading="Designed to perform"
      features={features}
      columns={4}
    />
  );
}
```

## Paste-in instructions

### HTML variant (any stack with Tailwind)

1. Make sure Tailwind is available on the page (build pipeline or the Play CDN
   `https://cdn.tailwindcss.com` for quick tests).
2. Copy the `<section>…</section>` block from `section.html` into your page.
3. Edit the titles, descriptions, and inline `<svg>` icons. To switch to a
   4-column layout, change `lg:grid-cols-3` to `lg:grid-cols-4` on the `<ul>`.

### React variant

1. Copy `FeaturesGrid.tsx` into your components folder.
2. Ensure Tailwind is configured in your project.
3. Import and render `<FeaturesGrid />`, passing props to override content.

## Accessibility & notes

- The grid uses a semantic `<ul role="list">` of `<li>` items; each card is an `<article>` with an `<h3>` title.
- The icon tiles are decorative (`aria-hidden="true"`) — meaning lives in the title and description text.
- `focus-within` mirrors the hover lift so keyboard users get the same affordance when a card contains a focusable element.
- Colors meet contrast on the sand/cream backgrounds (ink `#1c2b33`, soft `#4a5d66`).

## License

MIT · saltycodestudio-parts (original)

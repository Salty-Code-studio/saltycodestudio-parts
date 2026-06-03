# Badge / Tag

A small, accessible label primitive for statuses, categories, and tags. Six
semantic color variants on the Sand & Surf palette, three sizes, an optional
leading status dot, a subtler outline treatment, square or pill corners, and a
fully keyboard-accessible removable variant.

## Props

| Prop          | Type                                                              | Default     | Description |
| ------------- | ----------------------------------------------------------------- | ----------- | ----------- |
| `variant`     | `"neutral" \| "ocean" \| "success" \| "warning" \| "danger" \| "info"` | `"neutral"` | Semantic color. `ocean` uses the brand teal. |
| `size`        | `"sm" \| "md" \| "lg"`                                            | `"md"`      | Overall scale (height, padding, text). |
| `pill`        | `boolean`                                                         | `true`      | Fully rounded (`true`) vs. rounded corners (`false`). |
| `dot`         | `boolean`                                                         | `false`     | Show a leading status dot in the variant color. |
| `outline`     | `boolean`                                                         | `false`     | Transparent fill with a stronger ring instead of a soft fill. |
| `onRemove`    | `() => void`                                                     | —           | When set, renders a trailing close button that calls this. |
| `removeLabel` | `string`                                                          | `Remove {children}` | `aria-label` for the remove button. |
| `children`    | `React.ReactNode`                                                | —           | The badge content. |
| `className`   | `string`                                                          | —           | Extra classes merged onto the root `<span>`. |

All other `HTMLSpanElement` attributes (e.g. `title`, `id`, `role`) are
forwarded to the root element, and a `ref` is forwarded too.

## Accessibility

- The root is a `<span>`; pass `role`/`aria-*` via props if it conveys status.
- The remove button is a real `<button type="button">` with an `aria-label`,
  so it is reachable by Tab and activatable with Enter/Space.
- Focus is shown with a `focus-visible` ring tinted to the variant — visible for
  keyboard users, hidden for mouse users.
- The status dot is `aria-hidden`; convey meaning through the text label.

## Variants & states (all shown in `preview.html`)

- Soft fill and outline, across all six semantic colors
- Status dot, all sizes (`sm` / `md` / `lg`)
- Square corners (`pill={false}`) for version/SHA chips
- Removable tag list with live state

## Dependencies

- `react`
- `tailwindcss`

## Drop-in

Copy `BadgeTag.tsx` into your components folder. It is a client component
(`"use client"` is already present) and only renders interactively when
`onRemove` is provided.

```tsx
import BadgeTag from "@/components/BadgeTag";

export default function Example() {
  const [tags, setTags] = useState(["React", "TypeScript", "Tailwind"]);

  return (
    <div className="flex flex-wrap gap-2">
      <BadgeTag variant="success" dot>Live</BadgeTag>
      <BadgeTag variant="ocean" outline>Beta</BadgeTag>
      {tags.map((t) => (
        <BadgeTag
          key={t}
          variant="neutral"
          onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}
        >
          {t}
        </BadgeTag>
      ))}
    </div>
  );
}
```

Ensure Tailwind scans this file so its classes are generated.

## License

MIT · saltycodestudio-parts (original)

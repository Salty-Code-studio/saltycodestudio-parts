# Select Menu

An accessible custom select / dropdown built on the WAI-ARIA listbox pattern. Full keyboard
navigation, an optional search box for long lists, a checkmark on the selected row, and the
Sand & Surf palette. Works controlled or uncontrolled.

It is a real `role="listbox"` with `role="option"` rows (not a native `<select>`), so you get
icons, descriptions, disabled rows, and custom styling while keeping screen-reader and keyboard
behaviour correct.

## Features

- **Keyboard:** `Enter` / `Space` / `↓` / `↑` open the menu; `↑`/`↓` move the active option;
  `Home`/`End` jump to first/last; `Enter` selects; `Esc` closes and restores focus to the trigger;
  `Tab` closes without selecting.
- **Optional search** — pass `searchable` to filter by label or description as you type.
- **Checkmark** on the currently selected option, plus a tinted background.
- **Disabled options** are skipped by keyboard nav and cannot be chosen.
- **Accessible:** `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`,
  `aria-selected`, `focus-visible` rings, outside-click + Escape to dismiss.
- **Controlled or uncontrolled**, three sizes, no runtime dependencies beyond React + Tailwind.

## Props

| Prop                | Type                          | Default            | Description |
| ------------------- | ----------------------------- | ------------------ | ----------- |
| `options`           | `SelectOption[]`              | —                  | Rows to render. Required. |
| `value`             | `string \| null`              | —                  | Controlled selected value. Omit for uncontrolled. |
| `defaultValue`      | `string \| null`              | `null`             | Initial value when uncontrolled. |
| `onChange`          | `(value: string) => void`     | —                  | Fired with the chosen value. |
| `placeholder`       | `string`                      | `"Select an option"` | Shown when nothing is selected. |
| `searchable`        | `boolean`                     | `false`            | Show a type-to-filter search box. |
| `searchPlaceholder` | `string`                      | `"Search…"`        | Placeholder for the search box. |
| `disabled`          | `boolean`                     | `false`            | Disable the whole control. |
| `label`             | `string`                      | —                  | Visible label above the trigger (also wires up `aria-labelledby`). |
| `id`                | `string`                      | auto               | `id` for the trigger button. |
| `className`         | `string`                      | `""`               | Extra classes on the outer wrapper. |
| `size`              | `"sm" \| "md" \| "lg"`        | `"md"`             | Trigger height / text size. |

### `SelectOption`

| Field         | Type      | Description |
| ------------- | --------- | ----------- |
| `value`       | `string`  | Stable value passed to `onChange`. Required. |
| `label`       | `string`  | Visible row text. Required. |
| `description` | `string?` | Small secondary line under the label. |
| `icon`        | `string?` | Leading emoji / glyph. |
| `disabled`    | `boolean?`| Make this row unselectable. |

## Dependencies

- `react`
- `tailwindcss`

(No third-party packages — `deps` is empty.)

## Drop-in

Client component (uses hooks, refs, and global listeners). The `"use client"` directive is
already present for the Next.js App Router.

```tsx
import SelectMenu from "@/components/SelectMenu";

const ISLANDS = [
  { value: "bonaire", label: "Bonaire", description: "Home base", icon: "🏝️" },
  { value: "curacao", label: "Curaçao", icon: "🌊" },
  { value: "aruba", label: "Aruba", icon: "🐠" },
  { value: "saba", label: "Saba", disabled: true },
];

export default function Example() {
  const [island, setIsland] = useState<string | null>(null);
  return (
    <SelectMenu
      label="Pick an island"
      options={ISLANDS}
      value={island}
      onChange={setIsland}
      searchable
    />
  );
}
```

The pop-in keyframes are injected via a scoped `<style>` tag, so no Tailwind config changes are
needed. Drop `SelectMenu.tsx` into your components folder and import it.

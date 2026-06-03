# Command Palette

A ⌘K-style command palette modal with subsequence fuzzy filtering, full keyboard navigation (↑/↓/Enter/Esc), grouped commands, and a frosted overlay. Sand & Surf palette.

When closed it renders a small "Search…" trigger button; pressing **⌘K / Ctrl+K** anywhere toggles it.

## Props

| Prop           | Type                       | Default | Description |
| -------------- | -------------------------- | ------- | ----------- |
| `commands`     | `Command[]`                | 8 samples | Commands to show. |
| `placeholder`  | `string`                   | `"Type a command or search…"` | Input placeholder. |
| `open`         | `boolean?`                 | —       | Controlled open state. Omit for self-managed. |
| `onOpenChange` | `(open: boolean) => void`  | —       | Open-state change callback. |

### `Command`

| Field      | Type          | Description |
| ---------- | ------------- | ----------- |
| `id`       | `string`      | Unique key. |
| `label`    | `string`      | Display text. |
| `group`    | `string?`     | Section heading. |
| `icon`     | `string?`     | Leading emoji/glyph. |
| `shortcut` | `string?`     | Right-aligned hint, e.g. `"G H"`. |
| `keywords` | `string?`     | Extra fuzzy-search terms. |
| `onSelect` | `() => void?` | Action on select. |

## Dependencies

- `react`
- `tailwindcss`

## Drop-in

Client component (uses hooks + global key listener). The `"use client"` directive is already present for Next.js App Router.

```tsx
import CommandPalette from "@/components/CommandPalette";

const commands = [
  { id: "new", label: "New project", group: "Actions", icon: "✨", onSelect: () => router.push("/new") },
  // …
];

export default function Shell() {
  return <CommandPalette commands={commands} />;
}
```

Keyframes for the open animation are injected via a scoped `<style>` tag, so no extra Tailwind config is needed.

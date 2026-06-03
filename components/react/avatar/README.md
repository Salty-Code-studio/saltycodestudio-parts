# Avatar

An accessible, production-grade avatar primitive on the **Sand & Surf** palette. It renders a
circular user image with a graceful **initials fallback** (used when no `src` is given or the
image fails to load), an optional **presence status dot**, and a companion **`AvatarGroup`** that
overlaps avatars and collapses the overflow into a **`+N`** chip.

No runtime dependencies beyond React and Tailwind utility classes.

## Files

- `Avatar.tsx` — exports `Avatar` (default), `AvatarGroup` (named), plus the `getInitials` helper and the `AvatarProps` / `AvatarGroupProps` / `AvatarSize` / `AvatarStatus` types.

## `Avatar` props

| Prop        | Type                                              | Default | Notes |
| ----------- | ------------------------------------------------- | ------- | ----- |
| `name`      | `string`                                          | —       | **Required.** Drives the accessible name, tooltip, and initials. |
| `src`       | `string`                                          | —       | Image URL. On load error it falls back to initials automatically. |
| `size`      | `"xs" \| "sm" \| "md" \| "lg" \| "xl"`            | `"md"`  | Diameter preset (24 / 32 / 40 / 56 / 80 px). |
| `status`    | `"online" \| "away" \| "busy" \| "offline"`       | —       | Renders a presence dot; the state is also announced via `aria-label`. |
| `ringed`    | `boolean`                                          | `false` | Cream separator ring — used by `AvatarGroup` for clean overlap. |
| `className` | `string`                                          | `""`    | Extra classes on the wrapper. |

### Status colors

| Status   | Color        |
| -------- | ------------ |
| online   | teal `#1f8a8a` |
| away     | amber `#e0a93b` |
| busy     | clay `#d6553f` |
| offline  | mist `#9bb0b8` |

## `AvatarGroup` props

| Prop        | Type                                              | Default | Notes |
| ----------- | ------------------------------------------------- | ------- | ----- |
| `avatars`   | `Array<{ name: string; src?: string; status? }>` | —       | **Required.** People in display order. |
| `max`       | `number`                                          | `4`     | Show this many, then collapse the rest into a `+N` chip. |
| `size`      | `AvatarSize`                                       | `"md"`  | Applied to every avatar in the row. |
| `className` | `string`                                          | `""`    | Extra classes on the `<ul>` wrapper. |

The `+N` chip is a real `<button>`: keyboard focusable, with a `focus-visible` ring and a title/`aria-label` listing the hidden names.

## Accessibility

- Each avatar is `role="img"` with an `aria-label` of the name (and presence state when set); the inner `<img>` / initials are `aria-hidden` so screen readers announce the person once, not twice.
- `AvatarGroup` is a labelled `<ul>` (`"4 people"`); the overflow chip announces the exact hidden count and names.
- Initials and tint color are derived deterministically from the name, so the same person is always the same color — no flicker between renders.

## Dependencies

None. Requires React 18+ and Tailwind CSS in the host project.

## Paste-in

1. Copy `Avatar.tsx` into your components folder.
2. Ensure Tailwind is configured (the component uses utility classes and arbitrary color values).
3. Import and use:

```tsx
import Avatar, { AvatarGroup } from "./Avatar";

// Single
<Avatar name="Salty Code" src="/me.jpg" status="online" size="lg" />

// Initials fallback (no src)
<Avatar name="Playa Culture" status="busy" />

// Overlapping group with +N
<AvatarGroup
  max={4}
  avatars={[
    { name: "Ava Reef", src: "/ava.jpg", status: "online" },
    { name: "Milo Sand", src: "/milo.jpg" },
    { name: "Nia Cove", status: "away" },
    { name: "Theo Dune" },
    { name: "Remy Surf" },
    { name: "Iris Bay" },
  ]}
/>
```

## License

MIT — `saltycodestudio-parts (original)`.

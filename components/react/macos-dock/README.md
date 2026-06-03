# macOS Dock

A macOS-style icon dock whose items magnify and lift as the cursor approaches — perfect for portfolio nav bars and app launchers. Hovering an icon scales it up while its neighbours grow in a smooth bell curve, exactly like the Dock in macOS.

## How it works

The dock tracks a single motion value for the cursor's X position. Each `DockItem` measures the distance from the cursor to its own horizontal centre, maps that distance through `useTransform` to a target size, and feeds it to `useSpring`. Because every item reads the same cursor value, they all scale together in a continuous magnification curve. Users with `prefers-reduced-motion` get a static, full-size dock with no springing.

## Dependencies

- [`motion`](https://motion.dev) (Framer Motion v11+, imported as `motion/react`)
- `tailwindcss`

```bash
npm i motion
```

## Paste-in instructions

1. Copy `MacosDock.tsx` into your project (e.g. `components/MacosDock.tsx`).
2. Make sure Tailwind is set up and `motion` is installed.
3. Import and compose a row of `DockItem`s:

```tsx
import { MacosDock, DockItem, DockDivider } from "@/components/MacosDock";
import { Home, Mail, Settings, Trash2 } from "lucide-react";

export default function Nav() {
  return (
    <MacosDock baseSize={48} maxSize={80} distance={140}>
      <DockItem label="Home" href="/">
        <Home className="h-1/2 w-1/2 text-[#0f5c5c]" />
      </DockItem>
      <DockItem label="Mail" onClick={() => openMail()}>
        <Mail className="h-1/2 w-1/2 text-[#1f8a8a]" />
      </DockItem>
      <DockItem label="Settings" href="/settings">
        <Settings className="h-1/2 w-1/2 text-[#2ec3c3]" />
      </DockItem>
      <DockDivider />
      <DockItem label="Trash" onClick={() => emptyTrash()}>
        <Trash2 className="h-1/2 w-1/2 text-[#4a5d66]" />
      </DockItem>
    </MacosDock>
  );
}
```

### Props

**`MacosDock`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `baseSize` | `number` | `48` | Resting icon size in px. |
| `maxSize` | `number` | `80` | Peak icon size on hover. |
| `distance` | `number` | `140` | Magnification reach (px) on each side of the cursor. |
| `className` | `string` | `""` | Extra classes for the dock shell. |

**`DockItem`**

| Prop | Type | Description |
| --- | --- | --- |
| `label` | `string` | Tooltip shown above the icon on hover. |
| `onClick` | `() => void` | Click/Enter/Space handler. |
| `href` | `string` | Renders the icon as a link. |
| `className` | `string` | Extra classes for the icon tile. |

`DockDivider` is a thin separator for grouping items (e.g. apps `|` trash).

## Preview

Open `preview.html` directly in any browser — it is fully self-contained (React 18 UMD, Babel Standalone, Framer Motion UMD, and the Tailwind Play CDN) and renders the dock on a Sand & Surf demo desktop.

## Notes

- Icons should fill their tile responsively (e.g. `h-1/2 w-1/2` or a percentage-sized inner element) so they scale with the magnifying tile.
- The source file imports from `motion/react`. If you are on the older `framer-motion` package, change the import to `from "framer-motion"`.

## Source / inspiration

Inspired by the [Magic UI Dock](https://magicui.design/docs/components/dock) (MIT). Reimplemented cleanly from scratch with credit — no proprietary code copied verbatim.

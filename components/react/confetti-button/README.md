# Confetti Button

A button that bursts confetti from its **own on-screen position** when clicked — ideal for celebrating signups, purchases, and other success moments. On press it reads the button's bounding rect, normalises its centre to canvas-confetti's `0..1` viewport-origin coordinates, then fires a burst from exactly that point so the celebration emanates from the button itself.

Honours `prefers-reduced-motion`: the burst is skipped for users who opt out, while your `onClick` / `onConfetti` logic still runs.

## Dependencies

- [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti) (MIT)

```bash
npm install canvas-confetti
# types (optional, recommended for TS)
npm install -D @types/canvas-confetti
```

This is a React component styled with Tailwind classes (you can override every style via the `className` prop).

## Paste-in instructions

1. Install `canvas-confetti` (above).
2. Copy `ConfettiButton.tsx` into your components folder.
3. Use it anywhere a celebratory click belongs:

```tsx
import { ConfettiButton } from "@/components/ConfettiButton";

export function SignupCTA() {
  return (
    <ConfettiButton onConfetti={() => track("signup_celebrated")}>
      Sign up free
    </ConfettiButton>
  );
}
```

### Props

| Prop            | Type         | Default                        | Description                                              |
| --------------- | ------------ | ------------------------------ | -------------------------------------------------------- |
| `particleCount` | `number`     | `90`                           | Particles per burst.                                     |
| `spread`        | `number`     | `70`                           | Spread of the burst in degrees (wider = more fan-shaped).|
| `angle`         | `number`     | `90`                           | Launch angle in degrees (90 = straight up).              |
| `startVelocity` | `number`     | `45`                           | Initial particle velocity.                               |
| `gravity`       | `number`     | `1`                            | How fast particles fall back down.                       |
| `scalar`        | `number`     | `1`                            | Particle size multiplier.                                |
| `colors`        | `string[]`   | Sand & Surf ocean palette      | Confetti colours.                                        |
| `onConfetti`    | `() => void` | —                              | Runs after the burst fires (analytics, navigation, etc.).|
| `className`     | `string`     | Styled ocean button            | Override the button styling entirely.                    |

All standard `<button>` attributes (including `onClick`, `disabled`, `aria-*`) are forwarded. `onClick` fires alongside the burst.

```tsx
<ConfettiButton
  particleCount={160}
  spread={100}
  startVelocity={55}
  scalar={1.1}
  className="rounded-xl bg-[#1c2b33] px-6 py-3 font-semibold text-white"
>
  Buy now — $24
</ConfettiButton>
```

## Source / inspiration

Reimplemented cleanly from [Magic UI — Confetti](https://magicui.design/docs/components/confetti) (MIT), which wraps [canvas-confetti](https://github.com/catdad/canvas-confetti) (MIT). Written from scratch with credit; no proprietary code copied.

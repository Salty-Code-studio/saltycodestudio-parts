# Spotlight Card

A card that reveals a soft radial spotlight following the cursor on hover, ideal for premium-but-safe feature and pricing grids. A subtle dot pattern is masked in only under the cursor, layered beneath a warm teal glow.

## How it works

`onMouseMove` writes the pointer's local coordinates into two CSS custom properties (`--x` / `--y`). Two absolutely-positioned overlay layers then paint `radial-gradient(circle at var(--x) var(--y), ...)`:

1. a **glow** layer (the spotlight color), and
2. a **dot pattern** layer that uses the same gradient as a CSS `mask-image`, so the pattern is revealed only where the spotlight falls.

Both layers fade with `opacity` on `group-hover`, which is GPU-cheap. `prefers-reduced-motion` users still get the spotlight, just without the opacity easing (`motion-reduce:transition-none`).

## Dependencies

- `react` (18+)
- `tailwindcss`
- `motion` — listed as a peer for parity with the source component; this clean reimplementation uses no JS animation library, so you can drop it if you don't need it elsewhere.

## Paste-in instructions

1. Copy `SpotlightCard.tsx` into your components folder (e.g. `components/SpotlightCard.tsx`).
2. Ensure Tailwind is configured in your project (the component uses arbitrary-value utilities and `group` / `group-hover`).
3. Use it:

```tsx
import SpotlightCard from "@/components/SpotlightCard";

export default function Features() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SpotlightCard
        icon="🌊"
        eyebrow="Hosting"
        title="Edge-first delivery"
        description="Static assets cached at the coast nearest your visitor."
      />
      {/* Custom body via children */}
      <SpotlightCard spotlightColor="rgba(15, 92, 92, 0.3)" radius={300}>
        <h3 className="text-lg font-semibold text-[#1c2b33]">Anything goes</h3>
        <p className="mt-2 text-sm text-[#4a5d66]">
          Pass children to render your own content under the spotlight.
        </p>
      </SpotlightCard>
    </div>
  );
}
```

## Props

| Prop             | Type        | Default                      | Description                                                  |
| ---------------- | ----------- | ---------------------------- | ------------------------------------------------------------ |
| `title`          | `string`    | —                            | Card heading (ignored if `children` is provided).            |
| `description`    | `string`    | —                            | Body copy (ignored if `children` is provided).               |
| `icon`           | `string?`   | —                            | Emoji / glyph in the icon chip.                              |
| `eyebrow`        | `string?`   | —                            | Small uppercase label above the title.                       |
| `radius`         | `number`    | `320`                        | Spotlight radius in pixels.                                  |
| `spotlightColor` | `string`    | `rgba(46, 195, 195, 0.28)`   | Glow color (any CSS color).                                  |
| `showPattern`    | `boolean`   | `true`                       | Reveal the masked dot pattern under the spotlight.           |
| `className`      | `string`    | `""`                         | Extra classes for the outer card.                            |
| `children`       | `ReactNode` | —                            | Custom body; overrides `icon`/`eyebrow`/`title`/`description`.|

## Source / inspiration

Inspired by [Aceternity UI — Card Spotlight](https://ui.aceternity.com/components/card-spotlight). Cleanly reimplemented (no proprietary code copied). License: MIT (Aceternity UI) — reimplemented with credit.

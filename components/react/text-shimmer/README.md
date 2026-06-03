# Text Shimmer

Text with a soft light sheen sweeping across it left to right — perfect for
announcement pills, badges and subtle loading labels.

The effect is a clipped `background-image` linear-gradient highlight: a narrow
bright band lives inside a wide transparent gradient, the background is clipped
to the text (`bg-clip-text` + transparent text fill), and the band is translated
across the glyphs via a `background-position` keyframe. Only a thin sheen is
visible as it sweeps.

## Dependencies

- React 18+
- Tailwind CSS (used for layout / demo classes; the shimmer itself is plain CSS)

No other runtime dependencies.

## Files

- `TextShimmer.tsx` — the canonical, typed, copy-paste component. It injects its
  own keyframes once at runtime, so it works without any global CSS setup.

## Paste-in instructions

1. Copy `TextShimmer.tsx` into your project (e.g. `components/TextShimmer.tsx`).
2. Use it:

   ```tsx
   import TextShimmer from "@/components/TextShimmer";

   // Announcement pill
   <span className="rounded-full border px-4 py-1.5 text-sm">
     <TextShimmer baseColor="#0f5c5c" shineColor="#2ec3c3" duration={2.6}>
       Now shipping v1.0
     </TextShimmer>
   </span>

   // Loading label
   <TextShimmer as="p" duration={1.8} baseColor="#7d8c93">
     Charting the tide…
   </TextShimmer>
   ```

### Props

| Prop         | Type                  | Default     | Description                                          |
| ------------ | --------------------- | ----------- | ---------------------------------------------------- |
| `children`   | `React.ReactNode`     | —           | The text to shimmer.                                 |
| `as`         | tag name              | `"span"`    | Element to render (`span`, `p`, `h1`–`h4`, `label`…).|
| `duration`   | `number`              | `3`         | Seconds for one full sweep.                          |
| `spread`     | `number`              | `2`         | Width of the bright band, in `em`.                   |
| `baseColor`  | `string`              | `"#4a5d66"` | Resting text color.                                  |
| `shineColor` | `string`              | `"#ffffff"` | Color of the sweeping highlight.                     |
| `className`  | `string`              | `""`        | Extra classes (size, weight, tracking, etc.).        |

> Tip: set the font size/weight via `className`; the band width scales with the
> font size because `spread` is expressed in `em`.

### Accessibility

Respects `prefers-reduced-motion: reduce` — the animation stops and the
highlight rests on a centered position instead of sweeping.

## Preview

Open `preview.html` directly in a browser to see it rendered on the
"Sand & Surf" palette (announcement pills, a dark-ocean headline, and loading
labels).

## Source / inspiration

Inspired by Magic UI's "Animated Shiny Text"
(<https://magicui.design/docs/components/animated-shiny-text>).
MIT (Magic UI) — reimplemented cleanly here in our own code with credit.

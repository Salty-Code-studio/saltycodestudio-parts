# Testimonials

A responsive grid of testimonial cards on the saltycodestudio **Sand & Surf** palette. Each card carries a quote-mark glyph, the quote, an optional star rating, and a footer with avatar, name, and role. Cards lift gently on hover and equalize height across the row.

- **Category:** testimonials
- **Tier:** practical
- **Palette:** Sand & Surf (Warm Sand `#F2EBDD`, card surface `#FBF7EF`, Deep Teal `#0E3A40`, Surf Coral `#FF6F59`, Sky Blue `#4FA8C9`, Driftwood Ink `#1C2B2E`)
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (eyebrow/labels)
- **Layout:** 1 col mobile → 2 cols `sm` → 3 cols `lg`

## Files

| File | What it is |
|------|------------|
| `Testimonials.tsx` | React + Tailwind component with typed props and sensible defaults. |
| `section.html` | The same section as plain HTML + Tailwind utility classes — paste into any Tailwind page. |
| `preview.html` | Self-contained page (Tailwind Play CDN + brand fonts) that renders the section with a minimal nav/footer. Open directly in a browser. |

## Props (`Testimonials.tsx`)

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `eyebrow` | `string` | `"Kind words"` | Mono uppercase label above the heading. Pass `""` to hide. |
| `heading` | `string` | `"Teams that ship with us"` | Section heading. |
| `subheading` | `string` | `"We keep client relationships…"` | Supporting line. Pass `""` to hide. |
| `testimonials` | `Testimonial[]` | 6 realistic entries | The cards to render. |

### `Testimonial`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `quote` | `string` | yes | 2–4 sentences reads best. |
| `name` | `string` | yes | Full name. |
| `role` | `string` | yes | e.g. `"Founder, Tidepool Labs"`. |
| `avatar` | `string` | no | Image URL. If omitted, a colored monogram (initials) is shown. |
| `rating` | `number` | no | 0–5. Omit to hide the star row. |

## Paste-in instructions

### React (Tailwind project)

```tsx
import Testimonials from "./Testimonials";

export default function Page() {
  return (
    <Testimonials
      heading="Loved by founders and product teams"
      testimonials={[
        {
          quote: "Shipped in three weeks and it just works.",
          name: "Marisol Ferreira",
          role: "Founder, Tidepool Labs",
          avatar: "/avatars/marisol.jpg",
          rating: 5,
        },
        // …more
      ]}
    />
  );
}
```

Requires Tailwind. For the brand fonts, register `font-display` (Space Grotesk), `font-mono` (JetBrains Mono), and `font-sans` (Inter) in your `tailwind.config` and load them (Google Fonts or self-hosted).

### Plain HTML (any Tailwind page)

Copy the markup from `section.html` and drop it anywhere inside your `<body>`. It uses only Tailwind utility classes with arbitrary brand-color values, so no config changes are required beyond having Tailwind on the page. To match the type exactly, load Space Grotesk / Inter / JetBrains Mono and map them to `font-display` / `font-sans` / `font-mono` (see `preview.html` for a working `tailwind.config`).

### Preview

Open `preview.html` in a browser — it pulls Tailwind from the Play CDN and the fonts from Google Fonts, then renders the section inside a minimal Sand & Surf page (with a working mobile-menu toggle). No build step, no React/Babel.

## Accessibility

- Section is labelled via `aria-labelledby` pointing at the heading.
- Each testimonial uses semantic `<figure>` / `<blockquote>` / `<figcaption>`.
- The star rating exposes a text label (`role="img"` + `aria-label="5 out of 5 stars"`); decorative SVGs are `aria-hidden`.
- Avatar images use empty `alt=""` since the name is already in the visible caption.

## License

MIT — `saltycodestudio-parts (original)`.

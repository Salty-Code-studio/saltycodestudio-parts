# Hero Split

A split hero for **saltycodestudio**. Bold headline, subcopy, two CTAs, and a small
stat row on the left; a teal code-window mockup with a status strip on the right.
On the "Sand & Surf" palette: warm sand canvas, deep teal ink, a single surf-coral
accent on the primary CTA and accent word, sky blue as the supporting glow.

Stacks to a single column on mobile (copy first, mockup below) and goes side-by-side
at the `lg` breakpoint.

## Files

- `HeroSplit.tsx` — React + Tailwind component (typed props, sensible defaults).
- `section.html` — same section as plain HTML + Tailwind utility classes (no React).
- `preview.html` — self-contained page (Tailwind Play CDN + brand fonts + nav) that renders the section. Open it directly in a browser.

## Props (`HeroSplit.tsx`)

| Prop | Type | Default |
|------|------|---------|
| `eyebrow` | `string` | `"~< web design & development"` |
| `headline` | `string` | `"Clean code, warm coast."` |
| `accentWord` | `string` | `"warm coast."` — substring of `headline` rendered in coral |
| `subcopy` | `string` | realistic studio paragraph |
| `primaryCta` | `{ label: string; href: string }` | `{ label: "Start a project", href: "#contact" }` |
| `secondaryCta` | `{ label: string; href: string }` | `{ label: "See the work", href: "#work" }` |
| `trustNote` | `string` | `"Trusted by founders from Bonaire to Brooklyn."` |
| `stats` | `{ value: string; label: string }[]` | three studio stats |
| `mockupFile` | `string` | `"studio.ts"` |
| `codeLines` | `string[]` | eight lines of placeholder TS |

`accentWord` must be a substring of `headline`; if it is missing or empty, the
headline renders without a coral highlight. Pass `stats={[]}` to hide the stat row,
or `trustNote=""` to hide the trust line.

## Paste-in

### React

```tsx
import HeroSplit from "./HeroSplit";

export default function Page() {
  return (
    <HeroSplit
      headline="Clean code, warm coast."
      accentWord="warm coast."
      primaryCta={{ label: "Start a project", href: "/contact" }}
      secondaryCta={{ label: "See the work", href: "/work" }}
    />
  );
}
```

Requires Tailwind CSS. For the brand fonts, load Space Grotesk, JetBrains Mono and
Inter and map the CSS variables `--font-display`, `--font-mono`, `--font-body`
(the component reads `--font-display` with a Space Grotesk fallback).

### HTML

Copy the contents of `section.html` into any page that already loads Tailwind
(CDN or build). For the exact look, also load the brand fonts and define
`--font-display: "Space Grotesk", sans-serif` on `:root`. See `preview.html` for a
complete working setup.

## License

MIT · `saltycodestudio-parts (original)`

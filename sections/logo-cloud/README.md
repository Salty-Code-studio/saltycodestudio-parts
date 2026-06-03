# Logo Cloud

A quiet, premium **"Trusted by" logo strip** for social proof. Brand marks render desaturated (grayscale + dimmed) and animate to full color on hover or keyboard focus — a tasteful, lightweight way to show who you work with.

- **Category:** social-proof
- **Tier:** practical
- **Palette:** Sand & Surf (sand `#fbf7f0`, ink `#1c2b33` / soft `#4a5d66`, ocean teal `#1f8a8a` / deep `#0f5c5c` / surf `#2ec3c3`)
- **Responsive:** 2 columns on mobile → 3 on small → 6 on large
- **Accessible:** semantic `<section>` + `aria-labelledby`, `role="list"`, per-logo `aria-label`, visible `focus-visible` ring, `motion-reduce` respected
- **Hover effect:** `grayscale opacity-60` → `grayscale-0 opacity-100` over 300ms

## Files

| File | What it is |
| --- | --- |
| `LogoCloud.tsx` | React + Tailwind component with typed props. |
| `section.html` | The same section as plain HTML + Tailwind utility classes (no React). |
| `preview.html` | Self-contained page (Tailwind Play CDN) that renders the section in context. Open it in a browser. |

## Preview

Open `preview.html` directly in any browser — it pulls Tailwind from the Play CDN, so no build step is needed. Hover (or Tab) over a logo to see the grayscale → color transition.

## React props (`LogoCloud.tsx`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `eyebrow` | `string` | `"Trusted by teams shipping on the coast"` | Small heading above the strip. |
| `subtext` | `string` | studio one-liner | Supporting line under the eyebrow. Pass `""` to hide. |
| `logos` | `Logo[]` | 6 placeholder marks | The brand marks to display. |
| `centered` | `boolean` | `true` | Center the eyebrow + subtext (the grid is always centered). |
| `className` | `string` | `""` | Extra classes for the outer `<section>`. |

### `Logo` type

```ts
type Logo = {
  name: string;   // accessible name (aria-label / alt)
  src?: string;   // image source (SVG recommended) — used if `svg` is absent
  svg?: string;   // inline SVG markup string — inherits currentColor for the recolor
  href?: string;  // optional outbound link to the brand
};
```

Provide **either** `src` (hosted image) **or** `svg` (inline markup string). Inline SVGs should use `fill="currentColor"` / `stroke="currentColor"` so the grayscale → color hover works without per-logo color values.

### Usage

```tsx
import LogoCloud from "./LogoCloud";

export default function Page() {
  return (
    <LogoCloud
      eyebrow="Trusted by 40+ product teams"
      logos={[
        { name: "Tide & Co", src: "/logos/tide.svg", href: "https://tideandco.example" },
        { name: "Saltbox Labs", src: "/logos/saltbox.svg" },
        // ...
      ]}
    />
  );
}
```

## Plain HTML usage (`section.html`)

1. Copy the `<section>…</section>` block from `section.html` into your page.
2. Make sure Tailwind is available (via your build or the Play CDN).
3. Replace each inline `<svg>` with your own brand mark. Keep `fill="currentColor"` (or `stroke="currentColor"`) and the wrapping `<span>` classes so the grayscale → color hover keeps working. To use a hosted image instead, swap the `<svg>` for:

   ```html
   <img src="/logos/yourbrand.svg" alt="Your Brand" loading="lazy" decoding="async" class="h-7 w-auto" />
   ```

4. Add or remove `<li>` items — the grid reflows automatically.

## Notes

- The `Logo` type accepts inline `svg` so you can drop in marks without hosting files; `LogoCloud.tsx` injects it via `dangerouslySetInnerHTML` — only pass markup you control.
- `focus-visible` ring uses surf `#2ec3c3` with a sand `ring-offset` so keyboard users get a clear, on-brand focus state.
- Logos without an `href` still get an `aria-label` and render identically (no link affordance).

**Source:** saltycodestudio-parts (original) · **License:** MIT

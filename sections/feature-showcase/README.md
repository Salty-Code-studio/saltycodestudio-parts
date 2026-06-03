# Feature Showcase

Alternating image-and-text feature rows that flip left/right down the page. Each row pairs a
captioned visual with a kicker, headline, supporting paragraph, a checklist, and an optional call
to action. The image side alternates automatically as you scroll — odd rows flip to image-right.

Brand palette **Sand & Surf**: sand/cream backgrounds (`#fbf7f0`, `#f4ece0`, `#ece0cd`), ink text
(`#1c2b33`, soft `#4a5d66`), ocean accents teal (`#1f8a8a`), deep (`#0f5c5c`), surf (`#2ec3c3`),
with a single coral pop (`#FF6F59`) in the placeholder art.

## Files

| File | What it is |
| --- | --- |
| `FeatureShowcase.tsx` | React + Tailwind component, typed props, sensible defaults. |
| `section.html` | The same section as plain HTML + Tailwind classes — copy-paste into any page. |
| `preview.html` | Standalone page that renders the HTML variant via the Tailwind Play CDN (brand fonts + nav/footer context + mobile-menu JS). Open it in a browser. |

## Preview

Just open `preview.html` in any browser — no build step. It loads Tailwind from the CDN and the
brand fonts (Space Grotesk / JetBrains Mono / Inter) from Google Fonts.

## React variant

```tsx
import FeatureShowcase from "./FeatureShowcase";

export default function Page() {
  return <FeatureShowcase />; // renders the default three-step content
}
```

Pass your own content (the rows alternate sides automatically):

```tsx
<FeatureShowcase
  eyebrow="Why teams pick us"
  heading="Built for the long haul"
  intro="A few reasons the work keeps shipping after launch."
  features={[
    {
      kicker: "01 — Performance",
      title: "Fast by default, measured for real",
      body: "We budget every kilobyte and watch Core Web Vitals in production.",
      bullets: ["Sub-second loads", "Image + font discipline", "Lighthouse in CI"],
      cta: { label: "See the numbers", href: "/performance" },
      imageSrc: "/img/perf.jpg",      // omit to use the built-in coastal SVG
      imageAlt: "A performance dashboard with green vitals",
      imageCaption: "vitals.json",
    },
  ]}
/>
```

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `eyebrow` | `string` | `"How we work"` | Mono label above the heading. Hidden when empty. |
| `heading` | `string` | `"Three steps, no surprises"` | Section heading (`<h2>`). |
| `intro` | `string` | studio intro copy | Lead paragraph under the heading. Hidden when empty. |
| `features` | `FeatureItem[]` | three-step process | Rows; image side alternates by index. |
| `className` | `string` | `""` | Extra classes merged onto the outer `<section>`. |

`FeatureItem`:

| Field | Type | Notes |
| --- | --- | --- |
| `kicker` | `string?` | Mono label above the row title, e.g. `"01 — Build"`. |
| `title` | `string` | Row headline (`<h3>`). Required. |
| `body` | `string` | Supporting paragraph. Required. |
| `bullets` | `string[]?` | Rendered as a checklist with teal check icons. |
| `cta` | `{ label, href }?` | Renders a teal pill link with an animated arrow. |
| `imageSrc` | `string?` | Real image URL. Omit to use the built-in coastal SVG placeholder. |
| `imageAlt` | `string?` | Alt text — set a real description when you pass `imageSrc`. |
| `imageCaption` | `string?` | Small mono caption chip on the image card. |

## HTML variant

Copy the `<section>...</section>` from `section.html` into any page that already loads Tailwind.
It needs no JavaScript. The placeholder visuals are inline SVG, so each row renders even without
image assets — swap any `<svg role="img">…</svg>` block for an `<img>` when you have real art, and
keep the surrounding `aspect-[4/3]` wrapper.

To flip a row, move the `lg:order-1` / `lg:order-2` classes between the image `<div>` and the text
`<div>` (image-left rows use order-1/order-2; flipped rows use order-2/order-1).

## Accessibility

- The section is labelled by its heading (`aria-labelledby`); each row `<article>` is labelled by
  its own `<h3>`.
- Decorative SVGs use `aria-hidden`; the placeholder art carries a descriptive `role="img"` label.
- The CTA link has a visible `focus-visible` outline in deep teal.
- Color pairings (ink on sand, white on teal) meet WCAG AA contrast.

## License

MIT — `saltycodestudio-parts (original)`.

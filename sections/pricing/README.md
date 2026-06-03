# Pricing Tiers — saltycodestudio

Tiered pricing with a highlighted recommended plan and per-plan feature lists. Three cards (`Launch`, `Scale`, `Studio`), with the middle plan lifted, darkened to Deep Teal, and badged "Most popular." Feature rows support included (teal check) and excluded (dimmed, struck-through dash) states. Brand palette **Sand & Surf**.

## Variants

- **`PricingTiers.tsx`** — React + Tailwind component with typed props and sensible defaults.
- **`section.html`** — the same section as plain HTML + Tailwind utility classes (no React). Paste into any Tailwind page.
- **`preview.html`** — a single self-contained file that renders the section in a browser via the Tailwind Play CDN, on a Sand & Surf page with a minimal nav (incl. a working mobile-menu toggle) and footer. Just open it.

## Fonts

Load these once in your `<head>` (already wired into `preview.html`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

Space Grotesk = display/headings, JetBrains Mono = labels/eyebrow/cadence, Inter = body.

## Palette used (Sand & Surf)

| Token | HEX | Role here |
|-------|-----|-----------|
| Warm Sand | `#F2EBDD` | Section background |
| Cream surface | `#fbf7f0` | Standard card surface |
| Deep Teal | `#0E3A40` | Headings, recommended card, default CTA |
| Surf Coral | `#FF6F59` | Badge + recommended CTA (one accent per view) |
| Teal accent | `#1f8a8a` / `#2ec3c3` | Eyebrow, included-feature checks |
| Soft ink | `#4a5d66` | Body copy |
| Driftwood Ink | `#1C2B2E` | Standard card text |

## Props (`PricingTiers.tsx`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `eyebrow` | `string` | `"~< PRICING"` | Mono eyebrow above the heading. |
| `heading` | `string` | `"Pricing that fits the build."` | Section heading. |
| `subheading` | `string` | (provided) | Supporting paragraph under the heading. |
| `plans` | `PricingPlan[]` | 3 default plans | The plans to render (3 looks best). |
| `footnote` | `string` | (provided) | Reassurance line under the cards. |
| `id` | `string` | `"pricing"` | Section id for in-page anchoring + `aria-labelledby`. |

### `PricingPlan`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | React key. |
| `name` | `string` | Plan name. |
| `tagline` | `string` | One-line summary. |
| `price` | `string` | Pre-formatted price, e.g. `"$2,400"` or `"Custom"`. |
| `cadence` | `string?` | Cadence after the price, e.g. `"/ project"`. |
| `features` | `PricingFeature[]` | Feature rows. |
| `ctaLabel` | `string` | Button label. |
| `ctaHref` | `string?` | Button href. |
| `recommended` | `boolean?` | Highlights the card (Deep Teal + badge + lift). |
| `badge` | `string?` | Badge text on the recommended card. Defaults to `"Most popular"`. |

### `PricingFeature`

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Feature text. |
| `included` | `boolean?` | `false` renders a dimmed, struck-through row with a dash. Defaults to `true`. |

## Paste-in

**React:**

```tsx
import PricingTiers from "./PricingTiers";

export default function Page() {
  return <PricingTiers />;
}
```

Customize:

```tsx
<PricingTiers
  heading="Simple, scoped pricing"
  plans={[
    { id: "starter", name: "Starter", tagline: "Get online fast.", price: "$1,200", cadence: "/ project",
      ctaLabel: "Choose Starter", features: [{ label: "3 pages" }, { label: "Priority support", included: false }] },
    // ...recommended: true on the plan you want lifted
  ]}
/>
```

**HTML:** copy the markup inside `section.html` into your page. Ensure the three fonts above are loaded and Tailwind is available. No JavaScript is required for the section itself.

## Accessibility

- Section is labelled via `aria-labelledby` pointing at the heading.
- Decorative icons are `aria-hidden`; feature meaning is carried by the text (excluded rows use `line-through`, not color alone).
- CTAs are real `<a>` elements with visible `focus-visible` rings using brand colors against each card's surface.
- Fully responsive: single column on mobile, three columns from the `md` breakpoint with the recommended card lifted.

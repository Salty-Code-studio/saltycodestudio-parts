# Features Bento — saltycodestudio

Bento-style feature layout that mixes a large hero tile, a tall accent tile, and
small supporting cards into one cohesive three-column grid. Built on the brand
palette **"Sand & Surf"** (Warm Sand canvas, Deep Teal ink, a single Surf Coral
accent tile, Sky Blue supporting) with Space Grotesk display, JetBrains Mono
labels, and Inter body text.

- **Category:** features · **Tier:** showcase
- **Files:** `FeaturesBento.tsx` (React + Tailwind), `section.html` (plain HTML + Tailwind), `preview.html` (self-contained render)

## Preview

Open `preview.html` in any browser — it pulls Tailwind from the Play CDN and the
brand fonts from Google Fonts, and drops the HTML variant onto a small branded
page (nav + footer) so you can see it in context. No build step, no React.

## React variant — `<FeaturesBento />`

```tsx
import FeaturesBento from "./FeaturesBento";

export default function Page() {
  return <FeaturesBento />;
}
```

### Props

| Prop          | Type          | Default                                                       | Notes                                                            |
| ------------- | ------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- |
| `eyebrow`     | `string`      | `"WHY SALTYCODE"`                                             | Mono coral eyebrow above the title.                              |
| `title`       | `string`      | `"Everything you need to ship something that lasts"`          | Section heading (`h2`).                                          |
| `description` | `string`      | studio intro sentence                                         | Lead paragraph under the heading.                                |
| `tiles`       | `BentoTile[]` | 5 realistic feature tiles                                     | The bento cards. See shape below.                                |
| `ctaLabel`    | `string`      | `"See how we work"`                                           | Pill button label. Pass empty string to hide the CTA row.        |
| `ctaHref`     | `string`      | `"#process"`                                                  | Button target.                                                   |
| `className`   | `string`      | `""`                                                          | Extra classes on the `<section>`.                                |

### `BentoTile` shape

| Field    | Type                            | Notes                                                              |
| -------- | ------------------------------- | ------------------------------------------------------------------ |
| `id`     | `string`                        | Stable key; also used for `aria-labelledby`.                       |
| `kicker` | `string?`                       | Mono eyebrow on the tile, e.g. `"01 / SHIP"`.                      |
| `title`  | `string`                        | Tile heading.                                                      |
| `body`   | `string`                        | Supporting copy.                                                   |
| `icon`   | `ReactNode?`                    | Glyph (inline SVG inherits the tile text color). Falls back to a wave. |
| `span`   | `"sm" \| "lg" \| "tall"`        | `lg` spans 2 columns, `tall` spans 2 rows (md+). Default `sm`.     |
| `tone`   | `"sand" \| "ink" \| "accent"`   | `sand` light card, `ink` Deep Teal, `accent` Surf Coral. Default `sand`. |
| `stat`   | `string?`                       | Small mono stat pinned to the bottom of the tile.                 |

Keep `accent` (coral) to a single tile per view — brand discipline is one coral
highlight per screen.

## HTML variant — `section.html`

Copy the entire `<section>` block into any page that loads Tailwind (CDN or
build) and the three brand fonts. The grid is `md:grid-cols-3`; tile spans are
expressed with `md:col-span-2` / `md:row-span-2` so it collapses to a single
column on mobile. Self-contained — no JavaScript required.

## Accessibility

- `<section>` is labelled by the heading via `aria-labelledby`; each tile is an
  `<article>` labelled by its own title.
- Decorative blur washes and all icons are `aria-hidden`.
- The CTA uses a visible `focus-visible` outline in Deep Teal.
- Color pairings (teal-on-sand, sand-on-teal, ink-on-coral) meet WCAG AA contrast.

## License

MIT · `saltycodestudio-parts (original)`

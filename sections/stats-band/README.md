# Stats Band

A band of key metrics/numbers with labels on an accent background. Built with the
saltycodestudio **"Sand & Surf"** palette — a deep teal (`#0E3A40`) surface with
sand text (`#F2EBDD`), Sky Blue (`#4FA8C9`) accents, and a soft coral glow.
Category: `stats` · Tier: `practical`.

It ships in two forms:

- **`StatsBand.tsx`** — a typed React + Tailwind component with sensible defaults.
- **`section.html`** — the identical section as plain HTML + Tailwind utility
  classes, copy-pasteable into any page (no React).

`preview.html` renders the HTML variant on a full Sand & Surf page using the
Tailwind Play CDN — open it directly in a browser to see it in context.

## What it is

A centered eyebrow + heading + supporting line introduces a 4-up grid of metrics.
Each cell shows a large gradient number, a mono uppercase label, and a one-line
detail. The grid uses hairline dividers (`gap-px`) over an accent surface and
collapses gracefully: 4 columns on desktop, 2 on tablet, 1 on mobile.

## Props (`StatsBand.tsx`)

| Prop          | Type     | Default                                                            | Description                                  |
| ------------- | -------- | ----------------------------------------------------------------- | -------------------------------------------- |
| `eyebrow`     | `string` | `"By the numbers"`                                                | Small kicker above the heading.              |
| `heading`     | `string` | `"Proof in the shipping log"`                                     | Main heading for the band.                   |
| `description` | `string` | `"Clean code, warm coast — and a track record…"`                  | Supporting sentence (omit/empty to hide).    |
| `stats`       | `Stat[]` | 4 realistic studio metrics                                        | Metrics to display (3–4 recommended).        |

### `Stat`

| Field    | Type     | Required | Description                                  |
| -------- | -------- | -------- | -------------------------------------------- |
| `value`  | `string` | yes      | Headline number/metric, e.g. `"120+"`.       |
| `label`  | `string` | yes      | Short label describing the metric.           |
| `detail` | `string` | no       | Optional one-line detail under the label.    |

## Paste-in instructions

### React variant

1. Copy `StatsBand.tsx` into your components folder.
2. Ensure Tailwind CSS is configured in your project.
3. Import and render:

   ```tsx
   import StatsBand from "./StatsBand";

   export default function Page() {
     return <StatsBand heading="Proof in the shipping log" />;
   }
   ```

   Override any prop to customize. Passing your own `stats` array swaps the
   metrics; pass an empty `description` (`description=""`) to hide the supporting line.

### HTML variant

1. Copy the markup inside `section.html` into your page where you want the band.
2. Make sure Tailwind is available on the page (build pipeline or the Play CDN:
   `<script src="https://cdn.tailwindcss.com"></script>`).
3. Edit the values, labels, and details inline.

No JavaScript is required for this section — it is purely presentational.

## Accessibility

- Wrapped in a `<section>` labelled by the heading via `aria-labelledby`.
- Metrics use a `<dl>` with `<dt>`/`<dd>` pairs; the visible label is `aria-hidden`
  and the screen-reader name lives in a visually-hidden `<dt>` so assistive tech
  reads "Sites shipped: 120+" cleanly without duplication.
- Decorative glow blobs are `aria-hidden`.
- Color contrast of sand text on the deep-teal surface meets WCAG AA.

## License

MIT — `saltycodestudio-parts (original)`.

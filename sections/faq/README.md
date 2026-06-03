# FAQ Accordion

An accessible FAQ section with a smooth open/close. Rows are real `<button>`
disclosure triggers wired with `aria-expanded` / `aria-controls`; each answer
panel is a `role="region"` labelled by its trigger. The reveal animates via a
GPU-light CSS grid-rows transition (`0fr → 1fr`) — no measured heights, no
layout thrash — and collapses to no motion under `prefers-reduced-motion`.
Collapsed answers are marked `inert` + `aria-hidden`, so they stay out of the
tab order and off the accessibility tree.

Part of **saltycodestudio-parts**. Brand palette: **Sand & Surf** (sand/cream
surfaces, ink text, ocean-teal accents).

## Variants

- **`Faq.tsx`** — React + Tailwind component, typed props, sensible defaults.
- **`section.html`** — the same section as plain HTML + Tailwind utility
  classes, with a small vanilla `<script>` for the toggle behaviour. No React.
- **`preview.html`** — a standalone page (Tailwind Play CDN) that renders the
  HTML variant in context. Open it directly in a browser.

## React props (`Faq.tsx`)

| Prop          | Type                       | Default                          | Description                                                              |
| ------------- | -------------------------- | -------------------------------- | ------------------------------------------------------------------------ |
| `eyebrow`     | `string`                   | `"Questions"`                    | Small label above the heading. Empty string hides it.                    |
| `heading`     | `string`                   | `"The things people ask before we start"` | Main section heading.                                           |
| `intro`       | `string`                   | short supporting line            | Supporting copy under the heading. Empty string hides it.                |
| `items`       | `FaqItem[]`                | 6 realistic studio Q&As          | The questions and answers. `answer` accepts text or JSX.                 |
| `mode`        | `"single" \| "multiple"`   | `"single"`                       | `single` keeps one panel open; `multiple` allows several at once.        |
| `defaultOpen` | `number`                   | `0`                              | Index open on first render. Use `-1` to start fully collapsed.           |
| `footnote`    | `React.ReactNode`          | "Send us a note" prompt          | Contact prompt below the list. Pass `null` to hide.                      |
| `className`   | `string`                   | `""`                             | Extra classes on the outer `<section>`.                                  |

`FaqItem` is `{ question: string; answer: React.ReactNode }`.

> The collapsed panel uses the `inert` attribute. Type support landed in React
> 19 / `@types/react` 19; on older setups either upgrade the types or cast the
> prop (`{...{ inert: '' }}`).

### Use it

```tsx
import { Faq } from "./Faq";

export default function Page() {
  return (
    <Faq
      heading="Frequently asked"
      mode="multiple"
      items={[
        { question: "Do you offer retainers?", answer: "Yes — light monthly plans for tweaks and new pages." },
        { question: "Where are you based?", answer: "Salt in the air, fiber in the wall. Remote-first, island-rooted." },
      ]}
    />
  );
}
```

## HTML variant (`section.html`)

1. Paste the `<section>` markup where you want the FAQ.
2. Paste the `<script>` block **once** per page (near `</body>`). It uses event
   delegation across every `[data-faq]` group, so multiple FAQ blocks share one
   script.
3. Set `data-faq-mode="multiple"` on the `[data-faq]` wrapper to allow several
   panels open at once (default is single-open).
4. Tailwind must be present (build pipeline or the Play CDN, as in
   `preview.html`).

Each panel's open/closed state lives in two places that the script keeps in
sync: the trigger's `aria-expanded` and the panel's `grid-template-rows`
(`1fr` open / `0fr` closed). To pre-open a different item, set
`aria-expanded="true"` and `[grid-template-rows:1fr]` on that pair and remove
its inner `inert` / `aria-hidden`.

## Accessibility notes

- Triggers are buttons inside `<h3>` headings — screen-reader users get both a
  navigable heading and an operable control.
- `aria-controls` / `aria-labelledby` connect each trigger to its panel both ways.
- Focus ring is visible (`focus-visible:ring`) and offset against the sand canvas.
- Motion is disabled for users who request reduced motion.

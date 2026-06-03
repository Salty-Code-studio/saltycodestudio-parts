# CTA Band

A full-width call-to-action band for the **saltycodestudio** "Sand & Surf" system. Deep-teal gradient canvas, a mono eyebrow, a confident headline, supporting subcopy, one or two buttons (solid coral primary + outlined sand secondary), and an optional reassurance footnote. Soft sky-blue and coral glows plus a thin wave hairline keep it premium without getting busy.

Two ready-to-use variants:

- **`CtaBand.tsx`** — typed React + Tailwind component with sensible defaults.
- **`section.html`** — the same markup in plain HTML + Tailwind utility classes, copy-pasteable into any page.
- **`preview.html`** — a self-contained page (Tailwind Play CDN, brand fonts) that renders the HTML variant in context. Open it directly in a browser.

## Preview

```bash
open preview.html
```

## React props (`CtaBand.tsx`)

| Prop        | Type                                   | Default                                                                 | Notes |
|-------------|----------------------------------------|-------------------------------------------------------------------------|-------|
| `eyebrow`   | `string`                               | `"~< Ready when you are"`                                               | Mono uppercase label above the headline. Pass `""` to hide. |
| `headline`  | `string`                               | `"Let's ship something clean."`                                         | Main heading. Keep it short. |
| `subcopy`   | `string`                               | `"Tell us what you're building…"`                                       | Supporting line. Pass `""` to hide. |
| `actions`   | `CtaBandAction[]`                      | Book a build call (primary) + See recent work (secondary)               | One or two buttons. First should be the primary action. |
| `footnote`  | `string`                               | `"Replies within one business day · Based in Bonaire…"`                 | Reassurance line under the buttons. Pass `""` to hide. |
| `aside`     | `ReactNode`                            | `undefined`                                                             | Optional right-side slot on large screens (e.g. an inline email form). |
| `ariaLabel` | `string`                               | `"Get in touch"`                                                        | Accessible label for the `<section>` landmark. |

`CtaBandAction`:

```ts
interface CtaBandAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary"; // primary = solid coral, secondary = outlined sand
}
```

### Example

```tsx
import CtaBand from "./CtaBand";

export default function Page() {
  return (
    <CtaBand
      eyebrow="~< Let's talk"
      headline="Your next site, built clean."
      subcopy="Send the brief. We'll reply with scope, timeline, and a fixed quote."
      actions={[
        { label: "Start a project", href: "/contact", variant: "primary" },
        { label: "View pricing", href: "/pricing", variant: "secondary" },
      ]}
      footnote="No retainer required · MIT-friendly code you own"
    />
  );
}
```

## Paste-in (HTML variant)

1. Copy the contents of **`section.html`** into your page where the band should appear.
2. Make sure Tailwind is available (Play CDN or a compiled build).
3. For the full brand feel, load the fonts and map the `.font-display` / `.font-mono` classes:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  .font-display { font-family: "Space Grotesk", system-ui, sans-serif; }
  .font-mono { font-family: "JetBrains Mono", ui-monospace, monospace; }
</style>
```

Edit the headline, subcopy, and the two `<a>` button labels/`href`s in place.

## Brand notes — "Sand & Surf"

- Canvas: Deep Teal `#0E3A40` → Driftwood Ink `#1C2B2E` gradient (the one place teal goes full-bleed).
- Primary CTA: Surf Coral `#FF6F59` — the single accent. Don't add a second coral field.
- Secondary CTA: outlined Warm Sand `#F2EBDD`.
- Glows: Sky Blue `#4FA8C9` (top-left) and Surf Coral (bottom-right), both at low opacity.
- Type: Space Grotesk headline, Inter body, JetBrains Mono eyebrow (UPPERCASE, letterspaced).

## License

MIT · `saltycodestudio-parts (original)`

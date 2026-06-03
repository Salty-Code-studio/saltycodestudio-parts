# Hero Centered

A centered hero section in the saltycodestudio **"Sand & Surf"** palette: a monospace
eyebrow pill, an oversized display headline (with one coral-highlighted phrase), a
supporting lede, dual CTAs (coral primary + ghost secondary), a small reassurance
note, and a quiet trust strip — all sitting on a soft sand→surf gradient backdrop
with coral/sky glow blobs and a faintly masked grid texture.

- **Category:** hero · **Tier:** showcase
- **Deps:** React + Tailwind CSS (for the `.tsx`); the HTML variant needs only Tailwind
- **Files:** `HeroCentered.tsx`, `section.html`, `preview.html`, `part.json`, `README.md`

---

## Preview

Open **`preview.html`** in any browser. It is fully self-contained — it loads the
Tailwind Play CDN, wires the Sand & Surf tokens into `tailwind.config`, pulls the
brand fonts (Space Grotesk / Inter / JetBrains Mono), and drops the section onto a
sample page with a minimal brand nav. No build step, no React.

---

## React variant — `HeroCentered.tsx`

```tsx
import HeroCentered from "./HeroCentered";

export default function Page() {
  return (
    <HeroCentered
      eyebrow="Web studio · Bonaire → worldwide"
      headline={<>Ship a coastal-calm site that <span className="text-coral">actually converts</span>.</>}
      subheadline="We design and build fast, accessible sites for brands that want to feel premium."
      primaryCta={{ label: "Start a project", href: "#contact" }}
      secondaryCta={{ label: "See the work", href: "#work" }}
      note="Free 20-minute fit call · No pitch decks, just a plan."
      trustedBy={["Dushi Club", "PLAYA", "United Liquors", "ORIGEN", "Reef & Co."]}
    />
  );
}
```

Requires the saltycodestudio Tailwind preset (or equivalent tokens) so that the
`sand`, `teal`, `coral`, `sky`, `ink`, `shadow-coral`, `rounded-pill`, `font-display`,
and `font-mono` utilities resolve.

### Props

| Prop           | Type                                                | Default                                                                 | Description                                                                 |
| -------------- | --------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `eyebrow`      | `string`                                            | `"Web studio · Bonaire → worldwide"`                                    | Small letterspaced kicker above the headline. Pass `""` to hide.            |
| `headline`     | `ReactNode`                                         | Branded two-line headline with a coral phrase                           | The oversized headline; a node so you can highlight part of it.             |
| `subheadline`  | `string`                                            | Studio positioning sentence                                            | Supporting lede under the headline. Pass `""` to hide.                      |
| `primaryCta`   | `{ label: string; href: string; external?: boolean }` | `{ label: "Start a project", href: "#contact" }`                        | Coral primary button. Pass `undefined` to hide.                            |
| `secondaryCta` | `{ label: string; href: string; external?: boolean }` | `{ label: "See the work", href: "#work" }`                              | Ghost secondary button. Pass `undefined` to hide.                          |
| `note`         | `string`                                            | `"Free 20-minute fit call · No pitch decks, just a plan."`              | Tiny reassurance line under the buttons. Pass `""` to hide.                 |
| `trustedBy`    | `string[]`                                           | `["Dushi Club", "PLAYA", "United Liquors", "ORIGEN", "Reef & Co."]`     | Trust-strip labels. Pass `[]` to hide the strip.                            |
| `className`    | `string`                                            | `""`                                                                    | Extra classes appended to the outer `<section>`.                            |

The `external` flag on a CTA adds `target="_blank"` and `rel="noopener noreferrer"`.

---

## HTML variant — `section.html`

Paste the markup as the first block inside your `<main>`. It is plain HTML +
Tailwind utility classes (no JavaScript) and uses the same brand utilities as the
React version. Edit the copy, the two `<a>` hrefs, and the trust-strip `<li>` items
inline. To match the design exactly, ensure your Tailwind config defines the Sand &
Surf colors and fonts (see `preview.html` for a drop-in `tailwind.config` block, or
use the shared `foundations/tailwind.preset.js`).

---

## Accessibility & responsiveness

- Single `<h1>` wired to the section via `aria-labelledby`; decorative backdrop and
  icons are `aria-hidden`.
- CTAs are real anchors with visible `focus-visible` outlines (coral / teal).
- Type, padding, and the headline line-break scale fluidly from mobile to `xl`;
  CTAs stack full-width on small screens and sit inline from `sm` up.
- `text-balance` / `text-pretty` keep the headline and lede from awkward wrapping.

**License:** MIT · **Source:** saltycodestudio-parts (original)

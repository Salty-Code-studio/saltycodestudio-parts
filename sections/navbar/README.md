# Navbar

Responsive sticky navbar for **saltycodestudio**, in the "Sand & Surf" palette.
Warm-sand canvas, deep-teal ink and `~<` logomark, a single surf-coral CTA, and an
animated hamburger that opens a full-width mobile sheet. The header is transparent at
the top of the page and gains a blurred sand background + hairline border once you
scroll past the hero edge.

- **Category:** nav · **Tier:** practical
- **Files:** `Navbar.tsx` (React + Tailwind), `section.html` (plain HTML + Tailwind), `preview.html` (self-contained demo)

## Preview

Open `preview.html` in any browser. It uses the Tailwind Play CDN and brand fonts, so
no build step is needed. Resize below `md` (768px) to see the hamburger + mobile sheet,
and scroll to watch the scroll-elevation kick in.

## Features

- Sticky `top-0` header with a smooth transparent → frosted-sand transition on scroll.
- Desktop link row with an animated coral underline on hover.
- Secondary text link ("Sign in") + primary coral CTA ("Start a project").
- Animated 3-bar hamburger that morphs into an X.
- Mobile sheet with a tap-to-dismiss backdrop, body-scroll lock, and Escape-to-close.
- Accessible: `aria-expanded` / `aria-controls`, labelled toggle, visible focus rings,
  `aria-label="Primary"` on the `<nav>`.

## React props (`Navbar.tsx`)

| Prop             | Type        | Default                                                                 | Description                                  |
| ---------------- | ----------- | ----------------------------------------------------------------------- | -------------------------------------------- |
| `brand`          | `string`    | `"saltycodestudio"`                                                     | Wordmark next to the `~<` logomark.          |
| `links`          | `NavLink[]` | Work / Services / Process / Pricing                                     | Primary nav links (`{ label, href }`).       |
| `ctaLabel`       | `string`    | `"Start a project"`                                                     | CTA button label.                            |
| `ctaHref`        | `string`    | `"#contact"`                                                            | CTA button href.                             |
| `secondaryLabel` | `string`    | `"Sign in"`                                                             | Secondary text link label.                   |
| `secondaryHref`  | `string`    | `"#signin"`                                                             | Secondary text link href.                    |

`NavLink` is `{ label: string; href: string }`.

### Use it (React)

```tsx
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar
        links={[
          { label: "Work", href: "/work" },
          { label: "Services", href: "/services" },
          { label: "Pricing", href: "/pricing" },
        ]}
        ctaLabel="Book a call"
        ctaHref="/contact"
      />
      <main>{children}</main>
    </>
  );
}
```

Requires Tailwind CSS. For the brand fonts, load Space Grotesk / JetBrains Mono / Inter
(see the brand guidelines) and the `font-[var(--scs-display,…)]` fallback resolves to
Space Grotesk automatically.

### Use it (plain HTML)

Paste the entire contents of `section.html` — including the trailing `<script>` — at the
top of your `<body>`. It needs Tailwind on the page (Play CDN or a build). The script
wires up the hamburger toggle, the hamburger-to-X animation, scroll elevation, the
backdrop, and Escape-to-close, all scoped to `#scs-navbar`. Include it once per page.

## License

MIT · saltycodestudio-parts (original).

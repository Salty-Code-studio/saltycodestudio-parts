# Footer

Multi-column site footer for **saltycodestudio**, in the "Sand & Surf" palette.
A deep-teal canvas with soft coral/sky glows: a brand block with the `~<` logomark,
a newsletter signup, two or more link columns, social icon buttons, and a
legal/sign-off bottom row. Drops in at the bottom of any page.

- **Category:** footer · **Tier:** practical
- **Files:** `Footer.tsx` (React + Tailwind), `section.html` (plain HTML + Tailwind), `preview.html` (self-contained demo)

## Preview

Open `preview.html` in any browser. It uses the Tailwind Play CDN and brand fonts, so
no build step is needed. The page has a bit of content above the footer so it settles
at the bottom of the viewport. Submit the newsletter field to see the success state.

## Features

- Brand block: `~<` coral logomark, wordmark, one-line studio blurb.
- Inline newsletter signup with a coral Subscribe button and a reassurance footnote.
- Two or more responsive link columns (2-up on mobile, 3-up from `sm`).
- Social icon buttons (GitHub / X / LinkedIn / Instagram / Dribbble / RSS glyphs built in).
- Legal/utility row with auto-prefixed copyright year, legal links, and a mono sign-off line.
- Accessible: `contentinfo` landmark with `aria-label`, labelled email field, `role="status"`
  on the success message, labelled social buttons, and visible focus rings throughout.

## React props (`Footer.tsx`)

| Prop                    | Type                     | Default                                  | Description                                                            |
| ----------------------- | ------------------------ | ---------------------------------------- | ---------------------------------------------------------------------- |
| `brand`                 | `string`                 | `"saltycodestudio"`                      | Studio / product name in the brand block.                              |
| `mark`                  | `string`                 | `"~<"`                                   | Logomark text / short symbol.                                          |
| `blurb`                 | `string`                 | studio pitch                             | One-line pitch under the wordmark.                                     |
| `newsletterTitle`       | `string`                 | `"Notes from the shore"`                 | Heading above the newsletter input.                                    |
| `newsletterCopy`        | `string`                 | supporting copy                          | Supporting line above the input.                                       |
| `newsletterPlaceholder` | `string`                 | `"you@studio.com"`                       | Placeholder for the email field.                                       |
| `newsletterFootnote`    | `string`                 | unsubscribe line                         | Reassurance line under the input.                                      |
| `onSubscribe`           | `(email: string) => void`| `undefined`                              | Called with the submitted email. If omitted, shows a local success state. |
| `groups`                | `FooterLinkGroup[]`      | Studio / Build with us / Resources       | Link columns.                                                          |
| `socials`               | `FooterSocial[]`         | GitHub / X / Dribbble / LinkedIn         | Social profiles rendered as icon buttons.                             |
| `copyrightName`         | `string`                 | `"saltycodestudio"`                      | Copyright owner (year is prefixed automatically).                      |
| `legalLinks`            | `FooterLink[]`           | Privacy / Terms / Cookies                | Legal / utility links in the bottom row.                              |
| `signoff`               | `string`                 | Bonaire sign-off line                    | Small mono line at the very bottom.                                    |
| `ariaLabel`             | `string`                 | `"Site footer"`                          | Accessible label for the `contentinfo` landmark.                       |

Supporting types:

```ts
type FooterLink = { label: string; href: string };
type FooterLinkGroup = { title: string; links: FooterLink[] };
type FooterSocial = {
  label: string;
  href: string;
  icon: "github" | "x" | "linkedin" | "instagram" | "dribbble" | "rss";
};
```

### Use it (React)

```tsx
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Footer
        groups={[
          {
            title: "Studio",
            links: [
              { label: "Work", href: "/work" },
              { label: "About", href: "/about" },
            ],
          },
        ]}
        socials={[{ label: "GitHub", href: "https://github.com/scs", icon: "github" }]}
        onSubscribe={(email) => subscribeToList(email)}
      />
    </>
  );
}
```

Requires Tailwind CSS. For the brand fonts, load Space Grotesk / JetBrains Mono / Inter
(see the brand guidelines); the `font-[var(--font-display,…)]` / `font-[var(--font-mono,…)]`
fallbacks resolve to your defaults automatically. With no `onSubscribe`, the form swaps
to a local "subscribed" confirmation on submit.

### Use it (plain HTML)

Paste the entire contents of `section.html` — including the trailing `<script>` — at the
end of your `<body>`. It needs Tailwind on the page (Play CDN or a build). The script
listens for the newsletter form submit, validates the email, then hides the form and
reveals the `[data-footer-newsletter-success]` message. Include it once per page. Edit
the link/copyright/sign-off text directly in the markup.

## License

MIT · saltycodestudio-parts (original).

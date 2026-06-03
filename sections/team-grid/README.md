# Team Grid

A responsive grid of team members — each card carries a portrait, name, role,
a short bio, and a row of social/contact links. Built in the "Sand & Surf"
palette: sand/cream backgrounds, deep-teal ink, bright-teal role labels, and a
coral eyebrow. Cards lift gently, brighten to white, and the portrait zooms on
hover/focus.

## Files

- `TeamGrid.tsx` — React + Tailwind component (typed props, sensible defaults, inline SVG social icons).
- `section.html` — the same section as plain HTML + Tailwind utility classes (no React).
- `preview.html` — a self-contained page (Tailwind Play CDN) that renders the HTML variant on a brand page with a minimal nav + footer. Open it directly in a browser.

## React props (`TeamGrid.tsx`)

| Prop          | Type           | Default                                  | Description                                               |
| ------------- | -------------- | ---------------------------------------- | --------------------------------------------------------- |
| `eyebrow`     | `string`       | `"The crew"`                             | Small uppercase coral label above the heading. Hidden if empty. |
| `heading`     | `string`       | `"Small studio, senior hands"`           | Section heading.                                          |
| `description` | `string`       | `"No account managers…"`                 | Supporting paragraph under the heading. Hidden if empty.  |
| `members`     | `TeamMember[]` | 4 built-in members                       | The people to display (3, 4, or a multiple works best).   |

### `TeamMember`

```ts
type TeamMember = {
  name: string;            // full name shown under the photo
  role: string;            // role / title shown under the name
  bio?: string;            // optional one-line bio
  photo?: string;          // square-ish portrait URL; falls back to a monogram when omitted
  socials?: TeamSocial[];  // optional row of icon links
};

type TeamSocial = {
  network: "x" | "linkedin" | "github" | "dribbble" | "email" | "website";
  href: string;            // e.g. "https://x.com/handle" or "mailto:name@studio.com"
};
```

When `photo` is omitted, the card renders a deterministic warm-tone monogram
(the member's initials) instead, so a missing image never breaks the layout.

### Example

```tsx
import TeamGrid, { TeamMember } from "./TeamGrid";

const members: TeamMember[] = [
  {
    name: "Ada Lovelace",
    role: "Principal Engineer",
    bio: "Writes the algorithms everyone else builds on.",
    photo: "https://example.com/ada.jpg",
    socials: [
      { network: "github", href: "https://github.com/" },
      { network: "email", href: "mailto:ada@studio.com" },
    ],
  },
  // …add two or three more
];

export default function Page() {
  return (
    <TeamGrid
      eyebrow="Who you'll work with"
      heading="Meet the team"
      members={members}
    />
  );
}
```

## Paste-in instructions

### HTML variant (any stack with Tailwind)

1. Make sure Tailwind is available on the page (build pipeline or the Play CDN
   `https://cdn.tailwindcss.com` for quick tests).
2. Copy the `<section>…</section>` block from `section.html` into your page.
3. Replace each `<li>` member: swap the `<img src>` + `alt`, the name, the role,
   the bio, and the social `<a>` links. Add or remove `<li>` blocks to change the
   member count — the grid reflows from 1 → 2 → 4 columns automatically.

### React variant

1. Copy `TeamGrid.tsx` into your components folder.
2. Ensure Tailwind is configured in your project.
3. Import and render `<TeamGrid />`, passing `members` (and optionally `eyebrow`,
   `heading`, `description`) to override the defaults.

## Accessibility & notes

- The grid uses a semantic `<ul role="list">` of `<li>` items; each card is an `<article>` with an `<h3>` name.
- Social links carry descriptive `aria-label`s (e.g. "Marisol Ferreira on LinkedIn"); the SVG icons are `aria-hidden`.
- External links open in a new tab with `rel="noopener noreferrer"`; `email` links open in place with no `target`.
- Each link has a visible `focus-visible` outline in bright teal for keyboard users.
- `font-display` and `font-mono` are expected from your Tailwind theme; if they are not configured they fall back to your default sans/mono stacks without breaking layout.
- Colors meet contrast on the sand/cream backgrounds (ink `#1C2B2E`, deep teal `#0E3A40`).

## License

MIT · saltycodestudio-parts (original)

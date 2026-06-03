# Card

A versatile, composable content surface built from small slots — `CardMedia`,
`CardHeader`, `CardBody`, and `CardFooter` — wrapped by a `Card` root. Three
surface variants on the Sand & Surf palette, an optional hover-lift (with a
gentle media zoom), and a link mode that turns the whole card into one
keyboard-reachable anchor with a visible focus ring. Use it for article
previews, product tiles, dashboard panels, or any boxed group of content.

## Anatomy

```tsx
<Card hoverLift href="/post">
  <CardMedia src="…" alt="…" ratio="16/9" overlay={<Badge>New</Badge>} />
  <CardHeader eyebrow="Field notes" title="…" subtitle="…" action={<MenuButton />} />
  <CardBody>Free-form content / paragraphs.</CardBody>
  <CardFooter>Actions, meta, buttons.</CardFooter>
</Card>
```

All slots are optional and order-independent — compose only what you need.

## `Card` props

| Prop        | Type                              | Default   | Description |
| ----------- | --------------------------------- | --------- | ----------- |
| `variant`   | `"solid" \| "soft" \| "outline"` | `"solid"` | Surface treatment. `solid` = cream panel, `soft` = sand tint, `outline` = transparent + ring. |
| `hoverLift` | `boolean`                         | `false`   | Raises the card and deepens its shadow on hover/focus; zooms any `CardMedia`. Honors `prefers-reduced-motion`. |
| `href`      | `string`                          | —         | Renders the root as an `<a>` so the entire card is one focusable link. |
| `external`  | `boolean`                         | `false`   | With `href`, opens in a new tab and adds `rel="noopener noreferrer"`. |
| `className` | `string`                          | —         | Extra classes merged onto the root. |
| `children`  | `React.ReactNode`                 | —         | The composed slots. |

All other `div` (or `a`, when `href` is set) attributes are forwarded, and a
`ref` is forwarded to the root element.

## `CardMedia` props

| Prop      | Type                                   | Default   | Description |
| --------- | -------------------------------------- | --------- | ----------- |
| `src`     | `string`                               | —         | Image source (required). |
| `alt`     | `string`                               | —         | Alt text (required). Pass `""` only for decorative imagery. |
| `ratio`   | `"16/9" \| "4/3" \| "1/1" \| "3/2"`  | `"16/9"` | Aspect ratio of the media frame. |
| `overlay` | `React.ReactNode`                      | —         | Content pinned top-left over the image (e.g. a badge). |

Forwards remaining `<img>` attributes. The image is lazy-loaded and scales up
subtly when the parent card is hovered (disabled under reduced motion).

## `CardHeader` props

| Prop       | Type                          | Default | Description |
| ---------- | ----------------------------- | ------- | ----------- |
| `eyebrow`  | `React.ReactNode`             | —       | Teal kicker above the title. |
| `title`    | `React.ReactNode`             | —       | Title text. |
| `subtitle` | `React.ReactNode`             | —       | Supporting line under the title. |
| `action`   | `React.ReactNode`             | —       | Top-right slot (menu button, badge…). |
| `as`       | `"h2" \| "h3" \| "h4"`      | `"h3"` | Heading element for the title (semantics). |
| `padding`  | `"none" \| "sm" \| "md" \| "lg"` | `"lg"` | Inner padding. |

## `CardBody` / `CardFooter` props

Both accept `padding` (`"none" \| "sm" \| "md" \| "lg"`, default `"lg"`) and
forward `div` attributes. `CardFooter` also takes `divided` (`boolean`, default
`true`) to draw a hairline rule above it, and pins itself to the bottom so equal
buttons line up across a grid of cards.

## Accessibility

- In link mode (`href`) the root is a single `<a>`, so the whole card is one Tab
  stop with a `focus-visible` teal ring and offset — keyboard and pointer users
  reach the same target. Keep nested interactive elements out of link cards, or
  use a button/anchor inside the footer instead of `href`.
- `CardHeader` renders a real heading element (`as`) so titles join the document
  outline; choose the level that fits your page.
- `CardMedia` requires `alt`; the zoom and lift effects are purely decorative and
  fully disabled under `prefers-reduced-motion`.

## Variants & states (all shown in `preview.html`)

- Surfaces: `solid`, `soft`, `outline`
- Media card with overlay badge + hover lift/zoom
- Horizontal (media-left) layout
- Stat / metric card with no media
- Full link card (Tab to it and watch the focus ring)
- Footer with divided actions

## Dependencies

- `react`
- `tailwindcss`

## Drop-in

Copy `Card.tsx` into your components folder. It is a client component
(`"use client"` is already present). Import the root and the slots you need:

```tsx
import Card, { CardMedia, CardHeader, CardBody, CardFooter } from "@/components/Card";

export default function PostCard() {
  return (
    <Card hoverLift href="/blog/sand-and-surf">
      <CardMedia src="/cover.jpg" alt="Turquoise water over a sandbar" />
      <CardHeader eyebrow="Field notes" title="Designing for the shoreline" />
      <CardBody>How the Sand &amp; Surf palette holds up in bright sun.</CardBody>
      <CardFooter>
        <span className="text-xs text-[#4a5d66]">5 min read</span>
      </CardFooter>
    </Card>
  );
}
```

Ensure Tailwind scans this file so its classes are generated.

## License

MIT · saltycodestudio-parts (original)

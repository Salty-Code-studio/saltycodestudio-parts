# Animated Text Gradient

A headline filled with a slowly drifting multi-stop gradient — a premium,
"living-color" title that runs on pure CSS. No JavaScript, no canvas.

## How it works

A `linear-gradient` is set as the element's `background-image`, the background
is clipped to the glyph shapes with `background-clip: text` (plus the
`-webkit-` prefix), and the real text fill is made transparent so the gradient
shows through. An oversized `background-size` (280%) gives the gradient room,
and `@keyframes` slide `background-position` to create a seamless drift. The
last color stop repeats the first, so the loop has no visible seam.

## Dependencies

None. This is a native CSS technique.

## Usage

1. Copy `styles.css` into your stylesheet (or import it).
2. Add the class to any heading:

```html
<h1 class="animated-gradient-text">Living headlines</h1>
```

Tune it inline or in CSS via custom properties:

```html
<h1 class="animated-gradient-text" style="--atg-duration: 5s; --atg-angle: 70deg;">
  Faster drift
</h1>
```

| Property         | Default                          | What it does                          |
| ---------------- | -------------------------------- | ------------------------------------- |
| `--atg-stops`    | teal → surf → deep → surf → teal | Comma-separated gradient color stops  |
| `--atg-angle`    | `100deg`                         | Gradient angle                        |
| `--atg-size`     | `280%`                           | Horizontal background size (the room) |
| `--atg-duration` | `9s`                             | One full drift cycle                  |

Use the `animated-gradient-text--sand` modifier for the warm gold-into-ocean
variant.

## Accessibility

Respects `prefers-reduced-motion`: when a visitor prefers reduced motion the
gradient is shown but held still (no animation).

> Note: `background-clip: text` requires text to be readable for legibility —
> keep enough contrast between the gradient stops and the background.

## Source / inspiration

Technique from web.dev — "Speedy CSS Tip: Animated gradient text" by Adam
Argyle: https://web.dev/articles/speedy-css-tip-animated-gradient-text
The article content is under CC-BY 4.0; the underlying technique is native CSS.
Reimplemented cleanly here for the Sand &amp; Surf system.

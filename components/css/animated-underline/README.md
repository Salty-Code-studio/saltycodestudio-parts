# Sliding Underline Link

A link underline that **wipes in on hover and focus** and — crucially —
**wraps correctly across multiple lines**. It uses an animated
`background-size` on a `linear-gradient` "underline" rather than a `transform`
on a pseudo-element. The transform approach (`scaleX`) breaks across line
breaks and ignores `:focus-visible`; the background approach follows the text
flow naturally and is keyboard-accessible out of the box.

## Why background-size, not scaleX

- **Multi-line aware** — a `::after` bar with `scaleX(0)` only underlines the
  first line box. The gradient background paints under *every* wrapped line.
- **Keyboard accessible** — the same wipe fires on `:focus-visible`, so tab
  users get the affordance too.
- **`currentColor`** — the bar always matches the text color, even if the text
  color itself animates on hover.
- **Reduced motion** — the wipe collapses to ~1ms under
  `prefers-reduced-motion: reduce`.

## Dependencies

None. Plain CSS, no build step.

## Files

- `styles.css` — the canonical, copy-paste stylesheet.
- `index.html` — markup snippets showing each variant.
- `preview.html` — standalone, openable demo on the Sand & Surf palette.

## Paste-in instructions

1. Copy `styles.css` into your stylesheet (or import it).
2. Add the `su-link` class to any anchor:

   ```html
   <a class="su-link" href="/notes">Read the field notes</a>
   ```

3. Tune per instance with custom properties:

   ```html
   <a class="su-link" style="--su-color:#2ec3c3; --su-thickness:3px" href="#">
     Surf-accent link
   </a>
   ```

4. Or reach for a modifier class:

   | Modifier              | Effect                                    |
   | --------------------- | ----------------------------------------- |
   | `su-link--reverse`    | Underline wipes in from the right.        |
   | `su-link--bold`       | Thicker, deep-teal bar; bumps font-weight.|
   | `su-link--retract`    | Always underlined; retracts on hover.     |

### Custom properties

| Property          | Default                          | Purpose                  |
| ----------------- | -------------------------------- | ------------------------ |
| `--su-color`      | `#1f8a8a`                        | Text + underline color   |
| `--su-thickness`  | `2px`                            | Underline height         |
| `--su-duration`   | `320ms`                          | Wipe duration            |
| `--su-ease`       | `cubic-bezier(0.65,0,0.35,1)`    | Wipe easing              |

## Source / inspiration

Reimplemented from the technique described in
**[CSS { In Real Life } — Animating Underlines](https://css-irl.info/animating-underlines/)**
by Michelle Barker. Educational snippet, reimplemented cleanly in our own code
for the Sand & Surf kit.

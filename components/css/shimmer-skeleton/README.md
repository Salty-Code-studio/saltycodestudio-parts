# Shimmer Skeleton

Loading placeholder blocks with a light sweep that travels across each block —
the classic "content is loading" shimmer. A moving `linear-gradient` background
position does the work. Pure CSS.

## Paste-in

1. Copy `styles.css`.
2. Compose placeholders to mirror your real content's layout. Each block is
   `.scs-skeleton` plus a shape helper and an optional width helper:

```html
<div class="scs-skeleton scs-skeleton--thumb"></div>
<div class="scs-skeleton scs-skeleton--title scs-skeleton--w75"></div>
<div class="scs-skeleton scs-skeleton--text scs-skeleton--w90"></div>
```

## Helpers

- Shapes: `--text`, `--title`, `--avatar`, `--thumb` (16:9), `--btn`.
- Widths: `--w90`, `--w75`, `--w60`, `--w40`.

## Customize

- Colors: set `--scs-skel-base` and `--scs-skel-sheen` (defaults are warm sand /
  cream). For dark UIs use a dark base with a slightly lighter sheen.
- Speed: change the `1.4s` in the animation shorthand.

## Notes

- Swap the skeleton markup for real content once data loads (any framework /
  vanilla toggle).
- Honors `prefers-reduced-motion` (shows a static placeholder).

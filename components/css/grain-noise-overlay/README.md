# Grain / Noise Overlay

A fine film-grain texture you drop onto any section to kill the flat, plastic
look of solid colors and gradients. The grain is an inline SVG `feTurbulence`
noise encoded as a data-uri — no image files, no JS.

## Paste-in

1. Copy `styles.css`.
2. Add `scs-grain` to the section you want textured:

```html
<section class="scs-grain">
  <!-- your content -->
</section>
```

## Variants

- `scs-grain--film` — heavier grain with a `soft-light` blend (vintage look).
- `scs-grain--animated` — subtle per-frame flicker for a moving-film feel.

```html
<section class="scs-grain scs-grain--animated"> ... </section>
```

## Notes

- The grain is painted on `::after` with `pointer-events: none`, so it never
  blocks clicks.
- Tune intensity with the `opacity` value (0.085 default). The
  `mix-blend-mode: overlay` makes it sit in the shadows and highlights rather
  than flatly on top.
- The host element should be `position: relative` (the class sets
  `isolation: isolate` for clean blending).

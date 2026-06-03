# Aurora Background

Soft northern-lights glow: four heavily-blurred color ribbons drift, scale, and
fade on independent timelines over a deep-navy base, blended with `screen` for
that luminous aurora look. Pure CSS.

## Paste-in

1. Copy `styles.css`.
2. Copy the markup:

```html
<div class="scs-aurora">
  <div class="scs-aurora__lights" aria-hidden="true">
    <span></span><span></span><span></span><span></span>
  </div>
  <!-- your content -->
</div>
```

Give `.scs-aurora` a height (e.g. `min-height: 100vh` for a hero). Content sits
above the lights automatically (lights are at `z-index: -1`).

## Notes

- Keep all four `<span>`s — each is one light ribbon with its own animation.
- Recolor via the `radial-gradient` in each `nth-child` rule.
- The blobs are sized in `vw`, so the effect scales with the viewport.
- Honors `prefers-reduced-motion` (ribbons hold still).

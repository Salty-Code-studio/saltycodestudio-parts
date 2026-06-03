# 3D Tilt Card

On hover the card lifts and tilts in 3D perspective; inner layers float forward
at different `translateZ` depths for a parallax feel, and a sheen sweeps across.
100% CSS — no JS, no mouse tracking (the tilt is a fixed, polished pose).

## Paste-in

1. Copy `styles.css`.
2. Copy the markup. `.scs-tilt` establishes the `perspective`; `.scs-tilt__card`
   is what tilts; each floating element gets `.scs-tilt__layer` plus a depth
   class:

```html
<div class="scs-tilt">
  <article class="scs-tilt__card">
    <p class="scs-tilt__layer scs-tilt__eyebrow">Eyebrow</p>
    <h3 class="scs-tilt__layer scs-tilt__title">Title</h3>
    <p class="scs-tilt__layer scs-tilt__body">Body copy.</p>
    <span class="scs-tilt__layer scs-tilt__tag">Tag</span>
  </article>
</div>
```

## Customize

- Tilt angle / lift: edit the `rotateX` / `rotateY` / `translateZ` in the
  `.scs-tilt:hover .scs-tilt__card` rule.
- Layer depth: edit the per-layer `translateZ` values.

## Notes

- `transform-style: preserve-3d` on the card is what lets the inner layers exist
  in 3D space — keep it.
- Honors `prefers-reduced-motion` (drops to a flat lift, no tilt).

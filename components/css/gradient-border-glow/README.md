# Gradient Border Glow

An element wrapped in a rotating conic-gradient border, with a second blurred
copy underneath that becomes a soft outer glow. The gradient angle animates
smoothly via a registered `@property` custom property. Glow brightens on hover.

## Paste-in

1. Copy `styles.css` (including the `@property --scs-angle` block — it must live
   at the top level of your stylesheet, not nested).
2. Add the class and put content inside:

```html
<div class="scs-gradient-border">
  <h3>Glowing Border</h3>
  <p>Your content.</p>
</div>
```

## Customize

- Border thickness: `--scs-border-width`.
- Corner radius: `--scs-radius`.
- Speed: change `4s` in the two `animation` shorthands.
- Colors: edit the `conic-gradient(...)` stops in both `::before` and `::after`
  (keep them identical so the ring and its glow match).

## Notes

- The `::before` is the crisp ring; the `::after` is the same gradient blurred =
  the glow. The content surface (`background: #0d2a3a`) sits on top.
- `@property` (needed to animate `<angle>`) is supported in all current
  browsers; in older ones the border simply doesn't rotate but still renders.
- Honors `prefers-reduced-motion` (static border + glow).

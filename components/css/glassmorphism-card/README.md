# Glassmorphism Card

A frosted glass card — `backdrop-filter: blur()` with saturation boost, a crisp
1px light border, a soft drop shadow, and an inner top-left highlight that makes
the pane read as real glass.

## Paste-in

1. Copy `styles.css` into your stylesheet (or `<style>`).
2. Copy the markup from `index.html`:

```html
<article class="scs-glass-card">
  <p class="scs-glass-card__eyebrow">Sand &amp; Surf</p>
  <h3 class="scs-glass-card__title">Frosted Glass</h3>
  <p class="scs-glass-card__body">Your copy here.</p>
</article>
```

## Notes

- The glass effect only shows over content. Put the card over a photo or a
  colorful gradient — over a flat solid color there is nothing to blur.
- `backdrop-filter` is supported in all current browsers; the `-webkit-` prefix
  is included for older Safari.
- All three text classes are optional — the card works with any children.

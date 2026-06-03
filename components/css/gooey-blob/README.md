# Gooey Blob

An organic, morphing gooey shape. Two variants are included — use whichever
fits.

## Option A — Single morphing blob (simplest)

A single element that endlessly morphs its `border-radius` and slowly spins. No
SVG required.

```html
<div class="scs-blob"></div>
```

## Option B — Gooey merge (SVG goo filter)

Multiple circles drift around and **melt into each other** as they overlap,
thanks to an SVG `feGaussianBlur` + `feColorMatrix` "goo" filter. Paste the
hidden SVG **once per page**, then use the markup:

```html
<!-- once per page, anywhere -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <filter id="scs-goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
      <feColorMatrix in="blur" mode="matrix"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
      <feBlend in="SourceGraphic" in2="goo" />
    </filter>
  </defs>
</svg>

<div class="scs-goo"><span></span><span></span><span></span></div>
```

## Paste-in steps

1. Copy `styles.css`.
2. For Option B, also copy the SVG filter from `index.html` (the `id="scs-goo"`
   filter is what `filter: url(#scs-goo)` in the CSS references).

## Notes

- The goo "stickiness" is the last value pair in the `feColorMatrix` (`20 -10`):
  higher alpha multiplier = tighter merge.
- Recolor via the gradients in the CSS.
- Honors `prefers-reduced-motion` (shapes hold their pose).

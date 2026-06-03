# Animated Gradient Mesh

A living background: two layers of soft radial-gradient blobs drift, scale, and
rotate on independent timelines and blend together (`mix-blend-mode: screen`)
for a slow, organic mesh. 100% CSS — no JS, no images.

## Paste-in

1. Copy `styles.css`.
2. Wrap your section content:

```html
<div class="scs-mesh">
  <!-- your content here -->
</div>
```

The mesh fills its container, so give `.scs-mesh` a height — e.g. `min-height:
100vh` for a full-screen hero, or a fixed height for a banner.

## Notes

- Blobs live on `::before` / `::after` at `z-index: -1`, so your content sits
  cleanly on top.
- Recolor by editing the radial-gradient color stops — the palette here is the
  Sand & Surf teal/navy/sand set.
- Honors `prefers-reduced-motion`: animation stops, gradient stays.

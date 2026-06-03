# Infinite Marquee

A smooth, seamless horizontal scroller. The track holds **two identical copies**
of the content group and animates `translateX(-50%)`; when the first group has
scrolled fully off, the second is sitting exactly where the first started, so
the loop never jumps. Pauses on hover. Pure CSS.

## Paste-in

1. Copy `styles.css`.
2. Copy the markup from `index.html`. The key rule: **duplicate the
   `.scs-marquee__group` exactly**, and mark the copy `aria-hidden="true"` so
   screen readers don't read the content twice.

```html
<div class="scs-marquee">
  <div class="scs-marquee__track">
    <div class="scs-marquee__group">...items...</div>
    <div class="scs-marquee__group" aria-hidden="true">...same items...</div>
  </div>
</div>
```

## Customize

- Speed: set `--scs-marquee-duration` (e.g. `style="--scs-marquee-duration:18s"`).
- Spacing: set `--scs-marquee-gap`.
- Direction: add `scs-marquee--reverse` to the outer `.scs-marquee`.

## Notes

- Edges are softly faded with a `mask-image` so items appear/disappear smoothly.
- Both groups must hold the same items for a seamless loop.
- Honors `prefers-reduced-motion` (animation off).
- The `.scs-marquee__item` styling is a sample — replace with logos, images, or
  your own markup.

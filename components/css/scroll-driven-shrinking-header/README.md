# Shrinking Header with Shadow

A profile style page header that compresses and picks up a drop shadow over the
first 150 pixels of scroll, driven entirely by the native CSS scroll-driven
animations API (`animation-timeline: scroll()`). No JavaScript, no scroll
listeners, no IntersectionObserver. Scroll back up and the header grows again
in perfect reverse, because the scrollbar itself is the playhead.

## What it does

Five small keyframe animations run over the same short stretch of scroll:

- the identity grid compresses (avatar column 8em to 4em, row height 12rem to 4.75rem)
- the name shrinks from 2rem to 1.5rem
- the header fades in a soft drop shadow
- the round action button tucks down slightly
- the decorative wave art drifts up, scales back and fades

All five share one hookup:

```css
.shh-header, .shh-info, .shh-name, .shh-action, .shh-bg {
  animation-timeline: scroll();
  animation-range: 0 var(--shh-distance, 150px);
}
```

`scroll()` without arguments follows the nearest scroller (the document) in the
block direction. Setting `animation-range` to `0 150px` makes every animation
run from start to finish within the first 150px of page scroll.

One structural detail worth knowing: while the effect is active the header
switches from `sticky` to `fixed`. A shrinking sticky header would change the
document height during the very scroll it reacts to and cause jitter, so the
header leaves the flow and the next sibling gets a compensating `margin-top`.

## Dependencies

None. Pure CSS, native browser feature.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome and Edge 115+, and in Safari 26+.
Firefox has them behind a flag. The whole effect sits inside
`@supports (animation-timeline: scroll())` plus a
`prefers-reduced-motion: no-preference` media query, so:

- Browsers without support get a normal sticky header at full size with a
  permanent soft shadow. Fully readable, nothing jumps.
- Users who prefer reduced motion get that same calm static version.

For older browsers you can optionally add the
[flackr scroll-timeline polyfill](https://github.com/flackr/scroll-timeline);
the classes and keyframes here work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block).
2. Place the header markup as the first element of `<body>`, and make sure a
   sibling element (your `<main>`) follows it directly. That sibling receives
   the margin compensation when the header goes fixed:

   ```html
   <header class="shh-header">
     <div class="shh-inner">
       <div class="shh-bg" aria-hidden="true">
         <!-- inline SVG waves, see index.html -->
       </div>
       <div class="shh-info">
         <span class="shh-avatar" aria-hidden="true">
           <!-- inline SVG avatar, or your own <img> -->
         </span>
         <div>
           <h1 class="shh-name">Mara Costa</h1>
           <ul class="shh-meta">
             <li>Studio Lead</li>
             <li>@maracosta</li>
             <li>Bonaire</li>
           </ul>
         </div>
       </div>
       <a href="#" class="shh-action" aria-label="Edit profile">&#9998;</a>
     </div>
   </header>
   <main>...</main>
   ```

3. Swap the placeholder SVG avatar for your own image if you like:

   ```html
   <img class="shh-avatar" src="avatar.jpg" alt="" width="200" height="200" />
   ```

   The `.shh-avatar` class works on an `<img>` as well as on the SVG wrapper.

4. Tune the feel with the three custom properties at the top of `styles.css`:

   ```css
   :root {
     --shh-distance: 150px;     /* how much scroll completes the shrink */
     --shh-height: 12rem;       /* expanded header height */
     --shh-height-min: 4.75rem; /* compressed header height */
   }
   ```

Copy `index.html` for the full minimal markup, and open `preview.html` for a
complete themed demo page.

## Source and credit

Adapted from "Shadow on header after scroll" by Bramus Van Damme, part of the
scroll-driven-animations.style demo collection:
https://scroll-driven-animations.style/demos/shrinking-header-shadow/css/

License: Apache-2.0 (the demos are published to be copied). This part keeps
the technique and structure faithful, with renamed `shh-` prefixed classes,
Sand & Surf styling and self-contained inline SVG art in place of the original
raster images.

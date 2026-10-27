# Fly-In Fly-Out List

A contact-style list where every row slides and fades in as it enters its
scrollport from the bottom, then slides and fades out as it leaves at the top.
The whole effect is native CSS scroll-driven animation, `animation-timeline: view()`
with one keyframe set. No JavaScript, no IntersectionObserver, no library.

## What it does

- **One keyframe set, both directions.** The keyframes carry their own timeline
  ranges: `entry 0%` to `entry 100%` runs while a row enters the scrollport,
  `exit 0%` to `exit 100%` runs while it leaves. One `animation-timeline: view()`
  declaration per row wires it all up.
- **Two scroll modes.** By default `.fly-list` is a self-scrolling card (set its
  height with `--fly-height`). Add `.fly-list--page` and the document becomes the
  scrollport, so rows animate against the viewport as the page scrolls.
- **Asset-free avatars.** Gradient circles with initials, cycled through three
  Sand and Surf teal variants by `nth-child`. No images to host.
- **Optional row index.** Add `.fly-list--numbered` for a subtle `#n` counter at
  the end of each row, done with pure CSS counters (a nod to the original demo).

## Dependencies

None. Pure CSS, native browser feature.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome/Edge 115+ and Safari 26+. Firefox
has them behind a flag. The animation block is wrapped in
`@supports (animation-timeline: view())` plus a
`prefers-reduced-motion: no-preference` media query, so:

- Browsers without support render a normal, fully readable scrolling list.
- Users who prefer reduced motion get the static list too, nothing animates.

For older browsers you can optionally load the
[flackr/scroll-timeline polyfill](https://github.com/flackr/scroll-timeline);
the markup and classes here work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a `<style>`).
2. Add the list markup. Each row is a flex line: avatar circle, then a name with
   an optional note underneath:

   ```html
   <div class="fly-list" style="--fly-height: 70vh">
     <ul>
       <li>
         <span class="fly-avatar" aria-hidden="true">AD</span>
         <span class="fly-name">Ava Delmar
           <small class="fly-note">Surf coach</small>
         </span>
       </li>
       <!-- more rows -->
     </ul>
   </div>
   ```

3. Want the page itself to scroll instead of the card? Add the modifier and drop
   the height:

   ```html
   <div class="fly-list fly-list--page">
     <ul> ... </ul>
   </div>
   ```

4. Optional extras:

   ```html
   <!-- adds a small #n index at the end of each row -->
   <div class="fly-list fly-list--numbered"> ... </div>
   ```

5. Theme it with the custom properties on `.fly-list`: `--fly-height`,
   `--fly-surface`, `--fly-border`, `--fly-text`, `--fly-muted`. Defaults are
   Sand and Surf.

The animation itself is this compact (already included in `styles.css`):

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    @keyframes fly-in-out {
      entry 0%   { opacity: 0; transform: translateY(100%); }
      entry 100% { opacity: 1; transform: translateY(0); }
      exit 0%    { opacity: 1; transform: translateY(0); }
      exit 100%  { opacity: 0; transform: translateY(-100%); }
    }
    .fly-list li {
      animation: fly-in-out linear;
      animation-timeline: view();
    }
  }
}
```

`view()` tracks the nearest ancestor scroll container, which is why the same
rule serves both the inner-scrolling card and the page variant. Keep the
`animation` shorthand before `animation-timeline` (the shorthand resets the
timeline property).

See `index.html` for the markup reference and `preview.html` for a complete,
self-contained demo with both scroll modes.

## Source and credit

Adapted from the "Contact List" demo by Bramus Van Damme on
[scroll-driven-animations.style](https://scroll-driven-animations.style/demos/contact-list/css/),
published under Apache-2.0 and made to be copied. This part keeps the technique
and markup structure faithful, strips the site chrome, and restyles everything
in the Sand and Surf palette with a part-specific `fly-` class prefix.

License: Apache-2.0 (original demo), adapted with credit.

# CSS Scroll Reveal Timeline

Zero-JavaScript scroll reveals and a top scroll-progress bar, driven entirely by
the native CSS **scroll-driven animations** API — `animation-timeline: view()`
and `animation-timeline: scroll()`. No IntersectionObserver, no scroll listeners,
no animation library.

## What it does

- **`view()` reveals** — each element animates based on its own progress through
  the viewport. Variants: fade-up, horizontal clip-path wipe, vertical clip
  reveal, and a media zoom-in.
- **`scroll()` progress bar** — a fixed bar at the top of the page that fills
  left-to-right as the document scrolls.
- **Staggering** — set an inline `--srt-delay` (0 → 1) on sibling elements to
  shift when each one's entry range begins.

## Dependencies

None. Pure CSS, native browser feature.

## Browser support & graceful degradation

Scroll-driven animations are supported in Chromium-based browsers (Chrome/Edge
116+). Everything is wrapped in `@supports (animation-timeline: scroll())` and a
`prefers-reduced-motion: no-preference` query, so:

- Browsers without support simply render the finished, fully-visible layout
  (the elements default to their settled state).
- Users who prefer reduced motion get the static layout too — no animation runs.

For full cross-browser animation you can optionally load the official
[scroll-timeline polyfill](https://github.com/flackr/scroll-timeline); the markup
and classes here work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a `<style>`).
2. Add the progress bar once, near the top of `<body>`:
   ```html
   <div class="srt-progress" aria-hidden="true"></div>
   ```
3. Add `srt-reveal` plus one variant to any element you want to reveal:
   ```html
   <h2 class="srt-reveal srt-fade-up">Fades up on enter</h2>
   <p  class="srt-reveal srt-clip">Wipes in from the left</p>
   <p  class="srt-reveal srt-clip srt-clip--up">Reveals bottom-up</p>
   <figure class="srt-reveal srt-zoom"><img src="…" alt=""></figure>
   ```
4. To stagger a group, give each child an inline delay:
   ```html
   <li class="srt-reveal srt-fade-up" style="--srt-delay: 0">One</li>
   <li class="srt-reveal srt-fade-up" style="--srt-delay: .33">Two</li>
   <li class="srt-reveal srt-fade-up" style="--srt-delay: .66">Three</li>
   ```

Tune timing with the `animation-range` keywords (`entry`, `cover`, etc.) inside
`styles.css`. See `index.html` for the full markup reference and
`preview.html` for a complete, self-contained demo.

## Source / inspiration

Inspired by Codrops — "A Practical Introduction to Scroll-Driven Animations with
CSS scroll() and view()":
https://tympanus.net/codrops/2024/01/17/a-practical-introduction-to-scroll-driven-animations-with-css-scroll-and-view/

License: Public-domain CSS idiom — reimplemented cleanly. The underlying
technique is a native CSS web-platform feature (no library involved), free to use.

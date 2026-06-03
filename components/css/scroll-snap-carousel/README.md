# CSS-Only Snap Carousel

A swipeable, paginated carousel with prev/next buttons and dot markers — built with **zero JavaScript**.

It leans on CSS scroll-snap for the swipe behaviour and the newer **CSS Overflow Level 5** pseudo-elements `::scroll-button()` and `::scroll-marker` to generate native, accessible navigation controls. The browser does all the wiring: clicking an arrow scrolls one page and auto-disables at the ends, clicking a dot scrolls to that slide, and the active dot is matched with `:target-current`.

## Dependencies

None. Pure CSS + HTML.

## How it works

- `.snap-carousel__track` is the scroll container: `scroll-snap-type: x mandatory`.
- `.snap-carousel__slide` items snap with `scroll-snap-align: center`.
- `::scroll-button(left)` / `::scroll-button(right)` generate the prev/next buttons. The `content` value uses the `"glyph" / "Accessible name"` syntax so screen readers announce a real label.
- `scroll-marker-group: after` on the track tells the browser to render a generated marker group after it; each slide contributes one dot via `::scroll-marker`.
- `::scroll-marker:target-current` styles the dot for the slide currently in view.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste the rules into your stylesheet).
2. Add markup like the snippet in `index.html`:

```html
<div class="snap-carousel" role="group" aria-roledescription="carousel" aria-label="Featured">
  <ul class="snap-carousel__track">
    <li class="snap-carousel__slide" tabindex="0" aria-label="Slide 1 of 3: First">…</li>
    <li class="snap-carousel__slide" tabindex="0" aria-label="Slide 2 of 3: Second">…</li>
    <li class="snap-carousel__slide" tabindex="0" aria-label="Slide 3 of 3: Third">…</li>
  </ul>
</div>
```

3. That's it. Do **not** add `<button>` or dot elements — they are generated from CSS. One `.snap-carousel__slide` automatically produces one dot.

Tunable knobs live as custom properties on `.snap-carousel`: `--slide-gap`, `--slide-radius`, and the Sand & Surf palette tokens (`--sand`, `--ink`, `--teal`, etc.).

## Progressive enhancement & support

The horizontal scroll-snap (swipe/drag) works in **every** modern browser today. The generated arrow buttons and dot markers are CSS Overflow Level 5 features — currently shipping in recent Chromium builds and rolling out elsewhere. Where the pseudo-elements aren't supported, the carousel **degrades gracefully** to a clean swipe/drag experience: the controls simply don't render, and nothing breaks.

`prefers-reduced-motion: reduce` is respected — smooth scrolling and control transitions are disabled for users who ask for less motion.

## Files

- `styles.css` — the canonical, copy-paste stylesheet.
- `index.html` — minimal markup snippet to pair with the CSS.
- `preview.html` — standalone Sand & Surf demo; open it in a browser to see the part render.

## Source / inspiration

Reimplemented from [MDN — CSS Carousels guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Overflow/Carousels). MDN documentation is CC-BY-SA 2.5; the underlying CSS Overflow Level 5 features are native web platform standards and unencumbered. Reimplemented cleanly for saltycodestudio-parts.

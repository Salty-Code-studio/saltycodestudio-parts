# Smooth Scroll

Lerp-based inertia scrolling for the whole page, driven by `requestAnimationFrame`.
The native scrollbar still scrolls the window — the script just sets `<body>` to
the content height and eases a fixed wrapper toward the scroll position with a
`translate3d`. In-page anchor links are handled so they land correctly.

## Files

- `styles.css` — positions the wrapper when smooth scroll is active
- `script.js` — the RAF lerp loop + anchor handling + teardown API

## Required markup

Wrap **all** page content in a single wrapper:

```html
<div id="scroll-content">
  <!-- your entire page -->
</div>
```

## Paste-in

1. Copy `styles.css` and `script.js`.
2. Link `styles.css`, load `script.js` at the end of `<body>`.
3. Make sure everything visible lives inside `#scroll-content`.

## Disabling

- **Automatic:** it never engages when `prefers-reduced-motion: reduce` or on
  coarse-pointer / touch devices (native momentum is better there).
- **Force off:** simply don't include `script.js`, or set
  `window.SMOOTH_SCROLL_DISABLED = true` before it runs.
- **Teardown at runtime:** `window.smoothScroll.destroy()` restores native
  scrolling; `window.smoothScroll.refresh()` recomputes the body height after you
  inject content.

## Tuning

- `EASE` in `script.js` (0–1) controls how tightly the page follows; lower is
  floatier, higher is snappier.
- The script auto-refreshes the body height on `resize`, `load`, and via a
  `ResizeObserver` on the content, so dynamic content stays in sync.

## Caveats

- Because the wrapper is `position: fixed` when active, `position: sticky` and
  `position: fixed` children behave relative to the wrapper, not the viewport.
  Use a scroll-position observer for such effects.

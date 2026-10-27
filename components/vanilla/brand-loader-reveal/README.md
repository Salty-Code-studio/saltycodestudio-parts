# Brand Loader Reveal

A full-screen loader overlay in a single brand color with a centered logo mark.
The page sits pre-hidden underneath. On `window.load`, after a minimum display
time (1.2s by default), the overlay lifts away like a curtain via a clip-path
wipe with a strong ease, and the hero content staggers in with small
fade-and-rise steps. The whole thing is a tiny dependency-free script plus one
stylesheet.

## What it does

- **Hold**: a fixed overlay in one brand color covers the page, the logo mark
  pulses gently, and body scroll is locked.
- **Lift**: once the page has loaded and the minimum display time has passed,
  the overlay wipes upward (`clip-path: inset(0 0 100% 0)`) with a strong
  cubic-bezier ease, then removes itself from the DOM.
- **Arrive**: elements marked `.blr-stagger` fade in and rise, sequenced by
  the `.blr-d1` to `.blr-d6` transition-delay classes.

## Files

- `styles.css`: overlay, curtain wipe, stagger classes, failsafes
- `script.js`: `initLoaderReveal(options)`, timing, reveal, self-removal
- `index.html`: minimal markup reference

## Dependencies

None. Vanilla JS and plain CSS.

## Required markup

Place the overlay as the **first child** of `<body>` and tag your hero
elements with the stagger classes:

```html
<body>
  <div class="blr-loader" role="status" aria-label="Loading">
    <svg class="blr-loader__mark" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <circle cx="48" cy="48" r="44" stroke="currentColor" stroke-width="4" />
      <path d="M24 56c8-10 16-10 24 0s16 10 24 0"
            stroke="currentColor" stroke-width="5" stroke-linecap="round" />
    </svg>
  </div>

  <header>
    <p  class="blr-stagger blr-d1">Eyebrow</p>
    <h1 class="blr-stagger blr-d2">Headline</h1>
    <p  class="blr-stagger blr-d3">Subline</p>
    <a  class="blr-stagger blr-d4" href="#">Call to action</a>
  </header>
  <!-- rest of the page needs nothing special -->
</body>
```

Swap the placeholder SVG for your own logo. Anything without the stagger
classes renders normally, it is simply covered by the overlay while loading.

## Paste-in

1. Copy `styles.css` and `script.js` into your project.
2. Link `styles.css` in `<head>` and load `script.js` before your init call.
3. Add the markup above, then initialize:

```html
<script src="script.js"></script>
<script>
  initLoaderReveal({
    minTime: 1200,                                   // ms, minimum overlay time
    onRevealed: () => console.log('curtain is up')   // fires after removal
  });
</script>
```

## Options

| Option       | Default         | What it does                                       |
| ------------ | --------------- | -------------------------------------------------- |
| `minTime`    | `1200`          | Minimum overlay display time in ms                 |
| `onRevealed` | `null`          | Callback fired once the overlay has been removed   |
| `maxWait`    | `8000`          | Safety net: reveal even if `load` never fires      |
| `loader`     | `'.blr-loader'` | Selector or element for the overlay                |

A `blr:revealed` event also fires on `document` after removal, handy when
other scripts want to start hero animations without touching the options.

## Theming

Colors and timing live in `:root` inside `styles.css`: the custom properties
`--blr-bg` (brand color), `--blr-fg` (mark color), `--blr-ease`,
`--blr-curtain` (wipe duration) and `--blr-rise` (stagger distance).

## Accessibility and resilience

- **Reduced motion**: with `prefers-reduced-motion: reduce` the overlay fades
  out quickly instead of wiping, and content appears in place with no rise
  and no stagger.
- **Content is never trapped**, in layers:
  1. `window.load` triggers the reveal in the normal case.
  2. The `maxWait` timer (8s) reveals even if an asset hangs forever.
  3. If `script.js` never executes at all, a pure CSS failsafe fades the
     overlay out after 4 seconds and brings the content in by itself.
  4. An optional `<noscript>` style block (see `index.html`) makes the
     no-JS path instant instead of waiting those 4 seconds.

## Browser support and graceful degradation

Transitions on `clip-path` work in all modern browsers (Chrome, Edge,
Firefox, Safari). For anything old enough to lack `clip-path`, an
`@supports not` block swaps the curtain for a plain opacity fade, so the
reveal still happens. No scroll-driven CSS is used, so nothing here depends
on `animation-timeline` support.

## Source / inspiration

Visual pattern seen on https://coffee-tech.com (Awwwards Site of the Day by
MAKETHECUT and Or Halevi). Implemented completely from scratch for this
library, no code or assets were copied.

License: MIT (original clean-room implementation by saltycodestudio-parts).

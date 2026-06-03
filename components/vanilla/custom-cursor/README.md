# Custom Cursor

A custom pointer made of a crisp dot (tracks 1:1) and a ring that trails behind with
lerp easing. The ring grows and fills when hovering links, buttons or any
`[data-cursor]` element. The native cursor is hidden only on fine-pointer devices;
touch / coarse-pointer devices are left untouched, and easing is disabled when the
user prefers reduced motion.

## Files

- `styles.css` — cursor visuals and hover/press states
- `script.js` — pointer tracking, lerp loop, interactive detection

## Required markup

Place once, near the end of `<body>`:

```html
<div class="cursor-dot" aria-hidden="true"></div>
<div class="cursor-ring" aria-hidden="true"></div>
```

## Paste-in

1. Copy `styles.css` and `script.js` into your project.
2. Link them:

   ```html
   <link rel="stylesheet" href="styles.css" />
   <script src="script.js"></script>
   ```

3. Add the two cursor `<div>`s above.

## Customising

- Colors / sizes live in the `:root` variables in `styles.css`
  (`--cursor-color`, `--cursor-ring-size`, etc.).
- Auto-detected interactive elements: `a, button, [role="button"]`, submit/button
  inputs, `label[for]`, `select`, `summary`. Add the hover effect to anything else
  with the `data-cursor` attribute.
- Easing tightness is the `EASE` constant in `script.js` (0–1; higher = snappier).

## Notes

- The script no-ops entirely when `(pointer: fine)` is false, so it is safe to ship
  globally.
- Detection uses event delegation, so dynamically added elements work without
  re-initialisation.

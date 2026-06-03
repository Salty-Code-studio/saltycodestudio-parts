# Auto-Invert Difference Cursor

A custom circular cursor that **auto-inverts whatever it passes over**. A single
`position: fixed` white circle sits above the page with `mix-blend-mode: difference`,
so it renders the exact photographic inverse of the backdrop underneath it. The
result is a cursor that is always legible — on cream, on ink, on teal, even over
photography — with **zero per-section color logic**.

It grows on hover over links/buttons, pinches on press, and hides when the pointer
leaves the window.

## Why it works

`difference` subtracts, per channel, the two layers and takes the absolute value.
The cursor is pure white (`#fff` = `255,255,255`), and `|255 − X| = 255 − X`, which
is a true invert of whatever pixel is below. No JavaScript ever reads colors — the
GPU does it for free.

## Dependencies

None. Native CSS `mix-blend-mode` plus a few lines of vanilla JS to feed the pointer
position into `--x` / `--y` custom properties.

## Files

- `styles.css` — the cursor styles (the canonical copy-paste).
- `index.html` — the markup element + the JS position/state snippet.
- `preview.html` — standalone, self-contained demo (open in a browser).

## Paste-in instructions

1. **Add the styles.** Link `styles.css`, or paste its contents into your stylesheet.

2. **Add the element once** (anywhere — it's `position: fixed`):

   ```html
   <div class="scs-difference-cursor" aria-hidden="true"></div>
   ```

3. **Add the script** (from `index.html`). It:
   - bails on touch / coarse pointers,
   - adds `.scs-cursor-active` to `<html>` to hide the native cursor (only after
     confirming JS + a fine pointer, so it degrades gracefully),
   - feeds `clientX` / `clientY` into `--x` / `--y` via `requestAnimationFrame`,
   - toggles `is-hovering`, `is-pressing`, and `is-hidden`.

4. **Mark hover targets.** Native `<a>`, `<button>`, and `[role="button"]` are
   detected automatically. Add `class="scs-cursor-target"` to anything else you
   want the cursor to grow over.

## Customizing

- **Size:** change `--scs-cursor-size` on `.scs-difference-cursor` (default `28px`).
- **Hover/press growth:** edit `--scs-scale` in the `.is-hovering` / `.is-pressing`
  rules.
- **Easing/speed:** tweak the `transition` on `.scs-difference-cursor`. Movement
  itself is 1:1 (instant); only the scale animates.

## Accessibility

- Honors `prefers-reduced-motion: reduce` (drops the scale transition; the invert
  itself is static, not motion).
- Disabled on `(hover: none)` / `(pointer: coarse)` devices, and the native cursor
  is restored.
- If JS is disabled, the native cursor is never hidden, so the page stays usable.

## Source / inspiration

Concept from CSS-Tricks — **“Taming Blend Modes: `difference` and `exclusion`”**:
<https://css-tricks.com/taming-blend-modes-difference-and-exclusion/>

License: public-domain CSS idiom — `mix-blend-mode` is native CSS. Reimplemented
cleanly here; no proprietary code reused.

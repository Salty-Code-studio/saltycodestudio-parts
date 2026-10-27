# Scroll Theme Switch

The award-site move where the whole page flips between dark and light as you
scroll from one section to the next. Sections declare `data-theme="dark"` or
`data-theme="light"`, a tiny `IntersectionObserver` script watches which section
dominates the viewport and mirrors its theme onto `<html data-theme>`, and CSS
custom properties for background and ink transition together (about 0.6s) so the
switch reads as one smooth crossfade between a bone-light and a near-black look.

A fixed header adapts automatically because it paints with the same tokens as
the page. Works with any number of sections. Dependency free.

## Files

- `script.js` (viewport-dominance tracking, sets `data-theme` on `<html>`,
  exposes `initThemeSwitch()`)
- `styles.css` (the two theme token sets, the crossfade transitions, the
  `.ts-header` fixed header and the `.ts-sync` helper)

## Required markup

```html
<link rel="stylesheet" href="styles.css" />

<header class="ts-header">
  <strong>Brand</strong>
</header>

<section data-theme="light">
  <h1>Opens in the light</h1>
</section>

<section data-theme="dark">
  <h2>Scroll in and the page goes dark</h2>
</section>

<section data-theme="light">
  <h2>And back to light again</h2>
</section>

<script src="script.js"></script>
```

### Wiring rules

- Every themed section gets `data-theme="dark"` or `data-theme="light"`.
  Non-section elements can use `data-theme-section="dark"` instead.
- Paint your page with the tokens: `var(--ts-bg)`, `var(--ts-ink)`,
  `var(--ts-muted)`, `var(--ts-accent)`, `var(--ts-line)`, `var(--ts-surface)`.
  Anything that reads them follows every flip.
- Add the `.ts-sync` class to cards, buttons or inline SVG that paint with the
  tokens so their colors crossfade in sync instead of snapping.
- Keep sections transparent (the stylesheet does this for you). The body owns
  the background, which is what makes the fade read as one continuous sweep.

## Paste-in

1. Copy `styles.css` and `script.js` into your project.
2. Link the stylesheet, load the script (it auto-runs on DOMContentLoaded and
   stores its handle on `window.themeSwitch`).
3. Tag your sections with `data-theme` and paint with the `--ts-*` tokens.
4. Optional: call `initThemeSwitch({ selector, target, fallback })` yourself for
   a custom setup. It returns `{ refresh, destroy }`. Call
   `window.themeSwitch.destroy()` first if the auto-init already ran.

## Tuning

- Fade speed lives in one place: `--ts-duration` in `styles.css` (default 0.6s).
- Swap the two token sets in `:root` and `:root[data-theme="dark"]` to re-skin
  both themes. The script never touches colors, only the attribute.
- You are not limited to two themes. Any `data-theme` value a section declares
  gets mirrored, so a `:root[data-theme="sunset"]` token set works too.

## Browser support and graceful degradation

`IntersectionObserver` is supported everywhere modern (Chrome 51+, Edge 15+,
Firefox 55+, Safari 12.1+), so no polyfill is needed. Degradation is layered:

- No JavaScript: the `:root` defaults apply and the page renders complete and
  readable in the light theme.
- No `IntersectionObserver`: the script bails out after setting the light
  fallback explicitly.
- `prefers-reduced-motion: reduce`: themes switch instantly instead of fading.

Unlike the scroll-driven CSS parts in this library, this part uses no
`animation-timeline`, so it does not depend on Chrome/Edge 115+ or Safari 26+
and needs no `@supports` guard.

## Source / inspiration

Pattern seen on https://coffee-tech.com (Awwwards Site of the Day by MAKETHECUT
and Or Halevi). This is an original clean-room implementation in the
saltycodestudio-parts house style. No code or assets were copied.

License: MIT.

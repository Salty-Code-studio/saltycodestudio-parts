# Animated Details Accordion

A native, accessible accordion that smoothly animates open and closed from
height `0` to `auto` using the `<details>` element — with **zero JavaScript**.

The smooth height transition (historically impossible with `height: auto`) is
achieved with two stacked techniques:

1. **Modern path** — animate the native `::details-content` pseudo-element's
   `height` using `interpolate-size: allow-keywords` (so keyword sizes like
   `auto` become animatable) plus `transition-behavior: allow-discrete` (so the
   UA-toggled `content-visibility` flips at the right moment instead of popping).
2. **Fallback path** — a wrapper that animates `grid-template-rows: 0fr → 1fr`,
   the classic no-JS smooth-height idiom, for engines that don't yet support the
   modern path.

Exclusive grouping (only one panel open at a time) is provided for free by the
native `name` attribute shared across the `<details>` elements. All keyboard and
screen-reader accessibility comes from `<details>` / `<summary>` natively — no
ARIA wiring needed.

## Dependencies

None. Pure HTML + CSS.

## Files

- `styles.css` — the canonical, copy-paste stylesheet.
- `index.html` — the markup snippet to copy (note the three-level
  `.acc__inner > .acc__body > .acc__body-pad` nesting that powers the fallback).
- `preview.html` — a standalone Sand & Surf demo; open it in a browser.

## Paste-in instructions

1. Copy `styles.css` into your project and link it (or paste its rules into your
   stylesheet). The palette/timing live in `:root` custom properties — override
   them to retheme.
2. Copy the markup from `index.html`. For each accordion item, keep the
   `<details class="acc" name="faq"> … </details>` structure with the
   `.acc__inner > .acc__body > .acc__body-pad` wrappers inside.
3. Give every `<details>` in one group the **same** `name` value to make it
   exclusive (only one open at a time). Drop the `name` to allow multiple open.
4. Add `open` to whichever `<details>` should start expanded.

```html
<details class="acc" name="faq" open>
  <summary class="acc__summary">
    <span class="acc__bullet">01</span>
    <span class="acc__label">Your question</span>
    <span class="acc__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
           stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
    </span>
  </summary>
  <div class="acc__inner"><div class="acc__body"><div class="acc__body-pad">
    <p>Your answer.</p>
  </div></div></div>
</details>
```

## Notes

- Respects `prefers-reduced-motion: reduce` (transitions collapse to ~instant).
- `overflow: clip` on `.acc` keeps the animating content inside the rounded
  corners.
- In browsers without `::details-content` / `interpolate-size`, the modern rules
  are simply ignored and the `grid-template-rows` fallback drives the animation.

## Source / inspiration

Inspired by Builder.io's "Animated CSS Accordions" article —
<https://www.builder.io/blog/animated-css-accordions>. Code shared in the
article for reuse; `<details>` and `::details-content` are native HTML/CSS
features. Reimplemented cleanly here for the Sand & Surf kit.

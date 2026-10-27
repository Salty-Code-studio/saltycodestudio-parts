# Editorial Mega Link

A giant "See all products" style link row: display type sized with `clamp()`,
a long inline SVG arrow, and a full-width bottom rule. On hover (and keyboard
focus) three things happen at once, all pure CSS:

- the arrow slides to the right
- a thicker rule redraws across the hairline, left to right
- the text nudges along and the color shifts to teal

It is one anchor element plus one inline SVG. No JavaScript, no images,
no fonts.

## What it does

- **Fluid display type.** The size lives in one custom property,
  `--ml-size`, defaulting to `clamp(2.25rem, 1.2rem + 5.5vw, 6rem)`, so the
  row scales from phone to ultrawide without media queries.
- **Two rules, two moods.** `::before` draws a resting 1px hairline across
  the full width. `::after` is the thick rule (its height is in `em`, so it
  thickens proportionally with the type), scaled to zero and redrawn from
  the left edge with a `transform-origin: 0 50%` scale.
- **Arrow that belongs to the type.** The SVG is sized in `em` (1.5em long)
  and strokes with `currentColor`, so it inherits size and color from the
  link automatically.
- **Dark variant.** Add `.mega-link--dark` on dark backgrounds. It only
  swaps the custom properties, nothing structural.
- **Keyboard parity.** `:focus-visible` triggers the exact same slide,
  redraw and nudge as hover, plus a visible outline ring.

## Dependencies

None. Plain CSS and one inline SVG.

## Browser support & graceful degradation

Everything here is baseline CSS: flexbox, custom properties, transforms,
transitions and pseudo-elements work in every modern browser and have for
years. Two notes for honesty:

- `:focus-visible` ships in Chrome/Edge 86+, Firefox 85+ and Safari 15.4+.
  In anything older the browser simply falls back to its default focus
  outline, which is still fully accessible. Nothing breaks.
- `prefers-reduced-motion` is respected: users who ask for less motion get
  the same hover and focus states, they just snap instead of gliding.

There is no scroll-driven CSS in this part, so no polyfill story is needed.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block).
2. Drop in the anchor. The SVG travels with the markup, so this is the whole
   component:

   ```html
   <a class="mega-link" href="/products">
     <span class="mega-link__text">See all products</span>
     <svg class="mega-link__arrow" viewBox="0 0 72 24" fill="none" aria-hidden="true" focusable="false">
       <path d="M1.5 12h64" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
       <path d="M56 2.5 65.5 12 56 21.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
     </svg>
   </a>
   ```

3. On a dark section, add the variant class:

   ```html
   <a class="mega-link mega-link--dark" href="/journal">…</a>
   ```

4. Retheme or resize per instance with inline custom properties, no extra
   CSS needed:

   ```html
   <a class="mega-link" href="/contact"
      style="--ml-size: clamp(1.6rem, 1rem + 3vw, 3rem); --ml-rule-hover: #FF6F59;">
     …
   </a>
   ```

The knobs: `--ml-ink` (resting color), `--ml-hover` (hover color),
`--ml-rule` (hairline), `--ml-rule-hover` (thick rule), `--ml-size`
(type size), `--ml-speed` and `--ml-ease` (motion feel).

Stack several links in a `<nav>` or list for the classic editorial index
look. See `index.html` for the markup reference and `preview.html` for a
complete, self-contained demo.

## Source / inspiration

Pattern seen on https://coffee-tech.com (Awwwards Site of the Day by
MAKETHECUT and Or Halevi). This part is an original clean-room
implementation in the saltycodestudio house style; no code or assets were
copied.

License: MIT for this implementation.

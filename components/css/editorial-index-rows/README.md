# Editorial Index Rows

A stacked list of oversized nav rows separated by hairline rules, each with a
trailing arrow. Rows rest in a calm muted grey. On hover (and keyboard focus)
the label fills to full ink with a background-clip text sweep, the arrow slides
in from the left with a little overshoot, and the row background tints subtly.
Pure CSS, zero JavaScript.

## What it does

- **Hairline stack**: each row gets a rule above it and the last row closes the
  stack, so the list reads like a magazine table of contents.
- **Ink sweep**: the label is clipped to a 240% wide gradient via
  `background-clip: text`. Transitioning `background-position` pulls full ink
  across the glyphs from left to right.
- **Overshoot arrow**: the trailing arrow rests at `translateX(-0.7em)` with
  zero opacity and springs to its slot through a bouncy `cubic-bezier`, landing
  with a small overshoot.
- **Row tint**: the whole row picks up a whisper of teal behind it while active.
- **Focus parity**: every state rides `:is(:hover, :focus-visible)`, so keyboard
  users get exactly the same show, plus a visible focus ring.

## Dependencies

None. Pure CSS, system fonts, inline SVG arrow.

## Browser support and graceful degradation

- The layout, hairlines, tint and arrow work in every modern browser (flexbox,
  custom properties, `:is()`).
- The ink sweep needs `background-clip: text`, which ships prefixed in
  Chrome, Edge and Safari and unprefixed in Firefox. It sits behind an
  `@supports` guard; browsers without it fall back to a plain grey to ink color
  crossfade, so the label is always readable and the hover still reads clearly.
- **Touch screens**: the arrow is only parked off screen inside
  `@media (hover: hover) and (pointer: fine)`. On touch devices the arrows stay
  visible at all times so the rows still read as links.
- **Reduced motion**: with `prefers-reduced-motion: reduce` every state still
  switches, it just switches instantly.
- The resting grey is a design choice sitting near the large-text contrast
  floor. If your brand needs strict AA at rest, raise `--eir-muted` (for
  example `rgba(28, 43, 51, 0.55)`).

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a `<style>`).
2. Add the nav markup. Each row is one flex line: number, label, arrow.

   ```html
   <nav aria-label="Site index">
     <ul class="eir">
       <li>
         <a class="eir-row" href="#technology">
           <span class="eir-num" aria-hidden="true">01</span>
           <span class="eir-label">Technology</span>
           <span class="eir-arrow" aria-hidden="true">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M3 12h17" />
               <path d="M13 5l7 7-7 7" />
             </svg>
           </span>
         </a>
       </li>
       <!-- more rows... -->
     </ul>
   </nav>
   ```

3. Retheme by overriding the custom properties on `.eir` or any ancestor:

   ```css
   .my-dark-section .eir {
     --eir-ink: #f4ece0;
     --eir-muted: rgba(244, 236, 224, 0.35);
     --eir-rule: rgba(244, 236, 224, 0.16);
     --eir-tint: rgba(46, 195, 195, 0.08);
     --eir-arrow: #2ec3c3;
   }
   ```

4. Other knobs: `--eir-size` (label type scale), `--eir-speed` (master timing)
   and `--eir-overshoot` (the arrow's spring curve). The number span is
   optional, delete it if you want label plus arrow only.

See `index.html` for the full markup reference and `preview.html` for a
complete, self-contained demo including a dark retheme.

## Source and inspiration

Pattern seen on https://coffee-tech.com (Awwwards Site of the Day by MAKETHECUT
and Or Halevi). This is an original clean-room implementation in the
saltycodestudio-parts house style, no code or assets copied.

License: MIT (the implementation; the visual pattern credit stays with its
designers).

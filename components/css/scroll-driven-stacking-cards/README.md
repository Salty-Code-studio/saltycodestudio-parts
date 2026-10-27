# CSS Stacking Cards

Sticky cards that pile up while you scroll. Each card pins below the previous
one, then scales back as the next card slides up and covers it, leaving a neat
staircase of card lips at the top. The whole effect runs on the native CSS
scroll-driven animations API (`view-timeline` plus
`animation-range: exit-crossing`). There is no JavaScript at all.

## What it does

- **Sticky stacking.** Every `.sdc-card` is `position: sticky` with a per-card
  `padding-top` offset, so cards pin and stack under one another with a small
  visible lip.
- **Scroll-linked scale-back.** The wrapper `.sdc-cards` exposes a named view
  timeline. Each card's inner `.sdc-card__content` owns one slice of the
  wrapper's `exit-crossing` range (slice size is 100% divided by the card
  count) and scales from 1 down to its stacked size while that slice plays.
- **Stable scroll distance.** Only the inner content animates, never the card
  row itself, so the wrapper height (and with it the scroll estate) never
  changes mid-scroll.

## Dependencies

None. Pure CSS, native browser feature.

## Browser support and graceful degradation

CSS scroll-driven animations ship in Chrome and Edge 115+, and in Safari 26+.
Firefox has them behind a flag. The scaling engine is wrapped in
`@supports (animation-timeline: view())` and a
`prefers-reduced-motion: no-preference` query, so:

- Browsers without support still get the sticky stacking (that part is plain
  `position: sticky`), the cards simply cover each other at full size. The
  page stays complete and readable.
- Visitors who prefer reduced motion get the same calm sticky stack with no
  scroll-linked scaling.

For full cross-browser scaling you can optionally add the
[flackr scroll-timeline polyfill](https://github.com/flackr/scroll-timeline);
the markup and classes here work with it unchanged.

## Paste-in instructions

1. Copy `styles.css` into your project (or paste its contents into a
   `<style>` block).
2. Add the markup: a `.sdc-cards` list with one `.sdc-card` per item, each
   wrapping a `.sdc-card__content`:

   ```html
   <ul class="sdc-cards" style="--sdc-numcards: 4">
     <li class="sdc-card">
       <div class="sdc-card__content">
         <div class="sdc-card__text">
           <h2>Card one</h2>
           <p>Pins, then scales back as card two covers it.</p>
         </div>
         <figure class="sdc-card__art">
           <img src="photo-1.jpg" alt="" />
         </figure>
       </div>
     </li>
     <!-- repeat for the other cards -->
   </ul>
   ```

3. Set `--sdc-numcards` on the wrapper to match your actual card count. Card
   positions 1 to 6 are indexed automatically via `nth-child`; for longer
   stacks give the extra cards an inline index:

   ```html
   <li class="sdc-card" style="--sdc-index: 7">...</li>
   ```

4. Tune the knobs on the wrapper as you like:

   ```css
   .sdc-cards {
     --sdc-card-height: clamp(26rem, 45vw, 36rem); /* height of one card row */
     --sdc-gap: 4vw;            /* space between cards before they stack */
     --sdc-top-offset: 1.25em;  /* visible lip of each buried card */
     --sdc-scale-step: 0.08;    /* size drop per buried card */
   }
   ```

   With the default step of 0.08 a four-card stack settles at scales of
   0.76, 0.84, 0.92 and 1. Card colors are `--sdc-card-bg` and
   `--sdc-card-fg` on `.sdc-card__content`.

See `index.html` for the full markup reference and `preview.html` for a
complete, self-contained Sand & Surf demo.

## How the range math works

Key insight from the original demo: the stickiness sits on `.sdc-card`, but
the animation sits on `.sdc-card__content`. The wrapper is tracked on its
`exit-crossing` range, and each content element maps its start and end to
`index / numcards` of that range. Because the animated element is not the one
defining the grid rows, the available scroll estate is unaffected.

## Source and credit

Adapted from the "Stacking Cards" CSS demo by Bramus Van Damme on
scroll-driven-animations.style:
https://scroll-driven-animations.style/demos/stacking-cards/css/

License: Apache-2.0 (demo by Bramus Van Damme, scroll-driven-animations.style),
adapted with credit. The original stacking-cards concept comes from a
CodyHouse tutorial: https://codyhouse.co/tutorials/how-stacking-cards

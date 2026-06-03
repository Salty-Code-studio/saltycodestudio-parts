# Sticky Stacking Cards

A stack of cards where **each card pins** (via `position: sticky`) and then **scales back and dims** as the next card slides up to cover it. The award-site way to present process steps, feature tiers, or a portfolio reel.

**Tier:** showcase

## Dependencies
- GSAP 3 core
- GSAP **ScrollTrigger** plugin

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

## Files
- `animation.js` — `initStackingCards()`; scrubs each card's scale/brightness as the next one rises.
- `styles.css` — the sticky pinning, card sizing, spacing (= scroll runway), and shadows.
- `preview.html` — self-contained working demo (4 cards).

## Paste-in instructions
1. Copy `styles.css`.
2. Markup — a `.stack-cards` container with N `.stack-card` children:
```html
<section class="stack-cards">
  <article class="stack-card"> ... </article>
  <article class="stack-card"> ... </article>
  <!-- more -->
</section>
```
3. Load GSAP + ScrollTrigger, then call `initStackingCards()`.

```js
import { initStackingCards } from './animation.js';
initStackingCards();
```

## How it works
- **Pinning is pure CSS** (`position: sticky; top: var(--stack-top)`), which is robust and avoids ScrollTrigger pin-spacer reflow for the stack itself.
- GSAP only scrubs the *covered* card's `scale` (→ 0.9) and `filter: brightness` (→ 0.7), keyed to the **next** card's travel from `top bottom` to `top top`. This gives the "card recedes as the next one lands" depth.
- The last card has nothing above it to cover it, so it's intentionally excluded from the recede animation.

## Tunables (CSS variables)
- `--stack-top` — how far from the top a card pins (default `6vh`).
- `--stack-card-h` — card height (default `76vh`).
- The `margin-bottom` on `.stack-card` is the **scroll distance per transition** — increase it for slower, more dramatic stacking.

## Notes
- Adjust the scale/brightness targets in `animation.js` to taste; set `scale: 0.94` for a subtler recede.
- Works with any number of cards (needs at least 2). `invalidateOnRefresh` keeps it correct across resizes/font loads.

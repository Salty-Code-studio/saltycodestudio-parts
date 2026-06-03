# Scroll Text Reveal

Text that **rises up and fades in** (from behind a masked edge) as it enters the viewport. Three modes: whole-element, per-word stagger, or author-your-own lines. The everyday workhorse reveal for headings and copy.

**Tier:** practical

## Dependencies
- GSAP 3 core
- GSAP **ScrollTrigger** plugin

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

## Files
- `animation.js` — `initScrollReveal()` + a tiny dependency-free word splitter.
- `styles.css` — the overflow masks that make the "rise from a clean edge" look.
- `preview.html` — self-contained working demo.

## Paste-in instructions
1. Copy `styles.css`.
2. Tag your text:
   - `data-reveal` — reveal the element as one block.
   - `data-reveal="words"` — auto-splits the text into masked words that stagger.
   - `data-reveal="lines"` — you author each line as `<span class="reveal-line"><span>…</span></span>`.
3. Load GSAP + ScrollTrigger, then call `initScrollReveal()`.

```js
import { initScrollReveal } from './animation.js';
initScrollReveal();
```

## Notes
- Word splitting is plain JS (no paid SplitText plugin). It preserves whitespace, so line wrapping stays natural.
- Reveals fire `once: true`. Remove that and add `toggleActions` if you want them to replay.
- `data-reveal="words"` resets `overflow` on the host to `visible` so each word's own mask works; keep the host element's own clipping off in that mode.
- For accessibility, wrap in a `prefers-reduced-motion` guard if your project requires it.

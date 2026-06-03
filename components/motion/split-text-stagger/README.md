# Split Text Stagger

Splits a heading into **characters or words in plain JS** (no paid GSAP SplitText plugin) and staggers them up into view from behind a mask. Fire on load or on scroll into view.

**Tier:** practical

## Dependencies
- GSAP 3 core
- GSAP **ScrollTrigger** plugin — only required if you use the `data-split-scroll` option; otherwise core alone is enough.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

## Files
- `animation.js` — `initSplitStagger()` + a dependency-free `splitText()` (chars/words).
- `styles.css` — per-unit masks (`overflow: hidden`) so glyphs rise from a clean edge; keeps words from breaking mid-word.
- `preview.html` — self-contained working demo.

## Paste-in instructions
1. Copy `styles.css`.
2. Tag a heading:
```html
<h1 data-split="chars">Make it move.</h1>
<h2 data-split="words" data-split-scroll>Words rise on scroll.</h2>
```
3. Load GSAP (+ ScrollTrigger if using scroll triggers), then call `initSplitStagger()`.

```js
import { initSplitStagger } from './animation.js';
initSplitStagger();
```

## Attributes
- `data-split` — `"chars"` (default) or `"words"`.
- `data-split-scroll` — present → animate when the heading scrolls into view; absent → animate immediately on init.
- `data-split-stagger` — per-unit delay in seconds (defaults: chars `0.03`, words `0.07`).

## Notes
- **Accessibility:** the original text is set as `aria-label` on the heading and every split unit is `aria-hidden`, so screen readers read the clean string, not a pile of single letters.
- Char mode wraps each word in `.split-word { white-space: nowrap }` so splitting never breaks a word across lines.
- Whitespace is preserved as real text nodes, so wrapping and kerning stay natural.
- Pairs well with the `scroll-text-reveal` part — this one is the per-glyph, heading-grade version.

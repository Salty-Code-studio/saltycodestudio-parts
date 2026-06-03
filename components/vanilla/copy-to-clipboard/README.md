# Copy to Clipboard

A copy button using the async Clipboard API with a "Copied!" confirmation that
crossfades in and resets after ~1.6s. Falls back to the legacy `execCommand`
path in non-secure contexts, and shows an error state if copying fails.

## Files

- `styles.css` — button + the idle/done crossfade and error state
- `script.js` — clipboard logic + confirmation handling (delegated)

## Required markup

Copy literal text:

```html
<button class="copy-btn" type="button" data-copy="text to copy">
  <span class="copy-btn__label">
    <span class="copy-btn__idle">Copy</span>
    <span class="copy-btn__done">Copied!</span>
  </span>
</button>
```

Copy another element's text/value:

```html
<code id="snippet">const surf = true;</code>
<button class="copy-btn" type="button" data-copy-target="#snippet" aria-label="Copy code">
  <span class="copy-btn__label">
    <span class="copy-btn__idle">Copy</span>
    <span class="copy-btn__done">Copied!</span>
  </span>
</button>
```

## Wiring rules

- Use **either** `data-copy="…"` (literal) **or** `data-copy-target="#selector"`
  (read another element). For inputs/textareas the `value` is copied; otherwise
  the element's text.
- The two nested spans (`.copy-btn__idle` / `.copy-btn__done`) drive the
  confirmation animation. Keep both.

## Paste-in

1. Copy `styles.css` and `script.js`.
2. Link `styles.css`; load `script.js`.
3. Add buttons with the data attributes.

## Notes

- The Clipboard API requires a secure context (HTTPS or `localhost`); over
  `file://` or plain HTTP the script automatically uses the `execCommand`
  fallback.
- Handlers are delegated, so dynamically added buttons work without re-init.
- `prefers-reduced-motion` simplifies the transition.

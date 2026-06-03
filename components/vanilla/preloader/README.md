# Preloader

A polished full-screen intro loader. A count-up (0–100%) and a progress sweep run
while the page loads; once `window.load` fires the bar races to 100% and the panel
slides up out of view, then removes itself from the DOM. It always resolves — a 6s
safety net and a transition fallback guarantee the page is never left hidden.

## Files

- `styles.css` — loader visuals + the slide-up exit
- `script.js` — progress logic, reveal, and self-removal

## Required markup

Place as the **first child** of `<body>` and add the `preloader-active` class to
`<body>` (prevents a flash of unscrolled content; the script also adds it):

```html
<body class="preloader-active">
  <div class="preloader" id="preloader" role="status" aria-live="polite" aria-label="Loading">
    <div class="preloader__inner">
      <span class="preloader__brand">saltycodestudio</span>
      <div class="preloader__bar"><span class="preloader__fill"></span></div>
      <span class="preloader__count">0%</span>
    </div>
  </div>
  <!-- ...rest of page... -->
</body>
```

## Paste-in

1. Copy `styles.css` and `script.js`.
2. Link `styles.css` in `<head>` and load `script.js` (defer or at end of body).
3. Add the markup above.

## Hooks & customising

- Colors live in `:root` (`--pre-bg`, `--pre-fg`, `--pre-accent`).
- A `preloader:done` event fires on `document` after the loader is removed — handy
  for kicking off hero animations:

  ```js
  document.addEventListener('preloader:done', () => { /* start intro animations */ });
  ```

- `prefers-reduced-motion` is respected: the count animation is skipped and the
  exit becomes a quick fade.

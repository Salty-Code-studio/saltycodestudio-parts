# Theme Switcher

A light/dark theme toggle built on CSS custom properties and a `data-theme`
attribute on `<html>`. The choice persists to `localStorage`, and until the user
makes an explicit choice the UI follows the OS `prefers-color-scheme` (and live
system changes). A tiny inline `<head>` snippet sets the theme before CSS paints,
so there's no flash of the wrong theme.

## Files

- `styles.css` — the light/dark token sets + the animated toggle
- `script.js` — toggling, persistence, OS sync, no-flash fallback

## Required markup

**1) No-flash snippet — first thing in `<head>`, before any stylesheet:**

```html
<script>
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      var sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', stored || (sysDark ? 'dark' : 'light'));
    } catch (e) {}
  })();
</script>
```

**2) The toggle button (id is required):**

```html
<button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">
  <span class="theme-toggle__icon theme-toggle__sun" aria-hidden="true">&#9728;</span>
  <span class="theme-toggle__icon theme-toggle__moon" aria-hidden="true">&#9789;</span>
</button>
```

## Paste-in

1. Add the no-flash snippet at the very top of `<head>`.
2. Link `styles.css`.
3. Add the toggle button.
4. Load `script.js` (defer or end of body).
5. **Build your UI from the tokens** (`var(--bg)`, `var(--text)`, `var(--accent)`,
   `var(--surface)`, `var(--border)`, `var(--text-muted)`, `var(--shadow)`,
   `var(--accent-contrast)`). Override or extend them in `styles.css`.

## JS API (optional)

```js
ThemeSwitcher.get();     // 'light' | 'dark'
ThemeSwitcher.set('dark');
ThemeSwitcher.toggle();
ThemeSwitcher.clear();   // forget the saved choice, follow the OS again
```

## Notes

- The `theme-ready` class is added to `<html>` after first paint so the initial
  load doesn't animate; only user toggles transition.
- `prefers-reduced-motion` disables the color/icon transitions.

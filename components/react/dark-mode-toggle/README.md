# Dark Mode Toggle

An accessible (`role="switch"`, `aria-checked`, `aria-label`) animated theme toggle. The sun rotates/scales out as the moon rotates in. It reads the initial theme from `localStorage` (falling back to the OS `prefers-color-scheme`), toggles the `dark` class on `<html>`, and persists the choice. Hydration-safe.

## Props

| Prop              | Type                              | Default       | Description |
| ----------------- | --------------------------------- | ------------- | ----------- |
| `storageKey`      | `string`                          | `"scs-theme"` | localStorage key. |
| `applyToDocument` | `boolean`                         | `true`        | Toggle the `dark` class on `<html>`. |
| `onChange`        | `(theme: "light"\|"dark") => void`| —             | Fires on theme change. |
| `className`       | `string`                          | `""`          | Extra classes on the button. |

## Dependencies

- `react`
- `tailwindcss` (with class-based dark mode)

## Drop-in

Client component. `"use client"` is already present.

1. Enable class dark mode in `tailwind.config`:

```js
module.exports = { darkMode: "class", content: [/* … */] };
```

2. Use it:

```tsx
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Header() {
  return <DarkModeToggle />;
}
```

3. To avoid a flash of the wrong theme, add a tiny inline script in your document `<head>`:

```html
<script>
  (function () {
    var t = localStorage.getItem("scs-theme");
    var dark = t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  })();
</script>
```

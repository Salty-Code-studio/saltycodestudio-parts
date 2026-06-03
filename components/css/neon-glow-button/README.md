# Neon Glow Button

A pill button wrapped in layered neon: a tight ring, a soft outer halo, a faint
inner fill, and a glowing label. On hover/focus every layer intensifies. Pure
CSS, works on `<button>` or `<a>`.

## Paste-in

1. Copy `styles.css`.
2. Use the class:

```html
<button class="scs-neon-btn" type="button">Launch</button>
<a class="scs-neon-btn scs-neon-btn--sand" href="#">View Work</a>
```

## Customize

- Glow color: set `--scs-neon` (and `--scs-neon-ink` for the label) inline or in
  your own rule.
- Built-in variants: `scs-neon-btn--sand`, `scs-neon-btn--violet`.

## Notes

- Includes a `:focus-visible` state matching the hover glow for keyboard users.
- Uses `color-mix()` for the translucent glow layers (supported in all current
  browsers).

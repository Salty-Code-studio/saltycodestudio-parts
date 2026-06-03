# :has() Sibling Dim Spotlight

A focus-spotlight interaction for any grid or list of cards. Hover (or
keyboard-focus) one item and every sibling dims and desaturates while the
focused item lifts, scales up, and gains an ocean-teal ring. **Pure CSS, no
JavaScript** — the effect that used to require mouse-enter/mouse-leave event
listeners is now a two-rule trick built on the relational `:has()` selector.

## How it works

1. **Dim everyone.** `\.spotlight-grid:has(.spotlight-card:hover) .spotlight-card`
   matches *all* cards whenever the grid contains a hovered card, and fades them
   back. `:has()` is what makes this possible: it lets a parent react to the
   state of one of its children.
2. **Re-light the focused one.** A more specific rule,
   `\.spotlight-grid .spotlight-card:hover`, overrides the dim on just the hovered
   card — restoring full opacity and adding the lift/scale/ring.

The same pair of rules is duplicated for `:focus-visible`, so the spotlight also
follows keyboard focus when the cards are focusable elements (`<a>` / `<button>`).

## Dependencies

None. `:has()` is [Baseline](https://caniuse.com/css-has) and supported in all
current evergreen browsers. There is no JavaScript and no build step.

## Files

- `styles.css` — the canonical, copy-paste styles for the part.
- `index.html` — the markup snippet (a `.spotlight-grid` with `.spotlight-card` children).
- `preview.html` — a self-contained "Sand & Surf" demo you can open directly in a browser.

## Paste-in instructions

1. Copy `styles.css` into your project's stylesheet (or `@import` it).
2. Add the markup from `index.html` — a `.spotlight-grid` containing any number of
   `.spotlight-card` children. Use `<a>` or `<button>` for each card so the
   keyboard `:focus-visible` spotlight works too.
3. Tune the two CSS custom properties on `.spotlight-card` if you want:
   - `--spot-lift` (default `-6px`) — how far the focused card rises.
   - `--spot-scale` (default `1.04`) — how much the focused card grows.

That's it — no wiring, no listeners.

## Accessibility & motion

- Cards are real focusable elements, so the spotlight is reachable by keyboard.
- `prefers-reduced-motion: reduce` removes the transitions and the lift/scale
  transform while keeping the meaningful dim, so motion-sensitive users still get
  clear focus feedback without movement.

## Source / inspiration

Inspired by the sibling-dimming pattern in LogRocket's "Different ways to use
CSS `:has()`" — <https://blog.logrocket.com/blog/different-ways-to-use-css-has/>.
Reimplemented cleanly for this library; article snippets are free to reuse and
`:has()` itself is native Baseline CSS.

# Modal Dialog

An accessible modal: focus trap, Esc to close, backdrop-click close, body scroll
lock, and a fade + scale-in animation. Focus is moved into the dialog on open and
returned to the trigger on close. Everything wires up via data attributes — no
per-modal init.

## Files

- `styles.css` — overlay, dialog, animation, scroll-lock class
- `script.js` — open/close, focus trap, Esc, scroll lock, delegated triggers

## Required markup

```html
<!-- Trigger -->
<button type="button" data-modal-open="demo-modal">Open dialog</button>

<!-- Modal -->
<div class="modal" id="demo-modal" aria-hidden="true">
  <div class="modal__backdrop" data-modal-close></div>
  <div class="modal__dialog" role="dialog" aria-modal="true"
       aria-labelledby="demo-modal-title" aria-describedby="demo-modal-desc">
    <button type="button" class="modal__close" data-modal-close aria-label="Close dialog">&times;</button>
    <h2 class="modal__title" id="demo-modal-title">Dialog title</h2>
    <p class="modal__desc" id="demo-modal-desc">Body content.</p>
    <div class="modal__actions">
      <button type="button" class="btn btn--ghost" data-modal-close>Cancel</button>
      <button type="button" class="btn">Confirm</button>
    </div>
  </div>
</div>
```

## Wiring rules

- **Open:** any element with `data-modal-open="<modal id>"`.
- **Close:** any element with `data-modal-close` inside the modal (the backdrop,
  the X, a Cancel button…).
- The trigger's `id` reference and the modal `id` must match.
- Keep `aria-modal="true"`, `role="dialog"`, and the `aria-labelledby` /
  `aria-describedby` pointers for screen-reader support.

## Paste-in

1. Copy `styles.css` and `script.js`.
2. Link `styles.css`; load `script.js` (defer or end of body).
3. Add a trigger and a modal with matching ids.

## JS API (optional)

```js
Modal.open('demo-modal');
Modal.close('demo-modal'); // or Modal.close() for the active one
```

## Notes

- `prefers-reduced-motion` is respected (the scale animation is dropped).
- Multiple modals are supported; only one is open at a time.

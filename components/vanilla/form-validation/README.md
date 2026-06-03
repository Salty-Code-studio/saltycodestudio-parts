# Accessible Form Validation

Vanilla, dependency-free form validation. Inline errors that fire **on blur**
and **on submit**, `aria-invalid` on every control, messages rendered into a
polite live region, and the first failing field focused when submit fails. Once
a field is in error it re-validates live, so the message clears the moment the
user fixes it.

## Files

- `index.html` — reference markup for a sign-up form (name, email, password, confirm)
- `styles.css` — field, hint, error, valid, focus-visible and submit styling (Sand & Surf)
- `script.js` — validation engine, blur/submit/live handling, ARIA wiring

## How it works

1. Put `data-validate` on the `<form>` and `novalidate` (so the browser hands
   validation to the script). Each control gets `class="field__control"`, an
   `id`, and `aria-describedby` pointing at an error element with
   `class="field__error"`.
2. On blur, the field is validated. On submit, every field is validated; if any
   fail, the default is prevented, the first invalid field is focused, and a
   form-level `role="status"` message is announced.
3. Valid fields get `aria-invalid="false"` and `data-valid="true"`; invalid
   fields get `aria-invalid="true"` and their message text.

## Constraints

Declare rules with native attributes — the script reads them:

| Attribute / rule        | Checks                                            |
| ----------------------- | ------------------------------------------------- |
| `required`              | non-empty                                         |
| `type="email"`          | valid email shape                                 |
| `type="url"`            | parseable URL                                     |
| `type="number"`         | `min` / `max` bounds                              |
| `minlength` / `maxlength` | length bounds                                   |
| `pattern="…"`           | regex (anchored automatically)                    |
| `data-match="<id>"`     | value equals another field (e.g. confirm password) |

### Custom messages

Override any default message with `data-error-<rule>` on the control:

```html
<input
  id="email" type="email" required
  aria-describedby="email-error"
  data-error-required="We need an email to reach you."
  data-error-type="That doesn't look like a valid email." />
<p class="field__error" id="email-error" aria-live="polite"></p>
```

Supported keys: `data-error-required`, `data-error-type`, `data-error-match`,
`data-error-minlength`, `data-error-maxlength`, `data-error-pattern`,
`data-error-min`, `data-error-max`.

## Required markup (per field)

```html
<div class="field">
  <label class="field__label" for="email">Email</label>
  <input class="field__control" id="email" name="email" type="email" required
         aria-describedby="email-error" />
  <p class="field__error" id="email-error" aria-live="polite"></p>
</div>
```

For a hint, add a `.field__hint` with its own id and list both ids in
`aria-describedby` (hint first, error last):
`aria-describedby="email-hint email-error"`.

## Paste-in

1. Copy `styles.css` and `script.js` into your project.
2. Link `styles.css`; load `script.js` (with `defer` or at the end of `<body>`).
3. Build your form with the markup above. Add `data-validate` and `novalidate`
   to the `<form>`, and a `<p class="form__status" role="status" aria-live="polite"></p>`
   for the form-level message.
4. The script auto-initialises all `form[data-validate]` on load.

### Demo vs. real submit

The preview uses `data-demo` on the form so a valid submit doesn't navigate.
Remove `data-demo` so the form posts normally, or replace the success branch in
`script.js` with your own `fetch`/submit logic.

### Dynamically inserted forms

Call `FormValidation.init(rootElement)` after injecting new markup. You can also
validate a single control programmatically with
`FormValidation.validate(controlEl)` (returns the message string, or `""` when valid).

## Accessibility

- `aria-invalid` reflects each control's state.
- Error text lives in `aria-live="polite"` regions tied via `aria-describedby`.
- The form-level summary is a `role="status"` live region.
- The first invalid field receives focus on failed submit.
- `:focus-visible` gives keyboard users a clear ring without bothering mouse users.
- Error rows reserve height (`min-height`) to avoid layout shift when messages appear.
- `prefers-reduced-motion` drops transitions.

## Deps

None.

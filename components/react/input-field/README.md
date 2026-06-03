# Input Field

An accessible, production-ready text input for React. Supports a floating or standard
label, helper text, an error state, leading/trailing icons (the trailing slot accepts
interactive elements like a show-password toggle), and a required indicator. Styled with
Tailwind in the saltycodestudio "Sand & Surf" palette.

## Preview

Open `preview.html` in any browser — it is fully self-contained (React 18 UMD,
ReactDOM, Babel Standalone, and the Tailwind Play CDN) and renders every variant and
state on the brand palette.

## Props

| Prop           | Type                                   | Default        | Description |
| -------------- | -------------------------------------- | -------------- | ----------- |
| `label`        | `string` (required)                    | —              | Visible label text. |
| `labelVariant` | `"floating" \| "standard"`             | `"standard"`   | Floating animates the label up on focus/value; standard renders it above the field. |
| `helperText`   | `string`                               | —              | Hint shown beneath the field. Hidden while an error is present. |
| `error`        | `string`                               | —              | When set, flips the field into the error state and renders the message with `role="alert"`. |
| `leadingIcon`  | `React.ReactNode`                      | —              | Icon at the start of the field (decorative, `aria-hidden`). |
| `trailingIcon` | `React.ReactNode`                      | —              | Icon or interactive control at the end of the field. |
| `required`     | `boolean`                              | `false`        | Shows a `*` next to the label and sets `aria-required` / `required`. |
| `className`    | `string`                               | `""`           | Applied to the outer wrapper for layout. |

All other standard `<input>` attributes (`type`, `value`, `defaultValue`, `onChange`,
`placeholder`, `name`, `autoComplete`, `disabled`, …) are forwarded to the element, and
the component forwards its `ref` to the underlying `<input>`. Works controlled
(`value` + `onChange`) or uncontrolled (`defaultValue`).

## Variants & states

- **Standard label** — label sits above the field.
- **Floating label** — label overlays the field and lifts on focus or when filled. A
  `placeholder` keeps the label floated so the two never overlap.
- **Helper text** — muted hint below the field.
- **Error** — rose border + ring, an alert message, and `aria-invalid`. Error text
  takes priority over helper text.
- **Disabled** — dimmed, non-interactive.
- **Leading / trailing icons** — icons tint with focus and error state.
- **Required** — asterisk on the label plus the matching ARIA attributes.

## Accessibility

- Label is tied to the input via `htmlFor` / `id` (an `id` is auto-generated with
  `useId` when none is provided).
- `aria-describedby` points at the helper or error text; the error uses `role="alert"`.
- `aria-invalid` and `aria-required` reflect the error and required props.
- Visible focus styling via the field's `focus-within` ring; the example
  show/hide-password toggle uses `focus-visible` rings and a proper `aria-label`.

## Dependencies

None beyond React and Tailwind (which you almost certainly already have).

## Paste-in

1. Copy `InputField.tsx` into your components folder (e.g. `components/InputField.tsx`).
2. Ensure Tailwind is configured in your project.
3. Use it:

```tsx
import InputField from "./InputField";

<InputField
  label="Email address"
  type="email"
  required
  leadingIcon={<MailIcon />}
  helperText="We'll never share it."
  error={errors.email}
/>;
```

License: MIT · Source: saltycodestudio-parts (original)

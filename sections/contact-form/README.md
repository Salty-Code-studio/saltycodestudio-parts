# Contact Form

A validated contact section that pairs a name / email / message form with a
card of studio contact details (email, phone, studio address, hours) and a
stylized, dependency-free map placeholder. Validation runs client-side on
submit and clears per field as the visitor fixes each one; the email field is
checked against a light format pattern and the message against a 10-character
minimum. On a successful send the form swaps to a "Message on its way."
thank-you state with a control to send another. Errors are wired with
`aria-invalid` / `aria-describedby`, the sending state disables the button, and
the whole thing works on its own with no backend (the send is simulated).

Part of **saltycodestudio-parts**. Brand palette: **Sand & Surf** (sand/cream
surfaces, ink text, ocean-teal accents, coral pin).

## Variants

- **`ContactForm.tsx`** — React + Tailwind component, typed props, sensible
  defaults. State (errors, sending, sent) is managed with `useState`.
- **`section.html`** — the same section as plain HTML + Tailwind utility
  classes, with a small scoped vanilla `<script>` for validation and the
  thank-you toggle. No React.
- **`preview.html`** — a standalone page (Tailwind Play CDN) that renders the
  HTML variant in context. Open it directly in a browser.

## React props (`ContactForm.tsx`)

| Prop          | Type                              | Default                                | Description                                                                                  |
| ------------- | --------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------- |
| `eyebrow`     | `string`                          | `"~< Say hello"`                       | Small mono label above the headline. Empty string hides it.                                  |
| `headline`    | `string`                          | `"Let's talk about your build."`       | Main headline. Keep it short and confident.                                                  |
| `subcopy`     | `string`                          | short supporting line                  | Supporting copy under the headline. Empty string hides it.                                   |
| `details`     | `ContactDetail[]`                 | email / phone / studio / hours         | Contact rows rendered in the right-hand card.                                                |
| `mapCaption`  | `string`                          | `"Kralendijk, Bonaire — Dutch Caribbean"` | Caption overlaid on the map placeholder (also used in its `aria-label`).                   |
| `submitLabel` | `string`                          | `"Send message"`                       | Label on the submit button.                                                                  |
| `footnote`    | `string`                          | reassurance line                       | Small line beside the submit button. Empty string hides it.                                  |
| `ariaLabel`   | `string`                          | `"Contact us"`                         | Accessible label for the `<section>` landmark.                                               |
| `onSubmit`    | `(data: FormData) => void \| Promise<void>` | `undefined`                  | Submit handler, called with validated `FormData`. If omitted, the send is simulated (~700ms). |

`ContactDetail` is `{ label: string; value: string; href?: string; icon?: "mail" | "phone" | "pin" | "clock" }`.
When `href` is set the value renders as a link; otherwise as plain text. `icon`
selects one of the four built-in inline SVGs (defaults to `mail`).

### Use it

```tsx
import ContactForm from "./ContactForm";

export default function Page() {
  return (
    <ContactForm
      headline="Start a project"
      details={[
        { label: "Email", value: "hello@studio.dev", href: "mailto:hello@studio.dev", icon: "mail" },
        { label: "Studio", value: "Remote-first, island-rooted", icon: "pin" },
      ]}
      onSubmit={async (data) => {
        await fetch("/api/contact", { method: "POST", body: data });
      }}
    />
  );
}
```

Validation always runs before `onSubmit`; your handler only receives data once
name, email, and message pass. Throwing from `onSubmit` returns the form to its
editable state so the visitor can retry.

## HTML variant (`section.html`)

1. Paste the `<section>` markup where you want the contact block.
2. Paste the `<script>` block **once** per page (near `</body>`). It is scoped
   to the form by `id="cf-form"` and guards against double-binding, so it is
   safe to include even if the snippet appears more than once.
3. Wire the real send yourself: the script currently simulates success with a
   `setTimeout`. Replace that block with a `fetch` to your endpoint (or a
   normal form POST) and toggle the `[data-cf-success]` panel on resolve.
4. Tailwind must be present (build pipeline or the Play CDN, as in
   `preview.html`). Fonts (`.font-display`, `.font-mono`) are optional.

The markup hooks the script relies on: `#cf-form`, each field by `name`
(`name` / `email` / `message`), the `[data-error-for="…"]` paragraphs, the
`[data-cf-submit]` button with its `[data-cf-label]` span, the
`[data-cf-success]` panel, and the `[data-cf-reset]` button inside it. Keep
those attributes if you restyle the section.

## Accessibility notes

- Every field has an associated `<label for>`; invalid fields get
  `aria-invalid="true"` and point at their error text via `aria-describedby`.
- The thank-you panel is a `role="status"` region so the success message is
  announced.
- The map placeholder is a `role="img"` with a descriptive `aria-label`.
- Focus is moved to the first invalid field on a failed submit, and to the name
  field when the form is re-opened from the thank-you state.
- Buttons and inputs carry visible `focus-visible` rings offset against the
  sand canvas.

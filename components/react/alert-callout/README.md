# Alert Callout

An accessible callout / alert for surfacing status messages: **info**, **success**, **warning**, and **error**. Each variant ships with a matching inline SVG icon, an optional title, freeform body content, and an optional dismiss button. Styled on the Sand & Surf palette.

## Why it's accessible

- `info` and `success` render as `role="status"` with `aria-live="polite"` — they announce without interrupting.
- `warning` and `error` render as `role="alert"` with `aria-live="assertive"` — they interrupt, which is correct for problems.
- When a `title` is supplied, the region is wired up with `aria-labelledby`.
- The dismiss control is a real `<button type="button">` with an `aria-label`, full keyboard support, and a `focus-visible` ring.
- Icons are `aria-hidden`, so assistive tech reads only the message text.

## Props

| Prop           | Type                                          | Default       | Description                                                                 |
| -------------- | --------------------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `variant`      | `"info" \| "success" \| "warning" \| "error"` | `"info"`      | Visual and semantic variant (drives colors, icon, and ARIA role/live).      |
| `title`        | `ReactNode`                                   | —             | Optional bold heading above the body.                                       |
| `children`     | `ReactNode`                                   | —             | Body content of the callout.                                                |
| `onDismiss`    | `() => void`                                  | —             | When provided, renders a dismiss (×) button and calls this on click.        |
| `dismissLabel` | `string`                                       | `"Dismiss"`   | Accessible label for the dismiss button.                                    |
| `icon`         | `ReactNode \| null`                           | variant icon  | Override the default icon. Pass `null` to hide it.                          |
| `className`    | `string`                                       | `""`          | Extra classes for the root element.                                         |

## Variants & states

- **info** — teal ocean accent, polite announcement.
- **success** — green, polite announcement.
- **warning** — amber, assertive announcement.
- **error** — terracotta red, assertive announcement.
- **dismissible** — any variant with `onDismiss` set.
- **title-only / body-only** — `title` and `children` are each optional.
- **no icon** — pass `icon={null}`.

## Dependencies

None. Icons are inline SVG. Styling uses Tailwind utility classes (Tailwind must be present in your project).

## Paste-in

1. Copy `AlertCallout.tsx` into your components folder.
2. Ensure Tailwind CSS is configured in your project.
3. Use it:

```tsx
import { useState } from "react";
import AlertCallout from "./AlertCallout";

export function Example() {
  const [show, setShow] = useState(true);

  return (
    <div className="space-y-3">
      <AlertCallout variant="info" title="New region available">
        We just turned on an edge node closer to your visitors.
      </AlertCallout>

      <AlertCallout variant="success" title="Deploy succeeded">
        Your site is live worldwide.
      </AlertCallout>

      <AlertCallout variant="warning">
        Your SSL certificate renews in 3 days.
      </AlertCallout>

      {show && (
        <AlertCallout
          variant="error"
          title="Build failed"
          onDismiss={() => setShow(false)}
        >
          Module <code>./surf</code> could not be resolved.
        </AlertCallout>
      )}
    </div>
  );
}
```

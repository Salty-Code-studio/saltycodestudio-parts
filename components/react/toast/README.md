# Toast

A lightweight, accessible toast notification system for React — a `<ToastProvider>` plus a `useToast()` hook. Toasts stack, come in four variants, auto-dismiss with a pausable countdown bar, and animate in and out. Styled in the **Sand & Surf** palette with Tailwind. Zero runtime dependencies beyond React.

## What it is

- **Provider + hook.** Mount one `<ToastProvider>` near the root of your app. Anywhere underneath, call `useToast()` to push toasts imperatively.
- **Stacked.** Multiple toasts render in a fixed live region; the oldest is auto-dismissed once you exceed `max`.
- **Variants.** `info`, `success`, `warning`, `error` — each with its own icon, accent and ARIA role (`status` for info/success, `alert` for warning/error).
- **Auto-dismiss.** Configurable per toast; a thin progress bar counts down and pauses while the toast is hovered or focused. Set `duration: 0` (or `Infinity`) for a sticky toast.
- **Animated.** Slide + fade on enter and exit, gated behind `motion-safe:` so it respects `prefers-reduced-motion`.

## Accessibility

- The viewport is an `aria-live="polite"` region labelled "Notifications". `warning`/`error` toasts escalate to `role="alert"` / `aria-live="assertive"`.
- Each toast is focusable (`tabIndex={0}`); pressing **Esc** while it is focused dismisses it.
- The variant name is exposed to screen readers via a visually-hidden prefix, so "Success: Booking confirmed" is announced.
- Close and action buttons are real `<button>`s with `aria-label` and `focus-visible` rings.

## API

### `<ToastProvider>` props

| Prop              | Type            | Default          | Description                                              |
| ----------------- | --------------- | ---------------- | -------------------------------------------------------- |
| `children`        | `ReactNode`     | —                | Your app.                                                |
| `position`        | `ToastPosition` | `"bottom-right"` | One of `top-left`/`top-center`/`top-right`/`bottom-*`.   |
| `max`             | `number`        | `4`              | Max visible toasts; oldest is dismissed past this.       |
| `defaultDuration` | `number`        | `5000`           | Default auto-dismiss in ms for toasts that omit one.     |

### `useToast()` returns

| Method        | Signature                       | Description                                       |
| ------------- | ------------------------------- | ------------------------------------------------- |
| `toast`       | `(opts: ToastOptions) => string`| Push (or update, by `id`) a toast. Returns its id.|
| `dismiss`     | `(id: string) => void`          | Start the exit animation for one toast.           |
| `dismissAll`  | `() => void`                    | Dismiss every visible toast.                      |

### `ToastOptions`

| Field         | Type                                   | Default  | Description                                            |
| ------------- | -------------------------------------- | -------- | ------------------------------------------------------ |
| `title`       | `string`                               | —        | Bold heading line.                                     |
| `description` | `string`                               | —        | Body text. (Provide `title` and/or `description`.)     |
| `variant`     | `"info" \| "success" \| "warning" \| "error"` | `"info"` | Visual + semantic variant.                      |
| `duration`    | `number`                               | provider | Auto-dismiss ms. `0`/`Infinity` = sticky.              |
| `action`      | `{ label: string; onClick: () => void \| boolean }` | — | Optional action button. Return `false` to keep the toast open. |
| `id`          | `string`                               | auto     | Pass a stable id to update an existing toast in place. |

## Usage

```tsx
import { ToastProvider, useToast } from "./Toast";

function App() {
  return (
    <ToastProvider position="bottom-right" max={4} defaultDuration={5000}>
      <Page />
    </ToastProvider>
  );
}

function Page() {
  const { toast } = useToast();
  return (
    <button
      onClick={() =>
        toast({
          title: "Booking confirmed",
          description: "We sent the itinerary to your inbox.",
          variant: "success",
          action: { label: "View", onClick: () => navigate("/itinerary") },
        })
      }
    >
      Confirm
    </button>
  );
}
```

## Paste-in instructions

1. Copy `Toast.tsx` into your components folder.
2. Tailwind is required (the component uses utility classes). No other dependencies.
3. Add the countdown keyframes once — either keep the exported `toastKeyframes` string injected via a `<style>` tag, or add this to your global CSS / `tailwind.config` so the `toast-countdown` animation resolves:

   ```css
   @keyframes toast-countdown {
     from { width: 100%; }
     to   { width: 0%; }
   }
   ```

4. Wrap your app in `<ToastProvider>` and call `useToast()` from any descendant.

## Deps

None (React + Tailwind only). No `framer-motion` — animation is pure CSS.

## License

MIT — `saltycodestudio-parts (original)`.

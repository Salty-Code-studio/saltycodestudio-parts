# Choice Controls

A `Checkbox`, `RadioGroup` + `Radio`, and `Toggle` switch that share one **Sand & Surf** design language. Each control wraps a real, focusable native element (or `role="switch"` button) so keyboard, form, and screen-reader behaviour come for free. Selected/checked states paint in ocean teal (`#1f8a8a`); every control shows a `focus-visible` ring.

Single file, three named exports plus a default namespace object.

## Accessibility

- **Checkbox / Radio** — a visually-hidden native `<input>` carries all semantics; the painted box is `aria-hidden`. `indeterminate` sets the real DOM property (announced as "mixed").
- **RadioGroup** — wrapper is `role="radiogroup"` with `aria-labelledby`; native radios give arrow-key roving focus and single-selection.
- **Toggle** — a `<button role="switch">` with `aria-checked`; responds to Space/Enter. Provide `aria-label` when there is no visible `label`.
- Labels are clickable (`<label htmlFor>`); `description` is wired via `aria-describedby`.
- Focus ring: `focus-visible:ring-[#2ec3c3]/55` with an offset against the sand background.

## Exports

```ts
import ChoiceControls, { Checkbox, RadioGroup, Radio, Toggle } from "@/components/ChoiceControls";
// ChoiceControls = { Checkbox, RadioGroup, Radio, Toggle }
```

## Props

### `Checkbox` — extends native `<input type="checkbox">` props

| Prop            | Type                  | Default | Description |
| --------------- | --------------------- | ------- | ----------- |
| `label`         | `ReactNode`           | —       | Visible label beside the box. |
| `description`   | `ReactNode`           | —       | Helper line; linked via `aria-describedby`. |
| `indeterminate` | `boolean`             | `false` | Mixed (dash) state. |
| `size`          | `"sm" \| "md" \| "lg"` | `"md"`  | Control footprint. |
| `disabled`, `checked`, `defaultChecked`, `onChange`, … | native | — | Standard input props pass through. |

### `RadioGroup`

| Prop           | Type                          | Default      | Description |
| -------------- | ----------------------------- | ------------ | ----------- |
| `label`        | `ReactNode`                   | —            | Group label (`aria-labelledby`). |
| `name`         | `string`                      | auto         | Shared form name. |
| `value`        | `string`                      | —            | Controlled selection. |
| `defaultValue` | `string`                      | —            | Uncontrolled initial value. |
| `onChange`     | `(value: string) => void`     | —            | Selection callback. |
| `size`         | `"sm" \| "md" \| "lg"`         | `"md"`       | Applied to all radios. |
| `disabled`     | `boolean`                     | —            | Disable all options. |
| `orientation`  | `"vertical" \| "horizontal"`  | `"vertical"` | Layout direction. |

### `Radio` — render inside a `RadioGroup`

| Prop          | Type        | Description |
| ------------- | ----------- | ----------- |
| `value`       | `string`    | Required option value. |
| `label`       | `ReactNode` | Visible label. |
| `description` | `ReactNode` | Helper line. |
| `disabled`    | `boolean`   | Disable just this option. |

### `Toggle`

| Prop             | Type                       | Default | Description |
| ---------------- | -------------------------- | ------- | ----------- |
| `checked`        | `boolean`                  | —       | Controlled state. |
| `defaultChecked` | `boolean`                  | `false` | Uncontrolled initial state. |
| `onChange`       | `(checked: boolean) => void` | —     | Change callback. |
| `label`          | `ReactNode`                | —       | Visible label. |
| `description`    | `ReactNode`                | —       | Helper line. |
| `size`           | `"sm" \| "md" \| "lg"`      | `"md"`  | Track + thumb size. |
| `disabled`       | `boolean`                  | —       | Disable the switch. |
| `labelLeft`      | `boolean`                  | `false` | Place label before the switch. |
| `aria-label`     | `string`                   | —       | Required when no visible `label`. |

## Dependencies

- `react` (18+)
- `tailwindcss` (uses `peer-*` and `focus-visible` utilities)

## Drop-in

1. Copy `ChoiceControls.tsx` into your components folder (e.g. `@/components/ChoiceControls.tsx`). It is already a client component (`"use client"`).
2. Ensure Tailwind scans the file so the `peer-checked`, `peer-indeterminate`, and arbitrary color classes are generated.
3. Use it:

```tsx
import { Checkbox, RadioGroup, Radio, Toggle } from "@/components/ChoiceControls";

export default function Preferences() {
  const [plan, setPlan] = useState("studio");
  return (
    <form className="flex flex-col gap-6">
      <Checkbox label="Subscribe to the Tide Report" defaultChecked />

      <RadioGroup label="Choose a plan" value={plan} onChange={setPlan}>
        <Radio value="starter" label="Starter" description="One landing page." />
        <Radio value="studio" label="Studio" description="Up to eight pages." />
      </RadioGroup>

      <Toggle label="Dark mode" defaultChecked />
    </form>
  );
}
```

License: MIT.

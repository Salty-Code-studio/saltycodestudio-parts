# Logo Marquee

An infinite, seamlessly-looping horizontal row of client/partner logos. The set is duplicated and translated `-50%`, so the loop is perfectly continuous. Edge fade via CSS mask, pause-on-hover, reversible direction, and `motion-reduce` support. Logos can be wordmark strings or any React node (`<img>`, `<svg>`).

## Props

| Prop        | Type                 | Default | Description |
| ----------- | -------------------- | ------- | ----------- |
| `logos`     | `React.ReactNode[]`  | 8 wordmarks | Strings or nodes. |
| `speed`     | `number`             | `30`    | Seconds per full loop (lower = faster). |
| `direction` | `"left" \| "right"`  | `"left"`| Scroll direction. |
| `title`     | `string`             | sample  | Optional heading; pass `""` to hide. |
| `className` | `string`             | `""`    | Extra classes on `<section>`. |

## Dependencies

- `react`
- `tailwindcss`

## Drop-in

No client directive required (pure CSS animation; works as a server component).

```tsx
import LogoMarquee from "@/components/LogoMarquee";

<LogoMarquee
  logos={[
    <img key="a" src="/logos/acme.svg" alt="Acme" className="h-7" />,
    "Globex",
    "Initech",
  ]}
  speed={26}
/>
```

The `@keyframes scs-marquee` rule is injected via a scoped `<style>` tag, so no Tailwind config is needed. Ensure Tailwind scans the file.

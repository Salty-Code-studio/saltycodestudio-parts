# Shrinking Sticky Navbar

A sticky header that condenses its height, scales the logo, and fades in a frosted backdrop blur once the page is scrolled past a threshold. Sand & Surf palette.

## Props

| Prop        | Type        | Default            | Description |
| ----------- | ----------- | ------------------ | ----------- |
| `brand`     | `string`    | `"saltycodestudio"`| Brand text. |
| `links`     | `NavLink[]` | 4 sample links     | Nav links (`{ label, href }`). |
| `ctaLabel`  | `string`    | `"Start a project"`| CTA button text. |
| `ctaHref`   | `string`    | `"#contact"`       | CTA href. |
| `threshold` | `number`    | `24`               | Scroll offset (px) that triggers the condensed state. |
| `className` | `string`    | `""`               | Extra classes on `<header>`. |

## Dependencies

- `react`
- `tailwindcss`

## Drop-in

This component uses `useState`/`useEffect`, so it is a **client component**.

1. Copy `ShrinkingStickyNavbar.tsx` into `components/`.
2. In Next.js App Router the `"use client"` directive is already at the top — just import and place it in your layout. In Vite/Pages Router the directive is harmlessly ignored.

```tsx
import ShrinkingStickyNavbar from "@/components/ShrinkingStickyNavbar";

export default function Layout({ children }) {
  return (
    <>
      <ShrinkingStickyNavbar />
      {children}
    </>
  );
}
```

Ensure Tailwind scans the file in your `content` config.

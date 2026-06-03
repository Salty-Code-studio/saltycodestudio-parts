# Testimonial Carousel

An auto-advancing testimonial slider with animated dot navigation, prev/next arrows, pause-on-hover, and smooth fade/slide transitions. Avatars fall back to initials. Sand & Surf palette.

## Props

| Prop           | Type            | Default     | Description |
| -------------- | --------------- | ----------- | ----------- |
| `testimonials` | `Testimonial[]` | 3 samples   | Quotes to cycle through. |
| `interval`     | `number`        | `5000`      | Auto-advance interval in ms. `0` disables auto-play. |
| `className`    | `string`        | `""`        | Extra classes on `<section>`. |

### `Testimonial`

| Field    | Type      | Description |
| -------- | --------- | ----------- |
| `quote`  | `string`  | The testimonial text. |
| `name`   | `string`  | Author name. |
| `role`   | `string`  | Author role/company. |
| `avatar` | `string?` | Avatar image URL; initials shown if omitted. |

## Dependencies

- `react`
- `tailwindcss`

## Drop-in

Client component (uses hooks + a timer). `"use client"` is already present for Next.js App Router.

```tsx
import TestimonialCarousel from "@/components/TestimonialCarousel";

export default function Page() {
  return <TestimonialCarousel interval={6000} />;
}
```

Pausing on hover prevents the slide from changing mid-read. Ensure Tailwind scans the file.

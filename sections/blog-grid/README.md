# Blog Grid

A responsive blog post grid for the **Sand & Surf** palette. Each card pairs a cover image, a category tag pinned over the image, the post title (a stretched link covering the whole card), a short excerpt, and an author / date / read-time meta row.

- Three columns on large screens, two on tablets, one on mobile.
- Cards are equal-height with a subtle lift-and-shadow hover, an image zoom, and a full-card click target via a stretched `::before` link.
- Accessible: real `<a>` links, a `<time>` element with `datetime`, decorative covers marked `aria-hidden`, visible `focus-visible` states, and a labelled section landmark.
- Cover images fall back to an on-brand teal gradient placeholder (inline SVG), so the section renders with zero external assets. Pass a real `coverImage` URL to use a photo.

## Files

- `BlogGrid.tsx` — React + Tailwind component (typed props, sensible defaults).
- `section.html` — the same section as plain HTML + Tailwind utility classes (no React).
- `preview.html` — a standalone page (Tailwind Play CDN) that renders the HTML variant in a browser.

## Props (`BlogGrid.tsx`)

| Prop           | Type         | Default                | Description                                              |
| -------------- | ------------ | ---------------------- | -------------------------------------------------------- |
| `eyebrow`      | `string`     | `"From the journal"`   | Small uppercase label above the heading.                 |
| `heading`      | `string`     | `"Notes from the studio"` | Section heading.                                      |
| `intro`        | `string`     | studio blurb           | Supporting paragraph under the heading.                  |
| `viewAllLabel` | `string`     | `"View all posts"`     | Header link label; pass `""` to hide the link.           |
| `viewAllHref`  | `string`     | `"#blog"`              | Header link destination.                                 |
| `posts`        | `BlogPost[]` | 6 sample posts         | The posts to render.                                     |
| `ariaLabel`    | `string`     | `"Latest blog posts"`  | Accessible label for the `<section>` landmark.           |

### `BlogPost`

| Field        | Type     | Notes                                                            |
| ------------ | -------- | ---------------------------------------------------------------- |
| `id`         | `string` | Unique key.                                                      |
| `title`      | `string` | Card heading + link text.                                        |
| `excerpt`    | `string` | One- or two-sentence summary.                                    |
| `category`   | `string` | Shown as a pill over the cover image.                            |
| `href`       | `string` | Link to the full article.                                        |
| `author`     | `string` | Shown in the meta row; initials drive the avatar fallback.       |
| `date`       | `string` | Human-readable date, e.g. `"May 28, 2026"`.                      |
| `dateTime`   | `string?`| Machine-readable date for `<time>`, e.g. `"2026-05-28"`.        |
| `readTime`   | `string?`| Estimated read time, e.g. `"6 min read"`.                       |
| `coverImage` | `string?`| Image URL. Omit to use the branded gradient placeholder.        |
| `coverAlt`   | `string?`| Alt text for the cover image (use `""` for decorative covers).  |

## Use it

### React

```tsx
import BlogGrid from "./BlogGrid";

export default function JournalPage() {
  return (
    <BlogGrid
      heading="Notes from the studio"
      posts={[
        {
          id: "first",
          title: "How we ship a marketing site without a six-month rewrite",
          excerpt: "A look at the tight sprint cadence we use to get a live staging link in week one.",
          category: "Process",
          href: "/journal/ship-without-rewrite",
          author: "Mona Chayo",
          date: "May 28, 2026",
          dateTime: "2026-05-28",
          readTime: "6 min read",
          coverImage: "/covers/ship.jpg",
          coverAlt: "Sticky notes mapping a project sprint board",
        },
        // ...more posts
      ]}
    />
  );
}
```

### Plain HTML

Copy the `<section>` from `section.html` into any page that already loads Tailwind. Replace the inline SVG placeholder in each card's cover `<div>` with an `<img src="..." alt="..." class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" loading="lazy" />` when you have real photos.

### Preview

Open `preview.html` in a browser. It pulls Tailwind from the Play CDN and drops the HTML variant onto a Sand & Surf page with a minimal nav and footer for context — no build step, no React.

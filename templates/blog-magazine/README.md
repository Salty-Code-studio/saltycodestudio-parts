# Blog / Magazine — `blog-magazine`

A polished, single-file editorial landing page for a blog or online magazine. It
reads like a real publication, not a wireframe: a dated masthead, a featured lead
essay, a category-filterable archive, recurring columns, an editor's pick with a
most-read sidebar, a newsletter call-to-action, and a full footer.

Built with the **Sand & Surf** palette and an editorial type system (Fraunces
serif + Space Grotesk + JetBrains Mono accents) for a calm, paper-like feel.

## What it is

A complete, runnable page in one `index.html` file. It loads
[Tailwind via the Play CDN](https://cdn.tailwindcss.com) (no build step) with an
inline `tailwind.config` that defines the brand colors and fonts. The file *is*
both the page and its own preview.

### Sections, top to bottom

1. **Nav** — sticky, blur-backed, elevates on scroll; working mobile menu with
   Escape-to-close; search affordance and a Subscribe CTA.
2. **Featured hero / masthead** — issue line + date, a large lead essay with
   author byline, a cover image with caption, and a three-up "Also today" row.
3. **Topic marquee** — a quiet auto-scrolling band of section names.
4. **Latest** — a responsive post grid with **client-side category filtering**
   (All / Design / Engineering / Type / Culture) and an empty state.
5. **Columns** — a dark four-up band of recurring weekly departments.
6. **Editor's pick** — a long-form teaser with a drop cap, paired with a
   "Most read this month" ranked sidebar.
7. **Newsletter CTA** — "The Sunday Letter" with inline email validation.
8. **Footer** — brand, social links, three link columns, legal row.

### Interactions (vanilla JS, no dependencies)

- Mobile hamburger menu with `aria-expanded`, icon swap, and Escape-to-close.
- Header shadow elevation on scroll.
- `IntersectionObserver` scroll-reveal animations (respects
  `prefers-reduced-motion`).
- Category filter buttons with proper `aria-pressed` state and an empty state.
- Newsletter form with email validation and a polite live-region status message.

## Who it's for

Writers, studios, dev-tool teams, and independent publications that want a
content-first home with an editorial voice — blogs, newsletters, zines, company
journals, or a "writing" subsection of a larger site.

## How to adapt / clone

1. **Copy the folder** (or just `index.html`) into your project. Open it in a
   browser — it works immediately.
2. **Rebrand colors & fonts** in the inline `tailwind.config` `theme.extend`
   block and the `<style>` font-family rules. The palette tokens are `cream`,
   `sand`, `dune`, `ink`, `ink-soft`, `teal`, `teal-deep`, and `surf`.
3. **Replace the copy** — wordmark, issue line, headlines, bylines, and the
   footer links. All text is real, editable copy (no lorem).
4. **Swap images** — the cover and card images use Unsplash URLs; point them at
   your own art and keep the descriptive `alt` text accurate.
5. **Wire up categories** — each `.post` article carries a
   `data-category="..."` attribute that the filter buttons (`data-filter="..."`)
   match against. Add categories by adding a button + matching cards.
6. **Connect the newsletter form** — the form currently validates and shows a
   success message client-side; replace the submit handler with a `fetch()` to
   your provider (Buttondown, Mailchimp, ConvertKit, etc.).
7. **Going to production?** For best performance, swap the Play CDN for a real
   Tailwind build so unused utilities are purged.

## License

MIT — part of `saltycodestudio-parts` (original work). Use it freely.

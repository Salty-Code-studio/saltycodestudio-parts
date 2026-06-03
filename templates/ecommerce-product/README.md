# Ecommerce Product

A complete, premium **single-product e-commerce page** (PDP / product landing) for
**saltycodestudio-parts**, in the "Sand & Surf" palette. Built as one self-contained
`index.html` — it is both the runnable page and its own preview.

The demo sells the *Litoral 24h Flask* by a fictional coastal brand, **Sereia Goods**,
so every piece of copy is real and on-theme — no lorem ipsum.

- **Category:** template · **Tier:** showcase
- **Files:** `index.html` (the whole page + preview), `part.json`, `README.md`

## What it is

A composed, conversion-ready product page with:

1. **Announcement bar** — shipping / trial / warranty pitch.
2. **Sticky navbar** with search, account, a live **cart badge**, and a working
   mobile hamburger sheet. Elevates on scroll.
3. **Product hero** — a sticky **gallery** (CSS-rendered product + thumbnail rail that
   swaps the active view) beside a **buy box** with breadcrumb, star rating, colour
   swatches, size selector, quantity stepper, and an **Add to cart** button whose
   price updates live from size × quantity. Includes a trust row.
4. **Press marquee** — an auto-scrolling "as featured in" strip.
5. **Features grid** — six benefit cards with hover lift.
6. **Feature showcase** — a dark thermal-core split with an inline SVG temperature chart.
7. **Specs** — a "what's in the box" panel plus a full specification table.
8. **Reviews** — rating summary with distribution bars and six verified-buyer cards.
9. **Related products** — four cross-sell cards with hover "quick add".
10. **CTA band** + **footer** with shop/support/studio columns and a working
    newsletter signup.
11. A slide-in **cart drawer** (add / remove items, live subtotal, focus trap-friendly,
    Escape-to-close, backdrop dismiss, body-scroll lock) and a **toast** confirmation.

## Who it's for

Anyone shipping a hero product, a Kickstarter-style landing page, a DTC brand store,
or a "feature one thing well" marketing page. Drop-in starting point that already looks
like a finished store rather than a wireframe.

## Preview

Open `index.html` in any browser. It uses the **Tailwind Play CDN** with an inline
`tailwind.config` (brand colours + fonts) and Google Fonts, so there is **no build step**.
Resize below `md` (768px) for the mobile nav, scroll to watch sections reveal, click the
thumbnails / swatches / sizes, and hit **Add to cart** to open the cart drawer.

## How to adapt / clone

- **Brand colours / fonts** live in the `tailwind.config` block in `<head>` (the
  `sand`, `ink`, `ocean`, `coral` palettes and the `display` / `body` / `mono` fonts).
  Re-theme by editing those values once.
- **Product content** — name, copy, prices, breadcrumb, swatches and sizes are plain
  markup in the hero. Each size button carries a `data-price`; the buy-box JS reads it
  to recompute the live price, so update prices in one place.
- **Colour swatches** map a `data-name` to a flask tint in the `flaskTints` object in
  the script — add or rename swatches there to keep the gallery recolouring in sync.
- **Reviews / related products / specs** are static markup — replace the cards and table
  rows with your own. Swap the CSS-rendered product visuals for real `<img>` tags when
  you have photography (keep the `aspect-` wrappers for layout stability).
- **Going to production** — replace the Play CDN with a compiled Tailwind build, then
  wire the **Add to cart**, **Buy now** and **Checkout** buttons to your commerce
  backend (Shopify, Stripe, etc.). The cart state is a simple in-memory array in the
  script, ready to be swapped for your store/session.

## Accessibility

Skip link, semantic landmarks and headings, labelled controls, `aria-expanded` /
`aria-checked` / `aria-current` state, `role="dialog"` + `aria-modal` cart with
Escape-to-close and focus return, visible focus rings, an `aria-label`led SVG chart, and
full `prefers-reduced-motion` handling (reveals, marquee and smooth-scroll all disabled).

## License

MIT · saltycodestudio-parts (original).

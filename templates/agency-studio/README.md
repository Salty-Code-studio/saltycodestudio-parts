# Agency Studio — full-page template

A bold, polished one-page site for a creative agency or studio, built in the
**Sand & Surf** palette. It is the showcase template for `saltycodestudio` itself,
but it adapts to any small design/dev/branding studio.

![tier: showcase](https://img.shields.io/badge/tier-showcase-1f8a8a) ![kind: template](https://img.shields.io/badge/kind-template-ff6f59)

## What it is

A single, runnable `index.html` that composes a complete marketing site:

1. **Sticky nav** — logo, anchor links, a coral CTA, and an animated hamburger
   menu for mobile that traps scroll and closes on Escape / backdrop tap.
2. **Hero** — oversized display headline with a hand-drawn underline, dual CTAs,
   ambient surf glows, a grain texture, and a four-up stat band with count-up animation.
3. **Logo marquee** — an infinite, reduced-motion-aware client strip.
4. **Services** — a bento-style grid (one tall feature card on dark ink, four
   supporting cards) with hover lift and rotating icon chips.
5. **Selected work** — a case-study grid on a dark section: one large hero case
   with metrics, plus three supporting cards, each linking to a (placeholder) study.
6. **Process** — a four-step numbered flow ("Chart, Design, Build, Launch") with
   ghost numerals that tint on hover.
7. **Testimonials ("Voices")** — one large quote on ink plus two rated cards.
8. **Contact** — split layout: studio details on the left, a validated contact
   form on the right with a friendly inline success/error status.
9. **Footer** — brand, social icons, two link columns, a CTA, and a legal bar
   with auto-updating year and a back-to-top link.

Everything is one file. No build step. Tailwind comes from the Play CDN with an
inline `tailwind.config` that defines the brand tokens; all interactivity lives in
a single inline vanilla-JS block at the bottom.

## Who it is for

- Design, web, branding, or product **studios** that want a confident one-pager.
- Freelancers and small teams presenting **services + selected work + a way to talk**.
- Anyone in the `saltycodestudio-parts` library who wants a finished template to
  fork rather than assemble sections by hand.

## How to preview

Open `index.html` in any browser, or drop the folder onto a static host
(Netlify, Vercel, GitHub Pages, Cloudflare Pages, an S3 bucket — anything). The
file is self-contained.

## How to adapt / clone

1. **Rename the studio.** Find/replace `saltycodestudio`, the `~<` logomark, and
   `hello@saltycode.studio`. Update the `<title>` and meta description.
2. **Rebrand the palette.** Edit the `colors` block in the inline `tailwind.config`
   in `<head>`. The tokens are `sand` (100/200/300), `ink` (+ `ink.soft`),
   `ocean` (+ `ocean.deep` / `ocean.surf`), and `coral` (+ `coral.deep`). Swap the
   hexes and the whole page re-themes. Fonts are set in the same config
   (`font-display`, `font-sans`, `font-mono`) — change them there and in the Google
   Fonts `<link>`.
3. **Swap the content.** All copy is real and section-local: replace the hero lines,
   the five service cards, the four work cases (including the metric numbers), the
   three testimonials, and the contact details. The stat band reads its targets from
   `data-count-to` / `data-suffix` attributes — just change those.
4. **Wire the form.** The contact form is a front-end demo: it validates and shows
   an inline confirmation but does not POST anywhere. Point it at your backend,
   Formspree, or a serverless function by handling the `submit` event in the script
   block (look for `#contact-form`), or set a normal `action`/`method` on the `<form>`.
5. **Trim sections.** Each `<section>` is independent and id-anchored. Delete one
   and remove its matching nav link; nothing else breaks.

## Accessibility & motion

- Skip-to-content link, semantic landmarks, `aria` labels on icon-only controls,
  visible focus rings, and a live region on the form status.
- All scroll-reveal, count-up, marquee, and float animations are gated behind
  `prefers-reduced-motion: reduce`, in both CSS and JS.

## License

MIT. Part of **saltycodestudio-parts (original)**.

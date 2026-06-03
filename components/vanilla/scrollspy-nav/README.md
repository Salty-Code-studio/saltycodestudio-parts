# Scrollspy Nav

A navigation that highlights the link for the section currently in view using
`IntersectionObserver`, and smooth-scrolls to anchors on click. The active link is
the section occupying the most of the viewport's reading zone, so it feels
natural even with uneven section heights. Every `[data-scrollspy]` nav
auto-initialises.

## Files

- `styles.css` — nav link styling + the active rail accent
- `script.js` — IntersectionObserver tracking + smooth-scroll on click

## Required markup

```html
<nav class="spy-nav" data-scrollspy aria-label="Section navigation">
  <a class="spy-nav__link" href="#intro">Intro</a>
  <a class="spy-nav__link" href="#work">Work</a>
  <a class="spy-nav__link" href="#about">About</a>
  <a class="spy-nav__link" href="#contact">Contact</a>
</nav>

<section id="intro">…</section>
<section id="work">…</section>
<section id="about">…</section>
<section id="contact">…</section>
```

### Wiring rules

- Each link's `href="#id"` must match a section `id`.
- Put `data-scrollspy` on the nav container.
- The active link gets the `is-active` class (and `aria-current="true"`).

## Paste-in

1. Copy `styles.css` and `script.js`.
2. Link `styles.css`; load `script.js`.
3. Add the nav + sections with matching ids.

## Tuning

- The "active zone" is controlled by the observer's `rootMargin`
  (`-20% 0px -55% 0px`). Tighten/loosen it in `script.js` to bias toward the top
  or middle of the viewport.
- If you have a fixed header, the CSS `scroll-behavior: smooth` plus
  `scroll-margin-top` on your sections keeps anchors from hiding under it.

## Notes

- Multiple scrollspy navs per page are supported.
- `prefers-reduced-motion` switches click-scrolling to instant jumps.
- Re-init dynamically added navs with `Scrollspy.initAll()`.

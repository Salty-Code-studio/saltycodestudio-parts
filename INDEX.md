# INDEX — saltycodestudio-parts

> **Local model: read this file first.** Match the user's request to a row by `tags`,
> open that part's folder, read its `README.md`, then copy the source `files`.
> Do not invent components — reuse what's here.

**37 parts** · 🏆 11 showcase · ✅ 26 practical

Tiers: 🏆 = bold / showcase-grade · ✅ = premium but production-safe

## React + Tailwind (10)

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Animated Counter** | ✅ | counter, count-up, stats, scroll, intersection-observer | A number that eases up to a target value when it scrolls into view, with prefix/suffix and locale formatting. | `components/react/animated-counter` |
| **Bento Grid** | ✅ | bento, grid, layout, cards, features | A responsive asymmetric bento grid of feature cards with a subtle hover-lift and glow. | `components/react/bento-grid` |
| **Command Palette** | 🏆 | command-palette, cmdk, search, modal, keyboard | A ⌘K-style command palette modal with fuzzy filtering, keyboard navigation, and grouped commands. | `components/react/command-palette` |
| **Dark Mode Toggle** | ✅ | dark-mode, theme, toggle, accessibility, sun-moon | An accessible animated theme toggle that morphs a sun into a moon and persists the choice to localStorage. | `components/react/dark-mode-toggle` |
| **Feature Accordion** | ✅ | accordion, features, faq, disclosure, animation | A single-open accordion of features with smooth grid-based height animation and accessible disclosure semantics. | `components/react/feature-accordion` |
| **Gradient Mesh Hero** | 🏆 | hero, gradient, mesh, blob, animation, framer-motion | A hero section with an animated gradient-mesh blob background, grain overlay, and a bold headline. | `components/react/gradient-mesh-hero` |
| **Logo Marquee** | ✅ | marquee, logos, infinite-scroll, social-proof, ticker | An infinite horizontal marquee of client/partner logos with edge fade and pause-on-hover. | `components/react/logo-marquee` |
| **Pricing Toggle** | ✅ | pricing, toggle, plans, billing, cards | Pricing cards with a monthly/annual switch that animates the displayed price and shows annual savings. | `components/react/pricing-toggle` |
| **Shrinking Sticky Navbar** | ✅ | navbar, sticky, scroll, header, blur | A sticky navbar that condenses its height and gains a backdrop blur once the page is scrolled. | `components/react/shrinking-sticky-navbar` |
| **Testimonial Carousel** | ✅ | testimonial, carousel, slider, reviews, social-proof | An auto-advancing testimonial slider with dot navigation, pause-on-hover, and smooth fade/slide transitions. | `components/react/testimonial-carousel` |

## CSS-only (10)

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **3D Tilt Card** | ✅ | card, 3d, tilt, hover, parallax | A card that lifts and tilts in 3D perspective on hover, with inner layers floating at different depths and a sheen sweep. | `components/css/tilt-card-3d` |
| **Animated Gradient Mesh** | 🏆 | gradient, mesh, background, animation, blobs | A living, slowly-shifting multi-color radial-gradient mesh background driven entirely by CSS keyframes. | `components/css/animated-gradient-mesh` |
| **Aurora Background** | 🏆 | aurora, glow, background, blobs, animation | Soft northern-lights glow blobs that slowly drift, scale, and fade behind your content. | `components/css/aurora-background` |
| **Glassmorphism Card** | ✅ | glass, card, blur, frosted, backdrop | A frosted glass card using backdrop-blur with a subtle light border and an inner top-left highlight. | `components/css/glassmorphism-card` |
| **Gooey Blob** | 🏆 | blob, gooey, morph, organic, svg-filter | An organic morphing gooey blob — a border-radius morph variant plus an SVG goo-filter variant that melts moving circles together. | `components/css/gooey-blob` |
| **Gradient Border Glow** | ✅ | border, gradient, glow, conic, animated | An element wrapped in an animated rotating conic-gradient border with a soft blurred glow that brightens on hover. | `components/css/gradient-border-glow` |
| **Grain / Noise Overlay** | ✅ | grain, noise, texture, film, overlay | A fine film-grain texture overlay built from an inline SVG noise data-uri, addable to any section via one class. | `components/css/grain-noise-overlay` |
| **Infinite Marquee** | ✅ | marquee, scroll, ticker, infinite, loop | A smooth, seamless infinite horizontal marquee that loops without a jump and pauses on hover. | `components/css/marquee` |
| **Neon Glow Button** | ✅ | button, neon, glow, hover, cta | A pill button with a layered neon glow (outer halo, ring, inner fill, text glow) that intensifies on hover and focus. | `components/css/neon-glow-button` |
| **Shimmer Skeleton** | ✅ | skeleton, loading, shimmer, placeholder, loader | Loading placeholder blocks with an animated shimmer sweep, plus shape and width helper classes. | `components/css/shimmer-skeleton` |

## Vanilla HTML/CSS/JS (8)

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Copy to Clipboard** | ✅ | clipboard, copy, button, feedback | A copy button that uses the async Clipboard API (with a legacy fallback) and shows an animated "Copied!" confirmation state. | `components/vanilla/copy-to-clipboard` |
| **Custom Cursor** | 🏆 | cursor, pointer, interaction, lerp, trailing | A custom cursor with a precise dot and a lerp-trailing ring that grows and changes over links and buttons; hides the native cursor and disables itself on touch devices. | `components/vanilla/custom-cursor` |
| **Modal Dialog** | ✅ | modal, dialog, focus-trap, accessible, overlay | An accessible modal dialog with focus trap, Esc-to-close, backdrop-click close, body scroll lock, and a fade/scale-in animation. | `components/vanilla/modal` |
| **Preloader** | 🏆 | preloader, loader, intro, counter, page-load | A polished full-screen preloader with an animated count-up and progress sweep that slides away once the page has finished loading. | `components/vanilla/preloader` |
| **Scrollspy Nav** | ✅ | scrollspy, navigation, intersection-observer, anchor, smooth-scroll | A navigation that highlights the current section using IntersectionObserver and smooth-scrolls to anchors on click. | `components/vanilla/scrollspy-nav` |
| **Smooth Scroll** | ✅ | scroll, smooth-scroll, lerp, raf, inertia | Lerp-based smooth (inertia) page scrolling driven by requestAnimationFrame, with automatic opt-out for prefers-reduced-motion and touch devices. | `components/vanilla/smooth-scroll` |
| **Tabs** | ✅ | tabs, accessible, aria, keyboard, indicator | Accessible tabs with full ARIA roles and arrow-key navigation, plus a sliding active indicator that animates between tabs. | `components/vanilla/tabs` |
| **Theme Switcher** | ✅ | theme, dark-mode, css-variables, localstorage, prefers-color-scheme | A light/dark theme toggle built on CSS variables and a data-theme attribute that persists to localStorage and respects the OS prefers-color-scheme. | `components/vanilla/theme-switcher` |

## GSAP / Scroll Motion (9)

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Horizontal Scroll Gallery** | 🏆 | scroll, horizontal, gsap, gallery, pin, scrolltrigger | Pins a track and translates it horizontally so vertical scrolling sweeps a row of panels sideways across the viewport. | `components/motion/horizontal-scroll-gallery` |
| **Image Scrub Sequence** | 🏆 | scroll, scrub, canvas, gsap, sequence, frames, scrolltrigger | Scrubbing the scroll plays through a frame sequence rendered to canvas (procedurally generated, no external image assets required). | `components/motion/image-scrub-sequence` |
| **Magnetic Button** | ✅ | hover, gsap, button, magnetic, cursor, micro-interaction | A button (and its label) is magnetically pulled toward the cursor while hovered and springs back on leave. | `components/motion/magnetic-button` |
| **Parallax Layers** | ✅ | scroll, parallax, gsap, depth, layers, scrolltrigger | Multiple depth layers translate at different speeds on scroll to create a sense of dimensional depth. | `components/motion/parallax-layers` |
| **Pinned Scroll Section** | 🏆 | scroll, pin, gsap, hero, scrolltrigger, stages | Pins a full-height section in place while its inner content animates through distinct stages as the user scrolls past it. | `components/motion/pinned-scroll-section` |
| **Scroll Progress Bar** | ✅ | scroll, progress, gsap, bar, indicator, scrolltrigger | A slim fixed bar at the top of the page that fills from 0 to 100% as the user scrolls through the document. | `components/motion/scroll-progress-bar` |
| **Scroll Text Reveal** | ✅ | scroll, text, reveal, gsap, fade, stagger, scrolltrigger | Lines or words rise up and fade in with a stagger as each block enters the viewport. | `components/motion/scroll-text-reveal` |
| **Split Text Stagger** | ✅ | text, split, gsap, stagger, heading, chars, words | Splits a heading into characters or words in plain JS and staggers them into view (no paid SplitText plugin required). | `components/motion/split-text-stagger` |
| **Sticky Stacking Cards** | 🏆 | scroll, pin, cards, gsap, stack, scrolltrigger | A stack of cards where each pins in place and slightly scales back as the next card slides up and covers it on scroll. | `components/motion/sticky-stacking-cards` |

---
_Generated by `scripts/build-index.mjs` — do not edit by hand; re-run after adding parts._

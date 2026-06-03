# INDEX — saltycodestudio-parts

> **Local model: read this file first.** Match the user's request to a row by `tags`,
> open that part's folder, read its `README.md`, then copy the source `files`.
> Do not invent components — reuse what's here.

**65 parts** · 🏆 29 showcase · ✅ 36 practical

Tiers: 🏆 = bold / showcase-grade · ✅ = premium but production-safe

## React + Tailwind (20)

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Animated Beam Connector** | 🏆 | beam, connector, diagram, svg, integrations, flow | An animated gradient pulse that travels along a curved SVG path connecting two referenced DOM nodes, ideal for integration and architecture diagrams. | `components/react/animated-beam-connector` |
| **Animated Counter** | ✅ | counter, count-up, stats, scroll, intersection-observer | A number that eases up to a target value when it scrolls into view, with prefix/suffix and locale formatting. | `components/react/animated-counter` |
| **Bento Grid** | ✅ | bento, grid, layout, cards, features | A responsive asymmetric bento grid of feature cards with a subtle hover-lift and glow. | `components/react/bento-grid` |
| **Border Beam** | 🏆 | border, beam, glow, card, animated-border, tailwind | An animated beam of light that continuously travels around the border of any container, framing cards and pricing tiers with a premium glow. | `components/react/border-beam` |
| **Canvas Particle Field** | ✅ | particles, canvas, interactive, depth, mouse, background | Lightweight canvas particles that drift and gently react to the cursor, adding depth and motion behind hero content. | `components/react/canvas-particle-field` |
| **Command Palette** | 🏆 | command-palette, cmdk, search, modal, keyboard | A ⌘K-style command palette modal with fuzzy filtering, keyboard navigation, and grouped commands. | `components/react/command-palette` |
| **Confetti Button** | ✅ | confetti, button, celebration, feedback, canvas, delight | A button that bursts confetti from its own position on click to celebrate signups, purchases and other success moments. | `components/react/confetti-button` |
| **Dark Mode Toggle** | ✅ | dark-mode, theme, toggle, accessibility, sun-moon | An accessible animated theme toggle that morphs a sun into a moon and persists the choice to localStorage. | `components/react/dark-mode-toggle` |
| **Feature Accordion** | ✅ | accordion, features, faq, disclosure, animation | A single-open accordion of features with smooth grid-based height animation and accessible disclosure semantics. | `components/react/feature-accordion` |
| **Gradient Mesh Hero** | 🏆 | hero, gradient, mesh, blob, animation, framer-motion | A hero section with an animated gradient-mesh blob background, grain overlay, and a bold headline. | `components/react/gradient-mesh-hero` |
| **Hover Glow Border** | 🏆 | glow, border, cursor, conic-gradient, card, cursor-style | A Cursor-style border glow that orbits any card and concentrates toward the mouse pointer, adapting to any container size. | `components/react/hover-glow-border` |
| **Lamp Effect** | 🏆 | lamp, spotlight, section-header, conic-gradient, linear-style, hero | A Linear-inspired overhead lamp glow that fans light down onto a section header, with the headline rising into the beam on scroll. | `components/react/lamp-effect` |
| **Logo Marquee** | ✅ | marquee, logos, infinite-scroll, social-proof, ticker | An infinite horizontal marquee of client/partner logos with edge fade and pause-on-hover. | `components/react/logo-marquee` |
| **macOS Dock** | 🏆 | dock, navigation, magnify, macos, hover, toolbar | A macOS-style icon dock whose items magnify and lift as the cursor approaches, for portfolio nav bars and app launchers. | `components/react/macos-dock` |
| **Pricing Toggle** | ✅ | pricing, toggle, plans, billing, cards | Pricing cards with a monthly/annual switch that animates the displayed price and shows annual savings. | `components/react/pricing-toggle` |
| **Shrinking Sticky Navbar** | ✅ | navbar, sticky, scroll, header, blur | A sticky navbar that condenses its height and gains a backdrop blur once the page is scrolled. | `components/react/shrinking-sticky-navbar` |
| **Spotlight Card** | ✅ | card, spotlight, hover, radial-gradient, pointer-tracking, feature | A card that reveals a soft radial spotlight following the cursor on hover, ideal for premium-but-safe feature and pricing grids. | `components/react/spotlight-card` |
| **Testimonial Carousel** | ✅ | testimonial, carousel, slider, reviews, social-proof | An auto-advancing testimonial slider with dot navigation, pause-on-hover, and smooth fade/slide transitions. | `components/react/testimonial-carousel` |
| **Text Shimmer** | ✅ | text, shimmer, shine, gradient, badge, loading | Text with a soft light sheen sweeping across it left to right, perfect for announcement pills, badges and subtle loading labels. | `components/react/text-shimmer` |
| **WebGL Mesh Gradient Plasma** | 🏆 | mesh, gradient, plasma, webgl, shader, hero | A flowing WebGL mesh-gradient of color spots that swirl and distort like plasma, for a high-end animated hero canvas. | `components/react/webgl-mesh-gradient-plasma` |

## CSS-only (20)

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **:has() Sibling Dim Spotlight** | 🏆 | :has(), parent-selector, hover, interactive, list, no-js | Hovering any item in a grid dims every sibling and lifts the focused one, a focus-spotlight interaction built with pure CSS and no JavaScript. | `components/css/has-sibling-spotlight` |
| **3D Tilt Card** | ✅ | card, 3d, tilt, hover, parallax | A card that lifts and tilts in 3D perspective on hover, with inner layers floating at different depths and a sheen sweep. | `components/css/tilt-card-3d` |
| **Animated Details Accordion** | ✅ | accordion, details, summary, grid-template-rows, no-js, accessible | A native, accessible accordion that smoothly animates open and closed from height 0 to auto using the details element with zero JavaScript. | `components/css/details-accordion` |
| **Animated Gradient Mesh** | 🏆 | gradient, mesh, background, animation, blobs | A living, slowly-shifting multi-color radial-gradient mesh background driven entirely by CSS keyframes. | `components/css/animated-gradient-mesh` |
| **Animated Text Gradient** | ✅ | text, gradient, background-clip, animation, headline, no-js | A headline filled with a slowly drifting multi-stop gradient for a premium, living-color title with no JS. | `components/css/animated-text-gradient` |
| **Aurora Background** | 🏆 | aurora, glow, background, blobs, animation | Soft northern-lights glow blobs that slowly drift, scale, and fade behind your content. | `components/css/aurora-background` |
| **Auto-Invert Difference Cursor** | 🏆 | cursor, mix-blend-mode, difference, invert, interactive, monochrome | A custom circular cursor that auto-inverts whatever it passes over using mix-blend-mode: difference, so it stays legible on any background. | `components/css/difference-blend-cursor` |
| **Container-Query Adaptive Card** | ✅ | container-queries, @container, responsive, component, layout, no-js | A self-contained card that reflows from stacked to side-by-side based on the width of its parent slot, not the viewport. | `components/css/container-query-card` |
| **CSS Scroll Reveal Timeline** | 🏆 | scroll-driven, animation-timeline, view, clip-path, no-js, progressive-enhancement | Zero-JavaScript clip-path and fade reveals plus a top scroll-progress bar driven entirely by the native CSS animation-timeline view() and scroll() functions. | `components/css/css-scroll-reveal-timeline` |
| **CSS-Only Snap Carousel** | ✅ | carousel, scroll-snap, scroll-marker, scroll-button, no-js, accessible | A swipeable, paginated carousel with prev/next buttons and dot markers built with zero JavaScript via scroll-snap plus the new ::scroll-button and ::scroll-marker pseudo-elements. | `components/css/scroll-snap-carousel` |
| **Glassmorphism Card** | ✅ | glass, card, blur, frosted, backdrop | A frosted glass card using backdrop-blur with a subtle light border and an inner top-left highlight. | `components/css/glassmorphism-card` |
| **Gooey Blob** | 🏆 | blob, gooey, morph, organic, svg-filter | An organic morphing gooey blob — a border-radius morph variant plus an SVG goo-filter variant that melts moving circles together. | `components/css/gooey-blob` |
| **Gradient Border Glow** | ✅ | border, gradient, glow, conic, animated | An element wrapped in an animated rotating conic-gradient border with a soft blurred glow that brightens on hover. | `components/css/gradient-border-glow` |
| **Grain / Noise Overlay** | ✅ | grain, noise, texture, film, overlay | A fine film-grain texture overlay built from an inline SVG noise data-uri, addable to any section via one class. | `components/css/grain-noise-overlay` |
| **Heart Like Burst** | 🏆 | like, heart, burst, particles, favorite, micro-interaction | A like button where the heart pops with an elastic bounce and a ring of colorful particles bursts outward, with no images or JavaScript. | `components/css/heart-like-burst` |
| **Infinite Marquee** | ✅ | marquee, scroll, ticker, infinite, loop | A smooth, seamless infinite horizontal marquee that loops without a jump and pauses on hover. | `components/css/marquee` |
| **Neon Glow Button** | ✅ | button, neon, glow, hover, cta | A pill button with a layered neon glow (outer halo, ring, inner fill, text glow) that intensifies on hover and focus. | `components/css/neon-glow-button` |
| **Retro Synthwave Grid Floor** | 🏆 | background, retro, synthwave, 3d, perspective, animated, no-js | An infinitely scrolling Tron/vaporwave floor grid that recedes to a glowing horizon, built entirely from layered gradients and a single 3D transform with no canvas or JavaScript. | `components/css/retro-grid-floor` |
| **Shimmer Skeleton** | ✅ | skeleton, loading, shimmer, placeholder, loader | Loading placeholder blocks with an animated shimmer sweep, plus shape and width helper classes. | `components/css/shimmer-skeleton` |
| **Sliding Underline Link** | ✅ | underline, hover, link, background-size, micro-interaction, multiline | A link underline that wipes in on hover and correctly wraps across multiple lines, using an animated background-size instead of a transform. | `components/css/animated-underline` |

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

## GSAP / Scroll Motion (17)

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **3D Scroll Text Cylinder** | 🏆 | text, 3d, scroll, perspective, cylinder, gsap, transform | Lines of text wrapped around an invisible 3D cylinder that rotates through depth as you scroll, with no WebGL required. | `components/motion/scroll-text-cylinder` |
| **Gravity Mouse Trail** | 🏆 | mouse, cursor, image-trail, gravity, physics, gsap, bounce | Images burst from the cursor as it moves, then fall under simulated gravity, bounce off the bottom of the viewport, and fade away. | `components/motion/gravity-mouse-trail` |
| **Horizontal Scroll Gallery** | 🏆 | scroll, horizontal, gsap, gallery, pin, scrolltrigger | Pins a track and translates it horizontally so vertical scrolling sweeps a row of panels sideways across the viewport. | `components/motion/horizontal-scroll-gallery` |
| **Image Scrub Sequence** | 🏆 | scroll, scrub, canvas, gsap, sequence, frames, scrolltrigger | Scrubbing the scroll plays through a frame sequence rendered to canvas (procedurally generated, no external image assets required). | `components/motion/image-scrub-sequence` |
| **Infinite Parallax Scroll** | 🏆 | scroll, infinite, parallax, depth, snap, gsap, lenis | Fullscreen sections that loop endlessly with eased snap, while their inner media drifts at a slower rate to create a seamless sense of depth. | `components/motion/infinite-parallax-scroll` |
| **Layered Zoom Scroll** | 🏆 | scroll, zoom, parallax, blur, split-text, gsap, scrollsmoother | A cinematic trailing-zoom hero where stacked image layers scale and de-blur into focus while split headline text parts to reveal a masked central subject on scroll. | `components/motion/layered-zoom-scroll` |
| **Magnetic Button** | ✅ | hover, gsap, button, magnetic, cursor, micro-interaction | A button (and its label) is magnetically pulled toward the cursor while hovered and springs back on leave. | `components/motion/magnetic-button` |
| **Parallax Layers** | ✅ | scroll, parallax, gsap, depth, layers, scrolltrigger | Multiple depth layers translate at different speeds on scroll to create a sense of dimensional depth. | `components/motion/parallax-layers` |
| **Pinned Scroll Section** | 🏆 | scroll, pin, gsap, hero, scrolltrigger, stages | Pins a full-height section in place while its inner content animates through distinct stages as the user scrolls past it. | `components/motion/pinned-scroll-section` |
| **Scroll Progress Bar** | ✅ | scroll, progress, gsap, bar, indicator, scrolltrigger | A slim fixed bar at the top of the page that fills from 0 to 100% as the user scrolls through the document. | `components/motion/scroll-progress-bar` |
| **Scroll Text Reveal** | ✅ | scroll, text, reveal, gsap, fade, stagger, scrolltrigger | Lines or words rise up and fade in with a stagger as each block enters the viewport. | `components/motion/scroll-text-reveal` |
| **Scroll Velocity Skew Marquee** | 🏆 | scroll, marquee, skew, gsap, velocity, infinite-loop | An infinite horizontal marquee that skews and stretches in proportion to scroll velocity, snapping back to rest when the scroll stops. | `components/motion/scroll-velocity-skew-marquee` |
| **Split Text Stagger** | ✅ | text, split, gsap, stagger, heading, chars, words | Splits a heading into characters or words in plain JS and staggers them into view (no paid SplitText plugin required). | `components/motion/split-text-stagger` |
| **Sticky Grid Scroll** | 🏆 | scroll, pinned, grid, gallery, zoom, gsap, lenis, stagger | A pinned 3-column image grid that staggers in, scales and opens up, and reveals an overlaid title and CTA at precise scroll points before releasing. | `components/motion/sticky-grid-scroll` |
| **Sticky Stacking Cards** | 🏆 | scroll, pin, cards, gsap, stack, scrolltrigger | A stack of cards where each pins in place and slightly scales back as the next card slides up and covers it on scroll. | `components/motion/sticky-stacking-cards` |
| **SVG Line Draw on Scroll** | ✅ | svg, stroke, draw, scroll, gsap, drawsvg, path | An SVG path that progressively draws itself in sync with scroll, ideal for connecting timeline sections or tracing illustrations. | `components/motion/svg-line-draw-on-scroll` |
| **SVG Text Clip Reveal** | 🏆 | text, clip-path, svg, mask, scroll, gsap, wipe | Large display type used as an SVG clip-path that wipes open on scroll to reveal an image or pattern sliding behind the letters. | `components/motion/svg-text-clip-reveal` |

---
_Generated by `scripts/build-index.mjs` — do not edit by hand; re-run after adding parts._

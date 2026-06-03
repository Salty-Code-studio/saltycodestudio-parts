# INDEX — saltycodestudio-parts

> **Local model: read this file first.** It maps the whole site-building kit. Match the
> user's need to a row by `tags`, open that folder, read its `README.md`, then copy the
> source `files`. To build a FULL site: read `playbook/00-how-to-build-a-great-site.md`,
> start from a `starters/` skeleton, apply `foundations/`, then compose templates → sections → components.

**101 parts** — 80 components · 16 sections · 5 templates · 🏆 39 showcase · ✅ 62 practical

Tiers: 🏆 = bold / showcase-grade · ✅ = premium but production-safe

---

## 🧱 Templates — full runnable pages
Clone an `index.html`, open it in a browser, adapt the copy.

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Agency Studio** | 🏆 | template, agency, studio, creative-agency, portfolio, services, case-studies, process, testimonials, contact, marketing-site, sand-and-surf, responsive, accessible, tailwind | A bold creative agency and studio one-pager with a striking hero, services, a selected-work case grid, a numbered process, testimonials, a contact form, and footer in the Sand & Surf palette. | `templates/agency-studio` |
| **Blog / Magazine** | 🏆 | blog, magazine, editorial, publication, newsletter, post-grid, category-filter, featured-hero, responsive, accessible, sand-and-surf, website | A clean editorial blog and magazine landing page with a featured-post masthead hero, category-filterable post grid, weekly columns, an editor's pick, a newsletter CTA, and a footer. | `templates/blog-magazine` |
| **Ecommerce Product** | 🏆 | ecommerce, product, pdp, landing, shop, store, cart, cart-drawer, gallery, buy-box, variants, reviews, specs, related-products, responsive, accessible, tailwind, saltycodestudio | A complete single-product e-commerce/landing page with a sticky cart-drawer nav, product gallery and buy box with live variant/quantity pricing, features, specs, reviews, related products, and footer. | `templates/ecommerce-product` |
| **Landing — SaaS** | 🏆 | template, landing, saas, marketing, pricing, bento, faq, testimonials, responsive, accessible, sand-and-surf | A complete, polished SaaS marketing landing page with nav, hero, logo cloud, feature bento, how-it-works, pricing, testimonials, FAQ, CTA, and footer. | `templates/landing-saas` |
| **Portfolio** | 🏆 | portfolio, personal, creative, designer, developer, case-study, showcase, about, skills, contact-form, responsive, accessible, single-page, tailwind, saltycodestudio | A polished single-page personal/creative portfolio with hero intro, about, case-study project grid, skills, contact form, and footer. | `templates/portfolio` |

## 🧩 Sections — page-ready blocks
Each ships a React `.tsx` and a plain `section.html` variant.

### blog

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Blog Grid** | ✅ | blog, grid, articles, cards, cover-image, category-tag, excerpt, responsive, accessible, sand-and-surf | A responsive blog post grid where each card pairs a cover image, category tag, title, excerpt, and author-and-date meta into a clean, scannable archive. | `sections/blog-grid` |

### contact

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Contact Form** | ✅ | contact, form, validation, lead, accessible, aria, map, sand-and-surf | A validated contact section pairing a name/email/message form with studio contact details and a stylized map placeholder, with inline error feedback and a thank-you state. | `sections/contact-form` |

### cta

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **CTA Band** | 🏆 | cta, call-to-action, gradient, band, conversion, buttons, full-width, sand-and-surf | Full-width call-to-action band with an eyebrow, headline, subcopy, and one or two buttons on a deep-teal gradient with coral and sky-blue glows. | `sections/cta-band` |

### faq

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **FAQ Accordion** | ✅ | faq, accordion, disclosure, accessible, aria, collapse, sand-and-surf | An accessible FAQ accordion with smooth height-animated open/close, single or multiple expand modes, and full ARIA wiring. | `sections/faq` |

### features

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Feature Showcase** | ✅ | features, alternating, image-text, zigzag, showcase, responsive, accessible | Alternating image-and-text feature rows that flip left and right down the page, each pairing a captioned visual with a headline, supporting copy, a checklist, and a call to action. | `sections/feature-showcase` |
| **Features Bento** | 🏆 | features, bento, grid, cards, responsive, accessible, sand-and-surf | Bento-style feature layout mixing large, tall, and small cards across a responsive three-column grid. | `sections/features-bento` |
| **Features Grid** | ✅ | features, grid, icons, cards, responsive, sand-and-surf | A responsive three- or four-column feature grid with icon tiles, titles, and short descriptions. | `sections/features-grid` |

### footer

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Footer** | ✅ | footer, links, newsletter, social, responsive, accessible, tailwind | Multi-column site footer with a brand block, newsletter signup, link columns, social icon buttons, and a legal/sign-off bottom row on a deep-teal canvas. | `sections/footer` |

### hero

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Hero Centered** | 🏆 | hero, centered, headline, eyebrow, cta, gradient, landing, responsive, accessible | Centered hero with a monospace eyebrow, oversized display headline, supporting lede, dual CTAs, reassurance note, and a soft sand-to-surf gradient backdrop with glow and grid ornaments. | `sections/hero-centered` |
| **Hero Split** | 🏆 | hero, split, two-column, cta, code-mockup, stats, responsive, saltycodestudio | Split hero with a bold headline, subcopy, dual CTAs and stats on one side and a code-window mockup on the other. | `sections/hero-split` |

### nav

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Navbar** | ✅ | navbar, navigation, header, sticky, responsive, hamburger, mobile-menu, cta, accessible, tailwind | Responsive sticky navbar with logo, links, a coral CTA, and an animated mobile hamburger menu that elevates on scroll. | `sections/navbar` |

### pricing

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Pricing Tiers** | 🏆 | pricing, plans, tiers, recommended, feature-list, saas, studio, sand-surf | Three-tier pricing section with a highlighted recommended plan and per-plan feature lists with included and excluded states. | `sections/pricing` |

### social-proof

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Logo Cloud** | ✅ | logo-cloud, social-proof, trusted-by, logos, grayscale, hover, brands, marquee | A 'Trusted by' logo strip that fades brand marks in from grayscale to full color on hover for tasteful, lightweight social proof. | `sections/logo-cloud` |

### stats

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Stats Band** | ✅ | stats, metrics, numbers, kpi, band, accent, dark, responsive | A band of key metrics with labels on an accent background, with an eyebrow, heading, and supporting copy. | `sections/stats-band` |

### team

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Team Grid** | ✅ | team, people, grid, about, cards, responsive, sand-and-surf | A responsive grid of team members with portrait, name, role, short bio, and social/contact links. | `sections/team-grid` |

### testimonials

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Testimonials** | ✅ | testimonials, reviews, social-proof, cards, quotes, avatars, ratings, grid | A responsive grid of testimonial cards with avatar, quote, star rating, name, and role. | `sections/testimonials` |

## ⚙️ Components — atoms, effects & animations

### React + Tailwind (34)

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Alert Callout** | ✅ | alert, callout, notification, banner, info, success, warning, error, dismiss, accessibility | An accessible info/success/warning/error callout with an icon, optional title, body content, and an optional dismiss button. | `components/react/alert-callout` |
| **Animated Beam Connector** | 🏆 | beam, connector, diagram, svg, integrations, flow | An animated gradient pulse that travels along a curved SVG path connecting two referenced DOM nodes, ideal for integration and architecture diagrams. | `components/react/animated-beam-connector` |
| **Animated Counter** | ✅ | counter, count-up, stats, scroll, intersection-observer | A number that eases up to a target value when it scrolls into view, with prefix/suffix and locale formatting. | `components/react/animated-counter` |
| **Avatar** | ✅ | avatar, image, initials, fallback, status, presence, group, stack | An accessible avatar with image plus deterministic initials fallback, a presence status dot, and an overlapping avatar group that collapses extras into a +N chip. | `components/react/avatar` |
| **Badge / Tag** | ✅ | badge, tag, pill, label, status, chip | Accessible badge/tag/pill component with semantic color variants, three sizes, status dot, outline, and removable variants. | `components/react/badge-tag` |
| **Bento Grid** | ✅ | bento, grid, layout, cards, features | A responsive asymmetric bento grid of feature cards with a subtle hover-lift and glow. | `components/react/bento-grid` |
| **Border Beam** | 🏆 | border, beam, glow, card, animated-border, tailwind | An animated beam of light that continuously travels around the border of any container, framing cards and pricing tiers with a premium glow. | `components/react/border-beam` |
| **Breadcrumb** | ✅ | breadcrumb, navigation, nav, truncation, collapse, accessible | Accessible breadcrumb navigation with chevron or slash separators and truncation plus an expandable collapse for long paths. | `components/react/breadcrumb` |
| **Button Set** | ✅ | button, variants, loading, disabled, icon, accessible, tailwind | A complete button system with primary, secondary, ghost, outline and destructive variants, three sizes, loading and disabled states and full icon support. | `components/react/button-set` |
| **Canvas Particle Field** | ✅ | particles, canvas, interactive, depth, mouse, background | Lightweight canvas particles that drift and gently react to the cursor, adding depth and motion behind hero content. | `components/react/canvas-particle-field` |
| **Card** | ✅ | card, surface, container, media, composable, hover-lift | Versatile, composable content card with optional media, header, body, and footer slots, three surface variants, and an accessible hover-lift link mode. | `components/react/card` |
| **Choice Controls** | ✅ | checkbox, radio, toggle, switch, form, accessible, controls | A styled checkbox, radio group, and toggle switch sharing one Sand & Surf design language, fully accessible with ARIA, keyboard support, and visible focus rings. | `components/react/choice-controls` |
| **Command Palette** | 🏆 | command-palette, cmdk, search, modal, keyboard | A ⌘K-style command palette modal with fuzzy filtering, keyboard navigation, and grouped commands. | `components/react/command-palette` |
| **Confetti Button** | ✅ | confetti, button, celebration, feedback, canvas, delight | A button that bursts confetti from its own position on click to celebrate signups, purchases and other success moments. | `components/react/confetti-button` |
| **Dark Mode Toggle** | ✅ | dark-mode, theme, toggle, accessibility, sun-moon | An accessible animated theme toggle that morphs a sun into a moon and persists the choice to localStorage. | `components/react/dark-mode-toggle` |
| **Data Table** | ✅ | table, data-table, sortable, sticky-header, empty-state | A clean, accessible data table with sortable columns, zebra striping, hover rows, a sticky header, loading skeletons, and an empty state. | `components/react/data-table` |
| **Feature Accordion** | ✅ | accordion, features, faq, disclosure, animation | A single-open accordion of features with smooth grid-based height animation and accessible disclosure semantics. | `components/react/feature-accordion` |
| **Gradient Mesh Hero** | 🏆 | hero, gradient, mesh, blob, animation, framer-motion | A hero section with an animated gradient-mesh blob background, grain overlay, and a bold headline. | `components/react/gradient-mesh-hero` |
| **Hover Glow Border** | 🏆 | glow, border, cursor, conic-gradient, card, cursor-style | A Cursor-style border glow that orbits any card and concentrates toward the mouse pointer, adapting to any container size. | `components/react/hover-glow-border` |
| **Input Field** | ✅ | input, form, text-field, floating-label, validation, accessibility | An accessible text input with floating or standard label, helper text, error state, leading/trailing icons, and a required indicator. | `components/react/input-field` |
| **Lamp Effect** | 🏆 | lamp, spotlight, section-header, conic-gradient, linear-style, hero | A Linear-inspired overhead lamp glow that fans light down onto a section header, with the headline rising into the beam on scroll. | `components/react/lamp-effect` |
| **Logo Marquee** | ✅ | marquee, logos, infinite-scroll, social-proof, ticker | An infinite horizontal marquee of client/partner logos with edge fade and pause-on-hover. | `components/react/logo-marquee` |
| **macOS Dock** | 🏆 | dock, navigation, magnify, macos, hover, toolbar | A macOS-style icon dock whose items magnify and lift as the cursor approaches, for portfolio nav bars and app launchers. | `components/react/macos-dock` |
| **Pagination** | ✅ | pagination, navigation, pager, ellipsis, accessible | Accessible pagination control with prev/next, numbered pages, smart ellipsis truncation, and disabled edges. | `components/react/pagination` |
| **Pricing Toggle** | ✅ | pricing, toggle, plans, billing, cards | Pricing cards with a monthly/annual switch that animates the displayed price and shows annual savings. | `components/react/pricing-toggle` |
| **Segmented Control** | ✅ | segmented-control, tabs, switcher, toggle, radiogroup, ios | iOS-style segmented control / tab switcher with an animated sliding active pill, full keyboard support, and a WAI-ARIA radiogroup. | `components/react/segmented-control` |
| **Select Menu** | ✅ | select, dropdown, combobox, listbox, accessible, keyboard, search | An accessible custom select/dropdown with full keyboard navigation, optional search filtering, and a checkmark on the selected option. | `components/react/select-menu` |
| **Shrinking Sticky Navbar** | ✅ | navbar, sticky, scroll, header, blur | A sticky navbar that condenses its height and gains a backdrop blur once the page is scrolled. | `components/react/shrinking-sticky-navbar` |
| **Spotlight Card** | ✅ | card, spotlight, hover, radial-gradient, pointer-tracking, feature | A card that reveals a soft radial spotlight following the cursor on hover, ideal for premium-but-safe feature and pricing grids. | `components/react/spotlight-card` |
| **Testimonial Carousel** | ✅ | testimonial, carousel, slider, reviews, social-proof | An auto-advancing testimonial slider with dot navigation, pause-on-hover, and smooth fade/slide transitions. | `components/react/testimonial-carousel` |
| **Text Shimmer** | ✅ | text, shimmer, shine, gradient, badge, loading | Text with a soft light sheen sweeping across it left to right, perfect for announcement pills, badges and subtle loading labels. | `components/react/text-shimmer` |
| **Toast** | ✅ | toast, notification, provider, hook, snackbar, alert, accessible | A toast notification system with a provider plus useToast() hook, stacked toasts, four variants, auto-dismiss with pause-on-hover, and enter/exit animation. | `components/react/toast` |
| **Tooltip** | ✅ | tooltip, overlay, accessibility, hover, focus, placement | An accessible tooltip that opens on hover and keyboard focus with viewport-aware smart placement and a small pointing arrow. | `components/react/tooltip` |
| **WebGL Mesh Gradient Plasma** | 🏆 | mesh, gradient, plasma, webgl, shader, hero | A flowing WebGL mesh-gradient of color spots that swirl and distort like plasma, for a high-end animated hero canvas. | `components/react/webgl-mesh-gradient-plasma` |

### CSS-only (20)

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Animated Gradient Mesh** | 🏆 | gradient, mesh, background, animation, blobs | A living, slowly-shifting multi-color radial-gradient mesh background driven entirely by CSS keyframes. | `components/css/animated-gradient-mesh` |
| **Animated Text Gradient** | ✅ | text, gradient, background-clip, animation, headline, no-js | A headline filled with a slowly drifting multi-stop gradient for a premium, living-color title with no JS. | `components/css/animated-text-gradient` |
| **Sliding Underline Link** | ✅ | underline, hover, link, background-size, micro-interaction, multiline | A link underline that wipes in on hover and correctly wraps across multiple lines, using an animated background-size instead of a transform. | `components/css/animated-underline` |
| **Aurora Background** | 🏆 | aurora, glow, background, blobs, animation | Soft northern-lights glow blobs that slowly drift, scale, and fade behind your content. | `components/css/aurora-background` |
| **Container-Query Adaptive Card** | ✅ | container-queries, @container, responsive, component, layout, no-js | A self-contained card that reflows from stacked to side-by-side based on the width of its parent slot, not the viewport. | `components/css/container-query-card` |
| **CSS Scroll Reveal Timeline** | 🏆 | scroll-driven, animation-timeline, view, clip-path, no-js, progressive-enhancement | Zero-JavaScript clip-path and fade reveals plus a top scroll-progress bar driven entirely by the native CSS animation-timeline view() and scroll() functions. | `components/css/css-scroll-reveal-timeline` |
| **Animated Details Accordion** | ✅ | accordion, details, summary, grid-template-rows, no-js, accessible | A native, accessible accordion that smoothly animates open and closed from height 0 to auto using the details element with zero JavaScript. | `components/css/details-accordion` |
| **Auto-Invert Difference Cursor** | 🏆 | cursor, mix-blend-mode, difference, invert, interactive, monochrome | A custom circular cursor that auto-inverts whatever it passes over using mix-blend-mode: difference, so it stays legible on any background. | `components/css/difference-blend-cursor` |
| **Glassmorphism Card** | ✅ | glass, card, blur, frosted, backdrop | A frosted glass card using backdrop-blur with a subtle light border and an inner top-left highlight. | `components/css/glassmorphism-card` |
| **Gooey Blob** | 🏆 | blob, gooey, morph, organic, svg-filter | An organic morphing gooey blob — a border-radius morph variant plus an SVG goo-filter variant that melts moving circles together. | `components/css/gooey-blob` |
| **Gradient Border Glow** | ✅ | border, gradient, glow, conic, animated | An element wrapped in an animated rotating conic-gradient border with a soft blurred glow that brightens on hover. | `components/css/gradient-border-glow` |
| **Grain / Noise Overlay** | ✅ | grain, noise, texture, film, overlay | A fine film-grain texture overlay built from an inline SVG noise data-uri, addable to any section via one class. | `components/css/grain-noise-overlay` |
| **:has() Sibling Dim Spotlight** | 🏆 | :has(), parent-selector, hover, interactive, list, no-js | Hovering any item in a grid dims every sibling and lifts the focused one, a focus-spotlight interaction built with pure CSS and no JavaScript. | `components/css/has-sibling-spotlight` |
| **Heart Like Burst** | 🏆 | like, heart, burst, particles, favorite, micro-interaction | A like button where the heart pops with an elastic bounce and a ring of colorful particles bursts outward, with no images or JavaScript. | `components/css/heart-like-burst` |
| **Infinite Marquee** | ✅ | marquee, scroll, ticker, infinite, loop | A smooth, seamless infinite horizontal marquee that loops without a jump and pauses on hover. | `components/css/marquee` |
| **Neon Glow Button** | ✅ | button, neon, glow, hover, cta | A pill button with a layered neon glow (outer halo, ring, inner fill, text glow) that intensifies on hover and focus. | `components/css/neon-glow-button` |
| **Retro Synthwave Grid Floor** | 🏆 | background, retro, synthwave, 3d, perspective, animated, no-js | An infinitely scrolling Tron/vaporwave floor grid that recedes to a glowing horizon, built entirely from layered gradients and a single 3D transform with no canvas or JavaScript. | `components/css/retro-grid-floor` |
| **CSS-Only Snap Carousel** | ✅ | carousel, scroll-snap, scroll-marker, scroll-button, no-js, accessible | A swipeable, paginated carousel with prev/next buttons and dot markers built with zero JavaScript via scroll-snap plus the new ::scroll-button and ::scroll-marker pseudo-elements. | `components/css/scroll-snap-carousel` |
| **Shimmer Skeleton** | ✅ | skeleton, loading, shimmer, placeholder, loader | Loading placeholder blocks with an animated shimmer sweep, plus shape and width helper classes. | `components/css/shimmer-skeleton` |
| **3D Tilt Card** | ✅ | card, 3d, tilt, hover, parallax | A card that lifts and tilts in 3D perspective on hover, with inner layers floating at different depths and a sheen sweep. | `components/css/tilt-card-3d` |

### Vanilla HTML/CSS/JS (9)

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Copy to Clipboard** | ✅ | clipboard, copy, button, feedback | A copy button that uses the async Clipboard API (with a legacy fallback) and shows an animated "Copied!" confirmation state. | `components/vanilla/copy-to-clipboard` |
| **Custom Cursor** | 🏆 | cursor, pointer, interaction, lerp, trailing | A custom cursor with a precise dot and a lerp-trailing ring that grows and changes over links and buttons; hides the native cursor and disables itself on touch devices. | `components/vanilla/custom-cursor` |
| **Form Validation** | ✅ | form, validation, accessible, aria-invalid, inline-errors, no-library | Dependency-free accessible form validation with inline errors on blur and submit, aria-invalid, live-region messages, and first-invalid focus. | `components/vanilla/form-validation` |
| **Modal Dialog** | ✅ | modal, dialog, focus-trap, accessible, overlay | An accessible modal dialog with focus trap, Esc-to-close, backdrop-click close, body scroll lock, and a fade/scale-in animation. | `components/vanilla/modal` |
| **Preloader** | 🏆 | preloader, loader, intro, counter, page-load | A polished full-screen preloader with an animated count-up and progress sweep that slides away once the page has finished loading. | `components/vanilla/preloader` |
| **Scrollspy Nav** | ✅ | scrollspy, navigation, intersection-observer, anchor, smooth-scroll | A navigation that highlights the current section using IntersectionObserver and smooth-scrolls to anchors on click. | `components/vanilla/scrollspy-nav` |
| **Smooth Scroll** | ✅ | scroll, smooth-scroll, lerp, raf, inertia | Lerp-based smooth (inertia) page scrolling driven by requestAnimationFrame, with automatic opt-out for prefers-reduced-motion and touch devices. | `components/vanilla/smooth-scroll` |
| **Tabs** | ✅ | tabs, accessible, aria, keyboard, indicator | Accessible tabs with full ARIA roles and arrow-key navigation, plus a sliding active indicator that animates between tabs. | `components/vanilla/tabs` |
| **Theme Switcher** | ✅ | theme, dark-mode, css-variables, localstorage, prefers-color-scheme | A light/dark theme toggle built on CSS variables and a data-theme attribute that persists to localStorage and respects the OS prefers-color-scheme. | `components/vanilla/theme-switcher` |

### GSAP / Scroll Motion (17)

| Part | Tier | Tags | What it's for | Path |
|------|------|------|---------------|------|
| **Gravity Mouse Trail** | 🏆 | mouse, cursor, image-trail, gravity, physics, gsap, bounce | Images burst from the cursor as it moves, then fall under simulated gravity, bounce off the bottom of the viewport, and fade away. | `components/motion/gravity-mouse-trail` |
| **Horizontal Scroll Gallery** | 🏆 | scroll, horizontal, gsap, gallery, pin, scrolltrigger | Pins a track and translates it horizontally so vertical scrolling sweeps a row of panels sideways across the viewport. | `components/motion/horizontal-scroll-gallery` |
| **Image Scrub Sequence** | 🏆 | scroll, scrub, canvas, gsap, sequence, frames, scrolltrigger | Scrubbing the scroll plays through a frame sequence rendered to canvas (procedurally generated, no external image assets required). | `components/motion/image-scrub-sequence` |
| **Infinite Parallax Scroll** | 🏆 | scroll, infinite, parallax, depth, snap, gsap, lenis | Fullscreen sections that loop endlessly with eased snap, while their inner media drifts at a slower rate to create a seamless sense of depth. | `components/motion/infinite-parallax-scroll` |
| **Layered Zoom Scroll** | 🏆 | scroll, zoom, parallax, blur, split-text, gsap, scrollsmoother | A cinematic trailing-zoom hero where stacked image layers scale and de-blur into focus while split headline text parts to reveal a masked central subject on scroll. | `components/motion/layered-zoom-scroll` |
| **Magnetic Button** | ✅ | hover, gsap, button, magnetic, cursor, micro-interaction | A button (and its label) is magnetically pulled toward the cursor while hovered and springs back on leave. | `components/motion/magnetic-button` |
| **Parallax Layers** | ✅ | scroll, parallax, gsap, depth, layers, scrolltrigger | Multiple depth layers translate at different speeds on scroll to create a sense of dimensional depth. | `components/motion/parallax-layers` |
| **Pinned Scroll Section** | 🏆 | scroll, pin, gsap, hero, scrolltrigger, stages | Pins a full-height section in place while its inner content animates through distinct stages as the user scrolls past it. | `components/motion/pinned-scroll-section` |
| **Scroll Progress Bar** | ✅ | scroll, progress, gsap, bar, indicator, scrolltrigger | A slim fixed bar at the top of the page that fills from 0 to 100% as the user scrolls through the document. | `components/motion/scroll-progress-bar` |
| **3D Scroll Text Cylinder** | 🏆 | text, 3d, scroll, perspective, cylinder, gsap, transform | Lines of text wrapped around an invisible 3D cylinder that rotates through depth as you scroll, with no WebGL required. | `components/motion/scroll-text-cylinder` |
| **Scroll Text Reveal** | ✅ | scroll, text, reveal, gsap, fade, stagger, scrolltrigger | Lines or words rise up and fade in with a stagger as each block enters the viewport. | `components/motion/scroll-text-reveal` |
| **Scroll Velocity Skew Marquee** | 🏆 | scroll, marquee, skew, gsap, velocity, infinite-loop | An infinite horizontal marquee that skews and stretches in proportion to scroll velocity, snapping back to rest when the scroll stops. | `components/motion/scroll-velocity-skew-marquee` |
| **Split Text Stagger** | ✅ | text, split, gsap, stagger, heading, chars, words | Splits a heading into characters or words in plain JS and staggers them into view (no paid SplitText plugin required). | `components/motion/split-text-stagger` |
| **Sticky Grid Scroll** | 🏆 | scroll, pinned, grid, gallery, zoom, gsap, lenis, stagger | A pinned 3-column image grid that staggers in, scales and opens up, and reveals an overlaid title and CTA at precise scroll points before releasing. | `components/motion/sticky-grid-scroll` |
| **Sticky Stacking Cards** | 🏆 | scroll, pin, cards, gsap, stack, scrolltrigger | A stack of cards where each pins in place and slightly scales back as the next card slides up and covers it on scroll. | `components/motion/sticky-stacking-cards` |
| **SVG Line Draw on Scroll** | ✅ | svg, stroke, draw, scroll, gsap, drawsvg, path | An SVG path that progressively draws itself in sync with scroll, ideal for connecting timeline sections or tracing illustrations. | `components/motion/svg-line-draw-on-scroll` |
| **SVG Text Clip Reveal** | 🏆 | text, clip-path, svg, mask, scroll, gsap, wipe | Large display type used as an SVG clip-path that wipes open on scroll to reveal an image or pattern sliding behind the letters. | `components/motion/svg-text-clip-reveal` |

## 🎨 Foundations, Playbook & Starters

**`foundations/`** — the design system; apply to everything: `base.css`, `font-pairings.md`, `gradients.css`, `motion.css`, `palettes.css`, `palettes.md`, `shadows.css`, `tailwind.preset.js`, `tokens.css`, `typography.css`

**`playbook/`** — read these to build with taste: `00-how-to-build-a-great-site.md`, `accessibility.md`, `anti-slop.md`, `color.md`, `layout-and-hierarchy.md`, `motion.md`, `responsive.md`, `seo-and-performance.md`, `spacing-and-rhythm.md`, `typography.md`

**`starters/`** — scaffold a project from one: `astro`, `nextjs`, `plain-html-tailwind`, `vite-react-tailwind`

---
_Generated by `scripts/build-index.mjs` — do not edit by hand; re-run after adding parts._

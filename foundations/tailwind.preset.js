/**
 * saltycodestudio — Tailwind v3 Preset ("Sand & Surf")
 * ----------------------------------------------------------------------------
 * Maps the brand design tokens onto Tailwind's theme. Colors are wired to the
 * CSS custom properties in `foundations/tokens.css` via the
 *   rgb(var(--rgb-*) / <alpha-value>)
 * pattern, so every utility supports opacity modifiers out of the box
 * (e.g. `bg-coral/20`, `text-teal/60`, `border-teal/30`).
 *
 * ── HOW TO USE ──────────────────────────────────────────────────────────────
 * 1. Make sure `foundations/tokens.css` is imported into your app (it defines
 *    the `--rgb-*` channels this preset reads at runtime).
 *
 * 2. Reference this file from your project's `tailwind.config.js`:
 *
 *      // tailwind.config.js
 *      module.exports = {
 *        presets: [require('./foundations/tailwind.preset.js')],
 *        content: ['./index.html', './src/**\/*.{js,ts,jsx,tsx,vue,svelte}'],
 *        // project-specific overrides go here and win over the preset:
 *        theme: { extend: {} },
 *      };
 *
 *    ESM projects:
 *      import scsPreset from './foundations/tailwind.preset.js';
 *      export default { presets: [scsPreset], content: [...] };
 *
 * 3. Use the semantic utilities:
 *      bg-sand  text-teal  bg-coral text-white  text-sky  border-ink
 *      bg-surface  shadow-md  rounded-lg  font-display  animate-fade-up
 *
 * NOTE: This preset only *extends* Tailwind's defaults (it does not replace the
 * default color palette), so `bg-white`, `text-red-500`, etc. all still work.
 * The fontFamily, spacing, borderRadius and boxShadow scales below mirror
 * `tokens.css` 1:1 — keep them in sync if you edit one.
 */

/**
 * Build a Tailwind-compatible color value from an RGB-channel CSS var.
 * Returns a function so Tailwind can inject `<alpha-value>` for opacity
 * modifiers, and fall back to a flat color when used without one.
 *
 * @param {string} varName e.g. '--rgb-surf-coral'
 */
const channel = (varName) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `rgb(var(${varName}))`
    : `rgb(var(${varName}) / ${opacityValue})`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      /* ------------------------------------------------------------------ */
      /* COLORS — semantic names bound to the palette vars                  */
      /* ------------------------------------------------------------------ */
      colors: {
        // Canvas / surfaces
        sand: {
          DEFAULT: channel('--rgb-warm-sand'), // page canvas
          2: channel('--rgb-sand-2'),          // raised/inset sand surface
        },
        surface: channel('--rgb-warm-sand'),   // alias for sand canvas
        'surface-raised': channel('--rgb-sand-2'),

        // Ink / primary
        teal: channel('--rgb-deep-teal'),      // headings, body on sand, mark
        ink: channel('--rgb-driftwood-ink'),   // deep text, dark surface, borders

        // Accents
        coral: channel('--rgb-surf-coral'),    // CTA / one accent per view
        sky: channel('--rgb-sky-blue'),        // supporting accent, tags, charts

        white: channel('--rgb-white'),         // on-coral / on-teal text

        // Explicit semantic aliases (handy in component APIs)
        brand: {
          canvas: channel('--rgb-warm-sand'),
          ink: channel('--rgb-deep-teal'),
          accent: channel('--rgb-surf-coral'),
          'accent-2': channel('--rgb-sky-blue'),
          dark: channel('--rgb-driftwood-ink'),
        },
      },

      /* ------------------------------------------------------------------ */
      /* TYPOGRAPHY — Space Grotesk / JetBrains Mono / Inter                */
      /* ------------------------------------------------------------------ */
      fontFamily: {
        // Display / headings — geometric grotesk
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        // Body — long-form readability
        sans: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        // Code / labels / taglines (UPPERCASE, letterspaced)
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      /* ------------------------------------------------------------------ */
      /* SPACING — mirrors --space-* (extends the default 4px scale)        */
      /* ------------------------------------------------------------------ */
      spacing: {
        section: 'var(--space-section)',
        'section-tight': 'var(--space-section-tight)',
        gutter: 'var(--space-gutter)',
      },

      // Container max-widths -> max-w-* utilities
      maxWidth: {
        xs: 'var(--container-xs)',
        sm: 'var(--container-sm)',
        md: 'var(--container-md)',
        lg: 'var(--container-lg)',
        xl: 'var(--container-xl)',
        '2xl': 'var(--container-2xl)',
        prose: 'var(--container-prose)',
      },

      /* ------------------------------------------------------------------ */
      /* RADIUS — mirrors --radius-*                                        */
      /* ------------------------------------------------------------------ */
      borderRadius: {
        none: 'var(--radius-none)',
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        pill: 'var(--radius-pill)',
        full: 'var(--radius-full)',
      },

      /* ------------------------------------------------------------------ */
      /* SHADOWS — mirrors --shadow-* (warm, teal-tinted)                   */
      /* ------------------------------------------------------------------ */
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        coral: 'var(--shadow-coral)', // CTA glow
        inset: 'var(--shadow-inset)',
        none: 'none',
      },

      /* ------------------------------------------------------------------ */
      /* Z-INDEX — mirrors --z-*                                            */
      /* ------------------------------------------------------------------ */
      zIndex: {
        behind: 'var(--z-behind)',
        base: 'var(--z-base)',
        raised: 'var(--z-raised)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        backdrop: 'var(--z-backdrop)',
        drawer: 'var(--z-drawer)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        toast: 'var(--z-toast)',
        tooltip: 'var(--z-tooltip)',
        max: 'var(--z-max)',
      },

      /* ------------------------------------------------------------------ */
      /* BREAKPOINTS — kept literal to match the documented --bp-* tokens   */
      /* (Tailwind resolves screens before CSS vars, so vars can't be used) */
      /* ------------------------------------------------------------------ */
      // NOTE: `screens` lives at theme root, not `extend`, when you want to
      // REPLACE defaults. Here we extend, preserving Tailwind's defaults,
      // which already equal these values — restated for documentation.

      /* ------------------------------------------------------------------ */
      /* MOTION — keyframes + animations                                    */
      /* ------------------------------------------------------------------ */
      keyframes: {
        // Enter: rise + fade. Pairs with IntersectionObserver reveal.
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Enter: subtle pop. Good for cards, badges, modals.
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Loading shimmer — sweep a highlight across a skeleton.
        // Pair with a 200%-wide gradient background.
        shimmer: {
          '0%': { backgroundPosition: '-150% 0' },
          '100%': { backgroundPosition: '150% 0' },
        },
        // Infinite horizontal ticker. Translate a duplicated track -50%.
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        // var(--ease-out) / var(--duration-*) come from tokens.css
        'fade-up': 'fade-up var(--duration-slow, 450ms) var(--ease-out, cubic-bezier(0.22,1,0.36,1)) both',
        'scale-in': 'scale-in var(--duration-base, 250ms) var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1)) both',
        shimmer: 'shimmer 1.6s linear infinite',
        marquee: 'marquee 24s linear infinite',
      },
    },
  },
};

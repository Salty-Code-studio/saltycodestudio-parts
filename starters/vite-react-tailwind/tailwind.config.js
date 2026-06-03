/**
 * Tailwind v3 config for the saltycodestudio Vite + React starter.
 * ---------------------------------------------------------------------------
 * The heavy lifting (Sand & Surf colors, fonts, spacing, radius, shadows,
 * animations) lives in the shared brand PRESET. We just point at it and tell
 * Tailwind which files to scan for class names.
 *
 * Path note: this starter sits at
 *   saltycodestudio-parts/starters/vite-react-tailwind/
 * so the foundations are TWO levels up at  ../../foundations/.
 *
 * The preset is a CommonJS module (`module.exports = { theme: { extend } }`).
 * In this ESM config we use `presets: ['../../foundations/tailwind.preset.js']`
 * — Tailwind resolves and `require()`s string-path presets itself, which is the
 * most robust way to load a CJS preset from an ESM config across Node versions.
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Load the brand theme. Tailwind require()s this path relative to this file.
  presets: ['../../foundations/tailwind.preset.js'],

  /**
   * CONTENT — every file Tailwind scans for class names. Anything not listed
   * here gets purged from the build. Because you'll PASTE PARTS from the shared
   * library, we scan those folders too so their utilities survive production
   * builds even before you copy a file into src/.
   */
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Shared parts you paste in (relative to this starter, two levels up):
    '../../components/**/*.{js,ts,jsx,tsx,html}',
    '../../sections/**/*.{js,ts,jsx,tsx,html}',
  ],

  // Dark mode via a `dark` class or [data-mode="dark"] on <html>.
  // The foundations ship a dark palette; flip the attribute to use it.
  darkMode: ['class', '[data-mode="dark"]'],

  // Project-specific overrides go here and WIN over the preset. Leave empty
  // until you actually need to diverge from the brand defaults.
  theme: {
    extend: {},
  },

  plugins: [],
};

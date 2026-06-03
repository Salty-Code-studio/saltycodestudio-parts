// Tailwind v3 config (ESM / .mjs).
//
// The brand theme lives in the shared preset at
//   ../../foundations/tailwind.preset.js
// which maps the "Sand & Surf" tokens onto Tailwind's theme (colors via
// `rgb(var(--rgb-*) / <alpha-value>)`, plus spacing, radius, shadows, and the
// animate-{fade-up,shimmer,marquee} utilities).
//
// That preset is authored as CommonJS (`module.exports = {...}`). To load a
// CommonJS module from this ESM config reliably across Node/bundlers, we use
// `createRequire` rather than a bare `import` (which can resolve to the wrong
// shape depending on interop settings).
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const scsPreset = require("../../foundations/tailwind.preset.js");

/** @type {import('tailwindcss').Config} */
export default {
  // Inherit every brand token from the shared foundations preset.
  presets: [scsPreset],

  // Where Tailwind scans for class names to keep in the build.
  // Includes the local app AND any parts you copy into src/, plus the shared
  // React component library two levels up so classes used inside imported
  // parts (e.g. ../../components/react/*) are never purged.
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,vue,svelte}",
    "../../components/**/*.{js,jsx,ts,tsx,vue,svelte,astro,html}",
  ],

  // Project-specific overrides go here and WIN over the preset.
  // Keep this empty until you genuinely need to diverge from the brand.
  theme: {
    extend: {},
  },

  plugins: [],
};

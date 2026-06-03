/**
 * saltycodestudio — Tailwind v3 config for the Next.js starter
 * ----------------------------------------------------------------------------
 * The brand theme (colors, fonts, spacing, radii, shadows, animations) lives
 * entirely in the shared preset at ../../foundations/tailwind.preset.js, so it
 * is identical across every starter and component in saltycodestudio-parts.
 * This file only declares what is LOCAL to a project: the content globs Tailwind
 * scans, and any project-specific overrides (which win over the preset).
 *
 * The preset is a CommonJS module (`module.exports`); with `esModuleInterop`
 * and bundler module resolution (see tsconfig.json) the default import below
 * resolves cleanly.
 *
 * Tailwind v3 is intentional here — the preset uses the v3 `presets` array and
 * the `rgb(var(--rgb-*) / <alpha-value>)` color syntax. Don't upgrade to v4
 * without rewriting both the preset and app/globals.css.
 */
import type { Config } from "tailwindcss";

// The required shared brand preset. Path is relative to this config file:
//   starters/nextjs/  ->  ../  = starters/  ->  ../  = repo root  ->  /foundations
import scsPreset from "../../foundations/tailwind.preset.js";

const config: Config = {
  // Pull the full brand theme in from the foundations preset.
  presets: [scsPreset as Partial<Config>],

  // Files Tailwind scans for class names. App Router lives in /app; the extra
  // globs are here so pasted parts in /components or /lib are picked up too.
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./lib/**/*.{ts,tsx,js,jsx}",
  ],

  theme: {
    extend: {
      // Project-local overrides go here and win over the preset. Example:
      // wire the next/font CSS variables (set in app/layout.tsx) into the
      // brand font families so `font-display` / `font-sans` / `font-mono`
      // use the self-hosted, optimized fonts instead of the named fallbacks.
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
    },
  },

  plugins: [],
};

export default config;

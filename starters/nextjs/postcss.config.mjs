/**
 * saltycodestudio — PostCSS config
 * ----------------------------------------------------------------------------
 * Tailwind v3 runs as a PostCSS plugin. `postcss-import` is added so the
 * native `@import` statements in app/globals.css — which pull the brand
 * foundations from ../../foundations — are INLINED at build time instead of
 * left as runtime @import requests (faster, and required for the Tailwind
 * preset to see the token files).
 *
 * Plugin order matters: postcss-import → tailwindcss → autoprefixer.
 */
const config = {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;

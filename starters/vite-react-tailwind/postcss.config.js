// PostCSS config — Vite reads this automatically.
//
// Plugin order matters:
//   1. tailwindcss   — expands @tailwind directives + scans `content` files
//                      and generates only the utilities you actually use.
//   2. autoprefixer  — adds vendor prefixes based on your browserslist.
//
// We write `tailwindcss: {}` (not the v4 `@tailwindcss/postcss` package)
// because the brand preset at ../../foundations/tailwind.preset.js is a
// Tailwind v3 CommonJS preset. Pinned to tailwindcss ^3.4 in package.json.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

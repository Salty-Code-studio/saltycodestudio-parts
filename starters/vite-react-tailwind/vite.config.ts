import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config — https://vite.dev/config/
//
// Minimal on purpose. The only plugin we need is @vitejs/plugin-react, which
// wires up React Fast Refresh in dev and the React JSX transform in build.
//
// Tailwind + Autoprefixer are NOT configured here — they run through PostCSS,
// which Vite picks up automatically from `postcss.config.js`. Keeping the two
// concerns separate is what lets you drop new PostCSS plugins in later without
// touching this file.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // matches the README; change freely
    open: true, // auto-open the browser on `npm run dev`
  },
});

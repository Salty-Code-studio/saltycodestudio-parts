// @ts-check
import { defineConfig } from "astro/config";

// Official Tailwind v3 integration. It runs Tailwind's PostCSS pipeline for us
// and (by default) injects a base stylesheet. We turn that auto-inject OFF
// (`applyBaseStyles: false`) because we own the CSS entry point ourselves in
// `src/styles/global.css` — that file controls the exact @import order the
// foundations need (tokens BEFORE @tailwind, utilities AFTER). See that file.
import tailwind from "@astrojs/tailwind";

// React integration so you can drop `.tsx` "islands" from
// ../../components/react onto otherwise-static Astro pages. Remove this import
// and the entry below if you don't need interactive React.
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // Update to your real domain — used for absolute URLs in OG tags & sitemaps.
  site: "https://saltycodestudio.com",

  integrations: [
    tailwind({
      // We import `@tailwind base/components/utilities` by hand in
      // src/styles/global.css, interleaved with the foundation layers.
      // Letting the integration also inject its base would double up Preflight.
      applyBaseStyles: false,
    }),
    react(),
  ],
});

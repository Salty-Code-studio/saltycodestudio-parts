/**
 * saltycodestudio — Next.js config (App Router)
 * ----------------------------------------------------------------------------
 * Deliberately minimal. The starter ships nothing exotic so it stays a clean
 * base to copy parts onto.
 *
 * `transpilePackages` note: the brand foundations live OUTSIDE this package
 * (../../foundations) and are imported as plain CSS/JS, so they don't need
 * transpiling. If you later pull a foundations *module* that ships untranspiled
 * TS/JSX, add its package name here.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fail the production build on type errors instead of shipping them.
  // (Next ignores TS errors at build time only if you flip this to true.)
  typescript: {
    ignoreBuildErrors: false,
  },

  // React strict mode surfaces unsafe lifecycles / double-effect bugs in dev.
  reactStrictMode: true,
};

export default nextConfig;

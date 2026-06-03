/**
 * saltycodestudio — home page (App Router)
 * ----------------------------------------------------------------------------
 * A single hero section that exercises the brand vocabulary end to end:
 *   - palette utilities from the preset:  bg-sand, text-teal, bg-coral, text-sky
 *   - alpha modifiers (proof the --rgb-* channel wiring works): text-teal/70
 *   - brand fonts:  font-mono (eyebrow), font-display (headline), font-body
 *   - motion:  animate-fade-up from the preset (respects reduced-motion via
 *     foundations/motion.css)
 *   - a gradient text accent from foundations/gradients.css (.text-gradient)
 *
 * This is a Server Component (no "use client") — it renders to static HTML.
 * Drop interactive parts from ../../components on top as needed.
 */
export default function HomePage() {
  return (
    <main className="relative isolate overflow-hidden">
      {/* Soft mesh wash behind the hero — class from foundations/gradients.css */}
      <div
        aria-hidden
        className="mesh-gradient pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      <section className="mx-auto flex max-w-xl flex-col items-start justify-center gap-6 px-gutter py-section">
        {/* Eyebrow — mono, letterspaced, the brand's label voice */}
        <p className="animate-fade-up font-mono text-xs uppercase tracking-[0.2em] text-coral">
          saltycodestudio
        </p>

        {/* Headline — display face, generous scale */}
        <h1
          className="animate-fade-up text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight text-teal sm:text-6xl md:text-7xl"
          style={{ animationDelay: "60ms" }}
        >
          Clean code,{" "}
          <span className="text-gradient">warm coast.</span>
        </h1>

        {/* Sub-copy — body face, dialed-back ink via alpha modifier */}
        <p
          className="animate-fade-up max-w-md text-pretty text-lg leading-relaxed text-teal/70"
          style={{ animationDelay: "120ms" }}
        >
          A Next.js starter wired to the saltycodestudio foundations — Sand &amp;
          Surf palette, Space Grotesk / Inter / JetBrains Mono, and the shared
          Tailwind preset. Build on it; paste parts on top.
        </p>

        {/* CTAs — one coral primary per view, plus a quiet secondary */}
        <div
          className="animate-fade-up mt-2 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "180ms" }}
        >
          <a
            href="#"
            className="inline-flex items-center rounded-lg bg-coral px-6 py-3 font-display text-sm font-medium text-white shadow-coral transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
          >
            Start a project
          </a>
          <a
            href="#"
            className="inline-flex items-center rounded-lg border border-teal/20 px-6 py-3 font-display text-sm font-medium text-teal transition-colors duration-200 hover:bg-teal/5"
          >
            See the work
          </a>
        </div>

        {/* Footnote — secondary sky accent, mono */}
        <p
          className="animate-fade-up mt-6 font-mono text-xs text-sky"
          style={{ animationDelay: "240ms" }}
        >
          ~&lt; since 2026
        </p>
      </section>
    </main>
  );
}

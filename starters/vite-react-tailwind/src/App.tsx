/**
 * App — a single hero section that doubles as a smoke test for the foundations.
 *
 * Every class below comes from the shared Tailwind preset
 * (../../foundations/tailwind.preset.js):
 *   bg-sand / text-teal / text-coral / bg-coral / text-sky   → Sand & Surf palette
 *   font-display / font-mono                                 → Space Grotesk / JetBrains Mono
 *   max-w-prose, shadow-coral, rounded-pill                  → token-backed scales
 *   animate-fade-up                                          → preset keyframe
 *
 * If the headline renders in Deep Teal on Warm Sand with a Coral CTA, your
 * tokens.css → preset → index.css chain is wired correctly.
 */
export default function App() {
  return (
    <main className="min-h-screen bg-sand text-teal">
      <section className="mx-auto flex min-h-screen max-w-prose flex-col items-center justify-center px-6 text-center">
        {/* Eyebrow — JetBrains Mono, letterspaced, in the supporting Sky accent */}
        <p className="animate-fade-up font-mono text-sm uppercase tracking-[0.2em] text-sky">
          ~&lt; saltycodestudio
        </p>

        {/* Headline — Space Grotesk display, with one Coral accent word */}
        <h1
          className="animate-fade-up mt-6 font-display text-5xl font-semibold leading-tight sm:text-6xl"
          style={{ animationDelay: '80ms' }}
        >
          Clean code,
          <br />
          <span className="text-coral">warm coast.</span>
        </h1>

        {/* Sub — body Inter, dimmed teal via the preset's alpha modifier */}
        <p
          className="animate-fade-up mt-6 text-lg text-teal/70"
          style={{ animationDelay: '160ms' }}
        >
          A Vite + React + Tailwind starter, pre-wired to the Sand &amp; Surf
          foundations. Paste a part from the library and ship.
        </p>

        {/* CTAs — one Coral primary (the single accent), one quiet teal outline */}
        <div
          className="animate-fade-up mt-10 flex flex-col gap-3 sm:flex-row"
          style={{ animationDelay: '240ms' }}
        >
          <a
            href="#start"
            className="rounded-pill bg-coral px-7 py-3 font-display font-medium text-white shadow-coral transition-transform duration-base hover:-translate-y-0.5"
          >
            Start a project
          </a>
          <a
            href="#parts"
            className="rounded-pill border border-teal/30 px-7 py-3 font-display font-medium text-teal transition-colors duration-base hover:bg-teal/5"
          >
            Browse the parts
          </a>
        </div>
      </section>
    </main>
  );
}

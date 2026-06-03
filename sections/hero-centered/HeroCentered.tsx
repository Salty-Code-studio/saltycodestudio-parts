import type { ReactNode } from "react";

/**
 * HeroCentered — saltycodestudio "Sand & Surf"
 * ---------------------------------------------------------------------------
 * A centered hero: monospace eyebrow, oversized display headline, supporting
 * lede, dual CTAs (coral primary + ghost secondary), an optional trust strip,
 * and a soft sand→surf gradient backdrop with grain + glow ornaments.
 *
 * Brand tokens used (from foundations/tailwind.preset.js):
 *   sand / sand-2  · canvas + raised surface
 *   teal           · headings + ink on sand
 *   coral          · single CTA accent per view
 *   sky            · supporting accent
 *   ink            · deep text / borders
 *   font-display   · Space Grotesk     font-mono · JetBrains Mono
 *
 * Self-contained: no external state, no client JS required.
 */

export interface HeroCenteredCTA {
  /** Visible button label. */
  label: string;
  /** Destination — anchor or route. */
  href: string;
  /** Open in a new tab. */
  external?: boolean;
}

export interface HeroCenteredProps {
  /** Small letterspaced kicker above the headline. */
  eyebrow?: string;
  /**
   * The oversized headline. Pass a string, or a node to highlight part of it
   * (e.g. wrap a word in <span className="text-coral">…</span>).
   */
  headline?: ReactNode;
  /** Supporting sentence under the headline. */
  subheadline?: string;
  /** Primary call to action (coral). */
  primaryCta?: HeroCenteredCTA;
  /** Secondary call to action (ghost). */
  secondaryCta?: HeroCenteredCTA;
  /** Tiny reassurance line under the buttons (e.g. "No credit card needed"). */
  note?: string;
  /** Optional trust-strip labels rendered as a quiet logo/word row. */
  trustedBy?: string[];
  /** Extra classes for the outer <section>. */
  className?: string;
}

const DEFAULT_HEADLINE = (
  <>
    Ship a coastal-calm site
    <br className="hidden sm:block" />{" "}
    that <span className="text-coral">actually converts</span>.
  </>
);

const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
);

const SparkIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="h-3.5 w-3.5"
    fill="currentColor"
  >
    <path d="M10 1.5l1.7 4.9 4.8 1.7-4.8 1.7L10 14.7 8.3 9.8 3.5 8.1l4.8-1.7L10 1.5z" />
  </svg>
);

export default function HeroCentered({
  eyebrow = "Web studio · Bonaire → worldwide",
  headline = DEFAULT_HEADLINE,
  subheadline = "saltycodestudio designs and builds fast, accessible sites for brands that want to feel premium without the agency price tag. Strategy, design, and code from one tight team.",
  primaryCta = { label: "Start a project", href: "#contact" },
  secondaryCta = { label: "See the work", href: "#work" },
  note = "Free 20-minute fit call · No pitch decks, just a plan.",
  trustedBy = ["Dushi Club", "PLAYA", "United Liquors", "ORIGEN", "Reef & Co."],
  className = "",
}: HeroCenteredProps) {
  const externalAttrs = (cta: HeroCenteredCTA) =>
    cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <section
      className={`relative isolate overflow-hidden bg-sand ${className}`}
      aria-labelledby="hero-centered-heading"
    >
      {/* ── Gradient + ornament backdrop ───────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Base soft wash: sand → faint surf at the bottom */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(79,168,201,0.18)_0%,rgba(242,235,221,0)_55%)]" />
        {/* Warm coral glow, top-left */}
        <div className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-coral/20 blur-3xl" />
        {/* Cool surf glow, bottom-right */}
        <div className="absolute -bottom-32 -right-20 h-[30rem] w-[30rem] rounded-full bg-sky/25 blur-3xl" />
        {/* Faint grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,58,64,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,58,64,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(80%_60%_at_50%_30%,#000_30%,transparent_75%)]" />
        {/* Bottom fade into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-sand" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-32 lg:py-40">
        {/* ── Eyebrow ──────────────────────────────────────────────── */}
        {eyebrow ? (
          <span className="inline-flex items-center gap-2 rounded-pill border border-teal/15 bg-white/60 px-3.5 py-1.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-teal shadow-xs backdrop-blur-sm">
            <span className="text-coral">
              <SparkIcon />
            </span>
            {eyebrow}
          </span>
        ) : null}

        {/* ── Headline ─────────────────────────────────────────────── */}
        <h1
          id="hero-centered-heading"
          className="mt-7 font-display text-4xl font-bold leading-[1.05] tracking-tight text-teal text-balance sm:text-5xl lg:text-6xl xl:text-7xl"
        >
          {headline}
        </h1>

        {/* ── Subheadline ──────────────────────────────────────────── */}
        {subheadline ? (
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink/70 sm:text-lg">
            {subheadline}
          </p>
        ) : null}

        {/* ── CTAs ─────────────────────────────────────────────────── */}
        {(primaryCta || secondaryCta) && (
          <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            {primaryCta ? (
              <a
                href={primaryCta.href}
                {...externalAttrs(primaryCta)}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-coral px-7 py-3.5 font-display text-base font-semibold text-white shadow-coral transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral active:translate-y-0 sm:w-auto"
              >
                {primaryCta.label}
                <ArrowIcon />
              </a>
            ) : null}

            {secondaryCta ? (
              <a
                href={secondaryCta.href}
                {...externalAttrs(secondaryCta)}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-teal/20 bg-white/70 px-7 py-3.5 font-display text-base font-semibold text-teal backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal/40 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal sm:w-auto"
              >
                {secondaryCta.label}
              </a>
            ) : null}
          </div>
        )}

        {/* ── Reassurance note ─────────────────────────────────────── */}
        {note ? (
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-ink/45">
            {note}
          </p>
        ) : null}

        {/* ── Trust strip ──────────────────────────────────────────── */}
        {trustedBy && trustedBy.length > 0 ? (
          <div className="mt-14 w-full border-t border-teal/10 pt-8">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ink/40">
              Trusted by coastal &amp; lifestyle brands
            </p>
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {trustedBy.map((name) => (
                <li
                  key={name}
                  className="font-display text-sm font-semibold tracking-tight text-teal/55 transition-colors duration-200 hover:text-teal"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

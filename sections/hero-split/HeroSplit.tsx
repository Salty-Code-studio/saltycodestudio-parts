import React from "react";

/**
 * HeroSplit — saltycodestudio "Sand & Surf"
 * Split hero: bold headline + subcopy + CTAs on one side,
 * a code-window mockup on the other.
 */

export interface HeroSplitStat {
  value: string;
  label: string;
}

export interface HeroSplitProps {
  /** Small mono eyebrow above the headline */
  eyebrow?: string;
  /** Main headline — keep it short and bold */
  headline?: string;
  /** Word inside the headline to render in the coral accent */
  accentWord?: string;
  /** Supporting sentence under the headline */
  subcopy?: string;
  /** Primary call-to-action */
  primaryCta?: { label: string; href: string };
  /** Secondary call-to-action */
  secondaryCta?: { label: string; href: string };
  /** Tiny trust line under the CTAs */
  trustNote?: string;
  /** Stats shown beneath the CTAs */
  stats?: HeroSplitStat[];
  /** Filename shown in the mockup window title bar */
  mockupFile?: string;
  /** Lines of "code" rendered in the mockup */
  codeLines?: string[];
}

const defaultStats: HeroSplitStat[] = [
  { value: "98", label: "Lighthouse, median" },
  { value: "11d", label: "Idea to launch" },
  { value: "40+", label: "Sites shipped" },
];

const defaultCode: string[] = [
  "export const studio = {",
  '  name: "saltycodestudio",',
  '  tagline: "Clean code, warm coast.",',
  "  stack: [\"react\", \"tailwind\", \"edge\"],",
  "  ships(idea) {",
  "    return build(idea).fast().accessible();",
  "  },",
  "};",
];

export default function HeroSplit({
  eyebrow = "~< web design & development",
  headline = "Clean code, warm coast.",
  accentWord = "warm coast.",
  subcopy = "We build fast, accessible websites and apps with the calm of island time and the rigor of real engineering. No bloat, no buzzwords — just software that ships and holds up.",
  primaryCta = { label: "Start a project", href: "#contact" },
  secondaryCta = { label: "See the work", href: "#work" },
  trustNote = "Trusted by founders from Bonaire to Brooklyn.",
  stats = defaultStats,
  mockupFile = "studio.ts",
  codeLines = defaultCode,
}: HeroSplitProps) {
  const renderHeadline = () => {
    if (!accentWord || !headline.includes(accentWord)) {
      return headline;
    }
    const [before, after] = headline.split(accentWord);
    return (
      <>
        {before}
        <span className="text-[#FF6F59]">{accentWord}</span>
        {after}
      </>
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#F2EBDD] text-[#0E3A40]">
      {/* Soft surf glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#4FA8C9]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#FF6F59]/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left: copy */}
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#0E3A40]/15 bg-white/50 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-[#0E3A40]/70">
            {eyebrow}
          </p>

          <h1 className="mt-6 font-[var(--font-display,'Space_Grotesk',sans-serif)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {renderHeadline()}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-[#1C2B2E]/75">
            {subcopy}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={primaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6F59] px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#f25c45] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6F59]"
            >
              {primaryCta.label}
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h9.69L9.97 5.78a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.47-3.47H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href={secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0E3A40]/20 bg-white/40 px-7 py-3.5 text-base font-semibold text-[#0E3A40] transition hover:border-[#0E3A40]/40 hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E3A40]"
            >
              {secondaryCta.label}
            </a>
          </div>

          {trustNote ? (
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-[#0E3A40]/55">
              {trustNote}
            </p>
          ) : null}

          {stats.length > 0 ? (
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-[#0E3A40]/10 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-[var(--font-display,'Space_Grotesk',sans-serif)] text-3xl font-bold tracking-tight">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-sm text-[#1C2B2E]/60">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {/* Right: code-window mockup */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-[#4FA8C9]/25 to-[#FF6F59]/15 blur-2xl"
          />
          <div className="overflow-hidden rounded-2xl border border-[#0E3A40]/15 bg-[#0E3A40] shadow-2xl shadow-[#0E3A40]/20">
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#FF6F59]" />
              <span className="h-3 w-3 rounded-full bg-[#4FA8C9]" />
              <span className="h-3 w-3 rounded-full bg-[#F2EBDD]/70" />
              <span className="ml-3 font-mono text-xs text-[#F2EBDD]/60">
                {mockupFile}
              </span>
            </div>
            {/* Code body */}
            <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed text-[#F2EBDD]/90">
              <code>
                {codeLines.map((line, i) => (
                  <span key={i} className="grid grid-cols-[2ch_1fr] gap-4">
                    <span className="select-none text-right text-[#4FA8C9]/50">
                      {i + 1}
                    </span>
                    <span>{line}</span>
                  </span>
                ))}
              </code>
            </pre>
            {/* Status strip */}
            <div className="flex items-center justify-between border-t border-white/10 bg-[#1C2B2E] px-5 py-3 font-mono text-xs text-[#F2EBDD]/55">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#4FA8C9]" />
                build passing
              </span>
              <span>deployed to the edge · 38ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

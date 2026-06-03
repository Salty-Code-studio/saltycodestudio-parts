import type { FC, ReactNode } from "react";

/* ----------------------------------------------------------------------------
 * saltycodestudio — Features Bento
 * Brand palette "Sand & Surf": Warm Sand canvas, Deep Teal ink, Surf Coral
 * accent (one per view), Sky Blue supporting. Display: Space Grotesk,
 * Mono labels: JetBrains Mono, Body: Inter.
 * -------------------------------------------------------------------------- */

export interface BentoTile {
  /** Stable key + used for aria labelling. */
  id: string;
  /** Mono eyebrow shown above the title (e.g. "01 / SHIP"). */
  kicker?: string;
  /** Tile heading. */
  title: string;
  /** Supporting paragraph. */
  body: string;
  /** Inline SVG / emoji / node used as the tile glyph. */
  icon?: ReactNode;
  /** Grid emphasis. "lg" spans 2 columns, "tall" spans 2 rows. */
  span?: "sm" | "lg" | "tall";
  /** "ink" renders a dark Driftwood tile, "accent" a Surf Coral tile. */
  tone?: "sand" | "ink" | "accent";
  /** Optional little stat shown bottom-left (e.g. "99.98% uptime"). */
  stat?: string;
}

export interface FeaturesBentoProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  tiles?: BentoTile[];
  /** Footer call-to-action. */
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

/* --- default icons (currentColor, inherit tile text color) ---------------- */
const Wave: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
    <path d="M2 8c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6 0" />
    <path d="M2 14c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6 0" />
    <path d="M2 20c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 6 0" />
  </svg>
);
const Bracket: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
    <path d="M9 7l-5 5 5 5" />
    <path d="M15 7l5 5-5 5" />
  </svg>
);
const Gauge: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
    <path d="M12 13l4-4" />
    <path d="M4 18a8 8 0 1116 0" />
    <circle cx="12" cy="13" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);
const Shield: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const Compass: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </svg>
);

const DEFAULT_TILES: BentoTile[] = [
  {
    id: "ship",
    kicker: "01 / SHIP",
    title: "From kickoff to live in weeks, not quarters",
    body: "We scope tight, build in the open, and deploy continuously. You watch the product take shape in a staging URL from day one — no black-box sprints, no surprise reveals.",
    icon: <Wave />,
    span: "lg",
    tone: "ink",
    stat: "Avg. first deploy: 9 days",
  },
  {
    id: "stack",
    kicker: "02 / STACK",
    title: "Type-safe by default",
    body: "React, TypeScript, and an edge-rendered backend. The code reads like the docs.",
    icon: <Bracket />,
    tone: "sand",
  },
  {
    id: "speed",
    kicker: "03 / SPEED",
    title: "Built to score green",
    body: "Core Web Vitals are a requirement, not a retrofit. Every build ships with a Lighthouse budget baked into CI.",
    icon: <Gauge />,
    span: "tall",
    tone: "accent",
    stat: "100 / 100 performance",
  },
  {
    id: "secure",
    kicker: "04 / SECURE",
    title: "Hardened before handoff",
    body: "Dependency scanning, content-security headers, and a security review on every release branch.",
    icon: <Shield />,
    tone: "sand",
  },
  {
    id: "care",
    kicker: "05 / CARE",
    title: "We stick around after launch",
    body: "Monitoring, monthly check-ins, and a real human on the other end of the thread — not a ticket queue. Island time on the calls, internet time on the fixes.",
    icon: <Compass />,
    span: "lg",
    tone: "sand",
    stat: "99.98% measured uptime",
  },
];

const baseSpan: Record<NonNullable<BentoTile["span"]>, string> = {
  sm: "md:col-span-1 md:row-span-1",
  lg: "md:col-span-2 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
};

const toneStyles: Record<NonNullable<BentoTile["tone"]>, string> = {
  sand: "bg-white/70 text-[#0E3A40] ring-1 ring-[#0E3A40]/10 hover:ring-[#0E3A40]/20",
  ink: "bg-[#0E3A40] text-[#F2EBDD] ring-1 ring-[#0E3A40] hover:ring-[#4FA8C9]/60",
  accent: "bg-[#FF6F59] text-[#1C2B2E] ring-1 ring-[#FF6F59] hover:ring-[#1C2B2E]/30",
};

const kickerTone: Record<NonNullable<BentoTile["tone"]>, string> = {
  sand: "text-[#4FA8C9]",
  ink: "text-[#4FA8C9]",
  accent: "text-[#1C2B2E]/70",
};

const iconChipTone: Record<NonNullable<BentoTile["tone"]>, string> = {
  sand: "bg-[#0E3A40]/5 text-[#0E3A40] ring-1 ring-[#0E3A40]/10",
  ink: "bg-[#F2EBDD]/10 text-[#F2EBDD] ring-1 ring-[#F2EBDD]/15",
  accent: "bg-[#1C2B2E]/10 text-[#1C2B2E] ring-1 ring-[#1C2B2E]/15",
};

const statTone: Record<NonNullable<BentoTile["tone"]>, string> = {
  sand: "text-[#0E3A40]/60",
  ink: "text-[#F2EBDD]/70",
  accent: "text-[#1C2B2E]/70",
};

const FeaturesBento: FC<FeaturesBentoProps> = ({
  eyebrow = "WHY SALTYCODE",
  title = "Everything you need to ship something that lasts",
  description = "A studio-sized team with agency range. We design, build, and look after web products that are fast, secure, and genuinely nice to use.",
  tiles = DEFAULT_TILES,
  ctaLabel = "See how we work",
  ctaHref = "#process",
  className = "",
}) => {
  return (
    <section
      aria-labelledby="features-bento-title"
      className={`relative overflow-hidden bg-[#F2EBDD] py-20 sm:py-28 ${className}`}
    >
      {/* soft decorative wash, non-interactive */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#4FA8C9]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#FF6F59]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#FF6F59]">
            {eyebrow}
          </p>
          <h2
            id="features-bento-title"
            className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight text-[#0E3A40] sm:text-4xl lg:text-5xl"
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
          >
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#1C2B2E]/75 sm:text-lg">
            {description}
          </p>
        </header>

        <div className="mt-12 grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          {tiles.map((tile) => {
            const tone = tile.tone ?? "sand";
            const span = tile.span ?? "sm";
            return (
              <article
                key={tile.id}
                aria-labelledby={`bento-${tile.id}-title`}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300 sm:p-7 ${baseSpan[span]} ${toneStyles[tone]}`}
              >
                <div>
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconChipTone[tone]}`}
                    aria-hidden="true"
                  >
                    {tile.icon ?? <Wave />}
                  </span>
                  {tile.kicker && (
                    <p className={`mt-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] ${kickerTone[tone]}`}>
                      {tile.kicker}
                    </p>
                  )}
                  <h3
                    id={`bento-${tile.id}-title`}
                    className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight sm:text-xl"
                    style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
                  >
                    {tile.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-80">{tile.body}</p>
                </div>
                {tile.stat && (
                  <p className={`mt-6 font-mono text-xs tracking-wide ${statTone[tone]}`}>
                    {tile.stat}
                  </p>
                )}
              </article>
            );
          })}
        </div>

        {ctaLabel && (
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF6F59] px-6 py-3 font-medium text-[#1C2B2E] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E3A40]"
            >
              {ctaLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#0E3A40]/55">
              Clean code, warm coast.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturesBento;

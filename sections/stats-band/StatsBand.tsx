import React from "react";

export interface Stat {
  /** The headline number/metric, e.g. "120+" or "99.9%". */
  value: string;
  /** Short label describing the metric. */
  label: string;
  /** Optional one-line detail shown under the label. */
  detail?: string;
}

export interface StatsBandProps {
  /** Small eyebrow/kicker above the heading. */
  eyebrow?: string;
  /** Main heading for the band. */
  heading?: string;
  /** Supporting sentence under the heading. */
  description?: string;
  /** The metrics to display (3–4 recommended). */
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  { value: "120+", label: "Sites shipped", detail: "From landing pages to full builds" },
  { value: "99.9%", label: "Uptime delivered", detail: "Across hosted client projects" },
  { value: "0.9s", label: "Median load time", detail: "Measured on real-world 4G" },
  { value: "4.9/5", label: "Client rating", detail: "Based on 60+ engagements" },
];

/**
 * StatsBand — a band of key metrics with labels on an accent background.
 * Brand palette: "Sand & Surf". Responsive, accessible, no external deps.
 */
export default function StatsBand({
  eyebrow = "By the numbers",
  heading = "Proof in the shipping log",
  description = "Clean code, warm coast — and a track record we are happy to put in writing.",
  stats = defaultStats,
}: StatsBandProps) {
  return (
    <section
      aria-labelledby="stats-band-heading"
      className="relative overflow-hidden bg-[#0E3A40] text-[#F2EBDD]"
    >
      {/* Decorative wave / glow accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#4FA8C9]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#FF6F59]/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#4FA8C9]">
            {eyebrow}
          </p>
          <h2
            id="stats-band-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-[#F2EBDD] sm:text-4xl"
          >
            {heading}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-[#F2EBDD]/70">
              {description}
            </p>
          ) : null}
        </div>

        <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-[#F2EBDD]/10 ring-1 ring-[#F2EBDD]/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={`${stat.label}-${i}`}
              className="group flex flex-col items-center bg-[#0E3A40] px-6 py-10 text-center transition-colors duration-300 hover:bg-[#0E3A40]/60"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="order-1 text-4xl font-semibold tracking-tight text-[#F2EBDD] sm:text-5xl">
                <span className="bg-gradient-to-br from-[#F2EBDD] to-[#4FA8C9] bg-clip-text text-transparent">
                  {stat.value}
                </span>
              </dd>
              <p
                aria-hidden="true"
                className="order-2 mt-3 font-mono text-xs uppercase tracking-[0.18em] text-[#4FA8C9]"
              >
                {stat.label}
              </p>
              {stat.detail ? (
                <p className="order-3 mt-2 max-w-[16rem] text-sm leading-relaxed text-[#F2EBDD]/65">
                  {stat.detail}
                </p>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

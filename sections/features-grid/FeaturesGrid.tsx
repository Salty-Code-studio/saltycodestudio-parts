import React from "react";

/**
 * FeaturesGrid — a three/four-column feature grid with icons, titles, and
 * descriptions. Brand palette "Sand & Surf".
 */

export type FeatureItem = {
  /** Unique key for the item */
  id: string;
  /** Short, scannable title */
  title: string;
  /** One- or two-sentence supporting description */
  description: string;
  /** Inline SVG icon node, rendered inside the icon tile */
  icon: React.ReactNode;
};

export type FeaturesGridProps = {
  /** Small eyebrow label above the heading */
  eyebrow?: string;
  /** Section heading */
  heading?: string;
  /** Supporting paragraph under the heading */
  subheading?: string;
  /** Feature items to render */
  features?: FeatureItem[];
  /** Number of columns on large screens (3 or 4) */
  columns?: 3 | 4;
  /** Accessible label for the section landmark */
  ariaLabel?: string;
};

const iconClass = "h-6 w-6";

const defaultFeatures: FeatureItem[] = [
  {
    id: "ship-fast",
    title: "Ship in days, not quarters",
    description:
      "We work in tight, visible sprints so you see a live staging link the same week we start — no black-box six-month builds.",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
      </svg>
    ),
  },
  {
    id: "responsive",
    title: "Pixel-true on every screen",
    description:
      "Layouts are built mobile-first and tested across phones, tablets, and desktops so your site looks intentional everywhere.",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="14" height="11" rx="1.5" />
        <rect x="16" y="9" width="6" height="11" rx="1.5" />
        <path d="M2 18h10" />
      </svg>
    ),
  },
  {
    id: "performance",
    title: "Fast by default",
    description:
      "Lean code, optimized images, and edge delivery keep Core Web Vitals green so visitors and search engines both stay happy.",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20a8 8 0 1 0-8-8" />
        <path d="m12 12 4-3" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    ),
  },
  {
    id: "accessible",
    title: "Accessible to everyone",
    description:
      "WCAG-minded markup, real focus states, and proper contrast mean every visitor can use what we build — not just most.",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="5" r="2" />
        <path d="M5 8h14" />
        <path d="m9 8 1 6m4-6-1 6m-3 0-2 5m6-5 2 5" />
      </svg>
    ),
  },
  {
    id: "ownership",
    title: "You own the code",
    description:
      "We hand over clean, documented repositories and a CMS your team can actually run — no vendor lock-in, no hostage fees.",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m8 9-4 3 4 3" />
        <path d="m16 9 4 3-4 3" />
        <path d="m13 6-2 12" />
      </svg>
    ),
  },
  {
    id: "support",
    title: "Support that answers",
    description:
      "Launch is the start, not the finish. You get a direct line to the people who built it and a clear plan for what comes next.",
    icon: (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2Z" />
        <path d="M9 9h7M9 12.5h4" />
      </svg>
    ),
  },
];

export default function FeaturesGrid({
  eyebrow = "Why teams pick us",
  heading = "Everything you need to launch with confidence",
  subheading = "We pair sharp design with solid engineering so your site is fast, friendly, and built to grow with you.",
  features = defaultFeatures,
  columns = 3,
  ariaLabel = "Product features",
}: FeaturesGridProps) {
  const gridCols =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      aria-label={ariaLabel}
      className="bg-[#fbf7f0] py-20 sm:py-28 text-[#1c2b33]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1f8a8a]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {heading}
          </h2>
          {subheading ? (
            <p className="mt-4 text-lg leading-relaxed text-[#4a5d66]">
              {subheading}
            </p>
          ) : null}
        </div>

        <ul
          role="list"
          className={`mt-14 grid grid-cols-1 gap-6 ${gridCols}`}
        >
          {features.map((feature) => (
            <li key={feature.id}>
              <article className="group h-full rounded-2xl border border-[#ece0cd] bg-[#f4ece0]/60 p-7 transition duration-200 hover:-translate-y-1 hover:border-[#2ec3c3]/50 hover:bg-white hover:shadow-[0_18px_40px_-22px_rgba(15,92,92,0.45)] focus-within:-translate-y-1 focus-within:border-[#2ec3c3]/50">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f5c5c] text-[#f4ece0] shadow-sm transition group-hover:bg-[#1f8a8a]">
                  {feature.icon}
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#1c2b33]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#4a5d66]">
                  {feature.description}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

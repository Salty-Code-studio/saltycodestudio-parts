import React from "react";

/**
 * FeatureShowcase — alternating image-and-text feature rows that flip
 * left/right down the page. Brand palette "Sand & Surf".
 *
 * Tailwind only (no extra CSS). Drop into any React + Tailwind app.
 */

export interface FeatureCta {
  /** Visible link/button label. */
  label: string;
  /** Destination href. */
  href: string;
}

export interface FeatureItem {
  /** Small mono label above the heading, e.g. "01 — Delivery". */
  kicker?: string;
  /** Row headline. */
  title: string;
  /** Supporting paragraph. */
  body: string;
  /** Short bullet points rendered as a checklist. */
  bullets?: string[];
  /** Optional call to action for this row. */
  cta?: FeatureCta;
  /** Image source. Falls back to a generated inline SVG when omitted. */
  imageSrc?: string;
  /** Image alt text (required for real images; describe the visual). */
  imageAlt?: string;
  /** Small caption shown on the image card. */
  imageCaption?: string;
}

export interface FeatureShowcaseProps {
  /** Mono eyebrow above the section heading. */
  eyebrow?: string;
  /** Section heading. */
  heading?: string;
  /** Lead paragraph under the heading. */
  intro?: string;
  /** Feature rows. They automatically alternate image side. */
  features?: FeatureItem[];
  /** Extra classes for the outer <section>. */
  className?: string;
}

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    kicker: "01 — Discovery",
    title: "We map the work before we write a line of code",
    body: "Every build starts on the whiteboard, not the keyboard. We pin down the real goal, the edge cases, and the one metric that matters — so the code we ship is the code you actually needed.",
    bullets: [
      "Half-day product audit and tech-debt readout",
      "A scoped roadmap with honest estimates",
      "One Slack channel, one point of contact",
    ],
    cta: { label: "See our process", href: "#process" },
    imageCaption: "discovery.md",
    imageAlt: "Sticky notes and a roadmap sketch pinned to a sunlit studio wall",
  },
  {
    kicker: "02 — Build",
    title: "Clean code, warm coast — shipped on internet time",
    body: "Typed, tested, and reviewed by a human who will still be here next quarter. We deploy small and often, so you watch the product grow instead of waiting for a big-bang reveal.",
    bullets: [
      "Type-safe React, Next.js, and Tailwind front to back",
      "Preview deploys on every pull request",
      "Tests that cover the paths your users actually take",
    ],
    cta: { label: "View the stack", href: "#stack" },
    imageCaption: "deploy --prod",
    imageAlt: "A laptop on a driftwood desk showing a passing test suite",
  },
  {
    kicker: "03 — Handover",
    title: "You own everything when the surf settles",
    body: "No lock-in, no mystery infrastructure. You get the repo, the docs, and a walkthrough — plus a standing line to us for the months that follow launch.",
    bullets: [
      "Documented repo and runbook you keep forever",
      "A recorded handover walkthrough for the team",
      "30 days of post-launch support, no clock-watching",
    ],
    cta: { label: "Start a project", href: "#contact" },
    imageCaption: "handover/",
    imageAlt: "A tidy folder of documentation and keys handed across a table",
  },
];

/** Inline placeholder visual so the section always renders without assets. */
function PlaceholderArt({ caption }: { caption?: string }) {
  return (
    <svg
      role="img"
      aria-label="Abstract coastal pattern of layered waves"
      viewBox="0 0 640 460"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="fs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fd2e3" />
          <stop offset="100%" stopColor="#e7f1f2" />
        </linearGradient>
      </defs>
      <rect width="640" height="460" fill="url(#fs-sky)" />
      <circle cx="492" cy="118" r="56" fill="#FF6F59" opacity="0.9" />
      <path d="M0 300 C 120 256 200 332 320 300 C 440 268 540 332 640 296 L640 460 L0 460 Z" fill="#4FA8C9" />
      <path d="M0 350 C 130 312 210 384 330 352 C 450 320 545 384 640 348 L640 460 L0 460 Z" fill="#0E3A40" opacity="0.92" />
      <path d="M0 402 C 140 372 220 432 340 404 C 460 376 560 432 640 400 L640 460 L0 460 Z" fill="#0E3A40" />
      {caption ? (
        <text
          x="32"
          y="60"
          fill="#0E3A40"
          fontFamily="ui-monospace, 'JetBrains Mono', monospace"
          fontSize="20"
          letterSpacing="1"
        >
          {caption}
        </text>
      ) : null}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 h-5 w-5 flex-none text-[#1f8a8a]"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FeatureShowcase({
  eyebrow = "How we work",
  heading = "Three steps, no surprises",
  intro = "A small studio that treats your roadmap like its own. Here's what shipping with us looks like — from the first sketch to the keys in your hands.",
  features = DEFAULT_FEATURES,
  className = "",
}: FeatureShowcaseProps) {
  return (
    <section
      aria-labelledby="feature-showcase-heading"
      className={`bg-[#fbf7f0] py-20 sm:py-28 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#1f8a8a]">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id="feature-showcase-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-[#1c2b33] sm:text-4xl"
          >
            {heading}
          </h2>
          {intro ? (
            <p className="mt-4 text-lg leading-relaxed text-[#4a5d66]">{intro}</p>
          ) : null}
        </div>

        {/* Alternating rows */}
        <div className="mt-16 flex flex-col gap-16 sm:mt-20 sm:gap-24">
          {features.map((feature, index) => {
            const flipped = index % 2 === 1;
            const headingId = `feature-showcase-row-${index}`;
            return (
              <article
                key={`${feature.title}-${index}`}
                aria-labelledby={headingId}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                {/* Image card */}
                <div className={flipped ? "lg:order-2" : "lg:order-1"}>
                  <div className="relative overflow-hidden rounded-3xl border border-[#ece0cd] bg-[#f4ece0] shadow-[0_20px_50px_-30px_rgba(15,92,92,0.55)]">
                    <div className="aspect-[4/3] w-full">
                      {feature.imageSrc ? (
                        <img
                          src={feature.imageSrc}
                          alt={feature.imageAlt ?? ""}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <PlaceholderArt caption={feature.imageCaption} />
                      )}
                    </div>
                    {feature.imageCaption ? (
                      <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-[#0f5c5c]/90 px-3 py-1 font-mono text-xs tracking-wide text-[#f4ece0]">
                        {feature.imageCaption}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Text block */}
                <div className={flipped ? "lg:order-1" : "lg:order-2"}>
                  {feature.kicker ? (
                    <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#0f5c5c]">
                      {feature.kicker}
                    </p>
                  ) : null}
                  <h3
                    id={headingId}
                    className="mt-3 text-2xl font-bold tracking-tight text-[#1c2b33] sm:text-3xl"
                  >
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-[#4a5d66]">
                    {feature.body}
                  </p>

                  {feature.bullets && feature.bullets.length > 0 ? (
                    <ul className="mt-6 space-y-3">
                      {feature.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex gap-3 text-[#1c2b33]">
                          <CheckIcon />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {feature.cta ? (
                    <a
                      href={feature.cta.href}
                      className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[#1f8a8a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0f5c5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f5c5c]"
                    >
                      {feature.cta.label}
                      <ArrowIcon />
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

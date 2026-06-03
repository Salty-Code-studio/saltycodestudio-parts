import React from "react";

/**
 * PricingTiers — saltycodestudio
 * Tiered pricing with a highlighted recommended plan and feature lists.
 * Brand palette "Sand & Surf": warm sand canvas, deep-teal ink, surf-coral accent.
 *
 * Fonts (load once in your <head>):
 *   Space Grotesk (display), JetBrains Mono (labels), Inter (body)
 */

export interface PricingFeature {
  /** Feature label shown in the list. */
  label: string;
  /** When false, the feature is rendered as not-included (dimmed + dash icon). Defaults to true. */
  included?: boolean;
}

export interface PricingPlan {
  /** Internal id used as React key. */
  id: string;
  /** Plan name, e.g. "Launch". */
  name: string;
  /** One-line plan summary. */
  tagline: string;
  /** Price string already formatted, e.g. "$2,400". Use "Custom" for enterprise. */
  price: string;
  /** Billing cadence shown after the price, e.g. "/ project" or "/ month". */
  cadence?: string;
  /** Feature rows for this plan. */
  features: PricingFeature[];
  /** CTA button label. */
  ctaLabel: string;
  /** CTA href. */
  ctaHref?: string;
  /** Marks this plan as the recommended / highlighted card. */
  recommended?: boolean;
  /** Small badge shown on the recommended card. Defaults to "Most popular". */
  badge?: string;
}

export interface PricingTiersProps {
  /** Mono eyebrow above the heading. */
  eyebrow?: string;
  /** Section heading. */
  heading?: string;
  /** Supporting paragraph under the heading. */
  subheading?: string;
  /** The plans to render (3 looks best). */
  plans?: PricingPlan[];
  /** Reassurance line under the cards. */
  footnote?: string;
  /** Optional id for in-page anchoring. */
  id?: string;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: "launch",
    name: "Launch",
    tagline: "A sharp marketing site, shipped fast.",
    price: "$2,400",
    cadence: "/ project",
    ctaLabel: "Start with Launch",
    ctaHref: "#contact",
    features: [
      { label: "Up to 5 responsive pages" },
      { label: "Custom design from your brand" },
      { label: "CMS for blog & updates" },
      { label: "Core SEO & analytics setup" },
      { label: "2 rounds of revisions" },
      { label: "Staging environment", included: false },
      { label: "Priority support window", included: false },
    ],
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "Design system + build for growing teams.",
    price: "$6,800",
    cadence: "/ project",
    recommended: true,
    badge: "Most popular",
    ctaLabel: "Build with Scale",
    ctaHref: "#contact",
    features: [
      { label: "Up to 12 pages + reusable blocks" },
      { label: "Component design system" },
      { label: "Headless CMS & content modeling" },
      { label: "Advanced SEO & performance pass" },
      { label: "4 rounds of revisions" },
      { label: "Staging environment" },
      { label: "Priority support window", included: false },
    ],
  },
  {
    id: "studio",
    name: "Studio",
    tagline: "An embedded partner for product work.",
    price: "Custom",
    cadence: "/ retainer",
    ctaLabel: "Talk to us",
    ctaHref: "#contact",
    features: [
      { label: "Unlimited pages & app surfaces" },
      { label: "Full design system + tokens" },
      { label: "Custom integrations & APIs" },
      { label: "Ongoing performance & a11y audits" },
      { label: "Continuous iteration cycles" },
      { label: "Multiple staging environments" },
      { label: "Priority support window" },
    ],
  },
];

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5 10.5l3.2 3.2L15 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 10h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PricingTiers({
  eyebrow = "~< PRICING",
  heading = "Pricing that fits the build.",
  subheading = "Clear scopes, no surprise invoices. Pick a tier to start — we right-size every engagement before a line of code is written.",
  plans = DEFAULT_PLANS,
  footnote = "All plans include source code, a handover walkthrough, and 30 days of post-launch support.",
  id = "pricing",
}: PricingTiersProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="bg-[#F2EBDD] py-20 sm:py-28 font-[Inter,system-ui,sans-serif] text-[#1C2B2E]"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-[JetBrains_Mono,ui-monospace,monospace] text-xs font-medium uppercase tracking-[0.22em] text-[#1f8a8a]">
            {eyebrow}
          </p>
          <h2
            id={`${id}-heading`}
            className="mt-4 font-[Space_Grotesk,system-ui,sans-serif] text-3xl font-bold leading-tight tracking-tight text-[#0E3A40] sm:text-4xl md:text-[2.75rem]"
          >
            {heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#4a5d66] sm:text-lg">
            {subheading}
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch lg:gap-7">
          {plans.map((plan) => {
            const recommended = !!plan.recommended;
            return (
              <div
                key={plan.id}
                className={[
                  "relative flex flex-col rounded-3xl p-7 transition-transform duration-300 sm:p-8",
                  recommended
                    ? "bg-[#0E3A40] text-[#F2EBDD] shadow-[0_24px_60px_-24px_rgba(14,58,64,0.55)] ring-1 ring-[#0E3A40] md:-mt-4 md:mb-[-1rem] md:scale-[1.015]"
                    : "bg-[#fbf7f0] text-[#1C2B2E] ring-1 ring-[#e3d8c4] hover:ring-[#1f8a8a]/40",
                ].join(" ")}
              >
                {recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#FF6F59] px-3.5 py-1 font-[JetBrains_Mono,ui-monospace,monospace] text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white shadow-sm">
                    {plan.badge ?? "Most popular"}
                  </span>
                )}

                {/* Plan name + tagline */}
                <div>
                  <h3
                    className={[
                      "font-[Space_Grotesk,system-ui,sans-serif] text-xl font-bold tracking-tight",
                      recommended ? "text-white" : "text-[#0E3A40]",
                    ].join(" ")}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={[
                      "mt-1.5 text-sm leading-relaxed",
                      recommended ? "text-[#cfe3e3]" : "text-[#4a5d66]",
                    ].join(" ")}
                  >
                    {plan.tagline}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-6 flex items-end gap-1.5">
                  <span
                    className={[
                      "font-[Space_Grotesk,system-ui,sans-serif] text-4xl font-bold tracking-tight sm:text-[2.6rem]",
                      recommended ? "text-white" : "text-[#0E3A40]",
                    ].join(" ")}
                  >
                    {plan.price}
                  </span>
                  {plan.cadence && (
                    <span
                      className={[
                        "pb-1.5 font-[JetBrains_Mono,ui-monospace,monospace] text-xs",
                        recommended ? "text-[#9fc6c6]" : "text-[#7a8a90]",
                      ].join(" ")}
                    >
                      {plan.cadence}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <a
                  href={plan.ctaHref ?? "#"}
                  className={[
                    "mt-6 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    recommended
                      ? "bg-[#FF6F59] text-white hover:bg-[#ff5942] focus-visible:ring-[#FF6F59] focus-visible:ring-offset-[#0E3A40]"
                      : "bg-[#0E3A40] text-[#F2EBDD] hover:bg-[#0b2e33] focus-visible:ring-[#0E3A40] focus-visible:ring-offset-[#fbf7f0]",
                  ].join(" ")}
                >
                  {plan.ctaLabel}
                </a>

                {/* Divider */}
                <div
                  className={[
                    "my-7 h-px w-full",
                    recommended ? "bg-white/15" : "bg-[#e3d8c4]",
                  ].join(" ")}
                />

                {/* Features */}
                <ul className="flex flex-1 flex-col gap-3.5">
                  {plan.features.map((feature, i) => {
                    const included = feature.included !== false;
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className={[
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                            included
                              ? recommended
                                ? "bg-[#2ec3c3]/25 text-[#7fe0e0]"
                                : "bg-[#1f8a8a]/12 text-[#1f8a8a]"
                              : recommended
                                ? "bg-white/10 text-[#7e9a9a]"
                                : "bg-[#1C2B2E]/5 text-[#9aa7ac]",
                          ].join(" ")}
                        >
                          {included ? (
                            <CheckIcon className="h-3.5 w-3.5" />
                          ) : (
                            <DashIcon className="h-3.5 w-3.5" />
                          )}
                        </span>
                        <span
                          className={[
                            "text-sm leading-snug",
                            included
                              ? recommended
                                ? "text-[#e7f0f0]"
                                : "text-[#1C2B2E]"
                              : recommended
                                ? "text-[#7e9a9a] line-through decoration-[#7e9a9a]/40"
                                : "text-[#9aa7ac] line-through decoration-[#9aa7ac]/40",
                          ].join(" ")}
                        >
                          {feature.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        {footnote && (
          <p className="mt-12 text-center text-sm text-[#4a5d66]">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}

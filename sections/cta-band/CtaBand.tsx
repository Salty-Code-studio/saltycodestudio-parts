import type { ReactNode } from "react";

export interface CtaBandAction {
  /** Button label. */
  label: string;
  /** Link target. */
  href: string;
  /** Visual weight. Primary = solid coral, secondary = outlined sand. */
  variant?: "primary" | "secondary";
}

export interface CtaBandProps {
  /** Small mono eyebrow above the headline. */
  eyebrow?: string;
  /** Main headline. Keep it short and confident. */
  headline?: string;
  /** Supporting line beneath the headline. */
  subcopy?: string;
  /** One or two buttons. The first should be the primary action. */
  actions?: CtaBandAction[];
  /** Optional reassurance line under the buttons (e.g. "No retainer required"). */
  footnote?: string;
  /** Optional slot rendered to the right on large screens (e.g. an inline form). */
  aside?: ReactNode;
  /** Accessible label for the section landmark. */
  ariaLabel?: string;
}

const defaultActions: CtaBandAction[] = [
  { label: "Book a build call", href: "#contact", variant: "primary" },
  { label: "See recent work", href: "#work", variant: "secondary" },
];

/**
 * CtaBand — a full-width call-to-action band set on a deep-teal gradient with
 * a coral accent. Brand palette "Sand & Surf". React + Tailwind.
 */
export default function CtaBand({
  eyebrow = "~< Ready when you are",
  headline = "Let's ship something clean.",
  subcopy = "Tell us what you're building. We'll come back with a plan, a timeline, and a fixed quote — no retainer, no buzzwords.",
  actions = defaultActions,
  footnote = "Replies within one business day · Based in Bonaire, building on internet time",
  aside,
  ariaLabel = "Get in touch",
}: CtaBandProps) {
  return (
    <section
      aria-label={ariaLabel}
      className="relative isolate overflow-hidden bg-[#0E3A40] text-[#F2EBDD]"
    >
      {/* Gradient + soft glows */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0E3A40] via-[#0E3A40] to-[#1C2B2E]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[#4FA8C9]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 right-0 -z-10 h-80 w-80 rounded-full bg-[#FF6F59]/20 blur-3xl"
      />
      {/* Wave hairline */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#4FA8C9]/40 to-transparent"
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-24">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#4FA8C9]">
              {eyebrow}
            </p>
          ) : null}

          <h2 className="font-[var(--font-display,inherit)] text-3xl font-bold leading-tight tracking-tight text-[#F2EBDD] sm:text-4xl lg:text-5xl">
            {headline}
          </h2>

          {subcopy ? (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#F2EBDD]/75 sm:text-lg">
              {subcopy}
            </p>
          ) : null}

          {actions.length > 0 ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {actions.map((action) => {
                const isPrimary = (action.variant ?? "primary") === "primary";
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    className={
                      isPrimary
                        ? "inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6F59] px-7 py-3.5 text-sm font-semibold text-[#1C2B2E] shadow-lg shadow-[#FF6F59]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ff8068] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6F59]"
                        : "inline-flex items-center justify-center gap-2 rounded-full border border-[#F2EBDD]/30 px-7 py-3.5 text-sm font-semibold text-[#F2EBDD] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F2EBDD]/60 hover:bg-[#F2EBDD]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4FA8C9]"
                    }
                  >
                    {action.label}
                    {isPrimary ? (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-4 w-4"
                      >
                        <path
                          d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </a>
                );
              })}
            </div>
          ) : null}

          {footnote ? (
            <p className="mt-6 text-xs text-[#F2EBDD]/55">{footnote}</p>
          ) : null}
        </div>

        {aside ? (
          <div className="w-full max-w-md shrink-0 lg:w-auto">{aside}</div>
        ) : null}
      </div>
    </section>
  );
}

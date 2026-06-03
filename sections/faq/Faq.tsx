"use client";

import { useId, useState } from "react";

export interface FaqItem {
  /** The question shown on the trigger row. */
  question: string;
  /** The answer revealed when the item is open. Plain text or JSX. */
  answer: React.ReactNode;
}

export interface FaqProps {
  /** Small eyebrow label above the heading. */
  eyebrow?: string;
  /** Main section heading. */
  heading?: string;
  /** Supporting line under the heading. */
  intro?: string;
  /** The questions and answers. */
  items?: FaqItem[];
  /**
   * Accordion behaviour. "single" keeps at most one panel open and closes the
   * others; "multiple" lets several stay open at once. Default "single".
   */
  mode?: "single" | "multiple";
  /** Index of the item open on first render (single mode). Default 0. Use -1 for all closed. */
  defaultOpen?: number;
  /** Optional contact prompt rendered below the list. Pass null to hide. */
  footnote?: React.ReactNode;
  /** Extra classes on the outer <section>. */
  className?: string;
}

const DEFAULT_ITEMS: FaqItem[] = [
  {
    question: "How long does a typical project take?",
    answer:
      "Most marketing sites land in three to five weeks, and product builds run six to twelve depending on scope. We send a tight estimate after the first call, then ship in weekly increments so you see real progress instead of a status deck.",
  },
  {
    question: "Do you work with my existing stack?",
    answer:
      "Usually, yes. We are fluent in React, Next.js, Astro and plain Tailwind, and we are comfortable dropping into an existing codebase. If your current setup is fighting you, we will say so plainly and lay out the trade-offs before anyone touches a config file.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "A clear sense of the outcome you are after and access to your brand assets. No formal spec required. We run a short kickoff to pin down goals and constraints, and we will draft the rest with you rather than waiting on a finished brief.",
  },
  {
    question: "How do you handle revisions and feedback?",
    answer:
      "Each milestone ships to a live preview link you can click through and comment on directly. We fold rounds of feedback into the next increment, so nothing piles up at the end. Two review passes are baked into every estimate.",
  },
  {
    question: "Will I be able to update the site myself?",
    answer:
      "That is the goal. We hand over clean, documented code and, where it helps, wire content into a CMS your team can edit without us. Every project closes with a walkthrough and a written runbook so you are never locked out of your own site.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We stick around for thirty days of free support to iron out anything the real world surfaces. After that, plenty of clients keep us on a light monthly retainer for tweaks, new pages and the occasional salty opinion.",
  },
];

const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-5 w-5 shrink-0 text-[#1f8a8a] transition-transform duration-300 ease-out group-aria-expanded:-rotate-180"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/**
 * Faq
 * ---
 * An accessible FAQ accordion with a smooth, height-animated open/close.
 *
 * Accessibility: each row is a real <button> wired with aria-expanded and
 * aria-controls pointing at its panel; the panel carries role="region" and an
 * aria-labelledby back to the trigger. Panels collapse via a CSS grid-rows
 * transition (0fr → 1fr) so the motion is GPU-light and reflow-free, and it is
 * disabled under prefers-reduced-motion.
 */
export function Faq({
  eyebrow = "Questions",
  heading = "The things people ask before we start",
  intro = "Straight answers, no fine print. If yours is not here, the inbox is always open.",
  items = DEFAULT_ITEMS,
  mode = "single",
  defaultOpen = 0,
  footnote = (
    <>
      Still curious?{" "}
      <a
        href="#contact"
        className="font-semibold text-[#0f5c5c] underline decoration-[#2ec3c3] decoration-2 underline-offset-4 transition-colors hover:text-[#1f8a8a]"
      >
        Send us a note
      </a>{" "}
      and we will reply within a day.
    </>
  ),
  className = "",
}: FaqProps) {
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(defaultOpen >= 0 ? [defaultOpen] : [])
  );
  const baseId = useId();

  const toggle = (index: number) => {
    setOpen((prev) => {
      const next = new Set(mode === "single" ? [] : prev);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section
      className={`bg-[#fbf7f0] py-20 text-[#1c2b33] sm:py-28 ${className}`}
      aria-labelledby={`${baseId}-title`}
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
        <header className="lg:sticky lg:top-24 lg:self-start">
          {eyebrow ? (
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f8a8a]">
              <span className="h-px w-6 bg-[#2ec3c3]" aria-hidden="true" />
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={`${baseId}-title`}
            className="text-3xl font-semibold leading-tight tracking-tight text-[#1c2b33] sm:text-4xl"
          >
            {heading}
          </h2>
          {intro ? (
            <p className="mt-4 max-w-sm text-base leading-relaxed text-[#4a5d66]">
              {intro}
            </p>
          ) : null}
        </header>

        <div className="divide-y divide-[#ece0cd] rounded-2xl border border-[#ece0cd] bg-[#f4ece0]/40">
          {items.map((item, index) => {
            const isOpen = open.has(index);
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;
            return (
              <FaqRow
                key={index}
                item={item}
                isOpen={isOpen}
                panelId={panelId}
                buttonId={buttonId}
                onToggle={() => toggle(index)}
              />
            );
          })}
        </div>
      </div>

      {footnote ? (
        <p className="mx-auto mt-10 max-w-6xl px-6 text-center text-sm text-[#4a5d66] lg:text-left">
          {footnote}
        </p>
      ) : null}
    </section>
  );
}

interface FaqRowProps {
  item: FaqItem;
  isOpen: boolean;
  panelId: string;
  buttonId: string;
  onToggle: () => void;
}

function FaqRow({ item, isOpen, panelId, buttonId, onToggle }: FaqRowProps) {
  return (
    <div className="group/row first:rounded-t-2xl last:rounded-b-2xl">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-4 rounded-[inherit] px-6 py-5 text-left text-base font-semibold text-[#1c2b33] transition-colors hover:text-[#0f5c5c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f8a8a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf7f0] sm:text-lg"
        >
          <span>{item.question}</span>
          <ChevronIcon />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        {/* The inner wrapper clips the content so the 0fr→1fr grid transition
            reads as a smooth height slide. inert + aria-hidden keep collapsed
            answers out of the tab order and off the accessibility tree. */}
        <div
          className="overflow-hidden"
          aria-hidden={!isOpen}
          inert={!isOpen ? true : undefined}
        >
          <div className="px-6 pb-6 pt-0 text-[15px] leading-relaxed text-[#4a5d66]">
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faq;

"use client";

import React, { useId, useState } from "react";

export interface AccordionItem {
  title: string;
  content: string;
  icon?: string;
}

export interface FeatureAccordionProps {
  items?: AccordionItem[];
  /** Index open by default; null for all closed */
  defaultOpen?: number | null;
  /** Allow closing the open item by clicking it again */
  collapsible?: boolean;
  heading?: string;
  className?: string;
}

const DEFAULT_ITEMS: AccordionItem[] = [
  {
    title: "Design that fits your brand",
    content:
      "We start from your voice and palette, not a template. Every component is tuned to feel custom — spacing, type scale, and motion all dialed in to your brand.",
    icon: "🎨",
  },
  {
    title: "Built for performance",
    content:
      "Static-first rendering, image optimization, and edge caching keep your Lighthouse scores in the high 90s. Fast sites convert better and rank higher.",
    icon: "⚡",
  },
  {
    title: "Accessible by default",
    content:
      "Semantic markup, keyboard support, focus states, and AA-contrast color choices ship in every build — not as an afterthought.",
    icon: "♿",
  },
  {
    title: "Easy to maintain",
    content:
      "Clean, typed components and a CMS your team can actually use. Update copy and images without filing an engineering ticket.",
    icon: "🛠️",
  },
];

export default function FeatureAccordion({
  items = DEFAULT_ITEMS,
  defaultOpen = 0,
  collapsible = true,
  heading = "How we work",
  className = "",
}: FeatureAccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  const toggle = (i: number) =>
    setOpen((cur) => (cur === i ? (collapsible ? null : cur) : i));

  return (
    <section className={`bg-[#faf6ef] py-20 px-6 ${className}`}>
      <div className="mx-auto max-w-2xl">
        {heading && (
          <h2 className="mb-8 text-3xl font-semibold tracking-tight text-[#1c2b33] sm:text-4xl">
            {heading}
          </h2>
        )}

        <div className="divide-y divide-[#e7ddcd] overflow-hidden rounded-2xl border border-[#e7ddcd] bg-white/70 backdrop-blur">
          {items.map((item, i) => {
            const isOpen = open === i;
            const headerId = `${baseId}-h-${i}`;
            const panelId = `${baseId}-p-${i}`;
            return (
              <div key={i}>
                <h3>
                  <button
                    id={headerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[#f5efe3]"
                  >
                    {item.icon && (
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#1c2b33] text-base">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1 font-semibold text-[#1c2b33]">
                      {item.title}
                    </span>
                    <svg
                      className={`h-5 w-5 shrink-0 text-teal-700 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m5 7.5 5 5 5-5" />
                    </svg>
                  </button>
                </h3>

                {/* grid-rows trick animates height smoothly without measuring */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-[#5b6b72]">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

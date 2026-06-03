import React from "react";

export interface BentoItem {
  /** Card title */
  title: string;
  /** Short supporting copy */
  description: string;
  /** Optional emoji / glyph rendered as the icon */
  icon?: string;
  /** Tailwind column/row span classes, e.g. "md:col-span-2 md:row-span-2" */
  span?: string;
  /** Optional accent override (any Tailwind gradient classes) */
  accent?: string;
}

export interface BentoGridProps {
  /** Eyebrow label above the grid */
  eyebrow?: string;
  /** Section heading */
  heading?: string;
  /** Cards to render */
  items?: BentoItem[];
  className?: string;
}

const DEFAULT_ITEMS: BentoItem[] = [
  {
    title: "Built for the shoreline",
    description:
      "Layouts that breathe like an open coast — generous whitespace, warm sand tones, and an ocean-deep accent.",
    icon: "🌊",
    span: "md:col-span-2 md:row-span-2",
    accent: "from-teal-600/15 to-cyan-500/5",
  },
  {
    title: "Lightning fast",
    description: "Static-first delivery with edge caching.",
    icon: "⚡",
    span: "md:col-span-1",
  },
  {
    title: "Accessible by default",
    description: "WCAG-minded contrast and focus states.",
    icon: "♿",
    span: "md:col-span-1",
  },
  {
    title: "Composable parts",
    description:
      "Drop-in components that snap together without fighting your design system.",
    icon: "🧩",
    span: "md:col-span-2",
  },
  {
    title: "Sand & Surf palette",
    description: "A calm, premium system tuned for coastal brands.",
    icon: "🏖️",
    span: "md:col-span-1",
  },
  {
    title: "Motion that means it",
    description: "Micro-interactions only where they add clarity.",
    icon: "✨",
    span: "md:col-span-1",
  },
];

export default function BentoGrid({
  eyebrow = "Why teams choose us",
  heading = "Everything you need to ship a premium coastal site",
  items = DEFAULT_ITEMS,
  className = "",
}: BentoGridProps) {
  return (
    <section
      className={`bg-[#faf6ef] py-20 px-6 sm:px-8 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          {eyebrow && (
            <span className="inline-block rounded-full bg-teal-700/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#1c2b33] sm:text-4xl">
              {heading}
            </h2>
          )}
        </div>

        <div className="grid auto-rows-[minmax(11rem,1fr)] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item, i) => (
            <article
              key={i}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e7ddcd] bg-white/70 p-6 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] backdrop-blur transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-teal-700/30 hover:shadow-xl hover:shadow-teal-900/10 ${item.span ?? ""}`}
            >
              <div
                className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${item.accent ?? "from-teal-600/10 to-amber-300/5"}`}
                aria-hidden="true"
              />
              {item.icon && (
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1c2b33] text-xl shadow-sm transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>
              )}
              <div className="mt-6">
                <h3 className="text-lg font-semibold tracking-tight text-[#1c2b33]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#5b6b72]">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

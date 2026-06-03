"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /** Optional avatar image URL. If absent, initials are shown. */
  avatar?: string;
}

export interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
  /** Auto-advance interval in ms. Set 0 to disable. */
  interval?: number;
  className?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "saltycodestudio rebuilt our booking flow and conversions jumped 38% in the first month. It feels like the site was carved for us.",
    name: "Maya Okonkwo",
    role: "Founder, Tideline Resorts",
  },
  {
    quote:
      "The fastest, calmest launch we have ever had. Premium polish without the agency overhead — every detail considered.",
    name: "Daniel Reyes",
    role: "Head of Growth, Reef & Co.",
  },
  {
    quote:
      "They speak design and engineering fluently. Our marketing team can finally ship pages without filing a ticket.",
    name: "Priya Nair",
    role: "CMO, Coastline Collective",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function TestimonialCarousel({
  testimonials = DEFAULT_TESTIMONIALS,
  interval = 5000,
  className = "",
}: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  // Auto-advance.
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!interval || paused || count <= 1) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [interval, paused, count]);

  return (
    <section
      className={`bg-[#faf6ef] py-20 px-6 ${className}`}
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-[#e7ddcd] bg-white/70 p-8 shadow-sm backdrop-blur sm:p-12">
          <span
            className="pointer-events-none absolute -top-2 left-6 select-none font-serif text-8xl leading-none text-teal-700/15"
            aria-hidden="true"
          >
            “
          </span>

          {/* Slides */}
          <div className="relative min-h-[180px]">
            {testimonials.map((t, i) => (
              <figure
                key={i}
                aria-hidden={i !== index}
                className={`transition-all duration-500 ease-out ${
                  i === index
                    ? "relative opacity-100 translate-x-0"
                    : "pointer-events-none absolute inset-0 translate-x-4 opacity-0"
                }`}
              >
                <blockquote className="relative z-10 text-lg font-medium leading-relaxed text-[#1c2b33] sm:text-xl">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-teal-700 text-sm font-semibold text-white">
                      {initials(t.name)}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#1c2b33]">{t.name}</p>
                    <p className="text-sm text-[#5b6b72]">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => go(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-teal-700" : "w-2 bg-[#d8cdb8] hover:bg-[#c2b69e]"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => go(index - 1)}
                aria-label="Previous testimonial"
                className="grid h-9 w-9 place-items-center rounded-full border border-[#e7ddcd] text-[#42525a] transition hover:border-teal-700/40 hover:text-teal-700"
              >
                ‹
              </button>
              <button
                onClick={() => go(index + 1)}
                aria-label="Next testimonial"
                className="grid h-9 w-9 place-items-center rounded-full border border-[#e7ddcd] text-[#42525a] transition hover:border-teal-700/40 hover:text-teal-700"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

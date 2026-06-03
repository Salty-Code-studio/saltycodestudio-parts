"use client";

import React, { useEffect, useRef, useState } from "react";

export interface AnimatedCounterProps {
  /** Target value to count up to */
  value: number;
  /** Animation duration in ms */
  duration?: number;
  /** Decimal places to display */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Use locale thousands separators (e.g. 1,200) */
  separator?: boolean;
  className?: string;
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function AnimatedCounter({
  value,
  duration = 1800,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = true,
  className = "",
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setDisplay(value * easeOutExpo(t));
        if (t < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      requestAnimationFrame(tick);
    };

    // Respect reduced-motion: jump straight to the value.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      started.current = true;
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) run();
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  const formatted = (() => {
    const fixed = display.toFixed(decimals);
    if (!separator) return fixed;
    const [int, dec] = fixed.split(".");
    const withSep = Number(int).toLocaleString("en-US");
    return dec !== undefined ? `${withSep}.${dec}` : withSep;
  })();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export interface Stat {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const DEFAULT_STATS: Stat[] = [
  { value: 240, label: "Projects shipped", suffix: "+" },
  { value: 98, label: "Avg. Lighthouse score" },
  { value: 4.9, label: "Client rating", decimals: 1, suffix: "/5" },
  { value: 32, label: "Countries served" },
];

/** A ready-made stat row using the counter. */
export default function StatGrid({
  stats = DEFAULT_STATS,
  className = "",
}: {
  stats?: Stat[];
  className?: string;
}) {
  return (
    <section className={`bg-[#faf6ef] py-20 px-6 ${className}`}>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <AnimatedCounter
              value={s.value}
              decimals={s.decimals}
              prefix={s.prefix}
              suffix={s.suffix}
              className="block text-4xl font-semibold tracking-tight text-teal-700 sm:text-5xl"
            />
            <p className="mt-2 text-sm text-[#5b6b72]">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";

export interface Plan {
  name: string;
  /** Monthly price in whole currency units */
  monthly: number;
  /** Annual price PER MONTH when billed yearly */
  annual: number;
  description: string;
  features: string[];
  /** Highlight as the recommended plan */
  featured?: boolean;
  ctaLabel?: string;
}

export interface PricingToggleProps {
  plans?: Plan[];
  currency?: string;
  heading?: string;
  className?: string;
}

const DEFAULT_PLANS: Plan[] = [
  {
    name: "Starter",
    monthly: 24,
    annual: 19,
    description: "For a clean one-page launch.",
    features: ["1 landing page", "Sand & Surf theme", "Basic analytics", "Email support"],
    ctaLabel: "Choose Starter",
  },
  {
    name: "Studio",
    monthly: 59,
    annual: 47,
    description: "For growing coastal brands.",
    features: [
      "Up to 8 pages",
      "Custom components",
      "CMS integration",
      "Priority support",
      "A/B testing",
    ],
    featured: true,
    ctaLabel: "Choose Studio",
  },
  {
    name: "Atelier",
    monthly: 129,
    annual: 99,
    description: "Bespoke, end-to-end builds.",
    features: [
      "Unlimited pages",
      "Dedicated designer",
      "Performance SLA",
      "Slack channel",
      "Quarterly reviews",
    ],
    ctaLabel: "Talk to us",
  },
];

/** Smoothly tweens a number toward `target` over ~350ms. */
function useAnimatedNumber(target: number) {
  const [value, setValue] = useState(target);
  const raf = useRef<number | null>(null);
  const valueRef = useRef(target);
  valueRef.current = value;
  useEffect(() => {
    const from = valueRef.current;
    const start = performance.now();
    const dur = 350;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (target - from) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target]);
  return value;
}

function PriceDisplay({ amount, currency }: { amount: number; currency: string }) {
  const animated = useAnimatedNumber(amount);
  return (
    <span className="text-4xl font-semibold tracking-tight text-[#1c2b33]">
      {currency}
      {Math.round(animated)}
    </span>
  );
}

export default function PricingToggle({
  plans = DEFAULT_PLANS,
  currency = "$",
  heading = "Pricing that scales with the tide",
  className = "",
}: PricingToggleProps) {
  const [annual, setAnnual] = useState(true);

  return (
    <section className={`bg-[#faf6ef] py-20 px-6 ${className}`}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-[#1c2b33] sm:text-4xl">
            {heading}
          </h2>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#e7ddcd] bg-white/70 p-1.5 backdrop-blur">
            <button
              onClick={() => setAnnual(false)}
              className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !annual ? "text-white" : "text-[#5b6b72]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                annual ? "text-white" : "text-[#5b6b72]"
              }`}
            >
              Annual
              <span className="ml-1.5 text-xs font-semibold text-amber-500">−20%</span>
            </button>
            {/* sliding pill */}
            <span
              aria-hidden="true"
              className={`absolute h-[34px] rounded-full bg-teal-700 shadow-sm transition-all duration-300 ease-out ${
                annual ? "translate-x-[88px] w-[112px]" : "translate-x-0 w-[84px]"
              }`}
              style={{ left: "6px" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-7 transition-all duration-300 ${
                plan.featured
                  ? "border-teal-700/30 bg-white shadow-xl shadow-teal-900/10 md:-translate-y-2"
                  : "border-[#e7ddcd] bg-white/70 backdrop-blur hover:border-teal-700/30 hover:shadow-lg"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-[#1c2b33]">{plan.name}</h3>
              <p className="mt-1 text-sm text-[#5b6b72]">{plan.description}</p>

              <div className="mt-5 flex items-end gap-1">
                <PriceDisplay amount={annual ? plan.annual : plan.monthly} currency={currency} />
                <span className="mb-1.5 text-sm text-[#5b6b72]">/mo</span>
              </div>
              <p className="mt-1 h-5 text-xs text-amber-600">
                {annual ? `Billed yearly · save ${currency}${(plan.monthly - plan.annual) * 12}/yr` : ""}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#374249]">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3 3 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-7 w-full rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-teal-700 text-white hover:bg-teal-800"
                    : "border border-[#1c2b33]/15 bg-transparent text-[#1c2b33] hover:border-teal-700/40 hover:text-teal-700"
                }`}
              >
                {plan.ctaLabel ?? "Get started"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

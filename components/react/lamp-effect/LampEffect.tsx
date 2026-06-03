"use client";

import React from "react";
import { motion } from "framer-motion";

export interface LampEffectProps {
  /** Headline rendered inside the beam. */
  title?: string;
  /** Supporting line under the headline. */
  subtitle?: string;
  /** Small uppercase eyebrow above the headline. */
  eyebrow?: string;
  /** Tailwind color used for the cones/glow (any class-compatible color works via the `from-*` style below). */
  glow?: string;
  /** Extra classes on the outer <section>. */
  className?: string;
  children?: React.ReactNode;
}

/**
 * LampEffect — a Linear-inspired overhead lamp that fans light down onto a
 * section header. Two mirrored conic-gradient cones are masked with
 * linear-gradient fades; a blurred bar plus a glowing ellipse form the bulb.
 * The cones expand (width + opacity) as the section scrolls into view, and the
 * headline rises into the beam. Honors prefers-reduced-motion.
 */
export default function LampEffect({
  title = "Build at the speed of light.",
  subtitle = "saltycodestudio ships premium, fast, conversion-ready sites.",
  eyebrow = "saltycodestudio",
  glow = "#2ec3c3",
  className = "",
  children,
}: LampEffectProps) {
  // whileInView variants: cones start narrow + dim, expand on enter.
  const coneEnter = {
    hidden: { opacity: 0.45, width: "14rem" },
    show: { opacity: 1, width: "32rem" },
  };

  return (
    <section
      className={`relative isolate z-0 flex min-h-[36rem] w-full flex-col items-center justify-center overflow-hidden bg-[#0f1f24] ${className}`}
    >
      {/* Lamp rig: cones + bulb, positioned at the optical center of the head */}
      <div className="absolute inset-0 top-1/2 -z-10 flex w-full -translate-y-1/2 scale-y-125 items-center justify-center isolate">
        {/* Left cone */}
        <motion.div
          aria-hidden="true"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          variants={coneEnter}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(from 70deg at center top, ${glow}, transparent, transparent)`,
          }}
          className="absolute right-1/2 h-56 overflow-visible text-white [--tw-gradient-stops:var(--conic-gradient-stops)] [background-image:conic-gradient(var(--conic-position),var(--tw-gradient-stops))]"
        >
          {/* bottom + left mask fades so the cone reads as a soft beam */}
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-[#0f1f24] [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-[#0f1f24] [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right cone (mirrored) */}
        <motion.div
          aria-hidden="true"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.4 }}
          variants={coneEnter}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(from 290deg at center top, transparent, transparent, ${glow})`,
          }}
          className="absolute left-1/2 h-56 text-white"
        >
          <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-[#0f1f24] [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-[#0f1f24] [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Depth fog behind the cones */}
        <div className="absolute top-1/2 h-48 w-full -translate-y-1/2 bg-[#0f1f24] blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

        {/* Bulb glow ellipse */}
        <motion.div
          aria-hidden="true"
          initial={{ width: "8rem", opacity: 0.5 }}
          whileInView={{ width: "16rem", opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          style={{ backgroundColor: glow }}
          className="absolute top-1/2 z-30 h-36 -translate-y-[6rem] rounded-full opacity-50 blur-3xl"
        />

        {/* Tight inner core glow */}
        <motion.div
          aria-hidden="true"
          initial={{ width: "10rem" }}
          whileInView={{ width: "20rem" }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          style={{ backgroundColor: glow }}
          className="absolute top-1/2 z-40 h-36 -translate-y-[7rem] rounded-full blur-2xl"
        />

        {/* The bright filament bar */}
        <motion.div
          aria-hidden="true"
          initial={{ width: "10rem" }}
          whileInView={{ width: "30rem" }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          style={{ backgroundColor: glow }}
          className="absolute top-1/2 z-50 h-0.5 -translate-y-[7rem] rounded-full"
        />

        {/* Mask that hides the top half so only the downward beam shows */}
        <div className="absolute top-1/2 z-40 h-44 w-full -translate-y-[12.5rem] bg-[#0f1f24]" />
      </div>

      {/* Header content rising into the beam */}
      <div className="relative z-50 flex -translate-y-20 flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ delay: 0.25, duration: 0.7, ease: "easeInOut" }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#9fe6e6] backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#2ec3c3]" />
          {eyebrow}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0.5, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="bg-gradient-to-b from-[#f4ece0] to-[#9fe6e6] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-6xl"
        >
          {title}
        </motion.h2>

        {subtitle ? (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ delay: 0.45, duration: 0.8, ease: "easeInOut" }}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
          >
            {subtitle}
          </motion.p>
        ) : null}

        {children ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ delay: 0.6, duration: 0.7, ease: "easeInOut" }}
            className="mt-8"
          >
            {children}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

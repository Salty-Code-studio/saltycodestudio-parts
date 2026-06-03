import * as React from "react";
import { motion, type Transition } from "motion/react";

export interface BorderBeamProps {
  /** Width/height of the travelling beam segment in pixels. */
  size?: number;
  /** Seconds for one full lap around the border. */
  duration?: number;
  /** Seconds to wait before the first lap begins. */
  delay?: number;
  /** Where the beam starts, as a percentage (0-100) along the perimeter. */
  initialOffset?: number;
  /** Travel counter-clockwise instead of clockwise. */
  reverse?: boolean;
  /** Leading colour of the beam gradient. */
  colorFrom?: string;
  /** Trailing colour of the beam gradient. */
  colorTo?: string;
  /** Thickness of the beam/border in pixels. */
  borderWidth?: number;
  /** Extra classes applied to the moving beam element. */
  className?: string;
  /** Override the motion transition (advanced). */
  transition?: Transition;
  style?: React.CSSProperties;
}

/**
 * BorderBeam
 * An animated beam of light that continuously travels around the border of its
 * positioned parent. Drop it inside any `relative` + `overflow-hidden` container
 * (the parent should also have rounded corners and a border for the framing look).
 *
 * Technique: an absolutely-positioned strip is driven along the container edge with
 * CSS `offset-path` (a rounded inset rect), so the beam hugs corners cleanly. A
 * radial gradient gives it a comet-like head and fading tail. Honours
 * `prefers-reduced-motion` by parking the beam at its initial offset.
 */
export function BorderBeam({
  size = 60,
  duration = 6,
  delay = 0,
  initialOffset = 0,
  reverse = false,
  colorFrom = "#2ec3c3",
  colorTo = "#0f5c5c",
  borderWidth = 1.5,
  className,
  transition,
  style,
}: BorderBeamProps) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const from = reverse ? [100 - initialOffset, -initialOffset] : [initialOffset, initialOffset + 100];

  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      style={{
        // The mask carves out only the border ring so the beam reads as a glowing edge.
        border: `${borderWidth}px solid transparent`,
        WebkitMask:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    >
      <motion.div
        className={["absolute aspect-square", className].filter(Boolean).join(" ")}
        style={{
          width: size,
          // offset-path traces a rounded-rectangle perimeter inset by half the beam size.
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `radial-gradient(circle at center, ${colorFrom}, ${colorTo} 45%, transparent 70%)`,
          ...style,
        }}
        initial={{ offsetDistance: `${reverse ? from[0] : from[0]}%` }}
        animate={
          prefersReducedMotion
            ? { offsetDistance: `${from[0]}%` }
            : { offsetDistance: from.map((v) => `${v}%`) }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : transition ?? {
                repeat: Infinity,
                ease: "linear",
                duration,
                delay: -delay,
              }
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Sample usage — a "Sand & Surf" pricing card framed by the beam.
 * Delete or replace with your own content.
 * ------------------------------------------------------------------ */
export function BorderBeamCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#ece0cd] bg-[#fbf7f0] p-8 shadow-[0_24px_60px_-30px_rgba(28,43,51,0.35)]">
      <BorderBeam size={90} duration={7} colorFrom="#2ec3c3" colorTo="#0f5c5c" />
      <BorderBeam
        size={90}
        duration={7}
        delay={3.5}
        colorFrom="#1f8a8a"
        colorTo="#2ec3c3"
      />

      <span className="inline-flex items-center rounded-full bg-[#1f8a8a]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#0f5c5c]">
        Studio
      </span>
      <h3 className="mt-4 text-3xl font-bold text-[#1c2b33]">Surf Plan</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#4a5d66]">
        Everything you need to ship a polished marketing site, framed by a beam
        that never stops moving.
      </p>
      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-[#1c2b33]">$24</span>
        <span className="text-sm text-[#4a5d66]">/ month</span>
      </div>
      <button className="mt-6 w-full rounded-xl bg-[#1f8a8a] px-4 py-3 text-sm font-semibold text-[#fbf7f0] transition-colors hover:bg-[#0f5c5c]">
        Start building
      </button>
    </div>
  );
}

export default BorderBeam;

import React from "react";

export interface LogoMarqueeProps {
  /** Logos as strings (rendered as wordmarks) or React nodes (e.g. <img>/<svg>). */
  logos?: React.ReactNode[];
  /** Seconds for one full loop. Lower = faster. */
  speed?: number;
  /** Scroll direction */
  direction?: "left" | "right";
  /** Optional heading above the row */
  title?: string;
  className?: string;
}

const DEFAULT_LOGOS: React.ReactNode[] = [
  "Tideline",
  "Reef & Co.",
  "Coastline",
  "Marea",
  "Saltwater",
  "Harborlight",
  "Driftwood",
  "Bluefin",
];

export default function LogoMarquee({
  logos = DEFAULT_LOGOS,
  speed = 30,
  direction = "left",
  title = "Trusted by teams along every coast",
  className = "",
}: LogoMarqueeProps) {
  // Duplicate the set so the track can loop seamlessly with a -50% translate.
  // Tag each entry with which copy (set) it belongs to so keys stay unique
  // across the duplicated track. The original set is aria-visible; the clone
  // is hidden from assistive tech.
  const track = [
    ...logos.map((logo, i) => ({ logo, set: 0, i })),
    ...logos.map((logo, i) => ({ logo, set: 1, i })),
  ];

  return (
    <section className={`bg-[#faf6ef] py-14 ${className}`}>
      {title && (
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#a89c84]">
          {title}
        </p>
      )}

      <div
        className="group relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
        }}
      >
        <ul
          className="flex w-max items-center gap-14 will-change-transform group-hover:[animation-play-state:paused] motion-reduce:[animation:none]"
          style={{
            animation: `scs-marquee ${speed}s linear infinite`,
            animationDirection: direction === "right" ? "reverse" : "normal",
          }}
        >
          {track.map(({ logo, set, i }) => (
            <li
              key={`${set}-${typeof logo === "string" ? logo : i}`}
              aria-hidden={set === 1}
              className="flex shrink-0 items-center text-xl font-semibold tracking-tight text-[#5b6b72] opacity-70 transition-opacity hover:opacity-100"
            >
              {logo}
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes scs-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

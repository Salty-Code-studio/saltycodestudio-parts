import React, { useRef, useState } from "react";

export interface SpotlightCardProps {
  /** Card heading */
  title: string;
  /** Supporting body copy */
  description: string;
  /** Optional emoji / glyph rendered in the icon chip */
  icon?: string;
  /** Optional eyebrow / category label above the title */
  eyebrow?: string;
  /** Radius of the spotlight in pixels (default 320) */
  radius?: number;
  /** CSS color used for the spotlight glow (default surf teal) */
  spotlightColor?: string;
  /** Show the dot pattern revealed through the spotlight (default true) */
  showPattern?: boolean;
  /** Extra classes appended to the outer card */
  className?: string;
  /** Card body — overrides title/description rendering when provided */
  children?: React.ReactNode;
}

/**
 * SpotlightCard
 *
 * A card that reveals a soft radial spotlight following the cursor on hover.
 * The technique: `onMouseMove` writes the pointer's local x/y into CSS custom
 * properties (`--x` / `--y`); two overlay layers paint
 * `radial-gradient(circle at var(--x) var(--y), ...)` — one for the warm glow,
 * one as a mask that reveals a dot pattern only under the cursor. Both fade in
 * via opacity on hover, so the effect is GPU-cheap and respects
 * `prefers-reduced-motion` (the glow simply snaps in without easing).
 */
export default function SpotlightCard({
  title,
  description,
  icon,
  eyebrow,
  radius = 320,
  spotlightColor = "rgba(46, 195, 195, 0.28)",
  showPattern = true,
  className = "",
  children,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={
        {
          "--spot": spotlightColor,
          "--r": `${radius}px`,
        } as React.CSSProperties
      }
      className={`group relative overflow-hidden rounded-3xl border border-[#e7ddcd] bg-[#fbf7f0] p-8 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] transition-colors duration-300 hover:border-[#1f8a8a]/40 ${className}`}
    >
      {/* Dot pattern, revealed only under the spotlight via a radial mask */}
      {showPattern && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(15, 92, 92, 0.55) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            WebkitMaskImage:
              "radial-gradient(var(--r) circle at var(--x, 50%) var(--y, 50%), #000 0%, transparent 65%)",
            maskImage:
              "radial-gradient(var(--r) circle at var(--x, 50%) var(--y, 50%), #000 0%, transparent 65%)",
          }}
        />
      )}

      {/* Warm spotlight glow that follows the cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        style={{
          background:
            "radial-gradient(var(--r) circle at var(--x, 50%) var(--y, 50%), var(--spot), transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children ?? (
          <>
            {icon && (
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1c2b33] text-xl text-[#fbf7f0] shadow-sm transition-transform duration-300 group-hover:scale-110">
                {icon}
              </span>
            )}
            {eyebrow && (
              <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-[#1f8a8a]">
                {eyebrow}
              </span>
            )}
            <h3 className="text-lg font-semibold tracking-tight text-[#1c2b33]">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#4a5d66]">
              {description}
            </p>
          </>
        )}
      </div>

      {/* Hairline ring that brightens on hover (state-driven, optional polish) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset transition-colors duration-300"
        style={{
          ["--tw-ring-color" as string]: hovered
            ? "rgba(46, 195, 195, 0.35)"
            : "transparent",
        }}
      />
    </div>
  );
}

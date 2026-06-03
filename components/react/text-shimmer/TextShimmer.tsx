import React from "react";

/**
 * TextShimmer
 * -----------
 * Text with a soft light sheen sweeping across it left to right.
 * Great for announcement pills, badges and subtle loading labels.
 *
 * Technique: the element's text is painted with a clipped linear-gradient
 * background (bg-clip-text + transparent fill). A narrow bright band sits
 * inside a wide transparent gradient; animating `background-position`
 * slides that band across the glyphs so only a thin highlight is visible
 * as it sweeps. Honors prefers-reduced-motion by holding the highlight still.
 *
 * Requires the keyframes/utility defined in the consuming app's CSS
 * (see README) OR rely on the inline <style> injected once at runtime
 * below so the component is fully drop-in.
 */

type AsTag = "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "label";

export interface TextShimmerProps {
  /** Text to render with the shimmering sheen. */
  children: React.ReactNode;
  /** Element to render as. Default "span". */
  as?: AsTag;
  /** Seconds for one full sweep. Default 3. */
  duration?: number;
  /** Width of the bright band relative to font size (in `em`). Default 2. */
  spread?: number;
  /** Base (resting) text color. Default ink soft. */
  baseColor?: string;
  /** Color of the sweeping highlight. Default near-white. */
  shineColor?: string;
  /** Extra Tailwind / CSS classes. */
  className?: string;
}

let injected = false;
function useShimmerStyles() {
  if (typeof document === "undefined" || injected) return;
  injected = true;
  const style = document.createElement("style");
  style.setAttribute("data-text-shimmer", "");
  style.textContent = `
@keyframes scs-text-shimmer {
  0%   { background-position: var(--scs-shimmer-from); }
  100% { background-position: var(--scs-shimmer-to); }
}
.scs-text-shimmer {
  --scs-shimmer-spread: 2;
  --scs-shimmer-base: #4a5d66;
  --scs-shimmer-shine: #ffffff;
  /* Travel the full clipped width plus the band so it fully exits. */
  --scs-shimmer-from: calc(0% - var(--scs-shimmer-spread) * 1em);
  --scs-shimmer-to: calc(100% + var(--scs-shimmer-spread) * 1em);
  color: var(--scs-shimmer-base);
  background-image: linear-gradient(
    90deg,
    transparent calc(50% - var(--scs-shimmer-spread) * 0.5em),
    var(--scs-shimmer-shine) 50%,
    transparent calc(50% + var(--scs-shimmer-spread) * 0.5em)
  );
  background-repeat: no-repeat;
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  /* The transparent parts of the gradient let the base color show through. */
  -webkit-text-fill-color: transparent;
  animation: scs-text-shimmer var(--scs-shimmer-duration, 3s) linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .scs-text-shimmer {
    animation: none;
    background-position: 50% 0;
  }
}
`;
  document.head.appendChild(style);
}

export default function TextShimmer({
  children,
  as: Tag = "span",
  duration = 3,
  spread = 2,
  baseColor = "#4a5d66",
  shineColor = "#ffffff",
  className = "",
}: TextShimmerProps) {
  useShimmerStyles();

  const style = {
    "--scs-shimmer-duration": `${duration}s`,
    "--scs-shimmer-spread": String(spread),
    "--scs-shimmer-base": baseColor,
    "--scs-shimmer-shine": shineColor,
  } as React.CSSProperties;

  return (
    <Tag className={`scs-text-shimmer ${className}`} style={style}>
      {children}
    </Tag>
  );
}

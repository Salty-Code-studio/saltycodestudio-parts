import * as React from "react";
import confetti from "canvas-confetti";

export interface ConfettiButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Number of confetti particles per burst. */
  particleCount?: number;
  /** Spread of the burst in degrees (wider = more fan-shaped). */
  spread?: number;
  /** Launch angle in degrees (90 = straight up). */
  angle?: number;
  /** Initial particle velocity; bigger numbers throw further. */
  startVelocity?: number;
  /** How fast gravity pulls particles back down (1 = default). */
  gravity?: number;
  /** Higher = more sideways drift. */
  scalar?: number;
  /** Confetti colours; falls back to the Sand & Surf ocean palette. */
  colors?: string[];
  /** Run extra logic after the burst fires (e.g. analytics, navigation). */
  onConfetti?: () => void;
}

const SAND_AND_SURF = ["#2ec3c3", "#1f8a8a", "#0f5c5c", "#fbf7f0", "#ece0cd"];

/**
 * ConfettiButton
 * A button that bursts confetti from its own on-screen position when clicked —
 * perfect for celebrating signups, purchases and other success moments.
 *
 * Technique: on click we read the button's bounding rect, normalise its centre
 * to canvas-confetti's 0..1 viewport-origin coordinates, then fire a burst from
 * exactly that point. Honours `prefers-reduced-motion` by skipping the burst
 * (the click handler / onConfetti callback still runs).
 */
export function ConfettiButton({
  particleCount = 90,
  spread = 70,
  angle = 90,
  startVelocity = 45,
  gravity = 1,
  scalar = 1,
  colors = SAND_AND_SURF,
  onConfetti,
  onClick,
  children,
  className,
  ...props
}: ConfettiButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);

  const fire = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const el = ref.current;
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (el && !prefersReducedMotion) {
        const rect = el.getBoundingClientRect();
        // Normalise the button's centre to 0..1 viewport coordinates, the
        // origin space canvas-confetti expects.
        const origin = {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        };

        confetti({
          particleCount,
          spread,
          angle,
          startVelocity,
          gravity,
          scalar,
          colors,
          origin,
          disableForReducedMotion: true,
        });
      }

      onClick?.(event);
      onConfetti?.();
    },
    [
      particleCount,
      spread,
      angle,
      startVelocity,
      gravity,
      scalar,
      colors,
      onClick,
      onConfetti,
    ]
  );

  return (
    <button
      ref={ref}
      type="button"
      onClick={fire}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f8a8a] px-6 py-3 text-sm font-semibold text-[#fbf7f0] shadow-[0_14px_30px_-12px_rgba(15,92,92,0.6)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#0f5c5c] active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2ec3c3]"
      }
      {...props}
    >
      {children}
    </button>
  );
}

export default ConfettiButton;

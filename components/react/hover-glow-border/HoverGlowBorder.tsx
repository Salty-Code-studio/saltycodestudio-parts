"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate } from "motion/react";

export interface HoverGlowBorderProps {
  /** Border thickness of the glow ring, in pixels. Default 1. */
  borderWidth?: number;
  /**
   * How tightly the glow concentrates toward the pointer, in degrees of the
   * conic sweep. Lower = a tighter, brighter hotspot. Default 40.
   */
  spread?: number;
  /**
   * Distance in pixels from the element edge within which the pointer starts
   * driving the glow. Outside this band the ring eases back to a calm idle
   * rotation. Default 64.
   */
  proximity?: number;
  /**
   * A 0..1 radius around the element center that is treated as "no signal":
   * when the pointer sits inside this fraction of the element, the glow is left
   * to drift instead of snapping to a meaningless angle. Default 0.01.
   */
  inactiveZone?: number;
  /** Seconds the angle tween takes to ease toward the pointer. Default 2. */
  movementDuration?: number;
  /** Disable pointer tracking and render a static idle ring. Default false. */
  disabled?: boolean;
  /** Extra classes on the wrapper that paints the ring. */
  className?: string;
  /** Card content. */
  children?: React.ReactNode;
}

/**
 * HoverGlowBorder
 * ----------------
 * A Cursor-style border glow that orbits any card and concentrates toward the
 * mouse pointer. It tracks the pointer angle relative to the element center,
 * stores it in a CSS custom property (`--hgb-angle`), and rotates a
 * conic-gradient ring masked to the border. `spread`, `proximity` and
 * `inactiveZone` shape when and how tightly the glow reacts; a `movementDuration`
 * tween eases the angle so the light feels like it has weight.
 *
 * The ring is drawn with `mask-composite` so the gradient only shows in the
 * `borderWidth` band — it adapts to any container size with zero JS layout math.
 */
export function HoverGlowBorder({
  borderWidth = 1,
  spread = 40,
  proximity = 64,
  inactiveZone = 0.01,
  movementDuration = 2,
  disabled = false,
  className = "",
  children,
}: HoverGlowBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Current animated angle (degrees) — kept in a ref so the rAF loop and the
  // tween share one source of truth without re-rendering.
  const angleRef = useRef(0);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const rafId = useRef<number | null>(null);
  const reducedMotion = useRef(false);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;

      // Throttle to one resolve per frame.
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = clientX - cx;
        const dy = clientY - cy;

        // Inactive zone: ignore micro-movements near the dead center where the
        // angle would be noisy and meaningless.
        const dist = Math.hypot(dx, dy);
        const deadRadius = inactiveZone * Math.min(rect.width, rect.height) * 0.5;
        if (dist < deadRadius) return;

        // Proximity gate: how close (relative to the edge) is the pointer? When
        // it is far outside `proximity`, fade the glow's intensity toward idle.
        const edgeDist = Math.max(
          0,
          dist - Math.hypot(rect.width, rect.height) / 2
        );
        const active = edgeDist <= proximity;
        el.style.setProperty("--hgb-active", active ? "1" : "0");

        // Pointer angle relative to center. atan2 returns -180..180; we offset
        // by 90 so 0deg points up, matching the conic gradient's start.
        const target =
          (Math.atan2(dy, dx) * 180) / Math.PI + 90;

        // Choose the shortest rotational path so the glow never spins the long
        // way around when the pointer crosses the top of the card.
        const current = angleRef.current;
        let delta = ((target - current) % 360 + 540) % 360 - 180;
        const next = current + delta;

        if (reducedMotion.current) {
          angleRef.current = next;
          el.style.setProperty("--hgb-angle", `${next}deg`);
          return;
        }

        animate(current, next, {
          duration: movementDuration,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => {
            angleRef.current = v;
            el.style.setProperty("--hgb-angle", `${v}deg`);
          },
        });
      });
    },
    [inactiveZone, proximity, movementDuration]
  );

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (disabled) return;

    const onPointerMove = (e: PointerEvent) => {
      lastPointer.current = { x: e.clientX, y: e.clientY };
      handleMove(e.clientX, e.clientY);
    };
    // Re-resolve on scroll so the angle stays correct as the card moves under a
    // stationary cursor.
    const onScroll = () => {
      if (lastPointer.current)
        handleMove(lastPointer.current.x, lastPointer.current.y);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [disabled, handleMove]);

  return (
    <div
      ref={containerRef}
      data-glow-disabled={disabled || undefined}
      style={
        {
          "--hgb-angle": "0deg",
          "--hgb-active": "0",
          "--hgb-border": `${borderWidth}px`,
          "--hgb-spread": `${spread}deg`,
        } as React.CSSProperties
      }
      className={[
        "relative isolate rounded-[inherit]",
        // The glow ring itself — a conic gradient rotated by --hgb-angle,
        // masked to the border band so only the edge lights up. Intensity
        // (opacity) follows --hgb-active so far-away pointers leave a calm ring.
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]",
        "before:p-[var(--hgb-border)] before:content-['']",
        "before:[background:conic-gradient(from_var(--hgb-angle),transparent_0deg,var(--hgb-surf)_calc(180deg-var(--hgb-spread)),var(--hgb-glow)_180deg,var(--hgb-surf)_calc(180deg+var(--hgb-spread)),transparent_360deg)]",
        "before:[-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]",
        "before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]",
        "before:opacity-[calc(0.45+0.55*var(--hgb-active))] before:transition-opacity before:duration-500",
        // Soft outer bloom that brightens when the pointer is near.
        "after:pointer-events-none after:absolute after:-inset-px after:rounded-[inherit] after:content-['']",
        "after:[background:conic-gradient(from_var(--hgb-angle),transparent_0deg,transparent_calc(180deg-var(--hgb-spread)),var(--hgb-glow)_180deg,transparent_calc(180deg+var(--hgb-spread)),transparent_360deg)]",
        "after:opacity-[calc(0.25*var(--hgb-active))] after:blur-md after:transition-opacity after:duration-500",
        "motion-reduce:before:transition-none motion-reduce:after:transition-none",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default HoverGlowBorder;

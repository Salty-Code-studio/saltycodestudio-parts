"use client";

import React, {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/* -------------------------------------------------------------------------- */
/*  Context                                                                    */
/* -------------------------------------------------------------------------- */

interface DockContextValue {
  /** Live cursor X position (page coords) inside the dock, Infinity when away. */
  mouseX: MotionValue<number>;
  /** Resting icon size in px. */
  baseSize: number;
  /** Peak icon size in px when the cursor is directly over an icon. */
  maxSize: number;
  /** How far (px) the magnification "bell curve" reaches on each side. */
  distance: number;
  /** Whether motion should be suppressed (reduced-motion users). */
  reduced: boolean;
}

const DockContext = createContext<DockContextValue | null>(null);

function useDock(): DockContextValue {
  const ctx = useContext(DockContext);
  if (!ctx) {
    throw new Error("DockItem must be used inside a <MacosDock>.");
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Dock (container)                                                           */
/* -------------------------------------------------------------------------- */

export interface MacosDockProps {
  children: ReactNode;
  /** Resting icon size in px. Default 48. */
  baseSize?: number;
  /** Peak icon size in px on hover. Default 80. */
  maxSize?: number;
  /** Magnification reach in px. Default 140. */
  distance?: number;
  /** Extra classes for the dock shell. */
  className?: string;
}

/**
 * macOS-style magnifying dock.
 *
 * Tracks the cursor's X position via a single motion value. Each `DockItem`
 * measures its distance to the cursor and maps it through `useTransform` to a
 * size, then springs that size so neighbours scale in a smooth bell curve
 * around the hovered icon.
 */
export function MacosDock({
  children,
  baseSize = 48,
  maxSize = 80,
  distance = 140,
  className = "",
}: MacosDockProps) {
  const mouseX = useMotionValue<number>(Infinity);
  const reduced = useReducedMotion() ?? false;

  return (
    <DockContext.Provider
      value={{ mouseX, baseSize, maxSize, distance, reduced }}
    >
      <motion.div
        role="toolbar"
        aria-label="Application dock"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={[
          "mx-auto flex items-end gap-3 rounded-2xl px-4 pb-3 pt-3",
          "border border-white/40 bg-white/55 backdrop-blur-xl",
          "shadow-[0_18px_50px_-12px_rgba(15,92,92,0.45)]",
          className,
        ].join(" ")}
        style={{ height: maxSize + 24 }}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  DockItem (icon)                                                            */
/* -------------------------------------------------------------------------- */

export interface DockItemProps {
  children: ReactNode;
  /** Tooltip label shown above the icon on hover. */
  label?: string;
  /** Optional click handler (e.g. open app / navigate). */
  onClick?: () => void;
  /** Render as a link if provided. */
  href?: string;
  className?: string;
}

export function DockItem({
  children,
  label,
  onClick,
  href,
  className = "",
}: DockItemProps) {
  const { mouseX, baseSize, maxSize, distance, reduced } = useDock();
  const ref = useRef<HTMLDivElement>(null);

  // Distance (px) from the cursor to this icon's horizontal centre.
  const distanceFromCursor = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseSize,
    };
    return x - bounds.x - bounds.width / 2;
  });

  // Bell curve: full size at 0px away, easing back to baseSize at ±distance.
  const sizeTarget = useTransform(
    distanceFromCursor,
    [-distance, 0, distance],
    [baseSize, maxSize, baseSize]
  );

  // Spring the raw target so neighbours animate smoothly together.
  const size = useSpring(sizeTarget, {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });

  // Reduced-motion users get a static size, no springing.
  const width = reduced ? baseSize : size;

  return (
    <div className="group relative flex flex-col items-center">
      {/* Tooltip */}
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-[#1c2b33] px-2.5 py-1 text-xs font-medium text-[#fbf7f0] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
        >
          {label}
        </motion.span>
      )}

      <motion.div
        ref={ref}
        style={{ width, height: width }}
        onClick={onClick}
        role={onClick || href ? "button" : undefined}
        tabIndex={onClick || href ? 0 : undefined}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        className={[
          "flex aspect-square items-center justify-center rounded-2xl",
          "bg-white/80 shadow-md ring-1 ring-black/5",
          "transition-shadow hover:shadow-xl",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ec3c3]",
          onClick || href ? "cursor-pointer" : "",
          className,
        ].join(" ")}
      >
        {href ? (
          <a
            href={href}
            className="flex h-full w-full items-center justify-center"
            aria-label={label}
          >
            {children}
          </a>
        ) : (
          children
        )}
      </motion.div>
    </div>
  );
}

/** Thin divider for grouping dock items (e.g. apps | trash). */
export function DockDivider() {
  return (
    <div className="mx-1 h-10 w-px self-center bg-[#1c2b33]/15" aria-hidden />
  );
}

export default MacosDock;

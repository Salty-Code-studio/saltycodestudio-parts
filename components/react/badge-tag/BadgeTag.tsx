"use client";

import * as React from "react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type BadgeVariant =
  | "neutral"
  | "ocean"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeTagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onClick"> {
  /** Semantic color variant. */
  variant?: BadgeVariant;
  /** Size of the badge. */
  size?: BadgeSize;
  /** Pill (fully rounded) vs. softer rounded corners. */
  pill?: boolean;
  /** Show a leading status dot in the variant color. */
  dot?: boolean;
  /** Use the subtler outline treatment instead of a solid soft fill. */
  outline?: boolean;
  /**
   * When provided, renders a removable badge with a trailing close button.
   * Called with the badge content when the user removes it.
   */
  onRemove?: () => void;
  /** Accessible label for the remove button. Defaults to `Remove {children}`. */
  removeLabel?: string;
  /** Badge label / content. */
  children: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*  Style maps                                                                */
/* -------------------------------------------------------------------------- */

const SIZE: Record<
  BadgeSize,
  { container: string; dot: string; remove: string; removeIcon: string }
> = {
  sm: {
    container: "h-5 gap-1 px-2 text-[11px]",
    dot: "h-1.5 w-1.5",
    remove: "-mr-0.5 ml-0.5 h-3.5 w-3.5",
    removeIcon: "h-2.5 w-2.5",
  },
  md: {
    container: "h-6 gap-1.5 px-2.5 text-xs",
    dot: "h-2 w-2",
    remove: "-mr-1 ml-0.5 h-4 w-4",
    removeIcon: "h-3 w-3",
  },
  lg: {
    container: "h-7 gap-1.5 px-3 text-sm",
    dot: "h-2.5 w-2.5",
    remove: "-mr-1 ml-1 h-5 w-5",
    removeIcon: "h-3.5 w-3.5",
  },
};

/** Soft (filled) treatment per variant — bg / text / ring / dot / remove-hover. */
const SOLID: Record<
  BadgeVariant,
  { fill: string; text: string; ring: string; dot: string; removeHover: string; focus: string }
> = {
  neutral: {
    fill: "bg-[#f4ece0]",
    text: "text-[#1c2b33]",
    ring: "ring-1 ring-inset ring-[#1c2b33]/10",
    dot: "bg-[#4a5d66]",
    removeHover: "hover:bg-[#1c2b33]/10 hover:text-[#1c2b33]",
    focus: "focus-visible:ring-[#4a5d66]",
  },
  ocean: {
    fill: "bg-[#2ec3c3]/15",
    text: "text-[#0f5c5c]",
    ring: "ring-1 ring-inset ring-[#1f8a8a]/25",
    dot: "bg-[#1f8a8a]",
    removeHover: "hover:bg-[#1f8a8a]/15 hover:text-[#0f5c5c]",
    focus: "focus-visible:ring-[#1f8a8a]",
  },
  success: {
    fill: "bg-emerald-500/15",
    text: "text-emerald-800",
    ring: "ring-1 ring-inset ring-emerald-600/25",
    dot: "bg-emerald-600",
    removeHover: "hover:bg-emerald-600/15 hover:text-emerald-900",
    focus: "focus-visible:ring-emerald-600",
  },
  warning: {
    fill: "bg-amber-400/20",
    text: "text-amber-800",
    ring: "ring-1 ring-inset ring-amber-500/30",
    dot: "bg-amber-500",
    removeHover: "hover:bg-amber-500/20 hover:text-amber-900",
    focus: "focus-visible:ring-amber-500",
  },
  danger: {
    fill: "bg-rose-500/15",
    text: "text-rose-800",
    ring: "ring-1 ring-inset ring-rose-600/25",
    dot: "bg-rose-600",
    removeHover: "hover:bg-rose-600/15 hover:text-rose-900",
    focus: "focus-visible:ring-rose-600",
  },
  info: {
    fill: "bg-sky-500/15",
    text: "text-sky-800",
    ring: "ring-1 ring-inset ring-sky-600/25",
    dot: "bg-sky-600",
    removeHover: "hover:bg-sky-600/15 hover:text-sky-900",
    focus: "focus-visible:ring-sky-600",
  },
};

/** Outline treatment per variant — transparent fill, stronger ring. */
const OUTLINE: Record<BadgeVariant, { text: string; ring: string }> = {
  neutral: { text: "text-[#4a5d66]", ring: "ring-1 ring-inset ring-[#1c2b33]/20" },
  ocean: { text: "text-[#0f5c5c]", ring: "ring-1 ring-inset ring-[#1f8a8a]/45" },
  success: { text: "text-emerald-800", ring: "ring-1 ring-inset ring-emerald-600/45" },
  warning: { text: "text-amber-800", ring: "ring-1 ring-inset ring-amber-500/55" },
  danger: { text: "text-rose-800", ring: "ring-1 ring-inset ring-rose-600/45" },
  info: { text: "text-sky-800", ring: "ring-1 ring-inset ring-sky-600/45" },
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const BadgeTag = React.forwardRef<HTMLSpanElement, BadgeTagProps>(
  function BadgeTag(
    {
      variant = "neutral",
      size = "md",
      pill = true,
      dot = false,
      outline = false,
      onRemove,
      removeLabel,
      children,
      className,
      ...rest
    },
    ref,
  ) {
    const sizing = SIZE[size];
    const solid = SOLID[variant];
    const out = OUTLINE[variant];

    const tone = outline
      ? cx("bg-transparent", out.text, out.ring)
      : cx(solid.fill, solid.text, solid.ring);

    const label =
      removeLabel ??
      (typeof children === "string" ? `Remove ${children}` : "Remove");

    return (
      <span
        ref={ref}
        className={cx(
          "inline-flex select-none items-center whitespace-nowrap align-middle font-medium leading-none",
          pill ? "rounded-full" : "rounded-md",
          sizing.container,
          tone,
          className,
        )}
        {...rest}
      >
        {dot ? (
          <span
            aria-hidden="true"
            className={cx("shrink-0 rounded-full", sizing.dot, solid.dot)}
          />
        ) : null}

        <span className="truncate">{children}</span>

        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label={label}
            className={cx(
              "inline-flex shrink-0 items-center justify-center rounded-full",
              "outline-none transition-colors",
              "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
              sizing.remove,
              solid.removeHover,
              solid.focus,
            )}
          >
            <svg
              className={sizing.removeIcon}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </button>
        ) : null}
      </span>
    );
  },
);

export default BadgeTag;

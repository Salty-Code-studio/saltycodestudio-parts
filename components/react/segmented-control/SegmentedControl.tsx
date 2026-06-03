"use client";

import * as React from "react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface SegmentedControlOption<T extends string = string> {
  /** Stable value returned via onChange. */
  value: T;
  /** Visible label. */
  label: React.ReactNode;
  /** Optional leading icon (rendered before the label). */
  icon?: React.ReactNode;
  /** Disable this single segment. */
  disabled?: boolean;
}

export type SegmentedControlSize = "sm" | "md" | "lg";

export interface SegmentedControlProps<T extends string = string> {
  /** The list of segments to render. */
  options: SegmentedControlOption<T>[];
  /** Controlled selected value. */
  value: T;
  /** Called with the newly selected value. */
  onChange: (value: T) => void;
  /** Size of the control. @default "md" */
  size?: SegmentedControlSize;
  /** Stretch each segment to fill the available width. @default false */
  fullWidth?: boolean;
  /** Disable the whole control. @default false */
  disabled?: boolean;
  /** Accessible label describing the group of choices. */
  "aria-label"?: string;
  /** id of a visible element labelling the group (alternative to aria-label). */
  "aria-labelledby"?: string;
  /** Extra classes for the outer track. */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Style maps                                                                */
/* -------------------------------------------------------------------------- */

const SIZE: Record<
  SegmentedControlSize,
  { track: string; segment: string; gap: string; icon: string }
> = {
  sm: {
    track: "h-8 p-0.5 text-xs",
    segment: "px-2.5 gap-1.5",
    gap: "rounded-md",
    icon: "h-3.5 w-3.5",
  },
  md: {
    track: "h-10 p-1 text-sm",
    segment: "px-3.5 gap-2",
    gap: "rounded-lg",
    icon: "h-4 w-4",
  },
  lg: {
    track: "h-12 p-1 text-base",
    segment: "px-5 gap-2",
    gap: "rounded-xl",
    icon: "h-5 w-5",
  },
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * iOS-style segmented control / tab switcher with an animated sliding pill.
 *
 * - Implemented as a WAI-ARIA `radiogroup` so screen readers announce
 *   "selected" state and the count of options.
 * - Full keyboard support: Arrow keys move (and select) between enabled
 *   segments, Home/End jump to the first/last enabled segment.
 * - The sliding pill is a single absolutely-positioned element animated with
 *   GPU transforms; it respects `prefers-reduced-motion`.
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = "md",
  fullWidth = false,
  disabled = false,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: SegmentedControlProps<T>) {
  const sizing = SIZE[size];

  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  // Pill geometry, measured from the live DOM so it tracks any layout.
  const [pill, setPill] = React.useState<{ left: number; width: number } | null>(
    null,
  );

  const measure = React.useCallback(() => {
    const track = trackRef.current;
    const el = itemRefs.current[selectedIndex];
    if (!track || !el) return;
    setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, [selectedIndex]);

  React.useLayoutEffect(() => {
    measure();
  }, [measure, options, size, fullWidth]);

  React.useEffect(() => {
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure]);

  /** Move focus + selection to the next enabled segment in a direction. */
  const moveTo = (start: number, dir: 1 | -1) => {
    const n = options.length;
    for (let step = 1; step <= n; step++) {
      const i = (start + dir * step + n * step) % n;
      if (!options[i]?.disabled) {
        onChange(options[i].value);
        itemRefs.current[i]?.focus();
        return;
      }
    }
  };

  const edge = (which: "first" | "last") => {
    const order =
      which === "first"
        ? options.map((_, i) => i)
        : options.map((_, i) => i).reverse();
    for (const i of order) {
      if (!options[i]?.disabled) {
        onChange(options[i].value);
        itemRefs.current[i]?.focus();
        return;
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        moveTo(index, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        moveTo(index, -1);
        break;
      case "Home":
        e.preventDefault();
        edge("first");
        break;
      case "End":
        e.preventDefault();
        edge("last");
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={trackRef}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-disabled={disabled || undefined}
      className={cx(
        "relative inline-flex items-center isolate",
        "rounded-[14px] bg-[#ece0cd] ring-1 ring-inset ring-[#1c2b33]/10",
        "shadow-[inset_0_1px_2px_rgba(28,43,51,0.08)]",
        fullWidth && "flex w-full",
        disabled && "opacity-55",
        sizing.track,
        className,
      )}
    >
      {/* Sliding active pill */}
      {pill ? (
        <span
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute top-1/2 z-0 -translate-y-1/2",
            "bg-[#fdfbf7] ring-1 ring-inset ring-[#1c2b33]/10",
            "shadow-[0_1px_2px_rgba(28,43,51,0.12),0_2px_8px_rgba(28,43,51,0.08)]",
            "motion-safe:transition-[transform,width] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            sizing.gap,
          )}
          style={{
            height: "calc(100% - 0.5rem)",
            width: `${pill.width}px`,
            transform: `translate(${pill.left}px, -50%)`,
          }}
        />
      ) : null}

      {options.map((opt, i) => {
        const active = i === selectedIndex;
        const isDisabled = disabled || opt.disabled;
        return (
          <button
            key={opt.value}
            ref={(node) => {
              itemRefs.current[i] = node;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={isDisabled}
            // Roving tabindex: only the active segment is in the tab order.
            tabIndex={active && !isDisabled ? 0 : -1}
            onClick={() => !isDisabled && onChange(opt.value)}
            onKeyDown={(e) => !isDisabled && onKeyDown(e, i)}
            className={cx(
              "relative z-10 inline-flex h-full items-center justify-center whitespace-nowrap",
              "font-medium leading-none transition-colors duration-150",
              "outline-none focus-visible:ring-2 focus-visible:ring-[#1f8a8a] focus-visible:ring-offset-1 focus-visible:ring-offset-[#ece0cd]",
              "disabled:cursor-not-allowed disabled:opacity-45",
              fullWidth && "flex-1",
              active
                ? "text-[#0f5c5c]"
                : "text-[#4a5d66] hover:text-[#1c2b33]",
              sizing.gap,
              sizing.segment,
            )}
          >
            {opt.icon ? (
              <span aria-hidden="true" className={cx("shrink-0", sizing.icon)}>
                {opt.icon}
              </span>
            ) : null}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;

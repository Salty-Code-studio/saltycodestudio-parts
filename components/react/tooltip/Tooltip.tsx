"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** The visible content of the tooltip. */
  content: ReactNode;
  /**
   * The trigger element. Must be a single React element that can receive a ref,
   * event handlers, and `aria-describedby` (e.g. a `<button>`).
   */
  children: ReactElement;
  /** Preferred side. The tooltip flips automatically if it would overflow the viewport. Default `"top"`. */
  placement?: TooltipPlacement;
  /** Delay in ms before showing on hover. Focus is always immediate. Default `150`. */
  delay?: number;
  /** Gap in px between the trigger and the tooltip (the arrow lives in this gap). Default `8`. */
  offset?: number;
  /** Disable the tooltip entirely (trigger still renders). Default `false`. */
  disabled?: boolean;
  /** Extra classes merged onto the floating bubble. */
  className?: string;
}

const ARROW = 6; // half-width of the arrow square, in px
const MARGIN = 8; // min distance to keep from the viewport edge

const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/**
 * Accessible tooltip that appears on hover and keyboard focus, with smart
 * viewport-aware placement (auto-flip + shift) and a small pointing arrow.
 *
 * - `role="tooltip"` + `aria-describedby` wired to the trigger.
 * - Opens on `mouseenter`/`focus`, closes on `mouseleave`/`blur`/`Escape`.
 * - Pointer hover is debounced by `delay`; focus shows instantly.
 * - Positioned in a fixed-coordinate layer, so it never gets clipped by
 *   `overflow: hidden` ancestors.
 */
export default function Tooltip({
  content,
  children,
  placement = "top",
  delay = 150,
  offset = 8,
  disabled = false,
  className = "",
}: TooltipProps) {
  const id = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);
  const [resolved, setResolved] = useState<TooltipPlacement>(placement);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [arrow, setArrow] = useState<{ top?: number; left?: number }>({});

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const show = useCallback(
    (immediate: boolean) => {
      if (disabled) return;
      clearTimer();
      if (immediate || delay <= 0) {
        setOpen(true);
      } else {
        timerRef.current = setTimeout(() => setOpen(true), delay);
      }
    },
    [disabled, delay, clearTimer]
  );

  const hide = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer]);

  // Compute placement against the viewport, flipping/shifting to stay on-screen.
  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    const bubble = bubbleRef.current;
    if (!trigger || !bubble) return;

    const t = trigger.getBoundingClientRect();
    const b = bubble.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const gap = offset + ARROW;

    const fits = (p: TooltipPlacement): boolean => {
      if (p === "top") return t.top - gap - b.height >= MARGIN;
      if (p === "bottom") return t.bottom + gap + b.height <= vh - MARGIN;
      if (p === "left") return t.left - gap - b.width >= MARGIN;
      return t.right + gap + b.width <= vw - MARGIN; // right
    };

    // Prefer requested side, then its opposite, then any side that fits.
    let side = placement;
    if (!fits(side)) {
      if (fits(OPPOSITE[side])) side = OPPOSITE[side];
      else side = (["top", "bottom", "right", "left"] as TooltipPlacement[]).find(fits) ?? side;
    }

    let top = 0;
    let left = 0;
    if (side === "top" || side === "bottom") {
      left = t.left + t.width / 2 - b.width / 2;
      top = side === "top" ? t.top - gap - b.height : t.bottom + gap;
    } else {
      top = t.top + t.height / 2 - b.height / 2;
      left = side === "left" ? t.left - gap - b.width : t.right + gap;
    }

    // Shift along the cross-axis to keep the bubble inside the viewport.
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max));
    if (side === "top" || side === "bottom") {
      const clamped = clamp(left, MARGIN, vw - b.width - MARGIN);
      const arrowLeft = clamp(t.left + t.width / 2 - clamped, ARROW + 4, b.width - ARROW - 4);
      setArrow({ left: arrowLeft });
      left = clamped;
    } else {
      const clamped = clamp(top, MARGIN, vh - b.height - MARGIN);
      const arrowTop = clamp(t.top + t.height / 2 - clamped, ARROW + 4, b.height - ARROW - 4);
      setArrow({ top: arrowTop });
      top = clamped;
    }

    setResolved(side);
    setCoords({ top, left });
  }, [placement, offset]);

  // Measure once the bubble is mounted, then keep it pinned on scroll/resize.
  useLayoutEffect(() => {
    if (!open) return;
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, content, reposition]);

  // Global Escape-to-close while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, hide]);

  useEffect(() => clearTimer, [clearTimer]);

  if (!isValidElement(children)) {
    throw new Error("Tooltip expects a single React element as its child.");
  }

  const childProps = children.props as Record<string, unknown>;
  const callOriginal = (name: string) => (event: unknown) => {
    const handler = childProps[name];
    if (typeof handler === "function") handler(event);
  };

  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      const { ref } = children as unknown as { ref?: unknown };
      if (typeof ref === "function") ref(node);
      else if (ref && typeof ref === "object") (ref as { current: unknown }).current = node;
    },
    "aria-describedby": open && !disabled ? id : (childProps["aria-describedby"] as string | undefined),
    onMouseEnter: (e: unknown) => {
      callOriginal("onMouseEnter")(e);
      show(false);
    },
    onMouseLeave: (e: unknown) => {
      callOriginal("onMouseLeave")(e);
      hide();
    },
    onFocus: (e: unknown) => {
      callOriginal("onFocus")(e);
      show(true);
    },
    onBlur: (e: unknown) => {
      callOriginal("onBlur")(e);
      hide();
    },
  });

  const arrowStyle: CSSProperties = {
    position: "absolute",
    width: ARROW * 2,
    height: ARROW * 2,
    transform: "rotate(45deg)",
    background: "inherit",
    border: "inherit",
    ...(resolved === "top" && { bottom: -ARROW, left: arrow.left, marginLeft: -ARROW, borderTop: "none", borderLeft: "none" }),
    ...(resolved === "bottom" && { top: -ARROW, left: arrow.left, marginLeft: -ARROW, borderBottom: "none", borderRight: "none" }),
    ...(resolved === "left" && { right: -ARROW, top: arrow.top, marginTop: -ARROW, borderBottom: "none", borderLeft: "none" }),
    ...(resolved === "right" && { left: -ARROW, top: arrow.top, marginTop: -ARROW, borderTop: "none", borderRight: "none" }),
  };

  return (
    <>
      {trigger}
      {open && !disabled && (
        <div
          ref={bubbleRef}
          id={id}
          role="tooltip"
          style={{ position: "fixed", top: coords.top, left: coords.left, zIndex: 50 }}
          className={`pointer-events-none max-w-xs animate-[scsTooltipIn_120ms_ease-out] rounded-lg border border-[#0f5c5c] bg-[#0f5c5c] px-3 py-1.5 text-sm font-medium leading-snug text-[#f4ece0] shadow-lg shadow-[#0f5c5c]/25 ${className}`}
        >
          {content}
          <span aria-hidden="true" style={arrowStyle} />
          <style>{`@keyframes scsTooltipIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}`}</style>
        </div>
      )}
    </>
  );
}

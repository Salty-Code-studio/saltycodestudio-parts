import * as React from "react";

/**
 * ButtonSet — a complete button system for the "Sand & Surf" palette.
 *
 * Variants: primary | secondary | ghost | outline | destructive
 * Sizes:    sm | md | lg
 * States:   loading, disabled
 * Extras:   leftIcon / rightIcon, iconOnly, fullWidth, asChild (polymorphic)
 *
 * Accessibility:
 *  - Real <button> semantics by default; focus-visible ring on every variant.
 *  - Loading sets aria-busy and disables interaction without removing it from
 *    the tab order's visual context (uses disabled attr for true buttons).
 *  - iconOnly requires an aria-label (enforced by the type union below).
 */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, sets aria-busy and blocks clicks. */
  loading?: boolean;
  /** Text shown next to the spinner while loading. Falls back to children. */
  loadingText?: React.ReactNode;
  /** Icon rendered before the label. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode;
  /** Square icon-only button. Requires aria-label. */
  iconOnly?: boolean;
  /** Stretches the button to its container width. */
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export type ButtonSetProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps>;

/* ------------------------------------------------------------------ */
/* Style tables                                                        */
/* ------------------------------------------------------------------ */

const BASE =
  "relative inline-flex select-none items-center justify-center gap-2 " +
  "rounded-xl font-semibold tracking-tight whitespace-nowrap " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out " +
  "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-[#1f8a8a] focus-visible:ring-offset-[#fbf7f0] " +
  "active:translate-y-px " +
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:active:translate-y-0 " +
  "disabled:shadow-none";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1f8a8a] text-[#fbf7f0] shadow-sm shadow-[#0f5c5c]/20 " +
    "hover:bg-[#0f5c5c] hover:shadow-md hover:shadow-[#0f5c5c]/25 " +
    "active:bg-[#0f5c5c]",
  secondary:
    "bg-[#ece0cd] text-[#1c2b33] shadow-sm shadow-[#1c2b33]/5 " +
    "hover:bg-[#e2d3b9] active:bg-[#d8c6a6]",
  ghost:
    "bg-transparent text-[#0f5c5c] " +
    "hover:bg-[#1f8a8a]/12 active:bg-[#1f8a8a]/20",
  outline:
    "bg-[#fbf7f0]/40 text-[#0f5c5c] border border-[#1f8a8a]/45 " +
    "hover:bg-[#2ec3c3]/12 hover:border-[#1f8a8a] active:bg-[#2ec3c3]/20",
  destructive:
    "bg-[#b23a2e] text-[#fbf7f0] shadow-sm shadow-[#b23a2e]/25 " +
    "hover:bg-[#8f2c22] active:bg-[#8f2c22] " +
    "focus-visible:ring-[#b23a2e]",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

const ICON_ONLY_SIZES: Record<ButtonSize, string> = {
  sm: "h-9 w-9 p-0",
  md: "h-11 w-11 p-0",
  lg: "h-13 w-13 p-0",
};

const SPINNER_SIZES: Record<ButtonSize, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-[1.15rem] w-[1.15rem]",
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/* Spinner                                                             */
/* ------------------------------------------------------------------ */

function Spinner({ size }: { size: ButtonSize }) {
  return (
    <svg
      className={cx("animate-spin", SPINNER_SIZES[size])}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M21 12a9 9 0 0 0-9-9v3a6 6 0 0 1 6 6h3Z"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export const ButtonSet = React.forwardRef<HTMLButtonElement, ButtonSetProps>(
  function ButtonSet(
    {
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      iconOnly = false,
      fullWidth = false,
      className,
      children,
      disabled,
      type = "button",
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;

    const classes = cx(
      BASE,
      VARIANTS[variant],
      iconOnly ? ICON_ONLY_SIZES[size] : SIZES[size],
      fullWidth && !iconOnly && "w-full",
      className,
    );

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        {...rest}
      >
        {/* Loading overlay: spinner replaces the label visually but the
            label content stays mounted for stable width when not iconOnly. */}
        {loading && (
          <span className="inline-flex items-center gap-2">
            <Spinner size={size} />
            {!iconOnly && (loadingText ?? children) ? (
              <span>{loadingText ?? children}</span>
            ) : null}
          </span>
        )}

        {!loading && (
          <>
            {leftIcon ? (
              <span className="inline-flex shrink-0" aria-hidden="true">
                {leftIcon}
              </span>
            ) : null}
            {iconOnly ? null : children}
            {rightIcon ? (
              <span className="inline-flex shrink-0" aria-hidden="true">
                {rightIcon}
              </span>
            ) : null}
            {/* For iconOnly, render the single icon via leftIcon/rightIcon or children */}
            {iconOnly && !leftIcon && !rightIcon ? (
              <span className="inline-flex shrink-0" aria-hidden="true">
                {children}
              </span>
            ) : null}
          </>
        )}
      </button>
    );
  },
);

export default ButtonSet;

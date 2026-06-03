import { useId, type ReactNode } from "react";

/**
 * AlertCallout — Sand & Surf
 * An accessible info/success/warning/error callout with an icon, optional
 * title, body content, and an optional dismiss button.
 *
 * Accessibility:
 * - `info`/`success` render with role="status" + aria-live="polite".
 * - `warning`/`error` render with role="alert" + aria-live="assertive".
 * - The dismiss button is a real <button> with an accessible label, keyboard
 *   operable, and a visible focus-visible ring.
 * - Decorative icons are aria-hidden so screen readers hear only the message.
 */

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertCalloutProps {
  /** Visual + semantic variant. Defaults to "info". */
  variant?: AlertVariant;
  /** Optional bold heading shown above the body. */
  title?: ReactNode;
  /** Body content of the callout. */
  children?: ReactNode;
  /**
   * When provided, renders a dismiss (×) button and calls this on dismiss.
   * Omit to render a non-dismissible callout.
   */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. Defaults to "Dismiss". */
  dismissLabel?: string;
  /** Override the default variant icon. Pass `null` to hide the icon. */
  icon?: ReactNode | null;
  /** Extra classes for the root element. */
  className?: string;
}

type VariantStyle = {
  role: "status" | "alert";
  live: "polite" | "assertive";
  container: string;
  iconWrap: string;
  title: string;
  body: string;
  dismiss: string;
  icon: ReactNode;
};

/* Inline, dependency-free SVG glyphs (currentColor) -------------------- */
const InfoIcon = (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
    <path d="M10 9v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="10" cy="6.4" r="1" fill="currentColor" />
  </svg>
);

const SuccessIcon = (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="m6.4 10.2 2.3 2.3 4.9-4.9"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WarningIcon = (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
    <path
      d="M10 2.8 18 16.2H2L10 2.8Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M10 8v3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="10" cy="13.6" r="1" fill="currentColor" />
  </svg>
);

const ErrorIcon = (
  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="m7.4 7.4 5.2 5.2M12.6 7.4l-5.2 5.2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const VARIANTS: Record<AlertVariant, VariantStyle> = {
  info: {
    role: "status",
    live: "polite",
    container: "border-[#bfe3e3] bg-[#eef7f7]",
    iconWrap: "bg-[#1f8a8a]/12 text-[#0f5c5c]",
    title: "text-[#0f5c5c]",
    body: "text-[#33555c]",
    dismiss:
      "text-[#0f5c5c] hover:bg-[#1f8a8a]/12 focus-visible:ring-[#1f8a8a]",
    icon: InfoIcon,
  },
  success: {
    role: "status",
    live: "polite",
    container: "border-[#bfe3d6] bg-[#edf7f1]",
    iconWrap: "bg-[#2f8f6b]/12 text-[#1f6b4f]",
    title: "text-[#1f6b4f]",
    body: "text-[#3a5b50]",
    dismiss:
      "text-[#1f6b4f] hover:bg-[#2f8f6b]/12 focus-visible:ring-[#2f8f6b]",
    icon: SuccessIcon,
  },
  warning: {
    role: "alert",
    live: "assertive",
    container: "border-[#ecd9b0] bg-[#fbf3e2]",
    iconWrap: "bg-[#c08a1e]/14 text-[#8a6310]",
    title: "text-[#8a6310]",
    body: "text-[#6b5326]",
    dismiss:
      "text-[#8a6310] hover:bg-[#c08a1e]/14 focus-visible:ring-[#c08a1e]",
    icon: WarningIcon,
  },
  error: {
    role: "alert",
    live: "assertive",
    container: "border-[#eccdc6] bg-[#fbeeea]",
    iconWrap: "bg-[#c0432e]/12 text-[#9a341f]",
    title: "text-[#9a341f]",
    body: "text-[#6b3a30]",
    dismiss:
      "text-[#9a341f] hover:bg-[#c0432e]/12 focus-visible:ring-[#c0432e]",
    icon: ErrorIcon,
  },
};

export default function AlertCallout({
  variant = "info",
  title,
  children,
  onDismiss,
  dismissLabel = "Dismiss",
  icon,
  className = "",
}: AlertCalloutProps) {
  const styles = VARIANTS[variant];
  const titleId = useId();
  const resolvedIcon = icon === undefined ? styles.icon : icon;

  return (
    <div
      role={styles.role}
      aria-live={styles.live}
      aria-labelledby={title ? titleId : undefined}
      className={`flex items-start gap-3 rounded-2xl border p-4 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] ${styles.container} ${className}`}
    >
      {resolvedIcon != null && (
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-xl ${styles.iconWrap}`}
        >
          {resolvedIcon}
        </span>
      )}

      <div className="min-w-0 flex-1">
        {title && (
          <p id={titleId} className={`text-sm font-semibold tracking-tight ${styles.title}`}>
            {title}
          </p>
        )}
        {children != null && (
          <div className={`text-sm leading-relaxed ${styles.body} ${title ? "mt-1" : ""}`}>
            {children}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className={`-mr-1 -mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent ${styles.dismiss}`}
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="m5.5 5.5 9 9M14.5 5.5l-9 9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

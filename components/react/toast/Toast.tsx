import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ------------------------------------------------------------------ *
 * Toast — provider + hook notification system (Brand: Sand & Surf)
 *
 * Features
 *  - <ToastProvider> wraps your app and renders a single live region.
 *  - useToast() returns { toast, dismiss, dismissAll }.
 *  - Stacked toasts, 4 variants, auto-dismiss with pause-on-hover,
 *    and enter/exit slide+fade animation (pure CSS, no deps).
 *  - Accessible: role="status"/"alert", aria-live, focus-visible,
 *    Esc-to-dismiss-focused, keyboard-operable close button.
 * ------------------------------------------------------------------ */

export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastAction {
  /** Button label shown beside the message. */
  label: string;
  /** Invoked on click; toast is dismissed afterwards unless you return false. */
  onClick: () => void | boolean;
}

export interface ToastOptions {
  /** Optional bold heading line. */
  title?: string;
  /** Body message. Either `title` or `description` must be provided. */
  description?: string;
  /** Visual + semantic variant. Default "info". */
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. Use 0 / Infinity to make it sticky. Default 5000. */
  duration?: number;
  /** Optional single action button. */
  action?: ToastAction;
  /** Stable id; pass to update/replace an existing toast. Auto-generated if omitted. */
  id?: string;
}

interface ToastRecord extends Required<Pick<ToastOptions, "variant" | "duration">> {
  id: string;
  title?: string;
  description?: string;
  action?: ToastAction;
  /** Drives the exit animation before removal. */
  leaving: boolean;
}

interface ToastContextValue {
  /** Push a toast; returns its id. */
  toast: (opts: ToastOptions) => string;
  /** Begin the exit animation for a toast id. */
  dismiss: (id: string) => void;
  /** Dismiss every visible toast. */
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Access the toast API. Must be used under <ToastProvider>. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast() must be used within a <ToastProvider>.");
  }
  return ctx;
}

const EXIT_MS = 260;

let counter = 0;
function makeId() {
  counter += 1;
  return `toast-${Date.now().toString(36)}-${counter}`;
}

const VARIANT_META: Record<
  ToastVariant,
  { ring: string; iconBg: string; iconFg: string; bar: string; role: "status" | "alert"; icon: React.ReactNode; label: string }
> = {
  info: {
    ring: "ring-[#1f8a8a]/25",
    iconBg: "bg-[#2ec3c3]/15",
    iconFg: "text-[#0f5c5c]",
    bar: "bg-[#1f8a8a]",
    role: "status",
    label: "Information",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 9v4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="10" cy="6.2" r="1" fill="currentColor" />
      </svg>
    ),
  },
  success: {
    ring: "ring-[#1f8a8a]/30",
    iconBg: "bg-[#2ec3c3]/20",
    iconFg: "text-[#0f5c5c]",
    bar: "bg-[#0f5c5c]",
    role: "status",
    label: "Success",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
        <path d="m6.5 10.2 2.4 2.4 4.6-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  warning: {
    ring: "ring-amber-500/30",
    iconBg: "bg-amber-400/20",
    iconFg: "text-amber-700",
    bar: "bg-amber-500",
    role: "alert",
    label: "Warning",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
        <path d="M10 2.8 18 16.5H2L10 2.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M10 8v3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="10" cy="13.6" r="1" fill="currentColor" />
      </svg>
    ),
  },
  error: {
    ring: "ring-rose-500/30",
    iconBg: "bg-rose-400/15",
    iconFg: "text-rose-700",
    bar: "bg-rose-600",
    role: "alert",
    label: "Error",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
        <path d="m7.5 7.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
};

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-left": "top-0 left-0 items-start",
  "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-0 right-0 items-end",
  "bottom-left": "bottom-0 left-0 items-start",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-0 right-0 items-end",
};

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Where the stack appears. Default "bottom-right". */
  position?: ToastPosition;
  /** Maximum number of toasts on screen; oldest is dismissed past this. Default 4. */
  max?: number;
  /** Default auto-dismiss for toasts that don't set one. Default 5000ms. */
  defaultDuration?: number;
}

export function ToastProvider({
  children,
  position = "bottom-right",
  max = 4,
  defaultDuration = 5000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const isTop = position.startsWith("top");

  // Per-toast timers (auto-dismiss + exit cleanup) kept out of render state.
  const dismissTimers = useRef<Map<string, number>>(new Map());
  const removeTimers = useRef<Map<string, number>>(new Map());

  const clearTimer = (map: React.MutableRefObject<Map<string, number>>, id: string) => {
    const t = map.current.get(id);
    if (t !== undefined) {
      window.clearTimeout(t);
      map.current.delete(id);
    }
  };

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimer(removeTimers, id);
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(dismissTimers, id);
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );
      if (!removeTimers.current.has(id)) {
        removeTimers.current.set(
          id,
          window.setTimeout(() => remove(id), EXIT_MS)
        );
      }
    },
    [remove]
  );

  const startAutoDismiss = useCallback(
    (id: string, duration: number) => {
      if (!duration || duration === Infinity) return;
      clearTimer(dismissTimers, id);
      dismissTimers.current.set(
        id,
        window.setTimeout(() => dismiss(id), duration)
      );
    },
    [dismiss]
  );

  const toast = useCallback(
    (opts: ToastOptions): string => {
      const id = opts.id ?? makeId();
      const duration = opts.duration ?? defaultDuration;
      const record: ToastRecord = {
        id,
        title: opts.title,
        description: opts.description,
        variant: opts.variant ?? "info",
        duration,
        action: opts.action,
        leaving: false,
      };

      setToasts((prev) => {
        const existing = prev.findIndex((t) => t.id === id);
        let next: ToastRecord[];
        if (existing >= 0) {
          next = [...prev];
          next[existing] = record;
        } else {
          next = isTop ? [record, ...prev] : [...prev, record];
        }
        // Enforce max by dismissing the oldest live toasts.
        const live = next.filter((t) => !t.leaving);
        if (live.length > max) {
          const overflow = live.slice(0, live.length - max);
          overflow.forEach((t) => dismiss(t.id));
        }
        return next;
      });

      startAutoDismiss(id, duration);
      return id;
    },
    [defaultDuration, dismiss, isTop, max, startAutoDismiss]
  );

  const dismissAll = useCallback(() => {
    setToasts((prev) => {
      prev.forEach((t) => clearTimer(dismissTimers, t.id));
      return prev.map((t) => ({ ...t, leaving: true }));
    });
    setToasts((prev) => {
      prev.forEach((t) => {
        if (!removeTimers.current.has(t.id)) {
          removeTimers.current.set(
            t.id,
            window.setTimeout(() => remove(t.id), EXIT_MS)
          );
        }
      });
      return prev;
    });
  }, [remove]);

  // Cleanup all pending timers on unmount.
  useEffect(() => {
    const dt = dismissTimers.current;
    const rt = removeTimers.current;
    return () => {
      dt.forEach((t) => window.clearTimeout(t));
      rt.forEach((t) => window.clearTimeout(t));
      dt.clear();
      rt.clear();
    };
  }, []);

  const ctx = useMemo<ToastContextValue>(
    () => ({ toast, dismiss, dismissAll }),
    [toast, dismiss, dismissAll]
  );

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <ToastViewport
        toasts={toasts}
        position={position}
        isTop={isTop}
        onDismiss={dismiss}
        onPause={(id) => clearTimer(dismissTimers, id)}
        onResume={(id, duration) => startAutoDismiss(id, duration)}
      />
    </ToastContext.Provider>
  );
}

interface ToastViewportProps {
  toasts: ToastRecord[];
  position: ToastPosition;
  isTop: boolean;
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string, duration: number) => void;
}

function ToastViewport({
  toasts,
  position,
  isTop,
  onDismiss,
  onPause,
  onResume,
}: ToastViewportProps) {
  if (toasts.length === 0) return null;
  return (
    <div
      // The region itself is polite; per-toast role escalates urgency.
      aria-live="polite"
      aria-atomic="false"
      aria-label="Notifications"
      className={`pointer-events-none fixed z-[60] flex w-full max-w-full flex-col gap-3 p-4 sm:max-w-sm ${POSITION_CLASSES[position]}`}
    >
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          toast={t}
          isTop={isTop}
          onDismiss={onDismiss}
          onPause={onPause}
          onResume={onResume}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: ToastRecord;
  isTop: boolean;
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string, duration: number) => void;
}

function ToastItem({ toast, isTop, onDismiss, onPause, onResume }: ToastItemProps) {
  const meta = VARIANT_META[toast.variant];
  const enterFrom = isTop ? "-translate-y-3" : "translate-y-3";

  const handleAction = () => {
    if (!toast.action) return;
    const keep = toast.action.onClick();
    if (keep !== false) onDismiss(toast.id);
  };

  return (
    <div
      role={meta.role}
      aria-live={meta.role === "alert" ? "assertive" : "polite"}
      tabIndex={0}
      onMouseEnter={() => onPause(toast.id)}
      onMouseLeave={() => onResume(toast.id, toast.duration)}
      onFocus={() => onPause(toast.id)}
      onBlur={() => onResume(toast.id, toast.duration)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onDismiss(toast.id);
        }
      }}
      className={[
        "pointer-events-auto group relative w-full overflow-hidden rounded-2xl border border-[#ece0cd] bg-[#fbf7f0]/95 shadow-lg shadow-[#1c2b33]/10 ring-1 backdrop-blur",
        "outline-none focus-visible:ring-2 focus-visible:ring-[#1f8a8a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4ece0]",
        "motion-safe:transition motion-safe:duration-300 motion-safe:ease-out",
        meta.ring,
        toast.leaving
          ? `opacity-0 ${enterFrom} motion-safe:duration-[260ms]`
          : "translate-y-0 opacity-100",
      ].join(" ")}
    >
      <div className="flex items-start gap-3 p-4 pr-10">
        <span
          className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full ${meta.iconBg} ${meta.iconFg}`}
          aria-hidden="true"
        >
          {meta.icon}
        </span>

        <div className="min-w-0 flex-1">
          {toast.title && (
            <p className="text-sm font-semibold leading-snug text-[#1c2b33]">
              <span className="sr-only">{meta.label}: </span>
              {toast.title}
            </p>
          )}
          {toast.description && (
            <p className={`text-sm leading-snug text-[#4a5d66] ${toast.title ? "mt-0.5" : ""}`}>
              {!toast.title && <span className="sr-only">{meta.label}: </span>}
              {toast.description}
            </p>
          )}

          {toast.action && (
            <button
              type="button"
              onClick={handleAction}
              className="mt-2 rounded-lg px-2 py-1 text-sm font-semibold text-[#0f5c5c] underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#1f8a8a]"
            >
              {toast.action.label}
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg text-[#4a5d66] outline-none transition hover:bg-[#ece0cd]/70 hover:text-[#1c2b33] focus-visible:ring-2 focus-visible:ring-[#1f8a8a]"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
          <path d="m6 6 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {/* Auto-dismiss progress bar; pauses with the timer via CSS group state. */}
      {toast.duration && toast.duration !== Infinity ? (
        <span
          aria-hidden="true"
          className={`absolute bottom-0 left-0 h-0.5 ${meta.bar} motion-safe:animate-[toast-countdown_linear_forwards] motion-safe:group-hover:[animation-play-state:paused] motion-safe:group-focus-within:[animation-play-state:paused]`}
          style={{ animationDuration: `${toast.duration}ms` }}
        />
      ) : null}
    </div>
  );
}

/* Keyframes for the countdown bar. Inject once if you don't already
   define `toast-countdown` in your global stylesheet / Tailwind config. */
export const toastKeyframes = `
@keyframes toast-countdown {
  from { width: 100%; }
  to   { width: 0%; }
}`;

"use client";

import React, {
  createContext,
  forwardRef,
  useContext,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- *
 * Choice Controls — Checkbox, RadioGroup + Radio, and Toggle (switch)
 * One Sand & Surf design language, fully accessible (ARIA + keyboard + focus).
 * -------------------------------------------------------------------------- */

type Size = "sm" | "md" | "lg";

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/* ============================== Checkbox =============================== */

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Visible label rendered next to the control. */
  label?: ReactNode;
  /** Helper / description line under the label. */
  description?: ReactNode;
  /** Renders the dash (mixed) state. Visual + `aria-checked="mixed"`. */
  indeterminate?: boolean;
  /** Control footprint. @default "md" */
  size?: Size;
}

const BOX_SIZE: Record<Size, string> = {
  sm: "h-4 w-4 rounded-[5px]",
  md: "h-[18px] w-[18px] rounded-md",
  lg: "h-5 w-5 rounded-md",
};

const LABEL_TEXT: Record<Size, string> = {
  sm: "text-sm",
  md: "text-[15px]",
  lg: "text-base",
};

/**
 * Accessible checkbox. A visually-hidden native `<input>` keeps full keyboard,
 * form, and screen-reader behaviour; the painted box mirrors its state.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      description,
      indeterminate = false,
      size = "md",
      className,
      disabled,
      id,
      ...props
    },
    forwardedRef,
  ) {
    const reactId = useId();
    const inputId = id ?? `cc-checkbox-${reactId}`;
    const descId = description ? `${inputId}-desc` : undefined;
    const innerRef = useRef<HTMLInputElement | null>(null);

    // Sync the DOM-only `indeterminate` property.
    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    return (
      <label
        htmlFor={inputId}
        className={cx(
          "group inline-flex select-none items-start gap-3",
          disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer",
          className,
        )}
      >
        <span className="relative inline-flex shrink-0 items-center justify-center">
          <input
            ref={setRefs}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            aria-describedby={descId}
            className="peer absolute inset-0 z-10 h-full w-full cursor-[inherit] opacity-0"
            {...props}
          />
          <span
            aria-hidden="true"
            className={cx(
              "flex items-center justify-center border border-[#cdbfa8] bg-[#fbf7f0] text-white",
              "transition-[background-color,border-color,box-shadow] duration-150 ease-out",
              "peer-hover:border-[#1f8a8a]",
              "peer-checked:border-[#1f8a8a] peer-checked:bg-[#1f8a8a]",
              "peer-indeterminate:border-[#1f8a8a] peer-indeterminate:bg-[#1f8a8a]",
              "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[#2ec3c3]/55 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#fbf7f0]",
              BOX_SIZE[size],
            )}
          >
            {/* check mark */}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="h-3.5 w-3.5 scale-50 opacity-0 transition-all duration-150 ease-out peer-checked:scale-100 peer-checked:opacity-100"
            >
              <path
                d="M3.5 8.4 6.3 11l6-6.2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* indeterminate dash */}
            <span className="absolute h-[2px] w-2.5 scale-x-0 rounded-full bg-current opacity-0 transition-all duration-150 ease-out peer-indeterminate:scale-x-100 peer-indeterminate:opacity-100" />
          </span>
        </span>

        {(label || description) && (
          <span className="flex flex-col gap-0.5 leading-tight">
            {label && (
              <span className={cx("font-medium text-[#1c2b33]", LABEL_TEXT[size])}>
                {label}
              </span>
            )}
            {description && (
              <span id={descId} className="text-[13px] text-[#4a5d66]">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  },
);

/* ============================ Radio Group ============================== */

interface RadioContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  size: Size;
  disabled?: boolean;
}

const RadioContext = createContext<RadioContextValue | null>(null);

export interface RadioGroupProps {
  /** Accessible group label (rendered + wired via `aria-labelledby`). */
  label?: ReactNode;
  /** Shared form `name`. Auto-generated if omitted. */
  name?: string;
  /** Selected value (controlled). */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: Size;
  /** Disable every option in the group. */
  disabled?: boolean;
  /** Stack ("vertical") or inline ("horizontal"). @default "vertical" */
  orientation?: "vertical" | "horizontal";
  className?: string;
  children: ReactNode;
}

/**
 * Radio group with roving focus. Renders a `role="radiogroup"` wrapper; the
 * native radios provide arrow-key navigation and single-selection semantics.
 */
export function RadioGroup({
  label,
  name,
  value,
  defaultValue,
  onChange,
  size = "md",
  disabled,
  orientation = "vertical",
  className,
  children,
}: RadioGroupProps) {
  const reactId = useId();
  const groupName = name ?? `cc-radio-${reactId}`;
  const labelId = label ? `${groupName}-label` : undefined;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const current = isControlled ? value : internal;

  const handleChange = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      className={cx("flex flex-col gap-3", className)}
    >
      {label && (
        <span id={labelId} className="text-sm font-semibold text-[#1c2b33]">
          {label}
        </span>
      )}
      <div
        className={cx(
          "flex gap-3",
          orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col",
        )}
      >
        <RadioContext.Provider
          value={{ name: groupName, value: current, onChange: handleChange, size, disabled }}
        >
          {children}
        </RadioContext.Provider>
      </div>
    </div>
  );
}

export interface RadioProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "name" | "checked" | "value" | "onChange"
  > {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
}

const DOT_SIZE: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-[18px] w-[18px]",
  lg: "h-5 w-5",
};

/** A single option. Must be rendered inside a {@link RadioGroup}. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, description, disabled, className, id, ...props },
  ref,
) {
  const ctx = useContext(RadioContext);
  if (!ctx) {
    throw new Error("<Radio> must be used inside a <RadioGroup>.");
  }
  const reactId = useId();
  const inputId = id ?? `${ctx.name}-${reactId}`;
  const descId = description ? `${inputId}-desc` : undefined;
  const isDisabled = disabled || ctx.disabled;
  const checked = ctx.value === value;

  return (
    <label
      htmlFor={inputId}
      className={cx(
        "group inline-flex items-start gap-3 select-none",
        isDisabled ? "cursor-not-allowed opacity-55" : "cursor-pointer",
        className,
      )}
    >
      <span className="relative inline-flex shrink-0 items-center justify-center">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          name={ctx.name}
          value={value}
          checked={checked}
          disabled={isDisabled}
          aria-describedby={descId}
          onChange={() => ctx.onChange?.(value)}
          className="peer absolute inset-0 z-10 h-full w-full cursor-[inherit] opacity-0"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cx(
            "flex items-center justify-center rounded-full border border-[#cdbfa8] bg-[#fbf7f0]",
            "transition-[border-color,box-shadow] duration-150 ease-out",
            "peer-hover:border-[#1f8a8a]",
            "peer-checked:border-[#1f8a8a]",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[#2ec3c3]/55 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#fbf7f0]",
            DOT_SIZE[ctx.size],
          )}
        >
          <span className="h-2 w-2 scale-0 rounded-full bg-[#1f8a8a] opacity-0 transition-all duration-150 ease-out peer-checked:scale-100 peer-checked:opacity-100" />
        </span>
      </span>

      {(label || description) && (
        <span className="flex flex-col gap-0.5 leading-tight">
          {label && (
            <span className={cx("font-medium text-[#1c2b33]", LABEL_TEXT[ctx.size])}>
              {label}
            </span>
          )}
          {description && (
            <span id={descId} className="text-[13px] text-[#4a5d66]">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
});

/* ============================== Toggle ================================= */

export interface ToggleProps {
  /** On/off state (controlled). */
  checked?: boolean;
  /** Uncontrolled initial state. */
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  size?: Size;
  disabled?: boolean;
  /** Place label before the switch instead of after. @default false */
  labelLeft?: boolean;
  id?: string;
  /** Used when no visible `label` is provided. */
  "aria-label"?: string;
  className?: string;
}

const TRACK: Record<Size, string> = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
  lg: "h-7 w-[52px]",
};
const THUMB: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};
const THUMB_ON: Record<Size, string> = {
  sm: "translate-x-4",
  md: "translate-x-5",
  lg: "translate-x-[22px]",
};

/**
 * Toggle switch built on a real `<button role="switch">` so Space/Enter and
 * `aria-checked` work out of the box.
 */
export function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  label,
  description,
  size = "md",
  disabled,
  labelLeft = false,
  id,
  className,
  "aria-label": ariaLabel,
}: ToggleProps) {
  const reactId = useId();
  const switchId = id ?? `cc-toggle-${reactId}`;
  const descId = description ? `${switchId}-desc` : undefined;
  const labelId = label ? `${switchId}-label` : undefined;

  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const on = isControlled ? checked : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !on;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const text = (
    <span className="flex flex-col gap-0.5 leading-tight">
      {label && (
        <span id={labelId} className={cx("font-medium text-[#1c2b33]", LABEL_TEXT[size])}>
          {label}
        </span>
      )}
      {description && (
        <span id={descId} className="text-[13px] text-[#4a5d66]">
          {description}
        </span>
      )}
    </span>
  );

  const button = (
    <button
      type="button"
      role="switch"
      id={switchId}
      aria-checked={on}
      aria-label={!label ? ariaLabel : undefined}
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={descId}
      disabled={disabled}
      onClick={toggle}
      className={cx(
        "relative inline-flex shrink-0 items-center rounded-full border border-transparent p-0.5",
        "transition-colors duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2ec3c3]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf7f0]",
        on ? "bg-[#1f8a8a]" : "bg-[#d9cab3]",
        disabled && "cursor-not-allowed opacity-55",
        TRACK[size],
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none inline-block rounded-full bg-white shadow-sm ring-1 ring-black/5",
          "transition-transform duration-200 ease-out",
          THUMB[size],
          on ? THUMB_ON[size] : "translate-x-0",
        )}
      />
    </button>
  );

  if (!label && !description) {
    return <span className={cx("inline-flex", className)}>{button}</span>;
  }

  return (
    <span
      className={cx(
        "inline-flex items-center gap-3",
        disabled && "opacity-55",
        className,
      )}
    >
      {labelLeft && text}
      {button}
      {!labelLeft && text}
    </span>
  );
}

const ChoiceControls = { Checkbox, RadioGroup, Radio, Toggle };
export default ChoiceControls;

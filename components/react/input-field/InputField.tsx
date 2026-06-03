"use client";

import React, { useId, useState } from "react";

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visible label text. */
  label: string;
  /**
   * Label behaviour:
   * - "floating": label sits inside the field and animates up on focus/value.
   * - "standard": label is shown statically above the field.
   */
  labelVariant?: "floating" | "standard";
  /** Helper text shown beneath the field (hidden when an error is present). */
  helperText?: string;
  /** Error message. Presence flips the field into the error state. */
  error?: string;
  /** Icon rendered at the start of the field. */
  leadingIcon?: React.ReactNode;
  /** Icon (or interactive element, e.g. a clear button) rendered at the end. */
  trailingIcon?: React.ReactNode;
  /** Shows a required asterisk next to the label and sets aria-required. */
  required?: boolean;
  /** Wrapper className for layout control. */
  className?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    {
      label,
      labelVariant = "standard",
      helperText,
      error,
      leadingIcon,
      trailingIcon,
      required = false,
      className = "",
      id,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      disabled,
      placeholder,
      ...rest
    },
    ref
  ) {
    const reactId = useId();
    const inputId = id ?? `scs-input-${reactId}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = useState<string>(
      defaultValue != null ? String(defaultValue) : ""
    );
    const [focused, setFocused] = useState(false);

    const currentValue = isControlled ? String(value) : innerValue;
    const hasValue = currentValue.length > 0;
    const invalid = Boolean(error);
    const floating = labelVariant === "floating";
    // Float the label up when focused, filled, or a placeholder is forcing space.
    const floatUp = floating && (focused || hasValue || Boolean(placeholder));

    const describedBy =
      [invalid ? errorId : null, !invalid && helperText ? helperId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (!isControlled) setInnerValue(e.target.value);
      onChange?.(e);
    }

    // Field surface styling, reacting to disabled / error / focus.
    const fieldClasses = [
      "group relative flex items-center gap-2 rounded-xl border bg-[#faf6ef] px-3.5 transition-all duration-200",
      floating ? "pt-5 pb-1.5" : "py-2.5",
      disabled
        ? "cursor-not-allowed border-[#e7ddcd] opacity-60"
        : invalid
        ? "border-rose-400/70 ring-2 ring-rose-300/40 focus-within:border-rose-500 focus-within:ring-rose-300/50"
        : "border-[#e3d8c5] focus-within:border-[#1f8a8a] focus-within:ring-2 focus-within:ring-[#2ec3c3]/35",
    ].join(" ");

    const iconColor = invalid
      ? "text-rose-500"
      : focused
      ? "text-[#0f5c5c]"
      : "text-[#4a5d66]";

    return (
      <div className={`w-full ${className}`}>
        {/* Standard label sits above the control. */}
        {!floating && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-[#1c2b33]"
          >
            {label}
            {required && (
              <span className="ml-0.5 text-rose-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className={fieldClasses}>
          {leadingIcon && (
            <span
              className={`pointer-events-none flex h-5 w-5 shrink-0 items-center justify-center transition-colors duration-200 ${iconColor}`}
              aria-hidden="true"
            >
              {leadingIcon}
            </span>
          )}

          <div className="relative flex-1">
            {/* Floating label overlays the input and lifts on focus/value. */}
            {floating && (
              <label
                htmlFor={inputId}
                className={[
                  "pointer-events-none absolute left-0 origin-left truncate transition-all duration-200",
                  floatUp
                    ? "top-0 -translate-y-3.5 text-xs font-medium"
                    : "top-1/2 -translate-y-1/2 text-base",
                  invalid
                    ? "text-rose-500"
                    : focused
                    ? "text-[#0f5c5c]"
                    : "text-[#4a5d66]",
                ].join(" ")}
              >
                {label}
                {required && (
                  <span className="ml-0.5 text-rose-500" aria-hidden="true">
                    *
                  </span>
                )}
              </label>
            )}

            <input
              ref={ref}
              id={inputId}
              value={isControlled ? value : innerValue}
              onChange={handleChange}
              onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              disabled={disabled}
              required={required}
              aria-required={required || undefined}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              placeholder={floating && !floatUp ? undefined : placeholder}
              className="w-full bg-transparent text-[15px] text-[#1c2b33] outline-none placeholder:text-[#9aa7ac] disabled:cursor-not-allowed"
              {...rest}
            />
          </div>

          {trailingIcon && (
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center transition-colors duration-200 ${iconColor}`}
            >
              {trailingIcon}
            </span>
          )}
        </div>

        {/* Error message takes priority over helper text; both are announced. */}
        {invalid ? (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5 shrink-0"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.9.9 0 01.9.9v3.2a.9.9 0 11-1.8 0V4.9A.9.9 0 018 4zm0 7.4a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1.5 text-xs text-[#4a5d66]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

export default InputField;

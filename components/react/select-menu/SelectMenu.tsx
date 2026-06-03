"use client";

import * as React from "react";

/* ------------------------------------------------------------------ *
 * SelectMenu — accessible custom select / dropdown
 * Sand & Surf palette · keyboard nav · optional search · checkmark
 * ------------------------------------------------------------------ */

export interface SelectOption {
  /** Stable value used in onChange and to mark the selected row. */
  value: string;
  /** Visible row text. */
  label: string;
  /** Optional small description rendered under the label. */
  description?: string;
  /** Optional leading glyph/emoji. */
  icon?: string;
  /** Disable selection of this single row. */
  disabled?: boolean;
}

export interface SelectMenuProps {
  /** Options to render. */
  options: SelectOption[];
  /** Controlled selected value. */
  value?: string | null;
  /** Uncontrolled initial value. */
  defaultValue?: string | null;
  /** Fired with the chosen value when selection changes. */
  onChange?: (value: string) => void;
  /** Placeholder shown when nothing is selected. */
  placeholder?: string;
  /** Show a search box that filters options by label. */
  searchable?: boolean;
  /** Placeholder for the search box. */
  searchPlaceholder?: string;
  /** Disable the whole control. */
  disabled?: boolean;
  /** Accessible label (used for aria-label when no visible label). */
  label?: string;
  /** Forwarded to the trigger button. */
  id?: string;
  /** Extra classes on the outer wrapper. */
  className?: string;
  /** Sizing. */
  size?: "sm" | "md" | "lg";
}

const SIZES: Record<NonNullable<SelectMenuProps["size"]>, { trigger: string; text: string }> = {
  sm: { trigger: "h-9 px-3 text-sm", text: "text-sm" },
  md: { trigger: "h-11 px-3.5 text-[15px]", text: "text-[15px]" },
  lg: { trigger: "h-12 px-4 text-base", text: "text-base" },
};

let idCounter = 0;
function useId(prefix: string, override?: string) {
  const ref = React.useRef<string>();
  if (!ref.current) ref.current = override ?? `${prefix}-${++idCounter}`;
  return ref.current;
}

export default function SelectMenu({
  options,
  value: controlledValue,
  defaultValue = null,
  onChange,
  placeholder = "Select an option",
  searchable = false,
  searchPlaceholder = "Search…",
  disabled = false,
  label,
  id,
  className = "",
  size = "md",
}: SelectMenuProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<string | null>(defaultValue);
  const value = isControlled ? controlledValue : uncontrolled;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const triggerId = useId("scs-select-trigger", id);
  const listId = useId("scs-select-list");
  const labelId = useId("scs-select-label");

  const sz = SIZES[size];

  const filtered = React.useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.description?.toLowerCase().includes(q) ?? false)
    );
  }, [options, query, searchable]);

  const selectedOption = React.useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value]
  );

  const firstEnabledIndex = React.useCallback(
    (list: SelectOption[]) => list.findIndex((o) => !o.disabled),
    []
  );

  /* ---- open / close ------------------------------------------------ */
  const openMenu = React.useCallback(() => {
    if (disabled) return;
    setOpen(true);
    const selIdx = filtered.findIndex((o) => o.value === value && !o.disabled);
    setActiveIndex(selIdx >= 0 ? selIdx : firstEnabledIndex(filtered));
  }, [disabled, filtered, value, firstEnabledIndex]);

  const closeMenu = React.useCallback((focusTrigger = true) => {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  const commit = React.useCallback(
    (option: SelectOption) => {
      if (option.disabled) return;
      if (!isControlled) setUncontrolled(option.value);
      onChange?.(option.value);
      closeMenu();
    },
    [isControlled, onChange, closeMenu]
  );

  /* ---- outside click + Escape -------------------------------------- */
  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        closeMenu(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, closeMenu]);

  /* ---- focus management on open ------------------------------------ */
  React.useEffect(() => {
    if (!open) return;
    if (searchable) {
      searchRef.current?.focus();
    } else {
      listRef.current?.focus();
    }
  }, [open, searchable]);

  /* ---- keep active row in view ------------------------------------- */
  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  /* ---- reset active index when filter changes ---------------------- */
  React.useEffect(() => {
    if (!open) return;
    setActiveIndex((prev) => {
      if (prev >= 0 && prev < filtered.length && !filtered[prev]?.disabled) return prev;
      return firstEnabledIndex(filtered);
    });
  }, [filtered, open, firstEnabledIndex]);

  const moveActive = React.useCallback(
    (dir: 1 | -1) => {
      if (filtered.length === 0) return;
      setActiveIndex((prev) => {
        let next = prev;
        for (let i = 0; i < filtered.length; i++) {
          next = (next + dir + filtered.length) % filtered.length;
          if (!filtered[next].disabled) return next;
        }
        return prev;
      });
    },
    [filtered]
  );

  const onListKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!open) return openMenu();
          moveActive(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!open) return openMenu();
          moveActive(-1);
          break;
        case "Home":
          if (open) {
            e.preventDefault();
            setActiveIndex(firstEnabledIndex(filtered));
          }
          break;
        case "End":
          if (open) {
            e.preventDefault();
            for (let i = filtered.length - 1; i >= 0; i--) {
              if (!filtered[i].disabled) {
                setActiveIndex(i);
                break;
              }
            }
          }
          break;
        case "Enter":
          if (open && activeIndex >= 0 && filtered[activeIndex]) {
            e.preventDefault();
            commit(filtered[activeIndex]);
          }
          break;
        case "Tab":
          if (open) closeMenu(false);
          break;
        case "Escape":
          if (open) {
            e.preventDefault();
            closeMenu();
          }
          break;
        default:
          break;
      }
    },
    [open, openMenu, moveActive, firstEnabledIndex, filtered, activeIndex, commit, closeMenu]
  );

  const onTriggerKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        openMenu();
        return;
      }
      if ((e.key === "Enter" || e.key === " ") && !open) {
        e.preventDefault();
        openMenu();
        return;
      }
      if (!searchable) onListKeyDown(e);
    },
    [disabled, open, openMenu, searchable, onListKeyDown]
  );

  const activeId = open && activeIndex >= 0 && filtered[activeIndex]
    ? `${listId}-opt-${activeIndex}`
    : undefined;

  return (
    <div ref={rootRef} className={`relative w-full max-w-xs ${className}`}>
      {label && (
        <span id={labelId} className="mb-1.5 block text-sm font-medium text-[#1c2b33]">
          {label}
        </span>
      )}

      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={label ? `${labelId} ${triggerId}` : undefined}
        aria-label={!label ? placeholder : undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={[
          "flex w-full items-center justify-between gap-2 rounded-xl border bg-[#fbf7f0] text-left",
          "transition-colors duration-150 outline-none",
          "border-[#e2d6c2] text-[#1c2b33]",
          "hover:border-[#cdbfa6] hover:bg-[#f4ece0]",
          "focus-visible:border-[#1f8a8a] focus-visible:ring-2 focus-visible:ring-[#2ec3c3]/45",
          "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:bg-[#fbf7f0]",
          open ? "border-[#1f8a8a] ring-2 ring-[#2ec3c3]/40" : "",
          sz.trigger,
        ].join(" ")}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedOption?.icon && (
            <span aria-hidden="true" className="text-base leading-none">
              {selectedOption.icon}
            </span>
          )}
          <span
            className={`truncate ${selectedOption ? "text-[#1c2b33]" : "text-[#90a0a8]"}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 text-[#4a5d66] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 7.5 10 12.5 15 7.5" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[#e2d6c2] bg-[#fbf7f0] shadow-xl shadow-[#1c2b33]/10"
          style={{ animation: "scs-select-pop 140ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          {searchable && (
            <div className="border-b border-[#ece0cd] p-2">
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onListKeyDown}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                aria-controls={listId}
                aria-activedescendant={activeId}
                autoComplete="off"
                className={[
                  "w-full rounded-lg border border-[#e2d6c2] bg-[#f4ece0] px-3 py-2",
                  "text-[#1c2b33] placeholder:text-[#90a0a8] outline-none",
                  "focus-visible:border-[#1f8a8a] focus-visible:ring-2 focus-visible:ring-[#2ec3c3]/40",
                  "text-sm",
                ].join(" ")}
              />
            </div>
          )}

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={searchable ? -1 : 0}
            aria-labelledby={label ? labelId : undefined}
            aria-activedescendant={activeId}
            onKeyDown={searchable ? undefined : onListKeyDown}
            className="max-h-60 overflow-y-auto p-1 outline-none"
          >
            {filtered.length === 0 && (
              <li
                role="presentation"
                className="px-3 py-6 text-center text-sm text-[#90a0a8]"
              >
                No matches found
              </li>
            )}

            {filtered.map((option, index) => {
              const selected = option.value === value;
              const active = index === activeIndex;
              return (
                <li
                  key={option.value}
                  id={`${listId}-opt-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={option.disabled || undefined}
                  onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                  onClick={() => commit(option)}
                  className={[
                    "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2",
                    sz.text,
                    option.disabled ? "cursor-not-allowed opacity-45" : "",
                    active && !option.disabled ? "bg-[#1f8a8a] text-white" : "text-[#1c2b33]",
                    !active && selected ? "bg-[#e6f4f4]" : "",
                  ].join(" ")}
                >
                  {option.icon && (
                    <span aria-hidden="true" className="text-base leading-none">
                      {option.icon}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{option.label}</span>
                    {option.description && (
                      <span
                        className={`block truncate text-xs ${
                          active && !option.disabled ? "text-white/80" : "text-[#4a5d66]"
                        }`}
                      >
                        {option.description}
                      </span>
                    )}
                  </span>
                  {selected && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className={`h-4 w-4 shrink-0 ${
                        active ? "text-white" : "text-[#0f5c5c]"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m4 10.5 4 4 8-9" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <style>{`
        @keyframes scs-select-pop {
          from { opacity: 0; transform: translateY(-4px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

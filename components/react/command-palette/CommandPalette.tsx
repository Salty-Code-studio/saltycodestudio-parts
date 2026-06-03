"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface Command {
  id: string;
  /** Display label */
  label: string;
  /** Optional group/section name */
  group?: string;
  /** Optional leading glyph/emoji */
  icon?: string;
  /** Optional keyboard hint shown on the right, e.g. "G H" */
  shortcut?: string;
  /** Extra search keywords */
  keywords?: string;
  /** Action invoked on select */
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  commands?: Command[];
  placeholder?: string;
  /** Controlled open state (optional). If omitted, the component manages its own and listens for ⌘K / Ctrl+K. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Lightweight subsequence fuzzy match. Returns a score (higher = better) or -1 if no match. */
function fuzzyScore(query: string, target: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let qi = 0;
  let score = 0;
  let streak = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      streak++;
      score += 1 + streak; // reward consecutive matches
      if (ti === 0) score += 4; // reward start-of-string
      qi++;
    } else {
      streak = 0;
    }
  }
  return qi === q.length ? score : -1;
}

const DEFAULT_COMMANDS: Command[] = [
  { id: "home", label: "Go to Home", group: "Navigation", icon: "🏠", shortcut: "G H" },
  { id: "work", label: "View Work", group: "Navigation", icon: "🗂️", shortcut: "G W" },
  { id: "journal", label: "Open Journal", group: "Navigation", icon: "📓", shortcut: "G J" },
  { id: "new-project", label: "Start a new project", group: "Actions", icon: "✨", keywords: "create brief" },
  { id: "invoice", label: "Create invoice", group: "Actions", icon: "🧾", keywords: "billing" },
  { id: "theme", label: "Toggle dark mode", group: "Actions", icon: "🌗", shortcut: "⌘ D" },
  { id: "docs", label: "Read the docs", group: "Help", icon: "📚" },
  { id: "support", label: "Contact support", group: "Help", icon: "💬", keywords: "email chat" },
];

export default function CommandPalette({
  commands = DEFAULT_COMMANDS,
  placeholder = "Type a command or search…",
  open: controlledOpen,
  onOpenChange,
}: CommandPaletteProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global ⌘K / Ctrl+K toggle + Escape to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Focus + reset on open.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  const results = useMemo(() => {
    const haystack = (c: Command) => `${c.label} ${c.group ?? ""} ${c.keywords ?? ""}`;
    return commands
      .map((c) => ({ c, s: fuzzyScore(query, haystack(c)) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.c);
  }, [commands, query]);

  // Clamp active index when results change.
  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, results.length - 1)));
  }, [results.length]);

  // Group results in their sorted order.
  const groups = useMemo(() => {
    const map = new Map<string, Command[]>();
    for (const c of results) {
      const g = c.group ?? "Results";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(c);
    }
    // Flatten to a parallel index so keyboard nav maps to a single list.
    return Array.from(map.entries());
  }, [results]);

  const select = useCallback(
    (cmd: Command | undefined) => {
      if (!cmd) return;
      cmd.onSelect?.();
      setOpen(false);
    },
    [setOpen]
  );

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(results[active]);
    }
  };

  // Keep the active item in view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-[#e7ddcd] bg-white/70 px-3 py-2 text-sm text-[#5b6b72] shadow-sm transition hover:border-teal-700/40 hover:text-[#1c2b33]"
      >
        <span>Search…</span>
        <kbd className="rounded-md border border-[#e7ddcd] bg-[#faf6ef] px-1.5 py-0.5 text-xs font-medium text-[#5b6b72]">
          ⌘K
        </kbd>
      </button>
    );
  }

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="absolute inset-0 bg-[#1c2b33]/40 backdrop-blur-sm animate-[fadeIn_.15s_ease-out]"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#e7ddcd] bg-[#fffdf8] shadow-2xl shadow-[#1c2b33]/20 animate-[pop_.16s_ease-out]">
        <div className="flex items-center gap-3 border-b border-[#efe7d8] px-4">
          <svg className="h-5 w-5 shrink-0 text-[#9aa6ab]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder={placeholder}
            className="w-full bg-transparent py-4 text-[15px] text-[#1c2b33] outline-none placeholder:text-[#9aa6ab]"
          />
          <kbd className="hidden rounded-md border border-[#e7ddcd] bg-[#faf6ef] px-1.5 py-0.5 text-xs text-[#9aa6ab] sm:block">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-[#9aa6ab]">
              No commands found for “{query}”.
            </p>
          ) : (
            groups.map(([group, items]) => (
              <div key={group} className="mb-1">
                <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a89c84]">
                  {group}
                </p>
                {items.map((cmd) => {
                  flatIndex++;
                  const idx = flatIndex;
                  const isActive = idx === active;
                  return (
                    <button
                      key={cmd.id}
                      data-index={idx}
                      type="button"
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => select(cmd)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        isActive
                          ? "bg-teal-700 text-white"
                          : "text-[#374249] hover:bg-[#f3ecdf]"
                      }`}
                    >
                      {cmd.icon && <span className="text-base">{cmd.icon}</span>}
                      <span className="flex-1 truncate font-medium">{cmd.label}</span>
                      {cmd.shortcut && (
                        <span
                          className={`text-xs ${isActive ? "text-teal-100" : "text-[#9aa6ab]"}`}
                        >
                          {cmd.shortcut}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pop { from { opacity: 0; transform: translateY(-8px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}

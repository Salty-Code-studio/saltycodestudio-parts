"use client";

import React, { useEffect, useState } from "react";

export interface DarkModeToggleProps {
  /** localStorage key for persistence */
  storageKey?: string;
  /** Toggle the `dark` class on <html> (Tailwind dark mode). Default true. */
  applyToDocument?: boolean;
  /** Called whenever the theme changes */
  onChange?: (theme: "light" | "dark") => void;
  className?: string;
}

function getInitialDark(storageKey: string): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(storageKey);
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function DarkModeToggle({
  storageKey = "scs-theme",
  applyToDocument = true,
  onChange,
  className = "",
}: DarkModeToggleProps) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Resolve initial theme on the client to avoid hydration mismatch.
  useEffect(() => {
    setDark(getInitialDark(storageKey));
    setMounted(true);
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;
    const theme = dark ? "dark" : "light";
    if (applyToDocument) {
      document.documentElement.classList.toggle("dark", dark);
    }
    localStorage.setItem(storageKey, theme);
    onChange?.(theme);
  }, [dark, mounted, applyToDocument, storageKey, onChange]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Toggle dark mode"
      onClick={() => setDark((d) => !d)}
      className={`group relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-[#e7ddcd] bg-[#faf6ef] text-[#1c2b33] transition-colors duration-300 hover:border-teal-700/40 dark:border-white/15 dark:bg-[#0f1c22] dark:text-amber-200 ${className}`}
    >
      {/* Sun ⇆ Moon morph: the icon rotates/scales as state flips */}
      <span className="relative h-5 w-5">
        {/* Sun */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
            dark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        {/* Moon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
            dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
          aria-hidden="true"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      </span>
    </button>
  );
}

"use client";

import React, { useEffect, useState } from "react";

export interface NavLink {
  label: string;
  href: string;
}

export interface ShrinkingStickyNavbarProps {
  /** Brand text shown next to the mark */
  brand?: string;
  /** Navigation links */
  links?: NavLink[];
  /** CTA button label */
  ctaLabel?: string;
  /** CTA href */
  ctaHref?: string;
  /** Scroll distance (px) after which the nav condenses */
  threshold?: number;
  className?: string;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Studio", href: "#studio" },
  { label: "Journal", href: "#journal" },
];

export default function ShrinkingStickyNavbar({
  brand = "saltycodestudio",
  links = DEFAULT_LINKS,
  ctaLabel = "Start a project",
  ctaHref = "#contact",
  threshold = 24,
  className = "",
}: ShrinkingStickyNavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out ${
        scrolled
          ? "border-b border-[#e7ddcd]/80 bg-[#faf6ef]/80 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-transparent"
      } ${className}`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-300 ease-out ${
          scrolled ? "h-14" : "h-20"
        }`}
      >
        <a href="#" className="flex items-center gap-2">
          <span
            className={`grid place-items-center rounded-xl bg-[#1c2b33] font-mono font-bold text-amber-200 transition-all duration-300 ${
              scrolled ? "h-7 w-7 text-sm" : "h-9 w-9 text-base"
            }`}
            aria-hidden="true"
          >
            ~&lt;
          </span>
          <span
            className={`font-semibold tracking-tight text-[#1c2b33] transition-all duration-300 ${
              scrolled ? "text-base" : "text-lg"
            }`}
          >
            {brand}
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-[#42525a] transition-colors hover:text-teal-700"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          className={`rounded-full bg-teal-700 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-teal-800 ${
            scrolled ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-sm"
          }`}
        >
          {ctaLabel}
        </a>
      </nav>
    </header>
  );
}

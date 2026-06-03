import { useEffect, useState } from "react";

/**
 * Navbar — saltycodestudio "Sand & Surf"
 * Responsive sticky navbar with logo, links, CTA, and an animated
 * mobile hamburger menu. Light-mode-led: warm sand canvas, deep teal ink,
 * one surf-coral accent on the CTA.
 */

export interface NavLink {
  /** Visible label. */
  label: string;
  /** Anchor / route the link points to. */
  href: string;
}

export interface NavbarProps {
  /** Brand wordmark shown next to the `~<` logomark. */
  brand?: string;
  /** Primary navigation links. */
  links?: NavLink[];
  /** CTA button label. */
  ctaLabel?: string;
  /** CTA button href. */
  ctaHref?: string;
  /** Secondary (text) link shown before the CTA on desktop, e.g. "Sign in". */
  secondaryLabel?: string;
  /** Secondary link href. */
  secondaryHref?: string;
}

const DEFAULT_LINKS: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
];

/** The `~<` logomark — a tilde swell fused with a code angle-bracket. */
function Logomark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-9 w-9 place-items-center rounded-xl bg-[#0E3A40] font-mono text-lg font-bold leading-none text-[#F2EBDD] ${className}`}
    >
      ~&lt;
    </span>
  );
}

export default function Navbar({
  brand = "saltycodestudio",
  links = DEFAULT_LINKS,
  ctaLabel = "Start a project",
  ctaHref = "#contact",
  secondaryLabel = "Sign in",
  secondaryHref = "#signin",
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Subtle elevation once the page scrolls past the hero edge.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape while the mobile sheet is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-[#0E3A40]/10 bg-[#F2EBDD]/85 backdrop-blur-md"
          : "border-transparent bg-[#F2EBDD]"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8"
      >
        {/* Brand */}
        <a
          href="#top"
          className="group flex shrink-0 items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F59] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2EBDD]"
        >
          <Logomark className="transition-transform duration-300 group-hover:-rotate-6" />
          <span className="font-[var(--scs-display,'Space_Grotesk',system-ui,sans-serif)] text-lg font-bold tracking-tight text-[#0E3A40]">
            {brand}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative rounded-lg px-3 py-2 text-sm font-medium text-[#1C2B2E]/80 transition-colors hover:text-[#0E3A40] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F59] after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[#FF6F59] after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <a
            href={secondaryHref}
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#1C2B2E]/80 transition-colors hover:text-[#0E3A40] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F59]"
          >
            {secondaryLabel}
          </a>
          <a
            href={ctaHref}
            className="rounded-xl bg-[#FF6F59] px-4 py-2 text-sm font-semibold text-[#1C2B2E] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#FF6F59]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F59] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2EBDD]"
          >
            {ctaLabel}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="scs-mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative grid h-10 w-10 place-items-center rounded-xl text-[#0E3A40] transition-colors hover:bg-[#0E3A40]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F59] md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="block h-4 w-5">
            <span
              className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile sheet */}
      <div
        id="scs-mobile-menu"
        className={`md:hidden ${open ? "block" : "hidden"}`}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 top-16 z-40 cursor-default bg-[#1C2B2E]/20 backdrop-blur-sm"
        />
        <div className="relative z-50 border-t border-[#0E3A40]/10 bg-[#F2EBDD] px-5 pb-6 pt-2 shadow-lg shadow-[#1C2B2E]/5">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-[#0E3A40]/10 py-3 text-base font-medium text-[#0E3A40] transition-colors hover:text-[#FF6F59] focus:outline-none focus-visible:text-[#FF6F59]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3">
            <a
              href={secondaryHref}
              onClick={() => setOpen(false)}
              className="rounded-xl border border-[#0E3A40]/15 px-4 py-3 text-center text-sm font-semibold text-[#0E3A40] transition-colors hover:bg-[#0E3A40]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F59]"
            >
              {secondaryLabel}
            </a>
            <a
              href={ctaHref}
              onClick={() => setOpen(false)}
              className="rounded-xl bg-[#FF6F59] px-4 py-3 text-center text-sm font-semibold text-[#1C2B2E] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#FF6F59]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6F59]"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

import { useState } from "react";

export interface FooterLink {
  /** Visible link text. */
  label: string;
  /** Link target. */
  href: string;
}

export interface FooterLinkGroup {
  /** Column heading (e.g. "Studio", "Work"). */
  title: string;
  /** Links rendered under the heading. */
  links: FooterLink[];
}

export interface FooterSocial {
  /** Accessible label (e.g. "GitHub"). */
  label: string;
  /** Profile URL. */
  href: string;
  /** Which built-in glyph to render. */
  icon: "github" | "x" | "linkedin" | "instagram" | "dribbble" | "rss";
}

export interface FooterProps {
  /** Studio / product name shown in the brand block. */
  brand?: string;
  /** Logomark text or short symbol (defaults to the saltycodestudio "~<"). */
  mark?: string;
  /** One-line studio pitch under the wordmark. */
  blurb?: string;
  /** Column heading above the newsletter input. */
  newsletterTitle?: string;
  /** Supporting line above the newsletter input. */
  newsletterCopy?: string;
  /** Placeholder for the email field. */
  newsletterPlaceholder?: string;
  /** Reassurance line under the newsletter input. */
  newsletterFootnote?: string;
  /** Called with the submitted email. If omitted, the form shows a local "subscribed" state. */
  onSubscribe?: (email: string) => void;
  /** The link columns. */
  groups?: FooterLinkGroup[];
  /** Social profiles rendered as icon buttons. */
  socials?: FooterSocial[];
  /** Copyright owner (year is prefixed automatically). */
  copyrightName?: string;
  /** Legal / utility links in the bottom row. */
  legalLinks?: FooterLink[];
  /** Small line shown at the very bottom-right (e.g. location + status). */
  signoff?: string;
  /** Accessible label for the contentinfo landmark. */
  ariaLabel?: string;
}

const defaultGroups: FooterLinkGroup[] = [
  {
    title: "Studio",
    links: [
      { label: "Work", href: "#work" },
      { label: "Services", href: "#services" },
      { label: "About", href: "#about" },
      { label: "Journal", href: "#journal" },
    ],
  },
  {
    title: "Build with us",
    links: [
      { label: "Web design", href: "#web-design" },
      { label: "Frontend dev", href: "#frontend" },
      { label: "Brand systems", href: "#brand" },
      { label: "Care plans", href: "#care" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Parts library", href: "#parts" },
      { label: "Starters", href: "#starters" },
      { label: "Pricing", href: "#pricing" },
      { label: "Status", href: "#status" },
    ],
  },
];

const defaultSocials: FooterSocial[] = [
  { label: "GitHub", href: "#github", icon: "github" },
  { label: "X", href: "#x", icon: "x" },
  { label: "Dribbble", href: "#dribbble", icon: "dribbble" },
  { label: "LinkedIn", href: "#linkedin", icon: "linkedin" },
];

const defaultLegal: FooterLink[] = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Cookies", href: "#cookies" },
];

function SocialIcon({ icon }: { icon: FooterSocial["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    className: "h-4.5 w-4.5",
    fill: "currentColor",
  } as const;
  switch (icon) {
    case "github":
      return (
        <svg {...common}>
          <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.05.78 2.12v3.14c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.81-5.96 6.81H1.69l7.73-8.84L1.26 2.25h6.82l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.15 0-3.52.01-4.76.07-1.15.05-1.77.24-2.19.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.42-.35 1.04-.4 2.19-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.15.24 1.77.4 2.19.22.55.47.94.88 1.35.41.41.8.66 1.35.88.42.16 1.04.35 2.19.4 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.15-.05 1.77-.24 2.19-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.42.35-1.04.4-2.19.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.15-.24-1.77-.4-2.19a3.64 3.64 0 0 0-.88-1.35 3.64 3.64 0 0 0-1.35-.88c-.42-.16-1.04-.35-2.19-.4-1.24-.06-1.61-.07-4.76-.07Zm0 2.76a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6Zm0 1.62a3.68 3.68 0 1 0 0 7.36 3.68 3.68 0 0 0 0-7.36Zm5.48-2.86a1.24 1.24 0 1 1 0 2.48 1.24 1.24 0 0 1 0-2.48Z" />
        </svg>
      );
    case "dribbble":
      return (
        <svg {...common}>
          <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm7.93 5.53a10.18 10.18 0 0 1 2.3 6.37c-.34-.07-3.72-.76-7.13-.33-.07-.17-.14-.35-.22-.53-.21-.5-.45-1-.69-1.49 3.78-1.54 5.5-3.76 5.74-4.02ZM12 1.79c2.55 0 4.88.96 6.65 2.53-.2.28-1.75 2.36-5.4 3.73a52.4 52.4 0 0 0-3.78-5.9A10.3 10.3 0 0 1 12 1.79Zm-4.5.95a62 62 0 0 1 3.74 5.83c-4.72 1.26-8.89 1.24-9.34 1.23A10.25 10.25 0 0 1 7.5 2.74ZM1.81 12.02v-.32c.43.01 5.33.07 10.37-1.44.29.56.56 1.14.81 1.71l-.4.12c-5.2 1.68-7.97 6.27-8.2 6.66A10.2 10.2 0 0 1 1.8 12.02Zm10.19 10.2a10.2 10.2 0 0 1-6.29-2.16c.18-.37 2.2-4.26 7.9-6.25l.06-.02a42.6 42.6 0 0 1 2.2 7.8 10.13 10.13 0 0 1-3.87.63Zm5.62-1.59a44 44 0 0 0-2-7.44c3.21-.51 6.02.33 6.37.44a10.22 10.22 0 0 1-4.37 7Z" />
        </svg>
      );
    case "rss":
      return (
        <svg {...common}>
          <path d="M4 11a9 9 0 0 1 9 9h-2.5A6.5 6.5 0 0 0 4 13.5V11Zm0-5a14 14 0 0 1 14 14h-2.5A11.5 11.5 0 0 0 4 8.5V6Zm1.75 10.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Z" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Footer — a rich multi-column footer for the saltycodestudio "Sand & Surf"
 * system: a brand block with newsletter signup, two or more link columns,
 * social icon buttons, and a legal/sign-off bottom row on a deep-teal canvas.
 * React + Tailwind.
 */
export default function Footer({
  brand = "saltycodestudio",
  mark = "~<",
  blurb = "Clean code, warm coast. A small studio shipping considered software — fast sites, honest builds, and interfaces that feel handmade.",
  newsletterTitle = "Notes from the shore",
  newsletterCopy = "Occasional field notes on building for the web. No spam, no growth hacks.",
  newsletterPlaceholder = "you@studio.com",
  newsletterFootnote = "One short email a month. Unsubscribe anytime.",
  onSubscribe,
  groups = defaultGroups,
  socials = defaultSocials,
  copyrightName = "saltycodestudio",
  legalLinks = defaultLegal,
  signoff = "Built on island time in Bonaire, shipped on internet time.",
  ariaLabel = "Site footer",
}: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;
    if (onSubscribe) {
      onSubscribe(value);
    } else {
      setSubscribed(true);
    }
    setEmail("");
  }

  return (
    <footer
      aria-label={ariaLabel}
      className="relative isolate overflow-hidden bg-[#0E3A40] text-[#F2EBDD]"
    >
      {/* Canvas + soft glows */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0E3A40] to-[#0B2D32]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-0 -z-10 h-72 w-72 rounded-full bg-[#4FA8C9]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 right-10 -z-10 h-80 w-80 rounded-full bg-[#FF6F59]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#4FA8C9]/40 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 sm:pt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand + newsletter */}
          <div className="lg:col-span-5">
            <a
              href="#top"
              className="inline-flex items-center gap-2.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4FA8C9]"
            >
              <span
                aria-hidden="true"
                className="font-[var(--font-mono,inherit)] text-2xl font-medium text-[#FF6F59]"
              >
                {mark}
              </span>
              <span className="font-[var(--font-display,inherit)] text-lg font-semibold tracking-tight text-[#F2EBDD]">
                {brand}
              </span>
            </a>

            {blurb ? (
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#F2EBDD]/70">
                {blurb}
              </p>
            ) : null}

            <div className="mt-8 max-w-sm">
              {newsletterTitle ? (
                <h2 className="font-[var(--font-display,inherit)] text-base font-semibold text-[#F2EBDD]">
                  {newsletterTitle}
                </h2>
              ) : null}
              {newsletterCopy ? (
                <p className="mt-2 text-sm leading-relaxed text-[#F2EBDD]/65">
                  {newsletterCopy}
                </p>
              ) : null}

              {subscribed ? (
                <p
                  role="status"
                  className="mt-4 flex items-center gap-2 rounded-xl border border-[#4FA8C9]/30 bg-[#4FA8C9]/10 px-4 py-3 text-sm text-[#F2EBDD]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4 text-[#4FA8C9]"
                  >
                    <path
                      d="m5 10.5 3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  You&apos;re on the list. Watch your inbox.
                </p>
              ) : (
                <form
                  className="mt-4"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <label htmlFor="footer-newsletter" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="footer-newsletter"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={newsletterPlaceholder}
                      className="w-full rounded-full border border-[#F2EBDD]/20 bg-[#F2EBDD]/5 px-5 py-3 text-sm text-[#F2EBDD] placeholder:text-[#F2EBDD]/40 transition-colors focus:border-[#4FA8C9]/60 focus:outline-none focus:ring-2 focus:ring-[#4FA8C9]/30"
                    />
                    <button
                      type="submit"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#FF6F59] px-6 py-3 text-sm font-semibold text-[#1C2B2E] shadow-lg shadow-[#FF6F59]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ff8068] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6F59]"
                    >
                      Subscribe
                    </button>
                  </div>
                  {newsletterFootnote ? (
                    <p className="mt-3 text-xs text-[#F2EBDD]/45">
                      {newsletterFootnote}
                    </p>
                  ) : null}
                </form>
              )}
            </div>
          </div>

          {/* Link columns */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:gap-10"
          >
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="font-[var(--font-mono,inherit)] text-xs font-medium uppercase tracking-[0.18em] text-[#4FA8C9]">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-[#F2EBDD]/75 transition-colors hover:text-[#F2EBDD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4FA8C9]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="mt-14 h-px w-full bg-[#F2EBDD]/10"
        />

        {/* Legal row */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-sm text-[#F2EBDD]/55">
              © {year} {copyrightName}. All rights reserved.
            </p>
            {legalLinks.length > 0 ? (
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#F2EBDD]/55 transition-colors hover:text-[#F2EBDD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4FA8C9]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {socials.length > 0 ? (
            <ul className="flex items-center gap-2.5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#F2EBDD]/15 text-[#F2EBDD]/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4FA8C9]/50 hover:text-[#4FA8C9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4FA8C9]"
                  >
                    <SocialIcon icon={social.icon} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {signoff ? (
          <p className="mt-8 font-[var(--font-mono,inherit)] text-xs text-[#F2EBDD]/35">
            {signoff}
          </p>
        ) : null}
      </div>
    </footer>
  );
}

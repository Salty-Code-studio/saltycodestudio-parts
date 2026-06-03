import React from "react";

/**
 * Logo Cloud — "Trusted by" logo strip
 * Brand palette: Sand & Surf
 *   sand/cream  #fbf7f0 #f4ece0 #ece0cd
 *   ink         #1c2b33 / soft #4a5d66
 *   ocean       teal #1f8a8a / deep #0f5c5c / surf #2ec3c3
 *
 * Each logo renders desaturated (grayscale + dimmed) and animates to full
 * color on hover/focus, giving a quiet, premium social-proof strip.
 */

export type Logo = {
  /** Accessible brand name — used for aria-label / alt text. */
  name: string;
  /** Logo image source (SVG strongly recommended). Optional if `svg` is provided. */
  src?: string;
  /**
   * Inline SVG markup as a string, used when you'd rather not host a file.
   *
   * ⚠️ SECURITY — TRUSTED MARKUP ONLY. This string is injected verbatim via
   * `dangerouslySetInnerHTML`. ONLY pass static, hardcoded markup that YOU
   * authored. NEVER pass SVG that originates from a user, an API, a CMS, or any
   * other untrusted source — raw SVG can carry `<script>` / event handlers and
   * is a direct XSS vector. If the markup is not 100% under your control,
   * sanitize it first (e.g. DOMPurify) before passing it here.
   */
  svg?: string;
  /** Optional outbound link to the brand. */
  href?: string;
};

export type LogoCloudProps = {
  /** Small heading above the strip. */
  eyebrow?: string;
  /** Optional supporting line under the eyebrow. */
  subtext?: string;
  /** The brand marks to display. */
  logos?: Logo[];
  /** Visually center the eyebrow + strip. Defaults to true. */
  centered?: boolean;
  /** Extra classes for the outer <section>. */
  className?: string;
};

/* Realistic placeholder marks — clean monochrome wordmarks/glyphs that read
   well at small sizes and inherit currentColor so the grayscale→color hover
   works for both <img> sources and inline SVG. */
const defaultLogos: Logo[] = [
  {
    name: "Tide & Co",
    href: "#",
    svg: `<svg viewBox="0 0 132 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto" aria-hidden="true">
      <path d="M8 6h16M16 6v20" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M30 26c4-3 6-9 6-13M30 26c-1-5 1-10 4-13" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
      <text x="46" y="22" font-family="ui-sans-serif,system-ui,sans-serif" font-size="16" font-weight="700" letter-spacing="-0.02em" fill="currentColor">Tide &amp; Co</text>
    </svg>`,
  },
  {
    name: "Saltbox Labs",
    href: "#",
    svg: `<svg viewBox="0 0 150 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto" aria-hidden="true">
      <rect x="6" y="8" width="16" height="16" rx="3" stroke="currentColor" stroke-width="2.4"/>
      <path d="M6 13h16" stroke="currentColor" stroke-width="2.4"/>
      <text x="30" y="22" font-family="ui-sans-serif,system-ui,sans-serif" font-size="16" font-weight="700" letter-spacing="-0.02em" fill="currentColor">Saltbox Labs</text>
    </svg>`,
  },
  {
    name: "Harbor UI",
    href: "#",
    svg: `<svg viewBox="0 0 132 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto" aria-hidden="true">
      <circle cx="15" cy="16" r="9" stroke="currentColor" stroke-width="2.4"/>
      <circle cx="15" cy="16" r="3" fill="currentColor"/>
      <text x="32" y="22" font-family="ui-sans-serif,system-ui,sans-serif" font-size="16" font-weight="700" letter-spacing="-0.02em" fill="currentColor">Harbor UI</text>
    </svg>`,
  },
  {
    name: "Driftwood",
    href: "#",
    svg: `<svg viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto" aria-hidden="true">
      <path d="M8 22c3-2 5-6 5-10M13 12c3 1 5 5 5 10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
      <text x="26" y="22" font-family="ui-sans-serif,system-ui,sans-serif" font-size="16" font-weight="700" letter-spacing="-0.02em" fill="currentColor">Driftwood</text>
    </svg>`,
  },
  {
    name: "Coastline AI",
    href: "#",
    svg: `<svg viewBox="0 0 150 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto" aria-hidden="true">
      <path d="M6 20c3 0 4-3 7-3s4 3 7 3 4-3 6-3" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
      <text x="34" y="22" font-family="ui-sans-serif,system-ui,sans-serif" font-size="16" font-weight="700" letter-spacing="-0.02em" fill="currentColor">Coastline AI</text>
    </svg>`,
  },
  {
    name: "Marigold",
    href: "#",
    svg: `<svg viewBox="0 0 138 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-auto" aria-hidden="true">
      <path d="M15 7v4M15 21v4M7 16h4M19 16h4M9.5 10.5l2.8 2.8M17.7 18.7l2.8 2.8M20.5 10.5l-2.8 2.8M12.3 18.7l-2.8 2.8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="15" cy="16" r="3" fill="currentColor"/>
      <text x="32" y="22" font-family="ui-sans-serif,system-ui,sans-serif" font-size="16" font-weight="700" letter-spacing="-0.02em" fill="currentColor">Marigold</text>
    </svg>`,
  },
];

function LogoMark({ logo }: { logo: Logo }) {
  if (logo.svg) {
    return (
      <span
        className="block text-[#1c2b33]"
        // ⚠️ XSS WARNING: `logo.svg` is injected as raw HTML. This is ONLY safe
        // because the defaults above are static, hardcoded markup you control
        // (and inline SVG inherits currentColor). NEVER feed user/API/CMS-supplied
        // SVG into this prop without sanitizing it first (e.g. DOMPurify) — raw
        // SVG can carry <script>/event handlers and execute as an XSS payload.
        dangerouslySetInnerHTML={{ __html: logo.svg }}
      />
    );
  }
  return (
    <img
      src={logo.src}
      alt={logo.name}
      loading="lazy"
      decoding="async"
      className="h-7 w-auto"
    />
  );
}

export default function LogoCloud({
  eyebrow = "Trusted by teams shipping on the coast",
  subtext = "From seed-stage studios to established product crews — built and maintained by saltycodestudio.",
  logos = defaultLogos,
  centered = true,
  className = "",
}: LogoCloudProps) {
  return (
    <section
      aria-labelledby="logo-cloud-heading"
      className={`bg-[#fbf7f0] py-16 sm:py-20 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className={centered ? "text-center" : "text-left"}>
          <h2
            id="logo-cloud-heading"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f5c5c]"
          >
            {eyebrow}
          </h2>
          {subtext ? (
            <p
              className={`mt-3 text-sm text-[#4a5d66] sm:text-base ${
                centered ? "mx-auto max-w-2xl" : "max-w-2xl"
              }`}
            >
              {subtext}
            </p>
          ) : null}
        </div>

        <ul
          role="list"
          className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:mt-12 sm:grid-cols-3 lg:grid-cols-6"
        >
          {logos.map((logo) => {
            const Inner = (
              <span className="group/logo inline-flex h-10 w-full items-center justify-center text-[#1c2b33] opacity-60 grayscale transition-all duration-300 ease-out hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0 motion-reduce:transition-none">
                <LogoMark logo={logo} />
              </span>
            );

            return (
              <li key={logo.name} className="flex items-center justify-center">
                {logo.href ? (
                  <a
                    href={logo.href}
                    aria-label={logo.name}
                    className="block w-full rounded-md outline-none ring-offset-2 ring-offset-[#fbf7f0] focus-visible:ring-2 focus-visible:ring-[#2ec3c3]"
                  >
                    {Inner}
                  </a>
                ) : (
                  <span aria-label={logo.name} className="block w-full">
                    {Inner}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

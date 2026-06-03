import type { FC } from "react";

/**
 * Testimonials — saltycodestudio "Sand & Surf"
 * Responsive grid of testimonial cards: avatar, quote, name, role.
 */

export interface Testimonial {
  /** The quote body. Keep it to 2–4 sentences for a balanced card. */
  quote: string;
  /** Person's full name. */
  name: string;
  /** Role + company, e.g. "Founder, Tidepool". */
  role: string;
  /** Avatar image URL. Falls back to a colored monogram if omitted. */
  avatar?: string;
  /** Star rating out of 5. Omit to hide the rating row. */
  rating?: number;
}

export interface TestimonialsProps {
  /** Small mono eyebrow above the heading. */
  eyebrow?: string;
  /** Section heading. */
  heading?: string;
  /** Supporting line under the heading. */
  subheading?: string;
  /** The testimonials to render. */
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    quote:
      "They shipped our marketing site in three weeks and it loads faster than anything we'd ever had. No drama, no buzzwords — just clean work and straight answers.",
    name: "Marisol Ferreira",
    role: "Founder, Tidepool Labs",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=240&h=240&auto=format&fit=crop&crop=faces",
  },
  {
    quote:
      "I came in with a half-baked Figma file and left with a real product. The codebase is so tidy our new engineer was committing on day one.",
    name: "Daniel Okonkwo",
    role: "CTO, Reefline",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=240&h=240&auto=format&fit=crop&crop=faces",
  },
  {
    quote:
      "Most studios disappear after launch. These folks stuck around, watched the analytics with us, and quietly fixed things before I even noticed.",
    name: "Priya Nair",
    role: "Head of Growth, Saltwater",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=240&h=240&auto=format&fit=crop&crop=faces",
  },
  {
    quote:
      "Our conversion rate climbed 38% after the rebuild. Same traffic, better site. That's the whole story.",
    name: "Tomás Vega",
    role: "Owner, Driftwood Coffee",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=240&h=240&auto=format&fit=crop&crop=faces",
  },
  {
    quote:
      "They translated a gnarly internal tool into something my whole team actually wants to use. Calm, fast, well-documented.",
    name: "Hannah Bergström",
    role: "Ops Lead, Harborwave",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=240&h=240&auto=format&fit=crop&crop=faces",
  },
  {
    quote:
      "Working with a small studio felt risky on paper. In practice it was the most senior team I've ever hired. Worth every cent.",
    name: "Wesley Carter",
    role: "VP Product, Lagoon Health",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=240&h=240&auto=format&fit=crop&crop=faces",
  },
];

/** Deterministic warm-tone monogram background for avatar fallbacks. */
const monogramTones = ["#0E3A40", "#4FA8C9", "#FF6F59"];

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

const Stars: FC<{ rating: number }> = ({ rating }) => {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${full} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 ${i < full ? "text-[#FF6F59]" : "text-[#0E3A40]/15"}`}
          fill="currentColor"
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.78l-5.2 2.74.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
};

const Card: FC<{ t: Testimonial; index: number }> = ({ t, index }) => (
  <figure className="group flex h-full flex-col rounded-2xl border border-[#0E3A40]/10 bg-[#FBF7EF] p-7 shadow-[0_1px_0_rgba(14,58,64,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0E3A40]/20 hover:shadow-[0_18px_40px_-22px_rgba(14,58,64,0.45)]">
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-7 w-7 text-[#4FA8C9]"
      fill="currentColor"
    >
      <path d="M13.5 8c-3.6 1.4-6 4.7-6 8.6V24h8v-8H10c0-2.4 1.6-4.3 3.9-5L13.5 8zm12 0c-3.6 1.4-6 4.7-6 8.6V24h8v-8h-5.5c0-2.4 1.6-4.3 3.9-5L25.5 8z" />
    </svg>

    <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-[#1C2B2E]/90">
      <p>{t.quote}</p>
    </blockquote>

    {typeof t.rating === "number" && (
      <div className="mt-5">
        <Stars rating={t.rating} />
      </div>
    )}

    <figcaption className="mt-5 flex items-center gap-3 border-t border-[#0E3A40]/10 pt-5">
      {t.avatar ? (
        <img
          src={t.avatar}
          alt=""
          loading="lazy"
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[#F2EBDD]"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-[#F2EBDD] ring-2 ring-[#F2EBDD]"
          style={{ backgroundColor: monogramTones[index % monogramTones.length] }}
        >
          {initials(t.name)}
        </span>
      )}
      <div className="min-w-0">
        <div className="truncate font-display font-semibold text-[#0E3A40]">
          {t.name}
        </div>
        <div className="truncate text-sm text-[#1C2B2E]/60">{t.role}</div>
      </div>
    </figcaption>
  </figure>
);

const Testimonials: FC<TestimonialsProps> = ({
  eyebrow = "Kind words",
  heading = "Teams that ship with us",
  subheading = "We keep client relationships the way we keep our codebases — clean, honest, and built to last.",
  testimonials = defaultTestimonials,
}) => {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-[#F2EBDD] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF6F59]">
              {eyebrow}
            </p>
          )}
          <h2
            id="testimonials-heading"
            className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0E3A40] sm:text-4xl"
          >
            {heading}
          </h2>
          {subheading && (
            <p className="mt-4 text-base leading-relaxed text-[#1C2B2E]/70">
              {subheading}
            </p>
          )}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card key={`${t.name}-${i}`} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

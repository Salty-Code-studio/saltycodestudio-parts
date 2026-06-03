import React from "react";

/**
 * BlogGrid — a responsive grid of blog post cards. Each card pairs a cover
 * image, a category tag, a title, an excerpt, and author/date/read-time meta.
 * Brand palette "Sand & Surf".
 */

export type BlogPost = {
  /** Unique key for the post */
  id: string;
  /** Article title (rendered as the card heading + link) */
  title: string;
  /** One- or two-sentence summary shown under the title */
  excerpt: string;
  /** Category / topic label shown as a pill over the cover image */
  category: string;
  /** Link to the full article */
  href: string;
  /** Author name shown in the meta row */
  author: string;
  /** Human-readable publish date, e.g. "May 28, 2026" */
  date: string;
  /** Machine-readable date for the <time> element, e.g. "2026-05-28" */
  dateTime?: string;
  /** Estimated read time, e.g. "6 min read" */
  readTime?: string;
  /** Cover image URL. If omitted, a branded gradient placeholder is used. */
  coverImage?: string;
  /** Alt text for the cover image (decorative gradients use "") */
  coverAlt?: string;
};

export type BlogGridProps = {
  /** Small eyebrow label above the heading */
  eyebrow?: string;
  /** Section heading */
  heading?: string;
  /** Supporting paragraph under the heading */
  intro?: string;
  /** Label for the "view all" link in the header */
  viewAllLabel?: string;
  /** Href for the "view all" link */
  viewAllHref?: string;
  /** Posts to render */
  posts?: BlogPost[];
  /** Accessible label for the section landmark */
  ariaLabel?: string;
};

const defaultPosts: BlogPost[] = [
  {
    id: "ship-without-rewrite",
    title: "How we ship a marketing site without a six-month rewrite",
    excerpt:
      "A look at the tight, visible sprint cadence we use to get clients a live staging link in week one — and why owning your own code matters.",
    category: "Process",
    href: "#article-ship-without-rewrite",
    author: "Mona Chayo",
    date: "May 28, 2026",
    dateTime: "2026-05-28",
    readTime: "6 min read",
    coverAlt: "",
  },
  {
    id: "tailwind-tokens",
    title: "Design tokens in Tailwind that survive a rebrand",
    excerpt:
      "When a brand renames itself mid-build, hard-coded hex values become a liability. Here is the token layer we wish every project started with.",
    category: "Engineering",
    href: "#article-tailwind-tokens",
    author: "Mona Chayo",
    date: "May 14, 2026",
    dateTime: "2026-05-14",
    readTime: "9 min read",
    coverAlt: "",
  },
  {
    id: "accessible-by-default",
    title: "Accessible by default: the checklist we run before launch",
    excerpt:
      "Focus states, contrast ratios, and real keyboard paths are not extras. This is the pre-flight list that keeps every visitor in the door.",
    category: "Accessibility",
    href: "#article-accessible-by-default",
    author: "Sterre de Wit",
    date: "April 30, 2026",
    dateTime: "2026-04-30",
    readTime: "5 min read",
    coverAlt: "",
  },
  {
    id: "cms-clients-can-run",
    title: "Building a CMS your client's team can actually run",
    excerpt:
      "Hand-off is where most projects quietly fail. We share the content model and editor guardrails that keep non-technical teams confident.",
    category: "Product",
    href: "#article-cms-clients-can-run",
    author: "Mona Chayo",
    date: "April 18, 2026",
    dateTime: "2026-04-18",
    readTime: "7 min read",
    coverAlt: "",
  },
  {
    id: "core-web-vitals",
    title: "Chasing Core Web Vitals without chasing your tail",
    excerpt:
      "A pragmatic guide to LCP, CLS, and INP for small teams — what to measure, what to ignore, and the three fixes that move the needle most.",
    category: "Performance",
    href: "#article-core-web-vitals",
    author: "Sterre de Wit",
    date: "April 2, 2026",
    dateTime: "2026-04-02",
    readTime: "8 min read",
    coverAlt: "",
  },
  {
    id: "scope-without-friction",
    title: "Pricing a build so scope changes don't end the relationship",
    excerpt:
      "Fixed bids fight the work; pure hourly scares clients. Here is the milestone-based model we use to keep trust and momentum intact.",
    category: "Studio",
    href: "#article-scope-without-friction",
    author: "Mona Chayo",
    date: "March 21, 2026",
    dateTime: "2026-03-21",
    readTime: "6 min read",
    coverAlt: "",
  },
];

/** Deterministic gradient pairs so each placeholder cover feels distinct but on-brand. */
const gradientPairs: Array<[string, string]> = [
  ["#1f8a8a", "#0f5c5c"],
  ["#2ec3c3", "#1f8a8a"],
  ["#0f5c5c", "#1c2b33"],
  ["#1f8a8a", "#2ec3c3"],
  ["#0f5c5c", "#1f8a8a"],
  ["#1c2b33", "#0f5c5c"],
];

function CoverPlaceholder({ index }: { index: number }) {
  const [from, to] = gradientPairs[index % gradientPairs.length];
  const gid = `blog-cover-${index}`;
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 480 300"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="480" height="300" fill={`url(#${gid})`} />
      <g fill="none" stroke="rgba(244,236,224,0.30)" strokeWidth="1.5">
        <circle cx="380" cy="70" r="120" />
        <circle cx="380" cy="70" r="76" />
        <circle cx="380" cy="70" r="34" />
      </g>
      <text
        x="36"
        y="250"
        fill="rgba(244,236,224,0.92)"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="34"
        fontWeight="700"
        letterSpacing="-1"
      >
        ~&lt;
      </text>
    </svg>
  );
}

export default function BlogGrid({
  eyebrow = "From the journal",
  heading = "Notes from the studio",
  intro = "Field notes on shipping fast, building accessible interfaces, and handing off work clients can actually run.",
  viewAllLabel = "View all posts",
  viewAllHref = "#blog",
  posts = defaultPosts,
  ariaLabel = "Latest blog posts",
}: BlogGridProps) {
  return (
    <section aria-label={ariaLabel} className="bg-[#fbf7f0] py-20 text-[#1c2b33] sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1f8a8a]">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#4a5d66]">{intro}</p>
          </div>
          {viewAllLabel ? (
            <a
              href={viewAllHref}
              className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#0f5c5c]/30 px-4 py-2.5 text-sm font-semibold text-[#0f5c5c] transition hover:border-[#0f5c5c] hover:bg-[#0f5c5c] hover:text-[#f4ece0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f8a8a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf7f0]"
            >
              {viewAllLabel}
              <svg
                className="h-4 w-4 transition group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </a>
          ) : null}
        </div>

        {/* Grid */}
        <ul role="list" className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <li key={post.id} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#ece0cd] bg-[#f4ece0]/50 transition duration-200 hover:-translate-y-1 hover:border-[#2ec3c3]/50 hover:bg-white hover:shadow-[0_20px_44px_-24px_rgba(15,92,92,0.5)] focus-within:-translate-y-1 focus-within:border-[#2ec3c3]/50">
                {/* Cover */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0f5c5c]">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.coverAlt ?? ""}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full transition duration-300 group-hover:scale-[1.03]">
                      <CoverPlaceholder index={i} />
                    </div>
                  )}
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[#fbf7f0]/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0f5c5c] shadow-sm backdrop-blur">
                    {post.category}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-[#1c2b33]">
                    <a
                      href={post.href}
                      className="transition before:absolute before:inset-0 hover:text-[#0f5c5c] focus:outline-none focus-visible:underline focus-visible:decoration-[#1f8a8a] focus-visible:underline-offset-4"
                    >
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#4a5d66]">{post.excerpt}</p>

                  {/* Meta */}
                  <div className="mt-5 flex items-center gap-3 border-t border-[#ece0cd] pt-4 text-sm text-[#4a5d66]">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f5c5c] text-xs font-bold uppercase text-[#f4ece0]"
                    >
                      {initials(post.author)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#1c2b33]">{post.author}</p>
                      <p className="truncate text-[13px]">
                        <time dateTime={post.dateTime ?? undefined}>{post.date}</time>
                        {post.readTime ? (
                          <>
                            <span aria-hidden="true"> &middot; </span>
                            {post.readTime}
                          </>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

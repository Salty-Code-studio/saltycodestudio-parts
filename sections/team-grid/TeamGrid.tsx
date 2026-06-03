import React, { type FC } from "react";

export interface TeamSocial {
  /** Network key used to render the right icon + accessible label. */
  network: "x" | "linkedin" | "github" | "dribbble" | "email" | "website";
  /** href for the link (e.g. "https://x.com/handle" or "mailto:name@studio.com"). */
  href: string;
}

export interface TeamMember {
  /** Full name shown under the photo. */
  name: string;
  /** Role / title shown under the name. */
  role: string;
  /** One-line bio (optional). */
  bio?: string;
  /** Square-ish portrait URL. Falls back to a tasteful monogram when omitted. */
  photo?: string;
  /** Social / contact links rendered as a row of icon buttons. */
  socials?: TeamSocial[];
}

export interface TeamGridProps {
  /** Small eyebrow/kicker above the heading. */
  eyebrow?: string;
  /** Main heading for the section. */
  heading?: string;
  /** Supporting sentence under the heading. */
  description?: string;
  /** The people to display (3, 4, or a multiple is recommended). */
  members?: TeamMember[];
}

const defaultMembers: TeamMember[] = [
  {
    name: "Marisol Ferreira",
    role: "Founder & Lead Engineer",
    bio: "Turns fuzzy ideas into fast, durable codebases. Owns architecture and the shipping log.",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=480&h=560&auto=format&fit=crop&crop=faces",
    socials: [
      { network: "linkedin", href: "https://www.linkedin.com/" },
      { network: "github", href: "https://github.com/" },
      { network: "email", href: "mailto:marisol@saltycodestudio.com" },
    ],
  },
  {
    name: "Daniel Okonkwo",
    role: "Design Director",
    bio: "Sets the visual language. Lives where typography, motion, and accessibility meet.",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=480&h=560&auto=format&fit=crop&crop=faces",
    socials: [
      { network: "dribbble", href: "https://dribbble.com/" },
      { network: "x", href: "https://x.com/" },
      { network: "linkedin", href: "https://www.linkedin.com/" },
    ],
  },
  {
    name: "Priya Nair",
    role: "Frontend Engineer",
    bio: "Ships pixel-honest interfaces that stay fast on a real-world 4G connection.",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=480&h=560&auto=format&fit=crop&crop=faces",
    socials: [
      { network: "github", href: "https://github.com/" },
      { network: "website", href: "https://example.com/" },
      { network: "linkedin", href: "https://www.linkedin.com/" },
    ],
  },
  {
    name: "Tomás Vega",
    role: "Product Strategist",
    bio: "Keeps every build pointed at outcomes — fewer features, more conversions.",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=480&h=560&auto=format&fit=crop&crop=faces",
    socials: [
      { network: "linkedin", href: "https://www.linkedin.com/" },
      { network: "x", href: "https://x.com/" },
      { network: "email", href: "mailto:tomas@saltycodestudio.com" },
    ],
  },
];

/** Deterministic warm-tone monogram background for photo fallbacks. */
const monogramTones = ["#0E3A40", "#4FA8C9", "#FF6F59"];

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const socialMeta: Record<
  TeamSocial["network"],
  { label: string; path: React.ReactNode }
> = {
  x: {
    label: "X (Twitter)",
    path: (
      <path d="M13.682 10.62 19.773 3.5h-1.443l-5.29 6.18-4.225-6.18H3.5l6.387 9.343L3.5 20.5h1.443l5.585-6.526L15.18 20.5h4.815l-6.625-9.88h.001Zm-1.977 2.31-.647-.927L5.463 4.59h2.216l4.156 5.948.647.927 5.404 7.73h-2.216l-4.408-6.31-.001-.001Z" />
    ),
  },
  linkedin: {
    label: "LinkedIn",
    path: (
      <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.3 8.4h3.27V20.5H3.3V8.4Zm5.32 0h3.13v1.65h.05c.44-.83 1.5-1.7 3.08-1.7 3.3 0 3.91 2.17 3.91 4.99V20.5h-3.27v-5.36c0-1.28-.02-2.93-1.78-2.93-1.79 0-2.06 1.4-2.06 2.84V20.5H8.62V8.4Z" />
    ),
  },
  github: {
    label: "GitHub",
    path: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.48.09.65-.21.65-.46v-1.6c-2.64.58-3.2-1.27-3.2-1.27-.43-1.1-1.05-1.4-1.05-1.4-.86-.59.06-.58.06-.58.95.07 1.45.98 1.45.98.85 1.45 2.22 1.03 2.76.79.09-.62.33-1.03.6-1.27-2.11-.24-4.33-1.05-4.33-4.69 0-1.04.37-1.88.98-2.55-.1-.24-.42-1.21.09-2.52 0 0 .8-.26 2.62.98a9.1 9.1 0 0 1 4.78 0c1.82-1.24 2.62-.98 2.62-.98.51 1.31.19 2.28.09 2.52.61.67.98 1.51.98 2.55 0 3.65-2.22 4.45-4.34 4.68.34.3.65.88.65 1.78v2.64c0 .25.17.55.66.46A9.5 9.5 0 0 0 12 2.5Z"
      />
    ),
  },
  dribbble: {
    label: "Dribbble",
    path: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm6.28 4.38a8.04 8.04 0 0 1 1.82 5.02c-.27-.06-2.96-.6-5.67-.26-.06-.14-.12-.29-.19-.44-.16-.39-.35-.79-.54-1.17 3-1.22 4.36-2.98 4.58-3.15ZM12 3.94c2.05 0 3.92.77 5.34 2.03-.18.26-1.41 1.9-4.31 2.99a45.6 45.6 0 0 0-3.1-4.83A8.1 8.1 0 0 1 12 3.94Zm-3.7.79a52 52 0 0 1 3.07 4.77c-3.88 1.03-7.3.99-7.67.99a8.08 8.08 0 0 1 4.6-5.76ZM3.9 12.01v-.24c.36 0 4.38.05 8.52-1.19.24.46.46.93.66 1.4l-.32.1c-4.28 1.38-6.55 5.15-6.74 5.47A8.04 8.04 0 0 1 3.9 12Zm8.1 8.07a8.04 8.04 0 0 1-4.96-1.71c.15-.31 1.85-3.57 6.53-5.2l.05-.02c1.17 3.03 1.65 5.57 1.77 6.3A8 8 0 0 1 12 20.08Zm4.79-1.66c-.08-.5-.52-2.93-1.61-5.91 2.55-.41 4.79.26 5.07.35a8.06 8.06 0 0 1-3.46 5.56Z"
      />
    ),
  },
  email: {
    label: "Email",
    path: (
      <path d="M3.5 6.5A1.5 1.5 0 0 1 5 5h14a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-11Zm2.06.5 6.44 4.6L18.44 7H5.56Zm13.44 1.05-6.55 4.68a1 1 0 0 1-1.16 0L4.5 8.05V17H19V8.05Z" />
    ),
  },
  website: {
    label: "Website",
    path: (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19ZM4.06 11h3.02c.07-1.9.4-3.65.93-5.02A8.03 8.03 0 0 0 4.06 11Zm5.02 0h5.84c-.08-1.83-.42-3.43-.9-4.63-.3-.76-.63-1.3-.94-1.62-.31-.32-.55-.4-.68-.4-.13 0-.37.08-.68.4-.31.32-.64.86-.94 1.62-.48 1.2-.82 2.8-.9 4.63Zm5.84 2H9.08c.08 1.83.42 3.43.9 4.63.3.76.63 1.3.94 1.62.31.32.55.4.68.4.13 0 .37-.08.68-.4.31-.32.64-.86.94-1.62.48-1.2.82-2.8.9-4.63Zm2.02 0c-.07 1.9-.4 3.65-.93 5.02A8.03 8.03 0 0 0 19.94 13h-3.02Zm3.02-2h-3.02c-.07-1.9-.4-3.65-.93-5.02A8.03 8.03 0 0 1 19.94 11ZM7.08 13H4.06a8.03 8.03 0 0 0 3.95 5.02c-.53-1.37-.86-3.12-.93-5.02Z"
      />
    ),
  },
};

const SocialLink: FC<{ social: TeamSocial; name: string }> = ({
  social,
  name,
}) => {
  const meta = socialMeta[social.network];
  return (
    <a
      href={social.href}
      target={social.network === "email" ? undefined : "_blank"}
      rel={social.network === "email" ? undefined : "noopener noreferrer"}
      aria-label={`${name} on ${meta.label}`}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[#0E3A40] ring-1 ring-[#0E3A40]/10 transition-colors duration-200 hover:bg-[#0E3A40] hover:text-[#F2EBDD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2EC3C3]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-4 w-4"
      >
        {meta.path}
      </svg>
    </a>
  );
};

const MemberCard: FC<{ member: TeamMember; index: number }> = ({
  member,
  index,
}) => (
  <article className="group flex flex-col overflow-hidden rounded-2xl bg-white/70 ring-1 ring-[#0E3A40]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(14,58,64,0.5)] hover:ring-[#0E3A40]/20">
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ECE0CD]">
      {member.photo ? (
        <img
          src={member.photo}
          alt={`Portrait of ${member.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center text-5xl font-semibold text-[#F2EBDD]"
          style={{ backgroundColor: monogramTones[index % monogramTones.length] }}
        >
          {initials(member.name)}
        </span>
      )}
    </div>

    <div className="flex flex-1 flex-col p-5">
      <h3 className="font-display text-lg font-semibold tracking-tight text-[#0E3A40]">
        {member.name}
      </h3>
      <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.15em] text-[#2EC3C3]">
        {member.role}
      </p>
      {member.bio ? (
        <p className="mt-3 text-sm leading-relaxed text-[#1C2B2E]/70">
          {member.bio}
        </p>
      ) : null}

      {member.socials && member.socials.length > 0 ? (
        <ul className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#0E3A40]/10 pt-4">
          {member.socials.map((social, i) => (
            <li key={`${social.network}-${i}`}>
              <SocialLink social={social} name={member.name} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  </article>
);

/**
 * TeamGrid — a responsive grid of team members with photo, name, role,
 * a short bio, and social/contact links.
 * Brand palette: "Sand & Surf". Accessible, no external deps.
 */
const TeamGrid: FC<TeamGridProps> = ({
  eyebrow = "The crew",
  heading = "Small studio, senior hands",
  description = "No account managers, no hand-offs to juniors. The people you meet are the people who build, ship, and look after your project.",
  members = defaultMembers,
}) => {
  return (
    <section
      aria-labelledby="team-grid-heading"
      className="bg-[#F2EBDD] text-[#1C2B2E]"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#FF6F59]">
            {eyebrow}
          </p>
          <h2
            id="team-grid-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-[#0E3A40] sm:text-4xl"
          >
            {heading}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-[#1C2B2E]/70">
              {description}
            </p>
          ) : null}
        </div>

        <ul
          role="list"
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
        >
          {members.map((member, i) => (
            <li key={`${member.name}-${i}`}>
              <MemberCard member={member} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TeamGrid;

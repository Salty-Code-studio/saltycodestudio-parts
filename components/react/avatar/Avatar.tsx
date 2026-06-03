import React, { useState } from "react";

/** Diameter presets (px) mapped to Tailwind size classes. */
const SIZE_MAP = {
  xs: { box: "h-6 w-6", text: "text-[10px]", ring: "ring-1", dot: "h-1.5 w-1.5" },
  sm: { box: "h-8 w-8", text: "text-xs", ring: "ring-2", dot: "h-2 w-2" },
  md: { box: "h-10 w-10", text: "text-sm", ring: "ring-2", dot: "h-2.5 w-2.5" },
  lg: { box: "h-14 w-14", text: "text-base", ring: "ring-2", dot: "h-3 w-3" },
  xl: { box: "h-20 w-20", text: "text-xl", ring: "ring-4", dot: "h-4 w-4" },
} as const;

export type AvatarSize = keyof typeof SIZE_MAP;
export type AvatarStatus = "online" | "away" | "busy" | "offline";

/** Status dot colors on the Sand & Surf palette. */
const STATUS_MAP: Record<AvatarStatus, { color: string; label: string }> = {
  online: { color: "#1f8a8a", label: "Online" },
  away: { color: "#e0a93b", label: "Away" },
  busy: { color: "#d6553f", label: "Busy" },
  offline: { color: "#9bb0b8", label: "Offline" },
};

/**
 * Deterministically derive up to two uppercase initials from a name.
 * "Salty Code" -> "SC", "playa" -> "PL".
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Pick a stable background tint for an initials avatar, derived from the name
 * so the same person always gets the same color (no flicker between renders).
 */
const INITIAL_TINTS = [
  { bg: "#0f5c5c", fg: "#eafaf7" },
  { bg: "#1f8a8a", fg: "#f6fffe" },
  { bg: "#2ec3c3", fg: "#053b3b" },
  { bg: "#1c2b33", fg: "#f4ece0" },
  { bg: "#4a5d66", fg: "#fbf7f0" },
] as const;

function tintFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return INITIAL_TINTS[Math.abs(hash) % INITIAL_TINTS.length];
}

export interface AvatarProps {
  /** Image source. If it fails to load (or is omitted) the initials fallback renders. */
  src?: string;
  /** Full name — used for the alt text, tooltip, and initials fallback. */
  name: string;
  /** Visual size preset. Default "md". */
  size?: AvatarSize;
  /** Optional presence indicator dot. */
  status?: AvatarStatus;
  /** Draw a subtle ring around the avatar (used by AvatarGroup for overlap separation). Default false. */
  ringed?: boolean;
  /** Extra classes appended to the outer element. */
  className?: string;
}

/**
 * Avatar
 *
 * Renders a circular user image with a graceful initials fallback (used when no
 * `src` is given or the image errors), an optional presence status dot, and an
 * optional separator ring. The image is decorative once initials describe the
 * person, so the accessible name lives on the wrapper via `aria-label`.
 */
export default function Avatar({
  src,
  name,
  size = "md",
  status,
  ringed = false,
  className = "",
}: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const sz = SIZE_MAP[size];
  const showImage = Boolean(src) && !errored;
  const tint = tintFor(name);
  const statusInfo = status ? STATUS_MAP[status] : null;

  return (
    <span
      className={`relative inline-flex shrink-0 ${className}`}
      role="img"
      aria-label={statusInfo ? `${name} — ${statusInfo.label}` : name}
      title={name}
    >
      <span
        className={`relative flex ${sz.box} items-center justify-center overflow-hidden rounded-full bg-[#ece0cd] ${
          ringed ? `${sz.ring} ring-[#fbf7f0]` : ""
        }`}
        style={!showImage ? { backgroundColor: tint.bg } : undefined}
      >
        {showImage ? (
          <img
            src={src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            onError={() => setErrored(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className={`select-none font-semibold ${sz.text}`}
            style={{ color: tint.fg }}
          >
            {getInitials(name)}
          </span>
        )}
      </span>

      {statusInfo && (
        <span
          className={`absolute bottom-0 right-0 ${sz.dot} translate-x-[12%] translate-y-[12%] rounded-full ring-2 ring-[#fbf7f0]`}
          style={{ backgroundColor: statusInfo.color }}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

export interface AvatarGroupProps {
  /** People to display, in order. Each needs a `name`; `src`/`status` optional. */
  avatars: Array<Pick<AvatarProps, "src" | "name" | "status">>;
  /** Maximum avatars to render before collapsing the rest into a "+N" chip. Default 4. */
  max?: number;
  /** Size preset applied to every avatar in the group. Default "md". */
  size?: AvatarSize;
  /** Extra classes appended to the group wrapper. */
  className?: string;
}

/**
 * AvatarGroup
 *
 * A horizontal row of overlapping avatars. Each avatar gets a cream separator
 * ring so the overlap reads cleanly. When the list exceeds `max`, the overflow
 * collapses into a "+N" chip. The whole row is exposed as a single list to
 * assistive tech; the overflow chip announces the hidden count.
 */
export function AvatarGroup({
  avatars,
  max = 4,
  size = "md",
  className = "",
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;
  const sz = SIZE_MAP[size];
  const hiddenNames = avatars.slice(max).map((a) => a.name);

  return (
    <ul
      className={`flex items-center ${className}`}
      aria-label={`${avatars.length} ${avatars.length === 1 ? "person" : "people"}`}
    >
      {visible.map((a, i) => (
        <li key={`${a.name}-${i}`} className="-ml-2 first:ml-0">
          <Avatar src={a.src} name={a.name} status={a.status} size={size} ringed />
        </li>
      ))}

      {overflow > 0 && (
        <li className="-ml-2">
          <button
            type="button"
            title={hiddenNames.join(", ")}
            aria-label={`${overflow} more: ${hiddenNames.join(", ")}`}
            className={`flex ${sz.box} items-center justify-center rounded-full bg-[#1c2b33] font-semibold text-[#f4ece0] ${sz.ring} ring-[#fbf7f0] ${sz.text} transition-colors duration-200 hover:bg-[#0f5c5c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1f8a8a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf7f0]`}
          >
            +{overflow}
          </button>
        </li>
      )}
    </ul>
  );
}

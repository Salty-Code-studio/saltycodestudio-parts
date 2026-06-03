"use client";

import * as React from "react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type CardVariant = "solid" | "soft" | "outline";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Surface treatment. `soft` adds a faint sand tint, `outline` is borderless-but-ringed. */
  variant?: CardVariant;
  /** Lift + deepen shadow on hover/focus. Set `true` for clickable cards. */
  hoverLift?: boolean;
  /** Render as an anchor so the whole card is one keyboard-reachable link. */
  href?: string;
  /** Open the link in a new tab (adds safe rel). Only used with `href`. */
  external?: boolean;
  /** Card body content (compose with the sub-components below). */
  children: React.ReactNode;
}

export interface CardMediaProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Image source. Required — every media needs alt text too. */
  src: string;
  /** Alternative text. Pass `""` only for purely decorative imagery. */
  alt: string;
  /** Aspect ratio for the media frame. Defaults to 16/9. */
  ratio?: "16/9" | "4/3" | "1/1" | "3/2";
  /** Optional overlay content (e.g. a badge), positioned top-left. */
  overlay?: React.ReactNode;
}

export interface CardSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Inner padding scale. */
  padding?: CardPadding;
  children: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*  Style maps                                                                */
/* -------------------------------------------------------------------------- */

const VARIANT: Record<CardVariant, string> = {
  solid: "bg-[#fdfbf7] ring-1 ring-inset ring-[#ece0cd]",
  soft: "bg-[#f4ece0] ring-1 ring-inset ring-[#1c2b33]/[0.06]",
  outline: "bg-transparent ring-1 ring-inset ring-[#1c2b33]/15",
};

const PADDING: Record<CardPadding, string> = {
  none: "",
  sm: "px-4 py-3",
  md: "px-5 py-4",
  lg: "px-6 py-5",
};

const RATIO: Record<NonNullable<CardMediaProps["ratio"]>, string> = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/*  Root                                                                      */
/* -------------------------------------------------------------------------- */

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = "solid",
    hoverLift = false,
    href,
    external = false,
    children,
    className,
    ...rest
  },
  ref,
) {
  const base = cx(
    "group/card relative flex flex-col overflow-hidden rounded-2xl",
    "text-left transition-all duration-300 ease-out",
    "motion-reduce:transition-none",
    VARIANT[variant],
    hoverLift &&
      cx(
        "shadow-[0_1px_2px_rgba(28,43,51,0.04)]",
        "hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(15,92,92,0.28)]",
        "hover:ring-[#1f8a8a]/35",
        "focus-visible:-translate-y-1 focus-visible:shadow-[0_18px_40px_-12px_rgba(15,92,92,0.28)]",
        "motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0",
      ),
    href &&
      "outline-none focus-visible:ring-2 focus-visible:ring-[#1f8a8a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf7f0]",
    className,
  );

  if (href) {
    const anchorRest = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={ref as unknown as React.Ref<HTMLAnchorElement>}
        href={href}
        className={base}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : null)}
        {...anchorRest}
      >
        {children}
      </a>
    );
  }

  return (
    <div ref={ref} className={base} {...rest}>
      {children}
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*  Media                                                                     */
/* -------------------------------------------------------------------------- */

export const CardMedia = React.forwardRef<HTMLDivElement, CardMediaProps>(
  function CardMedia(
    { src, alt, ratio = "16/9", overlay, className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx(
          "relative w-full overflow-hidden bg-[#ece0cd]",
          RATIO[ratio],
        )}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cx(
            "h-full w-full object-cover transition-transform duration-500 ease-out",
            "group-hover/card:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none",
            className,
          )}
          {...rest}
        />
        {overlay ? (
          <div className="pointer-events-none absolute left-3 top-3 flex gap-2 [&>*]:pointer-events-auto">
            {overlay}
          </div>
        ) : null}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Header                                                                    */
/* -------------------------------------------------------------------------- */

export interface CardHeaderProps extends CardSectionProps {
  /** Optional eyebrow / kicker above the title. */
  eyebrow?: React.ReactNode;
  /** Title text. Rendered with the `as` heading level. */
  title?: React.ReactNode;
  /** Supporting line under the title. */
  subtitle?: React.ReactNode;
  /** Content pinned to the top-right (e.g. menu button, badge). */
  action?: React.ReactNode;
  /** Heading element for the title (semantics + outline). Default `h3`. */
  as?: "h2" | "h3" | "h4";
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader(
    {
      eyebrow,
      title,
      subtitle,
      action,
      as: Heading = "h3",
      padding = "lg",
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx("flex items-start gap-3", PADDING[padding], className)}
        {...rest}
      >
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1f8a8a]">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <Heading className="truncate text-lg font-semibold leading-snug tracking-tight text-[#1c2b33]">
              {title}
            </Heading>
          ) : null}
          {subtitle ? (
            <p className="mt-1 text-sm text-[#4a5d66]">{subtitle}</p>
          ) : null}
          {children}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Body                                                                      */
/* -------------------------------------------------------------------------- */

export const CardBody = React.forwardRef<HTMLDivElement, CardSectionProps>(
  function CardBody({ padding = "lg", className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx(
          "text-sm leading-relaxed text-[#4a5d66]",
          // collapse top padding when stacked under a header
          padding === "lg" ? "px-6 pb-5 pt-0" : PADDING[padding],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

export interface CardFooterProps extends CardSectionProps {
  /** Divide the footer from the body with a hairline rule. */
  divided?: boolean;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter(
    { divided = true, padding = "lg", className, children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx(
          "mt-auto flex flex-wrap items-center gap-3",
          divided && "border-t border-[#ece0cd]",
          PADDING[padding],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export default Card;

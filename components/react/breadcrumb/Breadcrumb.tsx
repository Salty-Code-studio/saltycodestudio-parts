"use client";

import React, { useId } from "react";

export interface BreadcrumbItem {
  /** Visible label. */
  label: string;
  /** Destination URL. Omit (or leave undefined) for the current page. */
  href?: string;
}

export interface BreadcrumbProps {
  /** Ordered trail from root to current page. The last item is treated as the current page. */
  items: BreadcrumbItem[];
  /**
   * Collapse the middle of long trails into a "…" menu once the trail exceeds
   * this many items. The first item and the last `itemsAfterCollapse` items
   * always stay visible. Set to `0` to disable collapsing.
   */
  maxItems?: number;
  /** How many trailing items to always keep visible when collapsed. */
  itemsAfterCollapse?: number;
  /** How many leading items to always keep visible when collapsed. */
  itemsBeforeCollapse?: number;
  /** Separator between crumbs: a chevron (default) or a slash. */
  separator?: "chevron" | "slash";
  /** Cap each crumb's width and truncate overflowing labels with an ellipsis. */
  truncateLabels?: boolean;
  /** Accessible label for the landmark. */
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_ITEMS: BreadcrumbItem[] = [
  { label: "Home", href: "#" },
  { label: "Work", href: "#" },
  { label: "Client Projects", href: "#" },
  { label: "Slijterij United Liquors", href: "#" },
  { label: "Bilingual Website Build" },
];

function Separator({ kind }: { kind: "chevron" | "slash" }) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className="select-none text-[#9aa9af]"
    >
      {kind === "slash" ? (
        <span className="px-0.5">/</span>
      ) : (
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m7.5 4 5 6-5 6" />
        </svg>
      )}
    </li>
  );
}

function Crumb({
  item,
  isCurrent,
  truncate,
}: {
  item: BreadcrumbItem;
  isCurrent: boolean;
  truncate: boolean;
}) {
  const truncateCls = truncate
    ? "max-w-[10rem] truncate align-bottom"
    : "";

  if (isCurrent || !item.href) {
    return (
      <span
        aria-current={isCurrent ? "page" : undefined}
        title={truncate ? item.label : undefined}
        className={`inline-block font-semibold text-[#1c2b33] ${truncateCls}`}
      >
        {item.label}
      </span>
    );
  }

  return (
    <a
      href={item.href}
      title={truncate ? item.label : undefined}
      className={`inline-block rounded-sm text-[#4a5d66] underline-offset-4 outline-none transition-colors hover:text-[#0f5c5c] hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-[#1f8a8a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf7f0] ${truncateCls}`}
    >
      {item.label}
    </a>
  );
}

export default function Breadcrumb({
  items = DEFAULT_ITEMS,
  maxItems = 0,
  itemsAfterCollapse = 1,
  itemsBeforeCollapse = 1,
  separator = "chevron",
  truncateLabels = false,
  ariaLabel = "Breadcrumb",
  className = "",
}: BreadcrumbProps) {
  const baseId = useId();
  const [expanded, setExpanded] = React.useState(false);

  const lastIndex = items.length - 1;

  const shouldCollapse =
    maxItems > 0 &&
    !expanded &&
    items.length > maxItems &&
    items.length > itemsBeforeCollapse + itemsAfterCollapse + 1;

  // Build the render list: either every crumb, or [head…, ellipsis, …tail].
  type Node =
    | { type: "crumb"; item: BreadcrumbItem; index: number }
    | { type: "ellipsis"; hidden: BreadcrumbItem[] };

  let nodes: Node[];

  if (shouldCollapse) {
    const head = items
      .slice(0, itemsBeforeCollapse)
      .map((item, index) => ({ type: "crumb" as const, item, index }));
    const tailStart = items.length - itemsAfterCollapse;
    const tail = items
      .slice(tailStart)
      .map((item, i) => ({ type: "crumb" as const, item, index: tailStart + i }));
    const hidden = items.slice(itemsBeforeCollapse, tailStart);
    nodes = [...head, { type: "ellipsis", hidden }, ...tail];
  } else {
    nodes = items.map((item, index) => ({ type: "crumb" as const, item, index }));
  }

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {nodes.map((node, i) => {
          const isLastNode = i === nodes.length - 1;

          if (node.type === "ellipsis") {
            return (
              <React.Fragment key={`${baseId}-ellipsis`}>
                <li className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    aria-label={`Show ${node.hidden.length} hidden ${
                      node.hidden.length === 1 ? "level" : "levels"
                    }`}
                    title={node.hidden.map((h) => h.label).join(" › ")}
                    className="grid h-6 w-7 place-items-center rounded-md text-[#4a5d66] outline-none transition-colors hover:bg-[#ece0cd] hover:text-[#0f5c5c] focus-visible:bg-[#ece0cd] focus-visible:ring-2 focus-visible:ring-[#1f8a8a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf7f0]"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <circle cx="4" cy="10" r="1.5" />
                      <circle cx="10" cy="10" r="1.5" />
                      <circle cx="16" cy="10" r="1.5" />
                    </svg>
                  </button>
                </li>
                {!isLastNode && <Separator kind={separator} />}
              </React.Fragment>
            );
          }

          const isCurrent = node.index === lastIndex;
          return (
            <React.Fragment key={`${baseId}-${node.index}`}>
              <li className="flex items-center">
                <Crumb
                  item={node.item}
                  isCurrent={isCurrent}
                  truncate={truncateLabels}
                />
              </li>
              {!isLastNode && <Separator kind={separator} />}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

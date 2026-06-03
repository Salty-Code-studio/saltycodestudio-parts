"use client";

import React, { useMemo } from "react";

export interface PaginationProps {
  /** The currently active page (1-based). */
  page: number;
  /** Total number of pages (>= 1). */
  totalPages: number;
  /** Called with the next page number when the user navigates. */
  onPageChange: (page: number) => void;
  /**
   * How many page buttons to show on each side of the current page
   * before collapsing into an ellipsis. Defaults to 1.
   */
  siblingCount?: number;
  /**
   * How many page buttons to always show at the start and end
   * (the boundaries). Defaults to 1.
   */
  boundaryCount?: number;
  /** Hide the Previous / Next buttons. Defaults to false. */
  hidePrevNext?: boolean;
  /** Accessible label for the wrapping <nav>. Defaults to "Pagination". */
  ariaLabel?: string;
  /** Extra classes for the wrapping <nav>. */
  className?: string;
}

type PageItem = number | "start-ellipsis" | "end-ellipsis";

const DOTS = "…"; // …

/** Inclusive integer range helper. */
function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i += 1) out.push(i);
  return out;
}

/**
 * Builds the list of page items to render, inserting ellipses where the
 * window of visible pages does not reach the boundaries.
 *
 * Mirrors the algorithm used by MUI / Ark — stable, no jumpiness as `page`
 * moves, and always renders a predictable number of items.
 */
export function usePaginationRange({
  page,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1,
}: Pick<PaginationProps, "page" | "totalPages" | "siblingCount" | "boundaryCount">): PageItem[] {
  return useMemo(() => {
    const totalPageNumbers = boundaryCount * 2 + siblingCount * 2 + 3; // boundaries + siblings + current + 2 ellipses

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const startPages = range(1, boundaryCount);
    const endPages = range(totalPages - boundaryCount + 1, totalPages);

    const siblingsStart = Math.max(
      Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
      boundaryCount + 2,
    );
    const siblingsEnd = Math.min(
      Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
      endPages.length > 0 ? endPages[0] - 2 : totalPages - 1,
    );

    const items: PageItem[] = [...startPages];

    if (siblingsStart > boundaryCount + 2) {
      items.push("start-ellipsis");
    } else if (boundaryCount + 1 < totalPages - boundaryCount) {
      items.push(boundaryCount + 1);
    }

    items.push(...range(siblingsStart, siblingsEnd));

    if (siblingsEnd < totalPages - boundaryCount - 1) {
      items.push("end-ellipsis");
    } else if (totalPages - boundaryCount > boundaryCount) {
      items.push(totalPages - boundaryCount);
    }

    items.push(...endPages);

    return items;
  }, [page, totalPages, siblingCount, boundaryCount]);
}

const baseItem =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-medium tabular-nums transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#2ec3c3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf7f0]";

function ChevronLeft() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 15 7.5 10l5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7.5 5 12.5 10l-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  hidePrevNext = false,
  ariaLabel = "Pagination",
  className = "",
}: PaginationProps) {
  const items = usePaginationRange({ page, totalPages, siblingCount, boundaryCount });

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const go = (next: number) => {
    const clamped = Math.min(Math.max(next, 1), totalPages);
    if (clamped !== page) onPageChange(clamped);
  };

  const edgeBtn = (disabled: boolean) =>
    `${baseItem} gap-1 border border-[#ece0cd] bg-[#fbf7f0] ${
      disabled
        ? "cursor-not-allowed text-[#4a5d66]/40"
        : "text-[#1c2b33] hover:border-[#2ec3c3] hover:text-[#0f5c5c] active:bg-[#f4ece0]"
    }`;

  return (
    <nav role="navigation" aria-label={ariaLabel} className={`flex items-center gap-1.5 ${className}`}>
      {!hidePrevNext && (
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={isFirst}
          aria-label="Go to previous page"
          className={edgeBtn(isFirst)}
        >
          <ChevronLeft />
          <span className="hidden sm:inline">Prev</span>
        </button>
      )}

      <ul className="flex items-center gap-1.5">
        {items.map((item, i) => {
          if (item === "start-ellipsis" || item === "end-ellipsis") {
            return (
              <li key={`${item}-${i}`} aria-hidden="true">
                <span className={`${baseItem} pointer-events-none select-none text-[#4a5d66]`}>{DOTS}</span>
              </li>
            );
          }

          const isCurrent = item === page;
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => go(item)}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={isCurrent ? `Page ${item}, current page` : `Go to page ${item}`}
                className={`${baseItem} ${
                  isCurrent
                    ? "bg-[#0f5c5c] text-white shadow-sm shadow-[#0f5c5c]/20 hover:bg-[#0a4a4a]"
                    : "border border-[#ece0cd] bg-[#fbf7f0] text-[#1c2b33] hover:border-[#2ec3c3] hover:text-[#0f5c5c] active:bg-[#f4ece0]"
                }`}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>

      {!hidePrevNext && (
        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={isLast}
          aria-label="Go to next page"
          className={edgeBtn(isLast)}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight />
        </button>
      )}
    </nav>
  );
}

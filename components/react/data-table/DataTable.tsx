"use client";

import * as React from "react";

/**
 * DataTable — a clean, accessible data table with sortable columns,
 * zebra striping, hover rows, a sticky header, and an empty state.
 *
 * Sand & Surf palette. Tailwind classes only — no runtime CSS deps.
 */

export type SortDirection = "asc" | "desc";

export interface Column<T> {
  /** Unique key. Used for sorting state and React keys. */
  key: keyof T & string;
  /** Header label. */
  header: string;
  /** Column alignment. Defaults to "left". */
  align?: "left" | "right" | "center";
  /** Whether this column can be sorted. Defaults to true. */
  sortable?: boolean;
  /** Optional fixed width, e.g. "10rem" or "120px". */
  width?: string;
  /** Custom cell renderer. Falls back to String(row[key]). */
  render?: (row: T, rowIndex: number) => React.ReactNode;
  /**
   * Custom comparator for this column. Receives raw row values.
   * Return <0 / 0 / >0. Defaults to a smart string/number compare.
   */
  sortFn?: (a: T[keyof T], b: T[keyof T]) => number;
}

export interface SortState<T> {
  key: (keyof T & string) | null;
  direction: SortDirection;
}

export interface DataTableProps<T> {
  /** Column definitions. */
  columns: Column<T>[];
  /** Row data. */
  data: T[];
  /** Stable row key. Defaults to the array index. */
  rowKey?: (row: T, index: number) => string | number;
  /** Caption read by screen readers (visually hidden). */
  caption?: string;
  /** Heading shown above the table. */
  title?: string;
  /** Sub text shown under the title. */
  description?: string;
  /** Controlled sort state. Omit for uncontrolled (internal) sorting. */
  sort?: SortState<T>;
  /** Called whenever the user changes the sort. */
  onSortChange?: (sort: SortState<T>) => void;
  /** Default sort for uncontrolled mode. */
  defaultSort?: SortState<T>;
  /** Sticky header. Defaults to true. */
  stickyHeader?: boolean;
  /** Zebra striping. Defaults to true. */
  zebra?: boolean;
  /** Max height of the scroll area (enables vertical scroll + sticky). */
  maxHeight?: string;
  /** Loading state — renders skeleton rows. */
  loading?: boolean;
  /** Number of skeleton rows while loading. Defaults to 5. */
  loadingRows?: number;
  /** Empty-state content (shown when data is empty and not loading). */
  emptyState?: React.ReactNode;
  /** Row click handler. Makes rows interactive + keyboard focusable. */
  onRowClick?: (row: T, index: number) => void;
  /** Extra classes on the outer wrapper. */
  className?: string;
}

function defaultCompare(a: unknown, b: unknown): number {
  // Nullish values sort last.
  const an = a == null;
  const bn = b == null;
  if (an && bn) return 0;
  if (an) return 1;
  if (bn) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function SortIcon({
  state,
}: {
  state: "asc" | "desc" | "none";
}) {
  return (
    <span
      className="ml-1.5 inline-flex flex-col text-[0.55rem] leading-[0.55rem]"
      aria-hidden="true"
    >
      <span
        className={
          state === "asc" ? "text-[#1f8a8a]" : "text-[#c3b6a0]"
        }
      >
        ▲
      </span>
      <span
        className={
          state === "desc" ? "text-[#1f8a8a]" : "text-[#c3b6a0]"
        }
      >
        ▼
      </span>
    </span>
  );
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  caption,
  title,
  description,
  sort,
  onSortChange,
  defaultSort,
  stickyHeader = true,
  zebra = true,
  maxHeight,
  loading = false,
  loadingRows = 5,
  emptyState,
  onRowClick,
  className = "",
}: DataTableProps<T>) {
  const isControlled = sort !== undefined;
  const [internalSort, setInternalSort] = React.useState<SortState<T>>(
    defaultSort ?? { key: null, direction: "asc" }
  );
  const activeSort = isControlled ? (sort as SortState<T>) : internalSort;

  const handleSort = React.useCallback(
    (key: keyof T & string) => {
      const next: SortState<T> =
        activeSort.key === key
          ? {
              key,
              direction: activeSort.direction === "asc" ? "desc" : "asc",
            }
          : { key, direction: "asc" };
      if (!isControlled) setInternalSort(next);
      onSortChange?.(next);
    },
    [activeSort, isControlled, onSortChange]
  );

  const sortedData = React.useMemo(() => {
    if (!activeSort.key) return data;
    const col = columns.find((c) => c.key === activeSort.key);
    if (!col) return data;
    const cmp = col.sortFn ?? ((a, b) => defaultCompare(a, b));
    const dir = activeSort.direction === "asc" ? 1 : -1;
    // Stable sort: decorate-sort-undecorate.
    return data
      .map((row, index) => ({ row, index }))
      .sort((x, y) => {
        const r = cmp(
          x.row[activeSort.key as keyof T],
          y.row[activeSort.key as keyof T]
        );
        return r !== 0 ? r * dir : x.index - y.index;
      })
      .map((d) => d.row);
  }, [data, columns, activeSort]);

  const alignClass = (a: Column<T>["align"]) =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

  const colCount = columns.length;
  const showEmpty = !loading && sortedData.length === 0;

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#e7ddcd] bg-[#fbf7f0] shadow-sm ${className}`}
    >
      {(title || description) && (
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#e7ddcd] bg-[#f4ece0] px-5 py-4">
          <div>
            {title && (
              <h2 className="text-base font-semibold tracking-tight text-[#1c2b33]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-[#4a5d66]">{description}</p>
            )}
          </div>
          {!loading && (
            <span className="rounded-full bg-[#ece0cd] px-2.5 py-0.5 text-xs font-medium text-[#4a5d66]">
              {sortedData.length} {sortedData.length === 1 ? "row" : "rows"}
            </span>
          )}
        </div>
      )}

      <div
        className="relative overflow-auto"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <table className="w-full border-collapse text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead
            className={
              stickyHeader ? "sticky top-0 z-10" : undefined
            }
          >
            <tr className="bg-[#ece0cd]">
              {columns.map((col) => {
                const sortable = col.sortable !== false;
                const isActive = activeSort.key === col.key;
                const ariaSort: React.AriaAttributes["aria-sort"] = !sortable
                  ? undefined
                  : isActive
                  ? activeSort.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none";
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    style={col.width ? { width: col.width } : undefined}
                    className={`whitespace-nowrap border-b border-[#dccbb0] px-4 py-3 font-semibold text-[#1c2b33] ${alignClass(
                      col.align
                    )}`}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className={`group -mx-1 inline-flex items-center rounded px-1 py-0.5 font-semibold transition-colors hover:text-[#0f5c5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f8a8a] focus-visible:ring-offset-1 focus-visible:ring-offset-[#ece0cd] ${
                          col.align === "right" ? "flex-row-reverse" : ""
                        } ${isActive ? "text-[#0f5c5c]" : "text-[#1c2b33]"}`}
                      >
                        <span>{col.header}</span>
                        <SortIcon
                          state={
                            isActive ? activeSort.direction : "none"
                          }
                        />
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading &&
              Array.from({ length: loadingRows }).map((_, r) => (
                <tr key={`sk-${r}`} className="border-b border-[#efe6d6]">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      <div
                        className="h-3.5 animate-pulse rounded bg-[#e7ddcd]"
                        style={{ width: `${50 + ((r * 7 + col.key.length * 11) % 45)}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              sortedData.map((row, rowIndex) => {
                const key = rowKey ? rowKey(row, rowIndex) : rowIndex;
                const interactive = Boolean(onRowClick);
                return (
                  <tr
                    key={key}
                    onClick={interactive ? () => onRowClick!(row, rowIndex) : undefined}
                    onKeyDown={
                      interactive
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onRowClick!(row, rowIndex);
                            }
                          }
                        : undefined
                    }
                    tabIndex={interactive ? 0 : undefined}
                    role={interactive ? "button" : undefined}
                    className={[
                      "border-b border-[#efe6d6] transition-colors",
                      zebra && rowIndex % 2 === 1 ? "bg-[#f7f1e6]" : "bg-transparent",
                      "hover:bg-[#eaf6f5]",
                      interactive
                        ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1f8a8a]"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-[#1c2b33] ${alignClass(col.align)}`}
                      >
                        {col.render
                          ? col.render(row, rowIndex)
                          : ((): React.ReactNode => {
                              const v = row[col.key];
                              return v == null
                                ? "—"
                                : (v as React.ReactNode);
                            })()}
                      </td>
                    ))}
                  </tr>
                );
              })}

            {showEmpty && (
              <tr>
                <td colSpan={colCount} className="p-0">
                  {emptyState ?? <DefaultEmptyState />}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DefaultEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#eaf6f5] text-[#1f8a8a]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Z" />
          <path d="M3 12l9 4.5 9-4.5" />
          <path d="M3 16.5 12 21l9-4.5" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-[#1c2b33]">No data to show</p>
      <p className="max-w-xs text-sm text-[#4a5d66]">
        There&apos;s nothing here yet. New records will appear in this table
        once they exist.
      </p>
    </div>
  );
}

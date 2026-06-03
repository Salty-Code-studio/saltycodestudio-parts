/**
 * Counter.tsx — a tiny example React island.
 *
 * Astro renders components statically by default. Adding a `client:*` directive
 * (e.g. `<Counter client:visible />`) ships JS for JUST this component and
 * hydrates it in the browser — the rest of the page stays static HTML.
 *
 * With the React 18 automatic JSX runtime (set in tsconfig.json), you do NOT
 * need to `import React`. Styling uses the same Sand & Surf brand utilities
 * the preset exposes, so islands look native to the page.
 *
 * Delete this file once you've copied in a real part from
 * ../../../components/react — it exists only to make the example in
 * src/pages/index.astro runnable.
 */
import { useState } from "react";

interface Props {
  /** Starting value. */
  start?: number;
}

export default function Counter({ start = 0 }: Props) {
  const [count, setCount] = useState(start);

  // In React .tsx the attribute is `className` (not `class` like in .astro).
  return (
    <div className="mt-10 flex items-center gap-4 rounded-lg border border-teal/20 bg-sand-2 p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setCount((c) => c - 1)}
        className="rounded-md bg-teal px-4 py-2 font-display font-semibold text-white"
        aria-label="Decrement"
      >
        −
      </button>

      <span className="min-w-12 text-center font-mono text-xl text-ink">{count}</span>

      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-md bg-coral px-4 py-2 font-display font-semibold text-white"
        aria-label="Increment"
      >
        +
      </button>
    </div>
  );
}

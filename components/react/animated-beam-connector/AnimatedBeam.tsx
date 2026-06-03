import * as React from "react";
import { motion } from "motion/react";

export interface AnimatedBeamProps {
  /** Ref to the container that wraps everything (must be `position: relative`). */
  containerRef: React.RefObject<HTMLElement>;
  /** Ref to the element the beam starts from. */
  fromRef: React.RefObject<HTMLElement>;
  /** Ref to the element the beam travels to. */
  toRef: React.RefObject<HTMLElement>;
  /** Reverse the direction the pulse travels. */
  reverse?: boolean;
  /** Curvature of the path in pixels (0 = straight line). Positive bows the curve up. */
  curvature?: number;
  /** Extra classes for the outer svg. */
  className?: string;
  /** Stroke width of the static guide line. */
  pathWidth?: number;
  /** Colour of the static guide line. */
  pathColor?: string;
  /** Opacity of the static guide line. */
  pathOpacity?: number;
  /** Stroke width of the travelling gradient pulse. */
  gradientWidth?: number;
  /** Leading colour of the moving gradient. */
  gradientStartColor?: string;
  /** Trailing colour of the moving gradient. */
  gradientStopColor?: string;
  /** Seconds the pulse takes to cross the path. */
  duration?: number;
  /** Seconds to wait before the first pulse. */
  delay?: number;
  /** Nudge the start anchor (x, y) in pixels. */
  startXOffset?: number;
  startYOffset?: number;
  /** Nudge the end anchor (x, y) in pixels. */
  endXOffset?: number;
  endYOffset?: number;
}

let beamIdCounter = 0;

/**
 * AnimatedBeam
 * Draws a curved SVG path between two referenced DOM nodes and animates a
 * linearGradient pulse travelling along the stroke — ideal for integration,
 * pipeline and architecture diagrams.
 *
 * Technique: it measures the from/to element rects relative to the container
 * ref, builds a quadratic-bezier path between their centres, and animates the
 * gradient's x1/x2/y1/y2 (via motion) so a bright comet of colour sweeps the
 * line. A ResizeObserver on both the container and window recomputes the path
 * whenever layout shifts. Honours `prefers-reduced-motion` by parking a static
 * gradient at the midpoint.
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  reverse = false,
  curvature = 0,
  className,
  pathWidth = 2,
  pathColor = "#ece0cd",
  pathOpacity = 1,
  gradientWidth = 2,
  gradientStartColor = "#2ec3c3",
  gradientStopColor = "#0f5c5c",
  duration = 4,
  delay = 0,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const id = React.useRef(`beam-gradient-${beamIdCounter++}`).current;
  const [pathD, setPathD] = React.useState("");
  const [svgDimensions, setSvgDimensions] = React.useState({ width: 0, height: 0 });

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // When the pulse travels left-to-right (or reversed), the gradient anchors
  // animate between these two coordinate sets.
  const gradientCoordinates = reverse
    ? {
        x1: ["90%", "-10%"],
        x2: ["100%", "0%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }
    : {
        x1: ["10%", "110%"],
        x2: ["0%", "100%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      };

  const updatePath = React.useCallback(() => {
    if (!containerRef.current || !fromRef.current || !toRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const rectA = fromRef.current.getBoundingClientRect();
    const rectB = toRef.current.getBoundingClientRect();

    setSvgDimensions({ width: containerRect.width, height: containerRect.height });

    const startX =
      rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
    const startY =
      rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
    const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
    const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

    const controlY = startY - curvature;
    const d = `M ${startX},${startY} Q ${
      (startX + endX) / 2
    },${controlY} ${endX},${endY}`;
    setPathD(d);
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  React.useEffect(() => {
    updatePath();

    const ro = new ResizeObserver(() => updatePath());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updatePath);

    // A couple of deferred recomputes catch fonts/images settling after mount.
    const t1 = window.setTimeout(updatePath, 50);
    const t2 = window.setTimeout(updatePath, 300);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updatePath);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [updatePath, containerRef]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      className={[
        "pointer-events-none absolute left-0 top-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Static guide line beneath the pulse. */}
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      {/* The travelling gradient pulse. */}
      <path
        d={pathD}
        strokeWidth={gradientWidth}
        stroke={`url(#${id})`}
        strokeOpacity={1}
        strokeLinecap="round"
      />
      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: "0%",
            x2: "0%",
            y1: "0%",
            y2: "0%",
          }}
          animate={
            prefersReducedMotion
              ? { x1: "40%", x2: "60%", y1: "0%", y2: "0%" }
              : {
                  x1: gradientCoordinates.x1,
                  x2: gradientCoordinates.x2,
                  y1: gradientCoordinates.y1,
                  y2: gradientCoordinates.y2,
                }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  delay,
                  duration,
                  ease: [0.16, 1, 0.3, 1],
                  repeat: Infinity,
                  repeatDelay: 0,
                }
          }
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Sample usage — wire a central hub to three integration nodes.
 * Each node is a ref; the beams connect them through the container.
 * Delete or replace with your own diagram.
 * ------------------------------------------------------------------ */
export function AnimatedBeamDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hubRef = React.useRef<HTMLDivElement>(null);
  const nodeARef = React.useRef<HTMLDivElement>(null);
  const nodeBRef = React.useRef<HTMLDivElement>(null);
  const nodeCRef = React.useRef<HTMLDivElement>(null);

  const Dot = React.forwardRef<HTMLDivElement, { children?: React.ReactNode }>(
    function Dot({ children }, ref) {
      return (
        <div
          ref={ref}
          className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#ece0cd] bg-[#fbf7f0] shadow-[0_10px_30px_-12px_rgba(28,43,51,0.35)]"
        >
          {children}
        </div>
      );
    }
  );

  return (
    <div
      ref={containerRef}
      className="relative flex h-[320px] w-full max-w-2xl items-center justify-between rounded-3xl border border-[#ece0cd] bg-[#fbf7f0] p-12"
    >
      <div className="flex flex-col justify-between gap-10">
        <Dot ref={nodeARef}>A</Dot>
        <Dot ref={nodeBRef}>B</Dot>
        <Dot ref={nodeCRef}>C</Dot>
      </div>

      <Dot ref={hubRef}>
        <span className="text-lg font-bold text-[#0f5c5c]">HUB</span>
      </Dot>

      <AnimatedBeam containerRef={containerRef} fromRef={nodeARef} toRef={hubRef} curvature={-60} />
      <AnimatedBeam containerRef={containerRef} fromRef={nodeBRef} toRef={hubRef} />
      <AnimatedBeam containerRef={containerRef} fromRef={nodeCRef} toRef={hubRef} curvature={60} />
    </div>
  );
}

export default AnimatedBeam;

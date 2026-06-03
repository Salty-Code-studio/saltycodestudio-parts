"use client";

import { useEffect, useRef } from "react";

export interface CanvasParticleFieldProps {
  /** Number of particles to render. Default 80. */
  quantity?: number;
  /** Base radius of each particle in px (randomized up to ~2x). Default 0.6. */
  size?: number;
  /** Particle color as a hex string (e.g. "#1f8a8a"). Default "#1f8a8a". */
  color?: string;
  /** Horizontal idle drift applied every frame. Default 0. */
  vx?: number;
  /** Vertical idle drift applied every frame. Default 0. */
  vy?: number;
  /**
   * How "stuck" particles are to their origin. Higher = less mouse reaction.
   * Default 50.
   */
  staticity?: number;
  /** Easing factor for returning to rest position (lower = snappier). Default 50. */
  ease?: number;
  /** Extra Tailwind/utility classes for the wrapping canvas. */
  className?: string;
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

/** Convert a hex color (#rgb or #rrggbb) to an "r,g,b" string for rgba(). */
function hexToRgb(hex: string): string {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(h, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `${r},${g},${b}`;
}

/** Map a value from one range to another (clamped). */
function remap(
  value: number,
  start1: number,
  end1: number,
  start2: number,
  end2: number,
): number {
  const mapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
  return mapped > 0 ? mapped : 0;
}

/**
 * CanvasParticleField — a lightweight, dependency-free canvas particle layer
 * that drifts gently and eases toward/away from the cursor. Drop it behind hero
 * content (absolutely positioned) for depth and motion.
 *
 * Respects prefers-reduced-motion: when set, particles render once, static.
 */
export default function CanvasParticleField({
  quantity = 80,
  size = 0.6,
  color = "#1f8a8a",
  vx = 0,
  vy = 0,
  staticity = 50,
  ease = 50,
  className = "",
}: CanvasParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const circlesRef = useRef<Circle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const rafRef = useRef<number>(0);
  const dprRef = useRef<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    contextRef.current = canvas.getContext("2d");
    dprRef.current = Math.min(window.devicePixelRatio || 1, 2);

    const rgb = hexToRgb(color);
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resizeCanvas = () => {
      const ctx = contextRef.current;
      if (!ctx) return;
      circlesRef.current = [];
      canvasSizeRef.current.w = container.offsetWidth;
      canvasSizeRef.current.h = container.offsetHeight;
      canvas.width = canvasSizeRef.current.w * dprRef.current;
      canvas.height = canvasSizeRef.current.h * dprRef.current;
      canvas.style.width = `${canvasSizeRef.current.w}px`;
      canvas.style.height = `${canvasSizeRef.current.h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dprRef.current, dprRef.current);
    };

    const circleParams = (): Circle => {
      const x = Math.floor(Math.random() * canvasSizeRef.current.w);
      const y = Math.floor(Math.random() * canvasSizeRef.current.h);
      const pSize = Math.floor(Math.random() * 2) + size;
      return {
        x,
        y,
        translateX: 0,
        translateY: 0,
        size: pSize,
        alpha: 0,
        targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(2)),
        dx: (Math.random() - 0.5) * 0.1,
        dy: (Math.random() - 0.5) * 0.1,
        magnetism: 0.1 + Math.random() * 4,
      };
    };

    const drawCircle = (circle: Circle, update = false) => {
      const ctx = contextRef.current;
      if (!ctx) return;
      const { x, y, translateX, translateY, size: s, alpha } = circle;
      ctx.translate(translateX, translateY);
      ctx.beginPath();
      ctx.arc(x, y, s, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
      ctx.fill();
      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
      if (!update) circlesRef.current.push(circle);
    };

    const clearContext = () => {
      const ctx = contextRef.current;
      if (!ctx) return;
      ctx.clearRect(
        0,
        0,
        canvasSizeRef.current.w,
        canvasSizeRef.current.h,
      );
    };

    const drawParticles = () => {
      clearContext();
      const count = quantity;
      for (let i = 0; i < count; i++) {
        drawCircle(circleParams());
      }
    };

    const animate = () => {
      clearContext();
      circlesRef.current.forEach((circle, i) => {
        // Fade in/out near edges so particles vanish gracefully.
        const edge = [
          circle.x + circle.translateX - circle.size,
          canvasSizeRef.current.w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          canvasSizeRef.current.h - circle.y - circle.translateY - circle.size,
        ];
        const closestEdge = edge.reduce((a, b) => Math.min(a, b));
        const remapClosestEdge = parseFloat(
          remap(closestEdge, 0, 20, 0, 1).toFixed(2),
        );
        if (remapClosestEdge > 1) {
          circle.alpha += 0.02;
          if (circle.alpha > circle.targetAlpha) circle.alpha = circle.targetAlpha;
        } else {
          circle.alpha = circle.targetAlpha * remapClosestEdge;
        }

        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;

        // Ease toward the mouse based on staticity + magnetism.
        circle.translateX +=
          (mouseRef.current.x / (staticity / circle.magnetism) -
            circle.translateX) /
          ease;
        circle.translateY +=
          (mouseRef.current.y / (staticity / circle.magnetism) -
            circle.translateY) /
          ease;

        drawCircle(circle, true);

        // Recycle particles that drift off-canvas.
        if (
          circle.x < -circle.size ||
          circle.x > canvasSizeRef.current.w + circle.size ||
          circle.y < -circle.size ||
          circle.y > canvasSizeRef.current.h + circle.size
        ) {
          circlesRef.current.splice(i, 1);
          const fresh = circleParams();
          drawCircle(fresh);
        }
      });
      rafRef.current = window.requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const { w, h } = canvasSizeRef.current;
      const x = e.clientX - rect.left - w / 2;
      const y = e.clientY - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
      }
    };

    const init = () => {
      resizeCanvas();
      drawParticles();
      if (!reduceMotion) {
        rafRef.current = window.requestAnimationFrame(animate);
      }
    };

    init();

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [quantity, size, color, vx, vy, staticity, ease]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

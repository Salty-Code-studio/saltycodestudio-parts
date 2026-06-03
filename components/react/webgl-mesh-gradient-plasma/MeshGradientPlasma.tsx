"use client";

import * as React from "react";
import { MeshGradient } from "@paper-design/shaders-react";

/**
 * MeshGradientPlasma
 * ------------------
 * A flowing WebGL mesh-gradient of color spots that swirl and distort like
 * plasma — built for a high-end animated hero canvas. Runs a zero-dependency
 * GLSL fragment shader on a <canvas> via @paper-design/shaders-react: each
 * color spot travels its own trajectory and is warped by noise-based organic
 * distortion plus a controllable swirl/vortex, finished with film grain.
 *
 * This is real-time shader output — NOT a static CSS mesh.
 *
 * Respects prefers-reduced-motion by freezing the animation on a single,
 * still-beautiful frame.
 */
export interface MeshGradientPlasmaProps {
  /** Up to 10 color spots (hex / rgb / hsl). Order affects spot trajectories. */
  colors?: string[];
  /** Animation speed. 0 = frozen, 1 = nominal. Default 0.6. */
  speed?: number;
  /** Organic noise distortion power, 0–1. Default 0.85. */
  distortion?: number;
  /** Vortex / swirl power, 0–1. Default 0.7. */
  swirl?: number;
  /** Grain distortion at shape edges, 0–1. Default 0.18. */
  grainMixer?: number;
  /** Post-process film-grain overlay, 0–1. Default 0.32. */
  grainOverlay?: number;
  /** Zoom of the field, 0.01–4. Default 1. */
  scale?: number;
  /** Field rotation in degrees, 0–360. Default 0. */
  rotation?: number;
  /** Fixed starting frame (ms). Used as the still frame when motion is reduced. */
  frame?: number;
  /** Extra classes for the wrapping element. */
  className?: string;
  /** Inline styles for the wrapping element. */
  style?: React.CSSProperties;
  /** Content rendered on top of the canvas (headline, CTA, etc.). */
  children?: React.ReactNode;
}

/** Brand "Sand & Surf" default spots — ocean teals melting into warm sand. */
const DEFAULT_COLORS = ["#0f5c5c", "#1f8a8a", "#2ec3c3", "#ece0cd", "#f4ece0"];

/** SSR-safe hook that reports whether the user prefers reduced motion. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    // addEventListener is the modern API; fall back for old Safari.
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  return reduced;
}

export function MeshGradientPlasma({
  colors = DEFAULT_COLORS,
  speed = 0.6,
  distortion = 0.85,
  swirl = 0.7,
  grainMixer = 0.18,
  grainOverlay = 0.32,
  scale = 1,
  rotation = 0,
  frame = 9000,
  className = "",
  style,
  children,
}: MeshGradientPlasmaProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={style}
    >
      <MeshGradient
        colors={colors}
        // Freeze on a still frame when the user prefers reduced motion.
        speed={reduced ? 0 : speed}
        frame={frame}
        distortion={distortion}
        swirl={swirl}
        grainMixer={grainMixer}
        grainOverlay={grainOverlay}
        scale={scale}
        rotation={rotation}
        fit="cover"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Content layer above the shader canvas. */}
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}

export default MeshGradientPlasma;

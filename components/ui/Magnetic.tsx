"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export type MagneticProps = {
  children: React.ReactNode;
  /** Extra hit area around the element (px) */
  padding?: number;
  /** 0–1 — how strongly the cursor pulls the element */
  strength?: number;
  /** Max translate in px */
  maxOffset?: number;
  className?: string;
};

const SPRING = { stiffness: 260, damping: 22, mass: 0.55 };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Subtle cursor-follow wrapper. Use around buttons, links, or icons.
 * Disabled for coarse pointers and prefers-reduced-motion.
 */
export default function Magnetic({
  children,
  padding = 10,
  strength = 0.32,
  maxOffset = 16,
  className = "",
}: MagneticProps) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const active = finePointer && !reduceMotion;

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!active) return;
      const zone = zoneRef.current;
      if (!zone) return;
      const rect = zone.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (event.clientX - cx) * strength;
      const dy = (event.clientY - cy) * strength;
      x.set(clamp(dx, -maxOffset, maxOffset));
      y.set(clamp(dy, -maxOffset, maxOffset));
    },
    [active, maxOffset, strength, x, y],
  );

  return (
    <div
      ref={zoneRef}
      className={`inline-flex ${className}`.trim()}
      style={{ padding, margin: -padding }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <motion.div className="inline-flex" style={active ? { x: springX, y: springY } : undefined}>
        {children}
      </motion.div>
    </div>
  );
}

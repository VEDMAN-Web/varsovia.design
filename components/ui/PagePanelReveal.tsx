"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  reducedScaleFadeItem,
  scaleFadeItem,
  VIEWPORT_ONCE,
} from "@/lib/motionPresets";

type PagePanelRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Mount when above the fold (contact form under hero) */
  trigger?: "inView" | "mount";
};

/** Card / panel entrance — matches showcase spec card (scale + rise, no layout change). */
export default function PagePanelReveal({
  children,
  className = "",
  delay = 0,
  trigger = "inView",
}: PagePanelRevealProps) {
  const reduceMotion = useReducedMotion();
  const item = reduceMotion ? reducedScaleFadeItem : scaleFadeItem;

  const motionTrigger =
    trigger === "mount"
      ? { initial: "hidden" as const, animate: "visible" as const }
      : {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: VIEWPORT_ONCE,
        };

  return (
    <motion.div
      className={className}
      {...motionTrigger}
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren: delay, staggerChildren: 0.06 },
        },
      }}
    >
      <motion.div variants={item}>{children}</motion.div>
    </motion.div>
  );
}

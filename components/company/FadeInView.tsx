"use client";

import { motion, useReducedMotion } from "framer-motion";
import { companyTransition } from "@/components/company/companyLayoutShared";

type FadeInViewProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
};

export default function FadeInView({
  children,
  className = "",
  delay = 0,
  y = 24,
  x = 0,
  scale = 1,
}: FadeInViewProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y, x, scale }
      }
      whileInView={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, x: 0, scale: 1 }
      }
      viewport={{ once: true, margin: "-48px" }}
      transition={{ ...companyTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

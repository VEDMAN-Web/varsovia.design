"use client";

import { motion } from "framer-motion";
import { companyTransition } from "@/components/company/companyLayoutShared";

type FadeInViewProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export default function FadeInView({ children, className = "", delay = 0, y = 24 }: FadeInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ ...companyTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

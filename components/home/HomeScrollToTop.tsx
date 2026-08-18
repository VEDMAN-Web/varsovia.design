"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useOptionalLenis } from "@/components/providers/SmoothScroll";
import { useScrolledPast } from "@/hooks/useScrolledPast";

const SHOW_AFTER_PX = 420;

function ScrollTopIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="text-[#6a414d]"
    >
      <path
        d="M8 12.25V3.15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M4.35 7.35 8 3.15 11.65 7.35"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12.75h8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export default function HomeScrollToTop() {
  const t = useTranslations("common");
  const lenis = useOptionalLenis();
  const reduceMotion = useReducedMotion();
  const visible = useScrolledPast(SHOW_AFTER_PX);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function scrollToTop() {
    if (lenis) {
      lenis.scrollTo(0, { duration: reduceMotion ? 0 : 1.15 });
      return;
    }
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="home-scroll-top"
          type="button"
          aria-label={t("scrollToTop")}
          onClick={scrollToTop}
          initial={{ x: 72, opacity: 0, scale: 0.88 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 72, opacity: 0, scale: 0.88 }}
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : { type: "spring", stiffness: 340, damping: 26, mass: 0.85 }
          }
          whileHover={reduceMotion ? undefined : { scale: 1.06 }}
          whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          className="group fixed bottom-6 right-4 z-40 flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#6a414d]/18 bg-white shadow-[0_8px_28px_rgba(106,65,77,0.14)] touch-manipulation sm:bottom-8 sm:right-6 md:size-11"
        >
          <span className="relative z-[1] flex items-center justify-center">
            <ScrollTopIcon />
          </span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

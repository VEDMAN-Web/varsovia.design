"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  SHOWCASE_DETAIL_HERO_MOTION,
  SHOWCASE_GALLERY_MOTION,
} from "@/components/showcase/showcaseGalleryMotionShared";

type ImageHeroBandProps = {
  image: string;
  alt: string;
  sectionClassName?: string;
  overlayClassName?: string;
  /** Sets data-nav-backdrop on the section (showcase detail uses dark) */
  navBackdrop?: "dark" | "light" | false;
};

const DEFAULT_SECTION =
  "relative h-[min(75vh,720px)] min-h-[420px] w-full sm:min-h-[480px]";
const DEFAULT_OVERLAY =
  "pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#f7f3f2]/20";

/** Full-bleed hero: immediate image paint + overlay fade + optional scroll scale. */
export default function ImageHeroBand({
  image,
  alt,
  sectionClassName = DEFAULT_SECTION,
  overlayClassName = DEFAULT_OVERLAY,
  navBackdrop = "dark",
}: ImageHeroBandProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion
      ? [1, 1]
      : [SHOWCASE_DETAIL_HERO_MOTION.scrollScale.min, SHOWCASE_DETAIL_HERO_MOTION.scrollScale.max],
  );

  return (
    <section
      ref={sectionRef}
      {...(navBackdrop ? { "data-nav-backdrop": navBackdrop } : {})}
      className={sectionClassName}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="h-full w-full will-change-transform" style={{ scale: imageScale }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={alt}
            className="h-full w-full object-cover object-center"
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
        <motion.div
          aria-hidden
          className={overlayClassName}
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: SHOWCASE_DETAIL_HERO_MOTION.overlay.duration,
            delay: reduceMotion ? 0 : SHOWCASE_DETAIL_HERO_MOTION.overlay.delay,
            ease: SHOWCASE_GALLERY_MOTION.ease,
          }}
        />
      </div>
    </section>
  );
}

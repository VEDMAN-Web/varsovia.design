"use client";

import { motion, useReducedMotion } from "framer-motion";
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

/** Full-bleed hero. No scroll-linked scale — native compositor scrolling only. */
export default function ImageHeroBand({
  image,
  alt,
  sectionClassName = DEFAULT_SECTION,
  overlayClassName = DEFAULT_OVERLAY,
  navBackdrop = "dark",
}: ImageHeroBandProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      {...(navBackdrop ? { "data-nav-backdrop": navBackdrop } : {})}
      className={sectionClassName}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={alt}
            className="h-full w-full object-cover object-center"
            fetchPriority="high"
            decoding="async"
          />
        </div>
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

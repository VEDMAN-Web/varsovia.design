"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  SHOWCASE_DETAIL_HERO_MOTION,
  SHOWCASE_GALLERY_MOTION,
} from "@/components/showcase/showcaseGalleryMotionShared";
import { shouldUseScrollParallax } from "@/lib/scrollRuntime";

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

function Overlay({
  className,
  reduceMotion,
}: {
  className: string;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      aria-hidden
      className={className}
      initial={{ opacity: reduceMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: SHOWCASE_DETAIL_HERO_MOTION.overlay.duration,
        delay: reduceMotion ? 0 : SHOWCASE_DETAIL_HERO_MOTION.overlay.delay,
        ease: SHOWCASE_GALLERY_MOTION.ease,
      }}
    />
  );
}

function HeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover object-center"
      fetchPriority="high"
      decoding="async"
    />
  );
}

function ParallaxHeroImage({ src, alt, sectionRef }: { src: string; alt: string; sectionRef: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [SHOWCASE_DETAIL_HERO_MOTION.scrollScale.min, SHOWCASE_DETAIL_HERO_MOTION.scrollScale.max],
  );

  return (
    <motion.div className="h-full w-full will-change-transform" style={{ scale: imageScale }}>
      <HeroImage src={src} alt={alt} />
    </motion.div>
  );
}

/** Full-bleed hero: immediate image paint + overlay fade. Scroll scale is desktop-only. */
export default function ImageHeroBand({
  image,
  alt,
  sectionClassName = DEFAULT_SECTION,
  overlayClassName = DEFAULT_OVERLAY,
  navBackdrop = "dark",
}: ImageHeroBandProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [parallax, setParallax] = useState(false);

  useEffect(() => {
    setParallax(shouldUseScrollParallax());
  }, []);

  return (
    <section
      ref={sectionRef}
      {...(navBackdrop ? { "data-nav-backdrop": navBackdrop } : {})}
      className={sectionClassName}
    >
      <div className="absolute inset-0 overflow-hidden">
        {parallax && !reduceMotion ? (
          <ParallaxHeroImage src={image} alt={alt} sectionRef={sectionRef} />
        ) : (
          <div className="h-full w-full">
            <HeroImage src={image} alt={alt} />
          </div>
        )}
        <Overlay className={overlayClassName} reduceMotion={reduceMotion} />
      </div>
    </section>
  );
}

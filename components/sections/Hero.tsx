"use client";

import { motion } from "framer-motion";
import { useIntroComplete } from "@/components/preloader/IntroProvider";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

export type HeroContent = {
  eyebrow?: string;
  headline: string;
  subtitle?: string;
  heroImage?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero({
  eyebrow = "VARSOVIA DESIGN",
  headline,
  subtitle,
  heroImage = MEDIA.hero,
  primaryCtaLabel = "Explore Kitchens",
  primaryCtaHref = "#products",
  secondaryCtaLabel = "Free Consultation",
  secondaryCtaHref = "#contact",
}: HeroContent) {
  const introComplete = useIntroComplete();

  return (
    <section id="home" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={resolveMediaUrl(heroImage, MEDIA.hero)}
          alt="Varsovia Design modular kitchen"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/5" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-end px-[clamp(1.25rem,7vw,100px)] pb-16 md:pb-24">
        <div className="max-w-3xl">
          {eyebrow ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.42, delay: 0.06, ease: REVEAL_EASE }}
              className="mb-4 font-display text-sm tracking-[0.35em] text-white/85 md:text-base"
            >
              {eyebrow}
            </motion.p>
          ) : null}

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.45, delay: 0.1, ease: REVEAL_EASE }}
            className="font-display text-[clamp(1.85rem,4.5vw,3.6rem)] font-bold leading-[1.12] tracking-[0.04em] text-white"
          >
            {headline}
          </motion.h1>

          {subtitle ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.42, delay: 0.12, ease: REVEAL_EASE }}
              className="font-outfit mt-4 text-[clamp(1rem,1.8vw,1.25rem)] font-normal leading-snug text-white/90"
            >
              {subtitle}
            </motion.p>
          ) : null}

          {(primaryCtaLabel || secondaryCtaLabel) && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.4, delay: 0.14, ease: REVEAL_EASE }}
              className="mt-8 flex flex-wrap gap-4"
            >
              {primaryCtaLabel && primaryCtaHref ? (
                <a href={primaryCtaHref} className="btn-primary rounded-md">
                  {primaryCtaLabel}
                </a>
              ) : null}
              {secondaryCtaLabel && secondaryCtaHref ? (
                <a
                  href={secondaryCtaHref}
                  className="inline-flex items-center justify-center rounded-md border border-white/70 px-7 py-3 text-[0.8rem] tracking-[0.12em] uppercase text-white transition hover:bg-white hover:text-maroon"
                >
                  {secondaryCtaLabel}
                </a>
              ) : null}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

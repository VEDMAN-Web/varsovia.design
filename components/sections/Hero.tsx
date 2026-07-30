"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useIntroComplete } from "@/components/preloader/IntroProvider";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

export type HeroContent = {
  eyebrow?: string;
  headline?: string;
  subtitle?: string;
  heroImage?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero({
  eyebrow,
  headline,
  subtitle,
  heroImage = MEDIA.hero,
  primaryCtaLabel,
  primaryCtaHref = "#products",
  secondaryCtaLabel,
  secondaryCtaHref = "#contact",
}: HeroContent) {
  const t = useTranslations("home");
  const introComplete = useIntroComplete();
  const resolvedEyebrow = eyebrow ?? t("heroEyebrow");
  const resolvedHeadline = headline || t("heroHeadline");
  const resolvedPrimaryCta = primaryCtaLabel ?? t("heroPrimaryCta");
  const resolvedSecondaryCta = secondaryCtaLabel ?? t("heroSecondaryCta");

  return (
    <section id="home" className="relative h-[100svh] min-h-[460px] w-full overflow-hidden sm:min-h-[520px] md:min-h-[560px]">
      <div className="absolute inset-0">
        <img
          src={resolveMediaUrl(heroImage, MEDIA.hero)}
          alt={t("heroImageAlt")}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/5" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-end px-[clamp(1rem,5vw,100px)] pb-10 sm:pb-16 md:pb-24">
        <div className="max-w-3xl min-w-0">
          {eyebrow !== undefined && resolvedEyebrow ? (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.42, delay: 0.06, ease: REVEAL_EASE }}
              className="mb-3 font-display text-xs tracking-[0.22em] text-white/85 sm:mb-4 sm:text-sm sm:tracking-[0.35em] md:text-base"
            >
              {resolvedEyebrow}
            </motion.p>
          ) : null}

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.45, delay: 0.1, ease: REVEAL_EASE }}
            className="font-display text-balance break-words text-[clamp(1.55rem,5.2vw,3.6rem)] font-bold leading-[1.12] tracking-[0.03em] text-white sm:tracking-[0.04em]"
          >
            {resolvedHeadline}
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

          {(resolvedPrimaryCta || resolvedSecondaryCta) && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.4, delay: 0.14, ease: REVEAL_EASE }}
              className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4"
            >
              {resolvedPrimaryCta && primaryCtaHref ? (
                <a href={primaryCtaHref} className="btn-primary w-full rounded-md text-center sm:w-auto">
                  {resolvedPrimaryCta}
                </a>
              ) : null}
              {resolvedSecondaryCta && secondaryCtaHref ? (
                <a
                  href={secondaryCtaHref}
                  className="inline-flex w-full items-center justify-center rounded-md border border-white/70 px-6 py-3 text-[0.75rem] tracking-[0.1em] uppercase text-white transition hover:bg-white hover:text-maroon sm:w-auto sm:px-7 sm:text-[0.8rem] sm:tracking-[0.12em]"
                >
                  {resolvedSecondaryCta}
                </a>
              ) : null}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

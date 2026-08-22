"use client";

import { memo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  SECTION_BLOCK_CLASS,
  SECTION_SUBTITLE_CLASS,
  SECTION_TITLE_CLASS,
  SECTION_BLOCK_GRADIENT,
} from "@/components/ui/SectionHeading";
import SectionShell, { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";
import {
  collageReveal,
  fadeUpBlurItem,
  fadeUpItem,
  reducedFadeUpItem,
  REVEAL_EASE,
  revealTransition,
  staggerContainer,
  VIEWPORT_ONCE,
} from "@/lib/motionPresets";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";
import {
  ABOUT_COLLAGE_ASPECT,
  ABOUT_COLLAGE_TILE_CLASS,
  ABOUT_LAYOUT,
} from "@/components/sections/aboutLayoutShared";

const FALLBACK_ABOUT_IMAGES = [...MEDIA.about];

type AboutProps = {
  title?: string;
  subtitle?: string;
  text?: string;
  images?: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

function AboutComponent({
  title,
  subtitle,
  text,
  images,
  ctaLabel,
  ctaHref = "#projects",
}: AboutProps) {
  const t = useTranslations("home");
  const tSite = useTranslations("siteFallback");
  const [hovered, setHovered] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const defaultParagraphs = tSite("aboutText").split(/\n+/).filter(Boolean);
  const paragraphs = text ? text.split(/\n+/).filter(Boolean) : defaultParagraphs;
  const displayTitle = title || t("aboutTitle");
  const displaySubtitle = subtitle || t("aboutSubtitle");

  const displayImages = ABOUT_LAYOUT.map((layout, i) => ({
    src: resolveMediaUrl(images?.[i], FALLBACK_ABOUT_IMAGES[i]),
    alt: t(layout.altKey),
    className: layout.className,
  }));

  const headingBlockClass = `${SECTION_BLOCK_CLASS} w-full ${SECTION_HEADING_WIDE}`.trim();
  const textItem: Variants = reduceMotion ? reducedFadeUpItem : fadeUpItem;
  const subtitleItem: Variants = reduceMotion ? reducedFadeUpItem : fadeUpBlurItem;

  return (
    <section
      id="about"
      className={`bg-[#fdf2f0] ${SITE_SECTION_PADDING_Y} !pt-[4.5rem] sm:!pt-[5.5rem] md:!pt-[7.5rem]`}
    >
      <SectionShell>
        <motion.div
          className={headingBlockClass}
          style={{ background: SECTION_BLOCK_GRADIENT }}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          variants={staggerContainer(0.14, 0.04)}
        >
          <motion.h2 className={SECTION_TITLE_CLASS} variants={subtitleItem}>
            {displayTitle}
          </motion.h2>
          <motion.p className={SECTION_SUBTITLE_CLASS} variants={subtitleItem}>
            {displaySubtitle}
          </motion.p>
        </motion.div>

        <div className="mt-10 grid w-full items-center gap-10 sm:mt-12 lg:mt-16 lg:grid-cols-[1.38fr_1fr] lg:gap-x-12 xl:gap-x-20">
          <div
            className={`relative mx-auto ${ABOUT_COLLAGE_ASPECT} w-full max-w-[640px] min-w-0 lg:mx-0 lg:max-w-none`}
            onMouseLeave={() => setHovered(null)}
          >
            {displayImages.map((img, i) => {
              const isHovered = hovered === i;
              const isDimmed = hovered !== null && hovered !== i;
              const baseZ = i === 2 ? 3 : i === 1 ? 2 : 1;
              const reveal = reduceMotion
                ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: revealTransition(i * 0.08, 0.45) } }
                : collageReveal(i);

              return (
                <motion.button
                  key={img.src}
                  type="button"
                  aria-label={img.alt}
                  className={`absolute ${ABOUT_COLLAGE_TILE_CLASS} ${img.className}`}
                  style={{ zIndex: isHovered ? 20 : baseZ }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VIEWPORT_ONCE}
                  variants={reveal}
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                    opacity: isDimmed ? 0.58 : 1,
                  }}
                  transition={{ duration: 0.45, ease: REVEAL_EASE }}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <motion.img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover"
                    decoding="async"
                    animate={{ scale: isHovered ? 1.06 : 1 }}
                    transition={{ duration: 0.55, ease: REVEAL_EASE }}
                  />
                </motion.button>
              );
            })}
          </div>

          <motion.div
            className="w-full min-w-0 lg:pt-10"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            variants={staggerContainer(0.12, 0.15)}
          >
            {paragraphs.map((p, i) => (
              <motion.p
                key={p.slice(0, 32)}
                variants={textItem}
                custom={i}
                className="font-outfit mb-4 text-[clamp(1rem,1.6vw,1.25rem)] font-normal leading-[1.5] text-[#251b1e] sm:mb-5 sm:leading-[30px]"
              >
                {p}
              </motion.p>
            ))}

            <motion.a
              href={ctaHref || "#projects"}
              variants={textItem}
              className="font-outfit group mt-2 inline-flex items-center gap-1 text-[1.25rem] font-medium text-[#cf5374]"
              whileHover={reduceMotion ? undefined : { x: 3 }}
              transition={{ duration: 0.25, ease: REVEAL_EASE }}
            >
              <span className="underline decoration-[#cf5374]/70 underline-offset-4 transition-colors group-hover:text-[#cf5374] group-hover:decoration-[#cf5374]">
                {ctaLabel || t("aboutLearnMore")}
              </span>
              <span
                aria-hidden
                className="inline-block translate-x-0 transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </motion.a>
          </motion.div>
        </div>
      </SectionShell>
    </section>
  );
}

export default memo(AboutComponent);

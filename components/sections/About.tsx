"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionShell, { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

/** Figma Frame 2147205349 — layout positions within 686×500 collage */
const ABOUT_LAYOUT = [
  { altKey: "aboutImageAlt1" as const, className: "left-[1.75%] top-[0.2%] h-[76.2%] w-[43.4%]" },
  { altKey: "aboutImageAlt2" as const, className: "left-[37.9%] top-[26.2%] h-[44%] w-[56%]" },
  { altKey: "aboutImageAlt3" as const, className: "left-[10.9%] top-[54%] h-[44%] w-[51.3%]" },
];

const FALLBACK_ABOUT_IMAGES = [...MEDIA.about];

type AboutProps = {
  title?: string;
  text?: string;
  images?: string[];
};

export default function About({ title, text, images }: AboutProps) {
  const t = useTranslations("home");
  const tSite = useTranslations("siteFallback");
  const [hovered, setHovered] = useState<number | null>(null);

  const defaultParagraphs = tSite("aboutText").split(/\n+/).filter(Boolean);
  const paragraphs = text ? text.split(/\n+/).filter(Boolean) : defaultParagraphs;
  const displayTitle = title || t("aboutTitle");

  const displayImages = ABOUT_LAYOUT.map((layout, i) => ({
    src: resolveMediaUrl(images?.[i], FALLBACK_ABOUT_IMAGES[i]),
    alt: t(layout.altKey),
    className: layout.className,
  }));

  return (
    <section id="about" className={`bg-[#fdf2f0] ${SITE_SECTION_PADDING_Y}`}>
      {/* One synced shell — heading band + collage/text share the same width */}
      <SectionShell>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <SectionHeading
            title={displayTitle}
            subtitle={t("aboutSubtitle")}
            className={SECTION_HEADING_WIDE}
          />
        </motion.div>

        <div className="mt-10 grid w-full items-center gap-10 sm:mt-12 lg:mt-16 lg:grid-cols-[1.38fr_1fr] lg:gap-x-12 xl:gap-x-20">
          <div
            className="relative mx-auto aspect-[686/500] w-full max-w-[640px] min-w-0 lg:mx-0 lg:max-w-none"
            onMouseLeave={() => setHovered(null)}
          >
            {displayImages.map((img, i) => {
              const isHovered = hovered === i;
              const isDimmed = hovered !== null && hovered !== i;
              const baseZ = i === 2 ? 3 : i === 1 ? 2 : 1;

              return (
                <motion.button
                  key={img.src}
                  type="button"
                  aria-label={img.alt}
                  className={`absolute overflow-hidden rounded-[14px] border-2 border-white bg-white shadow-[0_10px_30px_rgba(80,40,50,0.12)] outline-none sm:rounded-[22px] sm:border-[3px] ${img.className}`}
                  style={{ zIndex: isHovered ? 20 : baseZ }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  animate={{
                    scale: isHovered ? 1.06 : 1,
                    opacity: isDimmed ? 0.55 : 1,
                    filter: isDimmed ? "brightness(0.85)" : "brightness(1)",
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-500"
                    style={{ transform: isHovered ? "scale(1.04)" : "scale(1)" }}
                  />
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full min-w-0 lg:pt-10"
          >
            {paragraphs.map((p) => (
              <p key={p.slice(0, 32)} className="mb-4 text-[0.95rem] leading-7 text-[#5a5254] sm:mb-5 sm:text-[1.02rem] sm:leading-8">
                {p}
              </p>
            ))}

            <a
              href="#projects"
              className="mt-2 inline-block text-[0.95rem] font-medium text-[#e85d8a] underline decoration-[#e85d8a]/70 underline-offset-4 transition hover:text-[#d44575] hover:decoration-[#d44575]"
            >
              {t("aboutLearnMore")}
            </a>
          </motion.div>
        </div>
      </SectionShell>
    </section>
  );
}

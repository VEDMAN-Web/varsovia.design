"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import AboutProcessDesktopTimeline from "@/components/about/AboutProcessDesktopTimeline";
import CompanySectionHeading from "@/components/company/CompanySectionHeading";
import FadeInView from "@/components/company/FadeInView";
import SectionHeadingReveal from "@/components/ui/SectionHeadingReveal";
import FixedBackgroundImage from "@/components/ui/FixedBackgroundImage";
import { galleryFromCms } from "@/lib/siteGalleryImages";
import { MEDIA } from "@/lib/mediaAssets";
import { DEFAULT_SITE_IMAGE_PATHS } from "@/lib/defaultSiteImages";
import { resolveMediaUrl } from "@/lib/mediaAssets";
import {
  COMPANY_BODY,
  COMPANY_HERO_SECTION_PAD,
  COMPANY_SHELL,
  PAGE_BODY_LEAD_CLASS,
  SECTION_BODY_CLASS,
  SECTION_HEADING_WIDE,
  SUBSECTION_TITLE_CLASS,
} from "@/components/company/companyLayoutShared";

type SiteBlock = { title?: string; text?: string; icon?: string };
type ProcessStep = { step: string; title: string; text: string; icon?: string };

export type AboutSite = {
  aboutIntro?: string;
  aboutStory?: string;
  aboutText?: string;
  aboutHeroSubtitle?: string;
  aboutImages?: string[];
  aboutStoryImages?: string[];
  vision?: SiteBlock;
  mission?: SiteBlock;
  values?: SiteBlock;
  processSteps?: ProcessStep[];
};

/** Same frame as COMPANY_IMAGE_FRAME, on this page's tighter 6px radius */
const STORY_IMAGE_FRAME =
  "overflow-hidden rounded-[6px] shadow-[0_8px_24px_rgba(107,44,58,0.02)] border border-[#e5dcd3]/30";

// Connector — mobile timeline
function TimelineConnectorMobile({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="relative z-10 flex items-center justify-center w-[10%] shrink-0">
      {/* Bold horizontal connector line on mobile */}
      <div className="relative w-full h-[4px] bg-[#dfc2c6]">
        {/* Animated colored progress line on hover */}
        <div
          className={`absolute top-0 left-0 bg-[#C94A5B] transition-all duration-[350ms] ease-out origin-left h-[4px]
            ${isHovered ? "w-full" : "w-0"}`}
        />
        {/* Circle dot in theme red positioned at the end of the line */}
        <div
          className={`absolute w-3 h-3 rounded-full bg-[#C94A5B] transition-transform duration-[350ms] ease-out
            right-0 top-1/2 -translate-y-1/2 translate-x-1/2
            ${isHovered ? "scale-[1.25]" : "scale-100"}`}
        />
      </div>
    </div>
  );
}

export default function AboutPageContent({ site }: { site?: AboutSite | null }) {
  const t = useTranslations("aboutPage");
  const tSite = useTranslations("siteFallback");
  const [hoveredProcessIndex, setHoveredProcessIndex] = useState<number | null>(null);
  const [hoveredStoryIndex, setHoveredStoryIndex] = useState<number | null>(null);

  const intro = site?.aboutIntro || site?.aboutText || tSite("aboutIntro");
  const storyText = site?.aboutStory || site?.aboutText || tSite("aboutStory");
  const heroSubtitle = site?.aboutHeroSubtitle || tSite("aboutHeroSubtitle");

  const heroGallery = galleryFromCms(site?.aboutImages, 3, MEDIA.about);

  const storyCollageFallback = [
    MEDIA.featured[0],
    MEDIA.featured[1],
    MEDIA.about[2],
    MEDIA.featured[3],
  ] as const;
  const storyImages = galleryFromCms(
    site?.aboutStoryImages?.length ? site.aboutStoryImages : site?.aboutImages,
    4,
    storyCollageFallback,
  );

  const D = DEFAULT_SITE_IMAGE_PATHS;
  const valueBlocks = [
    {
      title: site?.vision?.title || t("visionTitle"),
      text: site?.vision?.text || tSite("visionText"),
      iconPath: resolveMediaUrl(site?.vision?.icon, D.visionIcon),
    },
    {
      title: site?.mission?.title || t("missionTitle"),
      text: site?.mission?.text || tSite("missionText"),
      iconPath: resolveMediaUrl(site?.mission?.icon, D.missionIcon),
    },
    {
      title: site?.values?.title || t("valuesBlockTitle"),
      text: site?.values?.text || tSite("valuesText"),
      iconPath: resolveMediaUrl(site?.values?.icon, D.valuesIcon),
    },
  ];

  const defaultProcessSteps: ProcessStep[] = [
    { step: "01", title: tSite("process1Title"), text: tSite("process1Text"), icon: D.processIcons[0] },
    { step: "02", title: tSite("process2Title"), text: tSite("process2Text"), icon: D.processIcons[1] },
    { step: "03", title: tSite("process3Title"), text: tSite("process3Text"), icon: D.processIcons[2] },
    { step: "04", title: tSite("process4Title"), text: tSite("process4Text"), icon: D.processIcons[3] },
  ];

  const processStepSource =
    site?.processSteps && site.processSteps.length > 0
      ? defaultProcessSteps.map((fallback, i) => {
          const fromSite = site.processSteps![i];
          return fromSite
            ? {
                step: fromSite.step || fallback.step,
                title: fromSite.title,
                text: fromSite.text,
                icon: fromSite.icon || fallback.icon,
              }
            : fallback;
        })
      : defaultProcessSteps;

  const processSteps = processStepSource.map((item, i) => ({
    ...item,
    icon: resolveMediaUrl(item.icon, D.processIcons[i] ?? D.processIcons[0]),
  }));

  return (
    <div className="bg-[#f7f3f2] pt-[72px] pb-20 font-outfit md:pb-28">
      <section className={`${COMPANY_SHELL} ${COMPANY_HERO_SECTION_PAD}`}>
        <SectionHeadingReveal
          trigger="mount"
          title={t("heroTitle")}
          subtitle={heroSubtitle || undefined}
          titleAs="h1"
          expanded
          className={`mb-6 w-full rounded-[6px] md:mb-8 ${SECTION_HEADING_WIDE}`}
        >
          <p className={`mx-auto mt-8 max-w-4xl px-2 md:px-4 ${PAGE_BODY_LEAD_CLASS} !text-black`}>{intro}</p>
        </SectionHeadingReveal>

        {/* y=0 keeps this wrapper transform-free so the fixed background keeps working */}
        <FadeInView delay={0.1} y={0}>
          <FixedBackgroundImage
            src={heroGallery[1] || heroGallery[0]}
            alt={t("heroFeaturedAlt")}
            className="mx-auto h-[min(42vw,340px)] min-h-[220px] w-full rounded-[6px] border border-[#e5dcd3]/30 bg-white shadow-[0_10px_30px_rgba(107,44,58,0.04)] sm:h-[340px] md:h-[400px] lg:h-[440px]"
          />
        </FadeInView>
      </section>

      <section className={`${COMPANY_SHELL} mb-20 md:mb-28`}>
        <CompanySectionHeading
          title={t("valuesHeading")}
          subtitle={t("valuesSubtitle")}
          subtitleSentenceCase={false}
          className="mb-10 md:mb-14"
          radiusClassName="rounded-[6px]"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {valueBlocks.map((item, i) => {
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="group rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 md:p-10 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-[0_12px_36px_rgba(107,44,58,0.06)]"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E5D2D5]/70 shadow-[0_4px_14px_rgba(107,44,58,0.04)]">
                  <img src={item.iconPath} alt={item.title} className="w-11 h-11 object-contain" />
                </div>
                <h3 className={`mt-6 ${SUBSECTION_TITLE_CLASS} !text-black`}>{item.title}</h3>
                <div className="mt-3.5 h-[2px] w-[30px] bg-[#C94A5B] transition-all duration-[350ms] ease-out group-hover:w-[80px]" />
                <p className={`mt-5 ${SECTION_BODY_CLASS} leading-7 !text-black`}>{item.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className={`${COMPANY_SHELL} mb-20 md:mb-28`}>
        <CompanySectionHeading
          title={t("storyTitle")}
          subtitle={heroSubtitle || undefined}
          subtitleSentenceCase={false}
          className="mb-10"
          radiusClassName="rounded-[6px]"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mx-auto mb-12 max-w-4xl px-4 text-center md:mb-16 md:px-6 ${COMPANY_BODY} !text-black`}
        >
          {storyText}
        </motion.p>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 items-start"
          onMouseLeave={() => setHoveredStoryIndex(null)}
        >
          {storyImages.map((src, i) => {
            // Untouched grid keeps the alternating stagger; hovering raises that
            // image to the top row and drops every other one to the lowered row
            const isLowered =
              hoveredStoryIndex === null ? i % 2 === 0 : i !== hoveredStoryIndex;
            return (
              <motion.button
                key={src}
                type="button"
                aria-label={t("storyHighlightAria", { index: i + 1 })}
                onMouseEnter={() => setHoveredStoryIndex(i)}
                onFocus={() => setHoveredStoryIndex(i)}
                onBlur={() => setHoveredStoryIndex(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                className={`${STORY_IMAGE_FRAME} block w-full text-left outline-none transition-[margin-top] duration-[450ms] ease-out ${isLowered ? "mt-0 sm:mt-8 md:mt-12 lg:mt-16" : "mt-0"}`}
              >
                <img
                  src={src}
                  alt={t("storyHighlightAria", { index: i + 1 })}
                  className="aspect-[3/4] w-full object-cover transition duration-500 hover:scale-[1.02]"
                />
              </motion.button>
            );
          })}
        </div>
      </section>

      <AboutProcessDesktopTimeline
        title={t("processTitle")}
        subtitle={t("processSubtitle")}
        stepBadge={(step) => t("stepBadge", { step })}
        steps={processSteps}
      />

      {/* Our Process — Mobile Native Swipe Timeline */}
      <section className="block md:hidden pb-20 pt-6">
        <div className={`${COMPANY_SHELL} mb-8`}>
          <CompanySectionHeading
            title={t("processTitle")}
            subtitle={t("processSubtitle")}
            subtitleSentenceCase={false}
            radiusClassName="rounded-[6px]"
          />
        </div>

        <div className={`${COMPANY_SHELL} overflow-hidden`}>
          <div className="flex flex-row items-center overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full px-0 gap-0">
            {/* Start Spacer */}
            <div className="w-[12%] shrink-0" />

            {/* Step 1 */}
            <article
              className="group relative w-[76%] h-[280px] rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)] shrink-0 snap-center"
              onMouseEnter={() => setHoveredProcessIndex(0)}
              onMouseLeave={() => setHoveredProcessIndex(null)}
            >
              <div className="absolute top-8 right-8 text-[#783b4a] opacity-[0.3] scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-[0.45] group-hover:scale-105">
                <img src={processSteps[0].icon} alt={processSteps[0].title} className="w-[60px] h-[60px] object-contain partner-logo-img" />
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                  {t("stepBadge", { step: processSteps[0].step })}
                </span>
              </div>
              <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
                {processSteps[0].title}
              </h3>
              <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
                {processSteps[0].text}
              </p>
            </article>

            {/* Connector 1 */}
            <TimelineConnectorMobile isHovered={hoveredProcessIndex === 0} />

            {/* Step 2 */}
            <article
              className="group relative w-[76%] h-[280px] rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)] shrink-0 snap-center"
              onMouseEnter={() => setHoveredProcessIndex(1)}
              onMouseLeave={() => setHoveredProcessIndex(null)}
            >
              <div className="absolute top-8 right-8 text-[#783b4a] opacity-[0.3] scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-[0.45] group-hover:scale-105">
                <img src={processSteps[1].icon} alt={processSteps[1].title} className="w-[60px] h-[60px] object-contain partner-logo-img" />
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                  {t("stepBadge", { step: processSteps[1].step })}
                </span>
              </div>
              <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
                {processSteps[1].title}
              </h3>
              <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
                {processSteps[1].text}
              </p>
            </article>

            {/* Connector 2 */}
            <TimelineConnectorMobile isHovered={hoveredProcessIndex === 1} />

            {/* Step 3 */}
            <article
              className="group relative w-[76%] h-[280px] rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)] shrink-0 snap-center"
              onMouseEnter={() => setHoveredProcessIndex(2)}
              onMouseLeave={() => setHoveredProcessIndex(null)}
            >
              <div className="absolute top-8 right-8 text-[#783b4a] opacity-[0.3] scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-[0.45] group-hover:scale-105">
                <img src={processSteps[2].icon} alt={processSteps[2].title} className="w-[60px] h-[60px] object-contain partner-logo-img" />
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                  {t("stepBadge", { step: processSteps[2].step })}
                </span>
              </div>
              <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
                {processSteps[2].title}
              </h3>
              <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
                {processSteps[2].text}
              </p>
            </article>

            {/* Connector 3 */}
            <TimelineConnectorMobile isHovered={hoveredProcessIndex === 2} />

            {/* Step 4 */}
            <article
              className="group relative w-[76%] h-[280px] rounded-[6px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-[6px] hover:shadow-[0_16px_36px_rgba(107,44,58,0.05)] shrink-0 snap-center"
              onMouseEnter={() => setHoveredProcessIndex(3)}
              onMouseLeave={() => setHoveredProcessIndex(null)}
            >
              <div className="absolute top-8 right-8 text-[#783b4a] opacity-[0.3] scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-[0.45] group-hover:scale-105">
                <img src={processSteps[3].icon} alt={processSteps[3].title} className="w-[60px] h-[60px] object-contain partner-logo-img" />
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[48px]" />
                <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                  {t("stepBadge", { step: processSteps[3].step })}
                </span>
              </div>
              <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
                {processSteps[3].title}
              </h3>
              <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
                {processSteps[3].text}
              </p>
            </article>

            {/* End Spacer */}
            <div className="w-[12%] shrink-0" />
          </div>
        </div>
      </section>
    </div>
  );
}

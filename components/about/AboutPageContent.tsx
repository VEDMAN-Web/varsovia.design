"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessagesSquare, PenTool, Hammer, Wrench } from "lucide-react";
import { fallbackHomeData } from "@/lib/fallbackData";
import { aboutHeroGalleryImages, aboutStoryCollageImages } from "@/lib/companyData";
import CompanySectionHeading from "@/components/company/CompanySectionHeading";
import FadeInView from "@/components/company/FadeInView";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  COMPANY_BODY,
  COMPANY_IMAGE_FRAME,
  COMPANY_SHELL,
  PAGE_BODY_LEAD_CLASS,
  SECTION_BODY_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/components/company/companyLayoutShared";

type SiteBlock = { title?: string; text?: string };
type ProcessStep = { step: string; title: string; text: string };

export type AboutSite = {
  aboutIntro?: string;
  aboutStory?: string;
  aboutText?: string;
  aboutHeroSubtitle?: string;
  aboutImages?: string[];
  vision?: SiteBlock;
  mission?: SiteBlock;
  values?: SiteBlock;
  processSteps?: ProcessStep[];
};

const PROCESS_ICONS = [MessagesSquare, PenTool, Hammer, Wrench] as const;

const FB = fallbackHomeData.site;

function TimelineConnector({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="relative z-10 flex items-center justify-center h-16 md:h-auto md:w-16 lg:w-24 xl:w-32 shrink-0">
      {/* Horizontal connector on Desktop, Vertical connector on Mobile */}
      <div className="relative w-[2px] h-full md:w-full md:h-[2px] bg-[#dfc2c6]">
        {/* Animated colored progress line on hover */}
        <div
          className={`absolute top-0 left-0 bg-[#C94A5B] transition-all duration-[350ms] ease-out origin-top md:origin-left
            ${isHovered ? "w-[2px] h-full md:w-full md:h-[2px]" : "w-[2px] h-0 md:w-0 md:h-[2px]"}`}
        />
        {/* Circle dot in theme red positioned at the end of the line */}
        <div
          className={`absolute w-2.5 h-2.5 rounded-full bg-[#C94A5B] transition-transform duration-[350ms] ease-out
            bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
            md:bottom-auto md:left-auto md:right-0 md:top-1/2 md:translate-x-1/2 md:-translate-y-1/2
            ${isHovered ? "scale-[1.25]" : "scale-100"}`}
        />
      </div>
    </div>
  );
}

export default function AboutPageContent({ site }: { site?: AboutSite | null }) {
  const [hoveredProcessIndex, setHoveredProcessIndex] = useState<number | null>(null);
  const intro = site?.aboutIntro || site?.aboutText || FB.aboutIntro;
  const storyText = site?.aboutStory || site?.aboutText || FB.aboutStory;
  const heroSubtitle = site?.aboutHeroSubtitle || FB.aboutHeroSubtitle;

  const heroGallery =
    site?.aboutImages && site.aboutImages.length >= 3
      ? site.aboutImages.slice(0, 3)
      : aboutHeroGalleryImages;

  const storyImages =
    site?.aboutImages && site.aboutImages.length >= 4
      ? site.aboutImages.slice(0, 4)
      : aboutStoryCollageImages;

  const valueBlocks = [
    { title: site?.vision?.title || FB.vision.title, text: site?.vision?.text || FB.vision.text, iconPath: "/vision/visionIcon.png" },
    { title: site?.mission?.title || FB.mission.title, text: site?.mission?.text || FB.mission.text, iconPath: "/vision/missionIcon.png" },
    { title: site?.values?.title || FB.values.title, text: site?.values?.text || FB.values.text, iconPath: "/vision/valuesIcon.png" },
  ];

  const processSteps = [
    {
      step: "01",
      title: site?.processSteps?.[0]?.title || "Consultation",
      text: site?.processSteps?.[0]?.text || "Understanding your lifestyle, needs, and design preferences.",
    },
    {
      step: "02",
      title: site?.processSteps?.[1]?.title || "Planning & Design",
      text: site?.processSteps?.[1]?.text || "Creating layouts, concepts, material selections, and realistic 3D visualizations.",
    },
    {
      step: "03",
      title: site?.processSteps?.[2]?.title || site?.processSteps?.[3]?.title || "Execution",
      text: site?.processSteps?.[2]?.text || site?.processSteps?.[3]?.text || "Expert craftsmanship, quality installation, and professional project execution.",
    },
  ];

  return (
    <div className="bg-[#f7f3f2] pt-[72px] pb-20 font-outfit md:pb-28">
      {/* Hero — title, subtitle, intro inside one band */}
      <section className={`${COMPANY_SHELL} pb-8 pt-10 md:pb-10 md:pt-16`}>
        <FadeInView className="mb-6 md:mb-8">
          <SectionHeading
            title="About Us"
            subtitle={heroSubtitle || undefined}
            titleAs="h1"
            expanded
            className="w-full rounded-[16px] !pb-6 md:!pb-8"
          >
            <p className={`mx-auto mt-8 max-w-4xl px-2 md:px-4 ${PAGE_BODY_LEAD_CLASS} !text-black`}>{intro}</p>
          </SectionHeading>
        </FadeInView>

        {/* Single Featured Image */}
        <FadeInView delay={0.1}>
          <div className="overflow-hidden rounded-[16px] border border-[#e5dcd3]/30 shadow-[0_10px_30px_rgba(107,44,58,0.04)] w-full bg-white">
            <img
              src={heroGallery[1] || heroGallery[0]}
              alt="About Us Featured"
              className="w-full h-auto aspect-[16/7] md:aspect-[2.1/1] object-cover transition duration-500 hover:scale-[1.01]"
            />
          </div>
        </FadeInView>
      </section>

      {/* Vision / Mission / Value */}
      <section className={`${COMPANY_SHELL} mb-20 md:mb-28`}>
        <CompanySectionHeading
          title="Vision. Mission. Value."
          subtitle="The foundation of everything we create."
          subtitleSentenceCase={false}
          className="mb-10 md:mb-14"
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
                className="group rounded-[16px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 md:p-10 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-[0_12px_36px_rgba(107,44,58,0.06)]"
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
      {/* Our Story */}
      <section className={`${COMPANY_SHELL} mb-20 md:mb-28`}>
        <CompanySectionHeading title="Our Story" subtitle={heroSubtitle || undefined} subtitleSentenceCase={false} className="mb-10" />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mx-auto mb-12 max-w-4xl px-4 text-center md:mb-16 md:px-6 ${COMPANY_BODY} !text-black`}
        >
          {storyText}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 items-start">
          {storyImages.map((src, i) => {
            const isStaggered = i % 2 === 0;
            return (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                className={`${COMPANY_IMAGE_FRAME} ${isStaggered ? "mt-0 sm:mt-8 md:mt-12 lg:mt-16" : "mt-0"}`}
              >
                <img
                  src={src}
                  alt={`Our story highlight ${i + 1}`}
                  className="aspect-[3/4] w-full object-cover transition duration-500 hover:scale-[1.02]"
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Our Process — 3 steps with responsive timeline and hover states */}
      <section className={`${COMPANY_SHELL} mb-20 md:mb-28`}>
        <CompanySectionHeading
          title="Our Process"
          subtitle="A seamless journey from vision to reality."
          subtitleSentenceCase={false}
          className="mb-12 md:mb-16"
        />

        <div className="flex flex-col md:flex-row items-stretch justify-between gap-0">
          {/* Card 1 */}
          <motion.article
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0 }}
            className="group relative flex-1 rounded-[16px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(107,44,58,0.06)]"
            onMouseEnter={() => setHoveredProcessIndex(0)}
            onMouseLeave={() => setHoveredProcessIndex(null)}
          >
            {/* Decorative background Icon */}
            <div className="absolute top-8 right-8 text-[#C94A5B] opacity-85 scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-100 group-hover:scale-105">
              <img src="/ourprocess/ourprocessStep1.png" alt="Consultation" className="w-[52px] h-[52px] object-contain partner-logo-img" />
            </div>

            {/* Step Label with vertical line */}
            <div className="flex items-start gap-2.5">
              <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[50px]" />
              <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                STEP 01
              </span>
            </div>

            {/* Card Title */}
            <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
              {processSteps[0].title}
            </h3>

            {/* Card Description */}
            <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
              {processSteps[0].text}
            </p>
          </motion.article>

          {/* Connector 1 */}
          <TimelineConnector isHovered={hoveredProcessIndex === 0} />

          {/* Card 2 */}
          <motion.article
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="group relative flex-1 rounded-[16px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(107,44,58,0.06)]"
            onMouseEnter={() => setHoveredProcessIndex(1)}
            onMouseLeave={() => setHoveredProcessIndex(null)}
          >
            {/* Decorative background Icon */}
            <div className="absolute top-8 right-8 text-[#C94A5B] opacity-85 scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-100 group-hover:scale-105">
              <img src="/ourprocess/ourprocessStep2.png" alt="Planning & Design" className="w-[52px] h-[52px] object-contain partner-logo-img" />
            </div>

            {/* Step Label with vertical line */}
            <div className="flex items-start gap-2.5">
              <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[50px]" />
              <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                STEP 02
              </span>
            </div>

            {/* Card Title */}
            <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
              {processSteps[1].title}
            </h3>

            {/* Card Description */}
            <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
              {processSteps[1].text}
            </p>
          </motion.article>

          {/* Connector 2 */}
          <TimelineConnector isHovered={hoveredProcessIndex === 1} />

          {/* Card 3 */}
          <motion.article
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="group relative flex-1 rounded-[16px] border border-[#e5dcd3]/20 bg-gradient-to-br from-[#FFF9F9] to-[#EBD5D7] p-8 text-left shadow-[0_8px_30px_rgba(107,44,58,0.02)] transition-all duration-[350ms] ease-out hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(107,44,58,0.06)]"
            onMouseEnter={() => setHoveredProcessIndex(2)}
            onMouseLeave={() => setHoveredProcessIndex(null)}
          >
            {/* Decorative background Icon */}
            <div className="absolute top-8 right-8 text-[#C94A5B] opacity-85 scale-100 transition-all duration-[350ms] ease-out group-hover:opacity-100 group-hover:scale-105">
              {(() => {
                const Icon = PROCESS_ICONS[2] || Wrench;
                return <Icon size={52} strokeWidth={1} />;
              })()}
            </div>

            {/* Step Label with vertical line */}
            <div className="flex items-start gap-2.5">
              <div className="w-[2px] bg-[#C94A5B] h-[32px] transition-all duration-[350ms] ease-out group-hover:h-[50px]" />
              <span className="font-outfit text-sm font-semibold uppercase tracking-[0.15em] text-[#6a414d] pt-1">
                STEP 03
              </span>
            </div>

            {/* Card Title */}
            <h3 className="font-outfit text-[20px] font-semibold !text-black mt-7">
              {processSteps[2].title}
            </h3>

            {/* Card Description */}
            <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7 !text-black`}>
              {processSteps[2].text}
            </p>
          </motion.article>
        </div>
      </section>
    </div>
  );
}

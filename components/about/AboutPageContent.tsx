"use client";

import { motion } from "framer-motion";
import { Eye, Flag, Gem, MessagesSquare, PenTool, Hammer, Wrench } from "lucide-react";
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

const ICONS = [Eye, Flag, Gem] as const;
const PROCESS_ICONS = [MessagesSquare, PenTool, Hammer, Wrench] as const;

const FB = fallbackHomeData.site;

export default function AboutPageContent({ site }: { site?: AboutSite | null }) {
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
    { title: site?.vision?.title || FB.vision.title, text: site?.vision?.text || FB.vision.text, icon: ICONS[0] },
    { title: site?.mission?.title || FB.mission.title, text: site?.mission?.text || FB.mission.text, icon: ICONS[1] },
    { title: site?.values?.title || FB.values.title, text: site?.values?.text || FB.values.text, icon: ICONS[2] },
  ];

  const processSteps =
    site?.processSteps && site.processSteps.length > 0 ? site.processSteps : FB.processSteps;

  return (
    <div className="bg-[#f7f3f2] pt-[72px] pb-20 font-outfit md:pb-28">
      {/* Hero — title, subtitle, intro inside one band (Figma) */}
      <section className={`${COMPANY_SHELL} pb-8 pt-10 md:pb-10 md:pt-16`}>
        <FadeInView className="mb-8 md:mb-12">
          <SectionHeading
            title="About Us"
            subtitle={heroSubtitle || undefined}
            titleAs="h1"
            expanded
            className="w-full rounded-[16px]"
          >
            <p className={`mx-auto mt-8 max-w-4xl px-2 md:px-4 ${PAGE_BODY_LEAD_CLASS}`}>{intro}</p>
          </SectionHeading>
        </FadeInView>
      </section>

      {/* Three-image gallery */}
      <section className={`${COMPANY_SHELL} mb-20 md:mb-28`}>
        <div className="grid gap-4 md:grid-cols-12 md:gap-5">
          {[
            { src: heroGallery[0], alt: "Interior detail", className: "md:col-span-3", imgClass: "aspect-[3/4] md:min-h-[360px] md:aspect-auto md:h-full" },
            { src: heroGallery[1], alt: "Varsovia Design interior", className: "md:col-span-6", imgClass: "aspect-[16/10] md:aspect-[2/1] md:min-h-[360px]" },
            { src: heroGallery[2], alt: "Interior craftsmanship", className: "md:col-span-3", imgClass: "aspect-[3/4] md:min-h-[360px] md:aspect-auto md:h-full" },
          ].map((item, i) => (
            <motion.div
              key={item.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className={`${item.className} ${COMPANY_IMAGE_FRAME}`}
            >
              <img src={item.src} alt={item.alt} className={`w-full object-cover transition duration-500 hover:scale-[1.02] ${item.imgClass}`} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision / Mission / Value */}
      <section className={`${COMPANY_SHELL} mb-20 md:mb-28`}>
        <CompanySectionHeading
          title="Vision. Mission. Value."
          subtitle="The foundation of everything we create"
          className="mb-10 md:mb-14"
        />

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {valueBlocks.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="rounded-[16px] border border-[#e5dcd3]/20 bg-[#F6EAEA] px-7 py-10 text-center shadow-[0_8px_30px_rgba(107,44,58,0.02)]"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#6a414d] shadow-[0_4px_14px_rgba(107,44,58,0.04)]">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className={`mt-6 ${SUBSECTION_TITLE_CLASS}`}>{item.title}</h3>
                <p className={`mt-4 ${SECTION_BODY_CLASS} leading-7`}>{item.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Our Story */}
      <section className={`${COMPANY_SHELL} mb-20 md:mb-28`}>
        <CompanySectionHeading title="Our Story" subtitle={heroSubtitle || undefined} className="mb-10" />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mx-auto mb-12 max-w-4xl px-4 text-center md:mb-16 md:px-6 ${COMPANY_BODY}`}
        >
          {storyText}
        </motion.p>

        <div className="grid gap-4 lg:gap-5">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={COMPANY_IMAGE_FRAME}>
            <img src={storyImages[0]} alt="Our story highlight" className="aspect-[21/9] w-full object-cover transition duration-500 hover:scale-[1.02]" />
          </motion.div>
          <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
            {[storyImages[1], storyImages[2]].map((src, i) => (
              <motion.div key={src} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 + i * 0.06 }} className={COMPANY_IMAGE_FRAME}>
                <img src={src} alt={`Story detail ${i + 1}`} className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-[1.02]" />
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className={COMPANY_IMAGE_FRAME}>
            <img src={storyImages[3]} alt="Our story showcase" className="aspect-[21/9] w-full object-cover transition duration-500 hover:scale-[1.02]" />
          </motion.div>
        </div>
      </section>

      {/* Our Process — 4 steps */}
      <section className={COMPANY_SHELL}>
        <CompanySectionHeading
          title="Our Process"
          subtitle="A seamless journey from vision to reality"
          className="mb-12 md:mb-16"
        />

        <div className="relative">
          <div aria-hidden className="absolute top-[48px] right-[8%] left-[8%] z-0 hidden h-[2px] bg-[#dfc2c6] md:block" />
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-6 lg:gap-8">
            {processSteps.map((item, i) => {
              const Icon = PROCESS_ICONS[i] || Wrench;
              return (
                <motion.article
                  key={item.step}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  className="relative z-10 rounded-[16px] border border-[#e5dcd3]/20 bg-[#F6EAEA] px-5 py-9 text-center shadow-[0_8px_30px_rgba(107,44,58,0.02)]"
                >
                  <div className="mx-auto mb-6 flex h-6 w-6 items-center justify-center rounded-full bg-[#6a414d] font-display text-[10px] font-bold text-white shadow-md">
                    {item.step}
                  </div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#6a414d] shadow-[0_4px_14px_rgba(107,44,58,0.04)]">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className={`mt-5 ${SUBSECTION_TITLE_CLASS} text-base lg:text-lg`}>{item.title}</h3>
                  <p className={`mt-3 ${SECTION_BODY_CLASS} leading-7`}>{item.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

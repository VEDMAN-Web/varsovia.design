"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Atom,
  Droplets,
  ShieldCheck,
  Wind,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import FadeInView from "@/components/company/FadeInView";
import CompanySectionHeading from "@/components/company/CompanySectionHeading";
import QualitySupportProcessSection from "@/components/company/QualitySupportProcessSection";
import { FaqAccordionList, FAQ_DEFAULT_OPEN_INDEX } from "@/components/faq/faqAccordionShared";
import {
  QAS_FAQ_BAND,
  QAS_FAQ_LIST_WRAP,
  QAS_FEATURE_CARD,
  QAS_FEATURE_GRID,
  QAS_FEATURE_IMAGE,
  QAS_HERO_BAND,
  QAS_HERO_BODY,
  QAS_MAIN,
  QAS_PAGE_BG,
  QAS_SECTION_SPACING,
  QAS_SHELL,
} from "@/components/company/qualitySaleLayoutShared";
import SectionHeading, {
  SECTION_SUBTITLE_CLASS,
  SECTION_TITLE_CLASS,
} from "@/components/ui/SectionHeading";
import { qualityGalleryImages } from "@/lib/companyData";
import { MEDIA, resolveMediaUrl } from "@/lib/mediaAssets";

const FEATURE_ICONS: LucideIcon[] = [Atom, Droplets, ShieldCheck, Wind];
const FEATURE_KEYS = ["feature1", "feature2", "feature3", "feature4"] as const;
const FAQ_KEYS = ["faq1", "faq2", "faq3", "faq4"] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function QualityFeatureColumn({
  index,
  title,
  image,
  imageAlt,
  Icon,
}: {
  index: number;
  title: string;
  image: string;
  imageAlt: string;
  Icon: LucideIcon;
}) {
  const imageFirst = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  const card = (
    <div className={QAS_FEATURE_CARD}>
      <span
        className="pointer-events-none absolute right-3 top-2 font-display text-[clamp(2.5rem,8vw,3.75rem)] font-bold leading-none text-[#6a414d]/[0.08]"
        aria-hidden
      >
        {number}
      </span>
      <Icon className="mb-auto h-8 w-8 text-[#6a414d] sm:h-9 sm:w-9" strokeWidth={1.35} aria-hidden />
      <p className="relative z-[1] mt-6 text-pretty font-outfit text-[clamp(0.8125rem,2vw,0.9375rem)] font-semibold leading-snug text-[#1f1f1f]">
        {title}
      </p>
    </div>
  );

  const photo = (
    <div className={QAS_FEATURE_IMAGE}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveMediaUrl(image, MEDIA.featured[0])}
        alt={imageAlt}
        className="aspect-[3/4] w-full object-cover min-[640px]:aspect-[4/5]"
      />
    </div>
  );

  return (
    <motion.div
      custom={index * 0.08}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="flex min-w-0 flex-col gap-[clamp(0.75rem,2.5vw,1rem)]"
    >
      {imageFirst ? (
        <>
          {photo}
          {card}
        </>
      ) : (
        <>
          {card}
          {photo}
        </>
      )}
    </motion.div>
  );
}

export default function QualityAfterSalesPageClient() {
  const t = useTranslations("qualitySale");
  const [openFaqIndex, setOpenFaqIndex] = useState(FAQ_DEFAULT_OPEN_INDEX);

  const features = useMemo(
    () =>
      FEATURE_KEYS.map((key, index) => ({
        title: t(`${key}Title`),
        image: qualityGalleryImages[index]?.src ?? MEDIA.featured[index],
        imageAlt: qualityGalleryImages[index]?.alt ?? "",
        Icon: FEATURE_ICONS[index] ?? Atom,
      })),
    [t],
  );

  const faqItems = useMemo(
    () => FAQ_KEYS.map((key) => ({ question: t(`${key}Q`), answer: t(`${key}A`) })),
    [t],
  );

  function toggleFAQ(index: number) {
    setOpenFaqIndex((prev) => (prev === index ? -1 : index));
  }

  return (
    <>
      <Navbar />
      <main className={`${QAS_MAIN} ${QAS_PAGE_BG}`}>
        <section className={`${QAS_SHELL} ${QAS_SECTION_SPACING}`}>
          <FadeInView>
            <div className={QAS_HERO_BAND}>
              <SectionHeading
                title={t("heroTitle")}
                subtitle={t("heroSubtitle")}
                titleAs="h1"
                expanded
                noGradient
                subtitleSentenceCase={false}
                titleClassName={`${SECTION_TITLE_CLASS} px-0.5`}
                subtitleClassName={`${SECTION_SUBTITLE_CLASS} mt-[clamp(1rem,3vw,1.875rem)] max-w-[min(100%,52rem)]`}
                className="!p-0"
              />
              <p className={QAS_HERO_BODY}>{t("heroBody")}</p>
            </div>
          </FadeInView>
        </section>

        <section className={`${QAS_SHELL} ${QAS_SECTION_SPACING}`}>
          <div className={QAS_FEATURE_GRID}>
            {features.map((item, index) => (
              <QualityFeatureColumn
                key={FEATURE_KEYS[index]}
                index={index}
                title={item.title}
                image={item.image}
                imageAlt={item.imageAlt}
                Icon={item.Icon}
              />
            ))}
          </div>
        </section>

        <section className={`${QAS_SHELL} ${QAS_SECTION_SPACING}`}>
          <QualitySupportProcessSection />
        </section>

        <section className={QAS_FAQ_BAND}>
          <div className={QAS_SHELL}>
            <CompanySectionHeading
              title={t("faqTitle")}
              subtitle={t("faqSubtitle")}
              subtitleSentenceCase={false}
              className="mb-[clamp(1.5rem,4vw,2.5rem)]"
            />

            <FadeInView>
              <div className={QAS_FAQ_LIST_WRAP}>
                <FaqAccordionList
                  faqs={faqItems}
                  listKey="quality-after-sales"
                  openIndex={openFaqIndex}
                  onToggle={toggleFAQ}
                  accentLayoutId="quality-sale-faq-accent"
                  inset
                />
              </div>
            </FadeInView>
          </div>
        </section>
      </main>
    </>
  );
}

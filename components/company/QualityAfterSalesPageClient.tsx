"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import CompanyHero from "@/components/company/CompanyHero";
import CompanySectionHeading from "@/components/company/CompanySectionHeading";
import FadeInView from "@/components/company/FadeInView";
import {
  COMPANY_CARD,
  COMPANY_IMAGE_FRAME,
  COMPANY_PAGE_BG,
  COMPANY_SHELL,
  companyTransition,
  SECTION_BODY_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/components/company/companyLayoutShared";
import { qualityGalleryImages } from "@/lib/companyData";
import { MEDIA } from "@/lib/mediaAssets";

const SUPPORT_STEP_KEYS = ["step1", "step2", "step3", "step4"] as const;
const FAQ_KEYS = ["faq1", "faq2", "faq3", "faq4"] as const;

export default function QualityAfterSalesPageClient() {
  const t = useTranslations("qualitySale");
  const tCommon = useTranslations("common");
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const supportSteps = useMemo(
    () =>
      SUPPORT_STEP_KEYS.map((key, index) => ({
        step: String(index + 1).padStart(2, "0"),
        title: t(`${key}Title`),
        text: t(`${key}Desc`),
        image: MEDIA.qualitySupport[index],
        imageRight: index % 2 === 1,
      })),
    [t],
  );

  const faqItems = useMemo(
    () => FAQ_KEYS.map((key) => ({ question: t(`${key}Q`), answer: t(`${key}A`) })),
    [t],
  );

  function toggleFAQ(index: number) {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }

  return (
    <>
      <Navbar />
      <main className={COMPANY_PAGE_BG}>
        <CompanyHero title={t("heroTitle")} subtitle={t("heroSubtitle")}>
          {t("heroBody")}
        </CompanyHero>

        <section className={`${COMPANY_SHELL} mb-20 md:mb-28`}>
          <FadeInView className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {qualityGalleryImages.map((item, i) => (
              <div key={item.src} className={COMPANY_IMAGE_FRAME}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className={`w-full object-cover transition duration-500 hover:scale-[1.02] ${
                    i < 2 ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-[3/2]"
                  }`}
                />
              </div>
            ))}
          </FadeInView>
        </section>

        <section className={`${COMPANY_SHELL} mb-20 pt-10 md:mb-28 md:pt-16`}>
          <div className="mb-12">
            <CompanySectionHeading title={t("supportTitle")} subtitle={t("supportSubtitle")} />
          </div>

          <div className="relative mx-auto mt-16 max-w-4xl">
            <div className="absolute bottom-0 left-[30px] top-0 z-0 w-0.5 -translate-x-1/2 bg-[#5c3d42]/30 md:left-1/2" />

            <div className="relative z-10 space-y-16">
              {supportSteps.map((item, i) => (
                <FadeInView key={item.step} delay={i * 0.06}>
                  <div
                    className={`relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center md:gap-0 ${
                      item.imageRight ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex w-full justify-start pl-14 md:w-[42%] ${
                        item.imageRight ? "md:pl-8" : "md:justify-end md:pl-0"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={companyTransition}
                        className="flex aspect-square w-48 items-center justify-center rounded-[16px] border border-[#e5dcd3]/30 bg-[#F6EAEA] p-4 shadow-[0_4px_15px_rgba(0,0,0,0.01)]"
                      >
                        <img
                          src={item.image}
                          alt={`Step ${item.step}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </motion.div>
                    </div>

                    <div className="absolute left-[30px] h-6 w-6 -translate-x-1/2 rounded-full border-4 border-[#f7f3f2] bg-[#5c3d42] md:left-1/2" />

                    <div
                      className={`w-full pl-14 text-left md:w-[42%] ${
                        item.imageRight ? "md:pr-8 md:text-right" : "md:pl-8"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase leading-none tracking-widest text-[#e85d8a]">
                        {tCommon("step", { step: item.step })}
                      </span>
                      <h4 className={`mt-1.5 ${SUBSECTION_TITLE_CLASS} text-lg`}>{item.title}</h4>
                      <p className={`mt-2 ${SECTION_BODY_CLASS} leading-relaxed`}>{item.text}</p>
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#F4EBEC]/80 via-[#F4EBEC]/30 to-[#f7f3f2] py-16 md:py-24">
          <div className={COMPANY_SHELL}>
            <CompanySectionHeading title={t("faqTitle")} subtitle={t("faqSubtitle")} className="mb-12 bg-transparent" />

            <div className="mx-auto max-w-4xl space-y-4">
              {faqItems.map((item, index) => {
                const isOpen = openIndexes.includes(index);
                return (
                  <FadeInView key={item.question} delay={index * 0.05}>
                    <div className={`overflow-hidden rounded-[12px] ${COMPANY_CARD}`}>
                      <button
                        type="button"
                        onClick={() => toggleFAQ(index)}
                        className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left text-[#5c3d42] hover:text-[#5c3d42]/90"
                      >
                        <span className={`${SECTION_BODY_CLASS} text-[0.95rem] font-semibold`}>{item.question}</span>
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#dfc2c6] text-[#5c3d42]">
                          {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div className={`border-t border-[#e5dcd3]/20 px-6 pb-6 pt-2 ${SECTION_BODY_CLASS} leading-7`}>
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </FadeInView>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

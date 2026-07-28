"use client";

import { useState } from "react";
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

const FAQ_ITEMS = [
  {
    question: "Is my project covered under warranty?",
    answer:
      "Yes — Varsovia Design provides warranty coverage on products and workmanship. Specific terms vary by project scope; your contract outlines full details.",
  },
  {
    question: "How can I request after-sales support?",
    answer:
      "Reach us through the contact page, email, or phone. Our support team will guide you through documentation and schedule a visit if needed.",
  },
  {
    question: "Do you provide maintenance services?",
    answer:
      "We offer scheduled maintenance and check-ups to keep your modular cabinetry, hardware, and finishes performing at their best.",
  },
  {
    question: "What happens if my warranty period has expired?",
    answer:
      "We still provide full support. Post-warranty services are available at nominal rates based on parts and technician visit requirements.",
  },
];

const SUPPORT_STEPS = [
  {
    step: "01",
    title: "Book Appointment",
    text: "Schedule a visit with our after-sales team at your convenience.",
    image: MEDIA.qualitySupport[0],
    imageRight: false,
  },
  {
    step: "02",
    title: "Checking",
    text: "Our specialists inspect the issue and assess the best course of action.",
    image: MEDIA.qualitySupport[1],
    imageRight: true,
  },
  {
    step: "03",
    title: "Repair & Cleaning",
    text: "We carry out repairs, adjustments, or deep cleaning as needed.",
    image: MEDIA.qualitySupport[2],
    imageRight: false,
  },
  {
    step: "04",
    title: "Finish",
    text: "Final quality check ensures your space is restored to perfect condition.",
    image: MEDIA.qualitySupport[3],
    imageRight: true,
  },
];

export default function QualityAfterSalesPage() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  function toggleFAQ(index: number) {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }

  return (
    <>
      <Navbar />
      <main className={COMPANY_PAGE_BG}>
        {/* 1. Hero */}
        <CompanyHero title="Quality After Sales" subtitle="Committed to your satisfaction beyond project completion">
          We believe exceptional interior design extends well beyond project completion. Varsovia offers reliable
          after-sales support, maintenance guidance, and prompt assistance — keeping your interiors looking and
          performing at their best for years to come.
        </CompanyHero>

        {/* 2. Four-image gallery collage (Figma) */}
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

        {/* 3. Support Process — vertical timeline (Figma) */}
        <section className={`${COMPANY_SHELL} mb-20 pt-10 md:mb-28 md:pt-16`}>
          <div className="mb-12">
            <CompanySectionHeading title="Support Process" subtitle="How it works" />
          </div>

          <div className="relative mx-auto mt-16 max-w-4xl">
            <div className="absolute bottom-0 left-[30px] top-0 z-0 w-0.5 -translate-x-1/2 bg-[#5c3d42]/30 md:left-1/2" />

            <div className="relative z-10 space-y-16">
              {SUPPORT_STEPS.map((item, i) => (
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
                        Step {item.step}
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

        {/* 4. FAQ — pink gradient band (Figma) */}
        <section className="bg-gradient-to-b from-[#F4EBEC]/80 via-[#F4EBEC]/30 to-[#f7f3f2] py-16 md:py-24">
          <div className={COMPANY_SHELL}>
            <CompanySectionHeading title="FAQ" subtitle="Questions & answers" className="mb-12 bg-transparent" />

            <div className="mx-auto max-w-4xl space-y-4">
              {FAQ_ITEMS.map((item, index) => {
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

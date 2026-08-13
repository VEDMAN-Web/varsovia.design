"use client";

import { ChevronLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import CompanyHero from "@/components/company/CompanyHero";
import { COMPANY_PAGE_BG, COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { PAGE_BODY_LEAD_CLASS } from "@/components/ui/SectionHeading";
import { Link } from "@/lib/i18n/navigation";
import { REVEAL_EASE, VIEWPORT_ONCE } from "@/lib/motionPresets";

export type LegalBlock = {
  heading: string;
  text: string;
};

export type LegalDocumentContent = {
  title: string;
  subtitle: string;
  updated: string;
  blocks: LegalBlock[];
};

type Props = {
  document: LegalDocumentContent;
};

export default function LegalDocumentPage({ document }: Props) {
  const t = useTranslations("common");
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Navbar />
      <main className={`${COMPANY_PAGE_BG} min-h-screen pt-[72px] sm:pt-[102px]`}>
        <CompanyHero
          title={document.title}
          subtitle={document.subtitle}
          compact
          subtitleSentenceCase
          leading={
            <Link
              href="/"
              className="font-outfit inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6a414d]/65 transition hover:text-[#cf5374] sm:text-[14px]"
            >
              <ChevronLeft size={15} strokeWidth={2} aria-hidden />
              {t("backToHome")}
            </Link>
          }
        />
        <section className={`${COMPANY_SHELL} pb-16 md:pb-24`}>
          <div className="mx-auto max-w-[48rem] space-y-8">
            {document.blocks.map((block, i) => (
              <motion.article
                key={`${block.heading}-${i}`}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{
                  duration: reduceMotion ? 0.25 : 0.55,
                  delay: reduceMotion ? 0 : Math.min(i * 0.05, 0.28),
                  ease: REVEAL_EASE,
                }}
              >
                <h2 className="font-outfit text-[1.125rem] font-semibold text-[#6a414d] sm:text-[1.25rem]">
                  {block.heading}
                </h2>
                <p className={`mt-3 whitespace-pre-line ${PAGE_BODY_LEAD_CLASS}`}>{block.text}</p>
              </motion.article>
            ))}
            <motion.p
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: reduceMotion ? 0.25 : 0.5, delay: 0.08, ease: REVEAL_EASE }}
              className="border-t border-[#6a414d]/12 pt-8 text-center font-outfit text-[12px] font-medium uppercase tracking-[0.14em] text-[#6a414d]/55 sm:text-[13px]"
            >
              {document.updated}
            </motion.p>
          </div>
        </section>
      </main>
    </>
  );
}

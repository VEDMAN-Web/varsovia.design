"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import CompanyHero from "@/components/company/CompanyHero";
import { COMPANY_PAGE_BG, COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { PAGE_BODY_LEAD_CLASS } from "@/components/ui/SectionHeading";
import { Link } from "@/lib/i18n/navigation";

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
            {document.blocks.map((block) => (
              <article key={block.heading}>
                <h2 className="font-outfit text-[1.125rem] font-semibold text-[#6a414d] sm:text-[1.25rem]">
                  {block.heading}
                </h2>
                <p className={`mt-3 whitespace-pre-line ${PAGE_BODY_LEAD_CLASS}`}>{block.text}</p>
              </article>
            ))}
            <p className="border-t border-[#6a414d]/12 pt-8 text-center font-outfit text-[12px] font-medium uppercase tracking-[0.14em] text-[#6a414d]/55 sm:text-[13px]">
              {document.updated}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

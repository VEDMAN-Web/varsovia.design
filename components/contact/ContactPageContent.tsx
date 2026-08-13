"use client";

import ContactFormPanel from "@/components/forms/ContactFormPanel";
import ContactOurLocationSection from "@/components/contact/ContactOurLocationSection";
import Showrooms from "@/components/sections/Showrooms";
import CompanyHero from "@/components/company/CompanyHero";
import PagePanelReveal from "@/components/ui/PagePanelReveal";
import SectionHeadingReveal from "@/components/ui/SectionHeadingReveal";
import { SECTION_SUBTITLE_CLASS } from "@/components/ui/SectionHeading";
import { COMPANY_SHELL, SECTION_HEADING_WIDE } from "@/components/company/companyLayoutShared";
import { fallbackHomeData } from "@/lib/fallbackData";
import type { SiteContent } from "@/lib/siteTypes";

const FALLBACK_IMAGES = fallbackHomeData.site.contactImages;

type ShowroomRow = {
  _id: string;
  name: string;
  location: string;
  image: string;
};

export default function ContactPageContent({
  site,
  showrooms = [],
}: {
  site?: SiteContent | null;
  showrooms?: ShowroomRow[];
}) {
  const imgs = site?.contactImages;
  const images =
    Array.isArray(imgs) && imgs.length > 0 ? imgs : FALLBACK_IMAGES;
  const section = site?.sectionCopy?.contact;
  const cp = site?.contactPage;
  const title =
    cp?.heroTitle?.trim() || section?.title?.trim() || "Get In touch";
  const subtitle =
    cp?.heroSubtitle?.trim() ||
    section?.subtitle?.trim() ||
    "Your dream space begins with a simple conversation";

  const showroomsTitle = cp?.showroomsTitle?.trim() || "Visit a showroom";
  const showroomsSubtitle =
    cp?.showroomsSubtitle?.trim() ||
    "Experience materials, layouts, and finishes in person at our locations.";

  return (
    <div className="bg-[#f7f3f2] pt-[72px] font-outfit">
      <CompanyHero
        title={title}
        subtitle={subtitle}
        subtitleSentenceCase={false}
        compact
        sectionClassName="!pb-0"
        fadeClassName="!mb-0"
        headingClassName="!min-h-0 !pb-4 !pt-7 sm:!min-h-0 sm:!pt-9 sm:!pb-4 md:!min-h-0 md:!pt-11 md:!pb-5"
        subtitleClassName={`${SECTION_SUBTITLE_CLASS} !mt-3 sm:!mt-4 md:!mt-5`}
      />

      <section className={`${COMPANY_SHELL} mt-3 pb-0 sm:mt-4 md:mt-5`}>
        <PagePanelReveal trigger="mount" delay={0.12}>
          <ContactFormPanel images={images} purpose="contact" />
        </PagePanelReveal>
      </section>

      <ContactOurLocationSection site={site} />

      {showrooms.length > 0 && (
        <section className={`${COMPANY_SHELL} pb-16 pt-10 sm:pb-20 sm:pt-12 md:pb-24`}>
          <SectionHeadingReveal
            title={showroomsTitle}
            subtitle={showroomsSubtitle}
            titleAs="h2"
            compact
            subtitleSentenceCase={false}
            subtitleClassName={`${SECTION_SUBTITLE_CLASS} !mt-3 sm:!mt-4`}
            className={`${SECTION_HEADING_WIDE} text-center`}
          />
          <div className="mt-10">
            <PagePanelReveal delay={0.08}>
              <Showrooms showrooms={showrooms} embedded />
            </PagePanelReveal>
          </div>
        </section>
      )}
    </div>
  );
}

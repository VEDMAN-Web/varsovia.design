"use client";

import ContactFormPanel from "@/components/forms/ContactFormPanel";
import ContactOurLocationSection from "@/components/contact/ContactOurLocationSection";
import CompanyHero from "@/components/company/CompanyHero";
import PagePanelReveal from "@/components/ui/PagePanelReveal";
import { SECTION_SUBTITLE_CLASS } from "@/components/ui/SectionHeading";
import { COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { fallbackHomeData } from "@/lib/fallbackData";
import type { SiteContent } from "@/lib/siteTypes";

const FALLBACK_IMAGES = fallbackHomeData.site.contactImages;

export default function ContactPageContent({ site }: { site?: SiteContent | null }) {
  // Use SSR-passed site prop directly — no useEffect, no flicker
  const imgs = site?.contactImages;
  const images =
    Array.isArray(imgs) && imgs.length > 0 ? imgs : FALLBACK_IMAGES;

  return (
    <div className="bg-[#f7f3f2] pt-[72px] font-outfit">
      <CompanyHero
        title="Get In touch"
        subtitle="Your dream space begins with a simple conversation"
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

      <ContactOurLocationSection />
    </div>
  );
}

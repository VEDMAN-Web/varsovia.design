"use client";

import { useTranslations } from "next-intl";
import ContactFormPanel from "@/components/forms/ContactFormPanel";
import SectionHeadingReveal from "@/components/ui/SectionHeadingReveal";
import SectionShell, { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

type ContactProps = {
  images: string[];
};

export default function Contact({ images }: ContactProps) {
  const t = useTranslations("home");
  const site = useSiteSettings();
  const section = site?.sectionCopy?.contact;

  return (
    <section id="contact" className={`bg-cream ${SITE_SECTION_PADDING_Y}`}>
      <SectionShell>
        <SectionHeadingReveal
          title={section?.title || t("contactTitle")}
          subtitle={section?.subtitle || t("contactSubtitle")}
          compact
          className={`${SECTION_HEADING_WIDE} pb-5 md:!min-h-0 md:pb-4`}
        />

        <div className="mt-6 md:mt-8">
          <ContactFormPanel images={images} purpose="contact" entranceMotion />
        </div>
      </SectionShell>
    </section>
  );
}

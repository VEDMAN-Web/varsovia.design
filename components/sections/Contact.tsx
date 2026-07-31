"use client";

import { useTranslations } from "next-intl";
import ContactFormPanel from "@/components/forms/ContactFormPanel";
import SectionHeadingReveal from "@/components/ui/SectionHeadingReveal";
import SectionShell, { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";

type ContactProps = {
  images: string[];
};

export default function Contact({ images }: ContactProps) {
  const t = useTranslations("home");

  return (
    <section id="contact" className={`bg-cream ${SITE_SECTION_PADDING_Y}`}>
      <SectionShell>
        <SectionHeadingReveal
          title={t("contactTitle")}
          subtitle={t("contactSubtitle")}
          className={`${SECTION_HEADING_WIDE} mb-8 sm:mb-10 md:mb-20`}
        />

        <ContactFormPanel images={images} purpose="contact" entranceMotion />
      </SectionShell>
    </section>
  );
}

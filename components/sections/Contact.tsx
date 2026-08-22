"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import ContactFormPanel from "@/components/forms/ContactFormPanel";
import SectionHeadingReveal from "@/components/ui/SectionHeadingReveal";
import SectionShell, { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { fadeUpItem, reducedFadeUpItem, VIEWPORT_ONCE } from "@/lib/motionPresets";

type ContactProps = {
  images: string[];
};

function ContactComponent({ images }: ContactProps) {
  const t = useTranslations("home");
  const site = useSiteSettings();
  const section = site?.sectionCopy?.contact;
  const reduceMotion = useReducedMotion();

  return (
    <section id="contact" className={`bg-cream ${SITE_SECTION_PADDING_Y}`}>
      <SectionShell>
        <SectionHeadingReveal
          title={section?.title || t("contactTitle")}
          subtitle={section?.subtitle || t("contactSubtitle")}
          compact
          className={`${SECTION_HEADING_WIDE} pb-5 md:!min-h-0 md:pb-4`}
        />

        <motion.div
          className="mt-6 md:mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          variants={reduceMotion ? reducedFadeUpItem : fadeUpItem}
        >
          <ContactFormPanel images={images} purpose="contact" entranceMotion={false} />
        </motion.div>
      </SectionShell>
    </section>
  );
}

export default memo(ContactComponent);

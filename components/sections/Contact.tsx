"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ContactFormPanel from "@/components/forms/ContactFormPanel";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionShell, { SECTION_HEADING_WIDE } from "@/components/ui/SectionShell";

type ContactProps = {
  images: string[];
};

export default function Contact({ images }: ContactProps) {
  const t = useTranslations("home");
  return (
    <section id="contact" className="bg-cream py-14 sm:py-16 md:pb-28 md:pt-20">
      <SectionShell>
        <SectionHeading
          title={t("contactTitle")}
          subtitle={t("contactSubtitle")}
          className={`${SECTION_HEADING_WIDE} mb-8 sm:mb-10 md:mb-20`}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="min-w-0"
        >
          <ContactFormPanel images={images} purpose="contact" />
        </motion.div>
      </SectionShell>
    </section>
  );
}

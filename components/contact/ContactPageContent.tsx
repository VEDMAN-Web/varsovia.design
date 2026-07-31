"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ContactFormPanel from "@/components/forms/ContactFormPanel";
import CompanyHero from "@/components/company/CompanyHero";
import { COMPANY_PAGE_BG, COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { fallbackHomeData } from "@/lib/fallbackData";

const FALLBACK_IMAGES = fallbackHomeData.site.contactImages;

export default function ContactPageContent() {
  const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);

  useEffect(() => {
    import("@/lib/api").then(({ fetchSite }) => {
      fetchSite()
        .then((site) => {
          const imgs = site?.contactImages;
          if (Array.isArray(imgs) && imgs.length > 0) {
            setImages(imgs);
          }
        })
        .catch(() => {/* keep fallback */});
    });
  }, []);

  return (
    <div className={COMPANY_PAGE_BG}>
      <CompanyHero
        title="Get In touch"
        subtitle="Your dream space begins with a simple conversation"
        subtitleSentenceCase={false}
      />

      <section className={`${COMPANY_SHELL} mt-6 pb-16 sm:mt-8 md:mt-10 md:pb-24`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ContactFormPanel images={images} purpose="contact" />
        </motion.div>
      </section>
    </div>
  );
}

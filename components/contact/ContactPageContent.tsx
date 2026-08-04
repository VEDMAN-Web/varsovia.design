"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ContactFormPanel from "@/components/forms/ContactFormPanel";
import ContactOurLocationSection from "@/components/contact/ContactOurLocationSection";
import CompanyHero from "@/components/company/CompanyHero";
import { COMPANY_SHELL } from "@/components/company/companyLayoutShared";
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
    <div className="bg-[#f7f3f2] pt-[72px] font-outfit">
      <CompanyHero
        title="Get In touch"
        subtitle="Your dream space begins with a simple conversation"
        subtitleSentenceCase={false}
        compact
        sectionClassName="!pb-0"
        fadeClassName="!mb-0"
        headingClassName="!min-h-0 !pb-4 !pt-7 sm:!min-h-0 sm:!pt-9 sm:!pb-4 md:!min-h-0 md:!pt-11 md:!pb-5"
        subtitleClassName="font-outfit mx-auto mt-3 max-w-[68rem] break-words px-2 text-[clamp(0.75rem,2vw,1.25rem)] font-normal uppercase tracking-[0.14em] text-[#cf5374] sm:mt-4 md:mt-5 sm:tracking-[0.28em]"
      />

      <section className={`${COMPANY_SHELL} mt-3 pb-0 sm:mt-4 md:mt-5`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ContactFormPanel images={images} purpose="contact" />
        </motion.div>
      </section>

      <ContactOurLocationSection />
    </div>
  );
}

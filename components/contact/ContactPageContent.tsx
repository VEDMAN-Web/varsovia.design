"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ContactFormPanel from "@/components/forms/ContactFormPanel";
import CompanyHero from "@/components/company/CompanyHero";
import { COMPANY_PAGE_BG, COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { fallbackHomeData } from "@/lib/fallbackData";
import { LogoWingSvg } from "@/components/preloader/preloaderLogo";

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

      <section className={`${COMPANY_SHELL} mt-20 pb-16 md:pb-24`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ContactFormPanel images={images} purpose="contact" />
        </motion.div>
      </section>

      {/* Our Location Section */}
      <section className={`${COMPANY_SHELL} mt-12 md:mt-20 pb-20 md:pb-28`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Custom Section Heading to force subtitle in a single line */}
          <div
            className="mx-auto flex min-h-[100px] w-full flex-col items-center justify-center px-4 py-6 sm:min-h-[130px] sm:px-6 md:h-[177px] md:py-0 w-full rounded-[16px]"
            style={{ background: "linear-gradient(180deg, rgba(130,94,105,0.22) 0%, rgba(244,235,236,0) 100%)" }}
          >
            <h2 className="font-display text-[clamp(1.45rem,3.4vw,3.125rem)] font-normal tracking-[0.1em] text-[#6a414d] uppercase">
              Our Location
            </h2>
            <p className="font-outfit mx-auto mt-[30px] max-w-none px-2 text-[clamp(0.55rem,1.35vw,1.375rem)] font-normal uppercase tracking-[0.18em] md:tracking-[0.3em] text-[#cf5374] whitespace-nowrap">
              Conveniently located to serve your interior design needs.
            </p>
          </div>

          <div className="w-full mt-10 md:mt-14 relative group">
            {/* Map Container */}
            <div className="w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[520px] rounded-[16px] overflow-hidden border border-[#e5dcd3]/30 shadow-[0_10px_30px_rgba(107,44,58,0.02)] transition-shadow duration-300 ease-in-out hover:shadow-[0_20px_45px_rgba(107,44,58,0.08)] bg-[#F6EAEA] relative">
              <iframe
                src="https://maps.google.com/maps?q=51.4505,-0.0526&hl=en&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Varsovia Design Location Map"
                className="w-full h-full"
              />

              {/* Custom Location Marker Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none flex flex-col items-center z-10 select-none">
                {/* Square Maroon Logo Card */}
                <div className="w-[50px] h-[50px] bg-[#6b2c3a] rounded-[4px] border border-[#e5dcd3]/20 flex items-center justify-center shadow-[0_4px_12px_rgba(107,44,58,0.15)] mb-1">
                  <LogoWingSvg className="h-[28px] w-[18px]" fill="white" />
                </div>
                {/* Red Teardrop Pin */}
                <div className="-mt-1">
                  <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                    <path
                      d="M12 0C5.37 0 0 5.37 0 12C0 19.8 12 28 12 28C12 28 24 19.8 24 12C24 5.37 18.63 0 12 0Z"
                      fill="#ef4444"
                    />
                    <circle cx="12" cy="12" r="4.5" fill="white" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

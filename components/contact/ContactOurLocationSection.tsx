"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { COMPANY_SHELL, SECTION_HEADING_WIDE } from "@/components/company/companyLayoutShared";
import { LogoWingSvg } from "@/components/preloader/preloaderLogo";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  CONTACT_LOCATION_BODY,
  CONTACT_LOCATION_CARD,
  CONTACT_LOCATION_HEADING_CLASS,
  CONTACT_LOCATION_MAP_FRAME,
  CONTACT_LOCATION_MAP_SHELL,
  CONTACT_LOCATION_MAP_WRAP,
  CONTACT_LOCATION_MARKER_BOX,
  CONTACT_LOCATION_SECTION_GAP,
  CONTACT_LOCATION_SECTION_PAD,
} from "@/components/contact/contactLocationShared";
import { CONTACT_MAP_EMBED_SRC } from "@/lib/contactLocation";
import { VIEWPORT_ONCE } from "@/lib/motionPresets";

function MapPinIcon() {
  return (
    <svg
      width="28"
      height="36"
      viewBox="0 0 28 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm"
      aria-hidden
    >
      <path
        d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0Z"
        fill="#EA4335"
      />
      <circle cx="14" cy="14" r="5" fill="white" />
    </svg>
  );
}

export default function ContactOurLocationSection() {
  const t = useTranslations("contact");

  return (
    <section
      className={`${COMPANY_SHELL} ${CONTACT_LOCATION_SECTION_GAP} ${CONTACT_LOCATION_SECTION_PAD}`.trim()}
    >
      <motion.div
        className={CONTACT_LOCATION_CARD}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionHeading
          title={t("ourLocationTitle")}
          subtitle={t("ourLocationSubtitle")}
          titleAs="h2"
          compact
          subtitleSentenceCase={false}
          subtitleClassName="font-outfit mx-auto mt-3 max-w-[68rem] break-words px-1 text-[clamp(0.6875rem,2.8vw,1.25rem)] font-normal uppercase tracking-[0.1em] text-[#cf5374] sm:mt-4 sm:tracking-[0.2em] md:mt-[30px] md:tracking-[0.28em]"
          className={`${SECTION_HEADING_WIDE} ${CONTACT_LOCATION_HEADING_CLASS}`.trim()}
        />

        <div className={CONTACT_LOCATION_BODY}>
          <div className={CONTACT_LOCATION_MAP_WRAP}>
            <div className={CONTACT_LOCATION_MAP_SHELL}>
              <iframe
                title={t("mapAriaLabel")}
                src={CONTACT_MAP_EMBED_SRC}
                className={CONTACT_LOCATION_MAP_FRAME}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                aria-hidden
              >
                <div className="flex flex-col items-center translate-y-[-4%] sm:translate-y-[-6%]">
                  <div className={CONTACT_LOCATION_MARKER_BOX}>
                    <LogoWingSvg className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" fill="white" />
                  </div>
                  <div className="-mt-0.5">
                    <MapPinIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { COMPANY_SHELL, SECTION_HEADING_WIDE } from "@/components/company/companyLayoutShared";
import {
  CONTACT_LOCATION_BODY,
  CONTACT_LOCATION_CARD,
  CONTACT_LOCATION_HEADING_CLASS,
  CONTACT_LOCATION_MAP_FRAME,
  CONTACT_LOCATION_MAP_SHELL,
  CONTACT_LOCATION_MAP_WRAP,
  CONTACT_LOCATION_SECTION_GAP,
  CONTACT_LOCATION_SECTION_PAD,
} from "@/components/contact/contactLocationShared";
import PagePanelReveal from "@/components/ui/PagePanelReveal";
import { SECTION_SUBTITLE_CLASS } from "@/components/ui/SectionHeading";
import SectionHeadingReveal from "@/components/ui/SectionHeadingReveal";
import {
  CONTACT_MAP_OFFICE,
  contactMapCoords,
  contactMapOpenHref,
} from "@/lib/contactLocation";
import type { SiteContent } from "@/lib/siteTypes";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const ContactLocationMap = dynamic(
  () => import("@/components/contact/ContactLocationMap"),
  {
    ssr: false,
    loading: () => <div className={CONTACT_LOCATION_MAP_FRAME} aria-hidden />,
  },
);

export default function ContactOurLocationSection({
  site,
}: {
  site?: SiteContent | null;
}) {
  const t = useTranslations("contact");
  const tFooter = useTranslations("footer");
  const cp = site?.contactPage;
  const title = cp?.locationTitle?.trim() || t("ourLocationTitle");
  const subtitle =
    cp?.locationSubtitle?.trim() || t("ourLocationSubtitle");
  const coords = contactMapCoords(cp?.mapEmbedUrl);
  const mapOpenHref = contactMapOpenHref(cp?.mapEmbedUrl);
  const mapAria = cp?.mapAriaLabel?.trim() || t("mapAriaLabel");

  return (
    <section
      className={`${COMPANY_SHELL} ${CONTACT_LOCATION_SECTION_GAP} ${CONTACT_LOCATION_SECTION_PAD}`.trim()}
    >
      <div className={CONTACT_LOCATION_CARD}>
        <SectionHeadingReveal
          title={title}
          subtitle={subtitle}
          titleAs="h2"
          compact
          subtitleSentenceCase={false}
          subtitleClassName={`${SECTION_SUBTITLE_CLASS} !mt-3 sm:!mt-4 md:!mt-[30px]`}
          className={`${SECTION_HEADING_WIDE} ${CONTACT_LOCATION_HEADING_CLASS}`.trim()}
        />

        <PagePanelReveal delay={0.1} className={CONTACT_LOCATION_BODY}>
          <div className={CONTACT_LOCATION_MAP_WRAP}>
            <div className={CONTACT_LOCATION_MAP_SHELL}>
              <ContactLocationMap lat={coords.lat} lng={coords.lng} title={mapAria} />
            </div>
            <div className="flex flex-col gap-1.5 px-[clamp(0.75rem,3vw,1.5rem)] py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-4">
              <p className="font-outfit min-w-0 text-[0.8125rem] leading-snug text-[#6a414d]/85 sm:text-sm">
                <span className="font-semibold text-[#6a414d]">{tFooter("samuiOffice")}</span>
                <span className="mx-1.5 text-[#6a414d]/35" aria-hidden>
                  ·
                </span>
                <span>{CONTACT_MAP_OFFICE.address}</span>
              </p>
              <a
                href={mapOpenHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-outfit shrink-0 text-[0.8125rem] font-semibold text-[#6a414d] underline-offset-4 transition-colors hover:text-[#cf5374] hover:underline sm:text-sm"
              >
                {t("openInMaps")}
              </a>
            </div>
          </div>
        </PagePanelReveal>
      </div>
    </section>
  );
}

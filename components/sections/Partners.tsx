"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionShell, { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";
import { resolveMediaUrl } from "@/lib/mediaAssets";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

const FALLBACK_LOGOS = [
  { name: "fischer", src: "/partners/figma/fischer.png", width: 133, height: 48 },
  { name: "Bostik", src: "/partners/figma/bostik.png", width: 101, height: 48 },
  { name: "Egger", src: "/partners/figma/egger.png", width: 120, height: 48 },
  { name: "Blum", src: "/partners/figma/blum.png", width: 118, height: 48 },
  { name: "Jowat", src: "/partners/figma/jowat.png", width: 98, height: 48 },
  { name: "Partner emblem", src: "/partners/figma/emblem.png", width: 29, height: 48 },
] as const;

type PartnerLogo = { name: string; src: string; width: number; height: number };

function PartnerLogoImage({ name, src, width, height }: PartnerLogo) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={width}
      height={height}
      className="partners-marquee-logo shrink-0 max-h-12 w-auto object-contain"
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  );
}

function PartnerLogoStrip({ logos, duplicate = false }: { logos: PartnerLogo[]; duplicate?: boolean }) {
  return (
    <div className="partners-marquee-strip" aria-hidden={duplicate || undefined}>
      {logos.map((partner) => (
        <PartnerLogoImage key={`${partner.name}-${duplicate ? "b" : "a"}`} {...partner} />
      ))}
    </div>
  );
}

type Partner = {
  _id: string;
  name: string;
  logo?: string;
};

export default function Partners({ partners = [] }: { partners?: Partner[] }) {
  const t = useTranslations("home");
  const site = useSiteSettings();
  const section = site?.sectionCopy?.partners;

  const logos = useMemo((): PartnerLogo[] => {
    const fromApi = partners
      .filter((p) => p.logo && String(p.logo).trim())
      .map((p) => ({
        name: p.name || "Partner",
        src: resolveMediaUrl(p.logo, "/partners/figma/fischer.png"),
        width: 120,
        height: 48,
      }));
    if (fromApi.length > 0) return fromApi;
    return [...FALLBACK_LOGOS];
  }, [partners]);

  return (
    <section id="partners" className={`bg-blush ${SITE_SECTION_PADDING_Y}`}>
      <SectionShell className="text-center">
        <SectionHeading
          title={section?.title || t("partnersTitle")}
          subtitle={section?.subtitle || t("partnersSubtitle")}
          className={SECTION_HEADING_WIDE}
        />
      </SectionShell>

      <SectionShell className="mt-10 overflow-hidden lg:mt-12" aria-label={t("partnersAria")}>
        <div className="partners-marquee">
          <div className="partners-marquee-track">
            <PartnerLogoStrip logos={logos} />
            <PartnerLogoStrip logos={logos} duplicate />
          </div>
        </div>
      </SectionShell>
    </section>
  );
}

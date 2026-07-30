"use client";

import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionShell, { SECTION_HEADING_WIDE } from "@/components/ui/SectionShell";

/** Figma logos — transparent PNGs (no tile background). */
const PARTNER_LOGOS = [
  { name: "fischer", src: "/partners/figma/fischer.png", width: 133, height: 48 },
  { name: "Bostik", src: "/partners/figma/bostik.png", width: 101, height: 48 },
  { name: "Egger", src: "/partners/figma/egger.png", width: 120, height: 48 },
  { name: "Blum", src: "/partners/figma/blum.png", width: 118, height: 48 },
  { name: "Jowat", src: "/partners/figma/jowat.png", width: 98, height: 48 },
  { name: "Partner emblem", src: "/partners/figma/emblem.png", width: 29, height: 48 },
] as const;

type PartnerLogo = (typeof PARTNER_LOGOS)[number];

function PartnerLogoImage({ name, src, width, height }: PartnerLogo) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={width}
      height={height}
      className="partners-marquee-logo shrink-0"
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  );
}

function PartnerLogoStrip({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="partners-marquee-strip" aria-hidden={duplicate || undefined}>
      {PARTNER_LOGOS.map((partner) => (
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

export default function Partners({ partners: _partners }: { partners: Partner[] }) {
  const t = useTranslations("home");
  return (
    <section id="partners" className="bg-blush py-12 sm:py-16 md:py-20">
      <SectionShell className="text-center">
        <SectionHeading
          title={t("partnersTitle")}
          subtitle={t("partnersSubtitle")}
          className={SECTION_HEADING_WIDE}
        />
      </SectionShell>

      <SectionShell className="mt-10 overflow-hidden lg:mt-12" aria-label={t("partnersAria")}>
        <div className="partners-marquee">
          <div className="partners-marquee-track">
            <PartnerLogoStrip />
            <PartnerLogoStrip duplicate />
          </div>
        </div>
      </SectionShell>
    </section>
  );
}

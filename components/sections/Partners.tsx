"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import SectionShell, { SECTION_HEADING_WIDE } from "@/components/ui/SectionShell";

const PARTNER_LOGOS = [
  { name: "Hettich", mask: "/partners/hettich-mask.svg", width: 191 },
  { name: "Blum", mask: "/partners/blum-mask.svg", width: 120 },
  { name: "Häfele", mask: "/partners/haefele-mask.svg", width: 191 },
  { name: "Bosch", mask: "/partners/bosch-mask.svg", width: 166 },
  { name: "Siemens", mask: "/partners/siemens-mask.svg", width: 191 },
  { name: "Grohe", mask: "/partners/grohe-mask.svg", width: 134 },
] as const;

type PartnerLogo = (typeof PARTNER_LOGOS)[number];

function MaskedLogo({ name, mask, width }: PartnerLogo) {
  return (
    <div
      role="img"
      aria-label={name}
      title={name}
      className="partner-logo-mask shrink-0 bg-gradient-to-b from-[#cf5374] to-[#6a414d] h-[56px] sm:h-[64px] lg:h-[74px]"
      style={{
        aspectRatio: `${width} / 74`,
        WebkitMaskImage: `url(${mask})`,
        maskImage: `url(${mask})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

function PartnerLogoGroup({ duplicate = false }: { duplicate?: boolean }) {
  const sequence = [...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <div className="partners-marquee-group" aria-hidden={duplicate || undefined}>
      {sequence.map((partner, index) => (
        <MaskedLogo
          key={`${partner.name}-${duplicate ? "dup" : "orig"}-${index}`}
          {...partner}
        />
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
  return (
    <section id="partners" className="bg-blush py-12 sm:py-16 md:py-20">
      <SectionShell className="text-center">
        <SectionHeading
          title="Our Global Partners"
          subtitle="Powered by trusted brands from around the world"
          className={SECTION_HEADING_WIDE}
        />
      </SectionShell>

      <div className="partners-marquee mt-10 lg:mt-12" aria-label="Partner brands">
        <div className="partners-marquee-track">
          <PartnerLogoGroup />
          <PartnerLogoGroup duplicate />
        </div>
      </div>
    </section>
  );
}

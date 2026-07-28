"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import SectionShell, { SECTION_HEADING_WIDE } from "@/components/ui/SectionShell";

const PARTNER_LOGOS: Array<
  | { name: string; src: string; masked?: false }
  | { name: string; mask: string; masked: true }
> = [
  { name: "Hettich", src: "/partners/hettich.svg" },
  { name: "Blum", mask: "/partners/blum-mask.svg", masked: true },
  { name: "Häfele", src: "/partners/haefele.svg" },
  { name: "Bosch", src: "/partners/bosch.svg" },
  { name: "Siemens", src: "/partners/siemens.svg" },
  { name: "Grohe", src: "/partners/grohe.svg" },
];

type PartnerLogo = (typeof PARTNER_LOGOS)[number];

function MaskedLogo({ name, mask }: { name: string; mask: string }) {
  return (
    <div
      role="img"
      aria-label={name}
      title={name}
      className="partner-logo-mask aspect-[191/74] h-[56px] w-[145px] shrink-0 bg-gradient-to-b from-[#cf5374] to-[#6a414d] sm:h-[64px] sm:w-[165px] lg:h-[74px] lg:w-[191px]"
      style={{
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

function LogoImage({ name, src }: { name: string; src: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      title={name}
      className="partner-logo-img h-[56px] w-auto max-w-[145px] object-contain object-center sm:h-[64px] sm:max-w-[165px] lg:h-[74px] lg:max-w-[191px]"
    />
  );
}

function PartnerLogoItem({ partner }: { partner: PartnerLogo }) {
  return (
    <div className="flex shrink-0 items-center justify-center px-1">
      {partner.masked ? (
        <MaskedLogo name={partner.name} mask={partner.mask} />
      ) : (
        <LogoImage name={partner.name} src={partner.src} />
      )}
    </div>
  );
}

function PartnerLogoGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="partners-marquee-group" aria-hidden={duplicate || undefined}>
      {PARTNER_LOGOS.map((partner) => (
        <PartnerLogoItem key={`${partner.name}-${duplicate ? "dup" : "orig"}`} partner={partner} />
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
    <section id="partners" className="bg-blush py-16 md:py-20">
      <SectionShell className="text-center">
        <SectionHeading
          title="Our Global Partners"
          subtitle="Powered by trusted brands from around the world"
          className={SECTION_HEADING_WIDE}
        />

        <div className="partners-marquee mt-10 lg:mt-12" aria-label="Partner brands">
          <div className="partners-marquee-track">
            <PartnerLogoGroup />
            <PartnerLogoGroup duplicate />
          </div>
        </div>
      </SectionShell>
    </section>
  );
}

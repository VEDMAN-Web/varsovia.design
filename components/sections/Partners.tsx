"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeadingReveal from "@/components/ui/SectionHeadingReveal";
import SectionShell, { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";
import { fadeUpItem, reducedFadeUpItem, VIEWPORT_ONCE } from "@/lib/motionPresets";
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

function isUsablePartnerLogo(logo?: string) {
  const s = String(logo || "").trim();
  if (!s || s === "text") return false;
  return s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/");
}

function buildLogosFromApi(partners: Partner[]): PartnerLogo[] {
  return partners
    .filter((p) => isUsablePartnerLogo(p.logo))
    .map((p, index) => ({
      name: p.name || "Partner",
      src: resolveMediaUrl(p.logo, FALLBACK_LOGOS[index % FALLBACK_LOGOS.length].src),
      width: FALLBACK_LOGOS[index % FALLBACK_LOGOS.length]?.width ?? 120,
      height: 48,
    }));
}

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
  const reduceMotion = useReducedMotion();

  const logos = useMemo((): PartnerLogo[] => {
    const fromApi = buildLogosFromApi(partners);
    const uniqueSrc = new Set(fromApi.map((l) => l.src));
    if (fromApi.length >= 2 && uniqueSrc.size >= 2) return fromApi;
    return [...FALLBACK_LOGOS];
  }, [partners]);

  return (
    <section id="partners" className={`bg-blush ${SITE_SECTION_PADDING_Y} !pt-8 sm:!pt-10 md:!pt-14`}>
      <SectionShell className="text-center">
        <SectionHeadingReveal
          title={section?.title || t("partnersTitle")}
          subtitle={section?.subtitle || t("partnersSubtitle")}
          className={SECTION_HEADING_WIDE}
        />
      </SectionShell>

      <SectionShell className="mt-10 overflow-hidden lg:mt-12" aria-label={t("partnersAria")}>
        <motion.div
          className="partners-marquee partners-marquee-fade"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          variants={reduceMotion ? reducedFadeUpItem : fadeUpItem}
        >
          <div className="partners-marquee-track">
            <PartnerLogoStrip logos={logos} />
            <PartnerLogoStrip logos={logos} duplicate />
          </div>
        </motion.div>
      </SectionShell>
    </section>
  );
}

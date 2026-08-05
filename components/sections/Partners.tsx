"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeadingReveal from "@/components/ui/SectionHeadingReveal";
import SectionShell, { SECTION_HEADING_WIDE, SITE_SECTION_PADDING_Y } from "@/components/ui/SectionShell";
import { fadeUpItem, reducedFadeUpItem, VIEWPORT_ONCE } from "@/lib/motionPresets";
import { resolveMediaUrl } from "@/lib/mediaAssets";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

type PartnerLogo = { name: string; src: string };

function isUsablePartnerLogo(logo?: string) {
  const s = String(logo || "").trim();
  if (!s || s === "text") return false;
  return s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/");
}

function buildLogosFromApi(partners: Partner[]): PartnerLogo[] {
  return partners
    .filter((p) => isUsablePartnerLogo(p.logo))
    .map((p) => ({
      name: p.name || "Partner",
      src: resolveMediaUrl(p.logo, ""),
    }))
    .filter((p) => p.src);
}

function PartnerLogoImage({ name, src }: PartnerLogo) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      className="partners-marquee-logo shrink-0 max-h-12 w-auto max-w-[140px] object-contain"
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
        <PartnerLogoImage key={`${partner.name}-${partner.src}-${duplicate ? "b" : "a"}`} {...partner} />
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

  const logos = useMemo((): PartnerLogo[] => buildLogosFromApi(partners), [partners]);

  if (logos.length === 0) {
    return null;
  }

  return (
    <section id="partners" className={`bg-blush ${SITE_SECTION_PADDING_Y} !pt-8 sm:!pt-10 md:!pt-14`}>
      <SectionShell className="text-center">
        <SectionHeadingReveal
          title={section?.title || t("partnersTitle")}
          subtitle={section?.subtitle || t("partnersSubtitle")}
          className={SECTION_HEADING_WIDE}
        />
        <motion.div
          className="partners-marquee-mask relative mt-8 overflow-hidden md:mt-10"
          variants={reduceMotion ? reducedFadeUpItem : fadeUpItem}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <div className="partners-marquee-track flex w-max gap-10 md:gap-16">
            <PartnerLogoStrip logos={logos} />
            <PartnerLogoStrip logos={logos} duplicate />
          </div>
        </motion.div>
      </SectionShell>
    </section>
  );
}

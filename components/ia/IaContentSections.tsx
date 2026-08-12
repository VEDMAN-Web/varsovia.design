"use client";

import Image from "next/image";
import FadeInView from "@/components/company/FadeInView";
import { COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import type { IaHubKey } from "@/lib/iaPages";

export type IaContentSection = {
  heading?: string;
  text?: string;
  image?: string;
  imagePosition?: "left" | "right";
  /** Optional CMS override; otherwise auto-varied per page */
  layout?: IaSectionLayout;
};

export type IaSectionLayout =
  | "band"
  | "spotlight"
  | "editorial"
  | "overlay"
  | "rail";

const LAYOUTS: IaSectionLayout[] = [
  "band",
  "spotlight",
  "editorial",
  "overlay",
  "rail",
];

const HUB_OFFSET: Partial<Record<IaHubKey, number>> = {
  furniture: 0,
  interiorDesign: 1,
  completeInteriors: 2,
  services: 3,
  locations: 4,
  forDevelopers: 1,
  journal: 2,
  aboutBrand: 3,
};

const BODY =
  "font-outfit text-[15px] font-normal leading-[1.7] text-[#6a414d]/88 sm:text-[16px] sm:leading-[1.75]";

const HEADING =
  "font-outfit text-[clamp(1.0625rem,2vw,1.3125rem)] font-semibold leading-snug text-[#1f1f1f]";

const HEADING_LIGHT =
  "font-outfit text-[clamp(1.125rem,2.4vw,1.5rem)] font-semibold leading-snug text-white";

function resolveLayout(
  section: IaContentSection,
  index: number,
  hubKey?: IaHubKey,
): IaSectionLayout {
  const raw = String(section.layout || "").trim().toLowerCase();
  if ((LAYOUTS as string[]).includes(raw)) return raw as IaSectionLayout;
  const offset = hubKey ? HUB_OFFSET[hubKey] ?? 0 : 0;
  return LAYOUTS[(index + offset) % LAYOUTS.length];
}

function TextOnly({ heading, text }: { heading: string; text: string }) {
  return (
    <div className="mx-auto max-w-2xl rounded-[12px] bg-[#f4ebec]/40 px-5 py-7 text-center sm:px-8">
      {heading ? <h2 className={`${HEADING} mb-2`}>{heading}</h2> : null}
      {text ? <p className={`${BODY} whitespace-pre-wrap`}>{text}</p> : null}
    </div>
  );
}

/** Compact horizontal split — landscape image + copy */
function BandLayout({
  heading,
  text,
  image,
  imageOnLeft,
}: {
  heading: string;
  text: string;
  image: string;
  imageOnLeft: boolean;
}) {
  return (
    <div className="grid items-stretch overflow-hidden rounded-[12px] border border-[#e5dcd3]/70 bg-white/50 sm:rounded-[14px] md:grid-cols-2">
      <div
        className={`relative min-h-[160px] aspect-[16/10] w-full md:aspect-auto md:min-h-[200px] lg:min-h-[220px] ${
          imageOnLeft ? "md:order-1" : "md:order-2"
        }`}
      >
        <Image
          src={image}
          alt={heading || "Varsovia"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div
        className={`flex items-center px-5 py-6 sm:px-8 md:px-9 ${
          imageOnLeft ? "md:order-2" : "md:order-1"
        }`}
      >
        <div className="w-full max-w-lg">
          {heading ? <h2 className={`${HEADING} mb-2`}>{heading}</h2> : null}
          {text ? <p className={`${BODY} whitespace-pre-wrap`}>{text}</p> : null}
        </div>
      </div>
    </div>
  );
}

/** Full-width landscape image, centered copy underneath */
function SpotlightLayout({
  heading,
  text,
  image,
}: {
  heading: string;
  text: string;
  image: string;
}) {
  return (
    <div className="space-y-5 md:space-y-6">
      <div className="relative aspect-[21/9] min-h-[160px] w-full overflow-hidden rounded-[12px] sm:min-h-[200px] sm:rounded-[14px] md:aspect-[2.4/1]">
        <Image
          src={image}
          alt={heading || "Varsovia"}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="mx-auto max-w-2xl text-center px-1">
        {heading ? <h2 className={`${HEADING} mb-2`}>{heading}</h2> : null}
        {text ? <p className={`${BODY} whitespace-pre-wrap`}>{text}</p> : null}
      </div>
    </div>
  );
}

/** Copy first (left/wide), then wide landscape image below on mobile; desktop: text left, image right taller landscape */
function EditorialLayout({
  heading,
  text,
  image,
}: {
  heading: string;
  text: string;
  image: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-10">
      <div className="max-w-xl lg:py-2">
        {heading ? (
          <h2 className={`${HEADING} mb-3 border-l-[3px] border-[#6a414d] pl-4`}>{heading}</h2>
        ) : null}
        {text ? <p className={`${BODY} whitespace-pre-wrap pl-0 sm:pl-4`}>{text}</p> : null}
      </div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[10px] sm:rounded-[12px] lg:aspect-[16/10]">
        <Image
          src={image}
          alt={heading || "Varsovia"}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </div>
    </div>
  );
}

/** Landscape image with text overlaid on a soft gradient (horizontal feel) */
function OverlayLayout({
  heading,
  text,
  image,
}: {
  heading: string;
  text: string;
  image: string;
}) {
  return (
    <div className="relative min-h-[200px] overflow-hidden rounded-[12px] sm:min-h-[240px] sm:rounded-[14px] md:min-h-[280px]">
      <Image
        src={image}
        alt={heading || "Varsovia"}
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#2a151c]/82 via-[#2a151c]/55 to-[#2a151c]/20"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[200px] items-end p-5 sm:min-h-[240px] sm:p-8 md:min-h-[280px] md:p-10 md:items-center">
        <div className="max-w-xl">
          {heading ? <h2 className={`${HEADING_LIGHT} mb-2`}>{heading}</h2> : null}
          {text ? (
            <p className="font-outfit text-[14px] leading-[1.7] text-white/88 sm:text-[15px] whitespace-pre-wrap">
              {text}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Narrow vertical-ish rail image + wide copy (asymmetric horizontal) */
function RailLayout({
  heading,
  text,
  image,
  imageOnLeft,
}: {
  heading: string;
  text: string;
  image: string;
  imageOnLeft: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-5 overflow-hidden rounded-[12px] bg-[#f4ebec]/50 p-3 sm:p-4 md:flex-row md:items-center md:gap-8 ${
        imageOnLeft ? "" : "md:flex-row-reverse"
      }`}
    >
      <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden rounded-[10px] md:aspect-[5/4] md:w-[min(38%,320px)] lg:w-[min(34%,360px)]">
        <Image
          src={image}
          alt={heading || "Varsovia"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 360px"
        />
      </div>
      <div className="min-w-0 flex-1 px-2 pb-3 pt-1 sm:px-3 md:py-4">
        {heading ? <h2 className={`${HEADING} mb-2`}>{heading}</h2> : null}
        {text ? <p className={`${BODY} whitespace-pre-wrap`}>{text}</p> : null}
      </div>
    </div>
  );
}

/**
 * CMS content blocks with varied layouts per page + block index
 * so IA pages don’t all share one identical pattern.
 */
export default function IaContentSections({
  sections,
  hubKey,
}: {
  sections?: IaContentSection[] | null;
  hubKey?: IaHubKey;
}) {
  const list = (Array.isArray(sections) ? sections : []).filter((s) => {
    if (!s || typeof s !== "object") return false;
    return Boolean(
      String(s.heading || "").trim() ||
        String(s.text || "").trim() ||
        String(s.image || "").trim(),
    );
  });
  if (!list.length) return null;

  return (
    <div className={`${COMPANY_SHELL} mt-10 space-y-8 md:mt-14 md:space-y-12`}>
      {list.map((section, i) => {
        const heading = String(section.heading || "").trim();
        const text = String(section.text || "").trim();
        const image = String(section.image || "").trim();
        const layout = resolveLayout(section, i, hubKey);
        const imageOnLeft =
          section.imagePosition === "right"
            ? false
            : section.imagePosition === "left"
              ? true
              : i % 2 === 0;

        return (
          <FadeInView key={`ia-sec-${i}-${layout}`} delay={0.03 * (i % 3)}>
            {!image ? (
              <TextOnly heading={heading} text={text} />
            ) : layout === "spotlight" ? (
              <SpotlightLayout heading={heading} text={text} image={image} />
            ) : layout === "editorial" ? (
              <EditorialLayout heading={heading} text={text} image={image} />
            ) : layout === "overlay" ? (
              <OverlayLayout heading={heading} text={text} image={image} />
            ) : layout === "rail" ? (
              <RailLayout
                heading={heading}
                text={text}
                image={image}
                imageOnLeft={imageOnLeft}
              />
            ) : (
              <BandLayout
                heading={heading}
                text={text}
                image={image}
                imageOnLeft={imageOnLeft}
              />
            )}
          </FadeInView>
        );
      })}
    </div>
  );
}

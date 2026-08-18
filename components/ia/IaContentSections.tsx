"use client";

import CmsImage from "@/components/ui/CmsImage";
import FadeInView from "@/components/company/FadeInView";
import { COMPANY_SHELL } from "@/components/company/companyLayoutShared";
import { strField, type IaHubKey } from "@/lib/iaPages";

export type IaContentSection = {
  heading?: string;
  text?: string;
  image?: string;
  imagePosition?: "left" | "right";
  /** Stored in CMS; live blocks follow Photo side (band) to match the admin panel. */
  layout?: IaSectionLayout;
};

export type IaSectionLayout =
  | "band"
  | "spotlight"
  | "editorial"
  | "overlay"
  | "rail";

const BODY =
  "font-outfit text-[15px] font-normal leading-[1.7] text-[#6a414d]/88 sm:text-[16px] sm:leading-[1.75]";

const HEADING =
  "font-outfit text-[clamp(1.0625rem,2vw,1.3125rem)] font-semibold leading-snug text-[#1f1f1f]";

function TextOnly({ heading, text }: { heading: string; text: string }) {
  return (
    <div className="mx-auto max-w-2xl rounded-[12px] bg-[#f4ebec]/40 px-5 py-7 text-center sm:px-8">
      {heading ? <h2 className={`${HEADING} mb-2`}>{heading}</h2> : null}
      {text ? <p className={`${BODY} whitespace-pre-wrap`}>{text}</p> : null}
    </div>
  );
}

/** Compact horizontal split — same photo + heading + text as the admin panel. */
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
        <CmsImage
          src={image}
          alt=""
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

/**
 * CMS content blocks — photo + heading + text, Photo side left/right.
 * Matches Admin hub landing fields (no extra live-only layouts).
 */
export default function IaContentSections({
  sections,
}: {
  sections?: IaContentSection[] | null;
  hubKey?: IaHubKey;
}) {
  const list = (Array.isArray(sections) ? sections : []).filter((s) => {
    if (!s || typeof s !== "object") return false;
    return Boolean(
      strField(s.heading) || strField(s.text) || strField(s.image),
    );
  });
  if (!list.length) return null;

  return (
    <div className={`${COMPANY_SHELL} mt-10 space-y-8 md:mt-14 md:space-y-12`}>
      {list.map((section, i) => {
        const heading = strField(section.heading);
        const text = strField(section.text);
        const image = strField(section.image);
        const imageOnLeft =
          section.imagePosition === "right"
            ? false
            : section.imagePosition === "left"
              ? true
              : i % 2 === 0;

        return (
          <FadeInView key={`ia-sec-${i}`} delay={0.03 * (i % 3)}>
            {!image ? (
              <TextOnly heading={heading} text={text} />
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

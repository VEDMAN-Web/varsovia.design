"use client";

import { useState } from "react";
import BrandLogo from "@/components/layout/BrandLogo";
import GetInTouchModal, { opensGetInTouch } from "@/components/forms/GetInTouchModal";
import TrackClickLink from "@/components/analytics/TrackClickLink";
import { Link } from "@/lib/i18n/navigation";
import type { IaArticleCta, IaArticleOffer } from "@/lib/iaPages";
import { resolveMediaUrl } from "@/lib/mediaAssets";
import { trackCtaClick } from "@/lib/analytics";
import {
  PAGE_DISPLAY_HEADING_CLASS,
  SUBSECTION_EYEBROW_CLASS,
} from "@/components/ui/SectionHeading";
import {
  BLOG_DETAIL_CONTACT_BG,
  BLOG_DETAIL_CTA_BTN,
  BLOG_DETAIL_CTA_GAP,
  BLOG_DETAIL_CTA_ROUND,
  BLOG_DETAIL_CTA_STACK,
  BLOG_DETAIL_OFFER_BG,
} from "@/components/company/blogDetailLayoutShared";

function isHashOrExternal(href: string) {
  return href.startsWith("#") || /^https?:\/\//i.test(href);
}

function CtaButton({
  href,
  label,
  onOpenGetInTouch,
}: {
  href: string;
  label: string;
  onOpenGetInTouch: () => void;
}) {
  if (!label.trim()) return null;
  const to = href.trim() || "/contact";
  if (opensGetInTouch(to)) {
    return (
      <button type="button" className={`${BLOG_DETAIL_CTA_BTN} cursor-pointer`} onClick={onOpenGetInTouch}>
        {label}
      </button>
    );
  }
  if (isHashOrExternal(to)) {
    return (
      <a href={to} className={BLOG_DETAIL_CTA_BTN}>
        {label}
      </a>
    );
  }
  return (
    <Link href={to} className={BLOG_DETAIL_CTA_BTN}>
      {label}
    </Link>
  );
}

function CheckIcon() {
  return (
    <span
      aria-hidden
      className="mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#cf5374] text-[#cf5374] sm:size-6"
    >
      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
        <path
          d="M1.2 4.4 4.05 7.2 9.8 1.4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ContactVarsoviaBand({
  cta,
  onOpenGetInTouch,
}: {
  cta: IaArticleCta;
  onOpenGetInTouch: () => void;
}) {
  if (!cta.title && !cta.subtitle && !cta.ctaLabel) return null;
  return (
    <section
      className={`${BLOG_DETAIL_CTA_ROUND} px-[clamp(1.25rem,5vw,4.5rem)] py-[clamp(2.5rem,6.5vw,4rem)] text-center`}
      style={{ backgroundColor: BLOG_DETAIL_CONTACT_BG }}
    >
      {cta.title ? (
        <h2 className={`${PAGE_DISPLAY_HEADING_CLASS} !px-0 tracking-[0.12em] sm:tracking-[0.14em]`}>
          {cta.title}
        </h2>
      ) : null}
      {cta.subtitle ? (
        <p className="mx-auto mt-4 max-w-[54rem] font-outfit text-[clamp(0.75rem,1.5vw,0.9375rem)] font-normal uppercase leading-[1.75] tracking-[0.1em] text-[#cf5374] sm:mt-5 sm:tracking-[0.14em] md:text-[1rem] md:tracking-[0.16em]">
          {cta.subtitle}
        </p>
      ) : null}
      {cta.ctaLabel ? (
        <div className="mt-7 sm:mt-8">
          <CtaButton
            href={cta.ctaHref || "/contact"}
            label={cta.ctaLabel}
            onOpenGetInTouch={onOpenGetInTouch}
          />
        </div>
      ) : null}
    </section>
  );
}

function OfferCta({ href, label }: { href: string; label: string }) {
  if (!label.trim()) return null;
  const to = href.trim() || "/contact";
  if (isHashOrExternal(to)) {
    return (
      <a
        href={to}
        className={BLOG_DETAIL_CTA_BTN}
        onClick={() => trackCtaClick("get-offers", "journal-article")}
      >
        {label}
      </a>
    );
  }
  return (
    <TrackClickLink
      href={to}
      className={BLOG_DETAIL_CTA_BTN}
      ctaId="get-offers"
      ctaLocation="journal-article"
    >
      {label}
    </TrackClickLink>
  );
}

function KitchenOfferBand({ offer }: { offer: IaArticleOffer }) {
  if (!offer.title && !offer.text && !offer.image) return null;
  const image = resolveMediaUrl(offer.image, "/Interior-kitchen/kitchen1.jpg");
  const points = (offer.points || []).filter(Boolean);

  return (
    <section className={`${BLOG_DETAIL_CTA_ROUND} ${BLOG_DETAIL_CTA_STACK}`}>
      <div className="grid min-h-0 grid-cols-1 overflow-hidden md:grid-cols-2 md:items-stretch">
        <div
          className="flex flex-col justify-center px-[clamp(1.35rem,4.5vw,3.5rem)] py-[clamp(1.85rem,5vw,3.25rem)]"
          style={{ backgroundColor: BLOG_DETAIL_OFFER_BG }}
        >
          {offer.eyebrow ? (
            <p className={`${SUBSECTION_EYEBROW_CLASS} !text-[11px] tracking-[0.28em] sm:!text-[12px]`}>
              {offer.eyebrow}
            </p>
          ) : null}
          {offer.title ? (
            <h2 className={`${PAGE_DISPLAY_HEADING_CLASS} mt-3 max-w-[16ch] !px-0 text-left leading-[1.12] sm:mt-3.5 lg:text-[2.5rem]`}>
              {offer.title}
            </h2>
          ) : null}
          {offer.text ? (
            <p className="mt-4 max-w-[36rem] font-outfit text-[clamp(0.9375rem,1.5vw,1.0625rem)] font-normal leading-[1.7] text-[#251b1e] sm:mt-5">
              {offer.text}
            </p>
          ) : null}
          {points.length > 0 ? (
            <ul className="mt-5 flex flex-col gap-3 sm:mt-6 sm:gap-3.5">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 font-outfit text-[clamp(0.875rem,1.4vw,1rem)] font-normal leading-[1.5] text-[#251b1e]"
                >
                  <CheckIcon />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {offer.ctaLabel ? (
            <div className="mt-7 sm:mt-8">
              <OfferCta href={offer.ctaHref || "/contact"} label={offer.ctaLabel} />
            </div>
          ) : null}
        </div>

        <div className="relative h-full min-h-[240px] self-stretch sm:min-h-[300px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={offer.imageAlt || ""}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="pointer-events-none absolute right-[clamp(0.85rem,2.4vw,1.35rem)] top-[clamp(0.85rem,2.4vw,1.35rem)] origin-top-right scale-[0.46] text-white sm:scale-[0.52] md:scale-[0.58]">
            <BrandLogo variant="footer" link={false} />
          </div>
        </div>
      </div>
    </section>
  );
}

type BlogDetailFooterCtasProps = {
  contact?: IaArticleCta;
  offer?: IaArticleOffer;
};

export default function BlogDetailFooterCtas({ contact, offer }: BlogDetailFooterCtasProps) {
  const [open, setOpen] = useState(false);
  if (!contact && !offer) return null;

  const openGetInTouch = (ctaId: string) => {
    trackCtaClick(ctaId, "journal-article");
    setOpen(true);
  };

  return (
    <div className={BLOG_DETAIL_CTA_GAP}>
      {contact ? (
        <ContactVarsoviaBand
          cta={contact}
          onOpenGetInTouch={() => openGetInTouch("contact-us")}
        />
      ) : null}
      {offer ? <KitchenOfferBand offer={offer} /> : null}
      <GetInTouchModal
        open={open}
        onClose={() => setOpen(false)}
        source="journal-contact"
      />
    </div>
  );
}

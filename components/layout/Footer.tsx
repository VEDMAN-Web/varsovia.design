"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import type { ReactNode } from "react";
import BrandLogo from "@/components/layout/BrandLogo";
import {
  IconEmailContact,
  IconFacebook,
  IconInstagram,
  IconLocationContact,
  IconPhoneContact,
  IconWhatsApp,
  IconX,
} from "@/components/layout/FooterIcons";
import type { SiteContent } from "@/lib/siteTypes";
import { FOOTER_CONTACT, telHref } from "@/lib/footerContact";
import { getFooterNavigationForUi } from "@/lib/footerNavigation";
import type { FooterLinkColumn, FooterNavLink } from "@/lib/footerNavigationTypes";

type FooterProps = {
  bio?: string;
  site?: SiteContent | null;
};

const SOCIAL_ICON = "size-10 sm:size-10";

/** Minimum tap target for social controls on small screens. */
const SOCIAL_LINK =
  "inline-flex min-h-11 min-w-11 items-center justify-center shrink-0 opacity-90 transition-all duration-200 hover:scale-105 hover:opacity-100 active:opacity-100";

/** Figma footer column titles (Outfit Medium 20px). */
const FOOTER_COLUMN_HEADING =
  "font-outfit text-[17px] font-medium leading-snug text-white sm:text-[20px] sm:leading-normal";

const FOOTER_LINK =
  "font-outfit inline-flex min-h-[44px] items-center py-1.5 text-[15px] font-normal leading-snug transition-colors duration-200 sm:min-h-0 sm:py-0 sm:text-[16px] sm:leading-[1.45] lg:text-[18px] lg:leading-normal";

const FOOTER_LEGAL =
  "font-outfit text-[11px] font-light leading-none text-white/60 transition-colors duration-200 hover:text-white sm:text-[12px]";

function footerColumnTitle(column: FooterLinkColumn, t: (key: string) => string): string | null {
  if (column.id === "primary") return t("home");
  if (column.id === "products") return t("products");
  return null;
}

function FooterNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const isExternal = href.startsWith("http") || href.endsWith(".xml");

  const className = `${FOOTER_LINK} ${
    active ? "font-medium text-[#cf5374]" : "text-white/85 hover:text-white"
  }`;

  if (isExternal) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function FooterLegalLink({ link }: { link: FooterNavLink }) {
  const isExternal = link.href.startsWith("http") || link.href.endsWith(".xml");

  if (isExternal || link.href === "#") {
    return (
      <a href={link.href} className={FOOTER_LEGAL}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={FOOTER_LEGAL}>
      {link.label}
    </Link>
  );
}

function ContactRow({ icon, children }: { icon: "email" | "location" | "phone"; children: ReactNode }) {
  const Icon =
    icon === "email" ? IconEmailContact : icon === "location" ? IconLocationContact : IconPhoneContact;

  return (
    <div className="grid grid-cols-[34px_minmax(0,1fr)] items-start gap-x-3 sm:gap-x-4">
      <div className="flex justify-center pt-0.5">
        <Icon />
      </div>
      <div className="min-w-0 font-outfit text-[15px] leading-relaxed text-white/90 sm:text-[15px] sm:leading-[1.45] lg:text-[16px]">
        {children}
      </div>
    </div>
  );
}

function ContactLabel({ children }: { children: ReactNode }) {
  return <p className="font-outfit font-medium leading-snug text-white">{children}</p>;
}

/** Figma order after WhatsApp: Instagram, X — link only when URL is set. */
function FooterOptionalSocialLink({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: ReactNode;
}) {
  const url = href?.trim();
  const className = SOCIAL_LINK;

  if (!url) {
    return (
      <span className={`${className} cursor-default`} aria-label={label}>
        {children}
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={className}
    >
      {children}
    </a>
  );
}

function ContactValue({ href, children }: { href?: string; children: ReactNode }) {
  const className =
    "mt-0.5 block break-words transition-colors duration-200 hover:text-white hover:underline underline-offset-2 decoration-[#cf5374]";

  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return <p className="mt-0.5 break-words">{children}</p>;
}

function FooterLinkColumnBlock({
  column,
  columnHeading,
}: {
  column: FooterLinkColumn;
  columnHeading: string | null;
}) {
  return (
    <nav className="flex min-w-0 flex-col gap-3 sm:gap-4 lg:gap-4 lg:pt-[31px]">
      {columnHeading ? (
        <p className={`${FOOTER_COLUMN_HEADING} min-h-[2.75rem] sm:min-h-0`}>{columnHeading}</p>
      ) : null}
      <div className="flex flex-col gap-0.5 sm:gap-3 lg:gap-4">
        {column.links.map((link) => (
          <FooterNavLink key={`${column.id}-${link.href}`} href={link.href} label={link.label} />
        ))}
      </div>
    </nav>
  );
}

export default function Footer({ bio, site }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCat = useTranslations("categories");

  const footerNav = useMemo(
    () => getFooterNavigationForUi(site, t, tNav, tCat),
    [site, t, tNav, tCat],
  );

  const email = site?.email?.trim() || FOOTER_CONTACT.email;
  const contactPhone = site?.contactPhone?.trim() || FOOTER_CONTACT.contactPhone;
  const mobileWhatsapp = site?.mobileWhatsapp?.trim() || FOOTER_CONTACT.mobileWhatsapp;
  const whatsappUrl = site?.whatsappUrl?.trim() || FOOTER_CONTACT.whatsapp;
  const facebookUrl = site?.facebookUrl?.trim() || FOOTER_CONTACT.facebook;
  const instagramUrl = site?.instagramUrl?.trim() || FOOTER_CONTACT.instagramUrl;
  const xUrl = site?.xUrl?.trim() || FOOTER_CONTACT.xUrl;

  const offices =
    site?.footerOffices && site.footerOffices.length > 0
      ? site.footerOffices.map((o) => ({ label: o.label, address: o.address }))
      : FOOTER_CONTACT.offices.map((o) => ({
          label: t(o.labelKey),
          address: o.address,
        }));

  const contactLabels = footerNav.contactLabels;
  const socialLabels = footerNav.socialLabels;

  return (
    <footer className="bg-[#6a414d] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-10 sm:px-[clamp(1rem,5vw,100px)] sm:pt-12 lg:min-h-[529px] lg:pt-[75px]">
        <div className="flex flex-col gap-10 sm:gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-12 xl:gap-[80px]">
          {/* Brand — centered on mobile, Figma left column on lg+ */}
          <div className="flex w-full max-w-none flex-col items-center gap-5 text-center sm:max-w-[319px] sm:items-start sm:gap-5 sm:text-left lg:shrink-0 lg:gap-6">
            <BrandLogo variant="footer" className="flex w-full justify-center sm:w-auto sm:justify-start" />

            <p className="max-w-[22rem] font-outfit text-[15px] font-normal leading-relaxed text-white/90 sm:max-w-none sm:text-[16px] sm:leading-snug lg:text-[18px] lg:leading-normal">
              {bio || t("defaultBio")}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-4 lg:gap-5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={socialLabels.whatsapp ?? t("whatsapp")}
                className={`group ${SOCIAL_LINK}`}
              >
                <IconWhatsApp className={SOCIAL_ICON} />
              </a>
              <FooterOptionalSocialLink
                href={instagramUrl}
                label={socialLabels.instagram ?? t("instagram")}
              >
                <IconInstagram className={SOCIAL_ICON} />
              </FooterOptionalSocialLink>
              <FooterOptionalSocialLink href={xUrl} label={socialLabels.x ?? t("x")}>
                <IconX className={SOCIAL_ICON} />
              </FooterOptionalSocialLink>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={socialLabels.facebook ?? t("facebook")}
                className={SOCIAL_LINK}
              >
                <IconFacebook className={SOCIAL_ICON} />
              </a>
            </div>
          </div>

          {/* Nav + contact */}
          <div className="grid w-full min-w-0 flex-1 grid-cols-2 items-start gap-x-5 gap-y-8 border-t border-white/15 pt-8 sm:gap-x-10 sm:gap-y-10 sm:border-t-0 sm:pt-0 lg:flex lg:flex-row lg:flex-nowrap lg:items-start lg:justify-end lg:gap-[clamp(3rem,6vw,80px)] xl:gap-[80px]">
            {footerNav.linkColumns.map((column) => (
              <FooterLinkColumnBlock
                key={column.id}
                column={column}
                columnHeading={footerColumnTitle(column, t)}
              />
            ))}

            <div className="col-span-2 flex min-w-0 flex-col gap-4 border-t border-white/15 pt-8 sm:col-span-2 sm:gap-4 sm:border-t-0 sm:pt-0 lg:col-span-1 lg:min-w-[min(100%,320px)] lg:max-w-[360px] lg:gap-[30px] lg:pt-[31px]">
              <p className={FOOTER_COLUMN_HEADING}>{footerNav.contactHeading}</p>
              <div className="flex flex-col gap-5 sm:gap-[14px] lg:gap-[18px]">
                <ContactRow icon="email">
                  <ContactLabel>{contactLabels.email ?? t("email")}</ContactLabel>
                  <ContactValue href={`mailto:${email}`}>{email}</ContactValue>
                </ContactRow>

                {offices.map((office, index) => (
                  <ContactRow key={`${office.label}-${index}`} icon="location">
                    <ContactLabel>{office.label}</ContactLabel>
                    <ContactValue>{office.address}</ContactValue>
                  </ContactRow>
                ))}

                <ContactRow icon="phone">
                  <div className="flex flex-col gap-2.5 sm:gap-3">
                    <div>
                      <ContactLabel>{contactLabels.mobileWhatsapp ?? t("mobileWhatsapp")}</ContactLabel>
                      <ContactValue href={telHref(mobileWhatsapp)}>{mobileWhatsapp}</ContactValue>
                    </div>
                    <div>
                      <ContactLabel>{contactLabels.contactNumber ?? t("contactNumber")}</ContactLabel>
                      <ContactValue href={telHref(contactPhone)}>{contactPhone}</ContactValue>
                    </div>
                  </div>
                </ContactRow>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Figma: divider spans full viewport width */}
      <div
        className="mt-8 w-full border-t border-white/30 sm:mt-10 lg:mt-[clamp(2.5rem,6vw,5rem)]"
        role="presentation"
      />

      <div className="mx-auto w-full max-w-[1440px] px-5 pt-4 pb-16 sm:px-[clamp(1rem,5vw,100px)] sm:pt-[10px] sm:pb-14 lg:pb-[75px]">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-center font-outfit text-[11px] font-light leading-relaxed text-white/80 sm:justify-start sm:text-left sm:text-[12px] sm:leading-none">
          <span>{footerNav.copyright}</span>
          {footerNav.legalLinks.map((link, index) => (
            <span key={`${link.href}-${index}`} className="inline-flex items-center gap-2">
              <span className="text-white/50" aria-hidden="true">
                ·
              </span>
              <FooterLegalLink link={link} />
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import type { ReactNode } from "react";
import {
  IconEmailContact,
  IconFacebook,
  IconLocationContact,
  IconPhoneContact,
  IconWhatsApp,
  LogoWingSvg,
} from "@/components/layout/FooterIcons";
import type { SiteContent } from "@/lib/siteTypes";
import { FOOTER_CONTACT, telHref } from "@/lib/footerContact";

type FooterProps = {
  bio?: string;
  site?: SiteContent | null;
};

const SOCIAL_ICON = "size-8 sm:size-9 lg:size-10";

function FooterNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`group relative font-outfit text-[14px] leading-snug transition-colors duration-200 sm:text-[16px] lg:text-[18px] lg:leading-normal ${
        active ? "font-medium text-[#cf5374]" : "font-normal text-white/80 hover:text-white"
      }`}
    >
      <span className="relative">
        {label}
        <span
          className={`absolute -bottom-0.5 left-0 h-px bg-[#cf5374] transition-all duration-300 ease-out ${
            active ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </span>
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
      <div className="min-w-0 font-outfit text-[14px] leading-[1.45] text-white/80 sm:text-[15px] lg:text-[16px]">
        {children}
      </div>
    </div>
  );
}

function ContactLabel({ children }: { children: ReactNode }) {
  return <p className="font-medium leading-snug text-white">{children}</p>;
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

function LegalDot() {
  return (
    <span className="inline-flex h-[12px] shrink-0 items-center px-1 sm:h-[14px]" aria-hidden="true">
      <span className="block size-[3px] rounded-full bg-[#cf5374] sm:size-1" />
    </span>
  );
}

export default function Footer({ bio, site }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCat = useTranslations("categories");
  const year = new Date().getFullYear();

  const email = site?.email?.trim() || FOOTER_CONTACT.email;
  const contactPhone = site?.contactPhone?.trim() || FOOTER_CONTACT.contactPhone;
  const mobileWhatsapp = site?.mobileWhatsapp?.trim() || FOOTER_CONTACT.mobileWhatsapp;
  const whatsappUrl = site?.whatsappUrl?.trim() || FOOTER_CONTACT.whatsapp;
  const facebookUrl = site?.facebookUrl?.trim() || FOOTER_CONTACT.facebook;

  const offices =
    site?.footerOffices && site.footerOffices.length > 0
      ? site.footerOffices.map((o) => ({ label: o.label, address: o.address }))
      : FOOTER_CONTACT.offices.map((o) => ({
          label: t(o.labelKey),
          address: o.address,
        }));

  const homeLinks = [
    { label: t("blog"), href: "/blog" },
    { label: t("aboutUs"), href: "/about" },
    { label: t("contactUs"), href: "/contact" },
    { label: tNav("faq"), href: "/faq" },
    { label: t("catalogue"), href: "/catalogue" },
  ] as const;

  const productLinks = [
    { label: tCat("kitchen"), href: "/interior?category=Kitchen" },
    { label: tCat("bedroom"), href: "/interior?category=Bedroom" },
    { label: tCat("bathroom"), href: "/interior?category=Bathroom" },
    { label: tCat("furniture"), href: "/interior?category=Furniture" },
    { label: tCat("doorWindows"), href: "/interior?category=Door%20%26%20Windows" },
    { label: tCat("wholeHouse"), href: "/interior?category=Whole%20House%20Solutions" },
  ] as const;

  return (
    <footer className="bg-[#6a414d] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(1rem,5vw,100px)] pt-8 pb-20 sm:pt-12 sm:pb-16 lg:min-h-[529px] lg:pt-[75px] lg:pb-[75px]">
        <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:gap-[128px] lg:gap-y-12">
          {/* Brand block — compact horizontal on mobile */}
          <div className="flex w-full max-w-[319px] flex-col gap-4 sm:gap-5 lg:gap-6">
            <div className="flex items-center gap-4 sm:items-start sm:gap-0 sm:flex-col">
              <div className="flex shrink-0 items-center gap-3 sm:w-[155.773px] sm:flex-col sm:gap-[7.534px]">
                <LogoWingSvg className="h-[52px] w-[33px] sm:h-[68px] sm:w-[43px] lg:h-[82.169px] lg:w-[52.396px]" />
                <div className="text-white sm:w-full">
                  <p className="font-display text-[1.35rem] font-bold leading-tight sm:text-[26px] sm:leading-[34px] lg:text-[31.413px] lg:leading-[42.835px]">
                    VARSOVIA
                  </p>
                  <p className="font-outfit text-[10px] font-normal tracking-[0.45em] sm:text-center sm:text-[12.138px] sm:tracking-[16.9934px]">
                    DESIGN
                  </p>
                </div>
              </div>
            </div>

            <p className="font-outfit text-[14px] leading-snug text-white/80 sm:text-[16px] lg:text-[18px] lg:leading-normal">
              {bio || t("defaultBio")}
            </p>

            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("whatsapp")}
                className="shrink-0 opacity-80 transition-all duration-200 hover:scale-110 hover:opacity-100"
              >
                <IconWhatsApp className={SOCIAL_ICON} />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("facebook")}
                className="shrink-0 opacity-80 transition-all duration-200 hover:scale-110 hover:opacity-100"
              >
                <IconFacebook className={SOCIAL_ICON} />
              </a>
            </div>
          </div>

          {/* Links + contact */}
          <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10 lg:flex lg:flex-row lg:flex-nowrap lg:gap-[80px] xl:gap-[120px] lg:pt-[31px]">
            <nav className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
              {homeLinks.map((link) => (
                <FooterNavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>

            <nav className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
              {productLinks.map((link) => (
                <FooterNavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>

            <div className="col-span-2 flex min-w-0 flex-col gap-3 sm:col-span-2 sm:gap-4 lg:col-span-1 lg:min-w-[min(100%,320px)] lg:max-w-[360px] lg:gap-[30px]">
              <p className="font-outfit text-[16px] font-medium leading-normal text-white sm:text-[18px] lg:text-[20px]">
                {t("contactUs")}
              </p>
              <div className="flex flex-col gap-4 sm:gap-[14px] lg:gap-[18px]">
                <ContactRow icon="email">
                  <ContactLabel>{t("email")}</ContactLabel>
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
                      <ContactLabel>{t("mobileWhatsapp")}</ContactLabel>
                      <ContactValue href={telHref(mobileWhatsapp)}>{mobileWhatsapp}</ContactValue>
                    </div>
                    <div>
                      <ContactLabel>{t("contactNumber")}</ContactLabel>
                      <ContactValue href={telHref(contactPhone)}>{contactPhone}</ContactValue>
                    </div>
                  </div>
                </ContactRow>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-3 pb-2 sm:mt-10 sm:pt-[10px] lg:mt-[clamp(2.5rem,6vw,5rem)]">
          <div className="flex flex-wrap items-center gap-y-1.5">
            <span className="inline-flex items-center font-outfit text-[11px] font-light leading-none text-white/80 sm:text-[12px]">
              {t("copyright", { year })}
            </span>
            <LegalDot />
            <Link
              href="/privacy"
              className="inline-flex items-center font-outfit text-[11px] font-light leading-none text-white/60 transition-colors duration-200 hover:text-white sm:text-[12px]"
            >
              {t("privacy")}
            </Link>
            <LegalDot />
            <Link
              href="/terms"
              className="inline-flex items-center font-outfit text-[11px] font-light leading-none text-white/60 transition-colors duration-200 hover:text-white sm:text-[12px]"
            >
              {t("terms")}
            </Link>
            <LegalDot />
            <Link
              href="#"
              className="inline-flex items-center font-outfit text-[11px] font-light leading-none text-white/60 transition-colors duration-200 hover:text-white sm:text-[12px]"
            >
              {t("sitemap")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

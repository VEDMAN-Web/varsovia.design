"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import type { ReactNode } from "react";
import {
  IconEmailContact,
  IconFacebook,
  IconInstagram,
  IconLocationContact,
  IconPhoneContact,
  IconWhatsApp,
  IconX,
  LogoWingSvg,
} from "@/components/layout/FooterIcons";

type FooterProps = {
  bio?: string;
  phone?: string;
  email?: string;
  address?: string;
};

function FooterNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`group relative font-outfit text-[18px] leading-normal transition-colors duration-200 ${
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
    <div className="flex items-center gap-5">
      <Icon />
      <div className="font-outfit text-[18px] leading-normal text-white/80">{children}</div>
    </div>
  );
}

function LegalDot() {
  return <span className="h-1 w-1 shrink-0 rounded-full bg-[#cf5374]" />;
}

export default function Footer({
  bio,
  phone = "+91 98765 43210",
  email = "hello@Varsoviadesign.in",
  address = "SG Highway, Ahmedabad, Gujarat 380015",
}: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCat = useTranslations("categories");
  const year = new Date().getFullYear();

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
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(1.25rem,7vw,100px)] pt-[75px] lg:min-h-[529px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-[128px]">
          <div className="flex w-full max-w-[319px] flex-col gap-6">
            <div className="flex w-[155.773px] flex-col items-center gap-[7.534px]">
              <LogoWingSvg className="h-[82.169px] w-[52.396px]" />
              <div className="w-full text-white">
                <p className="font-display text-[31.413px] font-bold leading-[42.835px]">VARSOVIA</p>
                <p className="font-outfit text-center text-[12.138px] font-normal tracking-[16.9934px]">
                  DESIGN
                </p>
              </div>
            </div>

            <p className="font-outfit text-[18px] font-normal leading-normal text-white/80">
              {bio || t("defaultBio")}
            </p>

            <div className="flex items-center gap-5">
              <a href="#" aria-label={t("whatsapp")} className="shrink-0 opacity-80 transition-all duration-200 hover:opacity-100 hover:scale-110">
                <IconWhatsApp />
              </a>
              <a href="#" aria-label={t("instagram")} className="shrink-0 opacity-80 transition-all duration-200 hover:opacity-100 hover:scale-110">
                <IconInstagram />
              </a>
              <a href="#" aria-label={t("x")} className="shrink-0 opacity-80 transition-all duration-200 hover:opacity-100 hover:scale-110">
                <IconX />
              </a>
              <a href="#" aria-label={t("facebook")} className="shrink-0 opacity-80 transition-all duration-200 hover:opacity-100 hover:scale-110">
                <IconFacebook />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:flex-nowrap lg:gap-[80px] xl:gap-[120px] lg:pt-[31px]">
            <div className="flex flex-col gap-[30px] shrink-0">
              <nav className="flex flex-col gap-4">
                {homeLinks.map((link) => (
                  <FooterNavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-[30px] shrink-0">
              <nav className="flex flex-col gap-4">
                {productLinks.map((link) => (
                  <FooterNavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-[30px] shrink-0 min-w-0">
              <p className="font-outfit text-[20px] font-medium leading-normal text-white">{t("contactUs")}</p>
              <div className="flex flex-col gap-[18px]">
                <ContactRow icon="email">
                  <a href={`mailto:${email}`} className="whitespace-nowrap transition-colors duration-200 hover:text-white hover:underline underline-offset-2 decoration-[#cf5374]">
                    {email}
                  </a>
                </ContactRow>
                <ContactRow icon="location">
                  <span className="max-w-[235px] transition-colors duration-200 hover:text-white cursor-default">{address}</span>
                </ContactRow>
                <ContactRow icon="phone">
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="whitespace-nowrap transition-colors duration-200 hover:text-white hover:underline underline-offset-2 decoration-[#cf5374]"
                  >
                    {phone}
                  </a>
                </ContactRow>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[clamp(2.5rem,6vw,5rem)] border-t border-white/20 pt-[10px] pb-[75px]">
          <div className="flex flex-wrap items-center gap-x-[10px] gap-y-2">
            <span className="font-outfit text-[12px] font-light leading-normal text-white/80">
              {t("copyright", { year })}
            </span>
            <LegalDot />
            <Link
              href="#"
              className="font-outfit text-[12px] font-light leading-normal text-white/60 transition-colors duration-200 hover:text-white"
            >
              {t("privacy")}
            </Link>
            <LegalDot />
            <Link
              href="#"
              className="font-outfit text-[12px] font-light leading-normal text-white/60 transition-colors duration-200 hover:text-white"
            >
              {t("terms")}
            </Link>
            <LegalDot />
            <Link
              href="#"
              className="font-outfit text-[12px] font-light leading-normal text-white/60 transition-colors duration-200 hover:text-white"
            >
              {t("sitemap")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

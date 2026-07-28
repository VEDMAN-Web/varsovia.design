"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const HOME_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Catalogue", href: "/catalogue" },
] as const;

const PRODUCT_LINKS = [
  { label: "Kitchen", href: "/interior?category=Kitchen" },
  { label: "Bedroom", href: "/interior?category=Bedroom" },
  { label: "Bathroom", href: "/interior?category=Bathroom" },
  { label: "Furniture", href: "/interior?category=Furniture" },
  { label: "Door & Windows", href: "/interior?category=Door%20%26%20Windows" },
  { label: "Whole House Solutions", href: "/interior?category=Whole%20House%20Solutions" },
] as const;

function FooterNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`font-outfit text-[18px] leading-normal transition-colors hover:text-white ${
        active ? "font-medium text-[#cf5374]" : "font-normal text-white/80"
      }`}
    >
      {label}
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
  return <span className="font-outfit text-[23px] leading-none text-[#cf5374]">.</span>;
}

export default function Footer({
  bio = "Transforming homes with thoughtfully designed interiors tailored to your lifestyle and vision.",
  phone = "+91 98765 43210",
  email = "hello@Varsoviadesign.in",
  address = "SG Highway, Ahmedabad, Gujarat 380015",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#6a414d] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(1.25rem,7vw,100px)] pt-[75px] lg:min-h-[529px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-[128px]">
          {/* Brand column — Figma 319px @ left 100px, top 75px */}
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

            <p className="font-outfit text-[18px] font-normal leading-normal text-white/80">{bio}</p>

            <div className="flex items-center gap-5">
              <a href="#" aria-label="WhatsApp" className="shrink-0 transition-opacity hover:opacity-90">
                <IconWhatsApp />
              </a>
              <a href="#" aria-label="Instagram" className="shrink-0 transition-opacity hover:opacity-90">
                <IconInstagram />
              </a>
              <a href="#" aria-label="X" className="shrink-0 transition-opacity hover:opacity-90">
                <IconX />
              </a>
              <a href="#" aria-label="Facebook" className="shrink-0 transition-opacity hover:opacity-90">
                <IconFacebook />
              </a>
            </div>
          </div>

          {/* Link columns — Figma top 106px (31px below brand), gap 120px */}
          <div className="flex flex-col gap-10 sm:flex-row sm:flex-wrap lg:gap-[120px] lg:pt-[31px]">
            <div className="flex flex-col gap-[30px]">
              <p className="font-outfit text-[20px] font-medium leading-normal text-white">Home</p>
              <nav className="flex flex-col gap-4">
                {HOME_LINKS.map((link) => (
                  <FooterNavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-[30px]">
              <p className="font-outfit text-[20px] font-medium leading-normal text-white">Products</p>
              <nav className="flex flex-col gap-4">
                {PRODUCT_LINKS.map((link) => (
                  <FooterNavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </nav>
            </div>

            <div className="flex w-full max-w-[289px] flex-col gap-[30px]">
              <p className="font-outfit text-[20px] font-medium leading-normal text-white">Contact Us</p>
              <div className="flex flex-col gap-[18px]">
                <ContactRow icon="email">
                  <a href={`mailto:${email}`} className="whitespace-nowrap transition-colors hover:text-white">
                    {email}
                  </a>
                </ContactRow>
                <ContactRow icon="location">
                  <span className="max-w-[235px]">{address}</span>
                </ContactRow>
                <ContactRow icon="phone">
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="whitespace-nowrap transition-colors hover:text-white"
                  >
                    {phone}
                  </a>
                </ContactRow>
              </div>
            </div>
          </div>
        </div>

        {/* Divider @ y=429 + copyright @ y=439 in Figma */}
        <div className="mt-[clamp(2.5rem,6vw,5rem)] border-t border-white/20 pt-[10px] pb-[75px]">
          <div className="flex flex-wrap items-center gap-x-[10px] gap-y-2">
            <span className="font-outfit text-[12px] font-light leading-normal text-white/80">
              @{year} Varsovia Design
            </span>
            <LegalDot />
            <Link
              href="#"
              className="font-outfit text-[12px] font-light leading-normal text-white/80 transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <LegalDot />
            <Link
              href="#"
              className="font-outfit text-[12px] font-light leading-normal text-white/80 transition-colors hover:text-white"
            >
              Terms
            </Link>
            <LegalDot />
            <Link
              href="#"
              className="font-outfit text-[12px] font-light leading-normal text-white/80 transition-colors hover:text-white"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

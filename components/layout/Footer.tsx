"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";

type FooterProps = {
  bio?: string;
  phone?: string;
  email?: string;
  address?: string;
};

function SocialCircle({ label, children }: { label: string; children: ReactNode }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e8a0ad] text-[#5c3d46] transition hover:bg-white"
    >
      {children}
    </a>
  );
}

export default function Footer({
  bio = "Transforming homes with thoughtfully designed interiors that feel timeless, warm, and uniquely yours.",
  phone = "+91 98765 43210",
  email = "hello@Varsoviadesign.in",
  address = "SG Highway, Ahmedabad, Gujarat 380015",
}: FooterProps) {
  return (
    <footer className="bg-[#5c3d46] text-white">
      <div className="container-1240 grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl tracking-[0.16em]">VARSOVIA</p>
          <p className="mt-1 text-[0.7rem] tracking-[0.28em] text-white/70">DESIGN</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-white/75">{bio}</p>
          <div className="mt-6 flex gap-2.5">
            <SocialCircle label="WhatsApp">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.5-1-.9-1.5-1.9-1.7-2.2-.2-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 1.8.8 2.4.8 3.3.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3 0-.1-.2-.2-.5-.3zM12 2a10 10 0 0 0-8.7 14.9L2 22l5.2-1.4A10 10 0 1 0 12 2z" />
              </svg>
            </SocialCircle>
            <SocialCircle label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zm5.25-3.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
              </svg>
            </SocialCircle>
            <SocialCircle label="X">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.2 2H21l-6.6 7.5L22 22h-6.2l-4.4-6.3L6 22H3.2l7-8L2 2h6.3l4 5.8L18.2 2zm-1.1 18h1.7L7 3.9H5.2L17.1 20z" />
              </svg>
            </SocialCircle>
            <SocialCircle label="Facebook">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.174 2.097 15.943 2 14.643 2 11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
              </svg>
            </SocialCircle>
          </div>
        </div>

        <div>
          <h3 className="text-sm tracking-[0.14em] uppercase text-white/90">Home</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li>
              <a href="/blog" className="hover:text-[#e8a0ad]">
                Blog
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-[#e8a0ad]">
                About Us
              </a>
            </li>
            <li>
              <a href="/quality-sale" className="text-[#e8a0ad]">
                Service
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-[#e8a0ad]">
                FAQ
              </a>
            </li>
            <li>
              <a href="/catalogue" className="hover:text-[#e8a0ad]">
                Catalogue
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm tracking-[0.14em] uppercase text-white/90">Products</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li>
              <a href="/interior?category=Kitchen" className="hover:text-[#e8a0ad]">
                Kitchen
              </a>
            </li>
            <li>
              <a href="/interior?category=Bedroom" className="hover:text-[#e8a0ad]">
                Bedroom
              </a>
            </li>
            <li>
              <a href="/interior?category=Bathroom" className="hover:text-[#e8a0ad]">
                Bathroom
              </a>
            </li>
            <li>
              <a href="/interior?category=Furniture" className="hover:text-[#e8a0ad]">
                Furniture
              </a>
            </li>
            <li>
              <a href="/interior?category=Door%20%26%20Windows" className="hover:text-[#e8a0ad]">
                Door & Windows
              </a>
            </li>
            <li>
              <a href="/interior?category=Whole%20House%20Solutions" className="hover:text-[#e8a0ad]">
                Whole House Solutions
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm tracking-[0.14em] uppercase text-white/90">Contact Us</h3>
          <ul className="mt-5 space-y-4 text-sm text-white/75">
            <li className="flex gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-[#e8a0ad]" />
              <a href={`mailto:${email}`} className="hover:text-white">
                {email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#e8a0ad]" />
              <span>{address}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-[#e8a0ad]" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white">
                {phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-1240 flex flex-col gap-3 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>©{new Date().getFullYear()} Varsovia Design</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

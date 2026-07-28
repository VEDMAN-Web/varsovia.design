"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import NavbarLogo from "@/components/layout/NavbarLogo";
import ShowcaseNavDropdown from "@/components/layout/ShowcaseNavDropdown";
import {
  NAV_DROPDOWN_LINK,
  NAV_DROPDOWN_LINK_FEATURED,
  NAV_DROPDOWN_PANEL,
  NAV_DROPDOWN_TEXT,
} from "@/components/layout/navDropdownShared";

type NavItem = {
  label: string;
  href: string;
  hasArrow?: boolean;
  children?: { label: string; href: string }[];
};

type SearchPage = {
  title: string;
  href: string;
  description: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Interior",
    href: "/interior",
    hasArrow: true,
    children: [
      { label: "Kitchen", href: "/interior?category=Kitchen" },
      { label: "Bedroom", href: "/interior?category=Bedroom" },
      { label: "Bathroom", href: "/interior?category=Bathroom" },
      { label: "Furniture", href: "/interior?category=Furniture" },
      { label: "Door & Windows", href: "/interior?category=Door%20%26%20Windows" },
      { label: "Whole House Solutions", href: "/interior?category=Whole%20House%20Solutions" },
    ],
  },
  { label: "Free Catalogue", href: "/catalogue" },
  {
    label: "Showcase",
    href: "/showcase",
    hasArrow: true,
    children: [],
  },
  {
    label: "Company",
    href: "/about",
    hasArrow: true,
    children: [
      { label: "About Varsovia", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Our Blog", href: "/blog" },
      { label: "Quality After Sales", href: "/quality-sale" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    hasArrow: true,
    children: [
      { label: "Get in Touch", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

/** Add future pages here — search will pick them up automatically. */
export const searchablePages: SearchPage[] = [
  { title: "Home", href: "/", description: "Varsovia Design homepage" },
  { title: "Interior", href: "/interior", description: "Browse all interior designs" },
  { title: "Kitchen Cabinet", href: "/product/kitchen-cabinet", description: "Kitchen cabinet product detail" },
  { title: "Bedroom Interior", href: "/product/bedroom-interior", description: "Bedroom interior product detail" },
  { title: "Kitchen Interior", href: "/interior?category=Kitchen", description: "Kitchen designs" },
  { title: "About", href: "/about", description: "About Varsovia company" },
  { title: "Our Team", href: "/team", description: "Meet the Varsovia design team" },
  { title: "Our Blog", href: "/blog", description: "Interior design ideas and inspiration" },
  { title: "Free Catalogue", href: "/catalogue", description: "Browse design catalogues" },
  { title: "Contact", href: "/contact", description: "Get in touch / Free consultation" },
  { title: "FAQ", href: "/faq", description: "Frequently asked questions about interiors" },
  { title: "Showcase", href: "/showcase", description: "Browse home case and commercial projects showcase" },
  { title: "Quality After Sales", href: "/quality-sale", description: "After sales service and warranty specifications" },
];

const languages = [
  { code: "en", label: "English", flag: "/icon/flag-english.svg" },
  { code: "th", label: "Thai", flag: "/icon/flag-thailand.svg" },
  { code: "pl", label: "Polish", flag: "/icon/flag-polish.svg" },
] as const;

function NavChevron({ className = "", size = 16 }: { className?: string; size?: number }) {
  return (
    <ChevronDown
      size={size}
      strokeWidth={1.75}
      className={`shrink-0 opacity-70 ${className}`}
      aria-hidden
    />
  );
}

const navLinkClass = (active: boolean) =>
  `flex shrink-0 items-center gap-[10px] whitespace-nowrap text-[19px] font-normal leading-[28px] transition-colors ${
    active ? "text-maroon" : "text-[#2b2b2b] hover:text-maroon"
  }`;

/** Figma Frame 82 — 50px controls, 6px radius, Outfit 15px */
const headerBtnBase =
  "inline-flex h-[50px] items-center justify-center rounded-[6px] font-outfit text-[15px] font-normal leading-[23px] transition duration-200";

const dropdownPanel = NAV_DROPDOWN_PANEL;
const dropdownLink = NAV_DROPDOWN_LINK;
const dropdownLinkFeatured = NAV_DROPDOWN_LINK_FEATURED;

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState<(typeof languages)[number]>(languages[1]);
  const [searchHover, setSearchHover] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchablePages.slice(0, 5);
    return searchablePages.filter(
      (page) =>
        page.title.toLowerCase().includes(q) ||
        page.description.toLowerCase().includes(q)
    );
  }, [query]);

  const showResults = searchFocused || searchHover || query.length > 0;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setLangOpen(false);
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  function openDropdown(label: string) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenMenu(label);
    setLangOpen(false);
    setSearchFocused(false);
  }

  function scheduleCloseDropdown() {
    closeTimerRef.current = setTimeout(() => setOpenMenu(null), 150);
  }

  function goToPage(href: string) {
    setQuery("");
    setSearchFocused(false);
    setMobileOpen(false);
    setOpenMenu(null);
    window.location.href = href;
  }

  function isActive(item: NavItem) {
    if (item.href === "/") return pathname === "/";
    if (item.href.startsWith("/interior")) return pathname.startsWith("/interior");
    return false;
  }

  const headerSolid = scrolled || openMenu !== null || langOpen || mobileOpen;
  const searchExpanded = searchHover || searchFocused || query.length > 0;

  return (
    <header
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "border-b border-white/40 bg-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-sm"
          : "border-b border-transparent bg-transparent shadow-none backdrop-blur-none"
      }`}
    >
      <nav className="mx-auto flex h-[102.33px] w-full max-w-[1440px] items-center px-[clamp(1.25rem,7vw,100px)]">
        <NavbarLogo />

        {/* Figma Frame 81 — starts 71px after logo, 20px gaps between items */}
        <ul
          className={`ml-[71px] hidden min-w-0 shrink items-center transition-[gap] duration-300 xl:flex ${
            searchExpanded ? "gap-3" : "gap-5"
          }`}
        >
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <li
                key={item.label}
                className="relative shrink-0"
                onMouseEnter={() => item.hasArrow && openDropdown(item.label)}
                onMouseLeave={() => item.hasArrow && scheduleCloseDropdown()}
              >
                {item.hasArrow ? (
                  <button
                    type="button"
                    className={navLinkClass(active)}
                    onClick={() => {
                      setOpenMenu((prev) => (prev === item.label ? null : item.label));
                      setLangOpen(false);
                      setSearchFocused(false);
                    }}
                  >
                    <span
                      className={`relative shrink-0 whitespace-nowrap pb-0.5 ${
                        active ? "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-maroon" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                    <NavChevron className={`transition-transform ${openMenu === item.label ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={navLinkClass(active)}
                  >
                    <span
                      className={`relative shrink-0 whitespace-nowrap pb-0.5 ${
                        active ? "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-maroon" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                )}

                {item.hasArrow && openMenu === item.label && item.label === "Showcase" && (
                  <ShowcaseNavDropdown onNavigate={() => setOpenMenu(null)} />
                )}

                {item.hasArrow && openMenu === item.label && item.children && item.children.length > 0 && (
                  <div className={`${dropdownPanel} left-0`}>
                    {item.label === "Interior" && (
                      <Link
                        href="/interior"
                        className={dropdownLinkFeatured}
                        onClick={() => setOpenMenu(null)}
                      >
                        All Interiors
                      </Link>
                    )}
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={dropdownLink}
                        onClick={() => setOpenMenu(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
          </ul>

        <div className="min-w-0 flex-1" aria-hidden="true" />

        {/* Figma Frame 82 — search 24px + 20 + lang 110 + 20 + CTA 181 */}
        <div className="flex shrink-0 items-center gap-5">
          <div
            className="relative hidden sm:block"
            onMouseEnter={() => setSearchHover(true)}
            onMouseLeave={() => {
              if (!searchFocused && !query) setSearchHover(false);
            }}
          >
            <div
              className={`flex shrink-0 items-center overflow-hidden rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                searchExpanded
                  ? "h-11 w-[234px] border border-[#d8d5d0] bg-[#f7f5f2] pl-4 pr-1.5 shadow-[0_8px_22px_rgba(0,0,0,0.10)]"
                  : "h-6 w-6 border border-transparent bg-transparent shadow-none"
              }`}
            >
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  setSearchFocused(true);
                  setLangOpen(false);
                  setOpenMenu(null);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    if (!query) setSearchFocused(false);
                  }, 150);
                }}
                placeholder="Search..."
                tabIndex={searchExpanded ? 0 : -1}
                className={`min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[#333] outline-none transition-opacity duration-200 placeholder:text-[#b0b0b0] ${
                  searchExpanded
                    ? "pointer-events-auto opacity-100 delay-100"
                    : "pointer-events-none opacity-0"
                }`}
              />
              <button
                type="button"
                aria-label="Search"
                className={`inline-flex shrink-0 items-center justify-center bg-transparent text-[#2b2b2b] transition-colors duration-300 hover:text-maroon ${
                  searchExpanded ? "h-11 w-11 text-maroon" : "h-6 w-6"
                }`}
                onClick={() => {
                  setSearchHover(true);
                  setSearchFocused(true);
                  setLangOpen(false);
                  setOpenMenu(null);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
              >
                <Search size={24} strokeWidth={1.8} />
              </button>
            </div>

            {showResults && (searchFocused || query) && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border border-maroon/10 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                <p className="border-b border-maroon/5 px-4 py-2 text-[11px] tracking-[0.12em] uppercase text-muted">
                  Pages
                </p>
                {results.length > 0 ? (
                  <ul className="max-h-64 overflow-y-auto py-1">
                    {results.map((page) => (
                      <li key={page.href + page.title}>
                        <button
                          type="button"
                          className="flex w-full flex-col items-start px-4 py-2.5 text-left transition hover:bg-blush"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => goToPage(page.href)}
                        >
                          <span className="text-sm font-medium text-ink">{page.title}</span>
                          <span className="text-xs text-muted">{page.description}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-6 text-center text-sm text-muted">No pages found for “{query}”</p>
                )}
              </div>
            )}
          </div>

          <div className="relative hidden sm:block">
            <button
              type="button"
              className={`${headerBtnBase} w-[110px] gap-[6px] px-[17px] ${
                headerSolid
                  ? "border border-[#d8d8d8] bg-white/95 text-[#444] hover:border-[#b8b8b8]"
                  : "border border-[#d8d8d8]/90 bg-transparent text-[#444] hover:bg-white/40"
              }`}
              onClick={() => {
                setLangOpen((v) => !v);
                setOpenMenu(null);
                setSearchFocused(false);
              }}
            >
              <Image
                src={language.flag}
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 shrink-0 rounded-[2px] object-cover"
              />
              <span className="whitespace-nowrap">{language.label}</span>
              <NavChevron
                size={12}
                className={`text-[#444] transition-transform ${langOpen ? "rotate-180" : ""}`}
              />
            </button>

            {langOpen && (
              <div className={`${dropdownPanel} right-0 left-auto min-w-[190px]`}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`flex w-full items-center gap-3 px-5 py-3 text-left ${NAV_DROPDOWN_TEXT} transition-colors hover:bg-blush ${
                      language.code === lang.code ? "text-maroon" : "text-[#2b2b2b] hover:text-maroon"
                    }`}
                    onClick={() => {
                      setLanguage(lang);
                      setLangOpen(false);
                    }}
                  >
                    <Image
                      src={lang.flag}
                      alt=""
                      width={22}
                      height={14}
                      className="h-[14px] w-auto shrink-0 rounded-[2px] object-cover"
                      style={{ width: "auto" }}
                    />
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="/contact"
            className={`${headerBtnBase} hidden w-[181px] bg-[#6a414d] px-5 text-white hover:bg-[#5a3540] sm:inline-flex`}
          >
            Free Consultation
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-maroon xl:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-maroon/10 bg-white/95 px-4 py-5 backdrop-blur-md xl:hidden">
          <div className="mb-4 flex items-center rounded-full border border-[#e5e5e5] bg-[#f7f5f2] pl-4 pr-1.5 shadow-sm">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-[#b0b0b0]"
            />
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
              <Search size={16} />
            </span>
          </div>

          {query && (
            <ul className="mb-4 overflow-hidden rounded-2xl border border-maroon/10 bg-white">
              {results.map((page) => (
                <li key={page.href + page.title}>
                  <button
                    type="button"
                    className="flex w-full flex-col items-start border-b border-maroon/5 px-4 py-2.5 text-left last:border-0"
                    onClick={() => goToPage(page.href)}
                  >
                    <span className="text-sm font-medium">{page.title}</span>
                    <span className="text-xs text-muted">{page.description}</span>
                  </button>
                </li>
              ))}
              {!results.length && (
                <li className="px-4 py-4 text-center text-sm text-muted">No pages found</li>
              )}
            </ul>
          )}

          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-3 text-[19px] font-normal text-[#444]"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{item.label}</span>
                  {item.hasArrow && <NavChevron />}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center gap-2 border-t border-maroon/10 pt-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-2 py-2 text-xs ${
                  language.code === lang.code ? "border-maroon text-maroon" : "border-[#ddd] text-[#555]"
                }`}
                onClick={() => setLanguage(lang)}
              >
                <Image src={lang.flag} alt="" width={18} height={12} />
                {lang.label}
              </button>
            ))}
          </div>

          <a
            href="/contact"
            className="mt-4 flex w-full items-center justify-center rounded-md bg-maroon py-3 text-sm font-medium text-white"
            onClick={() => setMobileOpen(false)}
          >
            Free Consultation
          </a>
        </div>
      )}
    </header>
  );
}

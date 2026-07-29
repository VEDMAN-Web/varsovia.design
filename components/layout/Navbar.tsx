"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import NavbarLogo from "@/components/layout/NavbarLogo";
import ShowcaseNavDropdown from "@/components/layout/ShowcaseNavDropdown";
import {
  NAV_DROPDOWN_LINK,
  NAV_DROPDOWN_LINK_FEATURED,
  NAV_DROPDOWN_PANEL,
  NAV_DROPDOWN_TEXT,
} from "@/components/layout/navDropdownShared";
import { locales, type Locale } from "@/lib/i18n/routing";

type NavItem = {
  id: string;
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

const LANGUAGE_LABELS: Record<Locale, string> = {
  en: "English",
  th: "Thai",
  pl: "Polish",
};

const LANGUAGE_META: Record<Locale, { flag: string }> = {
  en: { flag: "/icon/flag-english.svg" },
  th: { flag: "/icon/flag-thailand.svg" },
  pl: { flag: "/icon/flag-polish.svg" },
};

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

const headerBtnBase =
  "inline-flex h-[50px] items-center justify-center rounded-[6px] font-outfit text-[15px] font-normal leading-[23px] transition duration-200";

const dropdownPanel = NAV_DROPDOWN_PANEL;
const dropdownLink = NAV_DROPDOWN_LINK;
const dropdownLinkFeatured = NAV_DROPDOWN_LINK_FEATURED;

function useNavItems(): NavItem[] {
  const t = useTranslations("nav");

  return useMemo(
    () => [
      { id: "home", label: t("home"), href: "/" },
      {
        id: "interior",
        label: t("interior"),
        href: "/interior",
        hasArrow: true,
        children: [
          { label: t("kitchen"), href: "/interior?category=Kitchen" },
          { label: t("bedroom"), href: "/interior?category=Bedroom" },
          { label: t("bathroom"), href: "/interior?category=Bathroom" },
          { label: t("furniture"), href: "/interior?category=Furniture" },
          { label: t("doorWindows"), href: "/interior?category=Door%20%26%20Windows" },
          { label: t("wholeHouse"), href: "/interior?category=Whole%20House%20Solutions" },
        ],
      },
      { id: "catalogue", label: t("freeCatalogue"), href: "/catalogue" },
      { id: "showcase", label: t("showcase"), href: "/showcase", hasArrow: true, children: [] },
      {
        id: "company",
        label: t("company"),
        href: "/about",
        hasArrow: true,
        children: [
          { label: t("aboutVarsovia"), href: "/about" },
          { label: t("ourTeam"), href: "/team" },
          { label: t("ourBlog"), href: "/blog" },
          { label: t("qualityAfterSales"), href: "/quality-sale" },
        ],
      },
      {
        id: "contact",
        label: t("contact"),
        href: "/contact",
        hasArrow: true,
        children: [
          { label: t("getInTouch"), href: "/contact" },
          { label: t("faq"), href: "/faq" },
        ],
      },
    ],
    [t],
  );
}

function useSearchablePages(): SearchPage[] {
  const t = useTranslations("search");

  return useMemo(
    () => [
      { title: t("homeTitle"), href: "/", description: t("homeDesc") },
      { title: t("interiorTitle"), href: "/interior", description: t("interiorDesc") },
      { title: t("kitchenCabinetTitle"), href: "/product/kitchen-cabinet", description: t("kitchenCabinetDesc") },
      { title: t("bedroomInteriorTitle"), href: "/product/bedroom-interior", description: t("bedroomInteriorDesc") },
      { title: t("kitchenInteriorTitle"), href: "/interior?category=Kitchen", description: t("kitchenInteriorDesc") },
      { title: t("aboutTitle"), href: "/about", description: t("aboutDesc") },
      { title: t("teamTitle"), href: "/team", description: t("teamDesc") },
      { title: t("blogTitle"), href: "/blog", description: t("blogDesc") },
      { title: t("catalogueTitle"), href: "/catalogue", description: t("catalogueDesc") },
      { title: t("contactTitle"), href: "/contact", description: t("contactDesc") },
      { title: t("faqTitle"), href: "/faq", description: t("faqDesc") },
      { title: t("showcaseTitle"), href: "/showcase", description: t("showcaseDesc") },
      { title: t("qualityTitle"), href: "/quality-sale", description: t("qualityDesc") },
    ],
    [t],
  );
}

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const navItems = useNavItems();
  const searchablePages = useSearchablePages();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [searchHover, setSearchHover] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentLanguage = LANGUAGE_META[locale];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchablePages.slice(0, 5);
    return searchablePages.filter(
      (page) =>
        page.title.toLowerCase().includes(q) ||
        page.description.toLowerCase().includes(q),
    );
  }, [query, searchablePages]);

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

  useEffect(() => {
    searchablePages.forEach((page) => {
      router.prefetch(page.href);
    });
  }, [router, searchablePages]);

  useEffect(() => {
    if (!showResults) return;
    results.forEach((page) => {
      router.prefetch(page.href);
    });
  }, [showResults, results, router]);

  function closeSearch() {
    setQuery("");
    setSearchFocused(false);
    setSearchHover(false);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  function openDropdown(id: string) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenMenu(id);
    setLangOpen(false);
    setSearchFocused(false);
  }

  function scheduleCloseDropdown() {
    closeTimerRef.current = setTimeout(() => setOpenMenu(null), 150);
  }

  function switchLocale(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale, scroll: false });
    setLangOpen(false);
    setMobileOpen(false);
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

        <ul
          className={`ml-[71px] hidden min-w-0 shrink items-center transition-[gap] duration-300 xl:flex ${
            searchExpanded ? "gap-3" : "gap-5"
          }`}
        >
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <li
                key={item.id}
                className="relative shrink-0"
                onMouseEnter={() => item.hasArrow && openDropdown(item.id)}
                onMouseLeave={() => item.hasArrow && scheduleCloseDropdown()}
              >
                {item.hasArrow ? (
                  <button
                    type="button"
                    className={navLinkClass(active)}
                    onClick={() => {
                      setOpenMenu((prev) => (prev === item.id ? null : item.id));
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
                    <NavChevron className={`transition-transform ${openMenu === item.id ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <Link href={item.href} className={navLinkClass(active)}>
                    <span
                      className={`relative shrink-0 whitespace-nowrap pb-0.5 ${
                        active ? "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-maroon" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                )}

                {item.hasArrow && openMenu === item.id && item.id === "showcase" && (
                  <ShowcaseNavDropdown onNavigate={() => setOpenMenu(null)} />
                )}

                {item.hasArrow && openMenu === item.id && item.children && item.children.length > 0 && (
                  <div className={`${dropdownPanel} left-0`}>
                    {item.id === "interior" && (
                      <Link
                        href="/interior"
                        className={dropdownLinkFeatured}
                        onClick={() => setOpenMenu(null)}
                      >
                        {t("allInteriors")}
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
                placeholder={t("searchPlaceholder")}
                tabIndex={searchExpanded ? 0 : -1}
                className={`min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[#333] outline-none transition-opacity duration-200 placeholder:text-[#b0b0b0] ${
                  searchExpanded
                    ? "pointer-events-auto opacity-100 delay-100"
                    : "pointer-events-none opacity-0"
                }`}
              />
              <button
                type="button"
                aria-label={t("searchAria")}
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
              <div
                className="absolute right-0 top-full z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border border-maroon/10 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
                data-lenis-prevent
              >
                <p className="border-b border-maroon/5 px-4 py-2 text-[11px] tracking-[0.12em] uppercase text-muted">
                  {t("searchPages")}
                </p>
                {results.length > 0 ? (
                  <ul
                    className="max-h-64 overflow-y-auto overscroll-y-contain py-1 [-ms-overflow-style:auto] [scrollbar-width:thin]"
                    data-lenis-prevent
                  >
                    {results.map((page) => (
                      <li key={page.href + page.title}>
                        <Link
                          href={page.href}
                          prefetch
                          onClick={closeSearch}
                          className="flex w-full flex-col items-start px-4 py-2.5 text-left transition hover:bg-blush"
                        >
                          <span className="text-sm font-medium text-ink">{page.title}</span>
                          <span className="text-xs text-muted">{page.description}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-6 text-center text-sm text-muted">
                    {t("noSearchResults", { query })}
                  </p>
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
                src={currentLanguage.flag}
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 shrink-0 rounded-[2px] object-cover"
              />
              <span className="whitespace-nowrap">{LANGUAGE_LABELS[locale]}</span>
              <NavChevron
                size={12}
                className={`text-[#444] transition-transform ${langOpen ? "rotate-180" : ""}`}
              />
            </button>

            {langOpen && (
              <div className={`${dropdownPanel} right-0 left-auto min-w-[190px]`}>
                {locales.map((code) => {
                  const meta = LANGUAGE_META[code];
                  return (
                    <button
                      key={code}
                      type="button"
                      className={`flex w-full items-center gap-3 px-5 py-3 text-left ${NAV_DROPDOWN_TEXT} transition-colors hover:bg-blush ${
                        locale === code ? "text-maroon" : "text-[#2b2b2b] hover:text-maroon"
                      }`}
                      onClick={() => switchLocale(code)}
                    >
                      <Image
                        src={meta.flag}
                        alt=""
                        width={22}
                        height={14}
                        className="h-[14px] w-auto shrink-0 rounded-[2px] object-cover"
                        style={{ width: "auto" }}
                      />
                      <span>{LANGUAGE_LABELS[code]}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`${headerBtnBase} hidden w-[181px] bg-[#6a414d] px-5 text-white hover:bg-[#5a3540] sm:inline-flex`}
          >
            {t("freeConsultation")}
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-maroon xl:hidden"
            aria-label={t("toggleMenu")}
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
              placeholder={t("searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-[#b0b0b0]"
            />
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
              <Search size={16} />
            </span>
          </div>

          {query && (
            <ul
              className="mb-4 max-h-64 overflow-y-auto overscroll-y-contain rounded-2xl border border-maroon/10 bg-white [-ms-overflow-style:auto] [scrollbar-width:thin]"
              data-lenis-prevent
            >
              {results.map((page) => (
                <li key={page.href + page.title}>
                  <Link
                    href={page.href}
                    prefetch
                    onClick={closeSearch}
                    className="flex w-full flex-col items-start border-b border-maroon/5 px-4 py-2.5 text-left last:border-0"
                  >
                    <span className="text-sm font-medium">{page.title}</span>
                    <span className="text-xs text-muted">{page.description}</span>
                  </Link>
                </li>
              ))}
              {!results.length && (
                <li className="px-4 py-4 text-center text-sm text-muted">
                  {t("noSearchResults", { query })}
                </li>
              )}
            </ul>
          )}

          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
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
            {locales.map((code) => {
              const meta = LANGUAGE_META[code];
              return (
                <button
                  key={code}
                  type="button"
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-2 py-2 text-xs ${
                    locale === code ? "border-maroon text-maroon" : "border-[#ddd] text-[#555]"
                  }`}
                  onClick={() => switchLocale(code)}
                >
                  <Image src={meta.flag} alt="" width={18} height={12} />
                  {LANGUAGE_LABELS[code]}
                </button>
              );
            })}
          </div>

          <Link
            href="/contact"
            className="mt-4 flex w-full items-center justify-center rounded-md bg-maroon py-3 text-sm font-medium text-white"
            onClick={() => setMobileOpen(false)}
          >
            {t("freeConsultation")}
          </Link>
        </div>
      )}
    </header>
  );
}

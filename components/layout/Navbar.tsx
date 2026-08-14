"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import NavbarLogo from "@/components/layout/NavbarLogo";
import ShowcaseNavDropdown, { MobileShowcaseLinks } from "@/components/layout/ShowcaseNavDropdown";
import NavMenuDropdown from "@/components/layout/NavMenuDropdown";
import {
  mobileSubLink,
  mobileSubLinkFeatured,
  mobileSubLinkRich,
  NavDropdownBody,
  NavDropdownPanel,
  NavDropdownSectionLabel,
  NavLanguageOption,
} from "@/components/layout/NavDropdown";
import { getNavDropdownSubtitle } from "@/components/layout/navDropdownMeta";
import NavSearchResults from "@/components/layout/NavSearchResults";
import { useSiteSearch } from "@/hooks/useSiteSearch";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { locales, type Locale } from "@/lib/i18n/routing";
import { DEFAULT_SITE_IMAGE_PATHS } from "@/lib/defaultSiteImages";
import { resolveMediaUrl } from "@/lib/mediaAssets";
import type { SearchResultType } from "@/lib/searchTypes";
import { useNavBackdropTone } from "@/hooks/useNavBackdropTone";
import {
  buildFallbackMainNavigation,
  resolveMainNavigation,
} from "@/lib/mainNavigation";
import type { ResolvedNavItem } from "@/lib/mainNavigationTypes";
import { trackCtaClick } from "@/lib/analytics";

type SearchPage = {
  title: string;
  href: string;
  description: string;
};

const SEARCH_TYPE_KEYS: Record<SearchResultType, "typePage" | "typeBlog" | "typeShowcase" | "typeInterior" | "typeProduct" | "typeCatalogue" | "typeTeam" | "typeFaq"> = {
  page: "typePage",
  blog: "typeBlog",
  showcase: "typeShowcase",
  interior: "typeInterior",
  product: "typeProduct",
  catalogue: "typeCatalogue",
  team: "typeTeam",
  faq: "typeFaq",
};

const LANGUAGE_DROPDOWN_LABEL = "Language";
const LANGUAGE_NAME_EN: Record<Locale, string> = {
  en: "English",
  th: "Thai",
  pl: "Polish",
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
  `font-outfit flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] font-medium leading-5 transition-colors 2xl:gap-1.5 2xl:text-[17px] 2xl:leading-[23px] ${
    active ? "text-maroon" : "text-[#2b2b2b] hover:text-maroon"
  }`;

const headerBtnBase =
  "inline-flex h-11 items-center justify-center rounded-[6px] font-outfit text-[15px] font-normal leading-5 transition duration-200 2xl:h-[50px] 2xl:text-[18px] 2xl:leading-[23px]";

function useSearchablePages(): SearchPage[] {
  const t = useTranslations("search");
  const site = useSiteSettings();

  return useMemo(() => {
    if (site?.searchPages && site.searchPages.length > 0) {
      return site.searchPages
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((p) => ({
          title: p.title,
          href: p.href,
          description: p.description,
        }));
    }
    return [
      { title: t("homeTitle"), href: "/", description: t("homeDesc") },
      { title: t("interiorTitle"), href: "/interior-design", description: t("interiorDesc") },
      { title: t("kitchenInteriorTitle"), href: "/interior-design?category=Kitchen", description: t("kitchenInteriorDesc") },
      { title: t("bedroomInteriorTitle"), href: "/interior-design?category=Bedroom", description: t("bedroomInteriorDesc") },
      { title: t("aboutTitle"), href: "/about", description: t("aboutDesc") },
      { title: t("teamTitle"), href: "/team", description: t("teamDesc") },
      { title: t("blogTitle"), href: "/journal", description: t("blogDesc") },
      { title: t("catalogueTitle"), href: "/catalogue", description: t("catalogueDesc") },
      { title: t("contactTitle"), href: "/contact", description: t("contactDesc") },
      { title: t("faqTitle"), href: "/faq", description: t("faqDesc") },
      { title: t("showcaseTitle"), href: "/projects", description: t("showcaseDesc") },
      { title: t("qualityTitle"), href: "/quality-sale", description: t("qualityDesc") },
    ];
  }, [site?.searchPages, t]);
}

export default function Navbar({ overlayHero = false }: { overlayHero?: boolean }) {
  const t = useTranslations("nav");
  const tSearch = useTranslations("search");
  const tDrop = useTranslations("navDropdown");
  const tShowcase = useTranslations("showcase");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const site = useSiteSettings();
  const navItems = useMemo(() => {
    const fromApi = resolveMainNavigation(site);
    if (fromApi.length > 0) return fromApi;
    return buildFallbackMainNavigation(t, tDrop, tShowcase);
  }, [site, t, tDrop, tShowcase]);
  const searchablePages = useSearchablePages();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [searchHover, setSearchHover] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchFocused, setMobileSearchFocused] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreWrapRef = useRef<HTMLLIElement>(null);
  const [query, setQuery] = useState("");
  const { grouped, loading, fetchError, apiEligible, showEmpty } = useSiteSearch(
    query,
    searchablePages,
    locale,
  );
  const navRef = useRef<HTMLElement>(null);
  const overDarkBackdrop = useNavBackdropTone(navRef);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const languageMeta = useMemo(() => {
    const flags = site?.localeFlags;
    return {
      en: {
        flag: resolveMediaUrl(flags?.en, DEFAULT_SITE_IMAGE_PATHS.localeFlags.en),
      },
      th: {
        flag: resolveMediaUrl(flags?.th, DEFAULT_SITE_IMAGE_PATHS.localeFlags.th),
      },
      pl: {
        flag: resolveMediaUrl(flags?.pl, DEFAULT_SITE_IMAGE_PATHS.localeFlags.pl),
      },
    } satisfies Record<Locale, { flag: string }>;
  }, [site?.localeFlags]);

  const currentLanguage = languageMeta[locale];

  const navDropSubtitle = (href: string) => getNavDropdownSubtitle(href, tDrop);

  const languageLabel = (code: Locale) => LANGUAGE_NAME_EN[code];

  const searchTypeLabel = (type: SearchResultType) => tSearch(SEARCH_TYPE_KEYS[type]);

  const showResults = searchFocused || searchHover || query.length > 0;

  function collapseDesktopSearch() {
    searchInputRef.current?.blur();
    setSearchFocused(false);
    setSearchHover(false);
  }

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      const inSearch = searchWrapRef.current?.contains(target) ?? false;
      const inNav = navRef.current?.contains(target) ?? false;

      if (!inSearch) {
        collapseDesktopSearch();
      }

      if (!inNav) {
        setOpenMenu(null);
        setLangOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
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
    [...grouped.pages, ...grouped.content].forEach((hit) => {
      router.prefetch(hit.href);
    });
  }, [showResults, grouped.pages, grouped.content, router]);

  useEffect(() => {
    if (!mobileOpen) {
      setMobileExpanded(null);
      setMobileSearchFocused(false);
      return;
    }

    lenis?.stop();
    const scrollY = window.scrollY;
    const { style: bodyStyle } = document.body;
    const prevOverflow = bodyStyle.overflow;
    const prevTop = bodyStyle.top;
    const prevPosition = bodyStyle.position;
    const prevWidth = bodyStyle.width;

    bodyStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";

    return () => {
      bodyStyle.overflow = prevOverflow;
      bodyStyle.position = prevPosition;
      bodyStyle.top = prevTop;
      bodyStyle.width = prevWidth;
      window.scrollTo(0, scrollY);
      lenis?.start();
    };
  }, [mobileOpen, lenis]);

  function closeMobileMenu() {
    setMobileOpen(false);
    setMobileExpanded(null);
    setMobileSearchFocused(false);
  }

  function toggleMobileSection(id: string) {
    setMobileExpanded((prev) => (prev === id ? null : id));
  }

  function closeSearch() {
    setQuery("");
    setSearchFocused(false);
    setSearchHover(false);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  const searchResultsProps = {
    pages: grouped.pages,
    content: grouped.content,
    loading,
    fetchError,
    apiEligible,
    showEmpty,
    query: query.trim(),
    pagesSectionLabel: t("searchPages"),
    contentSectionLabel: tSearch("searchContent"),
    loadingLabel: tSearch("searchLoading"),
    partialErrorLabel: tSearch("searchPartialError"),
    emptyLabel: t("noSearchResults", { query: query.trim() }),
    typeLabel: searchTypeLabel,
    onNavigate: closeSearch,
  };

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
    closeTimerRef.current = setTimeout(() => setOpenMenu(null), 220);
  }

  function scheduleLangClose() {
    closeTimerRef.current = setTimeout(() => setLangOpen(false), 220);
  }

  function openLangDropdown() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setLangOpen(true);
    setOpenMenu(null);
    setSearchFocused(false);
  }

  function switchLocale(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale, scroll: false });
    setLangOpen(false);
    setMobileOpen(false);
  }

  function isActive(item: ResolvedNavItem) {
    if (item.href === "/") return pathname === "/";
    const base = item.href.split("?")[0] || item.href;
    if (base === "/projects" || base.startsWith("/showcase")) {
      return pathname.startsWith("/projects") || pathname.startsWith("/showcase");
    }
    if (base.startsWith("/interior")) return pathname.startsWith("/interior");
    if (base === "/about/varsovia" || base === "/about") {
      return pathname.startsWith("/about");
    }
    return pathname === base || pathname.startsWith(`${base}/`);
  }

  const headerSolid = scrolled || openMenu !== null || langOpen || mobileOpen;
  const searchExpanded = searchHover || searchFocused || query.length > 0;
  const frostedBar = headerSolid || overDarkBackdrop || overlayHero;
  const strongFrost = (overDarkBackdrop || overlayHero) && !headerSolid;

  /**
   * Same pattern as Thailand Kitchen's navbar: while the search bar is
   * expanded and eating horizontal space, tuck the least-critical items
   * behind a "..." menu instead of letting the bar wrap/overlap. They stay
   * reachable as plain links in the dropdown; only the top-level item's own
   * mega/dropdown submenu is skipped while collapsed.
   */
  const NAV_OVERFLOW_KEEP_ON_SEARCH = new Set([
    "home",
    "furniture",
    "interior",
    "showcase",
    "locations",
  ]);
  const overflowNavItems: ResolvedNavItem[] = searchExpanded
    ? navItems.filter((item) => !NAV_OVERFLOW_KEEP_ON_SEARCH.has(item.id))
    : [];
  const visibleNavItems: ResolvedNavItem[] = overflowNavItems.length
    ? navItems.filter((item) => NAV_OVERFLOW_KEEP_ON_SEARCH.has(item.id))
    : navItems;

  useEffect(() => {
    if (!searchExpanded) setMoreOpen(false);
  }, [searchExpanded]);

  useEffect(() => {
    if (!moreOpen) return;
    function onClick(event: MouseEvent) {
      if (!moreWrapRef.current?.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [moreOpen]);

  return (
    <header
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
        mobileOpen
          ? "border-b border-white/50 bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-sm"
          : frostedBar
            ? strongFrost
              ? "border-b border-white/40 bg-white/88 shadow-[0_4px_28px_rgba(0,0,0,0.12)] backdrop-blur-sm backdrop-saturate-110"
              : "border-b border-white/45 bg-white/78 shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm backdrop-saturate-105"
            : "border-b border-transparent bg-transparent shadow-none backdrop-blur-none"
      }`}
    >
      <nav className="mx-auto flex h-[102.33px] w-full max-w-[1440px] items-center px-[clamp(1.25rem,7vw,100px)]">
        <NavbarLogo />

        <ul
          className={`ml-[clamp(0.75rem,2vw,2.5rem)] hidden min-w-0 items-center transition-[gap] duration-300 xl:flex ${
            searchExpanded ? "gap-2" : "gap-2.5 2xl:gap-4"
          }`}
        >
          {visibleNavItems.map((item) => {
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
                    <NavChevron
                      className={`transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${openMenu === item.id ? "rotate-180" : ""}`}
                    />
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

                <AnimatePresence>
                  {item.hasArrow && openMenu === item.id && item.menuKind === "showcaseMega" && item.menu && (
                    <ShowcaseNavDropdown
                      key={`menu-${item.id}`}
                      menu={item.menu}
                      onNavigate={() => setOpenMenu(null)}
                    />
                  )}

                  {item.hasArrow && openMenu === item.id && item.menuKind === "dropdown" && item.menu && (
                    <NavMenuDropdown
                      key={`menu-${item.id}`}
                      featured={item.menu.featured}
                      sectionLabel={item.menu.sectionLabel}
                      children={item.menu.links.map((link) => ({
                        label: link.label ?? link.title ?? "",
                        href: link.href,
                      }))}
                      onNavigate={() => setOpenMenu(null)}
                      getSubtitle={(href) => {
                        const link = item.menu?.links.find((l) => l.href === href);
                        return link?.subtitle ?? navDropSubtitle(href);
                      }}
                    />
                  )}
                </AnimatePresence>
              </li>
            );
          })}

          {overflowNavItems.length > 0 ? (
            <li ref={moreWrapRef} className="relative shrink-0">
              <button
                type="button"
                aria-label="More"
                className={navLinkClass(
                  overflowNavItems.some((item) => isActive(item))
                )}
                onClick={() => setMoreOpen((open) => !open)}
              >
                <span className="relative shrink-0 whitespace-nowrap pb-0.5">
                  &#8230;
                </span>
              </button>

              <AnimatePresence>
                {moreOpen ? (
                  <div className="absolute right-0 top-full z-[80] mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-black/5 bg-white py-1 shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
                    {overflowNavItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className="block whitespace-nowrap px-4 py-2 text-sm text-[#2b2b2b] hover:bg-black/5 hover:text-maroon"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </AnimatePresence>
            </li>
          ) : null}
        </ul>

        <div className="ml-auto flex shrink-0 items-center justify-end gap-2 sm:gap-3 2xl:gap-4">
          <div
            ref={searchWrapRef}
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
                onBlur={(e) => {
                  const next = e.relatedTarget as Node | null;
                  if (next && searchWrapRef.current?.contains(next)) return;
                  requestAnimationFrame(() => {
                    const active = document.activeElement;
                    if (active && searchWrapRef.current?.contains(active)) return;
                    setSearchFocused(false);
                    if (!query.trim()) setSearchHover(false);
                  });
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

            <AnimatePresence>
              {showResults && (searchFocused || query) && (
                <NavDropdownPanel key="nav-search" align="right" className="w-[min(100vw-2rem,320px)]">
                  <NavDropdownBody>
                    <NavSearchResults {...searchResultsProps} variant="dropdown" />
                  </NavDropdownBody>
                </NavDropdownPanel>
              )}
            </AnimatePresence>
          </div>

          <div
            className="relative hidden sm:block"
            onMouseEnter={openLangDropdown}
            onMouseLeave={scheduleLangClose}
          >
            <button
              type="button"
              className={`${headerBtnBase} min-w-[7.75rem] justify-between gap-2 px-4 ${
                frostedBar
                  ? "border border-[#d8d8d8] bg-white/95 text-[#444] hover:border-[#b8b8b8]"
                  : "border border-[#d8d8d8]/90 bg-transparent text-[#444] hover:bg-white/40"
              }`}
              onClick={() => {
                setLangOpen((v) => !v);
                setOpenMenu(null);
                setSearchFocused(false);
              }}
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                <Image
                  src={currentLanguage.flag}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 shrink-0 rounded-[2px] object-cover"
                />
                <span className="text-[17px] leading-none whitespace-nowrap">{languageLabel(locale)}</span>
              </span>
              <NavChevron
                size={12}
                className={`shrink-0 text-[#444] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${langOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {langOpen && (
                <NavDropdownPanel key="nav-lang" align="right" className="min-w-[210px]">
                  <NavDropdownSectionLabel>{LANGUAGE_DROPDOWN_LABEL}</NavDropdownSectionLabel>
                  <NavDropdownBody className="py-1">
                    {locales.map((code) => {
                      const meta = languageMeta[code];
                      return (
                        <NavLanguageOption
                          key={code}
                          flag={meta.flag}
                          label={languageLabel(code)}
                          active={locale === code}
                          onClick={() => switchLocale(code)}
                        />
                      );
                    })}
                  </NavDropdownBody>
                </NavDropdownPanel>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/contact"
            className={`${headerBtnBase} hidden w-[150px] bg-[#6a414d] px-4 text-white hover:bg-[#5a3540] sm:inline-flex 2xl:w-[181px] 2xl:px-5`}
            onClick={() => trackCtaClick("free_consultation", "navbar_desktop")}
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
        <div
          className="scrollbar-brand max-h-[calc(100dvh-102px)] overflow-y-auto overscroll-contain border-t border-maroon/10 bg-white/96 px-4 py-5 pr-3 backdrop-blur-sm [-webkit-overflow-scrolling:touch] xl:hidden"
          data-lenis-prevent
        >
          <div className="mb-4 flex items-center rounded-full border border-[#e5e5e5] bg-[#f7f5f2] pl-4 pr-1.5 shadow-sm">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setMobileSearchFocused(true)}
              onBlur={() => {
                window.setTimeout(() => setMobileSearchFocused(false), 180);
              }}
              placeholder={t("searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-[#b0b0b0]"
            />
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
              <Search size={16} />
            </span>
          </div>

          {(mobileSearchFocused || query.length > 0) && (
            <NavSearchResults {...searchResultsProps} variant="mobile" />
          )}

          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const expanded = mobileExpanded === item.id;

              if (!item.hasArrow) {
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between py-3 text-[19px] font-normal text-[#444] transition-colors hover:text-maroon"
                      onClick={closeMobileMenu}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-3 text-left text-[19px] font-normal text-[#444] transition-colors hover:text-maroon"
                    aria-expanded={expanded}
                    onClick={() => toggleMobileSection(item.id)}
                  >
                    <span>{item.label}</span>
                    <NavChevron
                      className={`transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      expanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "pointer-events-none grid-rows-[0fr] opacity-0"
                    }`}
                    aria-hidden={!expanded}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-0.5 border-l border-[#e5dcd3]/80 pl-4 pb-2">
                        {item.menuKind === "showcaseMega" && item.menu ? (
                          <MobileShowcaseLinks menu={item.menu} onNavigate={closeMobileMenu} />
                        ) : item.menu ? (
                          <>
                            <Link
                              href={item.menu.featured.href}
                              className={mobileSubLinkFeatured}
                              onClick={closeMobileMenu}
                            >
                              {item.menu.featured.label}
                            </Link>
                            {item.menu.links
                              .filter((child) => child.href !== item.menu!.featured.href)
                              .map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={mobileSubLinkRich}
                                  onClick={closeMobileMenu}
                                >
                                  <span className="block font-outfit text-[15px] font-medium text-[#444] transition-colors hover:text-maroon">
                                    {child.label ?? child.title}
                                  </span>
                                  {(child.subtitle ?? navDropSubtitle(child.href)) ? (
                                    <span className="mt-0.5 block font-outfit text-[12px] text-[#6a414d]/65">
                                      {child.subtitle ?? navDropSubtitle(child.href)}
                                    </span>
                                  ) : null}
                                </Link>
                              ))}
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center gap-2 border-t border-maroon/10 pt-4">
            {locales.map((code) => {
              const meta = languageMeta[code];
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
                  {languageLabel(code)}
                </button>
              );
            })}
          </div>

          <Link
            href="/contact"
            className="mt-4 flex w-full items-center justify-center rounded-md bg-maroon py-3 text-sm font-medium text-white"
            onClick={() => {
              trackCtaClick("free_consultation", "navbar_mobile");
              closeMobileMenu();
            }}
          >
            {t("freeConsultation")}
          </Link>
        </div>
      )}
    </header>
  );
}

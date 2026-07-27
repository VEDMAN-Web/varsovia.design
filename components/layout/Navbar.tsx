"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";

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
    children: [
      { label: "Home Case", href: "/showcase?tab=Home%20case" },
      { label: "Commercial Project", href: "/showcase?tab=Commercial%20Project" },
    ],
  },
  {
    label: "Company",
    href: "/#about",
    hasArrow: true,
    children: [
      { label: "About Varsovia", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Quality After Sales", href: "/quality-sale" },
      { label: "Partners", href: "/#partners" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    hasArrow: true,
    children: [
      { label: "Get in Touch", href: "/contact" },
      { label: "Free Consultation", href: "/contact" },
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
  { title: "Free Catalogue", href: "/catalogue", description: "Browse design catalogues" },
  { title: "Contact", href: "/contact", description: "Get in touch / Free consultation" },
  { title: "Showcase", href: "/showcase", description: "Browse home case and commercial projects showcase" },
  { title: "Quality After Sales", href: "/quality-sale", description: "After sales service and warranty specifications" },
];

const languages = [
  { code: "en", label: "English", flag: "/icon/flag-english.svg" },
  { code: "th", label: "Thai", flag: "/icon/flag-thailand.svg" },
  { code: "pl", label: "Polish", flag: "/icon/flag-polish.svg" },
] as const;

function ArrowDown({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <Image
        src="/icon/Arrow-down.png"
        alt=""
        width={10}
        height={6}
        className="h-auto w-[10px] brightness-0 opacity-55"
        unoptimized
      />
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState<(typeof languages)[number]>(languages[1]);
  const [searchHover, setSearchHover] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <header ref={navRef} className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <nav className="container-1240 flex h-[72px] items-center justify-between gap-4 !px-4 sm:!px-6 lg:!px-0">
        <Link href="/" className="shrink-0">
          <Image
            src="/icon/navbar-logo.png"
            alt="Varsovia Design"
            width={118}
            height={56}
            className="h-12 w-auto object-contain sm:h-14"
            style={{ width: "auto" }}
            priority
          />
        </Link>

        <ul className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.label} className="relative">
                {item.hasArrow ? (
                  <button
                    type="button"
                    className={`flex items-center gap-1.5 px-3 py-2 text-[15px] transition-colors ${
                      active ? "text-maroon" : "text-[#5c5c5c] hover:text-maroon"
                    }`}
                    onClick={() => {
                      setOpenMenu((prev) => (prev === item.label ? null : item.label));
                      setLangOpen(false);
                      setSearchFocused(false);
                    }}
                  >
                    <span
                      className={`relative pb-0.5 ${
                        active ? "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-maroon" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                    <ArrowDown className={`mt-0.5 transition-transform ${openMenu === item.label ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[15px] transition-colors ${
                      active ? "text-maroon" : "text-[#5c5c5c] hover:text-maroon"
                    }`}
                  >
                    <span
                      className={`relative pb-0.5 ${
                        active ? "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-maroon" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                )}

                {item.hasArrow && openMenu === item.label && item.children && (
                  <div className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-2xl border border-maroon/10 bg-white py-2 shadow-lg">
                    {item.label === "Interior" && (
                      <Link
                        href="/interior"
                        className="block px-4 py-2.5 text-sm font-medium text-maroon transition hover:bg-blush"
                        onClick={() => setOpenMenu(null)}
                      >
                        All Interiors
                      </Link>
                    )}
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-[#5c5c5c] transition hover:bg-blush hover:text-maroon"
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

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pill search — expands on hover / focus */}
          <div
            className="relative hidden sm:block"
            onMouseEnter={() => setSearchHover(true)}
            onMouseLeave={() => {
              if (!searchFocused && !query) setSearchHover(false);
            }}
          >
            <div
              className={`flex items-center rounded-full border bg-[#f7f5f2] pl-4 pr-1.5 shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out ${
                searchHover || searchFocused || query
                  ? "w-[240px] border-[#cfcfcf] shadow-[0_8px_22px_rgba(0,0,0,0.10)]"
                  : "w-[48px] border-transparent bg-transparent shadow-none pl-0 pr-0"
              }`}
            >
              {(searchHover || searchFocused || query) && (
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
                    // keep open briefly so result click works
                    setTimeout(() => {
                      if (!query) setSearchFocused(false);
                    }, 150);
                  }}
                  placeholder="Search..."
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[#333] outline-none placeholder:text-[#b0b0b0]"
                />
              )}
              <button
                type="button"
                aria-label="Search"
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#333] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-300 ${
                  searchHover || searchFocused
                    ? "scale-105 shadow-[0_4px_12px_rgba(0,0,0,0.16)]"
                    : "scale-100"
                }`}
                onClick={() => {
                  setSearchHover(true);
                  setSearchFocused(true);
                  setLangOpen(false);
                  setOpenMenu(null);
                  setTimeout(() => searchInputRef.current?.focus(), 50);
                }}
              >
                <Search size={16} strokeWidth={1.8} />
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
              className="flex h-10 items-center gap-2 rounded-full border border-[#d8d8d8] bg-white/90 px-3 text-sm text-[#444] backdrop-blur-sm transition hover:border-maroon/40"
              onClick={() => {
                setLangOpen((v) => !v);
                setOpenMenu(null);
                setSearchFocused(false);
              }}
            >
              <Image
                src={language.flag}
                alt=""
                width={22}
                height={14}
                className="h-[14px] w-auto rounded-[2px] object-cover"
                style={{ width: "auto" }}
              />
              <span>{language.label}</span>
              <ArrowDown className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 min-w-[170px] overflow-hidden rounded-2xl border border-maroon/10 bg-white py-2 shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition hover:bg-blush ${
                      language.code === lang.code ? "text-maroon" : "text-[#444]"
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
                      className="h-[14px] w-auto rounded-[2px] object-cover"
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
            className="hidden rounded-md bg-maroon px-4 py-2.5 text-sm font-medium text-white transition hover:bg-maroon-deep sm:inline-flex"
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
                  className="flex items-center justify-between py-3 text-[15px] text-[#444]"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{item.label}</span>
                  {item.hasArrow && <ArrowDown />}
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

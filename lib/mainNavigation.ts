import { SHOWCASE_TABS, type ShowcaseTab } from "@/lib/showcaseData";
import { showcaseTabMessageKey } from "@/lib/showcaseTabI18n";
import type { SiteContent } from "@/lib/siteTypes";
import type { MainNavItem, ResolvedNavItem } from "@/lib/mainNavigationTypes";
import { getNavDropdownSubtitle } from "@/components/layout/navDropdownMeta";
import type { Locale } from "@/lib/i18n/routing";

function canonicalAboutHref(href: string) {
  const [path, query] = String(href || "").split("?");
  if (path === "/about/varsovia") {
    return query ? `/about?${query}` : "/about";
  }
  return href;
}

function mapNavItem(item: MainNavItem): ResolvedNavItem {
  const menu = item.menu
    ? {
        ...item.menu,
        featured: {
          ...item.menu.featured,
          href: canonicalAboutHref(item.menu.featured.href),
        },
        links: item.menu.links.map((link) => ({
          ...link,
          href: canonicalAboutHref(link.href),
        })),
      }
    : undefined;
  return {
    id: item.id,
    label: item.label,
    href: canonicalAboutHref(item.href),
    hasArrow: item.menuKind !== "none",
    menuKind: item.menuKind,
    menu,
  };
}

export function resolveMainNavigation(site: SiteContent | null | undefined): ResolvedNavItem[] {
  const items = site?.mainNavigation?.items;
  if (Array.isArray(items) && items.length > 0) {
    return items.map(mapNavItem);
  }
  return [];
}

const NAV_LABEL_KEY: Record<string, string> = {
  home: "home",
  furniture: "furniture",
  interior: "interior",
  showcase: "showcase",
  company: "company",
  contact: "contact",
};

function looksUntranslated(text: string, locale: Locale): boolean {
  const value = String(text || "").trim();
  if (!value) return true;
  if (locale === "th") return !/[\u0E00-\u0E7F]/.test(value);
  if (locale === "pl") return !/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(value);
  return false;
}

function pickNavText(current: string | undefined, localized: string, locale: Locale): string {
  const cur = String(current || "").trim();
  const next = String(localized || "").trim();
  if (!looksUntranslated(cur, locale)) return cur;
  return next || cur;
}

type MessageTranslator = ((key: string) => string) & {
  has?: (key: string) => boolean;
};

function safeMessage(t: MessageTranslator | NavTranslator, key: string): string {
  if (!key) return "";
  const translator = t as MessageTranslator;
  if (typeof translator.has === "function" && !translator.has(key)) return "";
  try {
    const value = translator(key);
    if (!value || value === key) return "";
    return value;
  } catch {
    return "";
  }
}

/** When CMS still has English on /th or /pl, use the live dictionary so chrome matches the locale. */
export function applyLiveLocaleToNavigation(
  items: ResolvedNavItem[],
  locale: Locale,
  t: NavTranslator,
  tDrop: NavTranslator,
  tShowcase: ShowcaseTranslator,
): ResolvedNavItem[] {
  if (locale === "en" || !items.length) return items;
  const drop = (href: string) => getNavDropdownSubtitle(href, tDrop as MessageTranslator) || "";
  return items.map((item) => {
    const labelKey = NAV_LABEL_KEY[item.id];
    const label = pickNavText(item.label, labelKey ? safeMessage(t, labelKey) : "", locale);
    const menu = item.menu
      ? {
          ...item.menu,
          featured: {
            ...item.menu.featured,
            label: pickNavText(
              item.menu.featured.label,
              item.id === "showcase" ? safeMessage(tShowcase, "navFeaturedTitle") : "",
              locale,
            ),
            subtitle: pickNavText(
              item.menu.featured.subtitle,
              drop(item.menu.featured.href),
              locale,
            ),
          },
          sectionLabel: pickNavText(item.menu.sectionLabel, safeMessage(t, "byRoom"), locale),
          links: item.menu.links.map((link) => ({
            ...link,
            title: pickNavText(link.title, "", locale),
            label: pickNavText(link.label, "", locale),
            subtitle: pickNavText(link.subtitle, drop(link.href), locale),
          })),
        }
      : undefined;
    return { ...item, label, menu };
  });
}

type NavTranslator = (key: string) => string;
type ShowcaseTranslator = (key: string) => string;

function showcaseHref(tab: ShowcaseTab) {
  if (tab === "Home case") return "/projects";
  return `/projects?tab=${encodeURIComponent(tab)}`;
}

/** Offline / pre-migration fallback — compact Group A header. */
export function buildFallbackMainNavigation(
  t: NavTranslator,
  tDrop: NavTranslator,
  tShowcase: ShowcaseTranslator,
): ResolvedNavItem[] {
  const drop = (href: string, fallback = "") =>
    getNavDropdownSubtitle(href, tDrop) || fallback;

  const furnitureLinks = [
    { title: "Kitchens", subtitle: "Modular & custom kitchen furniture", href: "/furniture/kitchens" },
    { title: "Wardrobes", subtitle: "Fitted wardrobe systems", href: "/furniture/wardrobes" },
    { title: "Living Room", subtitle: "Lounge & media furniture", href: "/furniture/living-room" },
    { title: "Bedrooms", subtitle: "Bedroom furniture suites", href: "/furniture/bedrooms" },
    { title: "Bathroom", subtitle: "Vanities & wet-room joinery", href: "/furniture/bathroom" },
    { title: "Dining", subtitle: "Dining furniture & storage", href: "/furniture/dining" },
    { title: "Doors", subtitle: "Interior door systems", href: "/furniture/doors" },
    { title: "Whole House", subtitle: "Full-home furniture packages", href: "/furniture/whole-house" },
  ].map((link) => ({
    ...link,
    subtitle: drop(link.href, link.subtitle),
  }));

  const interiorLinks = [
    { title: "Kitchen", subtitle: "Kitchen interior projects", href: "/interior-design?category=Kitchen" },
    { title: "Bedroom", subtitle: "Bedroom interior projects", href: "/interior-design?category=Bedroom" },
    { title: "Bathroom", subtitle: "Bathroom interior projects", href: "/interior-design?category=Bathroom" },
    {
      title: "Doors & Windows",
      subtitle: "Doors, windows & glazing projects",
      href: "/interior-design?category=Door%20%26%20Windows",
    },
    {
      title: "Whole House",
      subtitle: "Full-home interior projects",
      href: "/interior-design?category=Whole%20House%20Solutions",
    },
  ];

  const locationLinks = [
    { title: "Koh Samui", subtitle: "Island villas & residences", href: "/locations/koh-samui" },
    { title: "Phuket", subtitle: "Coastal homes & resorts", href: "/locations/phuket" },
    { title: "Bangkok", subtitle: "City apartments & townhomes", href: "/locations/bangkok" },
    { title: "Pattaya", subtitle: "Coastal living", href: "/locations/pattaya" },
    { title: "Hua Hin", subtitle: "Relaxed seaside homes", href: "/locations/hua-hin" },
    { title: "Chiang Mai", subtitle: "Northern residences", href: "/locations/chiang-mai" },
  ];

  const companyLinks = [
    { title: "Services", subtitle: "Design, make & install", href: "/services" },
    { title: t("freeCatalogue"), subtitle: drop("/catalogue", "Download the lookbook"), href: "/catalogue" },
    { title: t("ourBlog"), subtitle: drop("/journal", "Design insights"), href: "/journal" },
    { title: "Complete Interiors", subtitle: "Villas, condos & resorts", href: "/complete-interiors" },
    { title: "For Developers", subtitle: "Project partnerships", href: "/for-developers" },
    { title: "Livo", subtitle: "Brand partner", href: "/about/livo" },
    { title: "Oppolia", subtitle: "Brand partner", href: "/about/oppolia" },
    { title: t("ourTeam"), subtitle: drop("/team", "Meet the experts"), href: "/team" },
    { title: t("qualityAfterSales"), subtitle: drop("/quality-sale", "Care & after-sales"), href: "/quality-sale" },
  ];

  const contactLinks = [
    { label: t("getInTouch"), href: "/contact" },
    { label: t("faq"), href: "/faq" },
  ].map((link) => ({
    ...link,
    subtitle: drop(link.href),
  }));

  const showcaseItems = SHOWCASE_TABS.filter((tab) => tab !== "All");
  const showcaseLinks = showcaseItems.map((tab) => {
    const key = showcaseTabMessageKey(tab);
    return {
      title: tShowcase(`categoryMeta.${key}.title`),
      subtitle: tShowcase(`categoryMeta.${key}.subtitle`),
      href: showcaseHref(tab),
    };
  });

  return [
    { id: "home", label: t("home"), href: "/", hasArrow: false, menuKind: "none" },
    {
      id: "furniture",
      label: "Furniture",
      href: "/furniture",
      hasArrow: true,
      menuKind: "showcaseMega",
      menu: {
        featured: {
          href: "/furniture",
          label: "All Furniture",
          subtitle: drop("/furniture", "Kitchens to whole-home fit-outs"),
        },
        sectionLabel: "Categories",
        links: furnitureLinks,
      },
    },
    {
      id: "interior",
      label: t("interior"),
      href: "/interior-design",
      hasArrow: true,
      menuKind: "showcaseMega",
      menu: {
        featured: {
          href: "/interior-design",
          label: t("allInteriors"),
          subtitle: "Interior design projects by room",
        },
        sectionLabel: t("byRoom"),
        links: interiorLinks,
      },
    },
    {
      id: "showcase",
      label: t("showcase"),
      href: "/projects",
      hasArrow: true,
      menuKind: "showcaseMega",
      menu: {
        featured: {
          href: "/projects?tab=All",
          label: tShowcase("navFeaturedTitle"),
          subtitle: tShowcase("navEverySpace"),
        },
        sectionLabel: tShowcase("navByRegion"),
        links: showcaseLinks,
      },
    },
    {
      id: "locations",
      label: "Locations",
      href: "/locations",
      hasArrow: true,
      menuKind: "showcaseMega",
      menu: {
        featured: {
          href: "/locations",
          label: "All Locations",
          subtitle: "Where we design across Thailand",
        },
        sectionLabel: "Cities",
        links: locationLinks,
      },
    },
    {
      id: "company",
      label: t("company"),
      href: "/about",
      hasArrow: true,
      menuKind: "showcaseMega",
      menu: {
        featured: {
          href: "/about",
          label: t("aboutVarsovia"),
          subtitle: drop("/about", "Our story & vision"),
        },
        sectionLabel: "Discover",
        links: companyLinks,
      },
    },
    {
      id: "contact",
      label: t("contact"),
      href: "/contact",
      hasArrow: true,
      menuKind: "dropdown",
      menu: {
        featured: {
          href: "/contact",
          label: t("getInTouch"),
          subtitle: drop("/contact"),
        },
        sectionLabel: t("supportSection"),
        links: contactLinks,
      },
    },
  ];
}

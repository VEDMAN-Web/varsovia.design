import { SHOWCASE_TABS, type ShowcaseTab } from "@/lib/showcaseData";
import { showcaseTabMessageKey } from "@/lib/showcaseTabI18n";
import type { SiteContent } from "@/lib/siteTypes";
import type { MainNavItem, ResolvedNavItem } from "@/lib/mainNavigationTypes";

function mapNavItem(item: MainNavItem): ResolvedNavItem {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    hasArrow: item.menuKind !== "none",
    menuKind: item.menuKind,
    menu: item.menu,
  };
}

export function resolveMainNavigation(site: SiteContent | null | undefined): ResolvedNavItem[] {
  const items = site?.mainNavigation?.items;
  if (Array.isArray(items) && items.length > 0) {
    return items.map(mapNavItem);
  }
  return [];
}

type NavTranslator = (key: string) => string;
type ShowcaseTranslator = (key: string) => string;

function showcaseHref(tab: ShowcaseTab) {
  if (tab === "Home case") return "/showcase";
  return `/showcase?tab=${encodeURIComponent(tab)}`;
}

/** Offline / pre-migration fallback — mirrors hardcoded Navbar + i18n. */
export function buildFallbackMainNavigation(
  t: NavTranslator,
  tDrop: NavTranslator,
  tShowcase: ShowcaseTranslator,
): ResolvedNavItem[] {
  const interiorLinks = [
    { label: t("kitchen"), href: "/interior?category=Kitchen" },
    { label: t("bedroom"), href: "/interior?category=Bedroom" },
    { label: t("bathroom"), href: "/interior?category=Bathroom" },
    { label: t("furniture"), href: "/interior?category=Furniture" },
    { label: t("doorWindows"), href: "/interior?category=Door%20%26%20Windows" },
    { label: t("wholeHouse"), href: "/interior?category=Whole%20House%20Solutions" },
  ].map((link) => ({
    ...link,
    subtitle: tDrop(link.href) || undefined,
  }));

  const companyLinks = [
    { label: t("aboutVarsovia"), href: "/about" },
    { label: t("ourTeam"), href: "/team" },
    { label: t("ourBlog"), href: "/blog" },
    { label: t("qualityAfterSales"), href: "/quality-sale" },
  ].map((link) => ({
    ...link,
    subtitle: tDrop(link.href) || undefined,
  }));

  const contactLinks = [
    { label: t("getInTouch"), href: "/contact" },
    { label: t("faq"), href: "/faq" },
  ].map((link) => ({
    ...link,
    subtitle: tDrop(link.href) || undefined,
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
      id: "interior",
      label: t("interior"),
      href: "/interior",
      hasArrow: true,
      menuKind: "dropdown",
      menu: {
        featured: {
          href: "/interior",
          label: t("allInteriors"),
          subtitle: tDrop("/interior") || undefined,
        },
        sectionLabel: t("byRoom"),
        links: interiorLinks,
      },
    },
    { id: "catalogue", label: t("freeCatalogue"), href: "/catalogue", hasArrow: false, menuKind: "none" },
    {
      id: "showcase",
      label: t("showcase"),
      href: "/showcase",
      hasArrow: true,
      menuKind: "showcaseMega",
      menu: {
        featured: {
          href: "/showcase?tab=All",
          label: tShowcase("navFeaturedTitle"),
          subtitle: tShowcase("navEverySpace"),
        },
        sectionLabel: tShowcase("navByRegion"),
        links: showcaseLinks,
      },
    },
    {
      id: "company",
      label: t("company"),
      href: "/about",
      hasArrow: true,
      menuKind: "dropdown",
      menu: {
        featured: {
          href: "/about",
          label: t("aboutVarsovia"),
          subtitle: tDrop("/about") || undefined,
        },
        sectionLabel: t("companySection"),
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
          subtitle: tDrop("/contact") || undefined,
        },
        sectionLabel: t("supportSection"),
        links: contactLinks,
      },
    },
  ];
}

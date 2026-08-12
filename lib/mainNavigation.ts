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
  if (tab === "Home case") return "/projects";
  return `/projects?tab=${encodeURIComponent(tab)}`;
}

/** Offline / pre-migration fallback — compact Group A header. */
export function buildFallbackMainNavigation(
  t: NavTranslator,
  tDrop: NavTranslator,
  tShowcase: ShowcaseTranslator,
): ResolvedNavItem[] {
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
    subtitle: tDrop(link.href) || link.subtitle,
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
    { title: t("freeCatalogue"), subtitle: "Download the lookbook", href: "/catalogue" },
    { title: t("ourBlog"), subtitle: tDrop("/journal") || "Design insights", href: "/journal" },
    { title: "Complete Interiors", subtitle: "Villas, condos & resorts", href: "/complete-interiors" },
    { title: "For Developers", subtitle: "Project partnerships", href: "/for-developers" },
    { title: "Livo", subtitle: "Brand partner", href: "/about/livo" },
    { title: "Oppolia", subtitle: "Brand partner", href: "/about/oppolia" },
    { title: t("ourTeam"), subtitle: tDrop("/team") || "Meet the experts", href: "/team" },
    { title: t("qualityAfterSales"), subtitle: tDrop("/quality-sale") || "Care & after-sales", href: "/quality-sale" },
  ];

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
      id: "furniture",
      label: "Furniture",
      href: "/furniture",
      hasArrow: true,
      menuKind: "showcaseMega",
      menu: {
        featured: {
          href: "/furniture",
          label: "All Furniture",
          subtitle: tDrop("/furniture") || "Kitchens to whole-home fit-outs",
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
      href: "/about/varsovia",
      hasArrow: true,
      menuKind: "showcaseMega",
      menu: {
        featured: {
          href: "/about/varsovia",
          label: t("aboutVarsovia"),
          subtitle: tDrop("/about") || "Our story & vision",
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
          subtitle: tDrop("/contact") || undefined,
        },
        sectionLabel: t("supportSection"),
        links: contactLinks,
      },
    },
  ];
}

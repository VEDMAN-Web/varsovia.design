import type { SiteContent } from "@/lib/siteTypes";
import type { MainNavMenu } from "@/lib/mainNavigationTypes";
import { INTERIOR_CATEGORIES, type InteriorCategory } from "@/lib/interiorData";
import { strField } from "@/lib/iaPages";

export type InteriorPageCategoryMeta = {
  title: string;
  subtitle: string;
};

export type InteriorPageNav = {
  categories: InteriorCategory[];
  metaForCategory: (category: InteriorCategory) => InteriorPageCategoryMeta;
  labelForCategory: (category: InteriorCategory) => string;
};

function matchInteriorCategory(value: string): InteriorCategory | null {
  const decoded = decodeURIComponent(value).trim();
  const match = INTERIOR_CATEGORIES.find((c) => c.toLowerCase() === decoded.toLowerCase());
  return match ?? null;
}

/** Map header interior dropdown hrefs to listing category ids. */
export function parseInteriorCategoryFromHref(href: string): InteriorCategory | null {
  const raw = href.trim();
  if (!raw) return null;

  const tryParams = (pathAndQuery: string) => {
    const qIndex = pathAndQuery.indexOf("?");
    const path = qIndex >= 0 ? pathAndQuery.slice(0, qIndex) : pathAndQuery;
    const normalizedPath = path.replace(/\/$/, "") || "/";
    if (
      !normalizedPath.endsWith("/interior") &&
      !normalizedPath.endsWith("/interior-design")
    ) {
      return null;
    }
    if (qIndex < 0) return "All" as InteriorCategory;
    const params = new URLSearchParams(pathAndQuery.slice(qIndex + 1));
    const categoryParam = params.get("category");
    if (!categoryParam) return "All" as InteriorCategory;
    return matchInteriorCategory(categoryParam);
  };

  if (raw.startsWith("http")) {
    try {
      const url = new URL(raw);
      return tryParams(url.pathname + url.search);
    } catch {
      return null;
    }
  }

  return tryParams(raw.startsWith("/") ? raw : `/${raw}`);
}

function getInteriorDropdownMenu(site: SiteContent | null | undefined): MainNavMenu | null {
  const item = site?.mainNavigation?.items?.find(
    (i) => i.id === "interior" && i.menuKind === "dropdown" && i.menu,
  );
  return item?.menu ?? null;
}

function heroTitleFromLabel(label: string, category: InteriorCategory): string {
  const trimmed = label.trim();
  if (!trimmed) return category;
  if (/interior/i.test(trimmed)) return trimmed.toUpperCase();
  if (category === "All") return trimmed.toUpperCase();
  if (category === "Furniture" || category === "Whole House Solutions" || category === "Door & Windows") {
    return trimmed.toUpperCase();
  }
  return `${trimmed.toUpperCase()} INTERIOR`;
}

function fallbackMeta(
  category: InteriorCategory,
  tHero: (key: string) => string,
): InteriorPageCategoryMeta {
  const map: Record<InteriorCategory, { titleKey: string; subtitleKey: string }> = {
    All: { titleKey: "allTitle", subtitleKey: "allSubtitle" },
    Kitchen: { titleKey: "kitchenTitle", subtitleKey: "kitchenSubtitle" },
    Bedroom: { titleKey: "bedroomTitle", subtitleKey: "bedroomSubtitle" },
    Bathroom: { titleKey: "bathroomTitle", subtitleKey: "bathroomSubtitle" },
    Furniture: { titleKey: "furnitureTitle", subtitleKey: "furnitureSubtitle" },
    "Door & Windows": { titleKey: "doorWindowsTitle", subtitleKey: "doorWindowsSubtitle" },
    "Whole House Solutions": { titleKey: "wholeHouseTitle", subtitleKey: "wholeHouseSubtitle" },
  };
  const keys = map[category];
  return {
    title: tHero(keys.titleKey),
    subtitle: tHero(keys.subtitleKey),
  };
}

function fallbackLabel(category: InteriorCategory, tCat: (key: string) => string): string {
  const map: Record<InteriorCategory, string> = {
    All: tCat("all"),
    Kitchen: tCat("kitchen"),
    Bedroom: tCat("bedroom"),
    Bathroom: tCat("bathroom"),
    Furniture: tCat("furniture"),
    "Door & Windows": tCat("doorWindows"),
    "Whole House Solutions": tCat("wholeHouse"),
  };
  return map[category];
}

/**
 * Interior listing hero + room tabs aligned with header dropdown (site.mainNavigation).
 * Hub CMS `pages.interiorDesign.hero` overrides the "All" category headline when set.
 */
export function buildInteriorPageNav(
  site: SiteContent | null | undefined,
  tHero: (key: string) => string,
  tCat: (key: string) => string,
): InteriorPageNav {
  const menu = getInteriorDropdownMenu(site);
  const metaMap = new Map<InteriorCategory, InteriorPageCategoryMeta>();
  const labelMap = new Map<InteriorCategory, string>();
  const categoryOrder: InteriorCategory[] = [];

  if (menu) {
    const featuredCategory = parseInteriorCategoryFromHref(menu.featured.href);
    if (featuredCategory && !categoryOrder.includes(featuredCategory)) {
      categoryOrder.push(featuredCategory);
      metaMap.set(featuredCategory, {
        title: heroTitleFromLabel(menu.featured.label, featuredCategory),
        subtitle: menu.featured.subtitle ?? "",
      });
      labelMap.set(featuredCategory, menu.featured.label);
    }

    for (const link of menu.links) {
      const cat = parseInteriorCategoryFromHref(link.href);
      if (!cat || categoryOrder.includes(cat)) continue;
      categoryOrder.push(cat);
      const label = link.label ?? link.title ?? cat;
      metaMap.set(cat, {
        title: heroTitleFromLabel(label, cat),
        subtitle: link.subtitle ?? "",
      });
      labelMap.set(cat, label);
    }

    if (!categoryOrder.includes("All")) {
      categoryOrder.unshift("All");
      metaMap.set("All", {
        title: heroTitleFromLabel(menu.featured.label, "All"),
        subtitle: menu.featured.subtitle ?? "",
      });
      labelMap.set("All", menu.featured.label);
    }
  }

  if (categoryOrder.length === 0) {
    for (const cat of INTERIOR_CATEGORIES) {
      categoryOrder.push(cat);
      metaMap.set(cat, fallbackMeta(cat, tHero));
      labelMap.set(cat, fallbackLabel(cat, tCat));
    }
  }

  // Interior Design hub CMS → "All" listing hero (catalog page, not IaHubView)
  const hub = (site?.pages as Record<string, { hero?: { title?: unknown; subtitle?: unknown } }> | undefined)
    ?.interiorDesign;
  const hubTitle = strField(hub?.hero?.title, "");
  const hubSubtitle = strField(hub?.hero?.subtitle, "");
  if (hubTitle || hubSubtitle) {
    const prev = metaMap.get("All") ?? fallbackMeta("All", tHero);
    metaMap.set("All", {
      title: hubTitle ? hubTitle.toUpperCase() : prev.title,
      subtitle: hubSubtitle || prev.subtitle,
    });
    if (!categoryOrder.includes("All")) categoryOrder.unshift("All");
  }

  return {
    categories: categoryOrder,
    metaForCategory(category) {
      return metaMap.get(category) ?? fallbackMeta(category, tHero);
    },
    labelForCategory(category) {
      return labelMap.get(category) ?? fallbackLabel(category, tCat);
    },
  };
}

export function interiorCategoriesForUi(
  pageNav: InteriorPageNav,
  activeCategory: InteriorCategory,
): InteriorCategory[] {
  if (pageNav.categories.includes(activeCategory)) return pageNav.categories;
  if (INTERIOR_CATEGORIES.includes(activeCategory)) return [...pageNav.categories, activeCategory];
  return pageNav.categories;
}

import type { SiteContent } from "@/lib/siteTypes";
import type { MainNavMenu } from "@/lib/mainNavigationTypes";
import { SHOWCASE_CATEGORY_META, SHOWCASE_TABS, type ShowcaseTab } from "@/lib/showcaseData";

export type ShowcasePageTabMeta = {
  title: string;
  subtitle: string;
};

export type ShowcasePageNav = {
  tabs: ShowcaseTab[];
  metaForTab: (tab: ShowcaseTab) => ShowcasePageTabMeta;
  filterLabelForTab: (tab: ShowcaseTab) => string;
};

export const SHOWCASE_SUB_TABS = SHOWCASE_TABS.filter((tab) => tab !== "All") as Exclude<
  ShowcaseTab,
  "All"
>[];

export function showcaseListingHref(tab: ShowcaseTab): string {
  if (tab === "All") return "/projects";
  return `/projects?tab=${encodeURIComponent(tab)}`;
}

/** Map header / mega-menu hrefs to internal showcase filter ids. */
export function parseShowcaseTabFromHref(href: string): ShowcaseTab | null {
  const raw = href.trim();
  if (!raw) return null;

  const tryParams = (pathAndQuery: string) => {
    const qIndex = pathAndQuery.indexOf("?");
    const path = qIndex >= 0 ? pathAndQuery.slice(0, qIndex) : pathAndQuery;
    const normalizedPath = path.replace(/\/$/, "") || "/";
    if (normalizedPath.endsWith("/showcase") || normalizedPath.endsWith("/projects")) {
      if (qIndex < 0) return "All" as ShowcaseTab;
      const params = new URLSearchParams(pathAndQuery.slice(qIndex + 1));
      const tabParam = params.get("tab");
      if (!tabParam || tabParam === "All") return "All" as ShowcaseTab;
      if (SHOWCASE_TABS.includes(tabParam as ShowcaseTab)) return tabParam as ShowcaseTab;
    }
    return null;
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

function fallbackMeta(tab: ShowcaseTab): ShowcasePageTabMeta {
  return SHOWCASE_CATEGORY_META[tab] || { title: tab, subtitle: "" };
}

export function metaFromCms(
  site: SiteContent | null | undefined,
): Map<ShowcaseTab, ShowcasePageTabMeta> {
  const map = new Map<ShowcaseTab, ShowcasePageTabMeta>();
  const rows = Array.isArray(site?.showcaseMeta) ? site.showcaseMeta : [];
  for (const row of rows) {
    const tabKey = String(row?.tabKey ?? "").trim();
    if (!SHOWCASE_TABS.includes(tabKey as ShowcaseTab)) continue;
    const title = String(row?.title ?? "").trim();
    const subtitle = String(row?.subtitle ?? "").trim();
    if (!title && !subtitle) continue;
    map.set(tabKey as ShowcaseTab, { title, subtitle });
  }
  return map;
}

function resolvedMeta(
  site: SiteContent | null | undefined,
  tab: ShowcaseTab,
): ShowcasePageTabMeta {
  const cms = metaFromCms(site).get(tab);
  const seed = fallbackMeta(tab);
  return {
    title: cms?.title || seed.title,
    subtitle: cms?.subtitle || seed.subtitle,
  };
}

/**
 * Showcase listing hero + filter pills.
 * showcaseMeta is the only copy source (same fields as Admin → Showcase).
 */
export function buildShowcasePageNav(
  site: SiteContent | null | undefined,
  tShowcase: (key: string) => string,
): ShowcasePageNav {
  const tabs = [...SHOWCASE_TABS];
  return {
    tabs,
    metaForTab(tab) {
      return resolvedMeta(site, tab);
    },
    filterLabelForTab(tab) {
      if (tab === "All") return tShowcase("filterAll");
      return resolvedMeta(site, tab).title || tab;
    },
  };
}

/** Keep deep-linked tabs visible even if admin trimmed the list. */
export function showcaseTabsForUi(pageNav: ShowcasePageNav, activeTab: ShowcaseTab): ShowcaseTab[] {
  if (pageNav.tabs.includes(activeTab)) return pageNav.tabs;
  if (SHOWCASE_TABS.includes(activeTab)) return [...pageNav.tabs, activeTab];
  return pageNav.tabs;
}

/**
 * Mega-menu EXPLORE + By region & type = same CMS rows as the listing.
 * Featured = All tab. Links = every other tab.
 */
export function overlayShowcaseMegaMenu(
  menu: MainNavMenu | undefined,
  site: SiteContent | null | undefined,
): MainNavMenu | undefined {
  if (!menu) return menu;
  const all = resolvedMeta(site, "All");
  const sectionLabel =
    String(site?.projectsPage?.navSectionLabel ?? "").trim() || menu.sectionLabel || "";
  return {
    featured: {
      href: showcaseListingHref("All"),
      label: all.title || menu.featured.label,
      subtitle: all.subtitle || menu.featured.subtitle || "",
    },
    sectionLabel,
    links: SHOWCASE_SUB_TABS.map((tab) => {
      const row = resolvedMeta(site, tab);
      return {
        title: row.title,
        subtitle: row.subtitle,
        href: showcaseListingHref(tab),
      };
    }),
  };
}

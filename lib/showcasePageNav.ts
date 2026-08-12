import type { SiteContent } from "@/lib/siteTypes";
import type { MainNavMenu } from "@/lib/mainNavigationTypes";
import { SHOWCASE_TABS, type ShowcaseTab } from "@/lib/showcaseData";
import { showcaseTabMessageKey } from "@/lib/showcaseTabI18n";

export type ShowcasePageTabMeta = {
  title: string;
  subtitle: string;
};

export type ShowcasePageNav = {
  tabs: ShowcaseTab[];
  metaForTab: (tab: ShowcaseTab) => ShowcasePageTabMeta;
  filterLabelForTab: (tab: ShowcaseTab) => string;
};

/** Map header / mega-menu hrefs to internal showcase filter ids. */
export function parseShowcaseTabFromHref(href: string): ShowcaseTab | null {
  const raw = href.trim();
  if (!raw) return null;

  const tryParams = (pathAndQuery: string) => {
    const qIndex = pathAndQuery.indexOf("?");
    const path = qIndex >= 0 ? pathAndQuery.slice(0, qIndex) : pathAndQuery;
    const normalizedPath = path.replace(/\/$/, "") || "/";
    if (normalizedPath.endsWith("/showcase") || normalizedPath.endsWith("/projects")) {
      if (qIndex < 0) return "Home case" as ShowcaseTab;
      const params = new URLSearchParams(pathAndQuery.slice(qIndex + 1));
      const tabParam = params.get("tab");
      if (!tabParam) return "Home case" as ShowcaseTab;
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

function getShowcaseMegaMenu(site: SiteContent | null | undefined): MainNavMenu | null {
  const item = site?.mainNavigation?.items?.find((i) => i.menuKind === "showcaseMega" && i.menu);
  return item?.menu ?? null;
}

function fallbackMeta(tab: ShowcaseTab, tShowcase: (key: string) => string): ShowcasePageTabMeta {
  const key = showcaseTabMessageKey(tab);
  return {
    title: tShowcase(`categoryMeta.${key}.title`),
    subtitle: tShowcase(`categoryMeta.${key}.subtitle`),
  };
}

function fallbackFilterLabel(tab: ShowcaseTab, tShowcase: (key: string) => string): string {
  if (tab === "All") return tShowcase("filterAll");
  return tShowcase(`tabLabels.${showcaseTabMessageKey(tab)}`);
}

function metaFromCms(
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

/**
 * Showcase listing hero + filter pills.
 * Priority for headings: CMS showcaseMeta → mega menu → i18n fallbacks.
 */
export function buildShowcasePageNav(
  site: SiteContent | null | undefined,
  tShowcase: (key: string) => string,
): ShowcasePageNav {
  const menu = getShowcaseMegaMenu(site);
  const cmsMeta = metaFromCms(site);
  const metaMap = new Map<ShowcaseTab, ShowcasePageTabMeta>();
  const labelMap = new Map<ShowcaseTab, string>();
  const tabOrder: ShowcaseTab[] = [];

  if (menu) {
    const featuredTab = parseShowcaseTabFromHref(menu.featured.href);
    if (featuredTab && !tabOrder.includes(featuredTab)) {
      tabOrder.push(featuredTab);
      metaMap.set(featuredTab, {
        title: menu.featured.label,
        subtitle: menu.featured.subtitle ?? "",
      });
      labelMap.set(
        featuredTab,
        featuredTab === "All" ? tShowcase("filterAll") : menu.featured.label,
      );
    }

    for (const link of menu.links) {
      const tab = parseShowcaseTabFromHref(link.href);
      if (!tab || tabOrder.includes(tab)) continue;
      tabOrder.push(tab);
      const title = link.title ?? link.label ?? "";
      metaMap.set(tab, {
        title,
        subtitle: link.subtitle ?? "",
      });
      labelMap.set(tab, title || fallbackFilterLabel(tab, tShowcase));
    }

    if (!tabOrder.includes("All")) {
      tabOrder.unshift("All");
      metaMap.set("All", {
        title: menu.featured.label,
        subtitle: menu.featured.subtitle ?? "",
      });
      labelMap.set("All", tShowcase("filterAll"));
    }
  }

  if (tabOrder.length === 0) {
    for (const tab of SHOWCASE_TABS) {
      tabOrder.push(tab);
      metaMap.set(tab, fallbackMeta(tab, tShowcase));
      labelMap.set(tab, fallbackFilterLabel(tab, tShowcase));
    }
  }

  // CMS showcaseMeta overrides mega-menu / defaults for page headings
  for (const [tab, meta] of cmsMeta) {
    const prev = metaMap.get(tab);
    metaMap.set(tab, {
      title: meta.title || prev?.title || fallbackMeta(tab, tShowcase).title,
      subtitle: meta.subtitle || prev?.subtitle || fallbackMeta(tab, tShowcase).subtitle,
    });
    if (!tabOrder.includes(tab)) tabOrder.push(tab);
  }

  return {
    tabs: tabOrder,
    metaForTab(tab) {
      return metaMap.get(tab) ?? fallbackMeta(tab, tShowcase);
    },
    filterLabelForTab(tab) {
      return labelMap.get(tab) ?? fallbackFilterLabel(tab, tShowcase);
    },
  };
}

/** Keep deep-linked tabs visible even if admin trimmed the mega menu. */
export function showcaseTabsForUi(pageNav: ShowcasePageNav, activeTab: ShowcaseTab): ShowcaseTab[] {
  if (pageNav.tabs.includes(activeTab)) return pageNav.tabs;
  if (SHOWCASE_TABS.includes(activeTab)) return [...pageNav.tabs, activeTab];
  return pageNav.tabs;
}

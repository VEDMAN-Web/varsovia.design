import type { SiteContent } from "@/lib/siteTypes";
import type { MainNavMenu } from "@/lib/mainNavigationTypes";
import { childPath, getIaHub, strField } from "@/lib/iaPages";
import type { Locale } from "@/lib/i18n/routing";
import { looksUntranslated } from "@/lib/mainNavigation";

/**
 * Locations mega-menu = same city list as /locations cards.
 * Card / nav title + banner tagline from the city CMS rows — not a second hardcoded list.
 */
export function overlayLocationsMegaMenu(
  menu: MainNavMenu | undefined,
  site: SiteContent | null | undefined,
  locale: Locale | string = "en",
): MainNavMenu | undefined {
  if (!menu) return menu;
  const hub = getIaHub(site, "locations", locale);
  const children = (Array.isArray(hub.children) ? hub.children : [])
    .filter((child) => String(child.slug || "").trim())
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (!children.length) return menu;

  const prevByHref = new Map(
    (menu.links || []).map((link) => [String(link.href || ""), link]),
  );

  return {
    featured: {
      href: "/locations",
      label: menu.featured?.label || "All Locations",
      subtitle:
        menu.featured?.subtitle ||
        strField(hub.hero?.subtitle, "Where we design across Thailand", locale),
    },
    sectionLabel: menu.sectionLabel || "Cities",
    links: children.map((child) => {
      const href = childPath("locations", child.slug);
      const prev = prevByHref.get(href);
      const cmsTitle = strField(
        child.title,
        strField(child.hero?.title, child.slug, locale),
        locale,
      );
      const cmsSubtitle = strField(child.hero?.subtitle, "", locale);
      const loc = (locale === "th" || locale === "pl" ? locale : "en") as Locale;
      return {
        title:
          cmsTitle && !looksUntranslated(cmsTitle, loc)
            ? cmsTitle
            : prev?.title || cmsTitle,
        subtitle:
          cmsSubtitle && !looksUntranslated(cmsSubtitle, loc)
            ? cmsSubtitle
            : prev?.subtitle || cmsSubtitle,
        href,
      };
    }),
  };
}

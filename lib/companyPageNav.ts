import type { SiteContent } from "@/lib/siteTypes";
import type { MainNavMenu, MainNavMenuLink } from "@/lib/mainNavigationTypes";
import { childPath, getIaHub, strField, type IaHubKey } from "@/lib/iaPages";
import type { Locale } from "@/lib/i18n/routing";
import { looksUntranslated } from "@/lib/mainNavigation";

type NavCopy = { title: string; subtitle: string };

function hubCopy(
  site: SiteContent | null | undefined,
  hubKey: IaHubKey,
  locale: Locale | string,
): NavCopy {
  const hub = getIaHub(site, hubKey, locale);
  return {
    title: strField(hub.hero?.title, "", locale),
    subtitle: strField(hub.hero?.subtitle, "", locale),
  };
}

function childCopy(
  site: SiteContent | null | undefined,
  hubKey: IaHubKey,
  slug: string,
  locale: Locale | string,
): NavCopy {
  const hub = getIaHub(site, hubKey, locale);
  const child = (hub.children || []).find((row) => row.slug === slug);
  if (!child) return { title: "", subtitle: "" };
  return {
    title: strField(
      child.title,
      strField(child.hero?.title, slug, locale),
      locale,
    ),
    subtitle: strField(child.hero?.subtitle, "", locale),
  };
}

function pageCopy(
  title: unknown,
  subtitle: unknown,
  locale: Locale | string,
): NavCopy {
  return {
    title: strField(title, "", locale),
    subtitle: strField(subtitle, "", locale),
  };
}

function copyForHref(
  href: string,
  site: SiteContent | null | undefined,
  locale: Locale | string,
): NavCopy | null {
  const path = String(href || "").split("?")[0].replace(/\/$/, "") || "/";
  if (path === "/about") return hubCopy(site, "aboutBrand", locale);
  if (path === "/about/livo") return childCopy(site, "aboutBrand", "livo", locale);
  if (path === "/about/oppolia") return childCopy(site, "aboutBrand", "oppolia", locale);
  if (path === "/services") return hubCopy(site, "services", locale);
  if (path === "/complete-interiors") return hubCopy(site, "completeInteriors", locale);
  if (path === "/for-developers") return hubCopy(site, "forDevelopers", locale);
  if (path === "/journal") return hubCopy(site, "journal", locale);
  if (path === "/catalogue") {
    return pageCopy(
      site?.cataloguePage?.heroTitle,
      site?.cataloguePage?.heroSubtitle,
      locale,
    );
  }
  if (path === "/team") {
    return pageCopy(site?.teamPage?.heroTitle, site?.teamPage?.heroSubtitle, locale);
  }
  if (path === "/quality-sale") {
    const qs = site?.qualitySale || {};
    return pageCopy(qs.heroTitle, qs.heroSubtitle, locale);
  }
  if (path === "/contact") {
    return pageCopy(
      site?.contactPage?.heroTitle,
      site?.contactPage?.heroSubtitle,
      locale,
    );
  }
  if (path === "/faq") {
    return pageCopy(site?.faqPage?.heroTitle, site?.faqPage?.heroSubtitle, locale);
  }
  return null;
}

function overlayLink(
  link: MainNavMenuLink,
  site: SiteContent | null | undefined,
  locale: Locale | string,
): MainNavMenuLink {
  const cms = copyForHref(link.href, site, locale);
  if (!cms?.title) return link;
  const loc = (locale === "th" || locale === "pl" ? locale : "en") as Locale;
  const title =
    looksUntranslated(cms.title, loc) ? link.title || link.label || cms.title : cms.title;
  const subtitle =
    cms.subtitle && !looksUntranslated(cms.subtitle, loc)
      ? cms.subtitle
      : link.subtitle || cms.subtitle;
  return {
    ...link,
    title,
    label: title,
    subtitle,
  };
}

/**
 * Company + Contact mega-menus use the same titles/taglines as the live pages
 * (About hub/brands, Services, Catalogue, Team, Quality, Contact, FAQ, …).
 */
export function overlayCompanyMegaMenu(
  menu: MainNavMenu | undefined,
  site: SiteContent | null | undefined,
  locale: Locale | string = "en",
): MainNavMenu | undefined {
  if (!menu) return menu;
  const about = hubCopy(site, "aboutBrand", locale);
  const loc = (locale === "th" || locale === "pl" ? locale : "en") as Locale;
  const featuredLabel =
    about.title && !looksUntranslated(about.title, loc)
      ? about.title
      : menu.featured.label;
  const featuredSubtitle =
    about.subtitle && !looksUntranslated(about.subtitle, loc)
      ? about.subtitle
      : menu.featured.subtitle || "";
  return {
    featured: {
      href: menu.featured?.href || "/about",
      label: featuredLabel,
      subtitle: featuredSubtitle,
    },
    sectionLabel: menu.sectionLabel,
    links: (menu.links || []).map((link) => overlayLink(link, site, locale)),
  };
}

export function overlayContactMegaMenu(
  menu: MainNavMenu | undefined,
  site: SiteContent | null | undefined,
  locale: Locale | string = "en",
): MainNavMenu | undefined {
  if (!menu) return menu;
  const contact = copyForHref("/contact", site, locale);
  const loc = (locale === "th" || locale === "pl" ? locale : "en") as Locale;
  const featuredLabel =
    contact?.title && !looksUntranslated(contact.title, loc)
      ? contact.title
      : menu.featured.label;
  const featuredSubtitle =
    contact?.subtitle && !looksUntranslated(contact.subtitle, loc)
      ? contact.subtitle
      : menu.featured.subtitle || "";
  return {
    featured: {
      href: menu.featured?.href || "/contact",
      label: featuredLabel,
      subtitle: featuredSubtitle,
    },
    sectionLabel: menu.sectionLabel,
    links: (menu.links || []).map((link) => overlayLink(link, site, locale)),
  };
}

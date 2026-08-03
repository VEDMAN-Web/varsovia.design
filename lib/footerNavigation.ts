import type { SiteContent } from "@/lib/siteTypes";
import type { FooterNavigationConfig } from "@/lib/footerNavigationTypes";

export function resolveFooterNavigation(site: SiteContent | null | undefined): FooterNavigationConfig | null {
  const nav = site?.footerNavigation;
  if (!nav?.linkColumns?.length) return null;
  return nav;
}

type FooterT = (key: string, values?: Record<string, string | number>) => string;
type NavT = (key: string) => string;
type CatT = (key: string) => string;

export function buildFallbackFooterNavigation(t: FooterT, tNav: NavT, tCat: CatT): FooterNavigationConfig {
  const year = new Date().getFullYear();
  return {
    version: 1,
    linkColumns: [
      {
        id: "primary",
        links: [
          { label: t("blog"), href: "/blog" },
          { label: t("aboutUs"), href: "/about" },
          { label: t("contactUs"), href: "/contact" },
          { label: tNav("faq"), href: "/faq" },
          { label: t("catalogue"), href: "/catalogue" },
        ],
      },
      {
        id: "products",
        links: [
          { label: tCat("kitchen"), href: "/interior?category=Kitchen" },
          { label: tCat("bedroom"), href: "/interior?category=Bedroom" },
          { label: tCat("bathroom"), href: "/interior?category=Bathroom" },
          { label: tCat("furniture"), href: "/interior?category=Furniture" },
          { label: tCat("doorWindows"), href: "/interior?category=Door%20%26%20Windows" },
          { label: tCat("wholeHouse"), href: "/interior?category=Whole%20House%20Solutions" },
        ],
      },
    ],
    legalLinks: [
      { label: t("privacy"), href: "/privacy" },
      { label: t("terms"), href: "/terms" },
      { label: t("sitemap"), href: "/sitemap.xml" },
    ],
    contactHeading: t("contactUs"),
    contactLabels: {
      email: t("email"),
      mobileWhatsapp: t("mobileWhatsapp"),
      contactNumber: t("contactNumber"),
    },
    socialLabels: {
      whatsapp: t("whatsapp"),
      facebook: t("facebook"),
    },
    copyright: t("copyright", { year }),
  };
}

/** Replace `{year}` in copyright string from CMS. */
export function formatFooterCopyright(template: string, year: number) {
  if (template.includes("{year}")) {
    return template.replace(/\{year\}/g, String(year));
  }
  return template;
}

export function getFooterNavigationForUi(
  site: SiteContent | null | undefined,
  t: FooterT,
  tNav: NavT,
  tCat: CatT,
): FooterNavigationConfig {
  const fromApi = resolveFooterNavigation(site);
  if (fromApi) {
    return {
      ...fromApi,
      copyright: formatFooterCopyright(fromApi.copyright, new Date().getFullYear()),
    };
  }
  return buildFallbackFooterNavigation(t, tNav, tCat);
}

import type { SiteContent } from "@/lib/siteTypes";
import type { FooterNavigationConfig } from "@/lib/footerNavigationTypes";

export function resolveFooterNavigation(site: SiteContent | null | undefined): FooterNavigationConfig | null {
  const nav = site?.footerNavigation;
  if (!nav?.linkColumns?.length) return null;
  return {
    ...nav,
    linkColumns: nav.linkColumns.map((column) => ({
      ...column,
      links: (column.links || []).map((link) => ({
        ...link,
        href: link.href === "/about/varsovia" ? "/about" : link.href,
      })),
    })),
  };
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
          { label: t("blog"), href: "/journal" },
          { label: t("aboutUs"), href: "/about" },
          { label: t("contactUs"), href: "/contact" },
          { label: tNav("faq"), href: "/faq" },
          { label: t("catalogue"), href: "/catalogue" },
        ],
      },
      {
        id: "products",
        links: [
          { label: tCat("kitchen"), href: "/interior-design?category=Kitchen" },
          { label: tCat("bedroom"), href: "/interior-design?category=Bedroom" },
          { label: tCat("bathroom"), href: "/interior-design?category=Bathroom" },
          { label: tCat("furniture"), href: "/furniture" },
          { label: tCat("doorWindows"), href: "/interior-design?category=Door%20%26%20Windows" },
          { label: tCat("wholeHouse"), href: "/interior-design?category=Whole%20House%20Solutions" },
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
  locale: string = "en",
): FooterNavigationConfig {
  const fromApi = resolveFooterNavigation(site);
  const nav = fromApi
    ? {
        ...fromApi,
        copyright: formatFooterCopyright(fromApi.copyright, new Date().getFullYear()),
      }
    : buildFallbackFooterNavigation(t, tNav, tCat);
  if (locale === "en") return nav;

  const labelForHref = (href: string, current: string) => {
    const cur = String(current || "").trim();
    if (locale === "th" && /[\u0E00-\u0E7F]/.test(cur)) return cur;
    if (locale === "pl" && /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(cur)) return cur;
    const mapped: Record<string, string> = {
      "/journal": t("blog"),
      "/about": t("aboutUs"),
      "/contact": t("contactUs"),
      "/faq": tNav("faq"),
      "/catalogue": t("catalogue"),
      "/furniture": tCat("furniture"),
      "/interior-design?category=Kitchen": tCat("kitchen"),
      "/interior-design?category=Bedroom": tCat("bedroom"),
      "/interior-design?category=Bathroom": tCat("bathroom"),
      "/interior-design?category=Door%20%26%20Windows": tCat("doorWindows"),
      "/interior-design?category=Whole%20House%20Solutions": tCat("wholeHouse"),
      "/privacy": t("privacy"),
      "/terms": t("terms"),
      "/sitemap.xml": t("sitemap"),
    };
    return mapped[href] || cur;
  };

  return {
    ...nav,
    linkColumns: (nav.linkColumns || []).map((column) => ({
      ...column,
      links: (column.links || []).map((link) => ({
        ...link,
        label: labelForHref(link.href, link.label),
      })),
    })),
    legalLinks: (nav.legalLinks || []).map((link) => ({
      ...link,
      label: labelForHref(link.href, link.label),
    })),
    contactHeading: labelForHref("/contact", nav.contactHeading),
  };
}

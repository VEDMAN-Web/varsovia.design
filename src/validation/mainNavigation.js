/**
 * Admin-editable main header navigation (top bar + mega menus).
 * Stored on SiteContent.mainNavigation; localized on public GET /site.
 */

const MENU_KINDS = new Set(["none", "dropdown", "showcaseMega"]);

function loc(en, th = en, pl = en) {
  return { en, th, pl };
}

function dropdownLink(label, subtitle, href) {
  return { label: loc(label), subtitle: loc(subtitle), href };
}

function showcaseLink(title, subtitle, href) {
  return { title: loc(title), subtitle: loc(subtitle), href };
}

const SHOWCASE_NAV_LINKS = [
  showcaseLink("Home Case", "Spaces Designed to Inspire", "/showcase"),
  showcaseLink("North America", "Bold Design, Modern Living", "/showcase?tab=North%20America"),
  showcaseLink("South America", "Vibrant Spaces, Warm Character", "/showcase?tab=South%20America"),
  showcaseLink("Africa", "Rooted in Culture, Rich in Design", "/showcase?tab=Africa"),
  showcaseLink("Commercial Project", "Where Function Meets Vision", "/showcase?tab=Commercial%20Project"),
  showcaseLink("Europe", "Timeless Elegance, Refined Living", "/showcase?tab=Europe"),
  showcaseLink("Australia", "Light-Filled Spaces, Effortless Style", "/showcase?tab=Australia"),
  showcaseLink("Middle East", "Luxury Rooted in Tradition", "/showcase?tab=Middle%20East"),
  showcaseLink("Asia", "Harmony of Space and Serenity", "/showcase?tab=Asia"),
];

const DEFAULT_MAIN_NAVIGATION = {
  version: 1,
  items: [
    {
      id: "home",
      label: loc("Home"),
      href: "/",
      menuKind: "none",
      enabled: true,
      order: 1,
    },
    {
      id: "interior",
      label: loc("Interior"),
      href: "/interior",
      menuKind: "dropdown",
      enabled: true,
      order: 2,
      menu: {
        featuredLabel: loc("All Interiors"),
        featuredSubtitle: loc("Browse every room type"),
        featuredHref: "/interior",
        sectionLabel: loc("By room"),
        links: [
          dropdownLink("Kitchen", "Modular kitchens", "/interior?category=Kitchen"),
          dropdownLink("Bedroom", "Restful retreats", "/interior?category=Bedroom"),
          dropdownLink("Bathroom", "Spa-inspired spaces", "/interior?category=Bathroom"),
          dropdownLink("Furniture", "Curated pieces", "/interior?category=Furniture"),
          dropdownLink("Door & Windows", "Doors & glazing", "/interior?category=Door%20%26%20Windows"),
          dropdownLink("Whole House Solutions", "End-to-end design", "/interior?category=Whole%20House%20Solutions"),
        ],
      },
    },
    {
      id: "catalogue",
      label: loc("Free Catalogue"),
      href: "/catalogue",
      menuKind: "none",
      enabled: true,
      order: 3,
    },
    {
      id: "showcase",
      label: loc("Showcase"),
      href: "/showcase",
      menuKind: "showcaseMega",
      enabled: true,
      order: 4,
      menu: {
        featuredLabel: loc("Our Showcase"),
        featuredSubtitle: loc("Every space, every story"),
        featuredHref: "/showcase?tab=All",
        sectionLabel: loc("By region & type"),
        links: SHOWCASE_NAV_LINKS,
      },
    },
    {
      id: "company",
      label: loc("Company"),
      href: "/about",
      menuKind: "dropdown",
      enabled: true,
      order: 5,
      menu: {
        featuredLabel: loc("About Varsovia"),
        featuredSubtitle: loc("Our story & vision"),
        featuredHref: "/about",
        sectionLabel: loc("Company"),
        links: [
          dropdownLink("About Varsovia", "Our story & vision", "/about"),
          dropdownLink("Our Team", "Meet the experts", "/team"),
          dropdownLink("Our Blog", "Design insights", "/blog"),
          dropdownLink("Quality After Sales", "Care & after-sales", "/quality-sale"),
        ],
      },
    },
    {
      id: "contact",
      label: loc("Contact"),
      href: "/contact",
      menuKind: "dropdown",
      enabled: true,
      order: 6,
      menu: {
        featuredLabel: loc("Get in Touch"),
        featuredSubtitle: loc("Start your project"),
        featuredHref: "/contact",
        sectionLabel: loc("Support"),
        links: [
          dropdownLink("Get in Touch", "Start your project", "/contact"),
          dropdownLink("FAQ", "Common questions", "/faq"),
        ],
      },
    },
  ],
};

function normalizeMenu(raw) {
  if (!raw || typeof raw !== "object") return undefined;
  const links = Array.isArray(raw.links) ? raw.links.filter((l) => l && typeof l === "object") : [];
  return {
    featuredLabel: raw.featuredLabel,
    featuredSubtitle: raw.featuredSubtitle,
    featuredHref: String(raw.featuredHref ?? "").trim(),
    sectionLabel: raw.sectionLabel,
    links,
  };
}

function normalizeMainNavigation(raw) {
  const base = raw && typeof raw === "object" ? raw : {};
  const items = Array.isArray(base.items) ? base.items : DEFAULT_MAIN_NAVIGATION.items;
  return {
    version: base.version ?? 1,
    items: items
      .filter((item) => item && typeof item === "object" && item.enabled !== false)
      .map((item, i) => {
        const menuKind = MENU_KINDS.has(item.menuKind) ? item.menuKind : "none";
        const normalized = {
          id: String(item.id ?? `item-${i + 1}`).trim(),
          label: item.label,
          href: String(item.href ?? "/").trim(),
          menuKind,
          enabled: item.enabled !== false,
          order: typeof item.order === "number" ? item.order : i + 1,
        };
        if (menuKind !== "none") {
          const menu = normalizeMenu(item.menu);
          if (menu) normalized.menu = menu;
        }
        return normalized;
      })
      .sort((a, b) => a.order - b.order),
  };
}

function localizeMenu(menu, locale, menuKind) {
  const { resolveLocalized } = require("../utils/locale");
  if (!menu) return undefined;
  const links = (menu.links || []).map((link) => {
    if (menuKind === "showcaseMega") {
      return {
        title: resolveLocalized(link.title ?? link.label, locale),
        subtitle: resolveLocalized(link.subtitle, locale),
        href: String(link.href ?? "").trim(),
      };
    }
    return {
      label: resolveLocalized(link.label ?? link.title, locale),
      subtitle: resolveLocalized(link.subtitle, locale),
      href: String(link.href ?? "").trim(),
    };
  });
  return {
    featured: {
      label: resolveLocalized(menu.featuredLabel, locale),
      subtitle: resolveLocalized(menu.featuredSubtitle, locale),
      href: String(menu.featuredHref ?? "").trim(),
    },
    sectionLabel: resolveLocalized(menu.sectionLabel, locale),
    links,
  };
}

function localizeMainNavigation(nav, locale) {
  const normalized = normalizeMainNavigation(nav);
  return {
    version: normalized.version,
    items: normalized.items.map((item) => {
      const { resolveLocalized } = require("../utils/locale");
      const out = {
        id: item.id,
        label: resolveLocalized(item.label, locale),
        href: item.href,
        menuKind: item.menuKind,
      };
      if (item.menuKind !== "none" && item.menu) {
        out.menu = localizeMenu(item.menu, locale, item.menuKind);
      }
      return out;
    }),
  };
}

function getMainNavigationSpec() {
  return {
    version: DEFAULT_MAIN_NAVIGATION.version,
    menuKinds: [...MENU_KINDS],
    notes: [
      "Edit via PUT /api/site with { mainNavigation: { items: [...] } } (admin key).",
      "Each item: id, label ({ en, th?, pl? }), href, menuKind, enabled, order.",
      "menuKind `dropdown`: menu.links use label + subtitle + href.",
      "menuKind `showcaseMega`: menu.links use title + subtitle + href (two-column mega menu).",
      "menu.featured* drives the top EXPLORE row in dropdowns / showcase mega menu.",
      "Keep stable `id` values for analytics; showcase hrefs should match /showcase?tab= filter values.",
    ],
    defaultNavigation: DEFAULT_MAIN_NAVIGATION,
  };
}

module.exports = {
  MENU_KINDS,
  DEFAULT_MAIN_NAVIGATION,
  normalizeMainNavigation,
  localizeMainNavigation,
  getMainNavigationSpec,
};

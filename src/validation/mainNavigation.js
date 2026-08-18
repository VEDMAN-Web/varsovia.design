/**
 * Admin-editable main header navigation (top bar + mega menus).
 * Stored on SiteContent.mainNavigation; localized on public GET /site.
 */

const MENU_KINDS = new Set(["none", "dropdown", "showcaseMega"]);

function loc(en, th = "", pl = "") {
  return { en, th: th || "", pl: pl || "" };
}

function dropdownLink(label, subtitle, href) {
  return { label: loc(label), subtitle: loc(subtitle), href };
}

function showcaseLink(title, subtitle, href) {
  return { title: loc(title), subtitle: loc(subtitle), href };
}

const SHOWCASE_NAV_LINKS = [
  showcaseLink("Home Case", "Spaces Designed to Inspire", "/projects?tab=Home%20case"),
  showcaseLink("North America", "Bold Design, Modern Living", "/projects?tab=North%20America"),
  showcaseLink("South America", "Vibrant Spaces, Warm Character", "/projects?tab=South%20America"),
  showcaseLink("Africa", "Rooted in Culture, Rich in Design", "/projects?tab=Africa"),
  showcaseLink("Commercial Project", "Where Function Meets Vision", "/projects?tab=Commercial%20Project"),
  showcaseLink("Europe", "Timeless Elegance, Refined Living", "/projects?tab=Europe"),
  showcaseLink("Australia", "Light-Filled Spaces, Effortless Style", "/projects?tab=Australia"),
  showcaseLink("Middle East", "Luxury Rooted in Tradition", "/projects?tab=Middle%20East"),
  showcaseLink("Asia", "Harmony of Space and Serenity", "/projects?tab=Asia"),
];

/**
 * Compact Group A header (fits desktop bar).
 * Services + Catalogue live under Company to avoid crowding.
 */
const DEFAULT_MAIN_NAVIGATION = {
  version: 3,
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
      id: "furniture",
      label: loc("Furniture"),
      href: "/furniture",
      menuKind: "showcaseMega",
      enabled: true,
      order: 2,
      menu: {
        featuredLabel: loc("All Furniture"),
        featuredSubtitle: loc("Kitchens to whole-home fit-outs"),
        featuredHref: "/furniture",
        sectionLabel: loc("Categories"),
        links: [
          showcaseLink("Kitchens", "Modular & custom kitchen furniture", "/furniture/kitchens"),
          showcaseLink("Wardrobes", "Fitted wardrobe systems", "/furniture/wardrobes"),
          showcaseLink("Living Room", "Lounge & media furniture", "/furniture/living-room"),
          showcaseLink("Bedrooms", "Bedroom furniture suites", "/furniture/bedrooms"),
          showcaseLink("Bathroom", "Vanities & wet-room joinery", "/furniture/bathroom"),
          showcaseLink("Dining", "Dining furniture & storage", "/furniture/dining"),
          showcaseLink("Doors", "Interior door systems", "/furniture/doors"),
          showcaseLink("Whole House", "Full-home furniture packages", "/furniture/whole-house"),
        ],
      },
    },
    {
      id: "interior",
      label: loc("Interior"),
      href: "/interior-design",
      menuKind: "showcaseMega",
      enabled: true,
      order: 3,
      menu: {
        featuredLabel: loc("All Interiors"),
        featuredSubtitle: loc("Interior design projects by room"),
        featuredHref: "/interior-design",
        sectionLabel: loc("By room"),
        links: [
          // Room catalogue only — Furniture lives in the Furniture mega (no duplicate)
          showcaseLink("Kitchen", "Kitchen interior projects", "/interior-design?category=Kitchen"),
          showcaseLink("Bedroom", "Bedroom interior projects", "/interior-design?category=Bedroom"),
          showcaseLink("Bathroom", "Bathroom interior projects", "/interior-design?category=Bathroom"),
          showcaseLink("Doors & Windows", "Doors, windows & glazing projects", "/interior-design?category=Door%20%26%20Windows"),
          showcaseLink("Whole House", "Full-home interior projects", "/interior-design?category=Whole%20House%20Solutions"),
        ],
      },
    },
    {
      id: "showcase",
      label: loc("Showcase"),
      href: "/projects",
      menuKind: "showcaseMega",
      enabled: true,
      order: 4,
      menu: {
        featuredLabel: loc("Our Showcase"),
        featuredSubtitle: loc("Every space, every story"),
        featuredHref: "/projects",
        sectionLabel: loc("By region & type"),
        links: SHOWCASE_NAV_LINKS,
      },
    },
    {
      id: "locations",
      label: loc("Locations"),
      href: "/locations",
      menuKind: "showcaseMega",
      enabled: true,
      order: 5,
      menu: {
        featuredLabel: loc("All Locations"),
        featuredSubtitle: loc("Where we design across Thailand"),
        featuredHref: "/locations",
        sectionLabel: loc("Cities"),
        links: [
          showcaseLink("Koh Samui", "Island villas & residences", "/locations/koh-samui"),
          showcaseLink("Phuket", "Coastal homes & resorts", "/locations/phuket"),
          showcaseLink("Bangkok", "City apartments & townhomes", "/locations/bangkok"),
          showcaseLink("Pattaya", "Coastal living", "/locations/pattaya"),
          showcaseLink("Hua Hin", "Relaxed seaside homes", "/locations/hua-hin"),
          showcaseLink("Chiang Mai", "Northern residences", "/locations/chiang-mai"),
        ],
      },
    },
    {
      id: "company",
      label: loc("Company"),
      href: "/about",
      menuKind: "showcaseMega",
      enabled: true,
      order: 6,
      menu: {
        featuredLabel: loc("About Varsovia"),
        featuredSubtitle: loc("Our story & vision"),
        featuredHref: "/about",
        sectionLabel: loc("Discover"),
        links: [
          // Services hub only — not every service child (avoids clashing with Furniture mega)
          showcaseLink("Services", "Design, make & install", "/services"),
          showcaseLink("Free Catalogue", "Download the lookbook", "/catalogue"),
          showcaseLink("Journal", "Design insights", "/journal"),
          showcaseLink("Complete Interiors", "Villas, condos & resorts", "/complete-interiors"),
          showcaseLink("For Developers", "Project partnerships", "/for-developers"),
          showcaseLink("Livo", "Brand partner", "/about/livo"),
          showcaseLink("Oppolia", "Brand partner", "/about/oppolia"),
          showcaseLink("Our Team", "Meet the experts", "/team"),
          showcaseLink("Quality After Sales", "Care & after-sales", "/quality-sale"),
        ],
      },
    },
    {
      id: "contact",
      label: loc("Contact"),
      href: "/contact",
      menuKind: "dropdown",
      enabled: true,
      order: 7,
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
      "Keep stable `id` values for analytics; showcase hrefs use /projects?tab= filters.",
      "Keep top-level items lean (≤7) so search/language/CTA do not collide.",
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

/**
 * Admin-editable footer layout (link columns, legal row, contact section labels).
 * Contact values (email, phones, offices) remain on SiteContent root fields.
 * Link set matches live /en footer (frontend buildFallbackFooterNavigation).
 */

function loc(en, th = "", pl = "") {
  return { en, th: th || "", pl: pl || "" };
}

function link(en, href, th = "", pl = "") {
  return { label: loc(en, th, pl), href: String(href).trim(), enabled: true };
}

const DEFAULT_FOOTER_NAVIGATION = {
  version: 3,
  linkColumns: [
    {
      id: "primary",
      order: 1,
      enabled: true,
      links: [
        link("Journal", "/journal", "วารสาร", "Journal"),
        link("About Us", "/about", "เกี่ยวกับเรา", "O nas"),
        link("Contact Us", "/contact", "ติดต่อเรา", "Kontakt"),
        link("FAQ", "/faq", "คำถามที่พบบ่อย", "Najczęstsze pytania"),
        link("Catalogue", "/catalogue", "แคตตาล็อก", "Katalog"),
      ],
    },
    {
      id: "products",
      order: 2,
      enabled: true,
      links: [
        link("Kitchen", "/interior-design?category=Kitchen", "ครัว", "Kuchnia"),
        link("Bedroom", "/interior-design?category=Bedroom", "ห้องนอน", "Sypialnia"),
        link("Bathroom", "/interior-design?category=Bathroom", "ห้องน้ำ", "Łazienka"),
        link("Furniture", "/furniture", "เฟอร์นิเจอร์", "Meble"),
        link("Door & Windows", "/interior-design?category=Door%20%26%20Windows", "ประตูและหน้าต่าง", "Drzwi i okna"),
        link("Whole House Solutions", "/interior-design?category=Whole%20House%20Solutions", "โซลูชันทั้งบ้าน", "Rozwiązania dla całego domu"),
      ],
    },
  ],
  legalLinks: [
    link("Privacy", "/privacy", "ความเป็นส่วนตัว", "Prywatność"),
    link("Terms", "/terms", "ข้อกำหนด", "Regulamin"),
    link("Sitemap", "/sitemap.xml", "แผนผังเว็บไซต์", "Mapa witryny"),
  ],
  contactHeading: loc("Contact Us", "ติดต่อเรา", "Kontakt"),
  contactLabels: {
    email: loc("Email", "อีเมล", "E-mail"),
    mobileWhatsapp: loc("Mobile / WhatsApp", "มือถือ / WhatsApp", "Telefon / WhatsApp"),
    contactNumber: loc("Contact Number", "เบอร์ติดต่อ", "Numer kontaktowy"),
  },
  socialLabels: {
    whatsapp: loc("WhatsApp"),
    facebook: loc("Facebook"),
    instagram: loc("Instagram"),
    x: loc("X"),
  },
  copyright: loc("©{year} Varsovia Design"),
};

function normalizeLinks(rawLinks) {
  if (!Array.isArray(rawLinks)) return [];
  return rawLinks
    .filter((l) => l && typeof l === "object" && l.enabled !== false)
    .map((l, i) => ({
      label: l.label,
      href: String(l.href ?? "#").trim(),
      enabled: l.enabled !== false,
      order: typeof l.order === "number" ? l.order : i + 1,
    }))
    .sort((a, b) => a.order - b.order);
}

function normalizeColumns(rawColumns) {
  if (!Array.isArray(rawColumns)) return DEFAULT_FOOTER_NAVIGATION.linkColumns;
  return rawColumns
    .filter((col) => col && typeof col === "object" && col.enabled !== false)
    .map((col, i) => ({
      id: String(col.id ?? `column-${i + 1}`).trim(),
      order: typeof col.order === "number" ? col.order : i + 1,
      enabled: col.enabled !== false,
      links: normalizeLinks(col.links),
    }))
    .filter((col) => col.links.length > 0)
    .sort((a, b) => a.order - b.order);
}

function normalizeFooterNavigation(raw) {
  const base = raw && typeof raw === "object" ? raw : {};
  return {
    version: base.version ?? 1,
    linkColumns: normalizeColumns(base.linkColumns),
    legalLinks: normalizeLinks(base.legalLinks ?? DEFAULT_FOOTER_NAVIGATION.legalLinks),
    contactHeading: base.contactHeading ?? DEFAULT_FOOTER_NAVIGATION.contactHeading,
    contactLabels: base.contactLabels ?? DEFAULT_FOOTER_NAVIGATION.contactLabels,
    socialLabels: base.socialLabels ?? DEFAULT_FOOTER_NAVIGATION.socialLabels,
    copyright: base.copyright ?? DEFAULT_FOOTER_NAVIGATION.copyright,
  };
}

function localizeFooterNavigation(nav, locale) {
  const { resolveLocalized } = require("../utils/locale");
  const normalized = normalizeFooterNavigation(nav);
  const localizeLabelBlock = (block) => {
    if (!block || typeof block !== "object") return block;
    const out = {};
    for (const [key, val] of Object.entries(block)) {
      out[key] = resolveLocalized(val, locale);
    }
    return out;
  };
  return {
    version: normalized.version,
    linkColumns: normalized.linkColumns.map((col) => ({
      id: col.id,
      links: col.links.map((l) => ({
        label: resolveLocalized(l.label, locale),
        href: l.href,
      })),
    })),
    legalLinks: normalized.legalLinks.map((l) => ({
      label: resolveLocalized(l.label, locale),
      href: l.href,
    })),
    contactHeading: resolveLocalized(normalized.contactHeading, locale),
    contactLabels: localizeLabelBlock(normalized.contactLabels),
    socialLabels: localizeLabelBlock(normalized.socialLabels),
    copyright: resolveLocalized(normalized.copyright, locale),
  };
}

function getFooterNavigationSpec() {
  return {
    version: DEFAULT_FOOTER_NAVIGATION.version,
    notes: [
      "Edit via PUT /api/site with { footerNavigation: { ... } } (admin key).",
      "linkColumns: up to ~4 columns; each has id, order, enabled, links[{ label: L, href, enabled?, order? }].",
      "legalLinks: bottom row (Privacy, Terms, etc.).",
      "contactHeading / contactLabels / socialLabels / copyright: localized strings.",
      "copyright may include literal `{year}` — frontend replaces with current year.",
      "Email, phone numbers, offices, footerBio, social URLs: SiteContent fields (not footerNavigation).",
    ],
    defaultFooterNavigation: DEFAULT_FOOTER_NAVIGATION,
  };
}

module.exports = {
  DEFAULT_FOOTER_NAVIGATION,
  normalizeFooterNavigation,
  localizeFooterNavigation,
  getFooterNavigationSpec,
};

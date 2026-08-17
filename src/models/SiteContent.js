const mongoose = require("mongoose");
const { localizedField } = require("../schemas/localizedField");

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    heroEyebrow: localizedField(),
    heroHeadline: localizedField(),
    heroSubtitle: localizedField(),
    heroImage: { type: String, default: "" },
    heroPrimaryCtaLabel: localizedField(),
    heroPrimaryCtaHref: { type: String, default: "" },
    heroSecondaryCtaLabel: localizedField(),
    heroSecondaryCtaHref: { type: String, default: "" },
    aboutTitle: localizedField(),
    aboutSubtitle: localizedField(),
    aboutText: localizedField(),
    aboutCtaLabel: localizedField(),
    aboutCtaHref: { type: String, default: "" },
    aboutImages: [{ type: String }],
    aboutStoryImages: [{ type: String }],
    brandLogoMark: { type: String, default: "" },
    brandLogoMarkOnDark: { type: String, default: "" },
    brandLogoLockup: { type: String, default: "" },
    brandLogoLockupOnDark: { type: String, default: "" },
    brandWordmarkLine1: localizedField(),
    brandWordmarkLine2: localizedField(),
    stats: [
      {
        label: mongoose.Schema.Types.Mixed,
        value: mongoose.Schema.Types.Mixed,
      },
    ],
    statsImage: { type: String, default: "" },
    aboutIntro: localizedField(),
    aboutStory: localizedField(),
    aboutHeroTitle: localizedField(),
    aboutHeroSubtitle: localizedField(),
    vision: {
      title: mongoose.Schema.Types.Mixed,
      text: mongoose.Schema.Types.Mixed,
      icon: { type: String, default: "" },
    },
    mission: {
      title: mongoose.Schema.Types.Mixed,
      text: mongoose.Schema.Types.Mixed,
      icon: { type: String, default: "" },
    },
    values: {
      title: mongoose.Schema.Types.Mixed,
      text: mongoose.Schema.Types.Mixed,
      icon: { type: String, default: "" },
    },
    processSteps: [
      {
        step: String,
        title: mongoose.Schema.Types.Mixed,
        text: mongoose.Schema.Types.Mixed,
        icon: { type: String, default: "" },
      },
    ],
    /** Team page “design tools” strip */
    designTools: [
      {
        name: mongoose.Schema.Types.Mixed,
        image: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],
    /** Team page copy, stats, and section titles (CMS) */
    teamPage: { type: mongoose.Schema.Types.Mixed, default: undefined },
    /** Navbar language flags (en / th / pl) */
    localeFlags: {
      en: { type: String, default: "" },
      th: { type: String, default: "" },
      pl: { type: String, default: "" },
    },
    contactImages: [{ type: String }],
    footerBio: localizedField(),
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: localizedField(),
    mobileWhatsapp: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    whatsappUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    xUrl: { type: String, default: "" },
    footerOffices: [
      {
        label: mongoose.Schema.Types.Mixed,
        address: { type: String, default: "" },
      },
    ],
    /** Localized section titles/subtitles for home + key pages, e.g. products: { title, subtitle } */
    sectionCopy: { type: mongoose.Schema.Types.Mixed, default: {} },
    /** Curated navbar search “Pages” rows */
    searchPages: [
      {
        title: mongoose.Schema.Types.Mixed,
        description: mongoose.Schema.Types.Mixed,
        href: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],
    /** Optional nav override; when empty, frontend uses i18n defaults */
    navMenus: { type: mongoose.Schema.Types.Mixed, default: [] },
    /** Main header navigation (top bar + dropdown / showcase mega menus) */
    mainNavigation: { type: mongoose.Schema.Types.Mixed, default: undefined },
    /** Footer link columns, legal row, and contact section labels */
    footerNavigation: { type: mongoose.Schema.Types.Mixed, default: undefined },
    /** Quality & after-sales page CMS payload */
    qualitySale: { type: mongoose.Schema.Types.Mixed, default: {} },
    /** Showcase listing tab hero titles/subtitles (drives /projects) */
    showcaseMeta: { type: mongoose.Schema.Types.Mixed, default: undefined },
    /** /projects listing SEO + hero copy */
    projectsPage: { type: mongoose.Schema.Types.Mixed, default: undefined },
    /** Admin-defined contact / inquiry forms (contact page + catalogue modal) */
    inquiryForm: { type: mongoose.Schema.Types.Mixed, default: undefined },
    /** api = API interior projects only (with fallback); hybrid = merge mock + API */
    interiorCatalogMode: { type: String, enum: ["hybrid", "api"], default: "hybrid" },
    /** Group A SEO IA hubs + children (furniture, locations, journal, …) */
    pages: { type: mongoose.Schema.Types.Mixed, default: undefined },
    /** /about SEO */
    aboutPageSettings: { type: mongoose.Schema.Types.Mixed, default: undefined },
    /** Home / locale layout Google listing */
    homeSeo: { type: mongoose.Schema.Types.Mixed, default: undefined },
    /** /faq page hero + SEO */
    faqPage: { type: mongoose.Schema.Types.Mixed, default: undefined },
    /** /catalogue standalone page hero + SEO */
    cataloguePage: { type: mongoose.Schema.Types.Mixed, default: undefined },
    /** /contact standalone page SEO + location + showrooms headings */
    contactPage: { type: mongoose.Schema.Types.Mixed, default: undefined },
    /** /privacy and /terms CMS documents */
    legalPages: { type: mongoose.Schema.Types.Mixed, default: undefined },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SiteContent", siteContentSchema);

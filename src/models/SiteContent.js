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
    aboutText: localizedField(),
    aboutImages: [{ type: String }],
    stats: [
      {
        label: mongoose.Schema.Types.Mixed,
        value: mongoose.Schema.Types.Mixed,
      },
    ],
    statsImage: { type: String, default: "" },
    aboutIntro: localizedField(),
    aboutStory: localizedField(),
    aboutHeroSubtitle: localizedField(),
    vision: {
      title: mongoose.Schema.Types.Mixed,
      text: mongoose.Schema.Types.Mixed,
    },
    mission: {
      title: mongoose.Schema.Types.Mixed,
      text: mongoose.Schema.Types.Mixed,
    },
    values: {
      title: mongoose.Schema.Types.Mixed,
      text: mongoose.Schema.Types.Mixed,
    },
    processSteps: [
      {
        step: String,
        title: mongoose.Schema.Types.Mixed,
        text: mongoose.Schema.Types.Mixed,
      },
    ],
    contactImages: [{ type: String }],
    footerBio: localizedField(),
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: localizedField(),
    mobileWhatsapp: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    whatsappUrl: { type: String, default: "" },
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
    /** Quality & after-sales page CMS payload */
    qualitySale: { type: mongoose.Schema.Types.Mixed, default: {} },
    /** api = API interior projects only (with fallback); hybrid = merge mock + API */
    interiorCatalogMode: { type: String, enum: ["hybrid", "api"], default: "hybrid" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SiteContent", siteContentSchema);

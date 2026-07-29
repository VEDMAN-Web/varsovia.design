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
  },
  { timestamps: true },
);

module.exports = mongoose.model("SiteContent", siteContentSchema);

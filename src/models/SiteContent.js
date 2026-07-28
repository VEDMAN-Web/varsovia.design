const mongoose = require("mongoose");

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    heroEyebrow: { type: String, default: "" },
    heroHeadline: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    heroPrimaryCtaLabel: { type: String, default: "" },
    heroPrimaryCtaHref: { type: String, default: "" },
    heroSecondaryCtaLabel: { type: String, default: "" },
    heroSecondaryCtaHref: { type: String, default: "" },
    aboutTitle: { type: String, default: "" },
    aboutText: { type: String, default: "" },
    aboutImages: [{ type: String }],
    stats: [
      {
        label: String,
        value: String,
      },
    ],
    statsImage: { type: String, default: "" },
    aboutIntro: { type: String, default: "" },
    aboutStory: { type: String, default: "" },
    aboutHeroSubtitle: { type: String, default: "" },
    vision: {
      title: { type: String, default: "" },
      text: { type: String, default: "" },
    },
    mission: {
      title: { type: String, default: "" },
      text: { type: String, default: "" },
    },
    values: {
      title: { type: String, default: "" },
      text: { type: String, default: "" },
    },
    processSteps: [
      {
        step: String,
        title: String,
        text: String,
      },
    ],
    contactImages: [{ type: String }],
    footerBio: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteContent", siteContentSchema);

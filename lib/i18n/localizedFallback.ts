import { MEDIA } from "../mediaAssets";
import { getAppMessages, getLocaleOrDefault } from "./messageCatalog";
import type { Locale } from "./routing";
import type { SiteContent } from "../siteTypes";

/** Locale-aware CMS fallbacks when API fields are empty or offline */
export function buildLocalizedSiteFallback(locale?: string): SiteContent {
  const loc = getLocaleOrDefault(locale);
  const m = getAppMessages(loc);
  const s = m.siteFallback;
  const h = m.home;

  return {
    heroEyebrow: h.heroEyebrow,
    heroHeadline: h.heroHeadline,
    heroSubtitle: "",
    heroImage: MEDIA.hero,
    heroPrimaryCtaLabel: h.heroPrimaryCta,
    heroPrimaryCtaHref: "#products",
    heroSecondaryCtaLabel: h.heroSecondaryCta,
    heroSecondaryCtaHref: "#contact",
    aboutTitle: h.aboutTitle,
    aboutText: s.aboutText,
    aboutImages: [...MEDIA.about, MEDIA.featured[4]],
    stats: [
      { value: "+12", label: h.statYears },
      { value: "+140", label: h.statProjects },
      { value: "+6", label: h.statCities },
    ],
    statsImage: MEDIA.stats,
    aboutIntro: s.aboutIntro,
    aboutStory: s.aboutStory,
    aboutHeroSubtitle: s.aboutHeroSubtitle,
    vision: { title: m.aboutPage.visionTitle, text: s.visionText },
    mission: { title: m.aboutPage.missionTitle, text: s.missionText },
    values: { title: m.aboutPage.valuesBlockTitle, text: s.valuesText },
    processSteps: [
      { step: "01", title: s.process1Title, text: s.process1Text },
      { step: "02", title: s.process2Title, text: s.process2Text },
      { step: "03", title: s.process3Title, text: s.process3Text },
      { step: "04", title: s.process4Title, text: s.process4Text },
    ],
    contactImages: [...MEDIA.contact],
    footerBio: s.footerBio,
    phone: "+66 64 683 9777",
    email: "hi@thailandkitchens.com",
    address: "Route 4169, Mae Nam, Amphoe Ko Samui, Surat Thani 84330",
  };
}

export function getLocalizedSiteFallback(locale?: Locale | string) {
  return buildLocalizedSiteFallback(locale);
}

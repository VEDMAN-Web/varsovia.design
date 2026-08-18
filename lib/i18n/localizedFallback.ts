import { MEDIA } from "../mediaAssets";
import { DEFAULT_SITE_IMAGE_PATHS } from "../defaultSiteImages";
import { getAppMessages, getLocaleOrDefault } from "./messageCatalog";
import type { Locale } from "./routing";
import type { SiteContent } from "../siteTypes";

/** Locale-aware CMS fallbacks when API fields are empty or offline */
export function buildLocalizedSiteFallback(locale?: string): SiteContent {
  const loc = getLocaleOrDefault(locale);
  const m = getAppMessages(loc);
  const s = m.siteFallback;
  const h = m.home;
  const D = DEFAULT_SITE_IMAGE_PATHS;

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
    aboutStoryImages: [...MEDIA.featured.slice(0, 3), MEDIA.about[2]],
    stats: [
      { value: "+12", label: h.statYears },
      { value: "+140", label: h.statProjects },
      { value: "+6", label: h.statCities },
    ],
    statsImage: MEDIA.stats,
    aboutIntro: s.aboutIntro,
    aboutStory: s.aboutStory,
    aboutHeroSubtitle: s.aboutHeroSubtitle,
    vision: { title: m.aboutPage.visionTitle, text: s.visionText, icon: D.visionIcon },
    mission: { title: m.aboutPage.missionTitle, text: s.missionText, icon: D.missionIcon },
    values: { title: m.aboutPage.valuesBlockTitle, text: s.valuesText, icon: D.valuesIcon },
    processSteps: [
      { step: "01", title: s.process1Title, text: s.process1Text, icon: D.processIcons[0] },
      { step: "02", title: s.process2Title, text: s.process2Text, icon: D.processIcons[1] },
      { step: "03", title: s.process3Title, text: s.process3Text, icon: D.processIcons[2] },
      { step: "04", title: s.process4Title, text: s.process4Text, icon: D.processIcons[3] },
    ],
    designTools: D.designTools.map((tool) => ({ ...tool })),
    teamPage: {
      heroTitle: m.teamPage.heroTitle,
      heroSubtitle: m.teamPage.heroSubtitle,
      intro: m.teamPage.intro,
      designTitle: m.teamPage.designTitle,
      designEyebrow: m.teamPage.designEyebrow,
      designBody: m.teamPage.designBody,
      architectTitle: m.teamPage.architectTitle,
      architectEyebrow: m.teamPage.architectEyebrow,
      architectBody: m.teamPage.architectBody,
      toolsTitle: m.teamPage.toolsTitle,
      toolsBody: m.teamPage.toolsBody,
      stats: [
        { value: m.teamPage.statProjectsValue, label: m.teamPage.statProjectsLabel },
        { value: m.teamPage.statYearsValue, label: m.teamPage.statYearsLabel },
      ],
    },
    localeFlags: { ...D.localeFlags },
    qualitySale: {
      support1Image: D.qualitySupportImages[0],
      support2Image: D.qualitySupportImages[1],
      support3Image: D.qualitySupportImages[2],
      support4Image: D.qualitySupportImages[3],
    },
    projectsPage: {
      indexable: false,
      metaTitle: "Our Showcase | Varsovia Design",
      metaDescription:
        "Varsovia Design showcase — homes and projects by region and type.",
      heroTitle: "Our Showcase",
      heroSubtitle: "Every space, every story",
      navSectionLabel: "By Region & Type",
    },
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

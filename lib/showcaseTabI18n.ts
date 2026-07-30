import type { ShowcaseTab } from "./showcaseData";

/** Maps internal tab id to next-intl keys under `showcase.tabLabels` / `showcase.categoryMeta` */
export const SHOWCASE_TAB_I18N_KEY: Record<ShowcaseTab, string> = {
  All: "all",
  "Home case": "homeCase",
  "North America": "northAmerica",
  "South America": "southAmerica",
  Africa: "africa",
  "Commercial Project": "commercialProject",
  Europe: "europe",
  Australia: "australia",
  "Middle East": "middleEast",
  Asia: "asia",
};

export function showcaseTabMessageKey(tab: ShowcaseTab): string {
  return SHOWCASE_TAB_I18N_KEY[tab];
}

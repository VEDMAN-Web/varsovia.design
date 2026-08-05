/** Current on-disk asset paths — used as CMS defaults/fallbacks so visuals stay unchanged. */
export const DEFAULT_SITE_IMAGE_PATHS = {
  visionIcon: "/vision/visionIcon.png",
  missionIcon: "/vision/missionIcon.png",
  valuesIcon: "/vision/valuesIcon.png",
  processIcons: [
    "/ourprocess/ourprocessStep1.png",
    "/ourprocess/ourprocessStep2.png",
    "/ourprocess/ourprocessStep3.png",
    "/ourprocess/ourprocessStep4.png",
  ],
  qualitySupportImages: [
    "/quality-sale/support-illustration-1.png",
    "/quality-sale/support-illustration-2.png",
    "/quality-sale/support-illustration-3.png",
    "/quality-sale/support-illustration-4.png",
  ],
  qualitySupportJpgFallbacks: [
    "/quality-sale/support-1.jpg",
    "/quality-sale/support-2.jpg",
    "/quality-sale/support-3.jpg",
    "/quality-sale/support-4.jpg",
  ],
  designTools: [
    { name: "CAXA", image: "/team/design-tools/caxa.svg", order: 1 },
    { name: "AUTO CAD", image: "/team/design-tools/autocad.svg", order: 2 },
    { name: "3D MAX", image: "/team/design-tools/3dmax.svg", order: 3 },
  ],
  localeFlags: {
    en: "/icon/flag-english.svg",
    th: "/icon/flag-thailand.svg",
    pl: "/icon/flag-polish.svg",
  },
} as const;

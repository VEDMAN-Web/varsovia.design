/** Self-hosted assets under /public — mapped from legacy /home/* paths. */

export const MEDIA = {
  hero: "/home/hero.jpg",
  stats: "/home/stats.jpg",
  team: "/team/team.jpg",
  blog: "/blog/blog1.jpg",
  about: ["/home/about-1.png", "/home/about-2.png", "/home/about-3.png"],
  core: [
    "/home/core/core-1.jpg",
    "/home/core/core-2.jpg",
    "/home/core/core-3.jpg",
    "/home/core/core-4.jpg",
    "/home/core/core-5.jpg",
    "/home/core/core-6.jpg",
  ],
  products: ["/home/product/product-1.jpg", "/home/product/product-2.jpg", "/home/product/product-3.jpg"],
  catalogues: [
    "/home/catalog/catalog-1.jpg",
    "/home/catalog/catalog-2.jpg",
    "/home/catalog/catalog-3.jpg",
    "/home/catalog/catalog-4.jpg",
    "/home/catalog/catalog-5.jpg",
  ],
  featured: [
    "/home/featured/feature-1.jpg",
    "/home/featured/feature-2.jpg",
    "/home/featured/feature-3.jpg",
    "/home/featured/feature-4.jpg",
    "/home/featured/feature-5.jpg",
    "/home/featured/feature-6.jpg",
    "/home/featured/feature-7.jpg",
    "/home/featured/feature-8.jpg",
  ],
  stories: [
    "/home/stories/story-1.jpg",
    "/home/stories/story-2.jpg",
    "/home/stories/story-3.jpg",
    "/home/stories/story-4.jpg",
    "/home/stories/story-5.jpg",
    "/home/stories/story-6.jpg",
    "/home/stories/story-7.jpg",
  ],
  contact: [
    "/home/contact/contact-1.jpg",
    "/home/contact/contact-2.jpg",
    "/home/contact/contact-3.jpg",
    "/home/contact/contact-4.jpg",
    "/home/contact/contact-5.jpg",
    "/home/contact/contact-6.jpg",
    "/home/contact/contact-7.jpg",
  ],
  interior: ["/Interior-kitchen/kitchen1.jpg", "/Interior-kitchen/kitchen2.jpg"],
  showrooms: ["/home/about-1.jpg", "/home/about-2.jpg", "/home/about-3.jpg"],
  qualitySupport: [
    "/quality-sale/support-illustration-1.png",
    "/quality-sale/support-illustration-2.png",
    "/quality-sale/support-illustration-3.png",
    "/quality-sale/support-illustration-4.png",
  ],
} as const;

/** Legacy CMS / seed paths → files under /public (see scripts/download-media.ps1). */
const LOCAL_ALIASES: Record<string, string> = {
  "/home/catalog-1.jpg": MEDIA.catalogues[1],
  "/home/product/product-3.jpg": MEDIA.products[2],
  "/home/home-front-page.png": "/home/hero.jpg",
  "/home/counting.png": MEDIA.stats,
  "/home/about-1.png": MEDIA.about[0],
  "/home/about-2.png": MEDIA.about[1],
  "/home/about-3.png": MEDIA.about[2],
  "/home/product/product-1.png": MEDIA.products[0],
  "/home/product/product-2.png": MEDIA.products[1],
  "/home/catalog.png": MEDIA.catalogues[0],
  "/home/catalog-2.png": MEDIA.catalogues[1],
  "/home/catalog-3.png": MEDIA.catalogues[2],
  "/home/catalog-4.png": MEDIA.catalogues[3],
  "/team/team.png": MEDIA.team,
  "/blog/blog1.png": MEDIA.blog,
  "/Interior-kitchen/kitchen1.png": MEDIA.interior[0],
  "/Interior-kitchen/kitchen2.png": MEDIA.interior[1],
  "/partners/figma/fischer.png": "/partners/fischer-mask.svg",
  "/partners/figma/bostik.png": "/partners/bostik-mask.svg",
  "/partners/figma/egger.png": "/partners/egger-mask.svg",
  "/partners/figma/blum.png": "/partners/blum.svg",
  "/partners/figma/jowat.png": "/partners/jowat-mask.svg",
  "/partners/figma/emblem.png": "/partners/partner-emblem-mask.svg",
  "/partners/fischer.png": "/partners/fischer-mask.svg",
  "/partners/bostik.png": "/partners/bostik-mask.svg",
  "/partners/egger.png": "/partners/egger-mask.svg",
  "/partners/blum.png": "/partners/blum.svg",
  "/partners/jowat.png": "/partners/jowat-mask.svg",
  "/partners/emblem.png": "/partners/partner-emblem-mask.svg",
};

for (let i = 1; i <= 8; i += 1) {
  const featured = MEDIA.featured[i - 1] ?? MEDIA.featured[0];
  LOCAL_ALIASES[`/home/featured-project/feature-${i}.jpg`] = featured;
  LOCAL_ALIASES[`/home/featured-project/feature-${i}.png`] = featured;
}

for (let i = 1; i <= 7; i += 1) {
  const story = MEDIA.stories[i - 1] ?? MEDIA.stories[0];
  LOCAL_ALIASES[`/home/stories/story-${i}.jpg`] = story;
}

export function resolveMediaUrl(src?: string | null, fallback: string = MEDIA.hero as string): string {
  if (!src || !src.trim()) return fallback;
  const value = src.trim();
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (LOCAL_ALIASES[value]) return LOCAL_ALIASES[value];
  if (value.startsWith("/")) return value;
  return fallback;
}

export function resolveMediaUrls(urls: string[] | undefined | null, fallbacks: readonly string[]): string[] {
  const source = urls && urls.length > 0 ? urls : [...fallbacks];
  return source.map((url, index) => resolveMediaUrl(url, fallbacks[index] ?? fallbacks[0] ?? MEDIA.hero));
}

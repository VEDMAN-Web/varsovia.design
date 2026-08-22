/** Self-hosted assets under /public — mapped from legacy /home/* paths. */

export const MEDIA = {
  hero: "/home/hero.webp",
  stats: "/home/stats.webp",
  team: "/team/team.webp",
  blog: "/blog/blog1.webp",
  about: ["/home/about-1.png", "/home/about-2.png", "/home/about-3.png"],
  core: [
    "/home/core/core-1.webp",
    "/home/core/core-2.webp",
    "/home/core/core-3.webp",
    "/home/core/core-4.webp",
    "/home/core/core-5.webp",
    "/home/core/core-6.webp",
  ],
  products: ["/home/product/product-1.webp", "/home/product/product-2.webp", "/home/product/product-3.webp"],
  catalogues: [
    "/home/catalog/catalog-1.webp",
    "/home/catalog/catalog-2.webp",
    "/home/catalog/catalog-3.webp",
    "/home/catalog/catalog-4.webp",
    "/home/catalog/catalog-5.webp",
  ],
  featured: [
    "/home/featured/feature-1.webp",
    "/home/featured/feature-2.webp",
    "/home/featured/feature-3.webp",
    "/home/featured/feature-4.webp",
    "/home/featured/feature-5.webp",
    "/home/featured/feature-6.webp",
    "/home/featured/feature-7.webp",
    "/home/featured/feature-8.webp",
  ],
  stories: [
    "/home/stories/story-1.webp",
    "/home/stories/story-2.webp",
    "/home/stories/story-3.webp",
    "/home/stories/story-4.webp",
    "/home/stories/story-5.webp",
    "/home/stories/story-6.webp",
    "/home/stories/story-7.webp",
  ],
  contact: [
    "/home/contact/contact-1.webp",
    "/home/contact/contact-2.webp",
    "/home/contact/contact-3.webp",
    "/home/contact/contact-4.webp",
    "/home/contact/contact-5.webp",
    "/home/contact/contact-6.webp",
    "/home/contact/contact-7.webp",
  ],
  interior: ["/Interior-kitchen/kitchen1.webp", "/Interior-kitchen/kitchen2.webp"],
  showrooms: ["/home/about-1.webp", "/home/about-2.webp", "/home/about-3.webp"],
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
  "/home/home-front-page.png": "/home/hero.webp",
  "/home/counting.png": MEDIA.stats,
  "/home/about-1.png": MEDIA.about[0],
  "/home/about-2.png": MEDIA.about[1],
  "/home/about-3.png": MEDIA.about[2],
  "/home/product/product-1.png": MEDIA.products[0],
  "/home/product/product-1.jpg": MEDIA.products[0],
  "/home/product/product-2.png": MEDIA.products[1],
  "/home/product/product-2.jpg": MEDIA.products[1],
  "/home/product/product-3.jpg": MEDIA.products[2],
  "/home/catalog.png": MEDIA.catalogues[0],
  "/home/catalog-2.png": MEDIA.catalogues[1],
  "/home/catalog-3.png": MEDIA.catalogues[2],
  "/home/catalog-4.png": MEDIA.catalogues[3],
  "/team/team.png": MEDIA.team,
  "/team/team.jpg": MEDIA.team,
  "/blog/blog1.png": MEDIA.blog,
  "/blog/blog1.jpg": MEDIA.blog,
  "/Interior-kitchen/kitchen1.png": MEDIA.interior[0],
  "/Interior-kitchen/kitchen1.jpg": MEDIA.interior[0],
  "/Interior-kitchen/kitchen2.png": MEDIA.interior[1],
  "/Interior-kitchen/kitchen2.jpg": MEDIA.interior[1],
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

const KITCHEN_PRODUCTS = MEDIA.products;
for (let i = 1; i <= 6; i += 1) {
  const dest =
    i <= KITCHEN_PRODUCTS.length
      ? KITCHEN_PRODUCTS[i - 1]
      : MEDIA.featured[(i - 1) % MEDIA.featured.length];
  for (const ext of ["png", "jpg", "jpeg", "webp"] as const) {
    LOCAL_ALIASES[`/products/Kitchen${i}.${ext}`] = dest;
  }
}

for (let i = 1; i <= 7; i += 1) {
  const story = MEDIA.stories[i - 1] ?? MEDIA.stories[0];
  LOCAL_ALIASES[`/home/stories/story-${i}.jpg`] = story;
  LOCAL_ALIASES[`/home/stories/story-${i}.webp`] = story;
}

// Add backward compatibility aliases for .jpg to .webp conversion
for (const [jpgPath, resolvedPath] of Object.entries(LOCAL_ALIASES)) {
  if (jpgPath.endsWith('.jpg')) {
    LOCAL_ALIASES[jpgPath.replace(/\.jpg$/, '.webp')] = resolvedPath;
  }
}

function isPrivateAssetHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    /^192\.168\.\d+\.\d+$/.test(host) ||
    /^10\.\d+\.\d+\.\d+$/.test(host)
  );
}

/**
 * CMS sometimes stored site assets as http://127.0.0.1:5000/home/... (upload API origin).
 * Those files live on the Varsovia Next app — unwrap to a public path.
 */
function unwrapCmsMediaPath(src: string): string {
  const value = src.trim();
  if (!/^https?:\/\//i.test(value)) return value;
  try {
    const parsed = new URL(value);
    if (parsed.pathname.startsWith("/uploads/")) return value;
    if (isPrivateAssetHost(parsed.hostname)) {
      return parsed.pathname;
    }
  } catch {
    /* keep original */
  }
  return value;
}

export function resolveMediaUrl(src?: string | null, fallback: string = MEDIA.hero as string): string {
  if (!src || !src.trim()) return fallback;
  const value = unwrapCmsMediaPath(src);
  if (LOCAL_ALIASES[value]) return LOCAL_ALIASES[value];
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return value;
  return fallback;
}

export function resolveMediaUrls(urls: string[] | undefined | null, fallbacks: readonly string[]): string[] {
  const source = urls && urls.length > 0 ? urls : [...fallbacks];
  return source.map((url, index) => resolveMediaUrl(url, fallbacks[index] ?? fallbacks[0] ?? MEDIA.hero));
}

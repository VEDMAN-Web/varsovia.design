import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";
import { locales } from "./lib/i18n/routing";
import { allLegacyInteriorNumericRedirects } from "./lib/interiorRoutes";
import { getImageRemotePatterns } from "./lib/publicEnv";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const legacyInteriorRedirects = locales.flatMap((locale) =>
  Object.entries(allLegacyInteriorNumericRedirects()).map(([id, slug]) => ({
    source: `/${locale}/interior/${id}`,
    destination: `/${locale}/interior-design/${slug}`,
    permanent: true,
  })),
);

const productPageRedirects = locales.flatMap((locale) => [
  {
    source: `/${locale}/products`,
    destination: `/${locale}/interior-design`,
    permanent: true,
  },
  {
    source: `/${locale}/product/:slug`,
    destination: `/${locale}/interior-design`,
    permanent: true,
  },
]);

const iaRedirects = locales.flatMap((locale) => [
  {
    source: `/${locale}/showcase`,
    destination: `/${locale}/projects`,
    permanent: true,
  },
  {
    source: `/${locale}/showcase/:id`,
    destination: `/${locale}/projects/:id`,
    permanent: true,
  },
  {
    source: `/${locale}/blog`,
    destination: `/${locale}/journal`,
    permanent: true,
  },
  {
    source: `/${locale}/blog/:id`,
    destination: `/${locale}/journal/p/:id`,
    permanent: true,
  },
  {
    source: `/${locale}/interior`,
    destination: `/${locale}/interior-design`,
    permanent: true,
  },
  {
    source: `/${locale}/interior/:slug`,
    destination: `/${locale}/interior-design/:slug`,
    permanent: true,
  },
]);

const nextConfig: NextConfig = {
  async redirects() {
    return [...iaRedirects, ...legacyInteriorRedirects, ...productPageRedirects];
  },
  async rewrites() {
    const uploadOrigin = (
      process.env.NEXT_PUBLIC_UPLOAD_ORIGIN ||
      process.env.NEXT_PUBLIC_UPLOAD_PUBLIC_URL ||
      ""
    )
      .trim()
      .replace(/\/+$/, "");
    const mediaRewrites = [
      ...Array.from({ length: 8 }, (_, index) => {
        const n = index + 1;
        return [
          {
            source: `/home/featured-project/feature-${n}.jpg`,
            destination: `/home/featured/feature-${n}.jpg`,
          },
          {
            source: `/home/featured-project/feature-${n}.png`,
            destination: `/home/featured/feature-${n}.jpg`,
          },
        ];
      }).flat(),
      ...Array.from({ length: 6 }, (_, index) => {
        const n = index + 1;
        const dest =
          n <= 3
            ? `/home/product/product-${n}.jpg`
            : `/home/featured/feature-${((n - 1) % 8) + 1}.jpg`;
        return [
          { source: `/products/Kitchen${n}.jpg`, destination: dest },
          { source: `/products/Kitchen${n}.jpeg`, destination: dest },
          { source: `/products/Kitchen${n}.png`, destination: dest },
          { source: `/products/Kitchen${n}.webp`, destination: dest },
        ];
      }).flat(),
      {
        source: "/home/home-front-page.png",
        destination: "/home/hero.jpg",
      },
      {
        source: "/home/counting.png",
        destination: "/home/stats.jpg",
      },
    ];
    if (!uploadOrigin) return mediaRewrites;
    return [
      ...mediaRewrites,
      {
        source: "/uploads/:path*",
        destination: `${uploadOrigin}/uploads/:path*`,
      },
    ];
  },
  allowedDevOrigins: ["192.168.1.33", "192.168.1.*", "10.0.0.*"],
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
      { protocol: "https", hostname: "www.pexels.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      ...getImageRemotePatterns(),
    ],
  },
};

export default withNextIntl(nextConfig);

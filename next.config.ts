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
  allowedDevOrigins: ["192.168.1.33", "192.168.1.*", "10.0.0.*"],
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: getImageRemotePatterns(),
  },
};

export default withNextIntl(nextConfig);

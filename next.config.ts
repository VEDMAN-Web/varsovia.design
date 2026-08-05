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
    destination: `/${locale}/interior/${slug}`,
    permanent: true,
  })),
);

const productPageRedirects = locales.flatMap((locale) => [
  {
    source: `/${locale}/products`,
    destination: `/${locale}/interior`,
    permanent: true,
  },
  {
    source: `/${locale}/product/:slug`,
    destination: `/${locale}/interior`,
    permanent: true,
  },
]);

const nextConfig: NextConfig = {
  async redirects() {
    return [...legacyInteriorRedirects, ...productPageRedirects];
  },
  // Allow phones/tablets on the same Wi‑Fi to load the dev server (Next.js 16+ blocks LAN by default).
  allowedDevOrigins: ["192.168.1.33", "192.168.1.*", "10.0.0.*"],
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: getImageRemotePatterns(),
  },
};

export default withNextIntl(nextConfig);

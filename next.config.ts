import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";
import { locales } from "./lib/i18n/routing";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

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
    return productPageRedirects;
  },
  // Allow phones/tablets on the same Wi‑Fi to load the dev server (Next.js 16+ blocks LAN by default).
  allowedDevOrigins: ["192.168.1.33", "192.168.1.*", "10.0.0.*"],
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

import type { Metadata } from "next";
import { getPublicSiteUrl } from "./publicEnv";

const SITE_NAME = "Varsovia Design";
const DEFAULT_DESCRIPTION =
  "Premium modular kitchens and interiors — timeless design, expert craftsmanship, and spaces built to last.";

export function pageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const baseUrl = getPublicSiteUrl();
  const url = `${baseUrl}${path}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

/** Prefer `getPublicSiteUrl()` at call sites — avoids import-time throw during builds. */
export function getSiteUrl() {
  return getPublicSiteUrl();
}

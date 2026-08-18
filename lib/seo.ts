import type { Metadata } from "next";
import { getPublicSiteUrl } from "./publicEnv";
import { locales } from "./i18n/routing";

const SITE_NAME = "Varsovia Design";
const DEFAULT_DESCRIPTION =
  "Premium modular kitchens and interiors — timeless design, expert craftsmanship, and spaces built to last.";

/** CMS Google title is used as typed — do not append the brand twice. */
export function brandDocumentTitle(title: string): string {
  const trimmed = String(title || "").trim();
  if (!trimmed) return SITE_NAME;
  const suffix = ` | ${SITE_NAME}`;
  if (
    trimmed === SITE_NAME ||
    trimmed.endsWith(suffix) ||
    trimmed.endsWith(` - ${SITE_NAME}`)
  ) {
    return trimmed;
  }
  return `${trimmed}${suffix}`;
}

export function pageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  locale,
  indexable = false,
}: {
  title: string;
  description?: string;
  /** Path including locale prefix, e.g. `/en/furniture` */
  path?: string;
  locale?: string;
  indexable?: boolean;
}): Metadata {
  const baseUrl = getPublicSiteUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  // Build hreflang map for the same path across locales
  let pathWithoutLocale = normalizedPath;
  for (const l of locales) {
    if (normalizedPath === `/${l}` || normalizedPath.startsWith(`/${l}/`)) {
      pathWithoutLocale = normalizedPath.slice(l.length + 1) || "";
      if (pathWithoutLocale && !pathWithoutLocale.startsWith("/")) {
        pathWithoutLocale = `/${pathWithoutLocale}`;
      }
      break;
    }
  }

  const languages = Object.fromEntries(
    locales.map((l) => [l, `${baseUrl}/${l}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`]),
  );

  const documentTitle = brandDocumentTitle(title);

  const metadata: Metadata = {
    title: documentTitle,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: documentTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: locale || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: documentTitle,
      description,
    },
  };

  if (indexable !== true) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

/** Prefer `getPublicSiteUrl()` at call sites — avoids import-time throw during builds. */
export function getSiteUrl() {
  return getPublicSiteUrl();
}

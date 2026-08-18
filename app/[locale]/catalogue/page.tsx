import type { Metadata } from "next";
import CataloguePageClient from "@/components/catalogue/CataloguePageClient";
import { fetchCatalogues, fetchSite } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import { pageMetadata } from "@/lib/seo";
import { getPublicSiteUrl } from "@/lib/publicEnv";
import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [site, catalogues] = await Promise.all([
    fetchSite(locale as Locale),
    fetchCatalogues(locale as Locale).catch(() => []),
  ]);
  const cp = site.cataloguePage || {};
  const firstCover = catalogues
    .map((row) => String((row as { coverImage?: string }).coverImage || "").trim())
    .find(Boolean);
  return pageMetadata({
    title: pickLocalized(cp.metaTitle, locale as Locale) || "Free Catalogue",
    description:
      pickLocalized(cp.metaDescription, locale as Locale) ||
      "Download Varsovia kitchen and interior catalogues — layouts, finishes, and collections for homes in Thailand.",
    path: `/${locale}/catalogue`,
    locale,
    indexable: cp.indexable === true,
    image: firstCover || "/home/catalog.png",
  });
}

export default async function CataloguePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [site, catalogues] = await Promise.all([
    fetchSite(locale as Locale),
    fetchCatalogues(locale as Locale).catch(() => []),
  ]);
  const cp = site.cataloguePage || {};
  const title = pickLocalized(cp.heroTitle, locale as Locale) || "Free Catalogue";
  const description =
    pickLocalized(cp.heroSubtitle, locale as Locale) ||
    pickLocalized(cp.metaDescription, locale as Locale) ||
    "";
  const url = `${getPublicSiteUrl().replace(/\/$/, "")}/${locale}/catalogue`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description || undefined,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Varsovia Design",
      url: getPublicSiteUrl().replace(/\/$/, ""),
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: catalogues.length,
      itemListElement: catalogues.map((row, index) => {
        const item = row as { title?: unknown; coverImage?: string; downloadUrl?: string };
        const name = pickLocalized(item.title, locale as Locale) || `Catalogue ${index + 1}`;
        return {
          "@type": "ListItem",
          position: index + 1,
          name,
          url: item.downloadUrl || url,
        };
      }),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CataloguePageClient />
    </>
  );
}

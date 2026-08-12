import type { Metadata } from "next";
import CataloguePageClient from "@/components/catalogue/CataloguePageClient";
import { fetchSite } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const cp = site.cataloguePage || {};
  return pageMetadata({
    title: cp.metaTitle || "Free Catalogue",
    description: cp.metaDescription || "Download Varsovia Design catalogues for kitchen and interior inspiration.",
    path: `/${locale}/catalogue`,
    locale,
    indexable: cp.indexable === true,
  });
}

export default async function CataloguePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CataloguePageClient />;
}

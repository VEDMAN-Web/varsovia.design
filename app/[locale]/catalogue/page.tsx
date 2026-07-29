import type { Metadata } from "next";
import CataloguePageClient from "@/components/catalogue/CataloguePageClient";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = pageMetadata({
  title: "Free Catalogue",
  description: "Download Varsovia Design catalogues for kitchen and interior inspiration.",
  path: "/catalogue",
});

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CataloguePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CataloguePageClient />;
}

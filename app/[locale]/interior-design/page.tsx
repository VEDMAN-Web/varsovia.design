import type { Metadata } from "next";
import InteriorPage from "@/components/interior/InteriorPage";
import Navbar from "@/components/layout/Navbar";
import { fetchSite } from "@/lib/api";
import { getIaHub, strField } from "@/lib/iaPages";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const hub = getIaHub(site, "interiorDesign", locale);
  return pageMetadata({
    title: strField(hub?.metaTitle || hub?.hero?.title, "Interior Design", locale),
    description: strField(
      hub?.metaDescription || hub?.hero?.subtitle || hub?.body,
      "Interior design projects and catalogue from Varsovia Design.",
      locale,
    ),
    path: `/${locale}/interior-design`,
    locale,
    indexable: hub?.indexable === true,
  });
}

/** Canonical interior-design hub — catalog UI; hero/SEO from pages.interiorDesign CMS. */
export default async function InteriorDesignCatalogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Navbar />
      <InteriorPage />
    </>
  );
}

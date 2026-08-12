import type { Metadata } from "next";
import ShowcaseListingPage from "@/components/showcase/ShowcaseListingPage";
import { fetchSite } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const pp = site.projectsPage || {};
  return pageMetadata({
    title: String(pp.metaTitle || "Projects").slice(0, 60),
    description: String(
      pp.metaDescription ||
        "Explore Varsovia Design projects across kitchens, bedrooms, and whole-home interiors.",
    ).slice(0, 160),
    path: `/${locale}/projects`,
    locale,
    indexable: pp.indexable === true,
  });
}

export default async function ProjectsListingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ShowcaseListingPage />;
}

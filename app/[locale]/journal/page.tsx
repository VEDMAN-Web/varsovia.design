import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { IaHubView } from "@/components/ia/IaLanding";
import JournalArticleGrid from "@/components/journal/JournalArticleGrid";
import { fetchSite } from "@/lib/api";
import { getIaHub, hubPath, strField } from "@/lib/iaPages";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const hub = getIaHub(site, "journal", locale);
  return pageMetadata({
    title: strField(hub.metaTitle || hub.hero?.title, "Journal", locale).slice(0, 60),
    description: strField(
      hub.metaDescription || hub.hero?.subtitle,
      "Design insights, materials, and interior inspiration from Varsovia Design.",
      locale,
    ).slice(0, 160),
    path: `/${locale}${hubPath("journal")}`,
    locale,
    indexable: hub.indexable === true,
  });
}

export default async function JournalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await fetchSite(locale as Locale);
  const hub = getIaHub(site, "journal", locale);

  return (
    <>
      <Navbar />
      <main>
        <IaHubView hubKey="journal" hub={hub} locale={locale} />
        <JournalArticleGrid />
      </main>
    </>
  );
}

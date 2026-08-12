import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import AboutPageContent from "@/components/about/AboutPageContent";
import { fetchSite } from "@/lib/api";
import { getAppMessages } from "@/lib/i18n/messageCatalog";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const seo = site.aboutPageSettings;
  const m = getAppMessages(locale);
  return pageMetadata({
    title: seo?.metaTitle || m.pageMeta.aboutTitle,
    description: seo?.metaDescription || m.pageMeta.aboutDescription,
    path: `/${locale}/about`,
    locale,
    indexable: seo?.indexable === true,
  });
}

export default async function AboutRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await fetchSite(locale as Locale);

  return (
    <>
      <Navbar />
      <main>
        <AboutPageContent site={site} />
      </main>
    </>
  );
}

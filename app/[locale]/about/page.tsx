import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import AboutPageContent from "@/components/about/AboutPageContent";
import { fetchSite } from "@/lib/api";
import { getAppMessages } from "@/lib/i18n/messageCatalog";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = getAppMessages(locale);
  return pageMetadata({
    title: m.pageMeta.aboutTitle,
    description: m.pageMeta.aboutDescription,
    path: `/${locale}/about`,
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

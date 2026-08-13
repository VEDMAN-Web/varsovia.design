import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import AboutPageContent from "@/components/about/AboutPageContent";
import { fetchSite } from "@/lib/api";
import { getIaHub, strField } from "@/lib/iaPages";
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
  const brandHub = getIaHub(site, "aboutBrand", locale);
  const aboutSite = {
    ...site,
    brandHub: brandHub
      ? {
          exploreTitle: strField(brandHub.exploreTitle, "", locale),
          exploreSubtitle: strField(brandHub.exploreSubtitle, "", locale),
          children: (brandHub.children || []).map((c) => ({
            slug: c.slug,
            title: strField(c.hero?.title || c.title, c.slug, locale),
            subtitle: strField(c.hero?.subtitle, "", locale),
            image: strField(c.hero?.image, "", locale),
          })),
        }
      : undefined,
  };

  return (
    <>
      <Navbar />
      <main>
        <AboutPageContent site={aboutSite} />
      </main>
    </>
  );
}

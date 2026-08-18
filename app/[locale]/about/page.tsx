import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { IaHubView } from "@/components/ia/IaLanding";
import { fetchSite } from "@/lib/api";
import { getIaHub, strField } from "@/lib/iaPages";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string }>;
};

function aboutLandingHub(
  site: Awaited<ReturnType<typeof fetchSite>>,
  locale: string,
) {
  const hub = getIaHub(site, "aboutBrand", locale);
  return {
    ...hub,
    children: (hub.children || []).filter(
      (child) => String(child.slug || "").toLowerCase() !== "varsovia",
    ),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const hub = aboutLandingHub(site, locale);
  return pageMetadata({
    title: strField(hub.metaTitle || hub.hero?.title, "About", locale),
    description: strField(hub.metaDescription || hub.hero?.subtitle, "", locale),
    path: `/${locale}/about`,
    locale,
    indexable: hub.indexable === true,
    image: strField(hub.hero?.image, "", locale),
  });
}

export default async function AboutRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await fetchSite(locale as Locale);
  const hub = aboutLandingHub(site, locale);

  return (
    <>
      <Navbar />
      <main>
        <IaHubView hubKey="aboutBrand" hub={hub} locale={locale} />
      </main>
    </>
  );
}

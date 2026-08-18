import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { IaHubView } from "@/components/ia/IaLanding";
import { fetchSite } from "@/lib/api";
import { getIaChild, getIaHub, strField } from "@/lib/iaPages";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

function aboutLandingHub(
  site: Awaited<ReturnType<typeof fetchSite>>,
  locale: string,
) {
  const hub = getIaHub(site, "aboutBrand", locale);
  const varsovia = getIaChild(site, "aboutBrand", "varsovia", locale);
  if (!varsovia) return hub;

  const childTitle = strField(varsovia.hero?.title || varsovia.title, "", locale);
  const hubTitle = strField(hub.hero?.title, "", locale);
  const useChildHero =
    Boolean(strField(varsovia.hero?.image, "", locale)) &&
    (!hubTitle || hubTitle.toLowerCase() === "about" || !strField(hub.hero?.image, "", locale));

  return {
    ...hub,
    hero: useChildHero
      ? {
          ...(hub.hero || {}),
          ...(varsovia.hero || {}),
          title: childTitle || hub.hero?.title,
          subtitle:
            strField(varsovia.hero?.subtitle, "", locale) || hub.hero?.subtitle,
          image: strField(varsovia.hero?.image, "", locale) || hub.hero?.image,
          ctaLabel:
            strField(varsovia.hero?.ctaLabel, "", locale) || hub.hero?.ctaLabel,
          ctaHref:
            strField(varsovia.hero?.ctaHref, "", locale) || hub.hero?.ctaHref,
        }
      : hub.hero,
    body: strField(hub.body, "", locale) ? hub.body : varsovia.body,
    sections:
      hub.sections && hub.sections.length > 0 ? hub.sections : varsovia.sections,
    metaTitle: hub.metaTitle || varsovia.metaTitle,
    metaDescription: hub.metaDescription || varsovia.metaDescription,
    indexable: hub.indexable === true || varsovia.indexable === true,
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

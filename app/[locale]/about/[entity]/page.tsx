import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { IaChildView } from "@/components/ia/IaLanding";
import { fetchSite } from "@/lib/api";
import { getIaChild, getIaHub, normalizeIaSlug, strField } from "@/lib/iaPages";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; entity: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, entity: raw } = await params;
  const entity = normalizeIaSlug(raw);
  if (entity.toLowerCase() === "varsovia") {
    redirect(`/${locale}/about`);
  }
  const site = await fetchSite(locale as Locale);
  const hub = getIaHub(site, "aboutBrand", locale);
  const child = getIaChild(site, "aboutBrand", entity, locale);
  if (!child) return { title: "Not found" };
  const title = strField(
    child.metaTitle || child.hero?.title || child.title || hub?.metaTitle,
    entity,
    locale,
  );
  return pageMetadata({
    title,
    description: strField(
      child.metaDescription || child.hero?.subtitle || hub?.metaDescription,
      "",
      locale,
    ),
    path: `/${locale}/about/${entity}`,
    locale,
    indexable: child.indexable === true || hub?.indexable === true,
    image: strField(child.hero?.image || hub?.hero?.image, "", locale),
  });
}

export default async function AboutEntityPage({ params }: Props) {
  const { locale, entity: raw } = await params;
  const entity = normalizeIaSlug(raw);
  if (entity.toLowerCase() === "varsovia") {
    redirect(`/${locale}/about`);
  }
  setRequestLocale(locale);
  const site = await fetchSite(locale as Locale);
  const hub = getIaHub(site, "aboutBrand", locale);
  const child = getIaChild(site, "aboutBrand", entity, locale);
  if (!child) notFound();

  const merged = {
    ...child,
    body: strField(child.body, "", locale) ? child.body : hub?.body,
    sections:
      child.sections && child.sections.length > 0
        ? child.sections
        : hub?.sections,
    hero: {
      ...(hub?.hero || {}),
      ...(child.hero || {}),
      title:
        strField(child.hero?.title, "", locale) ||
        strField(child.title, "", locale) ||
        hub?.hero?.title,
      subtitle:
        strField(child.hero?.subtitle, "", locale) || hub?.hero?.subtitle,
      eyebrow: strField(child.hero?.eyebrow, "", locale) || hub?.hero?.eyebrow,
      image: strField(child.hero?.image, "", locale) || hub?.hero?.image,
      ctaLabel:
        strField(child.hero?.ctaLabel, "", locale) || hub?.hero?.ctaLabel,
      ctaHref: strField(child.hero?.ctaHref, "", locale) || hub?.hero?.ctaHref,
    },
  };

  return (
    <>
      <Navbar />
      <main>
        <IaChildView
          hubKey="aboutBrand"
          hubTitle={strField(hub?.hero?.title, "About", locale)}
          child={merged}
          locale={locale}
        />
      </main>
    </>
  );
}

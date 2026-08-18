import type { Metadata } from "next";
import { fetchSite } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import { pageMetadata } from "@/lib/seo";
import { getPublicSiteUrl } from "@/lib/publicEnv";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const qs = (site.qualitySale || {}) as Record<string, unknown>;
  return pageMetadata({
    title:
      pickLocalized(qs.metaTitle, locale as Locale) || "Quality After Sales",
    description:
      pickLocalized(qs.metaDescription, locale as Locale) ||
      "Varsovia quality standards, support process, and after-sales care for kitchens and interiors.",
    path: `/${locale}/quality-sale`,
    locale,
    indexable: qs.indexable === true,
    image:
      String(qs.feature1Image || "").trim() ||
      "/home/featured-project/feature-1.jpg",
  });
}

export default async function QualitySaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const qs = (site.qualitySale || {}) as Record<string, unknown>;
  const title =
    pickLocalized(qs.heroTitle, locale as Locale) || "Quality After Sales";
  const description =
    pickLocalized(qs.metaDescription, locale as Locale) ||
    pickLocalized(qs.heroBody, locale as Locale) ||
    "";
  const image = String(qs.feature1Image || "").trim();
  const base = getPublicSiteUrl().replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description || undefined,
    url: `${base}/${locale}/quality-sale`,
    ...(image
      ? { image: image.startsWith("http") ? image : `${base}${image.startsWith("/") ? image : `/${image}`}` }
      : {}),
    isPartOf: {
      "@type": "WebSite",
      name: "Varsovia Design",
      url: base,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}

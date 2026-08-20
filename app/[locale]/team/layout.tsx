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
  const tp = site.teamPage || {};
  return pageMetadata({
    title: pickLocalized(tp.metaTitle, locale as Locale) || "Our Team | Varsovia Design",
    description:
      pickLocalized(tp.metaDescription, locale as Locale) ||
      "Meet the designers, architects, and craftspeople behind Varsovia Design — Italian design collaboration and technical teams for homes across Thailand.",
    path: `/${locale}/team`,
    locale,
    indexable: tp.indexable === true,
    image: "/team/team.jpg",
  });
}

export default async function TeamLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const tp = site.teamPage || {};
  const title = pickLocalized(tp.heroTitle, locale as Locale) || "Our Team";
  const description =
    pickLocalized(tp.metaDescription, locale as Locale) ||
    pickLocalized(tp.intro, locale as Locale) ||
    "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    description: description || undefined,
    url: `${getPublicSiteUrl().replace(/\/$/, "")}/${locale}/team`,
    image: `${getPublicSiteUrl().replace(/\/$/, "")}/team/team.jpg`,
    isPartOf: {
      "@type": "WebSite",
      name: "Varsovia Design",
      url: getPublicSiteUrl().replace(/\/$/, ""),
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

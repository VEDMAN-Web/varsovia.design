import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import FAQPageContent from "@/components/faq/FAQPageContent";
import { fetchFAQs, fetchSite } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import {
  collectFaqEntities,
  normalizeFaqsFromApi,
} from "@/lib/faqData";
import { pageMetadata } from "@/lib/seo";
import { getPublicSiteUrl } from "@/lib/publicEnv";
import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const fp = site.faqPage || {};
  return pageMetadata({
    title: pickLocalized(fp.metaTitle, locale as Locale) || "FAQ | Varsovia Design",
    description:
      pickLocalized(fp.metaDescription, locale as Locale) ||
      pickLocalized(fp.heroSubtitle, locale as Locale) ||
      "Answers to common questions on Varsovia kitchens, interiors, materials, timelines, and after-sales — from planning through installation.",
    path: `/${locale}/faq`,
    locale,
    indexable: fp.indexable === true,
  });
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [site, faqRows] = await Promise.all([
    fetchSite(locale as Locale),
    fetchFAQs(locale as Locale)
      .then((rows) => ({ ok: true as const, rows }))
      .catch(() => ({ ok: false as const, rows: [] as Record<string, unknown>[] })),
  ]);
  const fp = site.faqPage || {};
  const title = pickLocalized(fp.heroTitle, locale as Locale) || "FAQ";
  const description =
    pickLocalized(fp.metaDescription, locale as Locale) ||
    pickLocalized(fp.heroSubtitle, locale as Locale) ||
    "";
  const entities = collectFaqEntities(
    normalizeFaqsFromApi(faqRows.rows, locale as Locale),
    locale as Locale,
    { preferCms: faqRows.ok },
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: title,
    description: description || undefined,
    url: `${getPublicSiteUrl().replace(/\/$/, "")}/${locale}/faq`,
    mainEntity: entities.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Navbar />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <FAQPageContent />
      </main>
    </>
  );
}

import type { Metadata } from "next";
import LegalDocumentPage from "@/components/company/LegalDocumentPage";
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
  const doc = site.legalPages?.privacy;
  const messages = getAppMessages(locale);
  const fallback = messages.legal.privacy as { title: string; metaDescription: string };
  return pageMetadata({
    title: doc?.metaTitle || doc?.title || fallback.title,
    description: doc?.metaDescription || fallback.metaDescription,
    path: `/${locale}/privacy`,
    locale,
    indexable: doc?.indexable === true,
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await fetchSite(locale as Locale);
  const doc = site.legalPages?.privacy;
  const messages = getAppMessages(locale);
  const fallback = messages.legal.privacy;

  const document = {
    title: doc?.title || fallback.title,
    subtitle: doc?.subtitle || fallback.subtitle,
    updated: doc?.updated || fallback.updated,
    blocks:
      doc?.blocks?.length && doc.blocks.some((b) => b.heading || b.text)
        ? doc.blocks
        : fallback.blocks,
  };

  return <LegalDocumentPage document={document} />;
}

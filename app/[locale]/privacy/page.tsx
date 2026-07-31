import type { Metadata } from "next";
import LegalDocumentPage, { type LegalDocumentContent } from "@/components/company/LegalDocumentPage";
import { getAppMessages } from "@/lib/i18n/messageCatalog";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = getAppMessages(locale);
  const doc = messages.legal.privacy as LegalDocumentContent & { metaDescription: string };
  return pageMetadata({
    title: doc.title,
    description: doc.metaDescription,
    path: `/${locale}/privacy`,
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = getAppMessages(locale);
  const document = messages.legal.privacy as LegalDocumentContent;

  return <LegalDocumentPage document={document} />;
}

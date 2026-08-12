import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import FAQPageContent from "@/components/faq/FAQPageContent";
import { fetchSite } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const fp = site.faqPage || {};
  return pageMetadata({
    title: fp.metaTitle || "FAQ",
    description: fp.metaDescription || fp.heroSubtitle || "Frequently asked questions",
    path: `/${locale}/faq`,
    locale,
    indexable: fp.indexable === true,
  });
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main>
        <FAQPageContent />
      </main>
    </>
  );
}

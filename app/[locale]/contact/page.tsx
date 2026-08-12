import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import ContactPageContent from "@/components/contact/ContactPageContent";
import { fetchShowrooms, fetchSite } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const cp = site.contactPage || {};
  return pageMetadata({
    title: cp.metaTitle || "Contact Us",
    description:
      cp.metaDescription ||
      "Get in touch with Varsovia Design for a free consultation on modular kitchens and interiors.",
    path: `/${locale}/contact`,
    locale,
    indexable: cp.indexable === true,
  });
}

export default async function ContactRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [site, showrooms] = await Promise.all([
    fetchSite(locale as Locale),
    fetchShowrooms(locale as Locale),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <ContactPageContent site={site} showrooms={showrooms} />
      </main>
    </>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import FAQPageContent from "@/components/faq/FAQPageContent";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default as {
    faq: { heroTitle: string; heroSubtitle: string };
  };

  return {
    title: `${messages.faq.heroTitle} | Varsovia Design`,
    description: messages.faq.heroSubtitle,
  };
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

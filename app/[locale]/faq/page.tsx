import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import FAQPageContent from "@/components/faq/FAQPageContent";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "FAQ | Varsovia Design",
  description:
    "Clear answers about modular kitchens, bedrooms, living rooms, and whole-home interiors from Varsovia Design.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

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

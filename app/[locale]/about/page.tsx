import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import AboutPageContent from "@/components/about/AboutPageContent";
import { fetchSite } from "@/lib/api";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";

export const metadata: Metadata = {
  title: "About Us | Varsovia Design",
  description:
    "Twelve years of rooms built to last. Learn about Varsovia Design's vision, mission, story, and process for creating timeless interiors.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await fetchSite(locale as Locale);

  return (
    <>
      <Navbar />
      <main>
        <AboutPageContent site={site} />
      </main>
    </>
  );
}

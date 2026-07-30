import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import InteriorDetail from "@/components/interior/InteriorDetail";
import { fetchProjectById } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { interiorStaticParams } from "@/lib/interiorData";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

// Pre-render the 24 hardcoded items at build time
export function generateStaticParams() {
  return interiorStaticParams();
}

// Allow API project IDs (MongoDB ObjectIds) not in static params to render dynamically
export const dynamicParams = true;

export default async function InteriorDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const project = await fetchProjectById(id, locale as Locale);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main>
        <InteriorDetail project={project} />
      </main>
    </>
  );
}

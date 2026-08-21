import type { Metadata } from "next";
import InteriorPage from "@/components/interior/InteriorPage";
import Navbar from "@/components/layout/Navbar";
import { IaHubView } from "@/components/ia/IaLanding";
import { fetchProjects, fetchSite } from "@/lib/api";
import { getIaHub, hubPath, strField } from "@/lib/iaPages";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const hub = getIaHub(site, "interiorDesign", locale);
  return pageMetadata({
    title: strField(hub?.metaTitle, strField(hub?.hero?.title, "Interior Design", locale), locale),
    description: strField(
      hub?.metaDescription,
      strField(hub?.hero?.subtitle, "", locale),
      locale,
    ),
    path: `/${locale}${hubPath("interiorDesign")}`,
    locale,
    indexable: hub?.indexable === true,
  });
}

/** Same CMS stack as Furniture: banner → intro → blocks → Explore (project catalogue). */
export default async function InteriorDesignCatalogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [site, projects] = await Promise.all([
    fetchSite(locale as Locale),
    fetchProjects(locale as Locale).catch(() => [] as Awaited<ReturnType<typeof fetchProjects>>),
  ]);
  const hub = getIaHub(site, "interiorDesign", locale);
  return (
    <>
      <Navbar />
      <main>
        <IaHubView
          hubKey="interiorDesign"
          hub={hub}
          locale={locale}
          exploreSlot={<InteriorPage embedded initialProjects={projects} />}
        />
      </main>
    </>
  );
}

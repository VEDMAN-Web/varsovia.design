import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { IaChildView } from "@/components/ia/IaLanding";
import { fetchSite } from "@/lib/api";
import { getIaChild, getIaHub } from "@/lib/iaPages";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; entity: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, entity: raw } = await params;
  const entity = decodeURIComponent(String(raw || "")).trim();
  const site = await fetchSite(locale as Locale);
  const child = getIaChild(site, "aboutBrand", entity);
  if (!child) return { title: "Not found" };
  const title = String(child.metaTitle || child.title || entity);
  return pageMetadata({
    title,
    description: String(child.metaDescription || ""),
    path: `/${locale}/about/${entity}`,
    locale,
    indexable: child.indexable === true,
  });
}

export default async function AboutEntityPage({ params }: Props) {
  const { locale, entity: raw } = await params;
  const entity = decodeURIComponent(String(raw || "")).trim();
  setRequestLocale(locale);
  const site = await fetchSite(locale as Locale);
  const hub = getIaHub(site, "aboutBrand");
  const child = getIaChild(site, "aboutBrand", entity);
  if (!child) notFound();

  return (
    <>
      <Navbar />
      <main>
        <IaChildView
          hubKey="aboutBrand"
          hubTitle={String(hub.hero?.title || "About")}
          child={child}
          locale={locale}
        />
      </main>
    </>
  );
}

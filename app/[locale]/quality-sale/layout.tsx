import type { Metadata } from "next";
import { fetchSite } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await fetchSite(locale as Locale);
  const qs = (site.qualitySale || {}) as Record<string, unknown>;
  return pageMetadata({
    title: String(qs.metaTitle || "Quality After Sales"),
    description: String(
      qs.metaDescription ||
        "Varsovia quality standards, support process, and after-sales care.",
    ),
    path: `/${locale}/quality-sale`,
    locale,
    indexable: qs.indexable === true,
  });
}

export default function QualitySaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}

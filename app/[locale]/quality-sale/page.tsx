import QualityAfterSalesPageClient from "@/components/company/QualityAfterSalesPageClient";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function QualityAfterSalesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <QualityAfterSalesPageClient />;
}

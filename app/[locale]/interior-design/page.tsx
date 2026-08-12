import InteriorPage from "@/components/interior/InteriorPage";
import Navbar from "@/components/layout/Navbar";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

/** Canonical interior-design hub — reuses existing interior catalog UI. */
export default async function InteriorDesignCatalogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Navbar />
      <InteriorPage />
    </>
  );
}

import ProductsListingPageClient from "@/components/products/ProductsListingPageClient";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProductsListingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProductsListingPageClient />;
}

import type { Metadata } from "next";
import CataloguePageClient from "@/components/catalogue/CataloguePageClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free Catalogue",
  description: "Download Varsovia Design catalogues for kitchen and interior inspiration.",
  path: "/catalogue",
});

export default function CataloguePage() {
  return <CataloguePageClient />;
}

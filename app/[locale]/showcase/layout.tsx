import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Showcase",
  description: "Explore Varsovia Design showcase projects across kitchens, bedrooms, and whole-home interiors.",
  path: "/showcase",
  indexable: false,
});

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}

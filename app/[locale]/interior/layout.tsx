import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Interior Catalogue",
  description: "Browse modular kitchens, bedrooms, bathrooms, and whole-house interior solutions.",
  path: "/interior",
});

export default function InteriorLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Design insights, kitchen trends, and interior inspiration from Varsovia Design.",
  path: "/blog",
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

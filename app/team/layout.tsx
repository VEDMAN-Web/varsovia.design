import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Team",
  description: "Meet the designers, architects, and craftspeople behind Varsovia Design.",
  path: "/team",
});

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}

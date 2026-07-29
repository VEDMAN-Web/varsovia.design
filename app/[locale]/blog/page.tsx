import BlogListingPageClient from "@/components/company/BlogListingPageClient";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogListingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BlogListingPageClient />;
}

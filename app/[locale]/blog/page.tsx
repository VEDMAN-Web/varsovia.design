import BlogListingPageClient from "@/components/company/BlogListingPageClient";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogListingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BlogListingPageClient />;
}

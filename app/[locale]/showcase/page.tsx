import ShowcaseListingPage from "@/components/showcase/ShowcaseListingPage";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ShowcasePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ShowcaseListingPage />;
}

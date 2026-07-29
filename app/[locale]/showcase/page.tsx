import ShowcaseListingPage from "@/components/showcase/ShowcaseListingPage";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ShowcasePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ShowcaseListingPage />;
}

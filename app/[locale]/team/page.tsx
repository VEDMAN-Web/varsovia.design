import TeamPageClient from "@/components/company/TeamPageClient";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OurTeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TeamPageClient />;
}

import TeamPageClient from "@/components/company/TeamPageClient";
import { setRequestLocale } from "next-intl/server";
import { fetchSite } from "@/lib/api";
import { fetchTeamMembers } from "@/lib/api";
import { resolveTeamMembers } from "@/lib/companyData";
import type { Locale } from "@/lib/i18n/routing";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OurTeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch fresh site + team members server-side — no stale cache
  const [site, teamData] = await Promise.all([
    fetchSite(locale as Locale).catch(() => null),
    fetchTeamMembers(locale as Locale).catch(() => []),
  ]);

  return <TeamPageClient site={site} initialTeamMembers={teamData} />;
}

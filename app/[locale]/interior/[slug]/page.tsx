import { redirect } from "next/navigation";
import { legacyInteriorSlugRedirect } from "@/lib/interiorRoutes";

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Legacy /interior/[slug] → /interior-design/[slug] */
export default async function LegacyInteriorSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  const legacySlug = legacyInteriorSlugRedirect(slug);
  redirect(`/${locale}/interior-design/${legacySlug || slug}`);
}

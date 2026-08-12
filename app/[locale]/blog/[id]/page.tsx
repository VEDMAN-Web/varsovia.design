import { redirect } from "next/navigation";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function LegacyBlogDetailPage({ params }: Props) {
  const { locale, id } = await params;
  redirect(`/${locale}/journal/p/${id}`);
}

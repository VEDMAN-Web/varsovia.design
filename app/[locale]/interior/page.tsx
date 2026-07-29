import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import InteriorPage from "@/components/interior/InteriorPage";
import InteriorPageFallback from "@/components/interior/InteriorPageFallback";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

/** Static shell — category comes from ?category= on the client for fast prefetched navigation. */
export default async function InteriorRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<InteriorPageFallback />}>
          <InteriorPage />
        </Suspense>
      </main>
    </>
  );
}

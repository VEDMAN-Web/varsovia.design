"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fdf2f0] px-6 text-center">
      <p className="font-display text-sm tracking-[0.28em] text-[#cf5374]">{t("somethingWrong").toUpperCase()}</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-[#6a414d] md:text-4xl">{t("errorTitle")}</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6a414d]/80">
        {error.message || t("errorMessage")}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-[#5c3d42] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#4a2f34]"
        >
          {t("tryAgain")}
        </button>
        <Link
          href="/"
          className="rounded-md border border-[#6a414d]/25 px-6 py-2.5 text-sm font-medium text-[#6a414d] transition hover:bg-white/60"
        >
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}

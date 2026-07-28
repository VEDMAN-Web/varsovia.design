"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fdf2f0] px-6 text-center">
      <p className="font-display text-sm tracking-[0.28em] text-[#cf5374]">SOMETHING WENT WRONG</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-[#6a414d] md:text-4xl">
        We hit an unexpected error
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6a414d]/80">
        {error.message || "Please try again. If the problem continues, return to the homepage."}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-[#5c3d42] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#4a2f34]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-[#6a414d]/25 px-6 py-2.5 text-sm font-medium text-[#6a414d] transition hover:bg-white/60"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#fdf2f0] px-6 text-center">
      <p className="font-display text-sm tracking-[0.28em] text-[#cf5374]">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-[#6a414d] md:text-4xl">Page not found</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6a414d]/80">
        The page you are looking for may have moved or no longer exists.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-md bg-[#5c3d42] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#4a2f34]"
      >
        Back to home
      </Link>
    </div>
  );
}

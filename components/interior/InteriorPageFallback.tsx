import PageShell from "@/components/ui/PageShell";

export default function InteriorPageFallback() {
  return (
    <div className="min-h-screen bg-[#f7f3f2]">
      <section className="pt-[calc(102px+24px)] md:pt-[calc(102px+32px)]">
        <PageShell>
          <div className="mx-auto max-w-3xl animate-pulse space-y-4">
            <div className="mx-auto h-10 w-72 rounded bg-[#e8e2e0]" />
            <div className="mx-auto h-5 w-full max-w-xl rounded bg-[#ece6e4]" />
          </div>
          <div className="mt-10 flex justify-center gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-11 w-24 rounded-[6px] bg-[#e8e2e0]" />
            ))}
          </div>
        </PageShell>
      </section>
      <section className="mt-12 pb-28">
        <PageShell>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[420px] animate-pulse rounded-[10px] bg-[#e8e2e0]" />
            ))}
          </div>
        </PageShell>
      </section>
    </div>
  );
}

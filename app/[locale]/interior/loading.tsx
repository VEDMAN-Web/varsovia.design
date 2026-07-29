import Navbar from "@/components/layout/Navbar";
import InteriorPageFallback from "@/components/interior/InteriorPageFallback";
export default function InteriorLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f3f2]">
        <InteriorPageFallback />
      </main>
    </>
  );
}

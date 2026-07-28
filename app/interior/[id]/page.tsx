import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import InteriorDetail from "@/components/interior/InteriorDetail";
import { fetchProjectById } from "@/lib/api";
import { interiorStaticParams } from "@/lib/interiorData";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return interiorStaticParams();
}

export default async function InteriorDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await fetchProjectById(id);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main>
        <InteriorDetail project={project} />
      </main>
    </>
  );
}

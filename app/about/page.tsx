import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import AboutPageContent from "@/components/about/AboutPageContent";
import { fetchSite } from "@/lib/api";

export const metadata: Metadata = {
  title: "About Us | Varsovia Design",
  description:
    "Twelve years of rooms built to last. Learn about Varsovia Design's vision, mission, story, and process for creating timeless interiors.",
};

export default async function AboutRoute() {
  const site = await fetchSite();

  return (
    <>
      <Navbar />
      <main>
        <AboutPageContent site={site} />
      </main>
    </>
  );
}

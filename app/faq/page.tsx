import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import FAQPageContent from "@/components/faq/FAQPageContent";

export const metadata: Metadata = {
  title: "FAQ | Varsovia Design",
  description:
    "Clear answers about modular kitchens, bedrooms, living rooms, and whole-home interiors from Varsovia Design.",
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main>
        <FAQPageContent />
      </main>
    </>
  );
}

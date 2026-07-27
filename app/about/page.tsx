import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutPageContent from "@/components/about/AboutPageContent";

export const metadata: Metadata = {
  title: "About Us | Varsovia Design",
  description:
    "Twelve years of rooms built to last. Learn about Varsovia Design's vision, mission, story, and process for creating timeless interiors.",
};

export default function AboutRoute() {
  return (
    <>
      <Navbar />
      <main>
        <AboutPageContent />
      </main>
      <Footer
        bio="Transforming homes with thoughtfully designed interiors that feel timeless, warm, and uniquely yours."
        phone="+91 98765 43210"
        email="hello@Varsoviadesign.in"
        address="SG Highway, Ahmedabad, Gujarat 380015"
      />
    </>
  );
}

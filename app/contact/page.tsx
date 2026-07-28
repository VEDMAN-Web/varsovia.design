import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import ContactPageContent from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Us | Varsovia Design",
  description:
    "Get in touch with Varsovia Design for a free consultation on modular kitchens and interiors.",
};

export default function ContactRoute() {
  return (
    <>
      <Navbar />
      <main>
        <ContactPageContent />
      </main>
    </>
  );
}

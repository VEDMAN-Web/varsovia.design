import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import ContactPageContent from "@/components/contact/ContactPageContent";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Contact Us | Varsovia Design",
  description:
    "Get in touch with Varsovia Design for a free consultation on modular kitchens and interiors.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main>
        <ContactPageContent />
      </main>
    </>
  );
}

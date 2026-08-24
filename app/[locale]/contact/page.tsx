import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import ContactPageContent from "@/components/contact/ContactPageContent";
import { fetchShowrooms, fetchSite } from "@/lib/api";
import type { Locale } from "@/lib/i18n/routing";
<<<<<<< Updated upstream
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import { pageMetadata } from "@/lib/seo";
import { getPublicSiteUrl } from "@/lib/publicEnv";
=======
import { pageMetadata } from "@/lib/seo";
>>>>>>> Stashed changes
import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
<<<<<<< Updated upstream
  const site = await fetchSite(locale as Locale);
  const cp = site.contactPage || {};
  const og =
    Array.isArray(site.contactImages) && site.contactImages[0]
      ? site.contactImages[0]
      : undefined;
  return pageMetadata({
    title: pickLocalized(cp.metaTitle, locale as Locale) || "Contact Us | Varsovia Design",
    description:
      pickLocalized(cp.metaDescription, locale as Locale) ||
      "Visit Varsovia Design in Koh Samui, Phuket, and Pattaya — book a free consultation for modular kitchens and complete interiors.",
    path: `/${locale}/contact`,
    locale,
    indexable: cp.indexable === true,
    image: og,
=======
  const site = await fetchSite(locale as Locale).catch(() => null);
  return pageMetadata({
    title: "Contact Us | Varsovia Design",
    description:
      "Visit Varsovia Design in Koh Samui, Phuket, and Pattaya — book a free consultation for modular kitchens and complete interiors.",
    path: `/${locale}/contact`,
>>>>>>> Stashed changes
  });
}

export default async function ContactRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
<<<<<<< Updated upstream
  const [site, showrooms] = await Promise.all([
    fetchSite(locale as Locale),
    fetchShowrooms(locale as Locale),
  ]);
  const cp = site.contactPage || {};
  const title =
    pickLocalized(cp.heroTitle, locale as Locale) ||
    pickLocalized(cp.metaTitle, locale as Locale) ||
    "Contact Us";
  const description =
    pickLocalized(cp.metaDescription, locale as Locale) ||
    pickLocalized(cp.heroSubtitle, locale as Locale) ||
    "";
  const base = getPublicSiteUrl().replace(/\/$/, "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: title,
    description: description || undefined,
    url: `${base}/${locale}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "Varsovia Design",
      url: base,
      ...(site.contactPhone || site.phone
        ? { telephone: String(site.contactPhone || site.phone) }
        : {}),
      ...(site.email ? { email: String(site.email) } : {}),
      ...(site.address
        ? {
            address: {
              "@type": "PostalAddress",
              streetAddress: pickLocalized(site.address, locale as Locale) || String(site.address),
              addressCountry: "TH",
            },
          }
        : {}),
    },
  };
=======

  const [site, showrooms] = await Promise.all([
    fetchSite(locale as Locale).catch(() => null),
    fetchShowrooms(locale as Locale),
  ]);
>>>>>>> Stashed changes

  return (
    <>
      <Navbar />
      <main>
<<<<<<< Updated upstream
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
=======
>>>>>>> Stashed changes
        <ContactPageContent site={site} showrooms={showrooms} />
      </main>
    </>
  );
}

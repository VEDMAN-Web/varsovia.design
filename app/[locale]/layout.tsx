import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import SmoothScroll from "@/components/providers/SmoothScroll";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { SiteSettingsProvider } from "@/components/providers/SiteSettingsProvider";
import LocaleHtmlLang from "@/components/i18n/LocaleHtmlLang";
import SiteIntroShell from "@/components/preloader/HomePageShell";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import { fetchSite } from "@/lib/api";
import { routing, type Locale } from "@/lib/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Refresh CMS-driven footer/site data within a minute on production. */
export const revalidate = 60;

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default as {
    metadata: { siteTitle: string; siteDescription: string };
  };

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}`]),
  ) as Record<string, string>;

  return {
    title: messages.metadata.siteTitle,
    description: messages.metadata.siteDescription,
    alternates: { languages },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const [messages, site] = await Promise.all([getMessages(), fetchSite(locale as Locale)]);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const siteDescription =
    typeof (messages as { metadata?: { siteDescription?: string } }).metadata
      ?.siteDescription === "string"
      ? (messages as { metadata: { siteDescription: string } }).metadata.siteDescription
      : undefined;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleHtmlLang locale={locale} />
      <GoogleAnalytics measurementId={gaId} />
      <OrganizationJsonLd
        description={siteDescription}
        email={site?.email}
        telephone={site?.phone || site?.contactPhone}
        logo={site?.brandLogoLockup || site?.brandLogoMark}
      />
      <SmoothScroll>
        <SiteSettingsProvider site={site}>
          <SiteIntroShell heroImage={site?.heroImage}>
            {children}
            <FooterWrapper site={site} />
          </SiteIntroShell>
        </SiteSettingsProvider>
      </SmoothScroll>
    </NextIntlClientProvider>
  );
}

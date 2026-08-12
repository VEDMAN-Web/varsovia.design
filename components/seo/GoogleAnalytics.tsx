import Script from "next/script";

/** Loads GA4 when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set (e.g. G-XXXXXXXX). */
export default function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const id = measurementId?.trim();
  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}

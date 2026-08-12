/**
 * Client analytics helpers — no-ops unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set
 * and gtag has loaded.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function hasGa(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim());
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  if (!hasGa()) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const cleaned: Record<string, string | number | boolean> = {};
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) cleaned[k] = v;
    }
  }
  window.gtag("event", name, cleaned);
}

/** Lead form successfully submitted (contact / catalogue). */
export function trackGenerateLead(purpose: string) {
  trackEvent("generate_lead", {
    event_category: "engagement",
    form_purpose: purpose,
  });
}

/** Primary CTA clicks (Free Consultation, Get a consultation, etc.). */
export function trackCtaClick(ctaId: string, location: string) {
  trackEvent("cta_click", {
    event_category: "engagement",
    cta_id: ctaId,
    cta_location: location,
  });
}

/** WhatsApp outbound click. */
export function trackWhatsAppClick(placement: string) {
  trackEvent("whatsapp_click", {
    event_category: "engagement",
    placement,
  });
}

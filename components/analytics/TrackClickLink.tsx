"use client";

import { Link } from "@/lib/i18n/navigation";
import { trackCtaClick, trackWhatsAppClick } from "@/lib/analytics";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
  ctaId?: string;
  ctaLocation?: string;
  whatsappPlacement?: string;
  external?: boolean;
};

/** Link that fires GA4 CTA / WhatsApp events when measurement ID is set. */
export default function TrackClickLink({
  href,
  className,
  children,
  ctaId,
  ctaLocation,
  whatsappPlacement,
  external,
}: Props) {
  function onClick() {
    if (whatsappPlacement) trackWhatsAppClick(whatsappPlacement);
    else if (ctaId) trackCtaClick(ctaId, ctaLocation || "page");
  }

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

"use client";

import ContactCollage from "@/components/forms/ContactCollage";
import ContactInquiryForm from "@/components/forms/ContactInquiryForm";
import type { InquiryPurpose } from "@/components/forms/contactFormShared";

type ContactFormPanelProps = {
  images?: string[];
  purpose?: InquiryPurpose;
  downloadUrl?: string;
  className?: string;
  panelClassName?: string;
  variant?: "section" | "modal";
  onSubmitted?: () => void;
};

const FORM_SCROLL =
  "overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

/** Shared Get In Touch panel — Figma 4:801 (section) / 4:4691 (modal) */
export default function ContactFormPanel({
  images = [],
  purpose = "contact",
  downloadUrl,
  className = "",
  panelClassName = "",
  variant = "section",
  onSubmitted,
}: ContactFormPanelProps) {
  const isModal = variant === "modal";
  const panelBg = isModal ? "bg-[#fff3f2]" : "bg-[rgba(207,83,116,0.06)]";

  if (isModal) {
    return (
      <div
        className={`relative h-[min(772px,calc(96vh-11rem))] min-h-[520px] w-full overflow-hidden lg:h-[min(772px,calc(96vh-10rem))] lg:min-h-[640px] ${panelBg} ${panelClassName}`.trim()}
      >
        <ContactCollage images={images} variant="modal" />

        <div
          className={`relative z-10 flex h-full min-h-0 flex-col ${FORM_SCROLL} px-1 pb-2 pt-2 lg:absolute lg:bottom-0 lg:left-[47.5%] lg:right-0 lg:top-0 lg:px-3 lg:pb-6 lg:pt-1 ${className}`.trim()}
        >
          <ContactInquiryForm
            purpose={purpose}
            downloadUrl={downloadUrl}
            density="modal"
            onSubmitted={onSubmitted}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${panelBg} lg:aspect-[1240/846] ${panelClassName}`.trim()}
    >
      <ContactCollage images={images} variant="section" />

      <div
        className={`relative z-10 min-w-0 px-4 pb-8 pt-6 sm:px-6 lg:absolute lg:bottom-[4.73%] lg:left-[47.5%] lg:top-[4.73%] lg:flex lg:w-[49.35%] lg:min-h-0 lg:flex-col lg:px-6 lg:pb-0 lg:pt-0 xl:px-8 ${className}`.trim()}
      >
        <ContactInquiryForm
          purpose={purpose}
          downloadUrl={downloadUrl}
          density="section"
          onSubmitted={onSubmitted}
        />
      </div>
    </div>
  );
}

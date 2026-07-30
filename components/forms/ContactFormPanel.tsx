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
      <div className={`w-full min-w-0 ${panelBg} ${panelClassName}`.trim()}>
        {/* Wide desktop — side-by-side; tablet/phone — form only, full width */}
        <div className="flex flex-col 2xl:flex-row 2xl:items-start">
          <div className="relative hidden shrink-0 2xl:block 2xl:w-[44%]">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] 2xl:max-w-none">
              <ContactCollage images={images} variant="modal" />
            </div>
          </div>

          <div
            className={`min-w-0 flex-1 px-4 pb-4 pt-3 sm:px-6 sm:pb-6 sm:pt-4 md:px-10 2xl:px-8 2xl:pb-8 2xl:pt-5 ${className}`.trim()}
          >
            <ContactInquiryForm
              purpose={purpose}
              downloadUrl={downloadUrl}
              density="modal"
              onSubmitted={onSubmitted}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full min-w-0 overflow-hidden ${panelBg} max-lg:rounded-[8px] lg:aspect-[1240/846] ${panelClassName}`.trim()}
    >
      <ContactCollage images={images} variant="section" />

      <div
        className={`relative z-10 min-w-0 px-3 pb-8 pt-4 sm:px-6 sm:pt-5 lg:absolute lg:bottom-[4.73%] lg:left-[47.5%] lg:top-[4.73%] lg:flex lg:w-[49.35%] lg:min-h-0 lg:flex-col lg:px-6 lg:pb-0 lg:pt-0 xl:px-8 ${className}`.trim()}
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

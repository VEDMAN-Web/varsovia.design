"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { ContactCollageMobileSlider } from "@/components/forms/ContactCollage";
import ContactMosaicBand from "@/components/forms/ContactMosaicBand";
import ContactInquiryForm from "@/components/forms/ContactInquiryForm";
import type { InquiryPurpose } from "@/components/forms/contactFormShared";
import {
  CONTACT_FORM_BAND,
  CONTACT_FORM_PADDING,
  CONTACT_PANEL_BG,
  CONTACT_PANEL_RADIUS,
} from "@/components/forms/contactLayoutShared";
import {
  MODAL_FORM_BAND,
  MODAL_FORM_PADDING,
  MODAL_FORM_SCROLL,
  MODAL_MOSAIC_SHELL,
  MODAL_MOBILE_SLIDER,
} from "@/components/forms/contactModalLayoutShared";

type ContactFormPanelProps = {
  images?: string[];
  purpose?: InquiryPurpose;
  downloadUrl?: string;
  className?: string;
  panelClassName?: string;
  variant?: "section" | "modal";
  onSubmitted?: () => void;
  /** Scroll container for modal form on small screens (wheel / touch lock) */
  formScrollRef?: RefObject<HTMLElement | null>;
};

export default function ContactFormPanel({
  images = [],
  purpose = "contact",
  downloadUrl,
  className = "",
  panelClassName = "",
  variant = "section",
  onSubmitted,
  formScrollRef,
}: ContactFormPanelProps) {
  const isModal = variant === "modal";
  const panelBg = isModal ? "bg-[#fff3f2]" : CONTACT_PANEL_BG;
  const modalRowRef = useRef<HTMLDivElement>(null);
  const [modalBodyHeight, setModalBodyHeight] = useState(0);

  const measureModalRow = useCallback(() => {
    const row = modalRowRef.current;
    if (!row) return;
    setModalBodyHeight(row.clientHeight);
  }, []);

  useEffect(() => {
    if (!isModal) return;
    measureModalRow();
    const row = modalRowRef.current;
    if (!row) return;
    const ro = new ResizeObserver(measureModalRow);
    ro.observe(row);
    return () => ro.disconnect();
  }, [isModal, measureModalRow]);

  if (isModal) {
    return (
      <div
        ref={modalRowRef}
        className={`flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden lg:flex-row lg:items-stretch ${panelBg} ${panelClassName}`.trim()}
      >
        <ContactCollageMobileSlider
          images={images}
          compact
          className={MODAL_MOBILE_SLIDER}
        />

        <div className={MODAL_MOSAIC_SHELL}>
          <ContactMosaicBand images={images} fillParent maxHeight={modalBodyHeight} />
        </div>

        <div
          ref={formScrollRef as RefObject<HTMLDivElement | null>}
          data-lenis-prevent
          className={`${MODAL_FORM_BAND} ${MODAL_FORM_SCROLL} ${MODAL_FORM_PADDING} box-border ${className}`.trim()}
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
      className={`relative w-full min-w-0 ${CONTACT_PANEL_RADIUS} ${panelBg} ${panelClassName}`.trim()}
    >
      <div className="relative flex min-w-0 flex-col md:flex-row md:items-stretch">
        <ContactCollageMobileSlider images={images} className="shrink-0 md:hidden" />

        <ContactMosaicBand images={images} className="hidden md:block md:self-stretch" />

        <div
          className={`${CONTACT_FORM_BAND} ${CONTACT_FORM_PADDING} md:flex md:flex-col md:justify-start ${className}`.trim()}
        >
          <ContactInquiryForm
            purpose={purpose}
            downloadUrl={downloadUrl}
            density="section"
            onSubmitted={onSubmitted}
          />
        </div>
      </div>
    </div>
  );
}

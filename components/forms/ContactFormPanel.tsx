"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ContactCollageMobileSlider } from "@/components/forms/ContactCollage";
import ContactMosaicBand from "@/components/forms/ContactMosaicBand";
import ContactInquiryForm from "@/components/forms/ContactInquiryForm";
import type { InquiryPurpose } from "@/components/forms/contactFormShared";
import {
  CONTACT_FORM_BAND,
  CONTACT_FORM_PADDING,
  CONTACT_MOSAIC_BAND,
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
import { REVEAL_EASE } from "@/lib/motionPresets";

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
  /** Stagger collage + form on homepage contact section */
  entranceMotion?: boolean;
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
  entranceMotion = false,
}: ContactFormPanelProps) {
  const isModal = variant === "modal";
  const reduceMotion = useReducedMotion();
  const panelBg = isModal ? "bg-[#fff3f2]" : CONTACT_PANEL_BG;
  const panelRowRef = useRef<HTMLDivElement>(null);
  const formColumnRef = useRef<HTMLDivElement>(null);
  const [mosaicTargetHeight, setMosaicTargetHeight] = useState(0);

  const measureMosaicHeight = useCallback(() => {
    const formCol = formColumnRef.current;
    const row = panelRowRef.current;
    const formH = formCol?.offsetHeight ?? 0;
    const rowH = row?.clientHeight ?? 0;
    setMosaicTargetHeight(Math.max(formH, rowH));
  }, []);

  useEffect(() => {
    measureMosaicHeight();
    const targets = [panelRowRef.current, formColumnRef.current].filter(Boolean);
    if (targets.length === 0) return;
    const ro = new ResizeObserver(measureMosaicHeight);
    targets.forEach((t) => ro.observe(t!));
    return () => ro.disconnect();
  }, [measureMosaicHeight]);

  if (isModal) {
    return (
      <div
        ref={panelRowRef}
        className={`flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden lg:flex-row lg:items-stretch ${panelBg} ${panelClassName}`.trim()}
      >
        <ContactCollageMobileSlider
          images={images}
          compact
          className={MODAL_MOBILE_SLIDER}
        />

        <div className={MODAL_MOSAIC_SHELL}>
          <ContactMosaicBand images={images} maxHeight={mosaicTargetHeight} />
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

  const formMotion = entranceMotion && !reduceMotion;

  return (
    <div
      className={`relative w-full min-w-0 ${CONTACT_PANEL_RADIUS} ${panelBg} ${panelClassName}`.trim()}
    >
      <div
        ref={panelRowRef}
        className="relative flex min-w-0 flex-col md:min-h-[min(846px,52vw)] md:flex-row md:items-stretch"
      >
        <ContactCollageMobileSlider images={images} className="shrink-0 md:hidden" />

        <motion.div
          className={`${CONTACT_MOSAIC_BAND} hidden min-h-0 overflow-hidden md:flex md:self-stretch`}
          style={mosaicTargetHeight > 0 ? { minHeight: mosaicTargetHeight } : undefined}
          initial={formMotion ? { opacity: 0, x: -24 } : false}
          whileInView={formMotion ? { opacity: 1, x: 0 } : undefined}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.65, ease: REVEAL_EASE, delay: 0.06 }}
        >
          <ContactMosaicBand
            images={images}
            maxHeight={mosaicTargetHeight}
            className="h-full min-h-0 w-full"
          />
        </motion.div>

        <motion.div
          ref={formColumnRef}
          className={`${CONTACT_FORM_BAND} ${CONTACT_FORM_PADDING} flex min-h-0 flex-col md:h-full md:min-h-full md:justify-stretch ${className}`.trim()}
          initial={formMotion ? { opacity: 0, x: 20 } : false}
          whileInView={formMotion ? { opacity: 1, x: 0 } : undefined}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.65, ease: REVEAL_EASE, delay: 0.12 }}
        >
          <ContactInquiryForm
            purpose={purpose}
            downloadUrl={downloadUrl}
            density="section"
            onSubmitted={onSubmitted}
            className="min-h-0 flex-1"
          />
        </motion.div>
      </div>
    </div>
  );
}

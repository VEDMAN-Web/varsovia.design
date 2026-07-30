/** Figma Contact Page 4:3886 — 1240×846 panel, 10px inset tiles */
export const COLLAGE_TILES = [
  { left: "0.806%", top: "1.182%", w: "24.194%", h: "35.461%", shadow: true },
  { left: "0.806%", top: "37.825%", w: "24.194%", h: "35.461%", shadow: false },
  { left: "25.806%", top: "1.182%", w: "18.468%", h: "12.056%", shadow: false },
  { left: "25.806%", top: "14.421%", w: "18.468%", h: "35.461%", shadow: false },
  { left: "25.806%", top: "51.064%", w: "18.468%", h: "22.222%", shadow: false },
  { left: "0.806%", top: "74.468%", w: "18.710%", h: "24.349%", shadow: false },
  { left: "20.323%", top: "74.468%", w: "23.952%", h: "24.349%", shadow: false },
] as const;

/** Modal collage — same proportions as section */
export const COLLAGE_MODAL_TILES = COLLAGE_TILES;

import { MEDIA } from "@/lib/mediaAssets";

export const COLLAGE_FALLBACKS = [...MEDIA.contact] as const;

export const CONTACT_LABEL =
  "font-outfit mb-[7px] block pl-2 text-[clamp(0.9375rem,2.5vw,1.125rem)] font-medium leading-[1.35] text-[#6a414d] sm:pl-4";
export const CONTACT_FIELD =
  "font-outfit h-[50px] w-full rounded-[6px] bg-[#e5c9cd] px-4 text-[14px] leading-[18px] text-[#251b1e] outline-none placeholder:text-[rgba(37,27,30,0.6)]";
export const CONTACT_TEXTAREA =
  "font-outfit w-full min-h-[146px] flex-1 rounded-[6px] bg-[#e5c9cd] px-4 py-3 text-[14px] leading-[18px] text-[#251b1e] outline-none placeholder:text-[rgba(37,27,30,0.6)]";
export const CONTACT_FIELD_ROW = "grid grid-cols-1 gap-[11px] sm:grid-cols-2";
export const CONTACT_FORM_GAP = "flex min-h-0 flex-1 flex-col gap-5";

/** Figma 4:4690 download modal — tighter field rhythm */
export const MODAL_LABEL =
  "font-outfit mb-[5px] block text-[14px] font-medium leading-[1.3] text-[#6a414d] sm:text-[16px] sm:mb-[6px]";
export const MODAL_FIELD =
  "font-outfit h-[38px] w-full rounded-[6px] bg-[#e5c9cd] px-[12px] text-[13px] leading-normal text-[#251b1e] outline-none placeholder:text-[rgba(37,27,30,0.6)] sm:h-[42px] sm:px-[14px] sm:text-[14px]";
export const MODAL_FIELD_ROW =
  "grid grid-cols-1 gap-2 min-[480px]:grid-cols-2 min-[480px]:gap-[10px]";
export const MODAL_FORM_GAP = "flex flex-col gap-[9px] sm:gap-[11px]";
export const MODAL_BG = "#fff3f2";

export type InquiryPurpose = "contact" | "catalogue";

export const INQUIRY_COPY = {
  contact: {
    successTitle: "Thank you",
    successLead: "Your request has been submitted successfully.",
    successBody:
      "Our design expert will review your requirements and get in touch with you within 24 business hours to discuss your project.",
  },
  catalogue: {
    successTitle: "Thank you",
    successLead: "Your request has been submitted successfully.",
    successBody:
      "Our design expert will review your requirements and get in touch with you within 24 business hours to discuss your project.",
    modalIntro: "Complete the form to download your free design catalogue.",
    modalSuccessTitle: "Thank you! Your free catalogue is on its way.",
    downloadLabel: "Download PDF",
  },
} as const;

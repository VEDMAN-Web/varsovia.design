/** Download modal — mosaic + form (Figma 47.5 / 52.5 from lg) */

export const MODAL_MOSAIC_SHELL =
  "relative hidden h-full min-h-0 w-full shrink-0 overflow-hidden bg-[rgba(207,83,116,0.06)] lg:block lg:w-[47.5%] lg:max-w-[47.5%] lg:self-stretch";

export const MODAL_FORM_SCROLL =
  "modal-form-scroll touch-pan-y overscroll-y-contain [-webkit-overflow-scrolling:touch]";

export const MODAL_FORM_BAND =
  "flex min-h-0 w-full min-w-0 flex-1 flex-col self-stretch overflow-y-auto bg-[#fff3f2] @container/contact-form lg:h-full lg:max-h-full lg:w-[52.5%] lg:max-w-[52.5%] lg:flex-none";

export const MODAL_FORM_PADDING =
  "box-border px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-6 sm:pt-3 lg:box-border lg:py-[4.73%] lg:pl-[clamp(0.625rem,1.2vw,1.5rem)] lg:pr-[clamp(0.875rem,2vw,2rem)] lg:pb-6";

export const MODAL_FIELD_ROW =
  "grid grid-cols-1 gap-[10px] min-[400px]:grid-cols-2 min-[400px]:gap-x-[11px] min-[400px]:gap-y-[10px]";

export const MODAL_MOBILE_SLIDER =
  "shrink-0 border-b border-[#ece3df]/50 bg-[rgba(207,83,116,0.04)] py-2 lg:hidden";

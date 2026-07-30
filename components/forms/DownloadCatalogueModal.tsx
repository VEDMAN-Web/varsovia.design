"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import ContactFormPanel from "@/components/forms/ContactFormPanel";
import { INQUIRY_COPY } from "@/components/forms/contactFormShared";
import { useModalScrollLock } from "@/hooks/useModalScrollLock";

type DownloadCatalogueModalProps = {
  open: boolean;
  onClose: () => void;
  images?: string[];
  downloadUrl?: string;
};

const SCROLL_AREA =
  "min-h-0 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

function ModalContent({
  onClose,
  images,
  downloadUrl,
}: Omit<DownloadCatalogueModalProps, "open">) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useModalScrollLock(true, dialogRef, scrollRef);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden bg-[rgba(37,27,30,0.55)] backdrop-blur-sm sm:items-center sm:p-4 md:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="relative grid h-[100dvh] max-h-[100dvh] w-full max-w-[1241px] grid-rows-[auto_1fr] overflow-hidden rounded-t-[20px] bg-[#fff3f2] shadow-[0_-8px_40px_rgba(37,27,30,0.18)] sm:h-[min(92dvh,900px)] sm:max-h-[92dvh] sm:rounded-[16px] sm:shadow-[0_12px_50px_rgba(37,27,30,0.22)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalogue-download-title"
      >
        {/* Top bar — fixed height, never scrolls away */}
        <div className="relative shrink-0 border-b border-[#ece3df]/60 px-4 pb-2.5 pt-2.5 sm:px-6 sm:pb-4 sm:pt-4 md:px-10">
          <div className="flex justify-center pt-1 sm:hidden">
            <div className="h-1 w-10 rounded-full bg-[#cfc4c6]" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#6a414d] shadow-sm transition hover:bg-[#f6eaea] sm:right-4 sm:top-4"
            aria-label="Close download form"
          >
            <X size={18} />
          </button>

          <p
            id="catalogue-download-title"
            className="font-outfit mx-auto max-w-[653px] pt-7 text-center text-[clamp(0.875rem,2.2vw,1.375rem)] font-medium leading-[1.4] text-[#6a414d] sm:pt-2 sm:leading-[1.5]"
          >
            &ldquo;{INQUIRY_COPY.catalogue.modalIntro}&rdquo;
          </p>
        </div>

        {/* Scrollable body — all form content */}
        <div ref={scrollRef} className={SCROLL_AREA} data-lenis-prevent>
          <ContactFormPanel
            images={images}
            purpose="catalogue"
            downloadUrl={downloadUrl}
            variant="modal"
          />
        </div>
      </div>
    </div>
  );
}

export default function DownloadCatalogueModal({
  open,
  onClose,
  images = [],
  downloadUrl,
}: DownloadCatalogueModalProps) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <ModalContent onClose={onClose} images={images} downloadUrl={downloadUrl} />,
    document.body
  );
}

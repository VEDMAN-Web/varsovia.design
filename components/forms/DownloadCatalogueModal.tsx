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

function ModalContent({
  onClose,
  images,
  downloadUrl,
}: Omit<DownloadCatalogueModalProps, "open">) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalScrollLock(true, dialogRef);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[rgba(37,27,30,0.55)] p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="relative flex max-h-[96vh] w-full max-w-[1241px] flex-col overflow-hidden rounded-[16px] bg-[#fff3f2] shadow-[0_12px_50px_rgba(37,27,30,0.22)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalogue-download-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#6a414d] shadow-sm transition hover:bg-[#f6eaea] sm:right-5 sm:top-5"
          aria-label="Close download form"
        >
          <X size={18} />
        </button>

        <div className="flex min-h-0 flex-col overflow-hidden px-5 pb-5 pt-7 sm:px-[55px] sm:pb-8 sm:pt-8">
          <p
            id="catalogue-download-title"
            className="font-outfit mx-auto max-w-[653px] shrink-0 text-center text-[clamp(1rem,2vw,1.375rem)] font-medium leading-[30px] text-[#6a414d]"
          >
            &ldquo;{INQUIRY_COPY.catalogue.modalIntro}&rdquo;
          </p>

          <div className="mt-6 min-h-0 flex-1 overflow-hidden sm:mt-[29px]">
            <ContactFormPanel
              images={images}
              purpose="catalogue"
              downloadUrl={downloadUrl}
              variant="modal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Figma 4:4690 — locked overlay, form fully visible incl. submit */
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

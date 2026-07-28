"use client";

import { RefObject, useEffect } from "react";
import { useLenis } from "lenis/react";

/** Lock page scroll (incl. Lenis) while a modal is open; block wheel/touch outside the dialog */
export function useModalScrollLock(
  open: boolean,
  dialogRef: RefObject<HTMLElement | null>
) {
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;

    lenis?.stop();

    const scrollY = window.scrollY;
    const { style: bodyStyle } = document.body;
    const { style: htmlStyle } = document.documentElement;

    const prev = {
      bodyOverflow: bodyStyle.overflow,
      htmlOverflow: htmlStyle.overflow,
      bodyPosition: bodyStyle.position,
      bodyTop: bodyStyle.top,
      bodyWidth: bodyStyle.width,
      bodyTouchAction: bodyStyle.touchAction,
    };

    bodyStyle.overflow = "hidden";
    htmlStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";
    bodyStyle.touchAction = "none";

    const blockBackgroundScroll = (e: Event) => {
      const dialog = dialogRef.current;
      const target = e.target as Node | null;
      if (dialog && target && dialog.contains(target)) return;
      e.preventDefault();
    };

    window.addEventListener("wheel", blockBackgroundScroll, { passive: false });
    window.addEventListener("touchmove", blockBackgroundScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", blockBackgroundScroll);
      window.removeEventListener("touchmove", blockBackgroundScroll);

      bodyStyle.overflow = prev.bodyOverflow;
      htmlStyle.overflow = prev.htmlOverflow;
      bodyStyle.position = prev.bodyPosition;
      bodyStyle.top = prev.bodyTop;
      bodyStyle.width = prev.bodyWidth;
      bodyStyle.touchAction = prev.bodyTouchAction;

      window.scrollTo(0, scrollY);
      lenis?.start();
    };
  }, [open, lenis, dialogRef]);
}

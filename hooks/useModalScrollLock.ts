"use client";

import { RefObject, useEffect } from "react";
import { useLenis } from "lenis/react";

function getScrollableAncestor(
  node: Node | null,
  root: HTMLElement
): HTMLElement | null {
  let el = node instanceof HTMLElement ? node : null;
  while (el && el !== root) {
    const { overflowY, overflowX } = getComputedStyle(el);
    const canScrollY =
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight + 1;
    const canScrollX =
      (overflowX === "auto" || overflowX === "scroll") &&
      el.scrollWidth > el.clientWidth + 1;
    if (canScrollY || canScrollX) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

function isVerticallyScrollable(el: HTMLElement) {
  return el.scrollHeight > el.clientHeight + 1;
}

/** Lock page scroll (incl. Lenis) while a modal is open; allow nested scroll inside the dialog */
export function useModalScrollLock(
  open: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  scrollRootRef?: RefObject<HTMLElement | null>
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

    const onWheel = (e: WheelEvent) => {
      const dialog = dialogRef.current;
      const target = e.target as Node | null;
      if (!dialog || !target || !dialog.contains(target)) {
        e.preventDefault();
        return;
      }

      const scrollRoot = scrollRootRef?.current;
      if (scrollRoot?.contains(target) && isVerticallyScrollable(scrollRoot)) {
        return;
      }

      if (getScrollableAncestor(target, dialog)) {
        return;
      }

      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      const dialog = dialogRef.current;
      const target = e.target as Node | null;
      if (!dialog || !target || !dialog.contains(target)) {
        e.preventDefault();
        return;
      }

      const scrollRoot = scrollRootRef?.current;
      if (scrollRoot?.contains(target) && isVerticallyScrollable(scrollRoot)) {
        return;
      }

      if (getScrollableAncestor(target, dialog)) {
        return;
      }

      e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);

      bodyStyle.overflow = prev.bodyOverflow;
      htmlStyle.overflow = prev.htmlOverflow;
      bodyStyle.position = prev.bodyPosition;
      bodyStyle.top = prev.bodyTop;
      bodyStyle.width = prev.bodyWidth;
      bodyStyle.touchAction = prev.bodyTouchAction;

      window.scrollTo(0, scrollY);
      lenis?.start();
    };
  }, [open, lenis, dialogRef, scrollRootRef]);
}

"use client";

import { RefObject, useEffect } from "react";
import { useOptionalLenis } from "@/components/providers/SmoothScroll";

function canScrollBox(el: HTMLElement) {
  const { overflowY, overflowX } = getComputedStyle(el);
  const canScrollY =
    (overflowY === "auto" || overflowY === "scroll") &&
    el.scrollHeight > el.clientHeight + 1;
  const canScrollX =
    (overflowX === "auto" || overflowX === "scroll") &&
    el.scrollWidth > el.clientWidth + 1;
  return canScrollY || canScrollX;
}

function getScrollableAncestor(
  node: Node | null,
  root?: HTMLElement | null
): HTMLElement | null {
  let el = node instanceof HTMLElement ? node : node?.parentElement ?? null;
  while (el && el !== document.body && el !== document.documentElement) {
    if (canScrollBox(el)) return el;
    if (root && el === root) break;
    el = el.parentElement;
  }
  return null;
}

function isVerticallyScrollable(el: HTMLElement) {
  return el.scrollHeight > el.clientHeight + 1;
}

/** Lock page scroll while a modal is open; allow nested scroll inside the dialog */
export function useModalScrollLock(
  open: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  scrollRootRef?: RefObject<HTMLElement | null>,
  options?: { overlay?: boolean },
) {
  const lenis = useOptionalLenis();
  const overlay = options?.overlay ?? false;

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
    if (!overlay) {
      bodyStyle.position = "fixed";
      bodyStyle.top = `-${scrollY}px`;
      bodyStyle.width = "100%";
    }
    bodyStyle.touchAction = "none";

    const onWheel = (e: WheelEvent) => {
      const target = e.target as Node | null;
      // Portaled menus (country picker) live outside the dialog — still allow their lists to scroll.
      if (getScrollableAncestor(target)) return;

      const dialog = dialogRef.current;
      if (!dialog || !target || !dialog.contains(target)) {
        e.preventDefault();
        return;
      }

      const scrollRoot = scrollRootRef?.current;
      if (scrollRoot?.contains(target) && isVerticallyScrollable(scrollRoot)) {
        return;
      }

      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      const target = e.target as Node | null;
      if (getScrollableAncestor(target)) return;

      const dialog = dialogRef.current;
      if (!dialog || !target || !dialog.contains(target)) {
        e.preventDefault();
        return;
      }

      const scrollRoot = scrollRootRef?.current;
      if (scrollRoot?.contains(target) && isVerticallyScrollable(scrollRoot)) {
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

      if (!overlay) {
        window.scrollTo(0, scrollY);
      }
      lenis?.start();
    };
  }, [open, lenis, dialogRef, scrollRootRef, overlay]);
}

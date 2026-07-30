"use client";

import { RefObject, useEffect, useState } from "react";
import { useLenis } from "lenis/react";

function parseRgb(color: string): [number, number, number] | null {
  const m = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function relativeLuminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function isDarkBackdrop(start: Element | null): boolean {
  let node: Element | null = start;

  while (node && node !== document.documentElement) {
    const explicit = node.getAttribute("data-nav-backdrop");
    if (explicit === "dark") return true;
    if (explicit === "light") return false;

    const tag = node.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "PICTURE") return true;

    if (node instanceof HTMLElement) {
      const style = getComputedStyle(node);
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== "none" && !bgImage.includes("gradient")) {
        return true;
      }

      const bg = style.backgroundColor;
      if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
        const rgb = parseRgb(bg);
        if (rgb) {
          const lum = relativeLuminance(rgb[0], rgb[1], rgb[2]);
          if (lum < 0.58) return true;
          if (lum > 0.78) return false;
        }
      }
    }

    node = node.parentElement;
  }

  return false;
}

/** Sample content under the fixed header — frosted bar when backdrop reads dark */
export function useNavBackdropTone(headerRef: RefObject<HTMLElement | null>) {
  const [overDark, setOverDark] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    let raf = 0;

    const sample = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const header = headerRef.current;
        if (!header || typeof document === "undefined") return;

        const rect = header.getBoundingClientRect();
        const x = Math.round(window.innerWidth * 0.5);
        const y = Math.min(window.innerHeight - 2, Math.max(0, rect.bottom + 6));

        const prev = header.style.pointerEvents;
        header.style.pointerEvents = "none";
        const target = document.elementFromPoint(x, y);
        header.style.pointerEvents = prev;

        setOverDark(isDarkBackdrop(target));
      });
    };

    sample();
    window.addEventListener("scroll", sample, { passive: true, capture: true });
    window.addEventListener("resize", sample);
    window.addEventListener("load", sample);

    const unsubscribeLenis = lenis?.on?.("scroll", sample);

    const mo = new MutationObserver(sample);
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "data-nav-backdrop"],
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", sample, true);
      window.removeEventListener("resize", sample);
      window.removeEventListener("load", sample);
      unsubscribeLenis?.();
      mo.disconnect();
    };
  }, [headerRef, lenis]);

  return overDark;
}

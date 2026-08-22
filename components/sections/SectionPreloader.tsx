"use client";

import { useEffect } from "react";

type PreloadImage = {
  src: string;
  priority?: "high" | "low";
};

type SectionPreloaderProps = {
  images: PreloadImage[];
};

/**
 * Preloads all section images immediately on page load.
 * Uses browser's native image preloading for instant display.
 */
export default function SectionPreloader({ images }: SectionPreloaderProps) {
  useEffect(() => {
    if (typeof window === "undefined" || !images.length) return;

    const preloadedImages: HTMLLinkElement[] = [];

    // Preload immediately (no delay)
    images.forEach(({ src, priority = "low" }) => {
      if (!src) return;

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      link.fetchPriority = priority;
      
      document.head.appendChild(link);
      preloadedImages.push(link);
    });

    return () => {
      preloadedImages.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [images]);

  return null;
}

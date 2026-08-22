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
 * Preloads critical section images while user is on hero.
 * Uses browser's native image preloading for zero lag.
 */
export default function SectionPreloader({ images }: SectionPreloaderProps) {
  useEffect(() => {
    if (typeof window === "undefined" || !images.length) return;

    const preloadedImages: HTMLLinkElement[] = [];

    // Delay preload slightly to not interfere with hero LCP
    const timer = setTimeout(() => {
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
    }, 800);

    return () => {
      clearTimeout(timer);
      preloadedImages.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [images]);

  return null;
}

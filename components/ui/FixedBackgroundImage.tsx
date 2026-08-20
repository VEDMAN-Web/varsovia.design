"use client";

import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type FixedBackgroundImageProps = {
  src: string;
  alt: string;
  /** Sizing/shape classes for the clip frame (height or aspect ratio, radius, border). */
  className?: string;
};

/**
 * Viewport-locked photo inside a scrolling clip frame (window reveal).
 * Avoids `background-attachment: fixed`, which `overflow-x: clip` on html/body breaks.
 */
export default function FixedBackgroundImage({
  src,
  alt,
  className = "",
}: FixedBackgroundImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media || reduceMotion) return;

    let ticking = false;
    let visible = true;

    const apply = () => {
      ticking = false;
      if (!visible) return;
      const rect = frame.getBoundingClientRect();
      media.style.right = "auto";
      media.style.bottom = "auto";
      media.style.width = `${window.innerWidth}px`;
      media.style.height = `${window.innerHeight}px`;
      media.style.transform = `translate3d(${-rect.left}px, ${-rect.top}px, 0)`;
    };

    const request = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) request();
      },
      { rootMargin: "25% 0px" },
    );
    io.observe(frame);

    apply();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });

    return () => {
      visible = false;
      io.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [reduceMotion, src]);

  return (
    <div
      ref={frameRef}
      className={`relative overflow-hidden ${className}`}
      role="img"
      aria-label={alt}
    >
      <div
        ref={mediaRef}
        className={
          reduceMotion
            ? "absolute inset-0"
            : "pointer-events-none absolute inset-0 will-change-transform"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="async"
          className="h-full w-full object-cover object-center select-none"
        />
      </div>
    </div>
  );
}

"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

type FixedBackgroundImageProps = {
  src: string;
  alt: string;
  /** Sizing/shape classes for the clip frame (height or aspect ratio, radius, border). */
  className?: string;
};

/**
 * Optimized viewport-locked parallax with minimal JavaScript.
 * Uses CSS transforms on GPU layer with passive scroll observation.
 */
export default function FixedBackgroundImage({
  src,
  alt,
  className = "",
}: FixedBackgroundImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const lastUpdate = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (reduceMotion) return;

    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    let isVisible = false;
    let rafId: number | null = null;

    // Apply transform only if values changed significantly (>1px)
    const updatePosition = () => {
      if (!isVisible || !container || !image) {
        rafId = null;
        return;
      }

      const rect = container.getBoundingClientRect();
      const x = Math.round(-rect.left);
      const y = Math.round(-rect.top);
      const w = Math.round(window.innerWidth);
      const h = Math.round(window.innerHeight);

      // Only update if changed by more than 1px (reduce repaints)
      const last = lastUpdate.current;
      if (
        Math.abs(x - last.x) > 1 ||
        Math.abs(y - last.y) > 1 ||
        Math.abs(w - last.width) > 1 ||
        Math.abs(h - last.height) > 1
      ) {
        // Use single composite transform for best performance
        image.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        image.style.width = `${w}px`;
        image.style.height = `${h}px`;
        lastUpdate.current = { x, y, width: w, height: h };
      }

      rafId = null;
    };

    // Schedule update only if not already scheduled
    const scheduleUpdate = () => {
      if (rafId === null && isVisible) {
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    // Intersection observer - only run when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          scheduleUpdate();
        } else if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { rootMargin: "100px" } // Start updating slightly before visible
    );

    observer.observe(container);
    
    // Use passive scroll listener for best performance
    const handleScroll = () => scheduleUpdate();
    const handleResize = () => scheduleUpdate();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Initial position
    scheduleUpdate();

    return () => {
      observer.disconnect();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
        role="img"
        aria-label={alt}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center select-none"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      role="img"
      aria-label={alt}
      style={{
        // Contain layout and paint to prevent reflows
        contain: 'layout paint',
      }}
    >
      <div
        ref={imageRef}
        className="absolute pointer-events-none"
        style={{
          // Initial position
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          // GPU acceleration
          transform: 'translate3d(0, 0, 0)',
          // Remove will-change to prevent constant GPU memory
          willChange: 'auto',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center select-none"
          style={{
            // Force GPU compositing only on image
            transform: 'translateZ(0)',
          }}
        />
      </div>
    </div>
  );
}

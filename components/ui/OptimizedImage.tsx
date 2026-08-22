"use client";

import { useEffect, useRef, useState } from "react";

type OptimizedImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
};

/**
 * Google-grade predictive image loading.
 * Starts loading images 100vh before they enter viewport.
 * Eliminates scroll lag from lazy loading.
 */
export default function OptimizedImage({
  src,
  alt,
  className = "",
  priority = false,
  style,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority);

  useEffect(() => {
    if (priority || shouldLoad) return;

    const img = imgRef.current;
    if (!img) return;

    // Predictive loading: start when image is 100vh away (before visible)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        // Load when 100vh (1 screen height) before entering viewport
        rootMargin: "100vh 0px 100vh 0px",
      }
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, [priority, shouldLoad]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={shouldLoad ? src : undefined}
      data-src={shouldLoad ? undefined : src}
      alt={alt}
      className={className}
      style={style}
      decoding="async"
      fetchPriority={priority ? "high" : "low"}
      onLoad={onLoad}
      onError={onError}
      draggable={false}
    />
  );
}
